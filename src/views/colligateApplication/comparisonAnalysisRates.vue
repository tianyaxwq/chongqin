<template>
  <!-- 两率对比分析 -->
  <div class="comparison-analysis-rates-page">
    <!-- <div class="analysis-object-tree-warp">
        <water-radio-tree></water-radio-tree>
    </div>-->
    <div class="secondary-page-content">
      <el-scrollbar class="page-content-scroll">
        <div class="secondary-scroll-content clear">
          <!-- 工具栏部分 -->
          <div class="secondary-toolbar">
            <span>时间段：</span>
            <el-button-group>
              <el-button
                :class="{active:dataType === index}"
                size="small"
                type="primary"
                plain
                :key="index"
                v-for="item,index in dataTypeList"
                @click="dataTypeToggle(index,item)"
              >{{ item.name }}</el-button>
            </el-button-group>
            <div class="layoutBox" style="width:242px">
              <el-date-picker
                v-model="dataValue"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                format="yyyy-MM-dd"
                prefix-icon="el-icon-date"
                :disabled="custom"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </div>&emsp;
            <el-button @click="searchData">
              <i class="iconfont icon-sousuo"></i>查询
            </el-button>
          </div>
          <!-- 数据上传率模块 -->
          <div class="currency-mode-wrap">
            <h4 class="currency-mode-title">
              <i class="mode-title-icon"></i> 数据上传率
              <span class="mode-title-line"></span>
            </h4>
            <div class="secondary-mode-content clear">
              <div
                class="data-upload-rate-chart"
                v-loading="loadingOne"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <div id="upload-rate-ranking"></div>
              </div>
              <div class="data-upload-rate-table">
                <h4 class="contrast-title">上传率排名列表</h4>
                <div class="upload-rate-table-wrap">
                  <el-table
                    :data="tableData"
                    border
                    height="251px"
                    style="width: 100%"
                    v-loading="loadingTwo"
                    element-loading-text="加载中"
                    element-loading-spinner="loading-type-a"
                    element-loading-background="rgba(255, 255, 255, 1)"
                  >
                    <el-table-column prop="ranking" label="排名" align="center" width="50">
                      <template slot-scope="scope">
                        <span
                          class="ranking-icon"
                          :class="setRankingCls(scope.row.ranking)"
                        >{{ scope.row.ranking }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="站点名称"></el-table-column>
                    <el-table-column prop="uploadRate" label="上传率" width="100"></el-table-column>
                  </el-table>
                </div>
              </div>
              <p class="data-upload-analysis">
                <span class="upload-analysis-text">经统计分析：</span>
                <span>{{uploadfiestdiscrib}}</span>&emsp;&emsp;
              </p>
            </div>
          </div>
          <!-- 上传率同比模块 -->
          <div class="currency-mode-wrap year-on-year-modular">
            <h4 class="currency-mode-title">
              <i class="mode-title-icon"></i> 上传率同比
              <span class="mode-title-line"></span>
            </h4>
            <div
              class="secondary-mode-content"
              v-loading="loadingThree"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="upload-rate-year"></div>
            </div>
          </div>
          <!-- 上传率环比模块 -->
          <div class="currency-mode-wrap loop-ratio-module-modular">
            <h4 class="currency-mode-title">
              <i class="mode-title-icon"></i> 上传率环比
              <span class="mode-title-line"></span>
            </h4>
            <div
              class="secondary-mode-content"
              v-loading="loadingFour"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="upload-rate-ring-ratio"></div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../../assets/js/dateformat.js";
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
let dataTypeList = [
  {
    name: "日",
    type: "day"
  },
  {
    name: "月",
    type: "month"
  },
  {
    name: "年",
    type: "year"
  },
  {
    name: "自定义",
    type: "custom"
  }
];
let tableData = [];
export default {
  name: "comparisonAnalysisRates",
  watch: {},
  data() {
    return {
      loadingOne: true,
      loadingTwo: true,
      loadingThree: true,
      loadingFour: true,
      pickerOptions, //时间快捷菜单
      dataTypeList, //按钮组数据
      dataType: 0, //按钮选中下标
      dataValue: "", //时间绑定数据
      custom: false,
      tableData: [],
      rankingHistogram: "",
      uploadRateYear: "",
      uploadRateRatio: "",
      uploadfiestdiscrib: "--",
      stationId: "",
      openPage: "",
      timeType: "day"
    };
  },
  methods: {
    // getCheckedNodes(node){
    //   console.log(node);
    // },
    dataTypeToggle(index, item) {
      this.dataType = index;
      if (item.type === "custom") {
        this.timeType = "day";
        this.custom = false;
      } else {
        this.custom = true;
        this.dataValue = "";
      }
      var type = item.type;
      if (type == "month") {
        this.timeType = "month";
        var date = new Date();
        var datearr = [];
        var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var num = d.getDate();
        datearr.push(
          this.formatStrToDate(formatDate(date, "yyyy-MM-01 00:00:00")),

          this.formatStrToDate(
            formatDate(
              new Date(date.getTime() + 86400 * 1000 * num),
              "yyyy-MM-01 00:00:00"
            )
          )
        );
        this.dataValue = datearr;
      } else if (type == "year") {
        this.timeType = "year";
        var date = new Date();
        var datearr = [];
        datearr.push(
          this.formatStrToDate(formatDate(date, "yyyy-01-01 00:00:00")),
          this.formatStrToDate(
            formatDate(
              new Date(date.getTime() + 86400 * 1000 * 365),
              "yyyy-01-01 00:00:00"
            )
          )
        );
        this.dataValue = datearr;
      } else if (type == "day") {
        this.timeType = "day";
        var date = new Date();
        var datearr = [];
        datearr.push(
          this.formatStrToDate(formatDate(date, "yyyy-MM-dd 00:00:00")),
          this.formatStrToDate(
            formatDate(
              new Date(date.getTime() + 86400 * 1000),
              "yyyy-MM-dd 00:00:00"
            )
          )
        );
        this.dataValue = datearr;
      }
    },
    formatStrToDate(dateString) {
      if (dateString) {
        var arr1 = dateString.split(" ");
        var sdate = arr1[0].split("-");
        var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
        return date;
      }
    },
    initTime() {
      var date = new Date();
      var datearr = [];
      datearr.push(
        this.formatStrToDate(formatDate(date, "yyyy-MM-dd 00:00:00")),
        this.formatStrToDate(
          formatDate(
            new Date(date.getTime() + 86400 * 1000),
            "yyyy-MM-dd 00:00:00"
          )
        )
      );
      this.dataValue = datearr;
    },
    setRankingCls(rank) {
      let ranking = parseInt(rank);
      let cls = "";
      switch (ranking) {
        case 1:
          cls = "first-ranking";
          break;
        case 2:
          cls = "second-ranking";
          break;
        case 3:
          cls = "third-ranking";
          break;
      }
      return cls;
    },
    searchData() {
      this.rateRankLoading = true;
      this.rateRankNoDataState = false;
      this.uploadRateLoading = true;
      this.uploadRateNoDataState = false;
      this.rateYearLoading = true;
      this.rateYearNoDataState = false;
      this.ringRatioLoading = true;
      this.ringRatioNoDataState = false;

      this.waterQualityGradeChart();
      this.searchRanking();
      this.uploadRateYearChart();
      this.uploadRateRingRatio();
    },
    //查询上传率排名
    searchRanking() {
      this.loadingTwo = true;
      let startTime = formatDate(this.dataValue[0], "yyyy-MM-dd hh:mm:ss");
      let endTime = formatDate(this.dataValue[1], "yyyy-MM-dd hh:mm:ss");
      let params = {};
      params.timeType = this.timeType;
      params.startTime = startTime;
      params.endTime = endTime;
      params.queryCode = this.stationId;
      params.queryType = this.openPage;
      params.userId = this.toolObj.getCookie("userId");
      this.$http
        .get("/Statistics-Service/twoRateComparison/uploadRateReports", {
          params: params
        })
        .then(response => {
          this.loadingTwo = false;
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var list = dataJson.content.dataList;
            var arr = [];
            for (var i = 0; i < list.length; i++) {
              arr.push({
                ranking: i + 1 + "",
                name: list[i].name,
                uploadRate: list[i].rate + "%"
              });
            }
            this.uploadfiestdiscrib = dataJson.content.info.message;
            this.tableData = arr;
          }
        })
        .catch(error => {});
    },
    //上传率柱状图
    waterQualityGradeChart() {
      this.loadingOne = true;
      let startTime = formatDate(this.dataValue[0], "yyyy-MM-dd hh:mm:ss");
      let endTime = formatDate(this.dataValue[1], "yyyy-MM-dd hh:mm:ss");
      let params = {};
      params.timeType = this.timeType;
      params.startTime = startTime;
      params.endTime = endTime;
      params.queryCode = this.stationId;
      params.queryType = this.openPage;
      params.userId = this.toolObj.getCookie("userId");
      this.$http
        .get("/Statistics-Service/twoRateComparison/uploadRateBars", {
          params: params
        })
        .then(response => {
          this.loadingOne = false;
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var info = dataJson.content.info;

            this.rankingHistogram = this.$echarts.init(
              document.getElementById("upload-rate-ranking")
            );
            let option = {
              title: {
                text: "上传率排名柱状图",
                textStyle: {
                  fontSize: 16
                },
                x: "center",
                y: 10
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                top: 56,
                left: 20,
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  data: info.xAxis,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  splitNumber: 5,
                  max: 100,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                }
              ],
              series: [
                {
                  name: "上传率",
                  type: "bar",
                  data: info.series[0].data,
                  barWidth: 20,
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}%"
                  },
                  itemStyle: {
                    color: function(param) {
                      if (param.dataIndex < 3) {
                        return "#24c768";
                      } else {
                        return "#00a1e4";
                      }
                    }
                  }
                }
              ]
            };
            this.rankingHistogram.setOption(option);
          }
          this.rateRankLoading = false;
        })
        .catch(error => {});
    },

    //同比对比
    uploadRateYearChart() {
      this.loadingThree = true;
      let startTime = formatDate(this.dataValue[0], "yyyy-MM-dd hh:mm:ss");
      let endTime = formatDate(this.dataValue[1], "yyyy-MM-dd hh:mm:ss");
      let params = {};
      params.timeType = this.timeType;
      params.startTime = startTime;
      params.endTime = endTime;
      params.queryCode = this.stationId;
      params.queryType = this.openPage;
      params.compareType = "H";
      params.userId = this.toolObj.getCookie("userId");
      this.$http
        .get("/Statistics-Service/twoRateComparison/uploadRateYoY", {
          params: params
        })
        .then(response => {
          this.loadingThree = false;
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var info = dataJson.content.info;

            this.uploadRateYear = this.$echarts.init(
              document.getElementById("upload-rate-year")
            );
            let option = {
              color: ["#00a1e4", "#e5ce10", "#ff0000"],
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data: [
                  { name: info.series[0].name, icon: "rect" },
                  { name: info.series[1].name, icon: "rect" },
                  "同比增长率"
                ],
                bottom: 10
              },
              grid: {
                top: 26,
                left: 20,
                right: "4%",
                bottom: 40,
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  data: info.xAxis,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  splitNumber: 5,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                },
                {
                  type: "value",
                  splitNumber: 5,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    show: false,
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                }
              ],
              series: [
                {
                  name: info.series[0].name,
                  type: "bar",
                  data: info.series[0].data,
                  barWidth: 20
                },
                {
                  name: info.series[1].name,
                  type: "bar",
                  data: info.series[1].data,
                  barWidth: 20
                },
                {
                  name: "同比增长率",
                  type: "line",
                  yAxisIndex: 1,
                  symbolSize: 10,
                  data: info.series[2].data,
                  label: {
                    show: true,
                    formatter: "{c}%"
                  }
                }
              ]
            };
            this.uploadRateYear.setOption(option);
          }
        })
        .catch(error => {});
    },
    //环比对比
    uploadRateRingRatio() {
      this.loadingFour = true;
      let startTime = formatDate(this.dataValue[0], "yyyy-MM-dd hh:mm:ss");
      let endTime = formatDate(this.dataValue[1], "yyyy-MM-dd hh:mm:ss");
      let params = {};
      params.timeType = this.timeType;
      params.startTime = startTime;
      params.endTime = endTime;
      params.queryCode = this.stationId;
      params.queryType = this.openPage;
      params.compareType = "";
      params.userId = this.toolObj.getCookie("userId");
      this.$http
        .get("/Statistics-Service/twoRateComparison/uploadRateYoY", {
          params: params
        })
        .then(response => {
          this.loadingFour = false;
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var info = dataJson.content.info;
            this.uploadRateRatio = this.$echarts.init(
              document.getElementById("upload-rate-ring-ratio")
            );
            let option = {
              color: ["#00a1e4", "#e5ce10", "#ff0000"],
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data: [
                  { name: info.series[0].name, icon: "rect" },
                  { name: info.series[1].name, icon: "rect" },
                  "环比增长率"
                ],
                bottom: 10
              },
              grid: {
                top: 26,
                left: 20,
                right: "4%",
                bottom: 40,
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  data: info.xAxis,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  splitNumber: 5,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                },
                {
                  type: "value",
                  splitNumber: 5,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisLabel: {
                    show: false,
                    color: "#999"
                  },
                  splitLine: {
                    show: true
                  }
                }
              ],
              series: [
                {
                  name: info.series[0].name,
                  type: "bar",
                  data: info.series[0].data,
                  barWidth: 20
                },
                {
                  name: info.series[1].name,
                  type: "bar",
                  data: info.series[1].data,
                  barWidth: 20
                },
                {
                  name: "环比增长率",
                  type: "line",
                  yAxisIndex: 1,
                  symbolSize: 10,
                  data: info.series[2].data,
                  label: {
                    show: true,
                    formatter: "{c}%"
                  }
                }
              ]
            };
            this.uploadRateRatio.setOption(option);
          }
        })
        .catch(error => {});
    },
    //查询页面数据
    searchData() {
      this.waterQualityGradeChart();
      this.searchRanking();
      this.uploadRateYearChart();
      this.uploadRateRingRatio();
    }
  },
  mounted() {},
  created() {
    this.initTime();
  },
  watch: {
    stationInfo(value) {
      if (value.length > 0) {
        this.stationId = value[0].nodeId;
        this.openPage = value[0].nodeType;
        this.searchData();
      }
    }
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.strictlyinfo;
      }
    }
  }
};
</script>

<style scoped lang="less">
.comparison-analysis-rates-page {
  height: 100%;
  .page-content-scroll {
    height: 100%;
  }
  .icon-chaxun {
    font-size: 14px;
  }
  .year-on-year-modular {
    width: calc(50% - 4px);
    float: left;
  }
  .loop-ratio-module-modular {
    width: calc(50% - 4px);
    float: right;
  }
  .data-upload-rate-chart {
    height: 310px;
    width: 65%;
    float: left;
    position: relative;
  }
  .data-upload-rate-table {
    height: 310px;
    width: 35%;
    float: right;
  }
  .data-upload-analysis {
    float: left;
    width: 100%;
  }
  #upload-rate-ranking {
    height: 100%;
    width: 100%;
  }
  .upload-rate-table-wrap {
    margin: 0 20px 0 0;
    height: calc(100% - 56px);
  }
  .contrast-title {
    text-align: center;
    line-height: 56px;
    font-size: 16px;
  }
  .ranking-icon {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 3px;
    width: 18px;
    height: 14px;
    line-height: 14px;
    background: #cadaeb;
    font-size: 12px;
  }
  .ranking-icon.first-ranking {
    width: 18px;
    height: 22px;
    line-height: 18px;
    background: url("../../assets/images/ranking_first_bg.png") no-repeat center
      center;
    color: #fff;
  }
  .ranking-icon.second-ranking {
    width: 18px;
    height: 22px;
    line-height: 18px;
    background: url("../../assets/images/ranking_Second_bg.png") no-repeat
      center center;
    color: #fff;
  }
  .ranking-icon.third-ranking {
    width: 18px;
    height: 22px;
    line-height: 18px;
    background: url("../../assets/images/ranking_Third_bg.png") no-repeat center
      center;
    color: #fff;
  }
  #upload-rate-year,
  #upload-rate-ring-ratio {
    height: 288px;
    width: 100%;
    margin-bottom: 8px;
  }
  .data-upload-analysis {
    height: 56px;
    line-height: 56px;
    padding-left: 20px;
    .upload-analysis-text {
      color: #999;
    }
  }
}
</style>
