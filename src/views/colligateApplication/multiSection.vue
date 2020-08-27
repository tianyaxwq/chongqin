<template>
  <div class="singlePage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>时间类型 :</span>
      <div class="layoutBox" style="width:100px">
        <el-select v-model="value" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in optionData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>时间选择 :</span>&nbsp;
      <div class="layoutBox" style="width:400px" v-show="value == 5">
        <sl-date-picker
          range-separator="至"
          v-model="value1"
          type="datetime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:00:00"
        ></sl-date-picker>
      </div>
      <div class="layoutBox" style="width:300px" v-show="value == 1">
        <sl-date-picker
          range-separator="至"
          v-model="dateRange"
          type="date"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></sl-date-picker>
      </div>
      <!-- <div class="layoutBox" style="width:250px" v-show="value == 2">
        <el-date-picker
          v-model="weekRange"
          type="daterange"
          align="left"
          range-separator="~"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>-->
      <div class="layoutBox" style="width:260px" v-show="value == 3">
        <sl-date-picker
          range-separator="至"
          v-model="month"
          type="month"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          format="yyyy-MM"
          value-format="yyyy-MM"
        ></sl-date-picker>
      </div>
      <div class="layoutBox" style="width:300px" v-show="value == 4">
        <sl-date-picker
          range-separator="至"
          v-model="yearTime"
          type="year"
          start-placeholder="开始年份"
          end-placeholder="结束年份"
          format="yyyy"
          value-format="yyyy"
        ></sl-date-picker>
      </div>&emsp;
      <span>监测项目 :</span>&nbsp;
      <div class="layoutBox" style="width:120px">
        <el-select v-model="factorModel" placeholder="请选择">
          <el-option
            v-for="item in factorData"
            :key="item.projectCode"
            :label="item.projectName"
            :value="item.projectCode"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <el-button @click="getEchartData">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </div>
    <div
      style="position:relative"
      class="currency-mode-wrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="loading-type-a"
      element-loading-background="rgba(255, 255, 255, 1)"
    >
      <div class="echartbox" id="echartbox" style="height: 100%" :style="!dataStatus?'opacity:1':'opacity:0'"></div>
      <yf-Datastatus :dataStatus="dataStatus" v-if="dataStatus == 'no'"></yf-Datastatus>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      value1: [],
      dateRange: [],
      factorModel: "",
      factorData: [
        {
          projectName: "CODmn",
          projectCode: "w01019"
        },
        {
          projectName: "溶解氧",
          projectCode: "w01009"
        },
        {
          projectName: "TN",
          projectCode: "w21001"
        },
        {
          projectName: "水温",
          projectCode: "w01010"
        },
        {
          projectName: "电导率",
          projectCode: "w01014"
        },
        {
          projectName: "浊度",
          projectCode: "w01003"
        },
        {
          projectName: "氨氮",
          projectCode: "w21003"
        },
        {
          projectName: "TP",
          projectCode: "w21011"
        },
        {
          projectName: "pH",
          projectCode: "w01001"
        },
        {
          projectName: "CODcr",
          projectCode: "w01018"
        }
      ],
      loading: true,
      colors: [
        "#e53ce6",
        "#297eff",
        "#1cad8b",
        "#00a3f5",
        "#1ebd1e",
        "#c2a100",
        "#e68320",
        "#ff4242",
        "#8e42ff",
        "#4258ff"
      ],
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
        学需氧量: "mg/L" //CODcr
      },
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      dataStatus: "",
      optionData: [
        { label: "小时", value: 5 },
        { label: "日", value: 1 },
        { label: "周", value: 2 },
        { label: "月", value: 3 },
        { label: "年", value: 4 }
      ],
      value: 5,
      yearTime: [],
      dateRange: [],
      weekRange: [],
      month: [],
      stationId: []
    };
  },
  created() {
    this.initTime();
  },
  methods: {
    initEchart(unit, legendData, xAxisData, yAxisData, seriesData) {
      let _this = this;
      let strTitle = "";
      _this.factorData.map(el => {
        if (this.factorModel == el.projectCode) {
          strTitle = el.projectName;
        }
      });
      var option = {
        title: {
          text: strTitle + "变化趋势分析图",
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
                " " +
                unit +
                "</p>";
            }
            return res;
          }
        },
        legend: {
          type: "scroll",
          data: legendData,
          y: "bottom",
          padding: [0, 100]
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
        yAxis: {
          type: "value",
          name: "监测值(" + unit + ")"
        },
        series: seriesData
      };
      //初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById("echartbox"));
      //使用制定的配置项和数据显示图表
      myChart.setOption(option);
      myChart.on("click", function(params) {
        console.log(params);
      });
    },
    selectChange(v) {
      if (v == 1) {
        // 日
        let startTime = new Date().setDate(new Date().getDate() - 3);
        let endTime = new Date();
        this.dateRange = [
          new Date(startTime).format("yyyy-MM-dd"),
          endTime.format("yyyy-MM-dd")
        ];
      } else if (v == 2) {
        // zhou
        let startTime = new Date().setDate(new Date().getDate() - 7);
        let endTime = new Date();
        this.weekRange = [
          new Date(startTime).format("yyyy-MM-dd"),
          endTime.format("yyyy-MM-dd")
        ];
      } else if (v == 3) {
        // yue
        let startTime = new Date().setMonth(new Date().getMonth() - 1);
        let endTime = new Date();
        this.month = [
          new Date(startTime).format("yyyy-MM"),
          endTime.format("yyyy-MM")
        ];
      } else if (v == 4) {
        // nian
        let startTime = new Date(new Date().getTime() - 3600 * 1000 * 24 * 365);
        let endTime = new Date(new Date().getTime());
        this.yearTime = [startTime.format("yyyy"), endTime.format("yyyy")];
      } else if (v == 5) {
        // 小时
        this.initTime();
      }
    },
    initTime() {
      //初始化时间
      let startTime = new Date(new Date().getTime() - 3600 * 1000 * 24 * 2);
      let endTime = new Date(new Date().getTime());
      this.value1 = [startTime, endTime];
    },
    //获取所有监测项目
    getFactor() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationId.join(",")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.factorData = [];
            res.data.content.dataList.map(el => {
              this.factorData.push({
                projectName: el.monitoring_factor_nm,
                projectCode: el.cd
              });
            });
            if(this.factorData.length > 0) {
              this.factorModel = this.factorData[0].projectCode;
            }
            this.getEchartData();
          } else {
            this.factorModel = ""
            this.factorData = [];
            this.dataStatus = "no";
          }
        })
        .catch(error => {});
    },
    getEchartData() {
      if (
        (this.dateRange[0] != null && this.dateRange[1] != null) ||
        (this.value1[0] != null && this.value1[1] != null) ||
        (this.yearTime[0] != null && this.yearTime[1] != null) ||
        (this.month[0] != null && this.month[1] != null)
      ) {
        this.loading = true;
        this.dataStatus = "";
        let startTime = "";
        let endTime = "";
        let type = "";
        if (this.value == 1) {
          startTime = this.dateRange[0];
          endTime = this.dateRange[1];
          type = "day";
        } else if (this.value == 2) {
          startTime = this.weekRange[0];
          endTime = this.weekRange[1];
          type = "week";
        } else if (this.value == 3) {
          startTime = this.month[0];
          endTime = this.month[1];
          type = "month";
        } else if (this.value == 4) {
          startTime = this.yearTime[0];
          endTime = this.yearTime[1];
          type = "year";
        } else if (this.value == 5) {
          startTime = new Date(this.value1[0]).format("yyyy-MM-dd hh");
          endTime = new Date(this.value1[1]).format("yyyy-MM-dd hh");
          type = "hour";
        }
        this.$http
          .get("/Statistics-Service/dataCharts/moreStationOneFactorCharts", {
            params: {
              stationCode: this.stationId.join(","), //站点编码（mn）'40000000000001'
              factorCode: this.factorModel, //因子参数（编码）'w01019'
              startTime: startTime, //开始时间
              endTime: endTime, //结束时间
              type: type
            }
          })
          .then(res => {
            this.loading = false;
            const myChart = this.$echarts.init(document.getElementById("echartbox"));
            //使用制定的配置项和数据显示图表
            myChart.clear();
            if (!res.data.content) {
              this.dataStatus = "no";
              return false;
            } else {
              this.dataStatus = "";
            }
            let obj = res.data.content.info;
            this.legendData = obj.legend;
            this.xAxisData = obj.xAxis;
            this.yAxisData = [];
            this.seriesData = [];
            let yArr = res.data.content.info.series;
            if (yArr && yArr.length > 0) {
              for (let i = 0; i < yArr.length; i++) {
                //根据因子数添加绘图数据seriesData
                this.seriesData.push({
                  name: yArr[i].code,
                  type: "line",
                  data: yArr[i].data,
                  itemStyle: {
                    color: this.colors[i]
                  },
                  markPoint: {
                    data: [
                      { type: "max", name: "最大值" },
                      { type: "min", name: "最小值" }
                    ]
                  }
                });
              }
              let unit = obj.series[0].unit ? obj.series[0].unit : '';
              this.initEchart(
                unit,
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
    }
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    },
    detailTree: {
      get: function() {
        return this.$store.state.detailTree;
      }
    }
  },
  watch: {
    stationInfo(value) {
      this.stationId = [];
      if (value.length > 0) {
        for (let i in value) {
          this.stationId.push(value[i].nodeId);
        }
      }
      this.getFactor();
    },
    detailTree(value) {
      //监听站点树开启关闭重新绘图
      const myChart = this.$echarts.init(document.getElementById("echartbox"));
      setTimeout(() => {
        myChart.resize();
      }, 300);
    }
  }
};
</script>

<style scope lang="less">
.singlePage {
  .echartbox {
    margin-top: 5px;
    height: 680px;
  }
}
</style>
