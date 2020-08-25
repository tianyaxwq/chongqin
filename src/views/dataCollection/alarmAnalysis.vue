<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="secondary-page-section secondary-page-mode">
        <div class="secondary-toolbar">
          <span>时间 :</span>&nbsp;
          <div class="layoutBox" style="width:360px">
            <sl-date-picker
              range-separator="至"
              v-model="dateRange"
              type="date"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></sl-date-picker>
          </div>&emsp;&emsp;
          <el-button @click="search">
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
        </div>
        <div class="reportCont currency-mode-wrap" id="pdfDom">
          <div class="moduleIntro" v-for="(item, index) in introduction" :key="index">
            <div class="moduleTitle">{{item.name}}</div>
            <div
              v-if="index == 0"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="bhqs" style="height: 240px; width: 100%;"></div>
            </div>
            <div
              v-if="index == 1"
              class="secondary-mode-content"
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
                style="width: 100%;height: 240px; "
                :style="!zhpjDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
            </div>
            <div
              v-if="index == 2"
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
                style="width: 100%;height: 320px;"
                :style="!gxlDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
            </div>
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
      colors: {
        水温: "#e53ce6", //水温
        溶解氧: "#13C2C2", //溶解氧
        浑浊度: "#1cad8b", //浑浊度
        电导率: "#00a3f5", //电导率
        高锰酸盐指数: "#FADB14", //高锰酸盐指数
        氨氮: "#722ED1", //氨氮
        总磷: "#F5222D", //总磷
        总氮: "#FA8C16", //总氮
        pH: "#A0D911", //PH
        化学需氧量: "#1890FF" //CODcr
      },
      gxlDataStatus: "",
      zhpjDataStatus: "",
      gxlPieEcharts: "",
      lineEcharts: "",
      barEcharts: "",
      loading: true,
      dateRange: "",
      dateRangeTwo: "",
      introduction: [
        {
          name: "因子超标报警趋势"
        },
        {
          name: "各站点报警次数统计"
        },
        {
          name: "因子报警次数占比图"
        }
      ],
      tableData: [],
      flag: false,
      startTime: "",
      endTime: "",
      showDate: ""
    };
  },
  methods: {
    search() {
      this.setBhqs();
      this.setZhpj();
      this.setGxl();
      // this.showDate = new Date(this.dateRange).format("yyyy年MM月");
    },
    // 获取时间
    getDate() {
      var date = new Date(new Date(this.dateRange));
      date.setDate(1);
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.startTime = date.getFullYear() + "-" + month + "-" + day;
    },
    getEndDate() {
      var date = new Date(new Date(this.dateRange));
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      var lastTime = new Date(nextMonthFirstDay - oneDay);
      var month = parseInt(lastTime.getMonth() + 1);
      var day = lastTime.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.endTime = date.getFullYear() + "-" + month + "-" + day;
      this.setBhqs();
      this.setZhpj();
      this.setGxl();
    },
    // 因子超标趋势 折线图
    setBhqs() {
      this.loading = true;
      let XData = [];
      let YData = [];
      let seriesData = [];
      let legendData = [];
      this.$http
        .get("/Statistics-Service/alarmEvnet/monitorDataLine", {
          params: {
            startTime: new Date(this.dateRange[0]).format(
              "yyyy-MM-dd 00:00:00"
            ),
            endTime: new Date(this.dateRange[1]).format("yyyy-MM-dd 23:59:59"),
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            XData = res.data.content.info.xAxis;
            YData = res.data.content.info.series;
            legendData = res.data.content.legend;
            YData.map((el, index) => {
              seriesData.push({
                name: el.name,
                type: el.type,
                data: el.data,
                label: {
                  show: false
                },
                symbol: "circle",
                symbolSize: 6, //拐点大小
                itemStyle: {
                  color: this.colors[el.name],
                  emphasis: {
                    color: this.colors[el.name] //hover拐点颜色定义
                  }
                },
                areaStyle: {
                  color: "#D9E6F7"
                }
              });
            });
            this.lineEcharts = this.$echarts.init(
              document.getElementById("bhqs")
            );
            let option = {
              tooltip: {
                show: true,
                trigger: "axis",
                formatter: function(params) {
                  let res = params[0].axisValue + "<br/>";
                  for (let i = 0; i < params.length; i++) {
                    let bq = `<i style="display:inline-block;width: 12px;height: 12px;border-radius:50%;margin-right: 5px;background: ${params[i].color}"></i>`;
                    var value =
                      params[i].value == undefined ? "-" : params[i].value;
                    res += "<p>" + bq + params[i].seriesName + ": " + value + " 次" + "</p>";
                  }
                  return res;
                }
              },
              grid: {
                left: "2%",
                right: "1%",
                bottom: 0,
                containLabel: true
              },
              legend: {
                data: legendData
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
                    color: "#1A1A1A",
                    interval: "auto",
                    rotate: 45
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  nameTextStyle: {
                    color: "#1A1A1A"
                  },
                  name: "单位：次",
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#D7E3F3"
                    }
                  },
                  axisLabel: {
                    color: "#1A1A1A"
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: "#D9E6F7"
                    }
                  }
                }
              ],
              series: seriesData
            };
            this.lineEcharts.setOption(option);
          }
        });
    },
    // 报警次数统计柱状图
    setZhpj() {
      let XData = [];
      let YData = [];
      this.loading = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/stationCountBar", {
          params: {
            startTime: new Date(this.dateRange[0]).format(
              "yyyy-MM-dd 00:00:00"
            ),
            endTime: new Date(this.dateRange[1]).format("yyyy-MM-dd 23:59:59"),
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (
              res.data.content.info.series &&
              res.data.content.info.series.length
            ) {
              this.zhpjDataStatus = "";
            } else {
              this.zhpjDataStatus = "no";
              return;
            }
            XData = res.data.content.info.xAxis;
            YData = res.data.content.info.series;
            this.barEcharts = this.$echarts.init(
              document.getElementById("zhpj")
            );
            let option = {
              tooltip: {
                show: true,
                trigger: "axis",
                formatter: function(params) {
                  let res = params[0].axisValue + "<br/>";
                  let bq = `<i style="display:inline-block;width: 12px;height: 12px;border-radius:50%;margin-right: 5px;background: ${params[0].color}"></i>`;
                  var value =
                    params[0].value == undefined ? "-" : params[0].value;
                  res += "<p>" + bq + value + " " + "次" + "</p>";
                  return res;
                }
              },
              grid: {
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
                    color: "#1A1A1A"
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
                  name: "单位：次",
                  nameTextStyle: {
                    color: "#1A1A1A"
                  },
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#D9E6F7"
                    }
                  },
                  axisLabel: {
                    color: "#1A1A1A"
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
                    color: "#1890FF"
                  },
                  barWidth: 20
                }
              ]
            };
            this.barEcharts.setOption(option);
          }
        });
    },
    // 报警占比
    setGxl() {
      this.loading = true;
      let seriesData = [];
      let lengData = [];
      this.$http
        .get("/Statistics-Service/alarmEvnet/monitorCountPie", {
          params: {
            startTime: new Date(this.dateRange[0]).format(
              "yyyy-MM-dd 00:00:00"
            ),
            endTime: new Date(this.dateRange[1]).format("yyyy-MM-dd 23:59:59"),
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (
              res.data.content.dataList &&
              !res.data.content.dataList.length
            ) {
              this.gxlDataStatus = "no";
              return;
            } else {
              this.gxlDataStatus = "";
            }
            seriesData = res.data.content.dataList;
            seriesData.map(el => {
              lengData.push(el.name);
            });
            this.gxlPieEcharts = this.$echarts.init(
              document.getElementById("gxl")
            );
            let option = {
              legend: {
                orient: "vertical",
                right: "30%",
                top: "20%",
                data: lengData,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 10,
                selectedMode: false
              },
              tooltip: {
                show: true,
                formatter: function(params, ticket, callback) {
                  let showHtm = params.name + ":" + params.value + "次";
                  return showHtm;
                }
              },
              color: [
                "#FF8900",
                "#007AFF",
                "#23DD32",
                "#02D7EA",
                "#771EE2",
                "#d48265",
                "#d48265"
              ],
              series: [
                {
                  type: "pie",
                  radius: "70%",
                  center: ["45%", "55%"],
                  data: seriesData.sort(function(a, b) {
                    return a.value - b.value;
                  }),
                  roseType: "radius",
                  label: {
                    // formatter: "{b} {d}% ",
                    formatter: function(data) {
                      return data.name + data.percent.toFixed(1) + "%";
                    },
                    color: "rgba(0, 0, 0, 255)"
                  },
                  labelLine: {
                    normal: {
                      label: {
                        show: true,
                        formatter: function(data) {
                          return data.name + data.percent.toFixed(1) + "%";
                        }
                        // formatter: "{d}% \n {b} "
                      }
                    },
                    lineStyle: {
                      color: "#707070"
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
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
        });
    }
  },
  mounted() {},
  created() {
    // this.dateRange = new Date(new Date()).format("yyyy-MM");
    // this.showDate = new Date(this.dateRange).format("yyyy年MM月");
    let start = new Date(new Date().getTime() - 3600 * 1000 * 24 * 7);
    let end = new Date();
    this.dateRange = [start, end];
    // this.getDate();
    // this.getEndDate();
    this.search();
  }
};
</script>
<style lang="less" scoped>
.reportCont {
  overflow: hidden;
  padding: 30px 45px 40px;
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
  .moduleIntro {
    padding: 20px 0;
    &:last-child {
      .moduleTitle {
        padding: 20px 0;
      }
    }
    .moduleTitle {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
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
  }
}
</style>