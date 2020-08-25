<template>
  <div class="pollutionCalendarPage">
    <div class="secondary-toolbar">
      <span>月份 :</span>&nbsp;
      <div class="layoutBox" style="width:200px">
        <el-date-picker
          v-model="dateRange"
          format="yyyy-MM"
          value-format="yyyy-MM"
          type="month"
          placeholder="请选择月份"
        ></el-date-picker>
      </div>&emsp;&emsp;
      <el-button @click="getData('search')">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </div>
    <el-calendar v-model="value" :first-day-of-week="7">
      <template slot="dateCell" slot-scope="{date, data}">
        <p
          :class="'calColor' + dateMap[data.day]"
        >{{data.day.split('-').slice(2).join('-') < 10 ? data.day.split('-').slice(2).join('-').replace(/\b(0+)/gi,"") : data.day.split('-').slice(2).join('-')}}</p>
      </template>
    </el-calendar>
    <div class="waterLever">
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
  name: "pollutionCalendar",
  data() {
    return {
      value: new Date(),
      dateRange: new Date().format("yyyy-MM"),
      flag: false,
      dateMap: {},
      levelCont: {}
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    stationMn: {
      get: function() {
        return this.$store.state.siteMn;
      }
    }
  },
  methods: {
    // 获取数据
    getData() {
      this.value = new Date(this.dateRange);
      this.$http
        .get("/Statistics-Service/statisticalReports/pollutionCalendar", {
          params: {
            timeType: "month",
            time: this.dateRange,
            // stationMn: 362
            stationMn: this.stationMn.stationCode
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.dateMap = res.data.content.dataList[0];
            this.levelCont = res.data.content.monthCountMap;
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.pollutionCalendarPage {
  .secondary-toolbar {
    float: right;
    border: none !important;
  }
  height: 466px;
  padding: 20px 10px;
  /deep/ .el-calendar {
    .el-calendar-table:not(.is-range) td.next,
    .el-calendar-table:not(.is-range) td.prev {
      pointer-events: none;
    }
    .el-calendar-table td.is-selected {
      background: transparent;
    }
    .el-calendar__header {
      display: none;
    }
    .el-calendar__body {
      padding: 0;
    }
    .current {
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
        border-bottom: 1px solid #ebeef5;
      }
    }
    .el-calendar-table {
      td {
        border-bottom: none;
        border-right: none;
      }
      tr:first-child td {
        border-top: none;
      }
      tr td:first-child {
        border-left: none;
      }
      thead {
        border: 1px solid #ebeef5;
        background: #f1f3f6;
      }
      thead th {
        text-align: center;
        font-size: 14px;
        color: #121212;
      }
      .el-calendar-table__row {
        .prev,
        .next {
          opacity: 0;
        }
        .current.is-today {
          color: #121212;
          background-color: transparent;
        }
      }
      .el-calendar-day {
        width: 65px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        margin: 8px auto;
        padding: 0;
        background-color: #e8e8e8;
        > p {
          font-size: 14px;
          color: #121212;
        }
      }
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