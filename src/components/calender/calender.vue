<template>
<el-popover
  placement="bottom-start"
  width="500"
  popper-class='calender_popper'
  v-model="visible">
  <div>
      <div id="calender">
            <div id="celender_head">
                    <div id="left" class="celender_head" @click="left()">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div id="celender_head_inner" class="celender_head"><p >{{header}}</p></div>
                    <div id="right" class="celender_head" @click="right()">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <span class="closespan" @click="visible=false">  
                        <i class="iconfont icon-guanbi"></i>
                    </span>
            </div>
            <div id="calender_body">
                    <table>
                        <tr class='head'>
                            <td v-for="(head,key) in heads" :key="key">{{head}}</td>
                        </tr>
                        <tr v-for="(item1,key1) in show" :key="key1">
                          <td :class="{now: item2.now, last_month:item2.attr == 'last_month',next_month:item2.attr == 'next_month'}" v-for="(item2,key2) in item1 " :key="key2" @click="goCurrentDay(item2)">
                           <span> {{item2.num}} </span>
                           <span :class="item2.status=='已审核'?'isaudit':'noaudit'">{{item2.status}}</span>
                          </td>
                        </tr>
                    </table>
            </div>
      </div>
  </div>

  <el-button slot="reference">日历</el-button>
</el-popover>
 
</template>
 
<script>
export default {
  name: "YfCalender",
  props:['mn'],
  data() {
    return {
      body: "",
      header: "",
      currentYear: "",
      currentMonth: "",
      currentDay: "",
      heads: ["日", "一", "二", "三", "四", "五", "六"],
      datas: new Array(),
      show: new Array(),
      visible: false
    };
  },
  created() {
    this.setCalender(new Date());
    
  },

  methods: {
    goCurrentDay(item){
      let _now = Date.now();
      if(new Date(item.datetime).getTime() > _now){
        return false;
      };
      this.visible=false;
      this.$emit('getchildDate',item.datetime)
    },
    initline: function() {
      this.datas = new Array();
      this.show = new Array();
    },
    backToday: function() {
      this.setCalender(new Date());
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
      var calenderrDate = yy + "-" + mm + "-" + dd;
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
      var calender__Date = yy + "-" + mm + "-" + dd;
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
      this.currentDay = dd; //30
      firstday = yy + "-" + mm + "-1"; //2018-3-1
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
        date.mn=this.mn;
        let d='';
        if(i<10){
          d = '0'+i;
        }else{
          d=i;
        }
        let y = '';
        if(this.currentMonth<10){
           y = '0'+this.currentMonth; 
        }else{
          y=this.currentMonth; 
        }
       
        if(this.currentMonth === 0){
          date.datetime = (this.currentYear-1)+'-' + "12-" + d;
        }else{
           date.datetime = this.currentYear+'-'+ y + "-" + d;
        }
        date.status='';
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
        let d='';
        if(i<10){
          d = '0'+i;
        }else{
          d=i;
        }
        let y ='';
        if((this.currentMonth+1)<10){
          y = '0'+(this.currentMonth+1); 
        }else{
          y=this.currentMonth+1; 
        }
        date.status='';
         date.mn=this.mn;
        date.attr = "this_month";
        date.datetime =  this.currentYear+'-'+y + "-" + d;
       
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
        let d='';
        if(i<10){
          d = '0'+i;
        }else{
          d=i;
        }
       
        let y ='';
        if((this.currentMonth+2)<10){
          y = '0'+(this.currentMonth+2); 
        }else{
          y=this.currentMonth+2; 
        }
        if((this.currentMonth + 2)>12){
          date.datetime =  (this.currentYear+1)+'-' + "01-" + d;
          
        }else{
         date.datetime =  this.currentYear+'-' +y + "-" + d;
        }
         date.mn=this.mn;
        date.attr = "next_month";
        date.status='';
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
      this.getAuditdata()
    },
    getAuditdata(){
      this.$http.post("/DataAudit/dataAudit/statisDataAudit", this.datas).then(res => {
          this.datas=res.data.content.dataList;
          this.show=[];
          var k = 0;
          for (var i = 0; i < 6; i++) {
            var line = new Array();
            for (var j = 0; j < 7; j++) {
              line.push(this.datas[k++]);
            }
            this.show.push(line);
          }
      });
    }
  },

  watch:{
    mn:{
  　　　　handler(newValue, oldValue) {
            this.mn=newValue;   
            this.setCalender(new Date());   
  　　　　},
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
  width: 490px;
  // border: 2px solid #57abff;

  #celender_head {
    height: 40px;
    width: 490px;
    text-align: center;
     border-bottom: 1px solid #c9d8ea;
     position: relative;
    .celender_head {
      line-height: 40px;
      text-align: center;
      height: 40px;
     
      p {
        color: #1a1a1a;
      }
    }
    .closespan{
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
    .head td:hover {
      background-color: @gray;
    }
    table{
      border-collapse: collapse;
      tr{
          border-bottom: 1px solid #c9d8ea;
          &:last-child{
            border-bottom: 0px;
          }
       }
    }
   
    td {
      width: 70px;
      height: 57px;
      text-align: center;
      cursor: pointer;
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
        color: @red;
      }
    }
    .last_month {
      color: lightgray;
     
    }

    .next_month {
      color: lightgray;
     
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