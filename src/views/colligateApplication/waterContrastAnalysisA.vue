<template>
    <!-- 水质现状分析(河流/区域) -->
    <div class="water-contrast-analysis">
      <div class="secondary-scroll-content">
        <h4 class="statistical-analysis-title">{{headtitle}} </h4>
        <!-- 工具栏部分 -->
        <div class="secondary-toolbar">
          <span>时间选择：</span>
          <el-button-group>
            <el-button
              :class="{active:dataType === index}"
              size="small" type="primary" plain
              :key = "index"
              v-for="(item,index) in dataTypeList"
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
                对比时间：
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
              v-for="(item,index) in siteTypeTab" :key="index">
              {{ item.name}}
            </li>
          </ul>
          <ul class="details-site-list clear" v-if="radioValue === '3'">
            <li v-for="(item,key) in detailsSiteList" :key="key">
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
            <div class="secondary-mode-row">
              <h4 class="secondary-mode-title">
                <i class="sl-icon block-icon"></i>
                <span>奉贤区断面水质详情</span>
              </h4>
              <div class="water-quality-details">
                <div class="water-quality-ratio">
                  <div v-if="qualityLoading" class="loading-wrap"></div>
                  <div v-if="qualityNoDataState" class="no-data-wrap small">
                    <p>暂无数据</p>
                  </div>
                  <div id="water-quality-pei"></div>
                </div>
                <div class="water-quality-ratio">
                  <div v-if="qualityBarLoading" class="loading-wrap"></div>
                  <div v-if="qualityBarNoDataState" class="no-data-wrap small">
                    <p>暂无数据</p>
                  </div>
                  <div id="water-quality-bar"></div>
                </div>
              </div>
              <div class="statistical-analysis-text">
                <p>{{alaresult}}</p>
              </div>
            </div>
            <div class="secondary-mode-row">
              <h4 class="secondary-mode-title">
                <i class="sl-icon block-icon"></i>
                <span>各因子水质对比</span>
              </h4>
              <div class="secondary-mode-row">
                <div v-if="comparisonLoading" class="loading-wrap"></div>
                <div v-if="comparisonNoDataState" class="no-data-wrap small">
                  <p>暂无数据</p>
                </div>
                <div id="water-quality-comparison"></div>
              </div>
            </div>
            <div class="secondary-mode-row">
              <div class="contrast-table-wrap">
                <div v-if="contrastLoading" class="loading-wrap"></div>
                <div v-if="contrastNoDataState" class="no-data-wrap small">
                  <p>暂无数据</p>
                </div>
                <h4 class="contrast-title">各因子监测值对比详情</h4>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="statisDate"
                    label="年限"
                    width="120">
                  </el-table-column >
                  <el-table-column :key="index" v-for="(item,index) in headcolumn"
                                   :property="item.projectCode"
                                   :label="item.projectName">
                    <template slot-scope="scope">
                      <div class="data-table-cell" :key="num" v-for="(proj,num) in scope.row.projects">
                    <span
                      v-if="proj.code==item.projectCode&&proj.state === 'normal'"
                    >{{ proj.value}}</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="secondary-mode-row">
              <h4 class="secondary-mode-title">
                <i class="sl-icon block-icon"></i>
                <span>各因子超标断面个数对比</span>
              </h4>
              <div class="secondary-mode-row">
                <div v-if="exceedLoading" class="loading-wrap"></div>
                <div v-if="exceedNoDataState" class="no-data-wrap small">
                  <p>暂无数据</p>
                </div>
                <div id="super-standard-contrast"></div>
              </div>
            </div>
            <div class="secondary-mode-row">
              <div v-if="factorsLoading" class="loading-wrap"></div>
              <div v-if="factorsNoDataState" class="no-data-wrap small">
                <p>暂无数据</p>
              </div>
              <h4 class="contrast-title">各因子超标断面个数对比详情</h4>
              <div class="contrast-table-wrap">
                  <el-table
                    :data="tableDataB"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="statisDate"
                      label="年限"
                      width="120">
                    </el-table-column>
                    <el-table-column :key="index" v-for="(item,index) in headcolumn"
                                     :property="item.projectCode"
                                     :label="item.projectName">
                      <template slot-scope="scope">
                        <div class="data-table-cell" :key="num" v-for="(proj,num) in scope.row.projects">
                      <span
                        v-if="proj.code==item.projectCode&&proj.state === 'normal'"
                      >{{ proj.value}}</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
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
    date: '2018年6月',
    COD: '1.32',
    PH: '6.9',
    ammoniaNitrogen:'1.32',
    permanganate:'-',
    dissolvedOxygen:'1.32',
    totalPhosphorus:'1.32',
    totalNitrogen:'2.36'
  }, {
    date: '2017年6月',
    COD: '1.32',
    PH: '6.9',
    ammoniaNitrogen:'1.32',
    permanganate:'-',
    dissolvedOxygen:'1.32',
    totalPhosphorus:'1.32',
    totalNitrogen:'2.36'
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
          qualityLoading: true,
          qualityNoDataState: false,
          qualityBarLoading: true,
          qualityBarNoDataState: false,
          comparisonLoading: true,
          comparisonNoDataState: false,
          contrastLoading: true,
          contrastNoDataState: false,
          exceedLoading: true,
          exceedNoDataState: false,
          factorsLoading: true,
          factorsNoDataState: false,
          dataValue:'',//工具栏时间段绑定数据
          yearOnYearDate:'',//同比日期
          alaresult:'',
          analogicalTime:'',//类比日期
          contrastSite:'奉贤区-浦南运河',
          pickerOptions,//时间框快捷带单数据
          dataType:0,//时间段按钮组选中下标
          dataTypeList,//时间段按钮组按钮数据
          timeTypeName: 'date',//时间框类型
          radioValue:'1',//同比、类比、环比单选绑定数据
          siteTypeTab,//环比站点tab头部数据
          siteTypeTabIndex:0,//环比站点tab头部选中下标
          detailsSiteList:[],//环比站点tab内容数据
          tableData,//对比详情表格数据
          tableDataB:tableData,//个数对比详情表格数据
          myChartWater:'',//饼图charts
          myChartBar:'',//比例详情charts
          myChartContrast:'',//各因子水质对比charts
          myChartNumber:'',//各因子超标断面个数对比charts.
          headcolumn:[],
          headtitle:''
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
        selectSiteType(index){
          this.siteTypeTabIndex = index;
          this.searchStations();
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
          var self = this;
          var timer = setInterval(function(){
            if(self.nodes.id){
              self.searchStations();
              self.searchData();
              clearInterval(timer);
            }else{
              self.qualityLoading =  false;
              self.qualityNoDataState = true;
              self.qualityBarLoading = false;
              self.qualityBarNoDataState = true;
              self.comparisonLoading = false;
              self.comparisonNoDataState = true;
              self.contrastLoading = false;
              self.contrastNoDataState = true;
              self.exceedLoading = false;
              self.exceedNoDataState = true;
              self.factorsLoading = false;
              self.factorsNoDataState = true;
          }
          },100);
        },
        searchData(){  //查询数据
          this.qualityLoading =  true;
          this.qualityNoDataState = false;
          this.qualityBarLoading = true;
          this.qualityBarNoDataState = false;
          this.comparisonLoading = true;
          this.comparisonNoDataState = false;
          this.contrastLoading = true;
          this.contrastNoDataState = false;
          this.exceedLoading = true;
          this.exceedNoDataState = false;
          this.factorsLoading = true;
          this.factorsNoDataState = false;

          this.searchcolumn();
          this.waterQualityProportionChart();
          this.waterQualityBar();
          this.waterQualityComparison();
          this.superStandardContrast();
        },
        initTime(){
          var date=new Date();
          this.dataValue=new Date(date.getTime()-86400*1000);
        },
        searchcolumn(){
          /* 基本信息请求 */
          var equipIds=[];
          for(var i=0;i<this.nodes.children.length;i++){
            var node=this.nodes.children[i];
            if(node.structureType!='station'){
              var list=node.children;
              for(var j=0;j<list.length;j++){
                var vnode=list[j];
                equipIds.push(vnode.id);
              }
            }else{
              equipIds.push(node.id);
            } 
          }
          this.$http.get('/waterenvapi/basic/stationRefProjects',{
            params:{
              equipIds: equipIds.toString()
            }
          }).then((response)=>{
            let dataJson = response.data;
            if(dataJson.code === 200){
              this.headcolumn = dataJson.content.dataList;
              this.searchprojectComparedata();
              this.superStandardContrast();
            }
          }).catch((error)=>{

          });
        },
        searchprojectComparedata(){
          var equipIds=[];
          for(var i=0;i<this.nodes.children.length;i++){
            var node=this.nodes.children[i];
            if(node.structureType!='station'){
              var list=node.children;
              for(var j=0;j<list.length;j++){
                var vnode=list[j];
                equipIds.push(vnode.id);
              }
            }else{
              equipIds.push(node.id);
            } 
          }
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
          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:'station',
            endTime:endTime,
            equipdIds:equipIds.toString()
          }
          this.$http.get('/waterenvapi/station/totalProjectCompare',{
            params:paramsp
          }).then((response)=>{
            let dataJson = response.data;
            if(dataJson.code === 200){
              this.tableData = dataJson.content.dataList;
              if(dataJson.content.dataList.length === 0){
                this.contrastNoDataState = true;
              }else{
                this.contrastNoDataState = false;
              }
            }
            this.contrastLoading = false;
          }).catch((error)=>{
            this.contrastLoading = false;
            this.contrastNoDataState = true;
          });
        },
        getparams(){
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
          var paramsp={
            equipdIds: equipIds.toString(),
            statisType:statisType,
            startTime:startTime,
            endTime:endTime,
            pageSize:2000,
            pageNumber:1
          }
          if(this.nodes.structureType=='river'){
            paramsp={
              statisType:statisType,
              startTime:startTime,
              queryType:'station',
              endTime:endTime,
              pageSize:2000,
              pageNumber:1,
              riverIds:this.nodes.id
            }
          }else if(this.nodes.structureType=='area'){
            paramsp= {
              statisType: statisType,
              startTime: startTime,
              queryType: 'station',
              endTime: endTime,
              pageSize: 2000,
              pageNumber: 1,
              areaIds: this.nodes.id
            }
          }
          return paramsp;
        },
        dateChangeValue(val){//时间选择值改变时执行
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
        waterQualityProportionChart(){//水质比例图表
          this.myChartWater = this.$echarts.init(document.getElementById('water-quality-pei'));
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
          var charttext="";
          var charttextend="";
          if(statisType=='hour'){
            this.headtitle=this.nodes.label+startTime.substring(0,10)+'与'+endTime.substring(0,10)+'对比分析';
            charttext=startTime.substring(0,10);
            charttextend=endTime.substring(0,10);
          }else if(statisType=='day'){
            this.headtitle=this.nodes.label+startTime.substring(0,7)+'与'+endTime.substring(0,7)+'对比分析';
            charttext=startTime.substring(0,7);
            charttextend=endTime.substring(0,7);
          }else{
            this.headtitle=this.nodes.label+startTime.substring(0,4)+'与'+endTime.substring(0,4)+'对比分析';
            charttext=startTime.substring(0,4);
            charttextend=endTime.substring(0,4);
          }
          
          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:'station',
            endTime:endTime,
            riverIds:this.nodes.id
          };
          if(this.nodes.structureType=='area'){
            paramsp= {
              statisType: statisType,
              startTime: startTime,
              queryType: 'station',
              endTime: endTime,
              areaIds: this.nodes.id
            }
          }
          this.$http.get('/waterenvapi/station/realStatisComparePieChart?areaName='+this.nodes.label,{
            params:paramsp
          }).then((response)=>{
            let dataJson = response.data;
            this.alaresult=dataJson.content.info;
            var list=dataJson.content.dataList;
            var datab=[];
            var datac=[];
            if(list.length>1){
              var listb=list[0];
              var listc=list[1];
              if(listb.length>0){
                for(var i=0;i<listb.length;i++){
                  datab.push({
                    name:listb[i].name,
                    value:listb[i].value,
                  });
                }
              }
              if(listc.length>0){
                for(var i=0;i<listc.length;i++){
                  datac.push({
                    name:listc[i].name,
                    value:listc[i].value,
                  });
                }
              }
            }
            if(list[0].length === 0 && list[1].length === 0){
              this.qualityNoDataState = true;
            }else{
              this.qualityNoDataState = false;
            }
            let option = {
              color:["#00a1e4","#24c768","#e5ce10","#ff7e00","#ff0000"],
              title : [{
                text: charttext+'断面水质比例',
                subtext:'水质状况：轻度污染',
                subtextStyle:{
                  color: "#333",
                  fontSize: 13
                },
                x:'24%',
                y: 10,
                textAlign: 'center'
              },{
                text: charttextend+'断面水质比例',
                subtext:'水质状况：良',
                subtextStyle:{
                  color: "#333",
                  fontSize: 13
                },
                x:'74%',
                y: 10,
                textAlign: 'center'
              }],
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                bottom: 10,
                itemGap: 30,
                data: [{name:'Ⅰ~Ⅱ类',icon:"rect"},
                  {name:'Ⅲ类',icon:"rect"},
                  {name:'Ⅳ类',icon:"rect"},
                  {name:'Ⅴ类',icon:"rect"},
                  {name:'劣Ⅴ类',icon:"rect"}]
              },
              series : [{
                name: '水质等级',
                type: 'pie',
                radius : '60%',
                center:['26%','53%'],
                selectedMode: 'single',
                label: {
                  normal: {
                    show: false,
                    formatter: '{a|{d}%}\n{b|{b}}',
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
                  },
                  emphasis:{
                    show: true
                  }
                },
                data:datab
              },{
                name: '水质等级',
                type: 'pie',
                radius : '60%',
                center:['74%','53%'],
                selectedMode: 'single',
                label: {
                  normal: {
                    show: false,
                    formatter: '{a|{d}%}\n{b|{b}}',
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
                  },
                  emphasis:{
                    show: true
                  }
                },
                data:datac
              }]
            };
            this.myChartWater.setOption(option);
            this.qualityLoading = false;
          }).catch((error)=>{
            this.qualityLoading = false;
            this.qualityNoDataState = true;
          });
        },
        waterQualityBar(){
          this.myChartBar = this.$echarts.init(document.getElementById('water-quality-bar'));
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

          var charttext="";
          var charttextend="";
          if(statisType=='hour'){
            charttext=startTime.substring(0,10);
            charttextend=endTime.substring(0,10);
          }else if(statisType=='day'){
            charttext=startTime.substring(0,7);
            charttextend=endTime.substring(0,7);
          }else{
            charttext=startTime.substring(0,4);
            charttextend=endTime.substring(0,4);
          }


          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:'station',
            endTime:endTime,
            riverIds:this.nodes.id
          };
          if(this.nodes.structureType=='area'){
            paramsp= {
              statisType: statisType,
              startTime: startTime,
              queryType: 'station',
              endTime: endTime,
              areaIds: this.nodes.id
            }
          }
          this.$http.get('/waterenvapi/station/realStatisComparePieChart',{
            params:paramsp
          }).then((response)=> {
            let dataJson = response.data;
            var list = dataJson.content.dataList;
            var datab = [null,null,null,null,null,null];
            var datac = [];
            if (list.length > 1) {
              var listb = list[0];
              var listc = list[1];
              var total=0;
              if (listb.length > 0) {
                for (var i = 0; i < listb.length; i++) {
                  total=total+parseInt(listb[i].value);
                  if(listb[i].name=='Ⅰ~Ⅱ类'){
                    datab[0]={
                      name: listb[i].name,
                      value: listb[i].value,
                    }
                  }else if(listb[i].name=='Ⅲ类'){
                    datab[1]={
                      name: listb[i].name,
                      value: listb[i].value,
                    }
                  }else if(listb[i].name=='Ⅳ类'){
                    datab[2]={
                      name: listb[i].name,
                      value: listb[i].value,
                    }
                  }else if(listb[i].name=='Ⅴ类'){
                    datab[3]={
                      name: listb[i].name,
                      value: listb[i].value,
                    }
                  }else if(listb[i].name=='劣Ⅴ类'){
                    datab[4]={
                      name: listb[i].name,
                      value: listb[i].value,
                    }
                  }
                }
              }
              var totalc=0;
              if (listc.length > 0) {
                for (var i = 0; i < listc.length; i++) {
                  totalc=totalc+parseInt(listc[i].value);
                  if(listc[i].name=='Ⅰ~Ⅱ类'){
                    datac[0]={
                      name: listc[i].name,
                      value: listc[i].value,
                    }
                  }else if(listc[i].name=='Ⅲ类'){
                    datac[1]={
                      name: listc[i].name,
                      value: listc[i].value,
                    }
                  }else if(listc[i].name=='Ⅳ类'){
                    datac[2]={
                      name: listc[i].name,
                      value: listc[i].value,
                    }
                  }else if(listc[i].name=='Ⅴ类'){
                    datac[3]={
                      name: listc[i].name,
                      value: listc[i].value,
                    }
                  }else if(listc[i].name=='劣Ⅴ类'){
                    datac[4]={
                      name: listc[i].name,
                      value: listc[i].value,
                    }
                  }
                }
              }
            }
            if(list.length === 0){
              this.qualityBarNoDataState = true;
            }else{
              this.qualityBarNoDataState = false;
            }
            if(list[0].length === 0 && list[1].length === 0 ){
              this.qualityBarNoDataState = true;
            }else{
              this.qualityBarNoDataState = false;
            }
            let option = {
              tooltip : {
                trigger: 'item'
              },
              title:{
                text: charttext+'与'+charttextend+'水质比例详情',
                x:'center',
                y: 10
              },
              grid: [{
                top:80,
                left: 100,
                right: 50,
                height: '32%'
              }, {
                left: 100,
                right: 50,
                top: '56%',
                height: '32%'
              }],
              legend: {
                data:[charttext,charttextend],
                orient: 'vertical',
                itemGap: 50,
                left: 0,
                y: '42%',
                itemWidth:0,
                itemHeight:0
              },
              xAxis: [{
                type: 'category',
                data: ['Ⅰ~Ⅱ类','Ⅲ类','Ⅳ类','Ⅴ类','劣Ⅴ类'],
                position: 'top',
                axisLine:{
                  show: false
                },
                axisTick:{
                  show: false
                },
              },{
                gridIndex: 1,
                type: 'category',
                data: ['Ⅰ~Ⅱ类','Ⅲ类','Ⅳ类','Ⅴ类','劣Ⅴ类'],
                position: 'top',
                axisLine:{
                  show: false
                },
                axisTick:{
                  show: false
                },
                axisLabel:{
                  show: false
                }
              }],
              yAxis: [{
                type: 'value',
                position:'right',
                axisTick:{
                  show: false
                },
                axisLabel:{
                  formatter: '{value} %'
                },
                axisLine:{
                  show: false
                },
                splitLine:{
                  lineStyle:{
                    color:"#cee1e9"
                  }
                }
              },{
                gridIndex: 1,
                position:'right',
                type: 'value',
                inverse: true,
                axisTick:{
                  show: false
                },
                axisLabel:{
                  formatter: '{value} %'
                },
                axisLine:{
                  show: false
                },
                splitLine:{
                  lineStyle:{
                    color:"#cee1e9"
                  }
                }
              }],
              series: [{
                name:startTime.substring(0,10),
                data: datab,
                type: 'bar',
                barWidth:14,
                itemStyle: {
                  normal: {
                    color: '#00a1e4'
                  }
                },
                zlevel:9
              },{
                name:"bg",
                data: [total, total, total, total, total],
                type: 'bar',
                barWidth:14,
                barGap: '-100%',
                itemStyle: {
                  normal: {
                    color: '#ddebf1'
                  }
                }
              },{
                name:endTime.substring(0,10),
                data: datac,
                type: 'bar',
                barWidth:14,
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: '#00a1e4'
                  }
                },
                zlevel:9
              },{
                name:"bg",
                data: [totalc, totalc, totalc, totalc, totalc],
                type: 'bar',
                barWidth:14,
                xAxisIndex: 1,
                barGap: '-100%',
                yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: '#ddebf1'
                  }
                },
              }]
            };
            this.myChartBar.setOption(option);

            this.qualityBarLoading = false;
          }).catch((error)=>{
            this.qualityBarLoading = false;
            this.qualityBarNoDataState = true;
          });

        },//水质比例详情图表
        factorComparisonBar(chart){
          this[chart.obj] = this.$echarts.init(document.getElementById(chart.id));
          let option = {
            color:['#00a1e4','#ff7e00','#24c768','#e5ce10','#ff0000'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              top: 10,
              left: 20,
              right: '4%',
              bottom: 40,
              containLabel: true
            },
            legend: {
              data:chart.legend,
              bottom: 10,
              itemWidth: 10,
              itemHeight: 10
            },
            xAxis : [
              {
                type : 'category',
                data : chart.xAxisDate,
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
                },
                splitLine:{
                  show:true
                }
              }
            ],
            series : [
              {
                name:chart.legend[0].name,
                type:'bar',
                data: chart.seriesDataA,
                barWidth: 20
              },
              {
                name:chart.legend[1].name,
                type:'bar',
                barWidth: 20,
                data: chart.seriesDataB
              }
            ]
          };
          this[chart.obj].setOption(option);
        },
        waterQualityComparison(){
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
          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:'station',
            endTime:endTime,
            riverIds:this.nodes.id
          }
          if(this.nodes.structureType=='area'){
            paramsp= {
              statisType: statisType,
              startTime: startTime,
              queryType: 'station',
              endTime: endTime,
              areaIds: this.nodes.id
            }
          }
          this.$http.get('/waterenvapi/station/projectStatisCompareChart',{
            params:paramsp
          }).then((response)=> {
            let dataJson = response.data;
            var list = dataJson.content.dataList;
            if(list[0].xAxis.length === 0 && list[1].xAxis.length === 0){
              this.comparisonNoDataState = true;
            }else{
              this.comparisonNoDataState = false;
            }
            if(list.length>1){
              let chart = {
                obj:'myChartContrast',
                id:'water-quality-comparison',
                legend:[{name: startTime,icon:'rect'},{name: endTime,icon:'rect'}],
                xAxisDate:list[0].xAxis,
                seriesDataA:list[0].yAxis[0].list,
                seriesDataB:list[1].yAxis[0].list,
              };

              this.factorComparisonBar(chart);
            }
            this.comparisonLoading = false;
          }).catch((error)=> {
            this.comparisonLoading = false;
            this.comparisonNoDataState = true;
          });
        },
        superStandardContrast(){
          var projIds=[];
          for(let i=0;i<this.headcolumn.length;i++){
            projIds.push(this.headcolumn[i].projectId);
          }

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
          var paramsp={
            statisType:statisType,
            startTime:startTime,
            queryType:'station',
            endTime:endTime,
            projectIds:projIds.toString(),
            areaIds:equipIds.toString()
          }
          this.$http.get('/waterenvapi/station/totalProjectOverCompare',{
            params:paramsp
          }).then((response)=> {
            let dataJson = response.data;
            var list = dataJson.content.info.yAxis;
            if(list.length>1){
              let chart = {
                obj:'myChartNumber',
                id:'super-standard-contrast',
                legend:[{name: list[0].name,icon:'rect'},{name: list[1].name,icon:'rect'}],
                xAxisDate:dataJson.content.info.xAxis,
                seriesDataA:list[0].list,
                seriesDataB:list[1].list,
              };
              this.factorComparisonBar(chart);
            }
            if(list.length === 0){
              this.exceedNoDataState = true;
            }else{
              this.exceedNoDataState = false;
            }
            this.tableDataB=dataJson.content.dataList;
            if(dataJson.content.dataList.length === 0){
              this.factorsNoDataState = true;
            }else{
              this.factorsNoDataState = false;
            }
            this.exceedLoading = false;
            this.factorsLoading = false;
          }).catch((error)=> {
            this.exceedLoading = false;
            this.factorsLoading = false;
            this.exceedNoDataState = true;
            this.factorsNoDataState = true;
          });
        }
      },
      mounted(){


        let _this = this;
        var date=new Date();
        let time = new Date(date.getTime()-86400*1000);//工具栏时间
        let yearOnYear = new Date(date.getTime()-86400*1000);//同比时间
        let analogical = new Date(date.getTime()-86400*1000);//类比时间
        this.dataValue = time.format('yyyy-MM-dd');//设置工具栏当前时间
        yearOnYear.setFullYear(yearOnYear.getFullYear()-1);
        analogical.setMonth(analogical.getMonth()-1);
        this.yearOnYearDate = yearOnYear.format('yyyy-MM-dd');//设置同比时间
        this.analogicalTime = analogical.format('yyyy-MM-dd');//设置类比时间
        window.addEventListener("resize",function(){
          _this.myChartWater.resize();
          _this.myChartBar.resize();
          _this.myChartContrast.resize();
          _this.myChartNumber.resize();
        });
        this.initTime();
        this.checksiteinit();
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
    position: relative;
    height: 100%;
    width: calc(50% - 4px);
    border: 1px solid #c6d1de;
    float: left;
  }
  #water-quality-pei,
  #water-quality-bar{
    height: 100%;
  }
  .water-quality-ratio:first-child{
    margin-right: 8px;
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
.secondary-mode-row{
  min-height: 180px;
  position: relative;
}
</style>
