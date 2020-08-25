<template>
  <!-- 站点水质分析 -->
  <div class="water-quality-evaluation-page">
    <div class="secondary-scroll-content">
      <h4 class="statistical-analysis-title"> {{headtitle}} </h4>
      <!-- 工具栏部分 -->
      <div class="secondary-toolbar">
        <span>时间段：</span>
        <el-button-group>
          <el-button
            :class="{active:dataType === index}"
            size="small" type="primary" plain
            :key = "index"
            v-for="item,index in dataTypeList"
            @click="dataTypeToggle(index,item)"
          >{{ item.name }}</el-button>
        </el-button-group>
        <el-date-picker
          v-model = "dataValue"
          type = "daterange"
          align = "right"
          unlink-panels
          range-separator = "~"
          start-placeholder = "开始日期"
          end-placeholder = "结束日期"
          :clearable = 'false'
          format = 'yyyy-MM-dd HH:mm'
          prefix-icon = 'el-icon-date'
          :disabled = "custom"
          :picker-options="pickerOptions">
        </el-date-picker>&emsp;
        <button type="button" class="default-btn" @click="searchData">
          <i class="iconfont icon-shijiantai"></i> 评价
        </button>
        <!-- <button type="button" class="default-btn">
          <i class="iconfont icon-daochu"></i> 导出
        </button>
        <button type="button" class="default-btn">
          <i class="iconfont icon-dayin"></i> 打印
        </button> -->
      </div>

      <!-- 数据详情模块 -->
      <div class="currency-mode-wrap">
        <h4 class="currency-mode-title">
          <i class="mode-title-icon"></i> 水质评价
          <span class="mode-title-line"></span>
        </h4>
        <div class="secondary-mode-content">
          <div class="normal-table-wrap">
            <table class="normal-table">
              <tr>
                <th>水质现状</th>
                <td><i class="sl-icon gradeC"></i> {{evaluation}}</td>
                <th>水质目标</th>
                <td><i class="sl-icon gradeB"></i> {{targetQualityLevel}}</td>
                <th>联网现状</th>
                <td><i class="sl-icon gradeB"></i> 正常</td>
              </tr>
              <tr>
                <th>计算方法</th>
                <td>比例法</td>
                <th>数据时间</th>
                <td colspan="3">{{timerange}}</td>
              </tr>
            </table>
          </div>
          <div class="statistical-analysis-text">
            <p>{{analydetal}}</p>
          </div>
          <h4 class="secondary-mode-title">
            <i class="sl-icon block-icon"></i>
            <span>奉贤区断面水质详情</span>
          </h4>
          <div class="water-quality-row">
            <div class="water-quality-table-wrap">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  type = "index"
                  label="序号">
                </el-table-column>
                <el-table-column
                  prop="time"
                  label="数据时间">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="监测因子">
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="浓度值">
                </el-table-column>
                <el-table-column
                  prop="waterQualityLevel"
                  label="水质等级">
                  <template slot-scope="scope">
                    <span>
                      {{toWQLString(scope.row.waterQualityLevel)}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="downfivestandar"
                  label="V类水标准">
                </el-table-column>
                <el-table-column
                  prop="unit"
                  label="单位">
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                background
                :small = "true"
                popper-class = "select-common-option"
                :page-sizes = "pageList"
                layout="total, sizes, slot ,->,prev, pager, next, jumper"
                :total="total">
                <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
              </el-pagination>
            </div>
          </div>
          <h4 class="secondary-mode-title">
            <i class="sl-icon block-icon"></i>
            <span>{{headtitle}}各因子水质详情</span>
          </h4>
          <div class="water-chart-wrap">
            <div v-if="trendLoading" class="loading-wrap"></div>
            <div v-if="trendNoDataState" class="no-data-wrap small no-data-chart">
              <p>暂无数据</p>
            </div>
            <ul class="color-line-list">
              <li class="grade1"></li>
              <li class="grade2"></li>
              <li class="grade3"></li>
              <li class="grade4"></li>
              <li class="grade5"></li>
              <li class="grade6"></li>
            </ul>
            <div id="trend-change-chart"></div>
          </div>
          <h4 class="secondary-mode-title">
            <i class="sl-icon block-icon"></i>
            <span>{{headtitle}}各因子趋势详情</span>
          </h4>
          <div class="water-chart-wrap">
            <div v-if="detailsLoading" class="loading-wrap"></div>
            <div v-if="detailsNoDataState" class="no-data-wrap small no-data-chart">
              <p>暂无数据</p>
            </div>
            <div id="details-trend-chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //import {formatDate} from '../../dateformat.js'
  let pickerOptions = {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  };
  let dataTypeList=[{
    name:'实时',
    type:'minute'
  },{
    name:'日评价',
    type:'day'
  },{
    name:'周评价',
    type:'week'
  },{
    name:'月评价',
    type:'month'
  },{
    name:'季评价',
    type:'season'
  },{
    name:'年评价',
    type:'year'
  },{
    name:'自定义',
    type:'custom'
  }];
  export default {
    name: "waterQualityEvaluationD",
    props:['nodes'],
    watch:{
      nodes(){
        this.searchData();
      }
    },
    data(){
      return {
        trendLoading: true,
        trendNoDataState: false,
        detailsLoading: true,
        detailsNoDataState: false,
        dataValue:'',
        pickerOptions,
        dataType:0,
        dataTypeList,
        custom: true,
        tableData:[],
        currentPage:1,//分页组件当前页
        total: 62,//分页总条数
        pageSize: 10,//分页每页多少条数据
        pageList:[10,15,20],//设置每页多少条
        myChart:'',
        detailsTrend:'',
        evaluation:'',
        targetQualityLevel:'',
        timerange:'',
        headtitle:'',
        analydetal:''
      }
    },
    computed:{
      totalPageNumber(){//计算总页数
        let number = 0;
        number = Math.ceil(this.total/this.pageSize);
        return number;
      }
    },
    methods:{
      toWQLString(wql){
        if(wql=='1'){
          return 'Ⅰ类';
        }else if(wql=='2'){
          return 'Ⅱ类';
        }else if(wql=='3'){
          return "Ⅲ类"
        }else if(wql=='4'){
          return "Ⅳ类";
        }else if(wql=='5'){
          return "Ⅴ类";
        }else if(wql=='6'){
          return "劣Ⅴ类";
        }else {
          return '';
        }
      },
      dataTypeToggle(index,item){
        this.dataType = index;
        if (item.type === 'custom'){
          this.custom = false;
        }else{
          this.custom = true;
          this.dataValue = '';
        }
        var type=this.dataTypeList[index].type;
        var date=new Date();
        var datearr=[];
        if(type=='minute'){
          datearr.push(date,date);
        }else if(type=='day'){
          var startdt=new Date(formatDate(date,'yyyy-MM-dd 00:00:00'));
          datearr.push(new Date(startdt.getTime()-86400*1000),date);
        }else if(type=='week'){
          var startdt=new Date(formatDate(date,'yyyy-MM-dd 00:00:00'));
          datearr.push(new Date(startdt.getTime()-86400*1000*7),date);
        }else if(type=='month'){
          var startdt=new Date(formatDate(date,'yyyy-MM-01 00:00:00'));
          datearr.push(new Date(startdt.getTime()),date);
        }else if(type=='season'){
          var startdt=new Date(formatDate(date,'yyyy-MM-01 00:00:00'));
          var date1=new Date(formatDate(new Date(startdt.getTime()-86400*1000),'yyyy-MM-01 00:00:00'));
          var date2=new Date(formatDate(new Date(date1.getTime()-86400*1000),'yyyy-MM-01 00:00:00'));
          datearr.push(new Date(date2.getTime()),date);
        }else if(type=='year'){
          var startdt=new Date(formatDate(date,'yyyy-01-01 00:00:00'));
          datearr.push(new Date(startdt.getTime()),date);
        }
        this.dataValue=datearr;
      },
      initTime(){
        var date=new Date();
        var datearr=[];
        datearr.push(date,date);
        this.dataValue=datearr;
      },
      searchData(){  //评价查询
        this.$emit('update:loading',true);
        this.checksiteinit();
        this.stationDetail();
        this.waterConcentrationChart();
        this.detailsTrendChart();
      },
      frountpage(list){  //前端分页方法
        this.total=list.length;
        var start=(this.currentPage-1)*this.pageSize;
        var end=this.pageSize*this.currentPage;
        var rtn=[];
        var len=end;
        if(end>list.length){
          len=list.length;
        }
        for(var i=start;i<len;i++){
          rtn.push(list[i]);
        }
        this.tableData=rtn;
      },
      checksiteinit(){  //检查引入组件已初始化并加载初始化数据
        var self=this;
        var timer=setInterval(function(){
          if(self.nodes.id){
            self.evaluate();
            self.headtitle=self.nodes.label+'水质评价';
            clearInterval(timer);
          }
        },100);
      },
      evaluate(){  //区域整体评价
        var type=this.dataTypeList[this.dataType].type;
        var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
        var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
        var paramsp={
          queryType:'station',
          statisType:type,
          startTime:startTime,
          endTime:endTime,
          equipdIds:this.nodes.id
        }
        this.$http.get('/waterenvapi/station/realStatisInfo',{
          params:paramsp
        }).then((response)=>{
          let dataJson = response.data;

          if(dataJson.code === 200){
            var list=dataJson.content.dataList;
            if(list.length>0){
              this.evaluation=list[0].evaluation;
              this.targetQualityLevel=this.toWQLString(list[0].targetQualityLevel);
              var arr=this.dataValue;
              if(arr.length==2){
                this.timerange=startTime+'至'+endTime
              }
              this.analydetal='水质概述：'+this.timerange+'，'+this.nodes.label+'水质等级为'+list[0].waterQualityLevel+'，主要污染指标为'+list[0].primaryPollutant
            }
          }
        }).catch((error)=>{

        });
      },
      stationDetail(){
        var type=this.dataTypeList[this.dataType].type;
        var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
        var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
        var paramsp={
          queryType:'station',
          statisType:type,
          startTime:startTime,
          endTime:endTime,
          equipdIds:this.nodes.id
        }
        this.$http.get('/waterenvapi/station/projectStatisInfo',{
          params:paramsp
        }).then((response)=>{
          let dataJson = response.data;
          if(dataJson.code === 200){
            var list=dataJson.content.dataList;
            this.frountpage(list);
          }
        }).catch((error)=>{

        });
      },
      paginationChange(val){//分页页码改变时执行
        this.currentPage = val;
      },
      paginationSizeChange(val){//分页pageSize改变时执行
        this.currentPage = val;
      },
      waterConcentrationChart(){//水质浓度变化趋势
        this.trendLoading = true;
        this.trendNoDataState = false;
        this.myChart = this.$echarts.init(document.getElementById('trend-change-chart'));
        var type=this.dataTypeList[this.dataType].type;
        var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
        var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
        var paramsp={
          queryType:'station',
          statisType:type,
          startTime:startTime,
          endTime:endTime,
          equipdIds:this.nodes.id
        };
        this.$http.get('/waterenvapi/station/projectStatisChart',{
          params:paramsp
        }).then((response)=>{
          let dataJson = response.data;
          if(dataJson.code === 200){
            var info=dataJson.content.info;
            var xAxis=info.xAxis;
            var serisone=info.yAxis[0].list;
            var serissec=info.yAxis[1].list;
            if(serissec.length === 0){
              this.trendNoDataState = true;
            }else{
              this.trendNoDataState = false;
            }
            let option = {
              color:['#2675d1'],
              title: {
                text: "水质排名详情",
                textStyle:{
                  fontSize: 16,
                },
                subtext:'数据来源：小时数据',
                subtextStyle:{
                  color: '#333'
                },
                x: 'center',
                y: 10
              },
              tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                top: 66,
                left: 20,
                right: '4%',
                bottom: 30,
                containLabel: true
              },
              legend: {
                bottom: 0,
                data: ['目标水质']
              },
              visualMap: {
                top: 10,
                right: -100,
                pieces: [{
                  value: 1,
                  color: '#00a1e4'
                }, {
                  value: 2,
                  color: '#00a1e4'
                }, {
                  value: 3,
                  color: '#24c768'
                }, {
                  value: 4,
                  color: '#e5ce10'
                }, {
                  value: 5,
                  color: '#ff7e00'
                }, {
                  value: 6,
                  color: '#ff7e00'
                }],
                outOfRange: {
                  color: '#999'
                }
              },
              xAxis : [
                {
                  type : 'category',
                  data : xAxis,
                  axisTick:{
                    show:false
                  },
                  axisLine:{
                    lineStyle:{
                      color:"#c6d1de"
                    }
                  },
                  axisLabel:{
                    color:"#999"
                  },
                  splitLine:{
                    show:true
                  }
                }
              ],
              yAxis : [
                {
                  type : 'value',
                  splitNumber:7,
                  max:6,
                  axisTick:{
                    show:false
                  },
                  axisLine:{
                    lineStyle:{
                      color:"#c6d1de"
                    }
                  },
                  axisLabel:{
                    color:"#999",
                    formatter:function(param){
                      let yText = null;
                      switch (param) {
                        case 0:
                          yText = '';
                          break;
                        case 1:
                          yText = 'Ⅰ类';
                          break;
                        case 2:
                          yText = 'Ⅱ类';
                          break;
                        case 3:
                          yText = 'Ⅲ类';
                          break;
                        case 4:
                          yText = 'Ⅳ类';
                          break;
                        case 5:
                          yText = 'Ⅴ类';
                          break;
                        case 6:
                          yText = '劣Ⅴ类';
                          break;
                      };
                      return yText;
                    }
                  },
                  splitLine:{
                    show:true
                  }
                }
              ],
              series : [
                {
                  name:'断面实际水质',
                  type:'bar',
                  data:serisone,
                  barWidth: 20
                },
                {
                  name:'目标水质',
                  type:'line',
                  symbolSize: 10,
                  lineStyle:{
                    color: '#2675d1'
                  },
                  itemStyle:{
                    borderColor: '#2675d1'
                  },
                  data:serissec
                }
              ]
            };
            this.myChart.setOption(option);
          }
          this.trendLoading = false;
        }).catch((error)=>{
          this.trendLoading = false;
          this.trendNoDataState = true;
        });

      },
      detailsTrendChart(){
        this.detailsLoading = true;
        this.detailsNoDataState = false;
        this.detailsTrend = this.$echarts.init(document.getElementById('details-trend-chart'));
        var type=this.dataTypeList[this.dataType].type;
        var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
        var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
        var paramsp={
          equipdIds: this.nodes.id,
          statisType:'hour',
          startTime:startTime,
          endTime:endTime
        };
        this.$http.get('/waterenvapi/station/projectValueTrendChart',{
          params:paramsp
        }).then((response)=> {
          let dataJson = response.data;
          if (dataJson.code === 200) {
            var info = dataJson.content.info;
            var legengarr = [];
            for (var i = 0; i < info.legend.length; i++) {
              legengarr.push(info.legend[i]);
            }
            var series = [];
            var serobj = info.yAxis;

            for (var i = 0; i < serobj.length; i++) {
              var obj = serobj[i];
              series.push({
                name: obj.name,
                type: 'line',
                symbolSize: 8,
                data: obj.list
              });
            }
            if(series.length === 0){
              this.detailsNoDataState = true;
            }else{
              this.detailsNoDataState = false;
            }
            let option = {
              color:["#166bce","#ff7e00","#ce1768","#11c053","#9c16ce","#22c0ce"],
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data:legengarr,
                bottom:0
              },
              grid: {
                top: 20,
                left: 40,
                right: 20,
                bottom: 30,
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: info.xAxis,
                axisTick:{
                  show:false
                },
                axisLine:{
                  lineStyle:{
                    color:"#c6d1de"
                  }
                },
                axisLabel:{
                  color:"#999"
                },
                splitLine:{
                  show:true
                }
              },
              yAxis: {
                type: 'value',
                name:'监测值',
                nameLocation:"middle",
                nameTextStyle:{
                  color:"#999"
                },
                nameGap: 40,
                axisTick:{
                  show:false
                },
                splitNumber:10,
                axisLine:{
                  lineStyle:{
                    color:"#c6d1de"
                  }
                },
                axisLabel:{
                  color:"#999"
                }
              },
              series: series
            };
            this.detailsTrend.setOption(option);
          }
          this.detailsLoading = false;
        }).catch((error)=>{
          this.detailsLoading = false;
          this.detailsNoDataState = true;
        });

      }
    },
    mounted(){
      this.initTime();
      let _this = this;
      window.addEventListener("resize",function(){
        _this.myChart.resize();
        _this.detailsTrend.resize();
      });
      this.searchData();
    }
  }
</script>

<style scoped lang="less">
  .statistical-analysis-title{
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    text-align: center;
  }
  .secondary-mode-content{
    padding: 8px;
    .secondary-mode-title{
      height: 36px;
      line-height: 36px;
      color: #166bce;
      .block-icon{
        width: 8px;
        height: 8px;
        background: #166bce;
        margin-right: 4px;
      }
    }
    .normal-table{
      .sl-icon{
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
      }
      .gradeA{
        background: #00a1e4;
      }
      .gradeB{
        background: #24c768;
      }
      .gradeC{
        background: #e5ce10;
      }
      .gradeD{
        background: #ff7e00;
      }
      .gradeE{
        background: #ff0000;
      }
    }

  }
  .normal-table-wrap{
    .normal-table{
      width: 100%;
      th{
        width: 106px;
      }
      td{
        width: 400px;
      }
    }
  }
  .statistical-analysis-text{
    background: #e7f0f9;
    line-height: 18px;
    padding: 10px 8px;
    border: 1px solid #d5e6f8;
    margin-top: 10px;
    position: relative;
    p{
      text-indent: 2em;
    }
  }
  .statistical-analysis-text:before{
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    border-top: 2px solid #166bce;
    border-left: 2px solid #166bce;
    top: -2px;
    left: -2px;
  }
  .statistical-analysis-text:after{
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    border-right: 2px solid #166bce;
    border-bottom: 2px solid #166bce;
    bottom: -2px;
    right: -2px;
  }
  #trend-change-chart{
    height: 350px;
    width: 100%;
  }
  .water-chart-wrap{
    position: relative;
    .color-line-list{
      position: absolute;
      z-index: 999;
      top: 66px;
      left: 64px;
      width: 2px;
      li{
        height: 39px;
      }
      .grade5,.grade6{
        background: #00a1e4;
      }
      .grade4{
        background: #24c768;
      }
      .grade3{
        background: #e5ce10;
      }
      .grade2{
        background: #ff7e00;
      }
      .grade1{
        background: #ff0000;
      }
    }
  }
  #details-trend-chart{
    height: 370px;
  }
</style>
