<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="secondary-page-section secondary-page-mode">
        <div class="secondary-toolbar">
          <span>时间 :</span>&nbsp;
          <div class="layoutBox" style="width:220px">
            <el-date-picker
              v-model="dateRange"
              format="yyyy-MM"
              value-format="yyyy-MM"
              type="month"
              placeholder="请选择日期"
            ></el-date-picker>
          </div>&emsp;&emsp;
          <el-button @click="getData('search')">
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
          <el-button type="delet" @click="getPdf('区域分析报告')">
            <i class="iconfont icon-daochu"></i>导出
          </el-button>
        </div>
        <div class="reportCont currency-mode-wrap" id="pdfDom">
          <h2 class="title">区域分析报告</h2>
          <div class="smallTitle">
            <span>{{dateRangeTwo}}</span>
          </div>
          <div class="moduleIntro" v-for="(item, index) in introduction" :key="index">
            <span v-if="index != 0" class="moduleTitle">1.{{index}} {{item.name}}</span>
            <span v-else class="moduleTitle">1、{{item.name}}</span>
            <div class="paragraph">{{item.des}}</div>
            <div
              v-if="index == 1"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div class="noEcharts" v-if="proportionDataStatus == 'no'">
                <span>暂无数据</span>
              </div>
              <div
                id="proportion"
                style="width: 100%;height: 200px; "
                :style="!proportionDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
            </div>
            <div
              v-if="index == 2"
              class="secondary-mode-content changeBar"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="bhqs" style="height: 200px; width: 100%;"></div>
            </div>
            <div
              v-if="index == 3"
              class="secondary-mode-content changeBar"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div class="noEcharts" v-if="zhpjDataStatus == 'no'">
                <span>暂无数据</span>
              </div>
              <div
                id="zhpj"
                style="width: 100%;height: 200px; "
                :style="!zhpjDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
            </div>
            <div v-if="index == 4" class="secondary-mode-content">
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column prop="name" label="断面名称" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.name ? scope.row.name : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="水质类别">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.level"
                      class="target-level"
                      :class="getColor(scope.row.level)"
                    >{{scope.row.level == "I类" ? 'Ⅰ' : scope.row.level == "II类" ? 'Ⅱ' : scope.row.level == "III类" ? 'Ⅲ' : scope.row.level == "IV类" ? 'Ⅳ' : scope.row.level == "V类" ? 'Ⅴ' : scope.row.level == "劣V类" ? '劣Ⅴ' : ''}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column prop="waterCondition" label="水质状况">
                  <template slot-scope="scope">
                    <span>{{scope.row.waterCondition ? scope.row.waterCondition : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="keyPollution" label="主要污染指标（超标倍数）" width="200">
                  <template slot-scope="scope">
                    <span>{{scope.row.keyPollution ? scope.row.keyPollution : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="compositeIndex" label="水质综合指数">
                  <template slot-scope="scope">
                    <span>{{scope.row.compositeIndex ? scope.row.compositeIndex : '--'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-if="index == 5"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div class="noEcharts" v-if="jcjgDataStatus == 'no'">
                <span>暂无数据</span>
              </div>
              <div
                id="jcjg"
                style="width: 100%;height: 220px;"
                :style="!jcjgDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
            </div>
            <div
              v-if="index == 6"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div class="noEcharts" v-if="gxlDataStatus == 'no'">
                <span>暂无数据</span>
              </div>
              <div
                id="gxl"
                style="width: 100%;height: 200px;"
                :style="!gxlDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
            </div>
          </div>
          <div class="luokuan">
            <span>雄安新区生态环境局</span>
            <br />
            <span>{{dateRangeTwo.replace(/-/g, "年")}}月</span>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      gxlDataStatus: "zanwu",
      jcjgDataStatus: "zanwu",
      zhpjDataStatus: "zanwu",
      proportionDataStatus: "zanwu",
      gxlPieEcharts: "",
      jcjgBarEcharts: "",
      pieEcharts: "",
      lineEcharts: "",
      barEcharts: "",
      loading: true,
      dateRange: "",
      dateRangeTwo: "",
      loadingTwo: true,
      introduction: [
        {
          name: "雄安新区水质概况",
          des: ""
        },
        {
          name: "月度水质类别占比图",
          des: ""
        },
        {
          name: "月度水质变化趋势",
          des: ""
        },
        {
          name: "国控站水质综合评价",
          des: ""
        },
        {
          name: "单因子评价",
          des: ""
        },
        {
          name: "区域国控点监测结果与评价",
          des: ""
        },
        {
          name: "污染贡献率占比",
          des: ""
        }
      ],
      tableData: [],
      flag: false
    };
  },
  methods: {
    // 水质类别颜色
    getColor(type) {
      let colorStr = "colorValue";
      if (type == "I类") {
        colorStr = "colorValue0";
      } else if (type == "II类") {
        colorStr = "colorValue1";
      } else if (type == "III类") {
        colorStr = "colorValue2";
      } else if (type == "IV类") {
        colorStr = "colorValue3";
      } else if (type == "V类") {
        colorStr = "colorValue4";
      } else if (type == "劣V类") {
        colorStr = "colorValue5";
      }
      return colorStr;
    },
    // 获取数据
    getData(flag) {
      if (flag == "search") {
        this.flag = true;
        this.dateRangeTwo = this.dateRange;
      } else {
        this.flag = false;
      }
      this.loading = true;
      this.$http
        .get("/Statistics-Service/reportManage/areaAnalysis", {
          params: {
            stationMn: "WQ03",
            timeType: "month",
            time: this.dateRange
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.tableData = res.data.content.singleFactorEvaluationMap;
            this.introduction.map(el => {
              if (el.name == "雄安新区水质概况") {
                el.des = res.data.content.wQSituationMessage;
              } else if (el.name == "月度水质类别占比图") {
                el.des = res.data.content.wQCategoryMMessage;
                this.setProportion(res.data.content.wQCategoryMap);
              } else if (el.name == "月度水质变化趋势") {
                el.des = res.data.content.monthWQTrendsMessage;
                this.setBhqs(res.data.content.monthWQTrendsDataList);
              } else if (el.name == "国控站水质综合评价") {
                el.des = res.data.content.wQEvaluationMessage;
                this.setZhpj(res.data.content.wqListMMap);
              } else if (el.name == "单因子评价") {
                el.des = res.data.content.singleFactorEvaluationMessage;
              } else if (el.name == "区域国控点监测结果与评价") {
                el.des = res.data.content.monthRatioChartsMessage;
                this.setJcjg(res.data.content.monthRatioChartsMap);
              } else if (el.name == "污染贡献率占比") {
                el.des = res.data.content.pollutionRateMessage;
                this.setGxl(res.data.content.pollutionRateMap);
              }
            });
          }
        })
        .catch(error => {});
    },
    // 月度水质类别占比图
    setProportion(list) {
      if (JSON.stringify(list) == "{}") {
        this.proportionDataStatus = "no";
        return;
      } else {
        this.proportionDataStatus = "";
      }
      let seriesData = [];
      let lengData = [];
      for (let i in list) {
        seriesData.push({
          value: list[i],
          name: i
        });
        lengData.push(i);
      }
      this.loading = false;
      this.pieEcharts = this.$echarts.init(
        document.getElementById("proportion")
      );
      let option = {
        legend: {
          bottom: 0,
          left: "center",
          data: lengData,
          selectedMode: false,
          itemGap: 45
        },
        tooltip: {
          show: true,
          formatter: function(params, ticket, callback) {
            let showHtm = params.name + ":" + params.percent + "%";
            return showHtm;
          }
        },
        series: [
          {
            type: "pie",
            radius: "70%",
            data: seriesData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{d}% \n {b}",
                  position: "inner"
                }
              }
            },
            color: [
              "#00FF00",
              "#FFFF00",
              "#00CCFF",
              "#CCFFFF",
              "#FF9B00",
              "#FF0000"
            ]
          }
        ]
      };
      this.pieEcharts.setOption(option);
    },
    // 月度水质变化趋势
    setBhqs(list) {
      this.loading = false;
      this.lineEcharts = this.$echarts.init(document.getElementById("bhqs"));
      let option = {
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function(params, ticket, callback) {
            let showHtm = "";
            let str =
              params[0].value == 0
                ? "I类"
                : params[0].value == 1
                ? "II类"
                : params[0].value == 2
                ? "III类"
                : params[0].value == 3
                ? "IV类"
                : params[0].value == 4
                ? "V类"
                : params[0].value == 5
                ? "劣V类"
                : "";
            showHtm = params[0].name + "<br>" + "水质类别：" + str;
            return showHtm;
          }
        },
        grid: {
          top: "4%",
          left: "4%",
          right: "0.5%",
          bottom: 0,
          containLabel: true
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: list.xAxis,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#D9E6F7"
              }
            },
            axisLabel: {
              color: "#999",
              interval: 0,
              rotate: 45
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#D9E6F7"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            max: 5,
            splitNumber: 5,
            minInterval: 1,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#D9E6F7"
              }
            },
            axisLabel: {
              color: "#999",
              formatter: function(value, index) {
                if (index == 0) {
                  value = "I类";
                } else if (index == 1) {
                  value = "II类";
                } else if (index == 2) {
                  value = "III类";
                } else if (index == 3) {
                  value = "IV类";
                } else if (index == 4) {
                  value = "V类";
                } else if (index == 5) {
                  value = "劣V类";
                }
                return value;
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#D9E6F7"
              }
            }
          }
        ],
        series: [
          {
            type: "line",
            data: list.dataList,
            label: {
              show: false
            },
            symbol: "circle",
            symbolSize: 6, //拐点大小
            itemStyle: {
              color: "#20D96D",
              emphasis: {
                color: "#24C768" //hover拐点颜色定义
              }
            },
            areaStyle: {
              color: "#D7E3F3"
            }
          }
        ]
      };
      this.lineEcharts.setOption(option);
    },
    // 国控站水质综合评价
    setZhpj(list) {
      let XData = [];
      let YData = [];
      if (list && list.length) {
        this.zhpjDataStatus = "";
        list.map(el => {
          el.wqg = el.wqg - 0;
          XData.push(el.stnm);
          YData.push(el.wqg);
        });
      } else {
        this.zhpjDataStatus = "no";
        return;
      }
      this.loading = false;
      this.barEcharts = this.$echarts.init(document.getElementById("zhpj"));
      let option = {
        tooltip: {
          show: false
        },
        grid: {
          top: "4%",
          left: "3%",
          right: "1%",
          bottom: 0,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: XData,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#D9E6F7"
              }
            },
            axisLabel: {
              color: "#999"
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#D9E6F7"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#D9E6F7"
              }
            },
            max: 5,
            splitNumber: 5,
            minInterval: 1,
            axisLabel: {
              color: "#999",
              formatter: function(value, index) {
                if (index == 0) {
                  value = "I类";
                } else if (index == 1) {
                  value = "II类";
                } else if (index == 2) {
                  value = "III类";
                } else if (index == 3) {
                  value = "IV类";
                } else if (index == 4) {
                  value = "V类";
                } else if (index == 5) {
                  value = "劣V类";
                }
                return value;
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#D9E6F7"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: YData,
            label: {
              show: false
            },
            itemStyle: {
              color: "#20D96D"
            },
            barWidth: 20
          }
        ]
      };
      this.barEcharts.setOption(option);
    },
    // 区域国控点监测结果与评价
    setJcjg(list) {
      if (list.dqCompositeIndex) {
        this.jcjgDataStatus = "";
      } else {
        this.jcjgDataStatus = "no";
        return;
      }
      let seriesData = [];
      let seriesHbData = [];
      let lineData = [];
      let lengData = [];
      let dqTime = new Date(
        Date.parse(this.dateRange.replace(/-/g, "/"))
      ).format("yyyy年MM月");
      let hbTime =
        new Date(Date.parse(dqTime.replace(/([年月])/g, "/"))).getMonth() == 0
          ? new Date(
              Date.parse(dqTime.replace(/([年月])/g, "/"))
            ).getFullYear() -
            1 +
            "年" +
            (new Date(Date.parse(dqTime.replace(/([年月])/g, "/"))).getMonth() +
              12) +
            "月"
          : new Date(
              Date.parse(dqTime.replace(/([年月])/g, "/"))
            ).getFullYear() +
            "年" +
            (new Date(Date.parse(dqTime.replace(/([年月])/g, "/"))).getMonth() +
              1) +
            "月";
      let strPj = dqTime + "评价值";
      lengData = [hbTime, dqTime, strPj];
      list.dqMonthRatioCharts.map(el => {
        lineData.push(list.dqCompositeIndex);
        el.compositeIndex = el.compositeIndex - 0;
        seriesData.push(el.compositeIndex);
      });
      if (list.hbMonthRatioCharts && list.hbMonthRatioCharts.length) {
        list.hbMonthRatioCharts.map(el => {
          seriesHbData.push(el.dqCompositeIndex - 0);
        });
      }
      this.jcjgBarEcharts = this.$echarts.init(document.getElementById("jcjg"));
      let option = {
        tooltip: {
          show: false
        },
        legend: {
          bottom: 0,
          left: "center",
          data: lengData,
          selectedMode: false,
          itemGap: 45,
          icon: "stack"
        },
        grid: {
          top: "4%",
          left: "0.8%",
          right: "1%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["光淀张庄", "南刘庄", "圈头", "烧车淀", "采蒲台"],
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#D9E6F7"
              }
            },
            axisLabel: {
              color: "#999"
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#D9E6F7"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#D9E6F7"
              }
            },
            axisLabel: {
              color: "#999"
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#D9E6F7"
              }
            }
          }
        ],
        series: [
          {
            name: hbTime,
            type: "bar",
            data: seriesHbData,
            label: {
              show: false
            },
            itemStyle: {
              color: "#24C768"
            },
            barWidth: 20
          },
          {
            name: dqTime,
            type: "bar",
            data: seriesData,
            label: {
              show: false
            },
            itemStyle: {
              color: "#2DD7E5"
            },
            barWidth: 20
          },
          {
            name: strPj,
            type: "line",
            symbol: "none",
            data: lineData
          }
        ]
      };
      this.jcjgBarEcharts.setOption(option);
    },
    // 污染贡献率占比
    setGxl(list) {
      if (JSON.stringify(list) == "{}") {
        this.gxlDataStatus = "no";
        return;
      } else {
        this.gxlDataStatus = "";
      }
      let seriesData = [];
      let lengData = [];
      for (let i in list) {
        seriesData.push({
          value: list[i].split("%")[0],
          name: i
        });
        lengData.push(i);
      }
      this.gxlPieEcharts = this.$echarts.init(document.getElementById("gxl"));
      let option = {
        legend: {
          // orient: "vertical",
          bottom: 0,
          data: lengData,
          selectedMode: false
        },
        tooltip: {
          show: true,
          formatter: function(params, ticket, callback) {
            let showHtm = params.name + ":" + params.percent + "%";
            return showHtm;
          }
        },
        color: [
          "#FF8900",
          "#007AFF",
          "#23DD32",
          "#02D7EA",
          "#771EE2",
          "#d48265"
        ],
        series: [
          {
            type: "pie",
            radius: "70%",
            center: ["50%", "45%"],
            data: seriesData.sort(function(a, b) {
              return a.value - b.value;
            }),
            // roseType: "radius",
            label: {
              formatter: "{b} {d}% ",
              color: "rgba(0, 0, 0, 255)"
            },
            labelLine: {
              show: true,
              length: 5,
              length2: 20,
              smooth: 0.2,
              lineStyle: {
                color: "#707070"
              }
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      this.gxlPieEcharts.setOption(option);
    }
  },
  created() {
    this.dateRange = new Date(new Date(new Date().format("yyyy-MM") + '-01 00:00').getTime() - 3.6e6).format("yyyy-MM");
    this.dateRangeTwo = this.dateRange;
    this.getData();
  }
};
</script>
<style lang="less" scoped>
.reportCont {
  overflow: hidden;
  padding: 30px 200px 40px;
  border: 1px solid #d9e5f6;
  // margin-top: 10px;
  .noEcharts {
    background: url("../../components/yf-dataStatus/images/noData.png") center
      center no-repeat;
    height: 240px;
    width: 100%;
    position: absolute;
    text-align: center;
    > span {
      font-size: 16px;
      color: #999;
      padding-left: 40px;
    }
    line-height: 240px;
  }
  .title {
    text-align: center;
    font-size: 20px;
    color: #1a1a1a;
    padding: 5px 0;
  }
  .smallTitle {
    text-align: center;
    > span {
      font-size: 14px;
      color: #a7a7a7;
    }
  }
  .moduleIntro {
    padding: 20px 0;
    .moduleTitle {
      color: #333333;
      font-size: 18px;
      font-weight: bold;
    }
    .paragraph {
      margin-top: 20px;
      text-indent: 25px;
      line-height: 25px;
    }
    .secondary-mode-content {
      padding-top: 20px;
      position: relative;
    }
    // .changeBar {
    //   background: url("../../assets/images/companyDetail/changeBar.png") no-repeat 4% 0px;
    // }
  }
  .luokuan {
    float: right;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    text-align: right;
    > span:first-child {
      padding: 10px 0 5px 50px;
      border-top: 1px solid #707070;
    }
  }
}
</style>