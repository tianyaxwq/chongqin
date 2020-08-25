<template>
  <div id="calender">
    <div id="calender_body">
      <table>
        <tr class="head">
          <td v-for="(head,key) in heads" :key="key">{{head}}</td>
        </tr>
        <tr v-for="(item1,key1) in show" :key="key1">
          <td
            :class="{ now:item2.now,last_month:item2.attr == 'last_month',next_month:item2.attr == 'next_month'}"
            v-for="(item2,key2) in item1 "
            :key="key2"
          >
            <div class="cell">
              <span v-if="item2.now" class="currentDay"></span>
              <p>{{item2.num}}</p>
              <p>{{item2.dateNl}}</p>
              <p>{{item2.datetime}}</p>
              <slot :row="item2"></slot>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
 
<script>
import tTN from "../assets/js/timeToN";
export default {
  name: "YfCalender",
  props: ["carDate"],
  data() {
    return {
      body: "",
      header: "",
      currentYear: "",
      currentMonth: "",
      currentDay: "",
      heads: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ],
      datas: new Array(),
      show: new Array(),
      visible: false
    };
  },
  created() {
    this.setCalender(new Date(this.carDate));
  },

  methods: {
    initline: function() {
      this.datas = new Array();
      this.show = new Array();
    },

    getcurrentDates: function(calender_Date) {
      //传入正常的Date（）类型数据
      this.initline();
      var months = calender_Date.getMonth();
      months = months + 1;
      calender_Date.setMonth(months);
      calender_Date.setDate(0);
      return calender_Date.getDate();
    },
    getlastDates: function(calenderdDate) {
      //传入正常的Date（）类型数据
      var curDate = calenderdDate;
      curDate.setDate(0);
      return curDate.getDate();
    },
    left: function() {
      this.initline();
      var yy = this.currentYear;
      var mm = this.currentMonth;
      var dd = 1;
      if (yy == new Date().getFullYear() && mm == new Date().getMonth() + 1) {
        dd = new Date().getDate();
      }
      if (mm == 0) {
        mm = 12;
        yy = yy - 1;
        this.currentMonth = mm;
        this.currentYear = yy;
      }
      var calenderrDate = yy + "/" + mm + "/" + dd;
      this.setCalender(new Date(calenderrDate));
    },
    right: function() {
      this.initline();
      var yy = this.currentYear;
      var mm = this.currentMonth + 2;
      var dd = 1;
      if (yy == new Date().getFullYear() && mm == new Date().getMonth() + 1) {
        dd = new Date().getDate();
      }
      if (mm > 12) {
        mm = 1;
        yy++;
        this.currentMonth = mm;
        this.currentYear = yy;
      }
      var calender__Date = yy + "/" + mm + "/" + dd;
      this.setCalender(new Date(calender__Date));
    },
    setCalender: function(dateNow) {
      //显示日历部分

      var firstday;
      var today = dateNow;
      var yy = today.getFullYear();
      this.currentYear = yy;
      var mm = today.getMonth() + 1; //today=2;mm=3
      this.currentMonth = mm - 1; //this.curr=2
      var dd = today.getDate();
      var cyy = new Date().getFullYear();
      var cdd = new Date().getDate();
      var cmm = new Date().getMonth() + 1;
      this.currentDay = dd; //30

      firstday = yy + "/" + mm + "/1"; //2018-3-1
      //本月第一天是星期几,也表示前面有几个空的天数
      var firstday_day = new Date(firstday).getDay();
      //日历头
      this.header = yy + "年" + mm + "月";
      var cur_days = this.getcurrentDates(today);
      //上一月有多少天
      var last_days = this.getlastDates(dateNow);

      //上个月从哪天开始出现
      var last_first_day = last_days - firstday_day + 1;
      //firstline
      //存上个月的日期

      for (var i = last_first_day; i <= last_days; i++) {
        var date = new Object();
        date.num = i;
        date.attr = "last_month";
        if (this.currentMonth === 0) {
          date.datetime = this.currentYear - 1 + "/" + "12/" + i;
          date.dateNl = this.getN(this.currentYear - 1, 11, i);
        } else {
          date.datetime = this.currentYear + "/" + this.currentMonth + "/" + i;
          date.dateNl = this.getN(this.currentYear, this.currentMonth - 1, i);
        }

        this.datas.push(date);
        // this.dateData.firstline.push(date);
      }

      //temp存放换行前上一个数据
      //下一行第一个数字
      var num_second = 7 - firstday_day + 1;
      //存本月日期
      for (var i = 1; i <= cur_days; i++) {
        var date = new Object();
        date.num = i;
        date.attr = "this_month";

        date.datetime =
          this.currentYear + "/" + (this.currentMonth + 1) + "/" + i;
        date.dateNl = this.getN(this.currentYear, this.currentMonth, i);
        if (i == cdd && cmm == mm && yy == cyy) {
          date.now = true;
        }
        this.datas.push(date);
      }
      //存下个月的日期
      for (
        var i = 1;
        i <= 42 - cur_days - (last_days - last_first_day + 1);
        i++
      ) {
        var date = new Object();
        date.num = i;
        if (this.currentMonth + 2 > 12) {
          date.datetime = this.currentYear + 1 + "/" + "1/" + i;
          date.dateNl = this.getN(this.currentYear + 1, 0, i);
        } else {
          date.datetime =
            this.currentYear + "/" + (this.currentMonth + 2) + "/" + i;
          date.dateNl = this.getN(this.currentYear, this.currentMonth, i);
        }

        date.attr = "next_month";
        this.datas.push(date);
      }

      var k = 0;
      for (var i = 0; i < 6; i++) {
        var line = new Array();
        for (var j = 0; j < 7; j++) {
          line.push(this.datas[k++]);
        }
        this.show.push(line);
      }
      var thisarr = [];
      for (let i in this.show) {
        for (let j in this.show[i]) {
          thisarr.push(this.show[i][j].datetime);
        }
      }
    },
    //农历时间
    getN(y, m, n) {
      let Nl = tTN.solar2lunar(y, m + 1, n).IDayCn;
      if (Nl === "初一") {
        return tTN.solar2lunar(y, m + 1, n).IMonthCn;
      }
      return Nl;
    },
    httpRequst() {
      let arr = [
        { attr: "last_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 },
        { attr: "this_month", dateNl: "廿七", datetime: "2019/3/31", num: 31 }
      ];
    }
  },
  watch: {
    carDate: {
      handler(newValue, oldValue) {
        this.setCalender(new Date(newValue));
      }
    }
  }
};
</script>
<style lang="less">
@red: #999;
@gray: rgb(248, 248, 248);

#calender {
  overflow: auto;
  position: relative;
  top: 0px;

  left: 0px;
  width: 100%;
  background: #fff;
  // border: 2px solid #57abff;
  height: 100%;
  #celender_head {
    height: 40px;
    width: 490px;
    text-align: center;

    position: relative;
    .celender_head {
      line-height: 40px;
      text-align: center;
      height: 40px;

      p {
        color: #1a1a1a;
      }
    }
    .closespan {
      position: absolute;
      width: 28px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      background: #ecf4fc;
      right: 0px;
      top: 0px;
      cursor: pointer;
    }
    #left {
      height: 40px;
      width: 40px;
      cursor: pointer;
      display: inline-block;
    }

    #celender_head_inner {
      height: 40px;
      width: 80px;

      margin-left: 60px;
      line-height: 20px;
      display: inline-block;
    }

    #right {
      height: 40px;
      width: 40px;
      cursor: pointer;
      margin-left: 60px;
      display: inline-block;
    }

    p {
      color: white;
      font-size: 10px;
      text-align: center;
    }
  }

  #calender_body {
    height: 100%;
    .head td {
      height: 31px;
      text-align: center;
      padding: 6px 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      height: calc(100% - 6px);
      td {
        border: 1px solid #c9d8ea;
      }
    }

    td {
      padding: 0px;
      vertical-align: top;
      text-align: left;

      position: relative;
      overflow: hidden;
      .cell {
        padding: 8px;
        .currentDay {
          width: 32px;
          height: 32px;
          background: #166bce;
          border-radius: 50%;
          position: absolute;
          top: -14px;
          right: -14px;
        }
      }

      //line-height: 80px;

      span {
        display: inline-block;
        width: 100%;
        &:nth-child(2) {
          height: 28px;
          line-height: 28px;
          font-weight: 700;
        }
      }
      .isaudit {
        color: #87c925;
      }
      .noaudit {
        color: #e5a23d;
      }

      &.now {
        color: #166bce;
      }
    }
    .last_month {
      color: #999;
    }

    .next_month {
      color: #999;
    }
  }

  #calender_foot {
    background-color: @gray;
    text-align: center;
    line-height: 40px;
    p {
      color: blue;
      font-size: 10px;
    }
  }
}
</style>