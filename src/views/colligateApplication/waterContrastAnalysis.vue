<template>
    <!-- 水质现状分析(河流/区域) -->
    <div class="water-contrast-analysis">
      <el-scrollbar style="height:100%">
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
          <div class="secondary-mode-content" v-show="openPage ==='area' || openPage ==='basinn'">
            <div class="secondary-mode-row">
              <h4 class="secondary-mode-title">
                <i class="sl-icon block-icon"></i>
                <span>水质详情</span>
              </h4>
              <div class="water-quality-details" >
                <div class="water-quality-ratio" v-loading="loadingOne"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
                   <yf-Datastatus :dataStatus="dataStatusOne" v-show="dataStatusOne == 'no'"></yf-Datastatus>
                  <div id="water-quality-pei"></div>
                </div>
                <div class="water-quality-ratio" v-loading="loadingTwo"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
                   <yf-Datastatus :dataStatus="dataStatusTwo" v-show="dataStatusTwo == 'no'"></yf-Datastatus>
                  <div id="water-quality-bar" style="height:340px"></div>
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
              <div class="secondary-mode-row" v-loading="loadingThree"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
               
                <div id="water-quality-comparison"></div>
                 <yf-Datastatus :dataStatus="dataStatusThree" v-show="dataStatusThree == 'no'"></yf-Datastatus>
              </div>
            </div>
            <div class="secondary-mode-row">
              <div class="contrast-table-wrap">
                
                <h4 class="contrast-title">各因子监测值对比详情</h4>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  v-loading="loadingFour"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
                  <el-table-column
                    prop="time"
                    label="年限"
                    width="120">
                  </el-table-column >
                  <el-table-column :key="index" v-for="(item,index) in headcolumn"
                                   :prop="item.code"
                                   :label="item.name">
                    
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="secondary-mode-row">
              <h4 class="secondary-mode-title">
                <i class="sl-icon block-icon"></i>
                <span>各因子超标断面个数对比</span>
              </h4>
              <div class="secondary-mode-row" v-loading="loadingFive"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
               
                <div id="super-standard-contrast"></div>
                 <yf-Datastatus :dataStatus="dataStatusFour" v-show="dataStatusFour == 'no'"></yf-Datastatus>
              </div>
            </div>
            <div class="secondary-mode-row">
             
              <h4 class="contrast-title">各因子超标断面个数对比详情</h4>
              <div class="contrast-table-wrap">
                  <el-table
                    :data="tableDataB"
                    border
                    style="width: 100%"
                    v-loading="loadingSex"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
                    <el-table-column
                      prop="time"
                      label="年限"
                      width="120">
                    </el-table-column>
                   <el-table-column :key="index" v-for="(item,index) in headcolumn1"
                                   :prop="item.code"
                                   :label="item.name">
                    
                   </el-table-column>
                  </el-table>
                </div>
            </div>
          </div>
          <div class="secondary-mode-content" v-show="openPage ==='station'">
                <div class="model-layout">
                     <p class="title_p">断面水质详情</p>
                     <div class="layout-content clear">
                          <div class="l_box" v-loading="loadingSeven"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
                                 <h4 class="ratio-title">{{nodes.label}}监测断面水质对比分析</h4>
                                  <div class="ratio-item" v-for="(item,key) in waterLevList" :key="key">
                                    <div>
                                      <span  :class="toWQLClassStringq(item.levelNum)"></span>
                                      <div class="explain-info">
                                        <span >{{item.level}}</span>
                                        <p class="ratio-time">{{item.time}}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- <div class="ratio-item">
                                    <div>
                                      <span  class="quality-icon qualityD"></span>
                                      <div class="explain-info">
                                        <span >1111</span>
                                        <p class="ratio-time">2019-02-02</p>
                                      </div>
                                    </div>
                                  </div> -->
                                  <div class="analysis-text" v-if="waterStatus!=''">
                                    <p>
                                     {{nodes.label}}{{waterLevList[0].time}}为<b>{{waterLevList[0].level}}</b>，{{waterLevList[1].time}}为<b>{{waterLevList[1].level}}</b>，
                                     {{waterStatus}}。
                                    </p>
                                  </div>
                          </div>
                          <div class="r_box" v-loading="loadingEight"  element-loading-text="加载中"
                             element-loading-spinner="loading-type-a"
                             element-loading-background="rgba(255, 255, 255, 1)">
                              <h4 class="contrast-title">{{nodes.label}}监测因子对比详情</h4>
                              <!-- 表格 -->
                              <div class="normal-table-wrap" style="height: calc(100% - 81px);">
                                <el-table
                                    :data="tableDataFactor"
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
                                      prop="currentValue"
                                      :label="headmark1">
                                    </el-table-column>
                                    <el-table-column
                                      prop="currentlevel"
                                      :label="headmark2">
                                        <template slot-scope="scope">
                                          <i class="sl-icon" :class="setWaterGradeCls(scope.row.currentlevel)"></i>
                                          <span>{{scope.row.currentlevel}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                      prop="compareValue"
                                      :label="headmark3">
                                    </el-table-column>
                                    <el-table-column
                                      prop="comparelevel"
                                      :label="headmark4">
                                        <template slot-scope="scope">
                                          <i class="sl-icon" :class="setWaterGradeCls(scope.row.comparelevel)"></i>
                                          <span>{{scope.row.comparelevel}}</span>
                                        </template>
                                     </el-table-column>
                                    <el-table-column
                                      prop="trend"
                                      label="变化趋势">
                                        <template slot-scope="scope">
                                          <i class="iconfont icon-xia" :class="setTrendChangeCls(scope.row.trend)"></i>
                                          <span>{{ scope.row.trend }}</span>
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
                <div class="model-layout">
                     <p class="title_p"></p>
                        <yf-tabs type="border-card" style="height:300px">
                              <yf-tab-pane label="浓度">

                                    <div style="padding:10px">
                                          <el-table
                                            :data="counData"
                                            border
                                            height="230px"
                                            style="width: 100%">
                                            <el-table-column
                                              type="index"
                                              label="序号"
                                              width="50">
                                            </el-table-column>
                                            <el-table-column
                                              prop="time"
                                              label="时间"
                                              width="150">
                                            </el-table-column>
                                            <el-table-column :key="index" v-for="item,index in headcolumnC"
                                              :prop="item.code"
                                              :label="item.name" width="140">
                                              
                                              
                                            </el-table-column>
                                          </el-table>
                                    </div>
                              </yf-tab-pane>
                               <yf-tab-pane label="水质">
                               
                                    <div style="padding:10px">
                                          <el-table
                                            :data="waterData"
                                            border
                                            height="230px"
                                            
                                            style="width: 100%">
                                            <el-table-column
                                              type="index"
                                              label="序号"
                                              width="50">
                                            </el-table-column>
                                             <el-table-column
                                              prop="time"
                                              label="时间"
                                              width="150">
                                            </el-table-column>
                                            <el-table-column :key="index" v-for="item,index in headcolumnC"
                                              :prop="item.code"
                                              :label="item.name"  width="140">
                                             
                                              
                                            </el-table-column>
                                          </el-table>
                                    </div>
                              </yf-tab-pane>
                        </yf-tabs>
                </div>
          </div>
        </div>
      </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { formatDate } from "../../assets/js/dateformat.js";
let pickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};
let dataTypeList = [
  {
    name: "日",
    type: "day"
  },
  {
    name: "月",
    type: "month"
  },
  {
    name: "年",
    type: "year"
  }
];
let siteTypeTab = [
  {
    name: "全部",
    type: "all"
  },
  {
    name: "同区域",
    type: "area"
  },
  {
    name: "同河流",
    type: "river"
  }
];
export default {
  name: "waterContrastAnalysisA",

  data() {
    return {
      dataValue: "", //工具栏时间段绑定数据
      yearOnYearDate: "", //同比日期
      alaresult: "",
      analogicalTime: "", //类比日期
      contrastSite: "奉贤区-浦南运河",
      pickerOptions, //时间框快捷带单数据
      dataType: 0, //时间段按钮组选中下标
      dataTypeList, //时间段按钮组按钮数据
      timeTypeName: "date", //时间框类型
      radioValue: "1", //同比、类比、环比单选绑定数据
      siteTypeTab, //环比站点tab头部数据
      siteTypeTabIndex: 0, //环比站点tab头部选中下标
      detailsSiteList: [], //环比站点tab内容数据
      tableData: [], //对比详情表格数据
      tableDataB: [], //个数对比详情表格数据
      myChartWater: "", //饼图charts
      myChartBar: "", //比例详情charts
      myChartContrast: "", //各因子水质对比charts
      myChartNumber: "", //各因子超标断面个数对比charts.
      headcolumn1: [],
      headcolumn2: [],
      headtitle: "",

      openPage: "",
      nodes: {},
      loadingOne: true,
      loadingTwo: true,
      loadingThree: true,
      loadingFour: true,
      loadingFive: true,
      loadingSex: true,
      loadingSeven: true,
      loadingEight: true,
      dataStatusOne: "",
      dataStatusTwo: "",
      dataStatusThree: "",
      dataStatusFour: "",
      headmark1:'',
      headmark2:'',
      headmark3:'',
      headmark4:'',
      tableDataFactor:[],
      currentPage:1,//分页组件当前页
      total: 0,//分页总条数
      pageSize: 10,//分页每页多少条数据
      pageList:[10,15,20],//设置每页多少条
      currentPage1:1,//分页组件当前页
      total1: 0,//分页总条数
      pageSize1: 10,//分页每页多少条数据
      currentPage2:1,//分页组件当前页
      total2: 0,//分页总条数
      pageSize2: 10,//分页每页多少条数据
      waterLevList:[{
        time:'',
        level:'',
        levelNum:''
      },{
        time:'',
        level:'',
        levelNum:''
      }],
      waterStatus:'',
      headcolumnC:[],
      counData:[],
      waterData:[],
    };
  },
  methods: {
    dataTypeToggle(index, item) {
      this.dataType = index;
      let yearOnYear = new Date(this.dataValue);
      yearOnYear.setFullYear(yearOnYear.getFullYear() - 1);
      if (item.type === "day") {
        this.timeTypeName = "date";
        this.yearOnYearDate = yearOnYear.format("yyyy-MM-dd");
      } else if (item.type === "month") {
        this.timeTypeName = "month";
        this.yearOnYearDate = yearOnYear.format("yyyy-MM");
      } else if (item.type === "year") {
        this.timeTypeName = "year";
        this.yearOnYearDate = yearOnYear.format("yyyy");
      }
    },

    searchData() {
      if (this.openPage == "station") {
        this.stationAnalysis();
        this.stationFactorInfo();
        this.getConcenData()
      } else {
        this.waterQualityProportionChart();
        this.waterQualityBar();
        this.waterQualityComparison();
        this.superStandardContrast();
        this.searchprojectComparedata();
        this.searchprojectComparedataTwo();
      }
    },
    initTime() {
      var date = new Date();
      this.dataValue = new Date(date.getTime() - 86400 * 1000);
    },

    //各因子监测值对比详情
    searchprojectComparedata() {
      this.loadingFour = true;
      let timeObj = this.getTimeParams();
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
        userId:this.toolObj.getCookie('userId')
      };
      this.$http
        .get(
          "/Statistics-Service/comparisonQuality/moreProjectDetailsReports",
          {
            params: paramsp
          }
        )
        .then(response => {
          this.loadingFour = false;
          if (response.data.content == null) {
            this.tableData = [];
            return false;
          }
          let dataJson = response.data;

          this.tableData = dataJson.content.dataList;
          this.headcolumn = dataJson.content.info;
        })
        .catch(error => {
          this.loadingFour = false;
        });
    },
    //各因子超标断面个数对比详情
    searchprojectComparedataTwo() {
      this.loadingSex = true;
      let timeObj = this.getTimeParams();
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
         userId:this.toolObj.getCookie('userId')
      };
      this.$http
        .get("/Statistics-Service/comparisonQuality/projectOverNumberReports", {
          params: paramsp
        })
        .then(response => {
          this.loadingSex = false;
          if (response.data.content == null) {
            this.tableDataB = [];
            return false;
          }
          let dataJson = response.data;

          this.tableDataB = dataJson.content.dataList;
          this.headcolumn1 = dataJson.content.info;
        })
        .catch(error => {
          this.loadingSex = false;
        });
    },
    dateChangeValue(val) {
      //时间选择值改变时执行
      let selectDate = val.format("yyyy,MM,dd");
      let yearOnYear = new Date(selectDate);
      let analogical = new Date(selectDate);
      yearOnYear.setFullYear(yearOnYear.getFullYear() - 1);
      if (this.dataType === 0) {
        this.yearOnYearDate = yearOnYear.format("yyyy-MM-dd");
      } else if (this.dataType === 1) {
        this.yearOnYearDate = yearOnYear.format("yyyy-MM");
      } else if (this.dataType === 2) {
        this.yearOnYearDate = yearOnYear.format("yyyy");
      }

      analogical.setMonth(analogical.getMonth() - 1);
      this.analogicalTime = analogical.format("yyyy-MM-dd");
    },
    getTimeParams() {
      let startTime = "";
      let endTime = "";
      let timeChange = "";
      let timeObj = {};
      let statisType = dataTypeList[this.dataType].type;
      if (this.radioValue == "1") {
        timeChange = this.yearOnYearDate;
      } else {
        timeChange = this.analogicalTime;
      }
      if (statisType == "day") {
        startTime = formatDate(new Date(this.dataValue), "yyyy-MM-dd");
        endTime = formatDate(new Date(timeChange), "yyyy-MM-dd");
      } else if (statisType == "month") {
        startTime = formatDate(new Date(this.dataValue), "yyyy-MM");
        endTime = formatDate(new Date(timeChange), "yyyy-MM");
      } else {
        startTime = formatDate(new Date(this.dataValue), "yyyy");
        endTime = formatDate(new Date(timeChange), "yyyy");
      }
      timeObj = {
        startTime: startTime,
        endTime: endTime,
        statisType: statisType
      };
      return timeObj;
    },
    //水质比例图表
    waterQualityProportionChart() {
      this.loadingOne = true;
      this.$nextTick(() => {
        this.myChartWater = this.$echarts.init(
          document.getElementById("water-quality-pei")
        );
        this.myChartWater.clear();
      });

      var charttext = "";
      var charttextend = "";
      let timeObj = this.getTimeParams();
      this.headtitle =
        this.nodes.label +
        timeObj.startTime +
        "与" +
        timeObj.endTime +
        "对比分析";
      charttext = timeObj.startTime;
      charttextend = timeObj.endTime;
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
         userId:this.toolObj.getCookie('userId')
      };

      this.$http
        .get("/Statistics-Service/comparisonQuality/moreWaterQualityPie", {
          params: paramsp
        })
        .then(response => {
          this.loadingOne = false;
          if (response.data.content == null) {
            this.dataStatusOne = "no";
            return false;
          } else {
            this.dataStatusOne = "";
          }
          let dataJson = response.data;
          let datab = [];
          let datac = [];
          let list = dataJson.content.info.source;
          this.alaresult = dataJson.content.info.message;
          for (let i in list) {
            if (i > 0) {
              datab.push({ name: list[i][0], value: list[i][1] });
              datac.push({ name: list[i][0], value: list[i][2] });
            }
          }

          let option = {
            color: ["#00a1e4", "#24c768", "#e5ce10", "#ff7e00", "#ff0000"],
            title: [
              {
                text: charttext + "断面水质比例",
                // subtext: "水质状况：轻度污染",
                subtextStyle: {
                  color: "#333",
                  fontSize: 13
                },
                x: "24%",
                y: 10,
                textAlign: "center"
              },
              {
                text: charttextend + "断面水质比例",
                //  subtext: "水质状况：良",
                subtextStyle: {
                  color: "#333",
                  fontSize: 13
                },
                x: "74%",
                y: 10,
                textAlign: "center"
              }
            ],
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              bottom: 10,
              itemGap: 30,
              data: ["I-II类", "III类", "IV类", "V类", "劣V类"]
            },
            series: [
              {
                name: "水质等级",
                type: "pie",
                radius: "60%",
                center: ["26%", "53%"],
                selectedMode: "single",
                label: {
                  normal: {
                    show: false,
                    formatter: "{a|{d}%}\n{b|{b}}",
                    position: "inner",
                    rich: {
                      a: {
                        fontSize: 20,
                        color: "#fff",
                        lineHeight: 34
                      },
                      b: {
                        fontSize: 14,
                        color: "#fff"
                      }
                    }
                  },
                  emphasis: {
                    show: true
                  }
                },
                data: datab
              },
              {
                name: "水质等级",
                type: "pie",
                radius: "60%",
                center: ["74%", "53%"],
                selectedMode: "single",
                label: {
                  normal: {
                    show: false,
                    formatter: "{a|{d}%}\n{b|{b}}",
                    position: "inner",
                    rich: {
                      a: {
                        fontSize: 20,
                        color: "#fff",
                        lineHeight: 34
                      },
                      b: {
                        fontSize: 14,
                        color: "#fff"
                      }
                    }
                  },
                  emphasis: {
                    show: true
                  }
                },
                data: datac
              }
            ]
          };
          this.myChartWater.setOption(option);
        })
        .catch(error => {
          this.loadingOne = false;
          this.dataStatusOne = "no";
        });
    },
    waterQualityBar() {
      this.loadingTwo = true;
      this.$nextTick(() => {
        this.myChartBar = this.$echarts.init(
          document.getElementById("water-quality-bar")
        );
        this.myChartBar.clear();
      });

      var charttext = "";
      var charttextend = "";
      let timeObj = this.getTimeParams();
      charttext = timeObj.startTime;
      charttextend = timeObj.endTime;
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
        userId:this.toolObj.getCookie('userId')
      };
      this.$http
        .get(
          "/Statistics-Service/comparisonQuality/moreWaterQualityBarsUpDown",
          {
            params: paramsp
          }
        )
        .then(response => {
          this.loadingTwo = false;
          if (response.data.content == null) {
            this.dataStatusTwo = "no";
            return false;
          } else {
            this.dataStatusTwo = "";
          }
          let dataJson = response.data.content.info;
          let sArr = dataJson.series;
          let datab = [];
          let datac = [];
          let total = 0;
          let totalc = 0;
          datab = sArr[0]["native"];
          datac = sArr[1]["compare"];
          for (let i in datab) {
            total = total + datab[i];
          }
          for (let i in datac) {
            totalc = totalc + datac[i];
          }
          let option = {
            tooltip: {
              trigger: "item"
            },
            title: {
              text: charttext + "与" + charttextend + "水质比例详情",
              x: "center",
              y: 10
            },
            grid: [
              {
                top: 80,
                left: 60,
                right: 80,
                height: "32%"
              },
              {
                left: 60,
                right: 80,
                top: 189,
                height: "32%"
              }
            ],
            legend: {
              data: [charttext, charttextend],
              orient: "vertical",
              itemGap: 50,
              left: 0,
              y: "42%"
              // itemWidth:0,
              // itemHeight:0
            },
            xAxis: [
              {
                type: "category",
                data: ["Ⅰ~Ⅱ类", "Ⅲ类", "Ⅳ类", "Ⅴ类", "劣Ⅴ类"],
                position: "top",
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                }
              },
              {
                gridIndex: 1,
                type: "category",
                data: ["Ⅰ~Ⅱ类", "Ⅲ类", "Ⅳ类", "Ⅴ类", "劣Ⅴ类"],
                position: "top",
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                position: "right",
                axisTick: {
                  show: false
                },
                axisLabel: {
                  formatter: function(params) {
                    if (params !== 0) {
                      return params;
                    }
                  }
                },
                minInterval: 1,
                axisLine: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    color: "#cee1e9"
                  }
                }
              },
              {
                gridIndex: 1,
                minInterval: 1,
                position: "right",
                type: "value",
                inverse: true,
                axisTick: {
                  show: false
                },
                axisLabel: {
                  // formatter: '{value} %'
                  formatter: function(params) {
                    if (params !== 0) {
                      return params;
                    }
                  }
                },
                axisLine: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    color: "#cee1e9"
                  }
                }
              }
            ],
            series: [
              {
                name: charttext,
                data: datab,
                type: "bar",
                barWidth: 14,
                itemStyle: {
                  normal: {
                    color: "#00a1e4"
                  }
                },
                zlevel: 9
              },
              {
                name: "bg",
                silent: true,
                data: [total, total, total, total, total],
                type: "bar",
                barWidth: 14,
                barGap: "-100%",
                itemStyle: {
                  normal: {
                    color: "#ddebf1"
                  }
                }
              },
              {
                name: charttextend,
                data: datac,
                type: "bar",
                barWidth: 14,
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: "#ff7e00"
                  }
                },
                zlevel: 9
              },
              {
                name: "bg",
                silent: true,
                data: [totalc, totalc, totalc, totalc, totalc],
                type: "bar",
                barWidth: 14,
                xAxisIndex: 1,
                barGap: "-100%",
                yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: "#ddebf1"
                  }
                }
              }
            ]
          };
          this.myChartBar.setOption(option);
        })
        .catch(error => {
          this.loadingTwo = false;
          this.dataStatusTwo = "no";
        });
    }, //水质比例详情图表
    factorComparisonBar(chart) {
      this[chart.obj] = this.$echarts.init(document.getElementById(chart.id));
      this[chart.obj].clear();
      let option = {
        color: ["#00a1e4", "#ff7e00", "#24c768", "#e5ce10", "#ff0000"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: 20,
          right: "4%",
          bottom: 40,
          containLabel: true
        },
        legend: {
          data: chart.legend,
          bottom: 10,
          itemWidth: 10,
          itemHeight: 10
        },
        xAxis: [
          {
            type: "category",
            data: chart.xAxisDate,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#c6d1de"
              }
            },
            axisLabel: {
              color: "#999"
            },
            splitLine: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 7,
            minInterval: 1,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#c6d1de"
              }
            },
            axisLabel: {
              color: "#999"
            },
            splitLine: {
              show: true
            }
          }
        ],
        series: [
          {
            name: chart.legend[0].name,
            type: "bar",
            data: chart.seriesDataA,
            barWidth: 20
          },
          {
            name: chart.legend[1].name,
            type: "bar",
            barWidth: 20,
            data: chart.seriesDataB
          }
        ]
      };
      this[chart.obj].setOption(option);
    },
    //各因子水质对比
    waterQualityComparison() {
      this.loadingThree = true;
      this.$nextTick(() => {
        let chart = this.$echarts.init(
          document.getElementById("water-quality-comparison")
        );
        chart.clear();
      });
      let timeObj = this.getTimeParams();
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
         userId:this.toolObj.getCookie('userId')
      };
      this.$http
        .get("/Statistics-Service/comparisonQuality/moreWaterQualityBars", {
          params: paramsp
        })
        .then(response => {
          this.loadingThree = false;
          if (response.data.content == null) {
            this.dataStatusThree = "no";
            return false;
          } else {
            this.dataStatusThree = "";
          }
          let dataJson = response.data;
          var list = dataJson.content.info.series;

          if (list.length > 1) {
            let chart = {
              obj: "myChartContrast",
              id: "water-quality-comparison",
              legend: [
                { name: list[0].name, icon: "rect" },
                { name: list[1].name, icon: "rect" }
              ],
              xAxisDate: dataJson.content.info.xAxis,
              seriesDataA: list[0].data,
              seriesDataB: list[1].data
            };

            this.factorComparisonBar(chart);
          }
        })
        .catch(error => {
          this.loadingThree = false;
          this.dataStatusThree = "no";
        });
    },
    superStandardContrast() {
      this.loadingFive = true;
      this.$nextTick(() => {
        let chart = this.$echarts.init(
          document.getElementById("super-standard-contrast")
        );
        chart.clear();
      });
      let timeObj = this.getTimeParams();
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
         userId:this.toolObj.getCookie('userId')
      };

      this.$http
        .get("/Statistics-Service/comparisonQuality/projectOverNumberBar", {
          params: paramsp
        })
        .then(response => {
          this.loadingFive = false;
          if (response.data.content == null) {
            this.dataStatusFour = "no";
            return false;
          } else {
            this.dataStatusFour = "";
          }
          let dataJson = response.data;
          var list = dataJson.content.info.series;
          if (list.length > 1) {
            let chart = {
              obj: "myChartNumber",
              id: "super-standard-contrast",
              legend: [
                { name: list[0].name, icon: "rect" },
                { name: list[1].name, icon: "rect" }
              ],
              xAxisDate: dataJson.content.info.xAxis,
              seriesDataA: list[0].data,
              seriesDataB: list[1].data
            };
            this.factorComparisonBar(chart);
          }
        })
        .catch(error => {
          this.loadingFive = false;
          this.dataStatusFour = "no";
        });
    },
    //站点水质对比分析
    stationAnalysis(){
       this.loadingSeven=true;
      let timeObj = this.getTimeParams();
       this.headtitle =
        this.nodes.label +
        timeObj.startTime +
        "与" +
        timeObj.endTime +
        "对比分析";
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
         userId:this.toolObj.getCookie('userId')
      };
      this.$http.get("/Statistics-Service/comparisonQuality/projectSummaryMn",{
        params:paramsp
      }).then(res=>{
          this.loadingSeven=false;
          if(res.data.content == null){
            this.waterLevList=[{
              time:'',
              level:'',
              levelNum:''
            },{
              time:'',
              level:'',
              levelNum:''
            }];
           this.waterStatus='';
           return false;
          }
           this.waterLevList=res.data.content.dataList;
           this.waterStatus=res.data.content.info;
      })
    },
    //站点监测因子对比详情
    stationFactorInfo(){
      this.loadingEight=true;
      let timeObj = this.getTimeParams();
      let statisType=dataTypeList[this.dataType].type;
          if(statisType=='day'){
            this.headmark1=timeObj.startTime+"日浓度";
            this.headmark2=timeObj.startTime+"日水质";
            this.headmark3=timeObj.endTime+"日浓度";
            this.headmark4=timeObj.endTime+"日水质";
          }else if(statisType=='month'){
            this.headmark1=timeObj.startTime+"月浓度";
            this.headmark2=timeObj.startTime+"月水质";
            this.headmark3=timeObj.endTime+"月浓度";
            this.headmark4=timeObj.endTime+"月水质";
          }else{
            this.headmark1=timeObj.startTime+"年浓度";
            this.headmark2=timeObj.startTime+"年水质";
            this.headmark3=timeObj.endTime+"年浓度";
            this.headmark4=timeObj.endTime+"年水质";
          }
     
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
        pageNumber:this.currentPage,
        pageSize:this.pageSize,
         userId:this.toolObj.getCookie('userId')
      };
      this.$http.get("/Statistics-Service/comparisonQuality/projectReportsCompareMn",{
        params:paramsp
      }).then(res=>{
         this.loadingEight=false;
         if(res.data.content == null){
           this.tableDataFactor=[];
           this.total=0;
           return false;
         }
         if(res.data.code == 0){
           this.tableDataFactor=res.data.content.dataList;
           this.total=res.data.content.totalRecords;
         }
      })
    },
    //站点浓度水质表格
    getConcenData(){
      let timeObj = this.getTimeParams();
      let paramsp = {
        timeType: timeObj.statisType,
        nativeTime: timeObj.startTime,
        compareTime: timeObj.endTime,
        queryType: this.openPage,
        queryCode: this.nodes.id,
         userId:this.toolObj.getCookie('userId')
        // pageNumber:this.currentPage,
        // pageSize:this.pageSize,
      };
      this.$http.get("/Statistics-Service/comparisonQuality/moreProjectDetailsReportsMn",{
        params:paramsp
      }).then(res=>{
          if(res.data.content == null){
              this.counData=[];
              this.waterData=[];
               this.headcolumnC=[];
              return false;
          }
         this.headcolumnC=res.data.content.info;
         let list = res.data.content.dataList;
         for(let i in list){
            this.counData.push(list[i]['mmol']);
            this.waterData.push(list[i]['waterQyulaty'])
         }
      })
    },
    paginationChange(val){//分页页码改变时执行
          this.currentPage = val;
          this.stationFactorInfo()
        },
    paginationSizeChange(val){//分页pageSize改变时执行
          this.pageSize = val;
          this.stationFactorInfo()
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
    setWaterGradeCls(data){//设置表格水质class
          let cls = '';
          switch(data){
            case 'I类':
              cls = 'waterGradeA';
              break;
            case 'II类':
              cls = 'waterGradeA';
              break;
            case 'III类':
              cls = 'waterGradeB';
              break;
            case 'IV类':
              cls = 'waterGradeC';
              break;
            case 'V类':
              cls = 'waterGradeD';
              break;
            case '劣V类':
              cls = 'waterGradeE';
              break;
          }
          return cls;
    },
    setTrendChangeCls(data){//设置表格变化趋势class
          let cls = '';
          if(data<0){
            cls = 'decline-icon';
          }else if(data>0){
            cls = 'ascend-icon';
          }
          return cls;
    },
  },
  mounted() {
    let _this = this;
    var date = new Date();
    let time = new Date(date.getTime() - 86400 * 1000); //工具栏时间
    let yearOnYear = new Date(date.getTime() - 86400 * 1000); //同比时间
    let analogical = new Date(date.getTime() - 86400 * 1000); //类比时间
    this.dataValue = time.format("yyyy-MM-dd"); //设置工具栏当前时间
    yearOnYear.setFullYear(yearOnYear.getFullYear() - 1);
    analogical.setMonth(analogical.getMonth() - 1);
    this.yearOnYearDate = yearOnYear.format("yyyy-MM-dd"); //设置同比时间
    this.analogicalTime = analogical.format("yyyy-MM-dd"); //设置类比时间
    // window.addEventListener("resize", function() {
    //   _this.myChartWater.resize();
    //   _this.myChartBar.resize();
    //   _this.myChartContrast.resize();
    //   _this.myChartNumber.resize();
    // });
    this.initTime();
  },
  watch: {
    stationInfo(value) {
      if (value.length > 0) {
        this.nodes = {
          id: value[0].nodeId,
          label: value[0].nodeName
        };
        this.currentPage = 1; //分页组件当前页
        this.pageSize = 10; //分页每页多少条数据
        this.openPage = value[0].nodeType;
       
        this.searchData();
      }
    }
  },

  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.strictlyinfo;
      }
    },
    totalPageNumber(){//计算总页数
          let number = 0;
          number = Math.ceil(this.total/this.pageSize);
          return number;
    }
  }
};
</script>

<style scoped lang="less">
.water-contrast-analysis {
  height: 100%;
}
.statistical-analysis-title {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  text-align: center;
}
/* 同比、类比、环比 部分样式 ['Ⅰ类','Ⅱ类','Ⅲ类','Ⅳ类','Ⅴ类','劣Ⅴ类'] */
.similarities-analogies-rings {
  padding: 8px;
  border: 1px solid #d9e6f7;
  margin-top: 8px;
  margin-bottom: 21px;
  .similarities-row {
    padding: 4px 8px;
    height: 38px;
    line-height: 30px;
    .date-picker-wrap {
      display: inline-block;
      vertical-align: top;
    }
  }
  .explanatory-text {
    color: #999;
    display: inline-block;
    width: 360px;
  }
  .site-type-tab {
    height: 30px;
    border-bottom: 1px solid #166bce;
    padding-left: 8px;
    margin-top: 6px;
    li {
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
    li:last-child {
      border-right: 1px solid #cbcbcb;
    }
    li.active {
      border: 1px solid #166bce;
      border-bottom: none;
      position: relative;
      color: #166bce;
    }
    li.active + li {
      border-left-color: transparent;
    }
    li.active:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      background: #fff;
      left: 0;
      bottom: -1px;
    }
    li:hover {
      color: #166bce;
    }
  }
  .details-site-list {
    padding: 4px 4px 2px;
    position: relative;
    li {
      float: left;
      width: 116px;
      padding: 4px 0;
    }
  }
  .toggle-btn {
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
    i {
      font-size: 12px;
      color: #ffa153;
    }
  }
  .toggle-btn:hover {
    opacity: 1;
  }
}

/* 模块内容 */
.secondary-mode-content {
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
  .model-layout {
    .title_p {
      height: 36px;
      line-height: 36px;
      color: #166bce;
      font-weight: 700;
    }
    .layout-content {
      .l_box {
        float: left;
        width: 254px;
        height: 342px;
        border: 1px solid #d6e3f2;

        padding: 0 10px;
        float: left;
        .ratio-title {
          text-align: center;
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ratio-item {
          display: table;
          width: 100%;
          height: 92px;
        }
        .ratio-item > div {
          display: table-cell;
          text-align: center;
          vertical-align: middle;
          & > .quality-icon {
            display: inline-block;
            vertical-align: middle;
            width: 59px;
            height: 57px;
          }
          .qualityA {
            background: url("../../assets/images/water_quality_01.png")
              no-repeat center center;
          }
          .qualityB {
            background: url("../../assets/images/water_quality_02.png")
              no-repeat center center;
          }
          .qualityC {
            background: url("../../assets/images/water_quality_03.png")
              no-repeat center center;
          }
          .qualityD {
            background: url("../../assets/images/water_quality_04.png")
              no-repeat center center;
          }
          .qualityE {
            background: url("../../assets/images/water_quality_05.png")
              no-repeat center center;
          }
          & > .explain-info {
            display: inline-block;
            vertical-align: middle;
            text-align: left;
            margin-left: 6px;
            .grade-text {
              font-size: 18px;
            }
            .gradeA {
              color: #00a1e4;
            }
            .gradeB {
              color: #24c768;
            }
            .gradeC {
              color: #e5ce10;
            }
            .gradeD {
              color: #ff7e00;
            }
            .gradeE {
              color: #ff0000;
            }
            .ratio-time {
              color: #999999;
            }
          }
        }
        .ratio-item:nth-child(2) {
          border-bottom: 1px dashed #d9e1ec;
        }
        .analysis-text {
          padding: 10px 12px;
          margin: 5px;
          height: 96px;
          background: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          p {
            padding-left: 16px;
            position: relative;
            font-size: 12px;
            line-height: 22px;
            height: 72px;
            overflow: hidden;
            text-overflow:ellipsis;
             
            & > b {
              color: #166bce;
            }
            & > b.deteriorate {
              color: #ff0000;
            }
          }
          p:before {
            content: "";
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
      .r_box {
        float: right;
        height: 342px;
        width: calc(100% - 262px);
        border-top: 1px solid #d6e3f2;
        .contrast-title{
          border-left: 1px solid #d6e3f2;
          border-right: 1px solid #d6e3f2;
        }
      }
    }
  }
}
.sl-icon{
    width: 8px;
    height: 8px;
    display: inline-block;
    vertical-align: 1px;
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
.icon-xia{
  display: inline-block;
  transform: rotate(-90deg);
}
.icon-xia.decline-icon{
  color: #24c768;
  transform: rotate(0deg);
}
.icon-xia.ascend-icon{
  color: #ff0000;
  transform: rotate(-180deg);
}
/* 水质详情部分样式 */
.water-quality-details {
  height: 342px;
  .water-quality-ratio {
    position: relative;
    height: 100%;
    width: calc(50% - 4px);
    border: 1px solid #c6d1de;
    float: left;
  }
  #water-quality-pei,
  #water-quality-bar {
    height: 100%;
  }
  .water-quality-ratio:first-child {
    margin-right: 8px;
  }
}
/* 分析结论部分样式 */
.statistical-analysis-text {
  background: #e7f0f9;
  line-height: 18px;
  padding: 10px 8px;
  border: 1px solid #d5e6f8;
  margin-top: 10px;
  position: relative;
  p {
    text-indent: 2em;
  }
}
.statistical-analysis-text:before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border-top: 2px solid #166bce;
  border-left: 2px solid #166bce;
  top: -2px;
  left: -2px;
}
.statistical-analysis-text:after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border-right: 2px solid #166bce;
  border-bottom: 2px solid #166bce;
  bottom: -2px;
  right: -2px;
}
.contrast-title {
  text-align: center;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}
#water-quality-comparison,
#super-standard-contrast {
  height: 300px;
}
.secondary-mode-row {
  min-height: 180px;
  position: relative;
}
</style>
