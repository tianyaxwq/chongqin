<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="secondary-page-section secondary-page-mode">
        <div class="secondary-toolbar">
          <span>国控站 :</span>&nbsp;
          <div class="layoutBox">
            <el-select v-model="value" placeholder="请选择" size="small" style="width:200px">
              <el-option
                v-for="item in optionData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>&emsp;&emsp;
          <span>时间 :</span>&nbsp;
          <div class="layoutBox" style="width:200px">
            <el-date-picker v-model="dateRange" type="month" placeholder="请选择日期"></el-date-picker>
          </div>&emsp;&emsp;
          <el-button>
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
          <el-button type="delet">
            <i class="iconfont icon-daochu"></i>导出
          </el-button>
        </div>
        <div class="reportCont currency-mode-wrap">
          <h2 class="title">光淀张庄站点考核</h2>
          <div class="smallTitle">
            <span>2020-03-01至2020-03-31</span>
          </div>
          <div class="moduleIntro" v-for="(item, index) in introduction" :key="index">
            <span v-if="index != 0" class="moduleTitle">1.{{index}} {{item.name}}</span>
            <span v-else class="moduleTitle">1、{{item.name}}</span>
            <div class="paragraph">{{item.des}}</div>
            <div v-if="index == 0" class="secondary-mode-content">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="name4" label="站点名称" align="center"></el-table-column>
                <el-table-column prop="name" label="所属行政区"></el-table-column>
                <el-table-column prop="name1" label="水质目标"></el-table-column>
                <el-table-column prop="name2" label="参与部门"></el-table-column>
                <el-table-column prop="name3" label="目标期限"></el-table-column>
              </el-table>
            </div>
            <div
              v-if="index == 1"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="bhqs" style="height: 200px; width: 100%;"></div>
            </div>
            <div
              v-if="index == 2"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="proportion" style="height: 200px; width: 100%;"></div>
            </div>
            <div
              v-if="index == 3"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="gxl" style="height: 200px; width: 100%;"></div>
            </div>
            <div
              v-if="index == 4"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="jcjg" style="height: 220px; width: 100%;"></div>
            </div>
            <div v-if="index == 5" class="secondary-mode-content">
              <el-table :data="tableData2" border>
                <el-table-column prop="spt" width="260" label="超标时间"></el-table-column>
                <el-table-column label="水温">
                  <el-table-column label="℃">
                    <template slot-scope="scope">
                      <div :class="scope.row['w01010State']">
                        <!-- {{scope.row['w01010']}} -->
                        {{scope.row.wt != 'null' ? scope.row.wt : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="PH">
                  <el-table-column label="无量纲">
                    <template slot-scope="scope">
                      <div
                        :class="scope.row['w01001State']"
                      >{{scope.row.ph != 'null' ? scope.row.ph : ''}}</div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="溶解氧">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <div :class="scope.row['w01009State']">
                        <!-- {{scope.row['w01009']}} -->
                        {{scope.row.dox != 'null' ? scope.row.dox : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="电导率">
                  <el-table-column label="μS/cm">
                    <template slot-scope="scope">
                      <div :class="scope.row['w01014State']">
                        <!-- {{scope.row['w01014']}} -->
                        {{scope.row.cond != 'null' ? scope.row.cond : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="浊度">
                  <el-table-column label="NTU">
                    <template slot-scope="scope">
                      <div :class="scope.row['w01003State']">
                        <!-- {{scope.row['w01003']}} -->
                        {{scope.row.turb != 'null' ? scope.row.turb : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="CODmn">
                  <el-table-column width="120" label="mg/L">
                    <template slot-scope="scope">
                      <div :class="scope.row['w01019State']">
                        <!-- {{scope.row['w01019']}} -->
                        {{scope.row.codmn != 'null' ? scope.row.codmn : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="氨氮">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <div :class="scope.row['w21003State']">
                        <!-- {{scope.row['w21003']}} -->
                        {{scope.row.nh3n != 'null' ? scope.row.nh3n : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="TP">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <div :class="scope.row['w21011State']">
                        <!-- {{scope.row['w21011']}} -->
                        {{scope.row.tp != 'null' ? scope.row.tp : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="TN">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <div :class="scope.row['w21001State']">
                        <!-- {{scope.row['w21001']}} -->
                        {{scope.row.tn != 'null' ? scope.row.tn : ''}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column width="150px" label="水质类别">
                  <template slot-scope="scope">
                    <span v-if=" scope.row.wq_tp === '0' ">Ⅰ类</span>
                    <span v-if=" scope.row.wq_tp === '1' ">Ⅱ类</span>
                    <span v-if=" scope.row.wq_tp === '2' ">Ⅲ类</span>
                    <span v-if=" scope.row.wq_tp === '3' ">Ⅳ类</span>
                    <span v-if=" scope.row.wq_tp === '4' ">Ⅴ类</span>
                    <span v-if=" scope.row.wq_tp === '5' ">劣Ⅴ类</span>
                  </template>
                </el-table-column>
                <el-table-column prop="wrw" width="170" label="主要污染指标"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="luokuan">
            <span>雄安新区生态环境局</span>
            <br />
            <span>2020年3月</span>
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
      gxlPieEcharts: "",
      jcjgBarEcharts: "",
      pieEcharts: "",
      lineEcharts: "",
      barEcharts: "",
      loading: true,
      dateRange: "",
      loadingTwo: true,
      introduction: [
        {
          name: "考核目标"
        },
        {
          name: "考核达标情况",
          des:
            "2020-03-01至2020-03-31，雄安新区光淀张庄总体水质达标天数为24天，不达标天数为6天，达标率为80%。"
        },
        {
          name: "水质类别占比",
          des:
            "2020-03-01至2020-03-31，雄安新区光淀张庄总体水质达到Ⅰ~Ⅱ类占62.50%,Ⅲ类占25.00%,Ⅳ类占12.50%,Ⅴ类占0.00%,劣Ⅴ类占0.00%"
        },
        {
          name: "因子贡献率",
          des:
            "2020-03-01至2020-03-31，雄安新区光淀张庄国控站所监测的TN，TP，CODmn，因子贡献率为前三，贡献率总和为48%。"
        },
        {
          name: "水质对比图"
          // des:
          // "2020-03-01至2020-03-31，雄安新区光淀张庄总氮，总磷，高锰酸盐指数，因子贡献率为前三，贡献率总和为48%"
        },
        {
          name: "数据列表"
        }
      ],
      tableData: [
        {
          name4: "光淀张庄",
          name: "安新县",
          name1: "II类",
          name2: "-",
          name3: "2020-03-31"
        }
      ],
      tableData2: [
        {
          spt: "2020年03月01日 16:00:00",
          wt: "20",
          ph: "10",
          dox: "20",
          cond: "15",
          turb: "16",
          codmn: "21",
          nh3n: "34",
          tp: "22",
          tn: "12",
          wq_tp: "1",
          wrw: "总磷"
        },
        {
          spt: "2020年03月08日 20:00:00",
          wt: "20",
          ph: "10",
          dox: "20",
          cond: "15",
          turb: "16",
          codmn: "21",
          nh3n: "34",
          tp: "22",
          tn: "12",
          wq_tp: "1",
          wrw: "总磷"
        },
        {
          spt: "2020年03月12日 12:00:00",
          wt: "20",
          ph: "10",
          dox: "20",
          cond: "15",
          turb: "16",
          codmn: "21",
          nh3n: "34",
          tp: "22",
          tn: "12",
          wq_tp: "1",
          wrw: "总磷"
        }
      ]
    };
  },
  methods: {
    setProportion() {
      this.loading = false;
      this.pieEcharts = this.$echarts.init(
        document.getElementById("proportion")
      );
      let option = {
        legend: {
          bottom: 0,
          left: "center",
          data: ["I类", "II类", "III类", "IV类", "V类", "劣V类"],
          selectedMode: false,
          itemGap: 45
        },
        tooltip: {
          show: false
        },
        series: [
          {
            type: "pie",
            radius: "70%",
            data: [
              { value: 16, name: "I类" },
              { value: 30, name: "II类" },
              { value: 20, name: "III类" },
              { value: 11, name: "IV类" },
              { value: 3, name: "V类" },
              { value: 1, name: "劣V类" }
            ],
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
              "#CCFFFF",
              "#00CCFF",
              "#11ED11",
              "#F2F213",
              "#FF9B00",
              "#FF0000"
            ]
          }
        ]
      };
      this.pieEcharts.setOption(option);
    },
    setBhqs() {
      this.loading = false;
      this.lineEcharts = this.$echarts.init(document.getElementById("bhqs"));
      let option = {
        tooltip: {
          show: false
        },
        grid: {
          top: "4%",
          left: "3%",
          right: "0.5%",
          bottom: "3%",
          containLabel: true
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [
              "03-01",
              "03-02",
              "03-03",
              "03-04",
              "03-05",
              "03-06",
              "03-07",
              "03-08",
              "03-09",
              "03-10",
              "03-11",
              "03-12",
              "03-13",
              "03-14",
              "03-15",
              "03-16",
              "03-17",
              "03-18",
              "03-19",
              "03-20",
              "03-21",
              "03-22",
              "03-23",
              "03-24",
              "03-25",
              "03-26",
              "03-27",
              "03-28",
              "03-29",
              "03-30"
            ],
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
              rotate: -70
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
            stack: "站点总销售额",
            type: "bar",
            data: [
              1,
              0,
              1,
              0,
              0,
              0,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              1,
              1,
              0,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              1,
              1,
              0,
              1,
              1,
              0,
              1
            ],
            label: {
              show: false
            },
            itemStyle: {
              color: "#20D96D"
            },
            barWidth: 6
          },
          {
            stack: "站点总销售额",
            type: "bar",
            data: [
              0,
              5,
              0,
              3,
              2,
              4,
              0,
              0,
              0,
              2,
              3,
              4,
              5,
              0,
              0,
              3,
              0,
              0,
              0,
              0,
              2,
              3,
              4,
              2,
              0,
              0,
              2,
              0,
              0,
              3,
              4
            ],
            label: {
              show: false,
              position: "inside"
            },
            itemStyle: {
              color: "#FF0000"
            },
            barWidth: 6
          },
          {
            type: "line",
            symbol: "circle",
            symbolSize: 0, //拐点大小
            itemStyle: {
              color: "#FF0000"
            },
            data: [
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
          }
        ]
      };
      this.lineEcharts.setOption(option);
    },
    setJcjg() {
      this.jcjgBarEcharts = this.$echarts.init(document.getElementById("jcjg"));
      let option = {
        tooltip: {
          show: true
        },
        legend: {
          bottom: 0,
          left: "center",
          data: ["本期", "环比", "同比", "环比率", "同比率"],
          selectedMode: false,
          itemGap: 45
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
            data: ["I类", "II类", "III类", "IV类", "V类", "劣V类"],
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
            name: "本期",
            type: "bar",
            data: [0.19, 0.24, 0.33, 0.27, 0.41, 0.8],
            label: {
              show: false
            },
            itemStyle: {
              color: "#24C768"
            },
            barWidth: 15
          },
          {
            name: "环比",
            type: "bar",
            data: [0.17, 0.22, 0.28, 0.31, 0.53, 0.78],
            label: {
              show: false
            },
            itemStyle: {
              color: "#2DD7E5"
            },
            barWidth: 15
          },
          {
            name: "同比",
            type: "bar",
            data: [0.17, 0.22, 0.28, 0.31, 0.53, 0.68],
            label: {
              show: false
            },
            itemStyle: {
              color: "#F06D28"
            },
            barWidth: 15
          },
          {
            name: "环比率",
            type: "line",
            symbol: "circle",
            symbolSize: 8, //拐点大小
            itemStyle: {
              color: "#BD23EB",
              emphasis: {
                color: "#BD23EB" //hover拐点颜色定义
              }
            },
            data: [0.47, 0.3, 0.45, 0.31, 0.73, 0.68]
          },
          {
            name: "同比率",
            type: "line",
            symbol: "circle",
            symbolSize: 8, //拐点大小
            itemStyle: {
              color: "#2889EA",
              emphasis: {
                color: "#2889EA" //hover拐点颜色定义
              }
            },
            data: [0.41, 0.38, 0.49, 0.21, 0.78, 0.65]
          }
        ]
      };
      this.jcjgBarEcharts.setOption(option);
    },
    setGxl() {
      this.gxlPieEcharts = this.$echarts.init(document.getElementById("gxl"));
      let option = {
        tooltip: {
          show: true,
          formatter: function(params, ticket, callback) {
            let showHtm = params.name + ":" + params.percent + "%"
            return showHtm;
          }
        },
        color: ["#FF8900", "#007AFF", "#23DD32", "#02D7EA", "#771EE2"],
        series: [
          {
            type: "pie",
            radius: "85%",
            center: ["50%", "50%"],
            data: [
              { value: 5, name: "高锰酸盐指数" },
              { value: 7, name: "总磷" },
              { value: 10, name: "总氮" },
              { value: 6, name: "氨氮" },
              { value: 5, name: "PH" },
              { value: 10, name: "水温" },
              { value: 9, name: "溶解氧" },
              { value: 7, name: "电导率" },
              { value: 9, name: "浊度" }
            ].sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
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
    this.setProportion();
    this.setBhqs();
    this.setJcjg();
    this.setGxl();
  },
  created() {}
};
</script>
<style lang="less" scoped>
.reportCont {
  overflow: hidden;
  padding: 30px 200px 40px;
  border: 1px solid #d9e5f6;
  // margin-top: 10px;
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
    }
  }
  .luokuan {
    padding-top: 30px;
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