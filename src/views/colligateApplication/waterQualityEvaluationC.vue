<template>
   <!-- 奉贤总区水质分析 -->
    <div class="water-quality-evaluation-page"
    >
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
          <div class="layoutBox" style="width:340px">
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
            </el-date-picker>
          </div>&emsp;
           <el-button @click="searchData"><i class="iconfont icon-shijiantai"></i>评价1</el-button>
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
                </tr>
                <tr>
                  <th>计算方法</th>
                  <td>{{computingMethod}}</td>
                  <th>数据时间</th>
                  <td>{{timerange}}</td>
                </tr>
              </table>
            </div>
            <div class="statistical-analysis-text">
              <p>{{analydetal}}</p>
            </div>
            <div class="water-quality-analysis-row">
              <div class="water-quality-map">
                <h4 class="water-quality-title">区域河流水质图</h4>
                 <mapComp2 mapType="2" v-bind:mapInfo="mapInfo" ref="cmap"></mapComp2>
                <div class="water-quality-map-legend"></div>
              </div>
              <div class="water-quality-proportion">
                <div v-if="waterLoading" class="loading-wrap"></div>
                <div v-if="waterNoDataState" class="no-data-wrap small">
                  <p>暂无数据</p>
                </div>
                <div id="water-quality-proportion-chart"></div>
              </div>
            </div>
            <h4 class="secondary-mode-title">
              <i class="sl-icon block-icon"></i>
              <span>{{headtitle}}断面水质详情</span>
            </h4>
            <div class="water-quality-row">
              <div class="water-quality-table-wrap">
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="断面"
                    align="right">
                  </el-table-column>
                  <el-table-column
                    prop="level"
                    label="水质等级">
                    <template slot-scope="scope">
                      <div>
                        <span v-if="scope.row.level == 0">Ⅰ类</span>
                        <span v-if="scope.row.level == 1">Ⅱ类</span>
                        <span v-if="scope.row.level == 2">Ⅲ类</span>
                        <span v-if="scope.row.level == 3">Ⅳ类</span>
                        <span v-if="scope.row.level == 4">Ⅴ类</span>
                        <span v-if="scope.row.level == 5">劣Ⅴ类</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="armLevel"
                    label="目标等级">
                   
                  </el-table-column>
                  <el-table-column
                    prop="river"
                    label="所属河流">
                  </el-table-column>
                  <el-table-column
                    prop="areaName"
                    label="所属区域">
                  </el-table-column>
                  <el-table-column
                    prop="keyPollution"
                    label="主要污染指标">
                  </el-table-column>
                  <el-table-column
                    prop="count"
                    label="数据条数">
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
              <span>{{headtitle}}断面水质详情排名</span>
            </h4>
            <div class="water-chart-wrap">
              <div v-if="trendLoading" class="loading-wrap"></div>
              <div v-if="trendNoDataState" class="no-data-wrap small">
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
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {formatDate} from '../../assets/js/dateformat.js'
    import mapComp2 from './map'
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
        name: "waterQualityEvaluationA",
        watch:{
           stationInfo(value) {
            if (value.length > 0) {
                this.nodes={
                  id:value[0].nodeId,
                  label:value[0].nodeName
                }
                this.openPage = value[0].nodeType;
                this.init
                if(this.openPage==='area'){
                   this.$router.push("/colligateApplication/analysisReport/waterQualityEvaluationA");
                }else if(this.openPage==='station'){
                   this.$router.push("/colligateApplication/analysisReport/waterQualityEvaluationD");
                }
            }
          }
        },
        components:{mapComp2},
        data(){
          return {
            openPage:'',
            nodes:{},
            waterLoading: true,
            waterNoDataState: false,
            trendLoading: true,
            trendNoDataState: false,
            dataValue:'',
            pickerOptions,
            dataType:0,
            dataTypeList,
            custom: true,
            tableData:[],
            currentPage:1,//分页组件当前页
            total: 0,//分页总条数
            pageSize: 10,//分页每页多少条数据
            pageList:[10,15,20],//设置每页多少条
            myChartWater:'',
            myChart:'',
            evaluation:'',
            targetQualityLevel:'',
            computingMethod:'',
            timerange:'',
            analydetal:'',
            headtitle:'',
            mapInfo:[] //站点数据地图展示传入 map.vue中
          }
        },
        computed:{
          totalPageNumber(){//计算总页数
            let number = 0;
            number = Math.ceil(this.total/this.pageSize);
            return number;
          },
          stationInfo: {
            get: function() {
              return this.$store.state.stationInfo;
            }
          },
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
          allAreaStatus(){  //各区域状态
            var params={
                queryType:'area',
                statisType:'minute',
                pareaIds:'7E15A844CCB34CCEB42AEE5ED38F5DFC'
            };
            var url='/waterenvapi/realdatas/allAreaStatus';
            var type=this.dataTypeList[this.dataType].type;
            var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
            var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
            if(type!='minute'){
              params={
                  queryType:'basinn',
                  statisType:'hour',
                  pareaIds:'7E15A844CCB34CCEB42AEE5ED38F5DFC',
                  startTime:startTime,
                  endTime:endTime
              };
              url='/waterenvapi/realdatas/allAreaStatusRangeTime';
            }
            this.$http.get(url,{
              params:params
            }).then((response)=>{
              let dataJson = response.data;
              if(dataJson.code === 200) {
                var list=dataJson.content.dataList;
                var str="";
                for(var i=0;i<list.length;i++){
                  var info=list[i];
                  str=str+'"'+info.area+'":"'+this.getRgb16(info.waterQualityLevel)+'",';
                }
                str="{"+str.substring(0,str.length-1)+"}";
                this.$refs.cmap.quZColorObj=JSON.parse(str);
              }
            }).catch((error)=>{

            });
          },
          getRgb16(waterQualityLevel){
            var level=parseInt(waterQualityLevel);
            if(level==1){
              return "#00A1E4";
            }else if(level==2){
              return "#00A1E4";
            }else if(level==3){
              return "#24C768";
            }else if(level==4){
              return "#E5CE10";
            }else if(level==5){
              return "#FF7E00";
            }else if(level==6){
              return "#FF0000";
            }else{
              return "";
            }
          },
          getTimeType(){
            let dType='';
             var type=this.dataTypeList[this.dataType].type;
            if(type =="minute"){
              dType='hour'
            }else if(type =="day" || type =="week" || type=='month'){
               dType='day'
            }else if(type =="month" || type =="season" || type =="year"){
               dType='month'
            }else{
              dType='day'
            };
            return dType;
          },
          searchData(){  //评价查询
            this.evaluate();
            this.waterQualityProportionChart();
            this.waterConcentrationChart()
            this.stationDetail()
          },
          //区域整体评价
          evaluate(){  
            let dType=this.getTimeType();
            var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
            var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
            var paramsp={
              queryType:'basinn',
              timeType:dType,
              startTime:startTime,
              endTime:endTime,
              queryCode:this.nodes.id
            }
            this.$http.get('/Statistics-Service/waterQualityEvaluation/waterQualitySummary',{
              params:paramsp
            }).then(res=>{
              let dataJson = res.data.content.info;

              if(res.data.code === 0){
                 this.evaluation=dataJson.level;
                 this.targetQualityLevel=dataJson.airLevel;
                 this.computingMethod=dataJson.computingMethod;
                 this.timerange=dataJson.time;
                 this.analydetal=dataJson.message;
              }
            }).catch((error)=>{

            });
          },
          stationDetail(){
            let dType=this.getTimeType();
            var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
            var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
            var paramsp={
              queryType:'basinn',
              timeType:dType,
              startTime:startTime,
              endTime:endTime,
              queryCode:this.nodes.id,
              pageSize:this.pageSize,
              pageNumber:this.currentPage,
            }
            this.$http.get('/Statistics-Service/waterQualityEvaluation/qualityDetailsReports',{
              params:paramsp
            }).then(res=>{
              
              if(res.data.code === 0){
               this.tableData=res.data.content.dataList;
               this.total=res.data.content.totalRecords
              }
            }).catch((error)=>{

            });
          },
          paginationChange(val){//分页页码改变时执行
            this.currentPage = val;
            this.stationDetail();
          },
          paginationSizeChange(val){//分页pageSize改变时执行
            this.currentPage = val;
             this.stationDetail();
          },
          waterQualityProportionChart(){
            this.$nextTick(()=>{
              this.myChartWater = this.$echarts.init(document.getElementById('water-quality-proportion-chart'));
            })
            
            let dType=this.getTimeType();
            var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
            var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
            var paramsp={
              queryType:'basinn',
              timeType:dType,
              startTime:startTime,
              endTime:endTime,
              queryCode:this.nodes.id,
            
            }
            this.$http.get('/Statistics-Service/waterQualityEvaluation/waterQualityPie',{
              params:paramsp
            }).then((response)=> {
              let dataJson = response.data;
              if (dataJson.code === 0) {
                var list = dataJson.content.info.series[0].data;
                var dataarr=[];
               
                var total=0;
                if(list.length === 0){
                  this.waterNoDataState = true;
                }else{
                  this.waterNoDataState = false;
                }
               
                for(var i=0;i<list.length;i++){
                  var combo=list[i];
                  dataarr.push({name:combo.name,value:combo.value});

                }
                let option = {
                  color:["#00a1e4","#24c768","#e5ce10","#ff7e00","#ff0000"],
                  title : {
                    text: '河流断面水质比例图',
                    x:'center',
                    y: 10
                  },
                  tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  legend: {
                    bottom: 10,
                    itemGap: 30,
                    data: ["I-II类", "III类", "IV类", "V类", "劣V类"]
                  },
                  series : [{
                    name: '水质等级',
                    type: 'pie',
                    radius : '70%',
                    selectedMode: 'single',
                    label: {
                      normal: {
                       formatter:function(params){
                          if(params.percent !== 0){
                            return params.percent+'%\n'+params.name;
                          }else {
                            return '';
                          }
                        },
                        fontSize: 16,
                        position: 'inner',
                        rich: {
                          a:{
                            fontSize: 20,
                            color:'#fff',
                            lineHeight:34
                          },
                          b:{
                            fontSize: 14,
                            color:'#fff',
                          }
                        }
                      }
                    },
                    data:dataarr
                  }]
                };
                this.myChartWater.setOption(option);
              }
              this.waterLoading = false;
            }).catch((error)=>{
              this.waterLoading = false;
              this.waterNoDataState = true;
            });

          },
          waterConcentrationChart(){//水质浓度变化趋势
            this.$nextTick(()=>{
             this.myChart = this.$echarts.init(document.getElementById('trend-change-chart'));
            })
            
            let dType=this.getTimeType();
            var startTime=formatDate(this.dataValue[0],'yyyy-MM-dd hh:mm:ss');
            var endTime=formatDate(this.dataValue[1],'yyyy-MM-dd hh:mm:ss');
            var paramsp={
              queryType:'basinn',
              timeType:dType,
              startTime:startTime,
              endTime:endTime,
              queryCode:this.nodes.id,
            
            }
            this.$http.get('/Statistics-Service/waterQualityEvaluation/waterQualityBarLine',{
              params:paramsp
            }).then((response)=>{
              let dataJson = response.data;
              if(dataJson.code === 0){
                var info=dataJson.content.info;
                var xAxis=info.xAxis;
                var serisone=info.series[0].value;
                var serissec=info.series[1].value;
                if(serissec.length === 0){
                  this.trendNoDataState = true;
                }else{
                  this.trendNoDataState = false;
                }
                var self =this;
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
                    },
                    formatter:function(param){
                      
                       var showHtm=param[0].name+'<br>';
                       for(let i in param){
                          showHtm+="<i class='circleEchart color"+param[i]['value']+"'></i>"+param[i]['seriesName']+": "+self.toWQLString(param[i]['value'])+""+'<br>'
                       }
                       return showHtm
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
                      color: '#ff0000'
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
          //页面数据初始化
          init(){
                //时间初始化
                var date=new Date();
                var datearr=[];
                datearr.push(date,date);
                this.dataValue=datearr;
                //地域名初始化
                this.headtitle=this.nodes.label;
                //查询数据
                this.searchData();   
          }
        },
        created(){
              this.init();
              
        },
        mounted(){
         
          let _this = this;
          // window.addEventListener("resize",function(){
          //   _this.myChart.resize();
          //   _this.myChartWater.resize();
          // });
         // this.searchData();
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
.water-quality-analysis-row{
  height: 382px;
  margin-top: 8px;

  .water-quality-map{
    width: 55%;
    height: 100%;
    float: left;
    border: 1px solid #c6d1de;
    position: relative;
  //  background: url("../../assets/images/index/water-quality-map.png") no-repeat;
  //  background-size: 100% 100%;
    .water-quality-title{
      position: absolute;
      height: 42px;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 999;
      background: rgba(255,255,255,0.8);
      text-align: center;
      line-height: 42px;
      font-size: 16px;
    }
    .water-quality-map-legend{
      position: absolute;
      width: 241px;
      height: 34px;
      bottom: 8px;
      right: 8px;
      //background: url("../../assets/images/index/water-quality-legend.png") no-repeat;
    }
  }
  .water-quality-proportion{
    width: calc(45% - 8px);
    height: 100%;
    float: right;
    border: 1px solid #c6d1de;
    position: relative;
  }
  #water-quality-proportion-chart{
    height: 100%;
    width: 100%;
  }
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

</style>
