<template>
  <div class="pageContent" style="height:100%">
    <div class="secondary-page-section noScrollX" style="height:100%">
      <el-scrollbar style="height:100%;background: #eff3f5;">
        <div class="modelOne model">
          <ul class="proportion">
            <div class="titlep">
              <img src="../../assets/images/companyDetail/icon1.png" alt />主要饮用水源地达标率
            </div>
            <li>
              <el-progress type="circle" :percentage="88"></el-progress>
              <p>雄县</p>
            </li>
            <li>
              <el-progress type="circle" :percentage="95"></el-progress>
              <p>安新县</p>
            </li>
            <li>
              <el-progress type="circle" :percentage="78"></el-progress>
              <p>容城县</p>
            </li>
          </ul>
          <div class="proportion">
            <div class="titlep">
              <img src="../../assets/images/companyDetail/icon2.png" alt />主要饮用水源地单月水质类别比例
            </div>
            <div class="echartBox" id="echartBox4"></div>
          </div>
        </div>
        <div class="modelTwo model">
          <ul>
            <li>
              <p class="titlep">
                <img src="../../assets/images/companyDetail/icon3.png" alt />主要饮用水源地达标率历年同期对比
              </p>
              <div class="echartBox1 echartBox" id="echartBox1"></div>
            </li>
            <li>
              <p class="titlep">
                <img src="../../assets/images/companyDetail/icon4.png" alt />主要饮用水源地达标状况月分析
              </p>
              <div class="echartBox2 echartBox" id="echartBox2"></div>
            </li>
          </ul>
        </div>
        <div class="model modelThree">
          <ul>
            <li>
              <p class="titlep">
                <img src="../../assets/images/companyDetail/icon5.png" alt />水质类别比例
              </p>
              <div class="echartBox" id="echartBox3"></div>
            </li>
            <li>
              <p class="titlep">
                <img src="../../assets/images/companyDetail/icon6.png" alt />主要污染指标分析
              </p>
              <div class="echartBox" id="echartBox5"></div>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  methods: {
    initEchartOne() {
      let myChart = this.$echarts.init(document.getElementById("echartBox1"));
      let option = {
        color: ["#8E42FF", "#00A3F5", "#1EBD1E"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["雄县", "安新县", "容城县"],
          bottom: 0,
          textStyle: {
            color: "#666"
          }
        },
        grid: {
          top: 30,
          left: 30,
          right: 30,
          bottom: 40,
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          data: [
            "2010年",
            "2011年",
            "2012年",
            "2013年",
            "2014年",
            "2015年",
            "2016年",
            "2017年",
            "2018年",
            "2019年"
          ]
        },
        yAxis: {
          name: "单位（%）",
          type: "value",
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          }
        },
        series: [
          {
            name: "雄县",
            type: "line",
            smooth: true,
            data: [92, 78, 99, 56, 83, 83, 78, 95, 80, 70]
          },
          {
            name: "安新县",
            type: "line",
            smooth: true,
            data: [87, 58, 69, 86, 73, 43, 88, 65, 70, 80]
          },
          {
            name: "容城县",
            type: "line",
            smooth: true,
            data: [72, 98, 79, 96, 73, 93, 78, 55, 70, 90]
          }
        ]
      };
      myChart.setOption(option);
    },
    initEchartTwo() {
      let myChart = this.$echarts.init(document.getElementById("echartBox2"));
      let option = {
        color: ["#8E42FF", "#00A3F5", "#1EBD1E"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["雄县", "安新县", "容城县"],
          bottom: 0,
          textStyle: {
            color: "#666"
          }
        },
        grid: {
          top: 30,
          left: 30,
          right: 30,
          bottom: 40,
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        },
        yAxis: {
          name: "单位（%）",
          type: "value",
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          }
        },
        series: [
          {
            name: "雄县",
            barWidth: 10,
            type: "bar",
            smooth: true,
            data: [92, 78, 99, 56, 83, 83, 78, 95, 80, 70, 78, 95]
          },
          {
            name: "安新县",
            type: "bar",
            barWidth: 10,
            smooth: true,
            data: [87, 58, 69, 86, 73, 43, 88, 65, 70, 80, 73, 43]
          },
          {
            name: "容城县",
            type: "bar",
            barWidth: 10,
            smooth: true,
            data: [72, 98, 79, 96, 73, 93, 78, 55, 70, 90, 96, 73]
          }
        ]
      };
      myChart.setOption(option);
    },
    initEchartThree() {
      let option = {
        color: [
          "#00a1e4",
          "#1EBD1E",
          "#24c768",
          "#e5ce10",
          "#ff7e00",
          "#ff0000"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },

        series: [
          {
            name: "水质类别",
            type: "pie",
            radius: ["40%", "55%"],
            label: {
              formatter: "{b}{d}%"
            },
            data: [
              { value: 35, name: "I类" },
              { value: 10, name: "II类" },
              { value: 23, name: "III类" },
              { value: 35, name: "IV类" },
              { value: 48, name: "V类" },
              { value: 25, name: "劣V类" }
            ]
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById("echartBox3"));
      myChart.setOption(option);
    },
    initEchartFour() {
      let myChart = this.$echarts.init(document.getElementById("echartBox4"));
      let option = {
        color: [
          "#00a1e4",
          "#1EBD1E",
          "#24c768",
          "#e5ce10",
          "#ff7e00",
          "#ff0000"
        ],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          bottom: 0,
          textStyle: {
            color: "#666"
          }
        },
        grid: {
          top: 30,
          left: 30,
          right: 30,
          bottom: 40,
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          data: ["雄县", "安新县", "容城县"]
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          }
        },
        series: [
          {
            name: "I类",
            barWidth: 10,
            type: "bar",
            stack: "水质类别",
            smooth: true,
            data: [9, 8, 9]
          },
          {
            name: "II类",
            stack: "水质类别",
            type: "bar",
            barWidth: 10,
            smooth: true,
            data: [7, 5, 6]
          },
          {
            name: "III类",
            stack: "水质类别",
            type: "bar",
            barWidth: 10,
            smooth: true,
            data: [7, 8, 9]
          },
          {
            name: "IV类",
            stack: "水质类别",
            barWidth: 10,
            type: "bar",
            smooth: true,
            data: [9, 8, 9]
          },
          {
            name: "V类",
            type: "bar",
            stack: "水质类别",
            barWidth: 10,
            smooth: true,
            data: [7, 8, 9]
          },
          {
            name: "劣V类",
            type: "bar",
            stack: "水质类别",
            barWidth: 10,
            smooth: true,
            data: [7, 8, 9]
          }
        ]
      };
      myChart.setOption(option);
    },
    initEchartFive() {
      let option = {
        color: [
          "#00a1e4",
          "#1EBD1E",
          "#24c768",
          "#e5ce10",
          "#ff7e00",
          "#ff0000"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true
        },
        series: [
          {
            name: "污染物",
            type: "pie",
            radius: [40, 100],
            center: ["50%", "50%"],
            roseType: "area",
            label: {
              formatter: "{b}{d}%"
            },
            data: [
              { value: 10, name: "金属" },
              { value: 5, name: "碳酸盐" },
              { value: 15, name: "硝酸盐" },
              { value: 25, name: "硫酸盐" },
              { value: 20, name: "铁" },
              { value: 35, name: "锰" },
              { value: 30, name: "色度" },
              { value: 40, name: "浑浊度" }
            ]
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById("echartBox5"));
      myChart.setOption(option);
    }
  },
  mounted() {
    this.initEchartOne();
    this.initEchartTwo();
    this.initEchartThree();
    this.initEchartFour();
    this.initEchartFive();
  }
};
</script>

<style lang="less" scoped>
.secondary-page-section {
  // padding-left: 12px;
  .model {
    // padding: 0 30px;
    .titlep {
      > img {
        margin: 0 10px;
      }
      text-align: left;
      height: 36px;
      line-height: 36px;
      color: #1a1a1a;
      font-size: 14px;
      font-weight: 700;
    }
    ul>li, .proportion {
      background-color: #fff;
    }
  }
  .modelOne {
    overflow: hidden;
    display: flex;
    ul {
      flex: 1;
      margin-right: 20px;
      border: 1px solid rgba(220, 233, 250, 1);
      height: 300px;
      text-align: center;
      li {
        margin-top: 40px;
        height: 100%;
        float: left;
        width: 33.33%;
        > p {
          margin-top: 10px;
          font-weight: 700;
        }
      }
    }
    .proportion {
      border: 1px solid rgba(220, 233, 250, 1);
      flex: 1;
      overflow: hidden;
      height: 300px;
      .echartBox {
        height: calc(100% - 36px);
      }
    }
  }
  .modelTwo {
    margin-top: 20px;
    ul {
      height: 300px;
      display: flex;
      li {
        border: 1px solid rgba(220, 233, 250, 1);
        flex: 1;
        height: 100%;
        .echartBox {
          height: calc(100% - 36px);
        }
        &:nth-child(1) {
          margin-right: 20px;
        }
      }
    }
  }
  .modelThree {
    margin-top: 20px;
    ul {
      height: 300px;
      display: flex;
      li {
        border: 1px solid rgba(220, 233, 250, 1);
        height: 100%;
        flex: 1;
        .echartBox {
          height: calc(100% - 36px);
        }
        &:nth-child(1) {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
