<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="secondary-page-section secondary-page-mode">
        <div class="secondary-toolbar">
          <span>时间 :</span>&nbsp;
          <div class="layoutBox" style="width:200px">
            <el-date-picker
              v-model="dateRange"
              format="yyyy-MM"
              value-format="yyyy-MM"
              type="month"
              placeholder="请选择日期"
            ></el-date-picker>
          </div>&emsp;&emsp;
          <el-button @click="getTabelHeadData">
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
          <el-button type="delet" @click="getPdf('超标事件报告')">
            <i class="iconfont icon-daochu"></i>导出
          </el-button>
        </div>
        <div class="reportCont currency-mode-wrap" id="pdfDom">
          <h2 class="title">超标事件报告</h2>
          <div class="secondary-mode-content">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="stnm" label="当期站点" align="center"></el-table-column>
              <el-table-column prop="time" label="监测时间"></el-table-column>
            </el-table>
          </div>
          <div class="moduleIntro" v-for="(item, index) in introduction" :key="index">
            <span class="moduleTitle">{{index + 1}}、{{item.name}}</span>
            <div class="paragraph">{{item.des}}</div>
            <div v-if="index == 0" class="secondary-mode-content">
              <el-table :data="tableData3" border style="width: 100%">
                <el-table-column prop="stnm" label="站点名称" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.stnm ? scope.row.stnm : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="spt" width="240" label="超标时间">
                  <template slot-scope="scope">
                    <span>{{scope.row.spt ? scope.row.spt : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="overweightRating" label="超标等级">
                  <template slot-scope="scope">
                    <span>{{scope.row.overweightRating ? scope.row.overweightRating : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="overweightMessage" label="超标内容" width="450">
                  <template slot-scope="scope">
                    <span>{{scope.row.overweightMessage ? scope.row.overweightMessage : '--'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="index == 1" class="secondary-mode-content">
              <el-table :data="tableData2" border>
                <el-table-column prop="spt" width="220" label="超标时间">
                  <template slot-scope="scope">
                    <span>{{scope.row.spt ? scope.row.spt : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="item.monitoring_factor_nm"
                  v-for="(item, index) in tableHeadData"
                  :key="index"
                >
                  <el-table-column :label="item.monitoring_factor_dw" align="center">
                    <template slot-scope="scope">{{scope.row.cd}}</template>
                  </el-table-column>
                </el-table-column>
                <!-- <el-table-column label="水温">
                  <el-table-column label="℃">
                    <template slot-scope="scope">
                      <span>{{scope.row.wt ? scope.row.wt : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="pH">
                  <el-table-column label="无量纲">
                    <template slot-scope="scope">
                      <span>{{scope.row.ph ? scope.row.ph : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="溶解氧">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <span>{{scope.row.dox ? scope.row.dox : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="电导率">
                  <el-table-column label="μS/cm">
                    <template slot-scope="scope">
                      <span>{{scope.row.cond ? scope.row.cond : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="浊度">
                  <el-table-column label="NTU">
                    <template slot-scope="scope">
                      <span>{{scope.row.turb ? scope.row.turb : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="CODmn">
                  <el-table-column width="120" label="mg/L">
                    <template slot-scope="scope">
                      <span>{{scope.row.codmn ? scope.row.codmn : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="氨氮">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <span>{{scope.row.nh3n ? scope.row.nh3n : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="TP">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <span>{{scope.row.tp ? scope.row.tp : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="TN">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">
                      <span>{{scope.row.tn ? scope.row.tn : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>-->
                <el-table-column width="150px" label="水质类别">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.level"
                      class="target-level"
                      :class="getColor(scope.row.level)"
                    >{{scope.row.level == "I类" ? 'Ⅰ' : scope.row.level == "II类" ? 'Ⅱ' : scope.row.level == "III类" ? 'Ⅲ' : scope.row.level == "IV类" ? 'Ⅳ' : scope.row.level == "V类" ? 'Ⅴ' : scope.row.level == "劣V类" ? '劣Ⅴ' : ''}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column prop="keyPollution" width="170" label="主要污染指标">
                  <template slot-scope="scope">
                    <span>{{scope.row.keyPollution ? scope.row.keyPollution : '--'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-if="index == 2"
              class="secondary-mode-content"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div class="noEcharts" v-if="bqDataStatus == 'no'">
                <span>暂无数据</span>
              </div>
              <div
                id="gxl"
                style="height: 200px; width: 100%;"
                :style="!bqDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
              <div class="legendTitle">本期因子占比图</div>
            </div>
            <div
              v-if="index == 2"
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
                id="jcjg"
                style="height: 220px; width: 100%;"
                :style="!proportionDataStatus?'opacity:1;':'opacity:0;'"
              ></div>
              <div class="legendTitle">同期因子占比图</div>
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
      gxlPieEcharts: "",
      jcjgBarEcharts: "",
      loading: false,
      dateRange: "",
      introduction: [
        {
          name: "站点超标汇总",
          des: ""
        },
        {
          name: "站点监测项目清单",
          des: ""
          // 总共4个超标天数。超标天数的首要污染物为总氮，指数为（1.78mg/L）。
        },
        {
          name: "站点超标监测结果本期与同期"
        }
      ],
      tableData: [],
      tableData2: [],
      tableData3: [],
      bqDataStatus: "zanwu",
      proportionDataStatus: "zanwu",
      tableHeadData: [],
      factors: [],
      stationId: ""
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
            let factorList = []
            this.tableHeadData.map(el => {
              factorList.push(el.cd)
            })
            this.factors = factorList
            this.getData();
          }
        })
        .catch(error => {});
    },
    // 获取数据
    getData() {
      this.loading = true;
      this.$http
        .get("/Statistics-Service/reportManage/exceedingStandard", {
          params: {
            timeType: "month",
            time: this.dateRange,
            // stationMn: 362
            stationMn: this.stationId,
            factorList: this.factors.join(",")
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.tableData = res.data.content.dataList1;
            this.tableData3 = res.data.content.siteExcessiveListMap;
            this.tableData2 = res.data.content.projectListMap;
            this.introduction.map(el => {
              if (el.name == "站点超标汇总") {
                el.des = res.data.content.siteExcessiveMessage;
              }
            });
            this.setGxl(res.data.content.dqFactorOfMap);
            this.setJcjg(res.data.content.tbFactorOfMap);
          }
        })
        .catch(error => {});
    },
    // 同期因子
    setJcjg(list) {
      if (JSON.stringify(list) == "{}") {
        this.proportionDataStatus = "no";
        return;
      } else {
        this.proportionDataStatus = "";
      }
      let seriesData = [];
      for (let i in list) {
        seriesData.push({
          value: list[i],
          name: i
        });
      }
      this.jcjgBarEcharts = this.$echarts.init(document.getElementById("jcjg"));
      let option = {
        tooltip: {
          show: true,
          formatter: function(params, ticket, callback) {
            let showHtm = params.name + ":" + params.percent + "%";
            return showHtm;
          }
        },
        color: ["#007AFF", "#02D7EA", "#23DD32", "#FF8900", "#771EE2"],
        series: [
          {
            type: "pie",
            radius: "85%",
            center: ["50%", "50%"],
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
      this.jcjgBarEcharts.setOption(option);
    },
    // 本期因子
    setGxl(list) {
      if (JSON.stringify(list) == "{}") {
        this.bqDataStatus = "no";
        return;
      } else {
        this.bqDataStatus = "";
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
            center: ["50%", "50%"],
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
  mounted() {},
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
  .title {
    text-align: center;
    font-size: 20px;
    color: #1a1a1a;
    padding: 5px 0;
  }
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
        padding: 45px 0;
      }
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