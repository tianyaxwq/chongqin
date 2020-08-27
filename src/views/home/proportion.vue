<template>
  <div class="proportionPage">
    <div class="showChart">
      <span>监测因子：</span>
      <div class="layoutBox" style="width:110px">
        <el-select v-model="factorModel" @change="changeChart" placeholder="请选择">
          <el-option
            v-for="item in optionData"
            :key="item.str"
            :label="item.label"
            :value="item.str"
          ></el-option>
        </el-select>
      </div>
      <p>近30天水质类别分析1</p>
      <div id="point-statistics" style="width:100%;height: 360px;"></div>
    </div>
    <div class="waterLever">
      <div>
        <span>无:</span>
        <span style="background:#E8E8E8">{{levelCont['-'] || 0}}</span>
      </div>
      <div>
        <span>I类:</span>
        <span style="background:#CCFFFF">{{levelCont['I类'] || 0}}</span>
      </div>
      <div>
        <span>II类:</span>
        <span style="background:#00CCFF">{{levelCont['II类'] || 0}}</span>
      </div>
      <div>
        <span>III类:</span>
        <span style="background:#00FF00">{{levelCont['III类'] || 0}}</span>
      </div>
      <div>
        <span>IV类:</span>
        <span style="background:#FFFF00">{{levelCont['IV类'] || 0}}</span>
      </div>
      <div>
        <span>V类:</span>
        <span style="background:#FF9B00">{{levelCont['V类'] || 0}}</span>
      </div>
      <div>
        <span>劣V类:</span>
        <span style="background:#FF0000">{{levelCont['劣V类'] || 0}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "proportion",
  data() {
    return {
      flag: false,
      levelCont: {},
      optionData: [],
      factorModel: "",
      myCharts: {}
    };
  },
  mounted() {
    this.getTabelHeadData()
    this.getChart();
  },
  computed: {
    stationMn: {
      get: function() {
        return this.$store.state.siteMn;
      }
    }
  },
  methods: {
    changeChart(value) {
      this.myCharts.clear()
      this.getChart()
      console.log(value,"value值")
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
            this.optionData = [{
              label: "全部",
              str: "all",
              isTrue: true
            }];
            res.data.content.dataList.map((el, index) => {
              this.optionData.push({
                label: el.monitoring_factor_nm,
                str: el.cd,
                isTrue: false
              });
            });
            //this.historicalDataSearch();
            this.factorModel = this.optionData[0].str;
          } else {
          }
        })
        .catch(error => {
        });
    },
    getChart() {
      let pointPosition = [];
      let sum = 0
      let defaultParcent = ""
      this.$http
        .get("/Statistics-Service/statisticalReports/waterQualityRate", {
          params: {
            timeType: "day",
            time: new Date(new Date().getTime() - 3600 * 1000 * 24 * 30).format(
              "yyyy-MM-dd"
            ),
            // stationMn: 362
            stationMn: this.stationMn.stationCode
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.levelCont = res.data.content.monthCountMap;
            for (var i in this.levelCont) {
              sum += this.levelCont[i]
              pointPosition.push({
                name: i,
                value: this.levelCont[i]
              });
            }
            defaultParcent = (this.levelCont['-'] / sum).toFixed(1) * 100
            this.myCharts = this.$echarts.init(
              document.getElementById("point-statistics")
            );
            let option = {
              title: {
                text: "占比率",
                x: "49%",
                y: "43%",
                textStyle: {
                  color: "#03F256",
                  fontWeight: "100",
                  fontSize: 14
                },
                itemGap: 8,
                subtext: defaultParcent + "%",
                subtextStyle: {
                  color: "#03F256",
                  fontSize: 24
                },
                textAlign: "center"
              },
              color: [
                "#CCFFFF",
                "#00CCFF",
                "#00FF00",
                "#FFFF00",
                "#FF9B00",
                "#FF0000",
                "#E8E8E8",
              ],
              tooltip: {
                trigger: "item",
                //   formatter: "{a} <br/>{b}: {c} ({d}%)",
                formatter: function(data) {
                    return (
                      data.percent.toFixed(1) +
                      "%" +
                      "\n" +
                      "(" +
                      data.value +
                      "天)"
                    );
                },
                show: false
              },
              series: [
                {
                  type: "pie",
                  radius: ["40%", "55%"],
                  avoidLabelOverlap: true,
                  hoverOffset: 3,
                  startAngle: 55,
                  label: {
                    formatter: function(data) {
                      if( data.percent > 0 ) {
                        return (
                          data.percent.toFixed(1) +
                          "%" +
                          "\n" +
                          "(" +
                          data.value +
                          "天)"
                        );
                      } else {
                        return ""
                      }
                    },
                    color: '#000000'
                  },
                  labelLine: {
                    length: 1,
                    length2: 1
                  },
                  data: pointPosition
                }
              ]
            };
            this.myCharts.setOption(option);
            let that = this
            this.myCharts.on("mouseover", function(params) {
              params.percent = params.percent.toFixed(1);
              that.myCharts.setOption({
                title: {
                  text: "占比率",
                  subtext: params.percent + "%"
                }
              });
            });
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.proportionPage {
  height: 466px;
  padding: 20px 10px;
  .showChart {
    > p {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }
  .waterLever {
    display: flex;
    justify-content: center;
    overflow: hidden;
    > div {
      float: left;
      margin-right: 5px;
      > span {
        &:first-child {
          color: #666666;
        }
        &:last-child {
          display: inline-block;
          width: 25px;
          height: 20px;
          color: #333333;
          font-size: 13px;
          text-align: center;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
