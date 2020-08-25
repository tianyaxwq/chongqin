<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
          <span>站点类型 : </span>
          <div class="layoutBox" style="width:220px">
             <el-select v-model="areaId" collapse-tags placeholder="请选择内容">
               <el-option
                 v-for="item in provinceData"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
               ></el-option>
             </el-select>
          </div>&emsp;&emsp;
          <!-- <yf-dropdowntree  :treeData='treedata' :treeConfig='treeConfig' ></yf-dropdowntree> -->
           <!-- <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入站点名称" v-model="stationnameModel"></el-input>
          </div>&emsp;&emsp; -->
           <el-button @click="init"><i class="iconfont icon-sousuo"></i>查询</el-button>
           <!-- <el-button @click="addStation"><i class="iconfont icon-tianjia1"></i>新增</el-button>
           <el-button type="delet" @click="allstationDelet"><i class="iconfont icon-shanchu"></i>批量删除</el-button> -->
    </div>
    <div class="currency-mode-wrap">
          <el-table border :data="tableData" height="100%" v-loading="loading"
               element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)" @selection-change="tableChange">
                  <!-- <el-table-column
                      type="selection"
                      width="50">
                  </el-table-column> -->
                  <el-table-column
                      type="index"
                      label="序号"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      prop="stationName"
                      label="测站名字">
                      
                  </el-table-column>
                    <el-table-column
                      prop="areaName"
                      label="行政区划">
                      
                  </el-table-column>
                    <el-table-column
                      prop="longitude"
                      label="经度">
                      
                  </el-table-column>
                    <el-table-column
                      prop="latitude"
                      label="纬度">
                      
                  </el-table-column>
                  <!-- <el-table-column
                      prop="STATION_NAME"
                      label="站点名称">
                       <template  slot-scope="scope">
                         <div>
                            <span @click="stationDetail(scope.row.STATION_MN)">{{scope.row.STATION_NAME}}</span>
                         </div>
                       </template>
                  </el-table-column>
                  <el-table-column
                      prop="STATION_MN"
                      label="站点编号">
                  </el-table-column>
                  <el-table-column
                      prop="AERA"
                      label="所属区域">
                      
                  </el-table-column>
                  <el-table-column
                      prop="RIVER"
                      label="所属河流">
                  </el-table-column>
                   <el-table-column
                      prop="WATER_TYPE"
                      label="地表水类型">
                  </el-table-column>
                   <el-table-column
                      prop="STATION_SORT"
                      label="排序">
                  </el-table-column>
                   <el-table-column
                      prop="STATION_ENABLED"
                      label="是否验收">
                      <template slot-scope="scope">
                              <div> 
                                  <i style="color:#36C25E;font-size:20px;" class="iconfont icon-chenggongzhuangtai" v-if="scope.row.STATION_ENABLED == 1"></i>
                                  <i style="color:#FF3333;font-size:20px;" class="iconfont icon-meiyouchenggongdezhuangtai" v-if="scope.row.STATION_ENABLED == 0"></i>
                              </div>
                      </template>
                  </el-table-column>
                   <el-table-column
                      prop="STATION_ARMLEVEL"
                      label="目标水质等级">
                      <template slot-scope="scope">
                        <div class="waterLev">
                            <p><i :class="scope.row.STATION_ARMLEVEL == 'III类'?'classtwo':scope.row.STATION_ARMLEVEL == 'IV类'?'classthree':scope.row.STATION_ARMLEVEL == 'V类'?'classfour':scope.row.STATION_ARMLEVEL == '劣V类'?'classfive':scope.row.STATION_ARMLEVEL == 'I类'?'classone':scope.row.STATION_ARMLEVEL == 'II类'?'classone':''"></i>{{scope.row.STATION_ARMLEVEL}}</p>
                        </div>
                      </template>
                  </el-table-column>
                   <el-table-column
                      label="操作"
                      width="200">
                       <template slot-scope="scope">
                         <div>
                               <el-button type="secondBtn" @click="editorStation(scope.row)">编辑</el-button>
                               <el-button type="secondBtn" @click="stationDelet(scope.row.STATIONID)">删除</el-button>
                         </div>
                       </template>
                  </el-table-column> -->
          </el-table>
          <!-- <div class="paginationBox">
            <el-pagination
              @size-change="paginationSizeChange"
              @current-change="paginationChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              background
              :small = "true"
              popper-class = "select-common-option"
              :page-sizes = "pageList"
              layout="total,sizes,slot,->,prev, pager, next, jumper"
              :total="total">
              <span class="el-pagination__current">当前第{{currentPage}}/{{totalPageNumber}}页</span>
            </el-pagination>
          </div> -->
    </div>
     <el-dialog :visible.sync="visiDialog"  width="930px" title="站点详情">
       <div class="dialogcontent second_tab_layout">
              <yf-tabs type="border-card" style="height:100%">
                  <yf-tab-pane label="站点信息">
                      <div class="tablebox">
                           <table class="whTable">  
                                <tr>
                                    <td width="11%">站点名称</td>
                                    <td width="20%">{{stationFormData.stationName}}</td>
                                    <td width="11%">站点编号</td>
                                    <td width="20%">{{stationFormData.stationCode}}</td>
                                    <td width="11%">密码</td>
                                    <td width="20%">{{stationFormData.stationPassworld}}</td>
                                </tr>
                                 <tr>
                                    <td width="11%">所属省份</td>
                                    <td width="20%">{{stationFormData.provinceId}}</td>
                                    <td width="11%">所属城市</td>
                                    <td width="20%">{{stationFormData.areaId}}</td>
                                    <td width="11%">当地管理单位</td>
                                    <td width="20%">{{stationFormData.localManagementUnits}}</td>
                                </tr>
                                 <tr>
                                    <td width="11%">所属流域</td>
                                    <td width="20%">{{stationFormData.basinId}}</td>
                                    <td width="11%">所属河流</td>
                                    <td width="20%">{{stationFormData.stationRiver}}</td>
                                    <td width="11%">站点分类</td>
                                    <td width="20%">{{stationFormData.stationType}}</td>
                                </tr>
                                 <tr>
                                    <td width="11%">地表水类别</td>
                                    <td width="20%">{{stationFormData.surfaceWaterTypes}}</td>
                                    <td width="11%">水质目标级别</td>
                                    <td width="20%">{{stationFormData.targetLevel}}</td>
                                    <td width="11%">站点类型</td>
                                    <td width="20%">{{stationFormData.stationClassify}}</td>
                                </tr>
                                 <tr>
                                    <td width="11%">经度-纬度</td>
                                    <td width="20%">{{stationFormData.longitude}}-{{stationFormData.latitude}}</td>
                                    <td width="11%">排序</td>
                                    <td width="20%">{{stationFormData.sort}}</td>
                                    <td width="11%">上下游省份</td>
                                    <td width="20%">{{stationFormData.stationProvincesUpDown}}</td>
                                </tr>
                                 <tr>
                                    <td width="11%">是否验收</td>
                                    <td width="20%">{{stationFormData.enabled}}</td>
                                    <td width="11%">验收时间</td>
                                    <td width="20%">{{stationFormData.enabledTime}}</td>
                                    <td width="11%">考核城市</td>
                                    <td width="20%">{{stationFormData.city}}</td>
                                </tr>
                                 <tr>
                                    <td width="11%">站点属性</td>
                                    <td width="20%">{{stationFormData.stationProperty}}</td>
                                    <td width="11%">站点功能</td>
                                    <td width="20%">{{stationFormData.stationFunction}}</td>
                                    <td width="11%">运营单位</td>
                                    <td width="20%">{{stationFormData.operCompanyCode}}</td>
                                </tr>
                                <tr>
                                   <td width="11%">站点地址</td>
                                   <td colspan="5">{{stationFormData.stationAddress}}</td>
                                </tr>
                                <tr>
                                   <td width="11%">站点简介</td>
                                   <td colspan="5">
                                      <div style="height:100px">{{stationFormData.stationBriefInfo}}</div>
                                   </td>
                                </tr>
                                <tr>
                                   <td width="11%">历史文化介绍: 
                                    (周边环境)</td>
                                   <td colspan="5">
                                       <div style="height:100px">{{stationFormData.peripheralHistory}}</div>
                                   </td>
                                </tr>
                           </table>
                      </div>
                  </yf-tab-pane>
                  <yf-tab-pane label="仪器参数">
                      <div>
                        <el-table
                          tooltip-effect="light"
                          :data="paramsTableData"
                          border
                          style="width: 100%;" 
                          height="467px"
                          element-loading-text="加载中"
                          element-loading-spinner="loading-type-a"
                          element-loading-background="rgba(255, 255, 255, 1)"
                           >
                         
                          <el-table-column
                            type="index"
                            :index="indexMethod"
                            width="50">
                          </el-table-column>
                          <el-table-column
                            prop="PROJECT_NAME"
                            show-overflow-tooltip
                            label="监测项目">              
                          </el-table-column>
                           <el-table-column
                            prop="EQUIPMENT_NAME"
                            show-overflow-tooltip
                            label="分析仪器">              
                          </el-table-column>
                           <el-table-column
                            prop="MANUFACTOR"
                            show-overflow-tooltip
                            label="仪器厂家">              
                          </el-table-column>
                           <el-table-column
                            prop="ANALY_METHONS"
                            show-overflow-tooltip
                            label="分析方法">              
                          </el-table-column>
                           <el-table-column
                            prop="REAGENT"
                            show-overflow-tooltip
                            label="试剂">              
                          </el-table-column>
                           <el-table-column
                            prop="DETECTION_LIMIT"
                            show-overflow-tooltip
                            width="66"
                            label="检出限">              
                          </el-table-column>
                           <el-table-column
                            prop="UPPER_LIMIT"
                            show-overflow-tooltip
                             width="134"
                            label="标准上限">              
                          </el-table-column>
                          <el-table-column
                            prop="LOWER_LIMIT"
                            show-overflow-tooltip
                             width="134"
                            label="标准下限">              
                          </el-table-column>
                           <el-table-column
                            prop="PROJECT_UNIT"
                            show-overflow-tooltip
                             width="79"
                            label="单位">              
                          </el-table-column>
                           <el-table-column
                            prop="MANUFACTURE_CODE"
                            show-overflow-tooltip
                             width="120"
                            label="出厂编号">              
                          </el-table-column>
                           <el-table-column
                            prop="CREATE_TIME"
                            show-overflow-tooltip
                             width="180"
                            label="安装时间">   
                             <template slot-scope="scope">
                               <div>
                                  {{new Date(scope.row.CREATE_TIME).format('yyyy-MM-dd hh:mm:ss')}}
                               </div>
                             </template>           
                          </el-table-column>
                           <el-table-column
                            prop="ISENABLE"
                            show-overflow-tooltip
                             width="75"
                            label="是否启用">   
                              <template slot-scope="scope">
                                <div> 
                                    <i style="color:#36C25E;font-size:20px;" class="iconfont icon-chenggongzhuangtai" v-if="scope.row.ISENABLE == '是'"></i>
                                    <i style="color:#FF3333;font-size:20px;" class="iconfont icon-meiyouchenggongdezhuangtai" v-if="scope.row.ISENABLE == '否'"></i>
                                </div>
                              </template>           
                          </el-table-column>                          
                        </el-table>
                      </div>
                  </yf-tab-pane>
                  <yf-tab-pane label="站点图片">
                      <div style="height:467px">
                            <ul>
                              <li>
                                <p>八方位-外景图片</p>
                              </li>
                              <li>
                                <p>八方位-内景图片</p>
                              </li>
                              <li>
                                <p>八方位-建设图片</p>
                              </li>
                            </ul>
                      </div>
                  </yf-tab-pane>
              </yf-tabs>
       </div>
      
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      treeConfig: {
        showCheckbox: false,
        defaultId: 6
      },
      treedata: [],
      stationnameModel: "",
      areaId: "WQ08",
      paramsTableData: [],
      value: "",
      tableData: [],
      typeSelect: "",
      optionData: [],
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      total: 0, //总条数
      pageList: [10, 20, 30], //设置每页多少条
      visiDialog: false,
      loading: true,
      stationIds: "",
      stationFormData: {
        stationName: "", // 站点名称
        stationCode: "", // 站点编码
        stationPassworld: "", //密码
        provinceId: "", //所属省份
        areaId: "", //所属城市
        localManagementUnits: "", //当地管理单位
        basinId: "", //所属流域
        stationRiver: "", //所属河流
        stationType: "", //站点分类
        surfaceWaterTypes: "", //地表水类型
        targetLevel: "", //水质目标级别
        stationClassify: "", //站点类别
        longitude: "", // 经度
        latitude: "", // 纬度
        sort: "", //排序
        stationProvincesUpDown: "", //上下游省份
        enabled: "", //是否验收1是0否
        enabledTime: "", //验收时间
        city: "", //考核城市
        stationProperty: "", //站点属性
        stationFunction: "", //站点功能
        operCompanyCode: "", //运维单位
        stationAddress: "", //站点地址
        stationBriefInfo: "", //站点简介
        peripheralHistory: "" //周边历史文化
      },
      provinceData: [{value:'WQ00',label:'地表水水质站'},
      {value:'WQ01',label:'地下水水质站'},
      {value:'WQ02',label:'大气降水水质站'},
      {value:'WQ03',label:'国控站'},
      {value:'WQ04',label:'省控站'},
      {value:'WQ05',label:'预警站'},
      {value:'WQ06',label:'农村水质监测'},
      {value:'WQ07',label:'排污口'},
      {value:'WQ08',label:'加密监测'},
      {value:'WQ09',label:'溯源站'},
      {value:'WQ10',label:'固定站'},
      {value:'WQ11',label:'浮船站'},
       {value:'WQ12',label:'农村水质监测（万人千吨）'},]
    };
  },
  inject: ["globelDelet"],
  created() {
    //获取省份下拉框数据
    // this.$http.get("/SiteManagement/area/provinceInfo").then(res => {
    //   if (res.data.code == 0) {
    //     this.provinceData = res.data.content.dataList;
    //   }
    // });
    this.init();
  },
  mounted() {},
  methods: {
    //查看站点详情
    stationDetail(mn) {
      this.visiDialog = true;
      this.$http
        .get("/SiteManagement/station/stationInfoByMn", {
          params: {
            mn: mn
          }
        })
        .then(res => {
          let obj = res.data.content.info;
          this.stationFormData.stationName = obj.stationName;
          this.stationFormData.stationCode = obj.stationMn;
          this.stationFormData.stationPassworld = obj.stationPassworld;
          if (obj.provinceId) {
            this.stationFormData.provinceId = obj.provinceId.areaName;
          }
          if (obj.area) {
            this.stationFormData.areaId = obj.area.areaName;
          }
          this.stationFormData.localManagementUnits = obj.localMangermnetUnits;
          if (obj.basinn) {
            this.stationFormData.basinId = obj.basinn.basinnName;
          }
          this.stationFormData.stationRiver = obj.stationRiver;
          if (obj.stationtype) {
            this.stationFormData.stationType = obj.stationtype.stationTypeName;
          }
          this.stationFormData.surfaceWaterTypes = obj.suifaceWaterTypes;
          this.stationFormData.targetLevel = obj.targerWaterQuality;
          if (obj.stationClassify) {
            this.stationFormData.stationClassify =
              obj.stationClassify.stationClassifyName;
          }
          this.stationFormData.longitude = obj.longitude;
          this.stationFormData.latitude = obj.latitude;
          this.stationFormData.sort = obj.sort;
          this.stationFormData.stationProvincesUpDown = obj.stationProvincesUpDown;
          if (obj.enabled == 1) {
            this.stationFormData.enabled = "是";
          } else {
            this.stationFormData.enabled = "否";
          }
          this.stationFormData.enabledTime = obj.enableTime;
          if (obj.cityId) {
            this.stationFormData.city = obj.cityId.areaName;
          }
          this.stationFormData.stationProperty = obj.stationProperty;
          this.stationFormData.stationFunction = obj.stationFunction;
          this.stationFormData.operCompanyCode = obj.operCompanyName;
          this.stationFormData.stationAddress = obj.stationAddress;
          this.stationFormData.stationBriefInfo = obj.stationBriefInfo;
          this.stationFormData.peripheralHistory = obj.peripheralHistory;
          this.$http
            .get("/SiteManagement/equipment/queryInstrumentParameters", {
              params: {
                stationCodes: obj.stationMn,
                pageNumber: this.currentPage,
                pageSize: this.pageSize
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.paramsTableData = res.data.content.dataList;
                this.total = res.data.content.totalRecords;
              }
            });
        });
    },
    //站点删除
    stationDelet(id) {
      this.globelDelet("/SiteManagement/station/delete", id, this.init);
    },
    //站点批量删除
    allstationDelet() {
      this.globelDelet(
        "/SiteManagement/station/delete",
        this.stationIds,
        this.init
      );
    },
    tableChange(val) {
      this.stationIds = "";
      let arr = val;
      for (let i in arr) {
        this.stationIds += arr[i].STATIONID + ",";
      }
      this.stationIds = this.stationIds.substring(
        0,
        this.stationIds.length - 1
      );
    },

    paginationSizeChange(v) {
      this.pageSize = v;
      this.init();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.init();
    },
    //站点新增
    addStation() {
      this.$router.push({
        path: "/systemManage/mesManage/stationManage",
        query: { code: 0 }
      });
    },
    //站点编辑
    editorStation(obj) {
      this.$http
        .get("/SiteManagement/station/stationInfoByMn", {
          params: {
            mn: obj.STATION_MN
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            let stationObj = res.data.content.info;
            this.$store.commit("setStationMessage", stationObj);
            this.$router.push({
              path: "/systemManage/mesManage/stationManage",
              query: { code: 1 }
            });
          }
        });
    },
    //获取页面初始数据
    init() {
      this.loading = true;

      this.$http
        .get("/dataHandle/yunliBase/getXhWaterData", {
          params: {
            types: this.areaId,
            // stationName: this.stationnameModel,
            // pageSize: this.pageSize,
            // pageNumber: this.currentPage,
            //  userId: this.toolObj.getCookie("userId")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.total = res.data.content.totalRecords;
            this.loading = false;
          }
        });
    }
  },
  computed: {
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
}
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}
.waterLev {
  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
  .classone {
    background: url("../../assets/images/index/Water_quality_category_01.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .classtwo {
    background: url("../../assets/images/index/Water_quality_category_02.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .classthree {
    background: url("../../assets/images/index/Water_quality_category_03.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .classfour {
    background: url("../../assets/images/index/Water_quality_category_04.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
  .classfive {
    background: url("../../assets/images/index/Water_quality_category_05.png")
      no-repeat center center;
    background-size: 100% 100%;
  }
}
.dialogcontent .whTable tr {
  td {
    padding: 6px !important;

    &:nth-child(odd) {
      text-align: right;
    }
    &:nth-child(even) {
      text-align: left;
      padding-left: 12px !important;
    }
  }
}
</style>
