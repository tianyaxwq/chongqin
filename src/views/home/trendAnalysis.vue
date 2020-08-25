<template>
  <div
    class="trend-analysis"
    v-loading="trendLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="loading-type-a"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <!-- <div v-if="trendLoading" class="loading-wrap"></div>-->
    <div v-if="trendNoDataState" class="no-data-wrap small">
      <p>暂无数据</p>
    </div>
    <div id="trend-analysis-chart"></div>
  </div>
</template>

<script>
// import {formatDate} from '../../dateformat.js'
export default {
  name: "trendAnalysis",
  data() {
    return {
      trendLoading: true,
      trendNoDataState: false,
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
    };
  },
  methods: {
    createTrendAnalysis() {
      let _this = this;
      let myChart = this.$echarts.init(
        document.getElementById("trend-analysis-chart")
      );
      var date = new Date();
      this.trendLoading = true;
      this.trendNoDataState = false;
      this.$http
        .get("/dataHandle/waterBigScreen/areaWaterQuLineByMnAndTime", {
          params: {
            stationType: "WQ08",
            startTime: new Date(new Date().getTime() - 3600 * 1000 * 24 * 180).format("yyyy-MM"),
            endTime: new Date(new Date()).format("yyyy-MM"),
            dataType: "月"
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            let info = dataJson.content.info;
            let option = {
              color: ["#cea916", "#1875d0", "#11c053"],
              tooltip: {
                trigger: "axis",
                formatter: function(params) {
                  let res = params[0].axisValue + "<br/>";
                  for (let i = 0; i < params.length; i++) {
                    res +=
                      "<p>" +
                      params[i].seriesName +
                      " : " +
                      params[i].value +
                      "" +
                      _this.unit[params[i].seriesName] +
                      "</p>";
                  }
                  return res;
                }
              },
              legend: {
                bottom: 12
              },
              grid: {
                bottom: 82,
                top: 20,
                right: 50
              },
              xAxis: {
                type: "category",
                data: info.xAias,
                axisLine: {
                  lineStyle: {
                    color: "#c6d1de"
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  color: "#999999"
                },
                splitLine: {
                  show: true
                }
              },
              yAxis: [
                {
                  name: "水质等级",
                  nameLocation: "middle",
                  nameTextStyle: {
                    color: "#999999"
                  },
                  nameGap: 36,
                  type: "value",
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    color: "#999999"
                  },
                  splitNumber: 6,
                  splitLine: {
                    show: false
                  }
                },
                {
                  name: "监测值",
                  nameLocation: "middle",
                  nameTextStyle: {
                    color: "#999999"
                  },
                  nameGap: 36,
                  type: "value",
                  axisLine: {
                    lineStyle: {
                      color: "#c6d1de"
                    }
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    color: "#999999"
                  },
                  splitNumber: 10
                }
              ],
              series: info.series
            };
            myChart.setOption(option);
          }
          this.trendLoading = false;
        })
        .catch(error => {
          this.trendLoading = false;
          // this.trendNoDataState = true;
        });
    }
  },
  mounted() {
    setTimeout(() => {
      this.createTrendAnalysis();
    }, 1000);
  }
};
</script>

<style scoped>
.trend-analysis {
  height: 380px;
  position: relative;
}
#trend-analysis-chart {
  height: 380px;
  width: 692px;
}
</style>
