<template>
  <!--自动站单站报表-->
  <div class="single-station-report-page">
    <div class="secondary-page-mode">
      <div class="secondary-toolbar">
        <span>数据类型：</span>
        <el-button-group>
          <el-button
            :class="{active:dataType === index}"
            size="small"
            type="primary"
            plain
            :key="index"
            v-for="(item,index) in dataTypeList"
            @click="dataTypeToggle(index)"
          >{{ item.name }}</el-button>
        </el-button-group>&emsp;
        <span>时间段：</span>
        <div class="layoutBox" style="width:300px">
          <sl-date-picker
            range-separator="至"
            v-model="dataValue"
            :type="headtimetype"
            :format="headtimeformat"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="headtimevalueformat"
          ></sl-date-picker>
        </div>&emsp;
        <el-button @click="getFactor">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div
        class="currency-mode-wrap"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-scrollbar class="currency-mode-scroll">
          <h4 class="report-form-title">{{headtitle}}</h4>
          <p class="report-form-subtitle">{{statisDate}}</p>
          <div class="report-table-wrap" style="position: relative;">
            <el-table :data="tableData" border ref="table" style="width: 100%">
              <el-table-column type="index" label="序号" fixed></el-table-column>
              <el-table-column prop="time" label="时间" fixed width="150">
                <template slot-scope="scope">
                  {{scope.row.time || '--'}}
                </template>
              </el-table-column>
              <el-table-column prop="level" label="水质类别" fixed>
                <template slot-scope="scope">
                  <span v-if="scope.row.level == '-' || !scope.row.level">--</span>
                  <span
                    v-else
                    class="target-level"
                    :class="'colorValue' + (scope.row.level == 'I类' ? 0 : scope.row.level == 'II类' ? 1 : scope.row.level == 'III类' ? 2 : scope.row.level == 'IV类' ? 3 : scope.row.level == 'V类' ? 4 : scope.row.level == '劣V类' ? 5 : '')"
                  >{{scope.row.level.substring(0, scope.row.level.length - 1)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="index"
                v-for="(item,index) in headcolumn"
                :label="item.monitoring_factor_nm"
              >
                <el-table-column :label="item.monitoring_factor_dw">
                  <template slot-scope="scope">
                    <span v-if="scope.row[item.cd]">{{scope.row[item.cd]}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
             <yf-Datastatus :dataStatus="dataStatus" v-if="dataStatus == 'no'"></yf-Datastatus>
            <div style="height:400px;margin-top:20px;" id="echartbox" :style="!dataStatus?'opacity:1':'opacity:0'"></div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../../assets/js/dateformat";
import { exportTableData } from "../../assets/js/tableExport";
let dataTypeList = [
  {
    name: "日报",
    type: "date"
  },
  // {
  //   name: "周报",
  //   type: "week"
  // },
  {
    name: "月报",
    type: "month"
  },
  {
    name: "年报",
    type: "year"
  }
];
let pickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};

export default {
  name: "singleStationReport",
  data() {
    return {
      dataStatus: "no",
      yearStart: "2018",
      yearEnd: "2019",
      reportLoading: true,
      reportNoDataState: false,
      dataTypeList, //数据类型
      dataType: 0, //数据类型选中下标
      pickerOptions, //时间快捷菜单数据
      dataValue: "", //时间绑定数据
      tableData: [], //表格数据,
      stationInfo: {},
      headcolumn: [],
      headtitle: "",
      statisDate: "",
      headtimetype: "date",
      loading: true,
      fieldList: [],
      headtimeformat: "yyyy-MM-dd",
      headtimevalueformat: "yyyy-MM-dd",
      format: "",
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      colors: {
        w01010: "#e53ce6", //水温
        w01009: "#297eff", //溶解氧
        w01003: "#1cad8b", //浑浊度
        w01014: "#00a3f5", //电导率
        w01019: "#1ebd1e", //高锰酸盐指数
        w21003: "#c2a100", //氨氮
        w21011: "#e68320", //总磷
        w21001: "#ff4242", //总氮
        w01001: "#8e42ff", //PH
        w01018: "#4258ff" //CODcr
      },
      unit: {
        水温: "℃", //水温
        溶解氧: "mg/L", //溶解氧
        浊度: "NTU", //浑浊度
        电导率: "μS/cm", //电导率
        高锰酸盐指数: "mg/L", //高锰酸盐指数
        氨氮: "mg/L", //氨氮
        总磷: "mg/L", //总磷
        总氮: "mg/L", //总氮
        PH: "", //PH
        化学需氧量: "mg/L" //CODcr
      },
      factors: []
    };
  },
  methods: {
    initEchart(legendData, xAxisData, yAxisData, seriesData) {
      let _this = this;
      var option = {
        title: {
          text: "因子变化趋势",
          x: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let res = params[0].axisValue + "<br/>";
            for (let i = 0; i < params.length; i++) {
              var value = params[i].value == undefined ? "-" : params[i].value;
              res +=
                "<p>" +
                params[i].seriesName +
                " : " +
                value +
                "" +
                _this.unit[params[i].seriesName] +
                "</p>";
            }
            return res;
          }
        },
        legend: {
          data: legendData,
          y: "bottom"
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData
        },
        // yAxis: yAxisData,
        yAxis: {
          type: "value"
        },

        series: seriesData
      };
      //初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("echartbox"));

      //使用制定的配置项和数据显示图表
      myChart.setOption(option);
      myChart.on("click", function(params) {
        console.log(params);
      });
    },
    dataTypeToggle(index) {
      this.dataType = index;
      if (index == 0) {
        this.headtimetype = "date";
        this.headtimeformat = "yyyy-MM-dd";
        this.headtimevalueformat = "yyyy-MM-dd";
        this.initTime();
      } else if (index == 1) {
        this.headtimetype = "month";
        this.headtimeformat = "yyyy-MM";
        this.headtimevalueformat = "yyyy-MM";
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
        let d = new Date(start).format("yyyy");
        let c = new Date(end).format("yyyy");
        this.dataValue = [d, c];
      } else if (index == 2) {
        this.headtimetype = "year";
        this.headtimeformat = "yyyy";
        this.headtimevalueformat = "yyyy";
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
        let d = new Date(start).format("yyyy");
        let c = new Date(end).format("yyyy");
        this.dataValue = [d, c];
      }
    },
    initTime() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      let d = new Date(start).format("yyyy-MM-dd");
      let c = new Date(end).format("yyyy-MM-dd");
      this.dataValue = [d, c];
    },
    initTitle() {
      if (this.headtimetype == "date") {
        this.headtitle = this.stationInfo.nodeName + "单站日报";
        this.statisDate = this.dataValue[0] + " 至 " + this.dataValue[1];
      } else if (this.headtimetype == "month") {
        this.headtitle = this.stationInfo.nodeName + "单站月报";
        this.statisDate = this.dataValue[0] + " 至 " + this.dataValue[1];
      } else if (this.headtimetype == "year") {
        this.headtitle = this.stationInfo.nodeName + "单站年报";
        this.statisDate = this.yearStart + " 至 " + this.yearEnd;
      } else if (this.headtimetype == "week") {
        this.headtitle = this.stationInfo.nodeName + "单站周报";
        this.statisDate = new Date(this.dataValue).format("yyyy-MM-dd");
      }
    },
    //获取表格数据
    getTableData() {
      if (this.dataValue[0] != null && this.dataValue[1] != null) {
        this.loading = true;
        let d = "";
        let timeType = "";
        let weekSatrt = "";
        let weekEnd = "";
        if (this.headtimetype == "date") {
          timeType = "day";
        } else if (this.headtimetype == "month") {
          timeType = "month";
        } else if (this.headtimetype == "year") {
          timeType = "year";
        } else if (this.headtimetype == "week") {
          let now = new Date(this.dataValue);
          let nowTime = now.getTime();
          let day = now.getDay();
          let oneDayTime = 24 * 60 * 60 * 1000;
          let MondayTime = nowTime - day * oneDayTime; //显示周一
          let SundayTime = nowTime + (6 - day) * oneDayTime; //显示周日
          weekSatrt = new Date(MondayTime).format("yyyy-MM-dd");
          weekEnd = new Date(SundayTime).format("yyyy-MM-dd");
          timeType = "week";
        }
        this.initTitle();
        this.$http
          .get("/Statistics-Service/statisticalReports/singleStationReport", {
            params: {
              timeType: timeType,
              stationMn: this.stationInfo.nodeId,
              startTime: this.dataValue[0],
              endTime: this.dataValue[1],
              factorList: this.factors.join(",")
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.tableData = res.data.content.dataList;
            }
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
          });
        this.$http
          .get(
            "/Statistics-Service/statisticalReports/singleStationReportCharts",
            {
              params: {
                timeType: timeType,
                stationMn: this.stationInfo.nodeId,
                startTime: this.dataValue[0],
                endTime: this.dataValue[1],
                factorList: this.factors.join(",")
              }
            }
          )
          .then(res => {
            let obj = res.data.content.info;
            if (obj.series.length == 0) {
              this.dataStatus = "no";
              return false;
            } else {
              this.dataStatus = "";
            }
            this.legendData = [];
            this.xAxisData = obj.xAxis;
            this.yAxisData = [];
            this.seriesData = [];
            let yArr = res.data.content.info.series;
            if (yArr && yArr.length > 0) {
              for (let i = 0; i < yArr.length; i++) {
                //根据因子数量，添加Y轴，Y轴分布为左右两边最多各五条
                // if (i < 5) {
                //   this.yAxisData.push({
                //     type: "value",
                //     name: "",
                //     position: "left",
                //     offset: 35 * i,
                //     axisLine: {
                //       lineStyle: {
                //         color: this.colors[yArr[i].code]
                //       }
                //     }
                //   });
                // } else {
                //   this.yAxisData.push({
                //     type: "value",
                //     name: "",
                //     position: "right",
                //     offset: 35 * (i - 5),
                //     axisLine: {
                //       lineStyle: {
                //         color: this.colors[yArr[i].code]
                //       }
                //     }
                //   });
                // }
                this.legendData.push(yArr[i].name);
                //根据因子数添加绘图数据seriesData
                this.seriesData.push({
                  name: yArr[i].name,
                  type: "line",
                  data: yArr[i].data,
                  // yAxisIndex: i,
                  itemStyle: {
                    color: this.colors[yArr[i].code]
                  }
                });
              }
              this.initEchart(
                this.legendData,
                this.xAxisData,
                this.yAxisData,
                this.seriesData
              );
            }
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    //获取所有监测项目
    getFactor() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationInfo.nodeId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.headcolumn = res.data.content.dataList;
            let factorList = [];
            this.headcolumn.map(el => {
              factorList.push(el.cd);
            });
            this.factors = factorList;
            this.getTableData();
          } else {
            this.headcolumn = [];
          }
        })
        .catch(error => {
          this.headcolumn = [];
        });
    },
    //导出报表
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = this.headtitle;
      let d = "";
      let timeType = "";
      let weekSatrt = "";
      let weekEnd = "";
      if (this.headtimetype == "date") {
        d = "yyyy-MM-dd";
        timeType = "day";
      } else if (this.headtimetype == "month") {
        d = "yyyy-MM";
        timeType = "month";
      } else if (this.headtimetype == "year") {
        d = "yyyy";
        timeType = "year";
      } else if (this.headtimetype == "week") {
        let now = new Date(this.dataValue);
        let nowTime = now.getTime();
        let day = now.getDay();
        let oneDayTime = 24 * 60 * 60 * 1000;
        let MondayTime = nowTime - day * oneDayTime; //显示周一
        let SundayTime = nowTime + (6 - day) * oneDayTime; //显示周日
        weekSatrt = new Date(MondayTime).format("yyyy-MM-dd");
        weekEnd = new Date(SundayTime).format("yyyy-MM-dd");
        timeType = "week";
      }
      this.fieldList = ["time", "level"];
      for (let i = 0; i < this.headcolumn.length; i++) {
        this.fieldList.push(this.headcolumn[i].cd);
      }

      let params = {
        headerProp: this.fieldList.join(","),
        timeType: timeType,
        time: d,
        stationMn: this.stationInfo.nodeId,
        startTime: this.dataValue[0],
        endTime: this.dataValue[1],
        factorList: this.factors.join(",")
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/singleStationReportExcel",
        params
      );
    }
  },
  mounted() {},
  created() {
    this.initTime();
  },
  components: {},
  computed: {
    station() {
      return this.$store.state.stationInfo;
    }
  },
  watch: {
    station(value) {
      if (value.length > 0) {
        this.stationInfo = value[0];
        this.getFactor();
      }
    }
  },
  destroy() {}
};
</script>

<style scoped lang="less">
.no-box {
  top: 120px !important;
}
.single-station-report-page {
  height: 100%;
  .currency-mode-wrap {
    height: calc(100% - 56px);
  }
  .currency-mode-scroll {
    height: 100%;
  }
  .report-form-title {
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    text-align: center;
    margin-top: 12px;
  }
  .report-form-subtitle {
    text-align: center;
    line-height: 24px;
    height: 24px;
  }
  .report-table-wrap {
    padding: 10px 34px 0;
  }
}
</style>
