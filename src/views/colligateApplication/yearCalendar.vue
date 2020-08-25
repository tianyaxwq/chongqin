<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <el-scrollbar style="height: 100%">
        <div class="secondary-toolbar">
          <span>年份 :</span>&nbsp;
          <div class="layoutBox" style="width:200px">
            <el-date-picker
              @change="dateChange"
              v-model="dateRange"
              format="yyyy"
              value-format="yyyy"
              type="year"
              placeholder="请选择年份"
            ></el-date-picker>
          </div>&emsp;&emsp;
          <el-button @click="getData('search')">
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
        </div>
        <div class="currency-mode-wrap calendar">
          <div class="title">
            <div class="titleCont">
              <img src="../../assets/images/companyDetail/calIcon.png" alt />
              <span>{{stationName}}{{titleTime}}水质年历图</span>
              <img src="../../assets/images/companyDetail/calIcon.png" alt />
            </div>
            <div class="waterLever waterLeverAll">
              <span>全年水质情况：</span>
              <div>
                <span>I类:</span>
                <span style="background:#CCFFFF">{{dateMapAll.firstCountAll || 0}}</span>
              </div>
              <div>
                <span>II类:</span>
                <span style="background:#00CCFF">{{dateMapAll.secondCountAll || 0}}</span>
              </div>
              <div>
                <span>III类:</span>
                <span style="background:#00FF00">{{dateMapAll.threeCountAll || 0}}</span>
              </div>
              <div>
                <span>IV类:</span>
                <span style="background:#FFFF00">{{dateMapAll.fourCountAll || 0}}</span>
              </div>
              <div>
                <span>V类:</span>
                <span style="background:#FF9B00">{{dateMapAll.fiveCountAll || 0}}</span>
              </div>
              <div>
                <span>劣V类:</span>
                <span style="background:#FF0000">{{dateMapAll.sixCountAll || 0}}</span>
              </div>
            </div>
          </div>

          <div
            style="background-color: #fff; position:relative;"
            :style="bqDataStatus == 'no' ? 'height: 100%' : ''"
          >
            <div style="padding: 0 20px; display: flex;" v-if="!bqDataStatus">
              <div v-for="(item, index) in calendarList" :key="index" class="calendarDiv">
                <h3>{{item.name}}</h3>
                <el-calendar :first-day-of-week="7" v-model="item.value">
                  <template slot="dateCell" slot-scope="{date, data}">
                    <el-popover
                      placement="top-start"
                      :title="data.day"
                      width="150"
                      trigger="hover"
                    >
                      <div>WQI: --</div>
                      <div>水质类别： {{dateMap[data.day] == 0 ? 'I类' : dateMap[data.day] == 1 ? 'II类' : dateMap[data.day] == 2 ? 'III类' : dateMap[data.day] == 3 ? 'IV类' : dateMap[data.day] == 4 ? 'V类' : dateMap[data.day] == 5 ? '劣V类' : '--'}}</div>
                      <p
                        slot="reference"
                        :class="'calColor' + dateMap[data.day]"
                      >{{data.day.split('-').slice(2).join('-') < 10 ? data.day.split('-').slice(2).join('-').replace(/\b(0+)/gi,"") : data.day.split('-').slice(2).join('-')}}</p>
                    </el-popover>
                  </template>
                </el-calendar>
                <div class="waterLever">
                  <div>
                    <span>I类:</span>
                    <span style="background:#CCFFFF">{{item.firstCount || 0}}</span>
                  </div>
                  <div>
                    <span>II类:</span>
                    <span style="background:#00CCFF">{{item.secondCount || 0}}</span>
                  </div>
                  <div>
                    <span>III类:</span>
                    <span style="background:#00FF00">{{item.threeCount || 0}}</span>
                  </div>
                  <div>
                    <span>IV类:</span>
                    <span style="background:#FFFF00">{{item.fourCount || 0}}</span>
                  </div>
                  <div>
                    <span>V类:</span>
                    <span style="background:#FF9B00">{{item.fiveCount || 0}}</span>
                  </div>
                  <div>
                    <span>劣V类:</span>
                    <span style="background:#FF0000">{{item.sixCount || 0}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style="padding: 0 20px; display: flex;" v-if="!bqDataStatus">
              <div v-for="(item, index) in calendarListTwo" :key="index" class="calendarDiv">
                <h3>{{item.name}}</h3>
                <el-calendar :first-day-of-week="7" v-model="item.value">
                  <template slot="dateCell" slot-scope="{date, data}">
                    <el-popover
                      placement="top-start"
                      :title="data.day"
                      width="150"
                      trigger="hover"
                    >
                      <div>WQI: --</div>
                      <div>水质类别： {{dateMap[data.day] == 0 ? 'I类' : dateMap[data.day] == 1 ? 'II类' : dateMap[data.day] == 2 ? 'III类' : dateMap[data.day] == 3 ? 'IV类' : dateMap[data.day] == 4 ? 'V类' : dateMap[data.day] == 5 ? '劣V类' : '--'}}</div>
                      <p
                        slot="reference"
                        :class="'calColor' + dateMap[data.day]"
                      >{{data.day.split('-').slice(2).join('-') < 10 ? data.day.split('-').slice(2).join('-').replace(/\b(0+)/gi,"") : data.day.split('-').slice(2).join('-')}}</p>
                    </el-popover>
                  </template>
                </el-calendar>
                <div class="waterLever">
                  <div>
                    <span>I类:</span>
                    <span style="background:#CCFFFF">{{item.firstCount || 0}}</span>
                  </div>
                  <div>
                    <span>II类:</span>
                    <span style="background:#00CCFF">{{item.secondCount || 0}}</span>
                  </div>
                  <div>
                    <span>III类:</span>
                    <span style="background:#00FF00">{{item.threeCount || 0}}</span>
                  </div>
                  <div>
                    <span>IV类:</span>
                    <span style="background:#FFFF00">{{item.fourCount || 0}}</span>
                  </div>
                  <div>
                    <span>V类:</span>
                    <span style="background:#FF9B00">{{item.fiveCount || 0}}</span>
                  </div>
                  <div>
                    <span>劣V类:</span>
                    <span style="background:#FF0000">{{item.sixCount || 0}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style="padding: 0 20px; display: flex;" v-if="!bqDataStatus">
              <div v-for="(item, index) in calendarListThree" :key="index" class="calendarDiv">
                <h3>{{item.name}}</h3>
                <el-calendar :first-day-of-week="7" v-model="item.value">
                  <template slot="dateCell" slot-scope="{date, data}">
                    <el-popover
                      placement="top-start"
                      :title="data.day"
                      width="150"
                      trigger="hover"
                    >
                      <div>WQI: --</div>
                      <div>水质类别： {{dateMap[data.day] == 0 ? 'I类' : dateMap[data.day] == 1 ? 'II类' : dateMap[data.day] == 2 ? 'III类' : dateMap[data.day] == 3 ? 'IV类' : dateMap[data.day] == 4 ? 'V类' : dateMap[data.day] == 5 ? '劣V类' : '--'}}</div>
                      <p
                        slot="reference"
                        :class="'calColor' + dateMap[data.day]"
                      >{{data.day.split('-').slice(2).join('-') < 10 ? data.day.split('-').slice(2).join('-').replace(/\b(0+)/gi,"") : data.day.split('-').slice(2).join('-')}}</p>
                    </el-popover>
                  </template>
                </el-calendar>
                <div class="waterLever">
                  <div>
                    <span>I类:</span>
                    <span style="background:#CCFFFF">{{item.firstCount || 0}}</span>
                  </div>
                  <div>
                    <span>II类:</span>
                    <span style="background:#00CCFF">{{item.secondCount || 0}}</span>
                  </div>
                  <div>
                    <span>III类:</span>
                    <span style="background:#00FF00">{{item.threeCount || 0}}</span>
                  </div>
                  <div>
                    <span>IV类:</span>
                    <span style="background:#FFFF00">{{item.fourCount || 0}}</span>
                  </div>
                  <div>
                    <span>V类:</span>
                    <span style="background:#FF9B00">{{item.fiveCount || 0}}</span>
                  </div>
                  <div>
                    <span>劣V类:</span>
                    <span style="background:#FF0000">{{item.sixCount || 0}}</span>
                  </div>
                </div>
              </div>
            </div>

            <yf-Datastatus :dataStatus="bqDataStatus" v-if="bqDataStatus == 'no'"></yf-Datastatus>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      codeBr: '\n',
      bqDataStatus: "",
      dateRange: "2020",
      dateMapAll: {},
      stationName: "",
      stationId: "",
      dataList: [],
      dateMap: {},
      calendarList: [],
      calendarListTwo: [],
      calendarListThree: [],
      flag: false
    };
  },
  watch: {
    stationInfo(value) {
      this.stationId = value[0].nodeId;
      this.stationName = value[0].nodeName;
      this.getData();
    }
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    }
  },
  methods: {
    //切换年份
    dateChange(val) {
      this.flag = false;
    },
    // 获取数据
    getData(flag) {
      if (flag == "search") {
        this.flag = true;
        this.titleTime = new Date(this.dateRange).format("yyyy");
      } else if (flag == undefined) {
        this.flag = false;
        this.titleTime = new Date(this.dateRange).format("yyyy");
      }
      this.$http
        .get(
          "/Statistics-Service/statisticalReports/siteWaterQualityYearCharts",
          {
            params: {
              stationMn: this.stationId,
              time: this.dateRange,
              timeType: "year"
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.bqDataStatus = "";
            this.dataList = res.data.content;
            this.calendarList = [];
            this.calendarListTwo = [];
            this.calendarListThree = [];
            this.dataList.map((el, index) => {
              let monthD = [
                "一",
                "二",
                "三",
                "四",
                "五",
                "六",
                "七",
                "八",
                "九",
                "十",
                "十一",
                "十二"
              ];
              let year = this.dateRange;
              if (index < 4) {
                let {
                  firstCount,
                  secondCount,
                  threeCount,
                  fourCount,
                  fiveCount,
                  sixCount
                } = el;
                let data = {
                  name: monthD[index] + "月",
                  value: new Date(Number(year), index),
                  firstCount,
                  secondCount,
                  threeCount,
                  fourCount,
                  fiveCount,
                  sixCount
                };
                this.calendarList.push(data);
              } else if (index >= 4 && index < 8) {
                let {
                  firstCount,
                  secondCount,
                  threeCount,
                  fourCount,
                  fiveCount,
                  sixCount
                } = el;
                let data = {
                  name: monthD[index] + "月",
                  value: new Date(Number(year), index),
                  firstCount,
                  secondCount,
                  threeCount,
                  fourCount,
                  fiveCount,
                  sixCount
                };
                this.calendarListTwo.push(data);
              } else if (index >= 8 && index < 12) {
                let {
                  firstCount,
                  secondCount,
                  threeCount,
                  fourCount,
                  fiveCount,
                  sixCount
                } = el;
                let data = {
                  name: monthD[index] + "月",
                  value: new Date(Number(year), index),
                  firstCount,
                  secondCount,
                  threeCount,
                  fourCount,
                  fiveCount,
                  sixCount
                };
                this.calendarListThree.push(data);
              } else if (index == this.dataList.length - 2) {
                this.dateMap = el;
              } else if (index == this.dataList.length - 1) {
                this.dateMapAll = el;
              }
            });
          } else {
            this.bqDataStatus = "no";
          }
        })
        .catch(err => {
          this.bqDataStatus = "no";
        });
    }
  },
  mounted() {},
  created() {}
};
</script>
<style lang="less" scoped>
/deep/ .el-scrollbar__view {
  height: 100%;
}
.title {
  padding: 15px 0;
  position: relative;
  .titleCont {
    font-size: 18px;
    font-weight: bold;
    color: #0f80e8;
    padding-left: 20px;
    > img {
      padding: 0 10px;
      &:last-child {
        transform: rotate(180deg);
      }
    }
  }
}
.waterLeverAll {
  position: absolute;
  top: 15px;
  right: 20px;
  > span {
    float: left;
    padding-top: 5px;
    margin-right: -15px;
  }
  > div {
    width: auto !important;
    margin-top: 0 !important;
  }
}
.waterLever {
  font-size: 12px;
  color: #666666;
  overflow: hidden;
  > div {
    float: left;
    margin-top: 10px;
    width: 33%;
    text-align: center;
    span {
      padding: 5px 0;
      &:first-child {
        display: inline-block;
        width: 40px;
        text-align: right;
      }
      &:last-child {
        padding: 2px 10px;
        border-radius: 3px;
        color: #000;
        background-color: #ccffff;
      }
    }
  }
}
.calendarDiv {
  margin-right: 15px;
  margin-bottom: 25px;
  flex: 1;
  > h3 {
    color: #121212;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    background-color: #f0f5fc;
    padding: 10px 0;
  }
  /deep/ .el-calendar {
    .el-calendar-table:not(.is-range) td.next,
    .el-calendar-table:not(.is-range) td.prev {
      pointer-events: none;
    }
    .el-calendar__body {
      padding: 0 10px;
    }
    .el-calendar-table {
      th {
        font-size: 14px;
        font-weight: bold;
        color: #121212;
      }
    }
    .el-calendar-table tr:first-child td {
      border-top: none;
    }
    background-color: #f0f5fc;
    /deep/ .el-calendar__header {
      display: none;
    }
    /deep/ .el-calendar-table__row {
      .prev,
      .next {
        background-color: #f0f5fc;
        color: #f0f5fc;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: none;
      }
      /deep/.is-today {
        color: #1a1a1a;
      }
      /deep/.current {
        .calColor-1 {
          background-color: #d3d3d3;
        }
        .calColor0 {
          background-color: #ccffff;
        }
        .calColor1 {
          background-color: #00ccff;
        }
        .calColor2 {
          background-color: #00ff00;
        }
        .calColor3 {
          background-color: #ffff00;
        }
        .calColor4 {
          background-color: #ff9b00;
        }
        .calColor5 {
          background-color: #ff0000;
        }
        .el-calendar-day {
          background-color: #d3d3d3;
          border-bottom: 1px solid #ebeef5;
        }
      }
      /deep/.el-calendar-day {
        height: 25px;
        padding: 0;
        text-align: center;
        line-height: 25px;
        > td {
          border-left: 1px solid #ebeef5;
        }
        > span {
          font-size: 12px;
        }
      }
    }
  }
  &:last-child {
    margin-right: 0;
  }
}
</style>