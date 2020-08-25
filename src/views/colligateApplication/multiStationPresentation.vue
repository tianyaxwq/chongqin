<template>
  <!--多站报告-->
  <div class="single-station-report-page">
    <div class="secondary-page-mode">
      <div class="secondary-toolbar">
        <span>数据类型：</span>
        <el-button-group>
          <el-button
            :class="{active:dataType === index}"
            size="small" type="primary" plain
            :key = "index"
            v-for="(item,index) in dataTypeList"
            @click="dataTypeToggle(index)"
          >{{ item.name }}</el-button>
        </el-button-group>&emsp;
        <span>时间段：</span>
        <div class="layoutBox" style="width:242px">
          <el-date-picker
            v-model = "dataValue"
            :type="headtimetype"
            placeholder="选择时间">
          </el-date-picker>
        </div>&emsp;
        <el-button @click="historicalDataSearch"><i class="iconfont icon-sousuo"></i>生成</el-button>
        <el-button type='delet' @click="exportPdf"><i class="iconfont icon-daochu"></i>导出</el-button>
      </div>
      <div class="currency-mode-wrap">

        <el-scrollbar class="currency-mode-scroll" >
          <h4 class="report-form-title">{{headtitle}}</h4>
          <p class="report-notes-text">{{evaluationdis}}
          <div class="report-table-wrap" style="position: relative;">
            <div v-if="reportLoading" class="loading-wrap"></div>
            <div v-if="reportNoDataState" class="no-data-wrap small no-data-table">
                <p>暂无数据</p>
            </div>
            <el-table
              :data="tableData"
              empty-text=" "
              border
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                fixed
                width="50">
              </el-table-column>
              <el-table-column
                  prop="name"
                  fixed
                  label="河道-站点名称"
                  :show-overflow-tooltip = 'true'
                  width="230">
              </el-table-column>
              <el-table-column label="单因子评价" align="center">
                <el-table-column :key="index" v-for="(item,index) in headcolumn"
                                 :label="item.projectName"
                                 :width="setWidth(item.projectName)"
                                 :property="item.projectCode">
                  <template slot-scope="scope">
                    <div class="data-table-cell" v-for="(proj,key) in scope.row.projects" :key="key">
                            <span
                              v-if="proj.code==item.projectCode"
                            >{{ proj.value}}
                            </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="waterQualityLevel"
                  label="水质类别">
                  <template slot-scope="scope">
                    <span>
                      {{toWQLString(scope.row.waterQualityLevel)}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="evaluation"
                  label="水质状况">
                </el-table-column>
                <el-table-column
                  prop="primaryPollutant"
                  :show-overflow-tooltip = 'true'
                  width="166"
                  label="主要污染指标（超标倍数）">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
   import {formatDate} from '../../assets/js/dateformat'
  let dataTypeList = [{
    name:'日报',
    type:'hour'
  },{
    name:'月报',
    type:'day'
  },{
    name:'年报',
    type:'month'
  }];
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
  let headcolumn={
    enabled:1,
    metal:0,
    projectCode:"w01018",
    projectId:187,
    projectName:"COD",
    projectType:"428F3127A91D467CA8F1EA2749CC087E",
    projectUnit:"mg/L",
    scale:2
  };
  export default {
    name: "multiStationPresentation",
    data(){
      return {
        reportLoading: true,
        reportNoDataState: false,
        dataTypeList,//数据类型
        dataType:0,//数据类型选中下标
        pickerOptions,//时间快捷菜单数据
        dataValue:'',//时间绑定数据
        tableData:[],//表格数据
        headtitle:'',
        evaluationdis:'',
        headcolumn:[],
        headtimetype:'date',
        htmlTitle: '页面导出PDF文件名',
        siteChecked: null,
      }
    },
    methods:{
      setWidth(str){
        if(str){
          let num = str.length;
          return (num*14+20)>104?(num*14+20):104;
        }
      },
      toWQLString(wql){
        if(wql=='0'){
          return 'Ⅰ类';
        }else if(wql=='1'){
          return 'Ⅱ类';
        }else if(wql=='2'){
          return "Ⅲ类"
        }else if(wql=='3'){
          return "Ⅳ类";
        }else if(wql=='4'){
          return "Ⅴ类";
        }else if(wql=='5'){
          return "劣Ⅴ类";
        }else {
          return '';
        }
      },
      exportPdf(){
        var statisType=dataTypeList[this.dataType].type;
        var startTime="";
        var endTime="";
        if(this.headtimetype=='date'){
          startTime=formatDate(this.dataValue,'yyyy-MM-dd 00:00:00');
          var date=this.convertDateFromString(startTime);     
          date.setDate(date.getDate()+1);
          endTime=formatDate(date,'yyyy-MM-dd 00:00:00');
        }else if(this.headtimetype=="month"){
          startTime=formatDate(this.dataValue,'yyyy-MM-01 00:00:00');
          var date=this.convertDateFromString(startTime);     
          date.setMonth(date.getMonth()+1);
          endTime=formatDate(date,'yyyy-MM-01 00:00:00');
        }else{
          startTime=formatDate(this.dataValue,'yyyy-01-01 00:00:00');
          var date=this.convertDateFromString(startTime);     
          date.setFullYear(date.getFullYear()+1);
          endTime=formatDate(date,'yyyy-01-01 00:00:00');
        }
        if(this.siteChecked.structureType=='area'){
          window.open("/waterenvapi/report/autoStationMuiltiBaogaoExport?queryType=station&areaIds="+this.siteChecked.id.toString()+'&statisType='+statisType+'&startTime='+startTime+'&endTime='+endTime);  
        }else if(this.siteChecked.structureType=='river'){
          window.open("/waterenvapi/report/autoStationMuiltiBaogaoExport?queryType=station&riverIds="+this.siteChecked.id.toString()+'&statisType='+statisType+'&startTime='+startTime+'&endTime='+endTime);    
        }else{
          window.open("/waterenvapi/report/autoStationMuiltiBaogaoExport?queryType=station&equipdIds="+this.siteChecked.id.toString()+'&statisType='+statisType+'&startTime='+startTime+'&endTime='+endTime)
        }
      },
      dataTypeToggle(index){
        this.dataType = index;
        if(index==0){
          this.headtimetype='date';
          
        }else if(index==1){
          this.headtimetype='month';
          
        }else if(index==2){
          this.headtimetype='year';
       
        }
      },
      getSiteCheckedNodes(nodes){
        this.siteChecked = nodes;
        this.openPage = nodes.structureType;
        this.historicalDataSearch();
      },
      initTime(){
        this.dataValue=new Date();
      },
      searchcolumn(){
        /* 基本信息请求 */
        var paramsp={
          equipIds: this.siteChecked.id?this.siteChecked.id.toString():'',
        };
        if(this.siteChecked.structureType=='area'){
          paramsp={
            areaIds: this.siteChecked.id.toString()
          };
        }else if(this.siteChecked.structureType=='river'){
          paramsp={
            riverIds: this.siteChecked.id.toString()
          };
        }
        this.$http.get('/waterenvapi/basic/stationRefProjects',{
          params:paramsp
        }).then((response)=>{
          let dataJson = response.data;
          if(dataJson.code === 200){
            this.headcolumn = dataJson.content.dataList;
          }
        }).catch((error)=>{

        });
      },
      checksiteinit(){
        var self = this;
        var timer = setInterval(function(){
          if(self.siteChecked){
            self.historicalDataSearch();
            clearInterval(timer);
          }
        },100);
      },
      convertDateFromString(dateString){
        if (dateString) {
          var date = new Date(dateString.replace(/-/,"/"))
          return date;
        }
      },
      initTitle(){
        var startTime="";
        var endTime="";
        if(this.headtimetype=='date'){
          startTime=formatDate(this.dataValue,'yyyy-MM-dd');
          var date=this.convertDateFromString(startTime);     
          date.setMonth(date.getDate()+1);
          endTime=formatDate(date,'yyyy-MM-dd');
        }else if(this.headtimetype=="month"){
          startTime=formatDate(this.dataValue,'yyyy-MM');
          var date=this.convertDateFromString(startTime);     
          date.setMonth(date.getMonth()+1);
          endTime=formatDate(date,'yyyy-MM');
        }else{
          startTime=formatDate(this.dataValue,'yyyy');
          var date=this.convertDateFromString(startTime);     
          date.setMonth(date.getFullYear()+1);
          endTime=formatDate(date,'yyyy');
        }
        var node=this.siteChecked;
        var statisTypeName=dataTypeList[this.dataType].name;
        this.headtitle=node.label+startTime+statisTypeName+'表';
        this.htmlTitle=node.label+startTime+statisTypeName+'表';

      },
      historicalDataSearch(){
        let _this = this;
        this.reportLoading = true;
        this.reportNoDataState = false;
        // if(this.siteChecked.length === 0){
        //   setTimeout(function(){
        //     _this.reportLoading = false;
        //     _this.reportNoDataState = true;
        //   },300);
        //   return;
        // }
        this.searchcolumn();
        this.initTitle();
        var statisType=dataTypeList[this.dataType].type;
        var startTime="";
        var endTime="";
        if(this.headtimetype=='date'){
          startTime=formatDate(this.dataValue,'yyyy-MM-dd 00:00:00');
          var date=this.convertDateFromString(startTime);     
          date.setDate(date.getDate()+1);
          endTime=formatDate(date,'yyyy-MM-dd 00:00:00');
        }else if(this.headtimetype=="month"){
          startTime=formatDate(this.dataValue,'yyyy-MM-01 00:00:00');
          var date=this.convertDateFromString(startTime);     
          date.setMonth(date.getMonth()+1);
          endTime=formatDate(date,'yyyy-MM-01 00:00:00');
        }else{
          startTime=formatDate(this.dataValue,'yyyy-01-01 00:00:00');
          var date=this.convertDateFromString(startTime);     
          date.setFullYear(date.getFullYear()+1);
          endTime=formatDate(date,'yyyy-01-01 00:00:00');
        }
        var paramsp={
          equipdIds: this.siteChecked.id?this.siteChecked.id.toString():'',
          statisType:statisType,
          startTime:startTime,
          endTime:endTime,
          queryType:'station'
        };
        if(this.siteChecked.structureType=='area'){
          paramsp={
            areaIds: this.siteChecked.id?this.siteChecked.id.toString():'',
            statisType:statisType,
            startTime:startTime,
            endTime:endTime,
            queryType:'station'
          };
        }else if(this.siteChecked.structureType=='river'){
          paramsp={
            riverIds: this.siteChecked.id?this.siteChecked.id.toString():'',
            statisType:statisType,
            startTime:startTime,
            endTime:endTime,
            queryType:'station'
          };
        }
        this.$http.get('/waterenvapi/report/autoStationMuiltiReport',{
          params:paramsp
        }).then((response)=>{
          let dataJson = response.data;
          if(dataJson.code === 200){
            this.tableData = dataJson.content.dataList;
            this.total=dataJson.content.total;
            this.evaluationdis=dataJson.content.info;
            if(dataJson.content.dataList.length === 0){
              this.reportNoDataState = true;
            }else{
              this.reportNoDataState = false;
            }
          }
          this.reportLoading = false;
        }).catch((error)=>{
          this.reportLoading = false;
          this.reportNoDataState = true;
        });
      }
    },
    mounted(){
      this.initTime();
     this.historicalDataSearch()
    },
    created(){
        this.$store.commit("setShowlefttree", true);
        this.siteChecked=this.$store.state.stationInfo;
    },
    computed:{
        station(){
          return this.$store.state.stationInfo
        }
     },
    watch:{
      //监听站点信息变化
      station(newvalue){
        this.siteChecked=newvalue;
        this.historicalDataSearch()
      }
    },
  }
</script>

<style scoped lang="less">
  .single-station-report-page{
    height: 100%;
    .currency-mode-wrap{
      height: calc(100% - 56px);
    }
    .currency-mode-scroll{
      height: 100%;
    }
    .report-form-title{
      height: 28px;
      line-height: 28px;
      font-size: 16px;
      text-align: center;
      margin-top: 12px;
    }
    .report-form-subtitle{
      text-align: center;
      line-height: 24px;
    }
    .report-table-wrap{
      padding: 10px 34px 0;
      min-height: 120px;
    }
    .report-notes-text{
      text-indent: 2em;
      padding: 8px 34px;

    }
    .no-data-table.no-data-wrap p{
      top: 82px;
    }
  }
</style>
