<template>
  <!-- 历史数据 -->
  <div class="historical-data">
    <div class="toolbar-wrap">
      <span>时间段：</span>
      <div class="layoutBox" style="width: 400px;">
        <sl-date-picker
          range-separator="至"
          v-model="dataValue"
          type="datetime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></sl-date-picker>
      </div>
      <span v-if="radio==='2'">监测因子：</span>
      <div class="layoutBox" style="width:110px" v-if="radio==='2'">
        <el-select v-model="factorModel" placeholder="请选择">
          <el-option
            v-for="item in optionData"
            :key="item.str"
            :label="item.label"
            :value="item.str"
          ></el-option>
        </el-select>
      </div>
      <el-button @click="searchTableChart">
        <i class="iconfont icon-sousuo"></i> 查询
      </el-button>
      <el-button-group>
        <el-button
          size="small"
          type="primary"
          plain
          @click="dataTypeToggle('1')"
          :class="{active:radio === '1'}"
        >列表</el-button>
        <el-button
          size="small"
          type="primary"
          plain
          @click="dataTypeToggle('2')"
          :class="{active:radio === '2'}"
        >图表</el-button>
      </el-button-group>
    </div>
    <div class="historical-content">
      <!-- <div class="content-toolbar">
        <el-radio v-model="radio" label="1">列表</el-radio>
        <el-radio v-model="radio" label="2">图表</el-radio>
      </div>-->
      <div
        v-show="radio==='1'"
        class="normal-table-wrap"
        v-loading="tableLoading"
        empty-text
        element-loading-text="拼命加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <!--<div v-if="tableLoading" class="loading-wrap"></div>-->
        <!-- <div v-if="tableNoDataState" class="no-data-wrap small no-data-table">
          <p>暂无数据</p>
        </div>-->
        <div class="table-wrap" style="height: calc(100% - 35px);">
          <el-table ref="singleTable" :data="tableData" border empty-text=" " height="100%">
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="spt" label="时间" width="160">
              <template slot-scope="scope">
                <span>{{scope.row.spt == "null" || !scope.row.spt ? "--" : scope.row.spt}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="index"
              v-for="(item,index) in headcolumn"
              :prop="item.value"
              :width="setWidth(item.label)"
              :label="item.label"
            >
              <template slot-scope="scope">
                <span>{{scope.row[item.value] == "null" || !scope.row[item.value] ? "--" : scope.row[item.value]}}</span>
              </template>
              <!-- <el-table-column :width="setWidth(item.label)" :label="item.str">
                
              </el-table-column>-->
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationBox">
          <el-pagination
            @size-change="paginationSizeChange"
            @current-change="paginationChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            background
            :small="true"
            popper-class="select-common-option"
            :page-sizes="pageList"
            layout="total,sizes,->,prev, pager, next, jumper"
            :total="totalRecords"
          >
            <!--<span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>-->
          </el-pagination>
        </div>
      </div>
      <div
        v-show="radio==='2'"
        class="chart-content"
        v-loading="chartLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <!--<div v-if="chartLoading" class="loading-wrap"></div>-->
        <div v-if="chartNoDataState" class="no-data-wrap small">
          <p>暂无数据</p>
        </div>
        <div id="factor-historical-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import {formatDate} from '../../dateformat.js'

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
  name: "historicalData",
  watch: {
    radio(val) {
      if (val === "2") {
        setTimeout(this.searchTableChart, 100);
      }
    }
  },
  data() {
    return {
      factorModel: "",
      optionData: [],
      tableLoading: false,
      tableNoDataState: false,
      chartLoading: false,
      chartNoDataState: false,
      dataType: 0,
      dataTypeList: [
        {
          name: "小时数据",
          type: "hour"
        },
        {
          name: "日数据",
          type: "day"
        }
      ],
      dataValue: "",
      pickerOptions,
      equipId: null,
      radio: "1",
      tableData: [],
      headcolumn: [],
      headcolumnA: [
        // { value: "codmn", label: "CODmn（mg/L）", str: "≤10" },
        // { value: "tp", label: "TP（mg/L）", str: "≤0.3" },
        // { value: "tn", label: "TN（mg/L）", str: "≤1.5" },
        // { value: "nh3n", label: "氨氮（mg/L）", str: "≤1.5" },
        // { value: "ph", label: "pH（无量纲）", str: "6~9" },
        // { value: "wt", label: "水温（℃）", str: "--" },
        // { value: "dox", label: "溶解氧（mg/L）", str: "≥3" },
        // { value: "cond", label: "电导率（μS/cm）", str: "--" },
        // { value: "turb", label: "浊度（NTU）", str: "--" },
        // { value: "codcr", label: "CODcr（mg/L）", str: "≤30" }
      ],
      colors: {
        wt: "#e53ce6", //水温
        dox: "#297eff", //溶解氧
        turb: "#1cad8b", //浑浊度
        cond: "#00a3f5", //电导率
        codmn: "#1ebd1e", //高锰酸盐指数
        nh3n: "#c2a100", //氨氮
        tp: "#e68320", //总磷
        tn: "#ff4242", //总氮
        ph: "#8e42ff", //PH
        CODcr: "#4258ff" //CODcr
      },
      unit: {
        水温: "℃", //水温
        溶解氧: "mg/L", //溶解氧
        浊度: "NTU", //浑浊度
        电导率: "μS/cm", //电导率
        CODmn: "mg/L", //高锰酸盐指数
        氨氮: "mg/L", //氨氮
        TP: "mg/L", //总磷
        TN: "mg/L", //总氮
        pH: "无量纲", //PH
        CODcr: "mg/L" //CODcr
      },
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      headcolumnB: [
        { value: "ph", label: "pH（无量纲）" },
        { value: "codcr", label: "CODcr（CODcr）" },
        { value: "nh3n", label: "氨氮（mg/L）" },
        { value: "tp", label: "总磷（mg/L）" },
        { value: "tn", label: "总氮（mg/L）" }
      ],
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [10, 15, 25], //设置每页多少条
      stationType: "",
      tableHeadData: []
    };
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    },
    stationMn: {
      get: function() {
        return this.$store.state.siteMn;
      }
    }
  },
  methods: {
    // 计算表格单元格宽度
    setWidth(str) {
      if (str) {
        let num = str.length;
        return num * 14 + 20 > 104 ? num * 14 + 20 : 104;
      }
    },
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
      this.historicalDataSearch();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.historicalDataSearch();
    },
    setWidth(str) {
      if (str) {
        let num = str.length;
        return num * 13 + 20 > 104 ? num * 13 + 20 : 104;
      }
    },
    getpropertys(item) {
      return "projects." + item.projectCode + ".value";
    },
    searchData(equipId) {
      this.equipId = equipId;
      // this.searchcolumn();
    },
    convertDateFromString(dateString) {
      if (dateString) {
        var date = new Date(dateString.replace(/-/, "/"));
        return date;
      }
    },
    initTime() {
      var date = new Date();
      var ndate = this.convertDateFromString(date.format("yyyy-MM-dd"));
      var datearr = [];
      datearr.push(
        new Date(ndate.getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd"),
        new Date(ndate.getTime() + 3600 * 1000).format("yyyy-MM-dd")
      );
      this.dataValue = datearr;
      this.getTabelHeadData();
    },
    // 列表 图表切换
    dataTypeToggle(index) {
      this.radio = index;
    },
    // 获取表头数据
    getTabelHeadData() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationMn.stationCode
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.headcolumn = [];
            this.optionData = [];
            res.data.content.dataList.map((el, index) => {
              this.headcolumn.push({
                value: el.cd,
                label: el.monitoring_factor_dw ? el.monitoring_factor_nm + "（" + el.monitoring_factor_dw + "）" : el.monitoring_factor_nm
              });
              this.optionData.push({
                label: el.monitoring_factor_nm,
                str: el.cd,
                isTrue: index == 0 ? true : false
              });
            });
            this.historicalDataSearch();
            this.factorModel = this.optionData[0].str;
          } else {
            this.headcolumn = [];
          }
        })
        .catch(error => {
          this.headcolumn = [];
        });
    },
    searchTableChart() {
      if (this.radio === "1") {
        this.getTabelHeadData();
      } else {
        this.factorChangeTrend();
      }
    },
    historicalDataSearch() {
      if (this.dataValue[0] != null && this.dataValue[1] != null) {
        this.tableLoading = true;
        this.$http
          .get("/dataHandle/yunliBase/waterHistoryData", {
            params: {
              startTime: new Date(this.dataValue[0]).format('yyyy-MM-dd hh:mm:ss'),
              endTime: new Date(this.dataValue[1]).format('yyyy-MM-dd hh:mm:ss'),
              mns: this.stationMn.stationCode, //this.stationId
              pageNum: this.currentPage,
              pageSize: this.pageSize
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.content.dataList;
              this.totalRecords = res.data.content.totalRecords;
              this.tableLoading = false;
              if (this.tableData && this.tableData.length) {
                this.tableNoDataState = false;
              } else {
                this.tableNoDataState = true;
              }
            }
          })
          .catch(error => {});
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    factorChangeTrend() {
      let _this = this;
      this.chartLoading = true;
      var paramsp = {
        mn: this.stationMn.stationCode,
        startTime: this.dataValue[0],
        endTime: this.dataValue[1],
        factor: this.factorModel
      };
      this.$http
        .get("/dataHandle/yunliBase/waterHistoryDataLine", {
          params: paramsp
        })
        .then(response => {
          if (response.data.code === 0) {
            let obj = response.data.content.info;
            this.legendData = obj.legend;
            this.xAxisData = obj.xAils;
            this.yAxisData = [];
            this.seriesData = [];
            let yArr = response.data.content.info.series;
            if (yArr && yArr.length > 0) {
              for (let i = 0; i < yArr.length; i++) {
                //根据因子数添加绘图数据seriesData
                this.seriesData.push({
                  name: yArr[i].name,
                  type: "line",
                  data: yArr[i].data,
                  // yAxisIndex: i,
                  itemStyle: {
                    color: this.colors[yArr[i].code]
                  },
                  markPoint: {
                    data: [
                      { type: "max", name: "最大值" },
                      { type: "min", name: "最小值" }
                    ]
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
          }
          this.chartLoading = false;
          if (this.seriesData && this.seriesData.length) {
            this.chartNoDataState = false;
          } else {
            this.chartNoDataState = true;
          }
        })
        .catch(error => {
          this.chartLoading = false;
        });
    },
    initEchart(legendData, xAxisData, yAxisData, seriesData) {
      let _this = this;
      var option = {
        title: {
          text: "变化趋势分析图",
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
          show: false,
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
      var myChart = this.$echarts.init(
        document.getElementById("factor-historical-chart")
      );

      //使用制定的配置项和数据显示图表
      myChart.setOption(option);
      myChart.on("click", function(params) {
        console.log(params);
      });
    }
  },
  mounted() {
    this.initTime();
    if (this.stationMn.stationType) {
      this.stationType = this.stationMn.stationType;
    } else {
      this.stationType = "001";
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .el-button-group {
  float: right;
}
/deep/ .el-table__body-wrapper {
  height: calc(100% - 60px) !important;
}
.historical-data {
  height: 466px;
  padding: 0 8px;
  .toolbar-wrap {
    padding: 4px;
    line-height: 30px;
    /deep/ .sl-data-picker .data-picker-wrap {
      width: calc(49% - 20px);
    }
  }
  .content-toolbar {
    padding: 4px 0 8px 0;
  }
  .normal-table-wrap,
  .chart-content {
    height: 418px;
    position: relative;
    .chartUl {
      position: absolute;
      right: 20px;
      z-index: 99;
      // > li {
      //   display: inline-block;
      //   padding: 5px 10px;
      //   font-size: 12px;
      //   color: #1a1a1a;
      //   cursor: pointer;
      //   border: 1px solid rgba(199, 209, 223, 1);
      //   &:not(:nth-of-type(1)) {
      //     border-left: none;
      //   }
      // }
      // .active {
      //   color: #ffffff;
      //   background-color: #1f82f4;
      // }
    }
  }
  #factor-historical-chart {
    height: 100%;
    width: 754px;
  }
  .no-data-table {
    > p {
      &::before {
        background: none;
      }
    }
  }
  .no-data-table.no-data-wrap p {
    top: 150px;
  }
  .no-data-chart.no-data-wrap p {
    top: 98px;
  }
}
</style>
