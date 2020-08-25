<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="secondary-page-section secondary-page-mode">
        <div class="secondary-toolbar">
          <span>时间 :</span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-date-picker
              v-model="dateRange"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="请选择日期"
            ></el-date-picker>
          </div>&emsp;&emsp;
          <el-button @click="getTabelHeadData">
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
          <el-button type="delet" @click="getPdf('站点监测报告')">
            <i class="iconfont icon-daochu"></i>导出
          </el-button>
        </div>
        <div class="reportCont currency-mode-wrap" id="pdfDom">
          <h2 class="title">站点监测报告</h2>
          <div class="tableCont">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <el-table-column prop="stnm" label="当前站点" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.stnm ? scope.row.stnm : '--'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="监测时间" width="240">
                <template slot-scope="scope">
                  <span>{{scope.row.time ? scope.row.time : '--'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="wQCompositeIndex" label="水质综合指数">
                <template slot-scope="scope">
                  <span>{{scope.row.wQCompositeIndex ? scope.row.wQCompositeIndex : '--'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="水质类别">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.level"
                    class="target-level"
                    :class="'colorValue' + scope.row.level"
                  >{{scope.row.level == "0" ? 'Ⅰ' : scope.row.level == "1" ? 'Ⅱ' : scope.row.level == "2" ? 'Ⅲ' : scope.row.level == "3" ? 'Ⅳ' : scope.row.level == "4" ? 'Ⅴ' : scope.row.level == "5" ? '劣Ⅴ' : ''}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="primaryPollutant" label="首要污染物（超标倍数）" width="200">
                <template slot-scope="scope">
                  <span>{{scope.row.primaryPollutant ? scope.row.primaryPollutant : '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="moduleIntro" v-for="(item, index) in introduction" :key="index">
            <span class="moduleTitle">{{index + 1}} {{item.name}}</span>
            <div class="paragraph">{{item.des}}</div>
            <div
              v-if="index == 0"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="bhqs" style="height: 200px;width: 100%;"></div>
              <div class="legendTitle">采蒲台水质综合指数趋势图</div>
            </div>
            <div
              v-if="index == 1"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="zhpj" style="height: 200px;width: 100%;"></div>
              <div class="legendTitle">各因子数据趋势详情表</div>
            </div>
            <div
              style="margin-top: 50px"
              v-if="index == 1"
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
                style="height: 200px;"
                :style="!gxlDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
              <div class="legendTitle" style="padding: 45px 0">站点内各因子占比分析图</div>
            </div>
            <div v-if="index == 2" class="secondary-mode-content">
              <div style="text-align: center;">
                <img src="../../assets/images/companyDetail/stationOne.png" alt />
                <div class="legendTitle">站点外环境图</div>
              </div>
              <div style="display: flex;justify-content: space-evenly;">
                <div>
                  <img src="../../assets/images/companyDetail/stationTwo.png" alt />
                  <div class="legendTitle">站点照片</div>
                </div>
                <div>
                  <img src="../../assets/images/companyDetail/stationThree.png" alt />
                  <div class="legendTitle">站点照片</div>
                </div>
              </div>
            </div>
          </div>
          <div class="luokuan">
            <span>雄安新区生态环境局</span>
            <br />
            <span>{{dateRange.replace(/-/g, "年")}}月</span>
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
      stationId: "",
      gxlPieEcharts: "",
      barEcharts: "",
      loading: true,
      dateRange: "",
      introduction: [
        {
          name: "站点监测结果与分析",
          des: ""
        },
        {
          name: "各因子监测结果及分析",
          des: ""
        },
        {
          name: "站点图片"
          // des:
          // "2020年3月中，3月19日的水质类别为IV类，为整月中最差一天；3月1日的水质类别为III类，为整月中最好一天；其中I~II类共多少天。"
        }
      ],
      tableData: [],
      tableHeadData: [],
      factors: []
    };
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    }
  },
  watch: {
    stationInfo(value) {
      this.stationId = value[0].nodeId;
      this.getTabelHeadData()
    }
  },
  methods: {
    // 获取表头数据
    getTabelHeadData() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableHeadData = res.data.content.dataList;
            let factorList = [];
            this.tableHeadData.map(el => {
              factorList.push(el.cd);
            });
            this.factors = factorList;
            this.getData();
          }
        })
        .catch(error => {});
    },
    // 获取数据
    getData() {
      this.loading = true;
      this.$http
        .get("/Statistics-Service/reportManage/siteMonitoring", {
          params: {
            timeType: "month",
            time: this.dateRange,
            stationMn: this.stationId,
            factorList: this.factors.join(",")
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.tableData = res.data.content.dataList1;
            this.introduction.map(el => {
              if (el.name == "站点监测结果与分析") {
                el.des = res.data.content.siteMessage;
              } else if (el.name == "各因子监测结果及分析") {
                el.des = res.data.content.factorMessage;
              }
            });
            this.setBhqs(res.data.content.dataList2);
            this.setZhpj(res.data.content.dataList3);
            this.setGxl(res.data.content.dataList4);
          }
        })
        .catch(error => {});
    },

    // 站点监测结果与分析折线图
    setBhqs(list) {
      let arr = [];
      let arr2 = [];
      list.dataList2.map(el => {
        arr.push(el.compositeIndex ? el.compositeIndex - 0 : 0);
        parseInt(el.level);
        arr2.push(el.level || null);
      });
      let seriesData = [
        {
          type: "line",
          data: arr,
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
        },
        {
          type: "line",
          data: arr2,
          label: {
            show: false
          },
          symbol: "circle",
          symbolSize: 0, //拐点大小
          itemStyle: {
            color: "#FF0000"
          }
        }
      ];
      let option = {
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function(params, ticket, callback) {
            let str = "";
            let showHtm = "";
            let strTwo = "";
            if (params[1]) {
              if (params[1].value) {
                str =
                  params[1].value == 0
                    ? "I类"
                    : params[1].value == 1
                    ? "II类"
                    : params[1].value == 2
                    ? "III类"
                    : params[1].value == 3
                    ? "IV类"
                    : params[1].value == 4
                    ? "V类"
                    : params[1].value == 5
                    ? "劣V类"
                    : "";
              } else {
                if (params[1].value == undefined) {
                  str = "--";
                } else if (params[1].value == 0) {
                  str = "I类";
                }
              }
            } else {
              str = "--";
            }

            if (params[0].value) {
              strTwo = params[0].value;
            } else {
              strTwo = "--";
            }
            showHtm =
              params[0].axisValue +
              "<br>" +
              "水质综合指数：" +
              strTwo +
              "<br>" +
              "水质类别：" +
              str;
            return showHtm;
          }
        },
        grid: {
          top: "4%",
          left: "3%",
          right: 0,
          bottom: 0,
          containLabel: true
        },
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
            axisTick: {
              show: false
            },
            max: 5,
            splitNumber: 5,
            minInterval: 1,
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
        series: seriesData
      };
      var myChart = this.$echarts.init(document.getElementById("bhqs"));
      myChart.setOption(option, true);
    },
    // 各因子监测结果及分析折线图
    setZhpj(list) {
      let phData = [];
      let wtData = [];
      let nh3nData = [];
      let doxData = [];
      let codmnData = [];
      let tpData = [];
      let tnData = [];
      let legendData = [];
      let seriesData = [];
      let sjData = [];
      this.loading = false;
      this.barEcharts = this.$echarts.init(document.getElementById("zhpj"));
      let option = {
        legend: {
          left: "center",
          type: "scroll",
          bottom: 0,
          data: list.info.legend,
          selectedMode: false,
          itemGap: 40,
          icon: "circle",
          itemWidth: 8
        },
        tooltip: {
          show: true,
          trigger: "axis"
        },
        grid: {
          top: "4%",
          left: "2%",
          right: "1%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: list.info.xAxis,
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
            axisTick: {
              show: true
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
        series: list.info.series
      };
      this.barEcharts.setOption(option);
    },
    // 各因子监测结果及分析饼图
    setGxl(list) {
      if (JSON.stringify(list) == "{}") {
        this.gxlDataStatus = "no";
        return;
      } else {
        this.gxlDataStatus = "";
      }
      let seriesData = [];
      for (let i in list) {
        seriesData.push({
          value: list[i],
          name: i
        });
      }
      this.gxlPieEcharts = this.$echarts.init(document.getElementById("gxl"));
      let option = {
        tooltip: {
          show: true,
          formatter: function(params, ticket, callback) {
            let showHtm = params.name + ":" + params.percent + "%";
            return showHtm;
          }
        },
        color: ["#FF8900", "#007AFF", "#23DD32", "#02D7EA", "#771EE2"],
        series: [
          {
            type: "pie",
            radius: "80%",
            center: ["50%", "60%"],
            data: seriesData.sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              formatter: "{b} {d}% ",
              color: "#000000"
            },
            labelLine: {
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
  },
  mounted() {
    // this.setZhpj();
  },
  created() {
    this.dateRange = new Date(new Date()).format("yyyy-MM");
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
  .tableCont {
    padding: 50px 0;
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
      .legendTitle {
        text-align: center;
        color: #999;
        padding: 20px 0;
      }
    }
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