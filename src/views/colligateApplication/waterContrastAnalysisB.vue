<template>
    <!-- 水质现状分析(监测断面) -->
    <div class="water-contrast-analysis">
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
           <div class="layoutBox" style="width:242px">
          <el-date-picker
            v-model = "dataValue"
            :type = "timeTypeName"
            :clearable = 'false'
            placeholder="选择日期"
            @change = "dateChangeValue"
            prefix-icon = 'el-icon-date'>
          </el-date-picker>
           </div>&emsp;
            <el-button @click="searchData"><i class="iconfont icon-shijiantai"></i>分析</el-button>
        </div>

        <!-- 同比、类比、环比选择部分 -->
        <div class="similarities-analogies-rings">
          <div class="similarities-row">
            <el-radio v-model="radioValue" label="1">同比</el-radio>
            <span class="explanatory-text">(本期数据与去年同期数据对比。如，本期2月与去年2月)</span>
            <span v-if="radioValue === '1'">对比时间：{{yearOnYearDate}}</span>
          </div>
          <div class="similarities-row">
            <el-radio v-model="radioValue" label="2">环比</el-radio>
            <span class="explanatory-text">(本期数据与其前一期数据对比。如，本期2月与同年1月)</span>
            <span class="date-picker-wrap" v-if="radioValue === '2'">
                时间段：
                 <div class="layoutBox" style="width:242px">
                <el-date-picker
                  v-model = "analogicalTime"
                  :type = "timeTypeName"
                  :clearable = 'false'
                  placeholder="选择日期"
                  prefix-icon = 'el-icon-date'>
                </el-date-picker>
                 </div>&emsp;
              </span>
          </div>
          <!-- <div class="similarities-row">
            <el-radio v-model="radioValue" label="3">类比</el-radio>
            <span class="explanatory-text">(多个站点期间数据对比。如，牡丹魏楼数据比单县刘寨数据)</span>
            <span v-if="radioValue === '3'">对比站点：{{contrastSite}}</span>
          </div> -->
          <ul class="site-type-tab clear" v-if="radioValue === '3'">
            <li
              :class="{active: siteTypeTabIndex === index}"
              @click="selectSiteType(index)"
              v-for="item,index in siteTypeTab">
              {{ item.name}}
            </li>
          </ul>
          <ul class="details-site-list clear" v-if="radioValue === '3'">
            <li v-for="item in detailsSiteList">
              <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
            </li>
          </ul>
          <a class="toggle-btn" v-if="radioValue === '3'">
            <i class="iconfont icon-xiatui"></i>
          </a>
        </div>
        <!-- 数据详情模块 -->
        <div class="currency-mode-wrap">
          <h4 class="currency-mode-title">
            <i class="mode-title-icon"></i> 水质对比
            <span class="mode-title-line"></span>
          </h4>
          <div class="secondary-mode-content">
            <h4 class="secondary-mode-title">
              <i class="sl-icon block-icon"></i>
              <span>奉贤区断面水质详情</span>
            </h4>
            <div class="water-quality-details">
              <div class="water-quality-ratio">
                <h4 class="ratio-title" :title="stationName+'监测断面水质对比分析'">{{stationName}}监测断面水质对比分析</h4>
                <div class="ratio-item">
                  <div>
                    <span :class="toWQLClassStringq(blevel)"></span>
                    <div class="explain-info">
                      <span :class="toWQLClassString(blevel)">{{toWQLString(blevel)}}</span>
                      <p class="ratio-time">{{bbtext}}</p>
                    </div>
                  </div>
                </div>
                <div class="ratio-item">
                  <div>
                    <span :class="toWQLClassStringq(clevel)"></span>
                    <div class="explain-info">
                      <span :class="toWQLClassString(clevel)">{{toWQLString(clevel)}}</span>
                      <p class="ratio-time">{{cctext}}</p>
                    </div>
                  </div>
                </div>
                <div class="analysis-text">
                  <p>
                    {{stationName}}{{bbtext}}为<b>{{toWQLString(blevel)}}</b>，{{cctext}}为<b>{{toWQLString(clevel)}}</b>，
                    {{comparediscrib(blevel,clevel)}}。
                  </p>
                </div>
              </div>
              <div class="water-quality-table">
                <h4 class="contrast-title">{{stationName}}监测因子对比详情</h4>
                <!-- 表格 -->
                <div class="normal-table-wrap">
                  <el-table
                    :data="tableData"
                    border
                    height="100%"
                    style="width: 100%">
                    <el-table-column
                      type="index"
                      label="序号"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="因子"
                      width="110">
                    </el-table-column>
                    <el-table-column
                      prop="unit"
                      label="单位"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="value"
                      :label="headmark1">
                    </el-table-column>
                    <el-table-column
                      prop="waterQualityLevel"
                      :label="headmark2">
                      <template slot-scope="scope">
                        <i class="sl-icon" :class="setWaterGradeCls(scope.row.waterQualityLevel)"></i>
                        <span>{{ toWQLString(scope.row.waterQualityLevel) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="compareValue"
                      :label="headmark3">
                    </el-table-column>
                    <el-table-column
                      prop="cwaterQualityLevel"
                      :label="headmark4">
                      <template slot-scope="scope">
                        <i class="sl-icon" :class="setWaterGradeCls(scope.row.cwaterQualityLevel)"></i>
                        <span>{{ toWQLString(scope.row.cwaterQualityLevel) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="trendChange"
                      label="变化趋势">
                      <template slot-scope="scope">
                        <i class="iconfont icon-jiantou-copy" :class="setTrendChangeCls(scope.row.trend)"></i>
                        <span>{{ scope.row.changeRate }}</span>
                      </template>
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
            </div>
            <!-- <div class="statistical-analysis-text">
              <p>结论：2018年6月奉贤区-浦南运河总体水质良好，其中：Ⅰ类水质断面占<b>3.3</b>%，Ⅱ类占<b>39.6</b>%，
                Ⅲ类占<b>32.2</b>%，Ⅳ类占<b>14.1%</b>，Ⅴ类占<b>4.8</b>%，劣Ⅴ类占<b>6.0</b>%。与2017年6月相比，
                水质情况有所改善，Ⅰ类水质断面比例升高<b>0.5</b>个百分点，Ⅱ类断面比例升高<b>2.1</b>个百分点，
                Ⅲ类断面比例降低<b>2.4</b>个百分点，Ⅳ类断面比例降低<b>0.3</b>个百分点，Ⅴ类断面比例降低<b>0.4</b>个百分点，
                劣Ⅴ断面类比例升高<b>0.5</b>个百分点。</p>
            </div> -->
            <h4 class="secondary-mode-title">
              <i class="sl-icon block-icon"></i>
              <span>奉贤区断面水质详情</span>
            </h4>
            <div class="section-water-quality-details">
              <ul class="water-quality-details-tab">
                <li :class="{active:detailsTabActive==='concentration'}"
                    @click="toggleQualityDetailsTab('concentration')">浓度</li>
                <li :class="{active:detailsTabActive==='water'}"
                    @click="toggleQualityDetailsTab('water')">水质</li>
              </ul>
              <span class="water-quality-tips">点击<b>监测因子名称</b>查看因子变化趋势对比！</span>
            </div>
            <!-- table表格 -->
            <div class="section-water-table-wrap">
              <el-table
                :data="waterData"
                border
                height="100%"
                @header-click = "sectionWaterTable"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column :key="index" v-for="item,index in headcolumn"
                  :property="item.projectCode"
                  :label="item.projectName">
                  width="140">
                  <template slot-scope="scope">
                    <div class="data-table-cell" :key="num" v-for="proj,num in scope.row.projects">
                      <span 
                        v-if="proj.code==item.projectCode&&(detailsTabActive)!='water'"
                      >{{ proj.value}}</span>
                      <span 
                        v-if="proj.code==item.projectCode&&(detailsTabActive)=='water'"
                      >{{ toWQLString(proj.waterQualityLevel)}}</span>
                    </div>
                  </template>
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
        </div>
      </div>


    </div>
</template>

<script>
  import {formatDate} from '../../assets/js/dateformat.js'
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
      name:'日',
      type:'hour'
    },{
      name:'月',
      type:'day'
    },{
      name:'年',
      type:'month'
    }];
  let siteTypeTab = [{
    name:'全部',
    type:'all'
  },{
    name:'同区域',
    type:'area'
  },{
    name:'同河流',
    type:'river'
  }];
  let tableData = [{
    factor: '溶解氧',
    company: 'mg/L',
    concentrationA: '2.31',
    waterQualityA:'Ⅱ类',
    concentrationB: '2.31',
    waterQualityB:'Ⅲ类',
    trendChange: '12.6%'
  }, {
    factor: '高锰酸盐',
    company: 'mg/L',
    concentrationA: '2.31',
    waterQualityA:'Ⅳ类',
    concentrationB: '2.31',
    waterQualityB:'Ⅴ类',
    trendChange: '-12.6%'
  },{
    factor: '氨氮',
    company: 'mg/L',
    concentrationA: '2.31',
    waterQualityA:'劣Ⅴ类',
    concentrationB: '2.31',
    waterQualityB:'Ⅴ类',
    trendChange: '12.6%'
  }];
  let waterData = [{
    time:'2018-07-13 12:00',
    COD:'1.32',
    chromium:'1.32',
    PH:'6.9',
    ammoniaNitrogen:'1.32',
    permanganate:'-',
    dissolvedOxygen:'1.32',
    totalPhosphorus:'1.32',
    totalNitrogen:'-'
  },{
    time:'2018-07-13 12:00',
    COD:'1.32',
    chromium:'1.32',
    PH:'6.9',
    ammoniaNitrogen:'1.32',
    permanganate:'-',
    dissolvedOxygen:'1.32',
    totalPhosphorus:'1.32',
    totalNitrogen:'-'
  },{
    time:'2018-07-13 12:00',
    COD:'1.32',
    chromium:'1.32',
    PH:'6.9',
    ammoniaNitrogen:'1.32',
    permanganate:'-',
    dissolvedOxygen:'1.32',
    totalPhosphorus:'1.32',
    totalNitrogen:'-'
  }];
  export default {
      name: "waterContrastAnalysisA",
      props:['nodes'],
      watch:{
        nodes(){
          this.searchData();
        }
      },
      data(){
        return {
          dataValue:'',//工具栏时间段绑定数据
          yearOnYearDate:'',//同比日期
          analogicalTime:'',//类比日期
          contrastSite:'奉贤区-浦南运河',
          pickerOptions,//时间框快捷带单数据
          dataType:0,//时间段按钮组选中下标
          dataTypeList,//时间段按钮组按钮数据
          timeTypeName: 'date',//时间框类型
          // dataValue2:'',//类比时间段绑定数据
          radioValue:'1',//同比、类比、环比单选绑定数据
          siteTypeTab,//环比站点tab头部数据
          siteTypeTabIndex:0,//环比站点tab头部选中下标
          detailsSiteList:[],//环比站点tab内容数据
          tableData,//对比详情表格数据
          tableDataB:tableData,//个数对比详情表格数据
          currentPage:1,//分页组件当前页
          total: 62,//分页总条数
          pageSize: 10,//分页每页多少条数据
          pageList:[10,15,20],//设置每页多少条
          waterData,//水质详情表格数据
          analysisDiagram: true,
          siteId:'a454641',
          headtitle:'',
          stationName:'',
          headcolumn:[],
          detailsTabActive:'concentration',//water 水质 concentration浓度
          headmark1:'',
          headmark2:'',
          headmark3:'',
          headmark4:'',
          blevel:'',
          clevel:'',
          bbtext:'',
          cctext:''
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
        dataTypeToggle(index,item){
          this.dataType = index;
          let yearOnYear = new Date(this.dataValue);
          yearOnYear.setFullYear(yearOnYear.getFullYear()-1);
          if (item.type === 'hour'){
            this.timeTypeName = 'date';
            this.yearOnYearDate = yearOnYear.format('yyyy-MM-dd');
          }else if(item.type ==='day'){
            this.timeTypeName = 'month';
            this.yearOnYearDate = yearOnYear.format('yyyy-MM');
          }else if(item.type === 'month'){
            this.timeTypeName = 'year';
            this.yearOnYearDate = yearOnYear.format('yyyy');
          }
          
        },
        comparediscrib(blevel,clevel){
          if(blevel=='0'||clevel=='0'){
            return "暂无对比";
          }else if(parseInt(blevel)==parseInt(clevel)){
            return "水质无变化";
          }else if(parseInt(blevel)<parseInt(clevel)){
            return "水质呈好转趋势";
          }else if(parseInt(blevel)==parseInt(clevel)){
            return "水质呈恶化趋势";
          }

        },
        toWQLClassStringq(wql){
          if(wql=='1'){
            return 'quality-icon qualityA';
          }else if(wql=='2'){
            return 'quality-icon qualityA';
          }else if(wql=='3'){
            return "quality-icon qualityB"
          }else if(wql=='4'){
            return "quality-icon qualityC";
          }else if(wql=='5'){
            return "quality-icon qualityD";
          }else if(wql=='6'){
            return "quality-icon qualityE";
          }else {
            return 'quality-icon qualityF';
          }
        },
        toWQLClassString(wql){
          if(wql=='1'){
            return 'grade-text gradeA';
          }else if(wql=='2'){
            return 'grade-text gradeA';
          }else if(wql=='3'){
            return "grade-text gradeB"
          }else if(wql=='4'){
            return "grade-text gradeC";
          }else if(wql=='5'){
            return "grade-text gradeD";
          }else if(wql=='6'){
            return "grade-text gradeE";
          }else {
            return 'grade-text gradeF';
          }
        },
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
            return '--';
          }
        },
        selectSiteType(index){
          this.siteTypeTabIndex = index;
        },
        dateChangeValue(val){
          let selectDate = val.format('yyyy,MM,dd');
          let yearOnYear = new Date(selectDate);
          let analogical = new Date(selectDate);
          yearOnYear.setFullYear(yearOnYear.getFullYear()-1);
          if(this.dataType === 0){
            this.yearOnYearDate = yearOnYear.format('yyyy-MM-dd');
          }else if(this.dataType === 1){
            this.yearOnYearDate = yearOnYear.format('yyyy-MM');
          }else if(this.dataType === 2){
            this.yearOnYearDate = yearOnYear.format('yyyy');
          }
          analogical.setMonth(analogical.getMonth()-1);
          this.analogicalTime = analogical.format('yyyy-MM-dd');
        },
        initTime(){
          var date=new Date();
          this.dataValue=new Date(date.getTime()-86400*1000);
        },
        searchStations(){  //查找类比站点
          var type=siteTypeTab[this.siteTypeTabIndex].type;
          var equipIds=[];
          equipIds.push(this.nodes.id);
          var paramsp={
            type:type
          };
          if(type!='all'){
            paramsp={
              type:type,
              equipId:equipIds.toString()
            };
          }
          this.$http.get('/waterenvapi/basic/stationList',{
            params:paramsp
          }).then((response)=>{
            let dataJson = response.data;

            if(dataJson.code === 200){

              var inputarr=[];
              var list=dataJson.content.dataList;
              for(var i=0;i<list.length;i++){
                inputarr.push({
                  name:list[i].dataEquipName,
                  checked:false
                });
              }
              this.detailsSiteList=inputarr;
            }
          }).catch((error)=>{

          });
        },
        checksiteinit(){  //检查引入组件已初始化并加载初始化数据
          var self=this;
          var timer=setInterval(function(){
            if(self.nodes.id){
              self.searchStations();
              self.searchData();
              clearInterval(timer);
            }
          },100);
        },
        searchData(){  //查询数据
          this.$emit('update:loading',true);
          this.projectCompareDetail();
          this.searchcolumn();
          // this.waterQualityProportionChart();
          // this.waterQualityBar();
          // this.waterQualityComparison();
          // this.superStandardContrast();
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
        projectCompareDetail(){ //监测因子对比详情
          var statisType=dataTypeList[this.dataType].type;
          var startTime=formatDate(this.dataValue,'yyyy-MM-dd hh:mm:ss');
          var endTime=this.analogicalTime+" 00:00:00";
          if(this.radioValue=='1'){
            if(statisType=='hour'){
              endTime=this.yearOnYearDate+" 00:00:00";
            }else if(statisType=='day'){
              endTime=this.yearOnYearDate+"-01 00:00:00";
            }else{
              endTime=this.yearOnYearDate+"-01-01 00:00:00";
            }
          }else{
            try{
              endTime=formatDate(this.analogicalTime,'yyyy-MM-dd hh:mm:ss');
            }catch(err) {
              endTime=this.analogicalTime+" 00:00:00";
            }
          }
          // this.headmark1=startTime.substring(0,7)+"浓度";
          // this.headmark2=startTime.substring(0,7)+"水质";
          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:this.nodes.structureType,
            endTime:endTime,
            equipdIds:this.nodes.id
          }
          this.$http.get('/waterenvapi/station/projectCompareDetail',{
            params:paramsp
          }).then((response)=>{
            let dataJson = response.data;
            if(dataJson.code === 200){
              var list = dataJson.content.dataList;
              var info=dataJson.content.info;
              this.blevel=info.blevel;
              this.clevel=info.clevel;
              this.bbtext=info.bbtext;
              this.cctext=info.cctext;
              this.frountpage(list);
            }
          }).catch((error)=>{

          });
        },
        searchcolumn(){ //查询表头
          this.$http.get('/waterenvapi/basic/stationRefProjects',{
            params:{
              equipIds: this.nodes.id.toString()
            }
          }).then((response)=>{
            let dataJson = response.data;
            if(dataJson.code === 200){
              this.headcolumn = dataJson.content.dataList;
              this.searchprojectComparedata();
            }
          }).catch((error)=>{

          });
        },
        searchprojectComparedata(){
          var equipIds=[];
          equipIds.push(this.nodes.id);
          var statisType=dataTypeList[this.dataType].type;
          var startTime=formatDate(this.dataValue,'yyyy-MM-dd hh:mm:ss');
          var endTime=this.analogicalTime+" 00:00:00";
          if(this.radioValue=='1'){
            if(statisType=='hour'){
              endTime=this.yearOnYearDate+" 00:00:00";
            }else if(statisType=='day'){
              endTime=this.yearOnYearDate+"-01 00:00:00";
            }else{
              endTime=this.yearOnYearDate+"-01-01 00:00:00";
            }
          }else{
            try{
              endTime=formatDate(this.analogicalTime,'yyyy-MM-dd hh:mm:ss');
            }catch(err) {
              endTime=this.analogicalTime+" 00:00:00";
            }
          }
          
          if(statisType=='hour'){
            this.headmark1=startTime.substring(0,10)+"日浓度";
            this.headmark2=startTime.substring(0,10)+"日水质";
            this.headmark3=endTime.substring(0,10)+"日浓度";
            this.headmark4=endTime.substring(0,10)+"日水质";
          }else if(statisType=='day'){
            this.headmark1=startTime.substring(0,7)+"月浓度";
            this.headmark2=startTime.substring(0,7)+"月水质";
            this.headmark3=endTime.substring(0,7)+"月浓度";
            this.headmark4=endTime.substring(0,7)+"月水质";
          }else{
            this.headmark1=startTime.substring(0,4)+"年浓度";
            this.headmark2=startTime.substring(0,4)+"年水质";
            this.headmark3=endTime.substring(0,4)+"年浓度";
            this.headmark4=endTime.substring(0,5)+"年水质";
          }
          
          //this.headtitle=this.nodes.label+startTime+'与'+endTime+'对比分析';
          if(statisType=='hour'){
            this.headtitle=this.nodes.label+startTime.substring(0,10)+'与'+endTime.substring(0,10)+'对比分析';
            //charttext=startTime.substring(0,10);
            //charttextend=endTime.substring(0,10);
          }else if(statisType=='day'){
            this.headtitle=this.nodes.label+startTime.substring(0,7)+'与'+endTime.substring(0,7)+'对比分析';
            //charttext=startTime.substring(0,7);
            //charttextend=endTime.substring(0,7);
          }else{
            this.headtitle=this.nodes.label+startTime.substring(0,4)+'与'+endTime.substring(0,4)+'对比分析';
            //charttext=startTime.substring(0,4);
            //charttextend=endTime.substring(0,4);
          }
          this.stationName=this.nodes.label;
          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:this.nodes.structureType,
            endTime:endTime,
            equipdIds:this.nodes.id
          }
          this.$http.get('/waterenvapi/station/totalProjectCompare',{
            params:paramsp
          }).then((response)=>{
            let dataJson = response.data;
            if(dataJson.code === 200){
              this.waterData = dataJson.content.dataList;
            }
            this.$emit('update:loading',false);
          }).catch((error)=>{
            this.$emit('update:loading',false);
          });
        },
        setWaterGradeCls(data){//设置表格水质class
          let cls = '';
          switch(data){
            case 1:
              cls = 'waterGradeA';
              break;
            case 2:
              cls = 'waterGradeA';
              break;
            case 3:
              cls = 'waterGradeB';
              break;
            case 4:
              cls = 'waterGradeC';
              break;
            case 5:
              cls = 'waterGradeD';
              break;
            case 6:
              cls = 'waterGradeE';
              break;
          }
          return cls;
        },
        setTrendChangeCls(data){//设置表格变化趋势class
          let cls = '';
          if(data==-1){
            cls = 'decline-icon';
          }else if(data==1){
            cls = 'ascend-icon';
          }
          return cls;
        },
        paginationChange(val){//分页页码改变时执行
          this.currentPage = val;
        },
        paginationSizeChange(val){//分页pageSize改变时执行
          this.currentPage = val;
        },
        sectionWaterTable(column, event){//点击表格头部
          let data = {
            name: column.label,
            factor: column.property,
            siteId: this.siteId
          };
          this.$emit('openChart',data);
        },
        toggleQualityDetailsTab(type){//水质浓度切换
          this.detailsTabActive = type;
          if(type === 'water'){//水质tab
          }else{//浓度tab
          }
        }
      },
      mounted(){
        var date=new Date();    
        let time = new Date(date.getTime()-86400*1000);//工具栏时间
        let yearOnYear = new Date(date.getTime()-86400*1000);//同比时间
        let analogical = new Date(date.getTime()-86400*1000);//类比时间
        this.dataValue = time.format('yyyy-MM-dd');//设置工具栏当前时间
        yearOnYear.setFullYear(yearOnYear.getFullYear()-1);
        analogical.setMonth(analogical.getMonth()-1);
        this.yearOnYearDate = yearOnYear.format('yyyy-MM-dd');//设置同比时间
        this.analogicalTime = analogical.format('yyyy-MM-dd');//设置类比时间
        this.initTime();
        this.checksiteinit();
        //this.waterQualityChartChart();
      },
      components:{

      }
  }
</script>

<style scoped lang="less">
.water-contrast-analysis{
  height: 100%;
}
.statistical-analysis-title{
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  text-align: center;
}
/* 同比、类比、环比 部分样式 ['Ⅰ类','Ⅱ类','Ⅲ类','Ⅳ类','Ⅴ类','劣Ⅴ类'] */
.similarities-analogies-rings{
  padding: 8px;
  border: 1px solid #d9e6f7;
  margin-top: 8px;
  margin-bottom: 21px;
  .similarities-row{
    padding: 4px 8px;
    height: 38px;
    line-height: 30px;
    .date-picker-wrap{
      display: inline-block;
      vertical-align: top;
    }
  }
  .explanatory-text{
    color: #999;
    display: inline-block;
    width: 360px;
  }
  .site-type-tab{
    height: 30px;
    border-bottom: 1px solid #166bce;
    padding-left: 8px;
    margin-top: 6px;
    li{
      float: left;
      border: 1px solid #cbcbcb;
      border-bottom: none;
      height: 29px;
      line-height: 28px;
      width: 72px;
      text-align: center;
      border-right-color: transparent;
      cursor: pointer;
    }
    li:last-child{
      border-right: 1px solid #cbcbcb;
    }
    li.active{
      border: 1px solid #166bce;
      border-bottom: none;
      position: relative;
      color: #166bce;
    }
    li.active+li{
      border-left-color: transparent;
    }
    li.active:after{
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background: #fff;
      left: 0;
      bottom: -1px;
    }
    li:hover{
      color: #166bce;
    }
  }
  .details-site-list{
    padding: 4px 4px 2px;
    position: relative;
    li{
      float: left;
      width: 116px;
      padding: 4px 0;
    }
  }
  .toggle-btn{
    position: absolute;
    width: 46px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    left: 50%;
    bottom: -14px;
    margin-left: -23px;
    background: url("../../assets/images/toggle-btn.png") no-repeat;
    padding: 0;
    cursor: pointer;
    opacity: 0.8;
    i{
      font-size: 12px;
      color: #ffa153;
    }
  }
  .toggle-btn:hover{
    opacity: 1;
  }
}

  /* 模块内容 */
.secondary-mode-content{
  padding: 8px;
  .secondary-mode-title {
    height: 36px;
    line-height: 36px;
    color: #166bce;
    .block-icon {
      width: 8px;
      height: 8px;
      background: #166bce;
      margin-right: 4px;
    }
  }
}

/* 水质详情部分样式 */
.water-quality-details{
  height: 342px;
  .water-quality-ratio{
    height: 100%;
    width: 254px;
    border: 1px solid #c6d1de;
    padding: 0 10px;
    float: left;
    .ratio-title{
      text-align: center;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ratio-item{
      display: table;
      width: 100%;
      height: 92px;
    }
    .ratio-item>div{
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      &>.quality-icon{
        display: inline-block;
        vertical-align: middle;
        width: 59px;
        height: 57px;
      }
      .qualityA{
        background: url("../../assets/images/water_quality_01.png") no-repeat center center;
      }
      .qualityB{
        background: url("../../assets/images/water_quality_02.png") no-repeat center center;
      }
      .qualityC{
        background: url("../../assets/images/water_quality_03.png") no-repeat center center;
      }
      .qualityD{
        background: url("../../assets/images/water_quality_04.png") no-repeat center center;
      }
      .qualityE{
        background: url("../../assets/images/water_quality_05.png") no-repeat center center;
      }
      &>.explain-info{
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        margin-left: 6px;
        .grade-text{
          font-size: 18px;
        }
        .gradeA{
          color: #00a1e4;
        }
        .gradeB{
          color: #24c768;
        }
        .gradeC{
          color: #e5ce10;
        }
        .gradeD{
          color: #ff7e00;
        }
        .gradeE{
          color: #ff0000;
        }
        .ratio-time{
          color: #999999;
        }
      }
    }
    .ratio-item:nth-child(2){
      border-bottom: 1px dashed #d9e1ec;
    }
    .analysis-text{
      padding: 10px 12px;
      margin: 5px;
      height: 96px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      p{
        padding-left: 16px;
        position: relative;
        font-size: 12px;
        line-height: 22px;
        &>b{
          color: #166bce;
        }
        &>b.deteriorate{
          color: #ff0000;
        }
      }
      p:before{
        content:'';
        position: absolute;
        border-radius: 50%;
        width: 5px;
        height: 5px;
        background: #a0b2c7;
        margin: 0 8px 2px 0;
        top: 8px;
        left: 2px;
      }
    }
  }
  .water-quality-table{
    height: 100%;
    width: calc(100% - 262px);
    border-top: 1px solid #c6d1de;
    float: right;
    .contrast-title{
      border-left: 1px solid #c6d1de;
      border-right: 1px solid #c6d1de;
    }
  }
  #water-quality-pei,
  #water-quality-bar{
    height: 100%;
  }
  .normal-table-wrap{
    height: calc(100% - 81px);
  }
}
/* 分析结论部分样式 */
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
.contrast-title{
  text-align: center;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}
#water-quality-comparison,
#super-standard-contrast{
  height: 270px;
}
.normal-table-wrap{
  .sl-icon{
    width: 8px;
    height: 8px;
  }
  .icon-jiantou-copy{
    display: inline-block;
    vertical-align: top;
  }
}
.waterGradeA{
  background: #00a1e4;
}
.waterGradeB{
  background: #24c768;
}
.waterGradeC{
  background: #e5ce10;
}
.waterGradeD{
  background: #ff7e00;
}
.waterGradeE{
  background: #ff0000;
}
.icon-jiantou-copy.decline-icon{
  color: #24c768;
  transform: rotate(90deg);
}
.icon-jiantou-copy.ascend-icon{
  color: #ff0000;
  transform: rotate(-90deg);
}
.section-water-quality-details{
  height: 30px;
  line-height: 28px;
  border: 1px solid #c6d1de;
  margin-bottom: 8px;
  .water-quality-details-tab{
    float: left;
    li{
      float: left;
      padding: 0 20px;
      border-right: 1px solid #c6d1de;
      cursor: pointer;
    }
    li.active{
      background: #166bce;
      color: #fff;
      position: relative;
      border-right-color: #166bce;
    }
    li.active:after{
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: #166bce;
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
      transform: rotate(45deg);
    }
  }
  .water-quality-tips{
    float: right;
    margin-right: 5px;
  }
  .water-quality-tips:before{
    content: '';
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 3px;
    width: 5px;
    height: 5px;
    background: #b3b3b3;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
