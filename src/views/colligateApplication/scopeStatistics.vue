<template>
   <div class="scopePage" style="height:100%">
     <div class="toolbox">
          <span>时间选择 : </span>&nbsp;
          <div class="layoutBox" style="width:242px">
            <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
          </div>&emsp;&emsp;
          <span>所属地区 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="provinceModel"  placeholder="请选择">
                  <el-option
                    v-for="item in provinceData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
          <span>所属流域 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="basinModel"  placeholder="请选择">
                  <el-option
                    v-for="item in basinData"
                    :key="item.basinnId"
                    :label="item.basinnName"
                    :value="item.basinnId">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
          <span>监测项目 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="factorModel" placeholder="请选择"  multiple collapse-tags>
                  <el-option
                    v-for="item in factorData"
                    :key="item.projectCode"
                    :label="item.projectName"
                    :value="item.projectCode">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
         
     </div>
     <div class="toolbox">
        <span>站点名称 : </span>&nbsp;
          <div class="layoutBox" style="width:242px">
             <el-input placeholder="请输入站点名称" v-model="stationName"></el-input>
          </div>&emsp;&emsp;
        <span>站点类别 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="stationTypeModel" placeholder="请选择">
                  <el-option
                    v-for="item in stationTypeData"
                    :key="item.stationTypeId"
                    :label="item.stationTypeName"
                    :value="item.stationTypeId">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
           <span>站点类型 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="stationClassModel"   placeholder="请选择">
                  <el-option
                    v-for="item in stationClassData"
                    :key="item.stationClassifyId"
                    :label="item.stationClassifyName"
                    :value="item.stationClassifyId">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
           <span>运维单位 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="operCompanyModel" placeholder="请选择">
                  <el-option
                    v-for="item in operCompanyData"
                    :key="item.operCompanyId"
                    :label="item.operCompanyName"
                    :value="item.operCompanyId">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
          
           <el-button @click="search"><i class="iconfont icon-sousuo"></i>查询</el-button>
            <el-button type='delet' @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <div class="table report-table-wrap" style="height:calc(100% - 86px)" >
             <el-table ref="table" border :data="tableData" style="height:calc(100% - 35px)"  :span-method="objectSpanMethod" tooltip-effect="light" v-loading="loading"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
                <el-table-column type='index' label='序号' width='45' ></el-table-column>
                <el-table-column  label='区域' prop='areaName' width='120' ></el-table-column>
                <el-table-column  label='水系' width='120'  prop="basinnName"></el-table-column>
                <el-table-column  label='河流名称' width='120'  prop="stationRiver"></el-table-column>
                <el-table-column  label='站点名称' width='175'  prop="stationName"></el-table-column>
                <el-table-column  label='审核内容' width='120' >
                        <template slot-scope="scope">
                          <div>
                                <p class="cellp">{{scope.row.AudioContent}}</p>
                               
                          </div>
                        </template>
                </el-table-column>
                <el-table-column :label='getfactorName(item)' v-for="(item,key) in tableHead" :key="key" show-overflow-tooltip>
                      <el-table-column label='浓度范围' width='120'>
                              <template slot-scope="scope"  show-overflow-tooltip>
                                <div>
                                      <p class="cellp">{{scope.row[item+"monitorSCOPE"]}}</p>
                                </div>
                              </template>
                      </el-table-column>
                      <el-table-column label='均值' width='120' show-overflow-tooltip>
                              <template slot-scope="scope">
                                <div>
                                       <p class="cellp">{{scope.row[item+"monitorAVG"]}}</p>
                                </div>
                              </template>
                      </el-table-column>
                </el-table-column>
                <el-table-column label='综合水质类别'>
                      <el-table-column label='范围' width='120' prop="synLevelSCOPE"  show-overflow-tooltip>
                             
                      </el-table-column>
                      <el-table-column label='均值' width='120' prop="synLevelAVG" show-overflow-tooltip>
                             
                      </el-table-column>
                </el-table-column>
             </el-table>
            
          <div class="paginationBox">
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
          </div>
    </div>
  </div>
</template>

<script>
import {exportTableData} from '../../assets/js/tableExport'
export default {
  name: "",
  data() {
    return {
      dateRange: [],
      value: "",
      optionData: [
        { value: 1, label: "水温" },
        { value: 2, label: "PH" },
        { value: 3, label: "溶解氧" },
        { value: 4, label: "电导率" },
        { value: 5, label: "浊度" },
        { value: 6, label: "高锰酸盐" },
        { value: 7, label: "氨氮" },
        { value: 8, label: "总磷" },
        { value: 9, label: "总氮" },
        { value: 10, label: "叶绿素α" },
        { value: 11, label: "藻密度" }
      ],
      tableData: [],
      tableHead: [],
      provinceData: [], //区域
      provinceModel: "",
      basinData: [], //流域
      basinModel: "",
      factorData: [], //监测项目
      factorModel: [],
      stationTypeData: [], //类别
      stationTypeModel: "",
      stationClassData: [], //类型
      stationClassModel: "",
      operCompanyData: [], //运维单位
      operCompanyModel: "",
      stationName:'',
      loading:true,
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      total: 0, //总条数
      pageList: [10, 20, 30], //设置每页多少条
      fieldList:[],
    };
  },
  created() {
    this.init();
    this.getTableData();
  },
  methods: {
    
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 ) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    //根据因子code查询因子名称
    getfactorName(item) {
      let fName = "";
      for (let i in this.factorData) {
        if (item == this.factorData[i].projectCode) {
          fName = this.factorData[i].projectName;
        }
      }
      return fName;
    },
    //查询
    search() {
       this.getTableData()
    },
    //获取页面搜索各下拉框数据
    init() {
      //获取区域下拉框数据
      this.$http.get("/SiteManagement/area/provinceInfo").then(res => {
        if (res.data.code == 0) {
          this.provinceData = res.data.content.dataList;
        }
      });
      //获取流域下拉框数据

      this.$http.post("/SiteManagement/basinn/query").then(res => {
        if (res.data.code == 0) {
          this.basinData = res.data.content.dataList;
        }
      });
      //获取参数因子数据
     this.$http.get("/basicData/index/getDownLine").then(res => {
        if (res.data.code == 0) {
          this.factorData = res.data.content.dataList;
          for(let i =0;i<this.factorData.length;i++){
            this.factorModel.push(this.factorData[i].projectCode)
          };
          this.getTableData()
        }
      });
      //获取站点分类下拉框数据
      this.$http.post("/SiteManagement/stationType/query").then(res => {
        if (res.data.code == 0) {
          this.stationTypeData = res.data.content.dataList;
        }
      });
      //获取站点类别下拉框数据
      this.$http.post("/SiteManagement/stationClassify/queryAll").then(res => {
        if (res.data.code == 0) {
          this.stationClassData = res.data.content.dataList;
        }
      });
      //获取运维单位下拉框数据
      this.$http.get("/SiteManagement/operCompany/queryAll").then(res => {
        if (res.data.code == 0) {
          this.operCompanyData = res.data.content.dataList;
        }
      });
       //初始化时间
      let startTime = new Date().setDate(new Date().getDate() - 3);
      let endTime = new Date();
      this.dateRange = [
        new Date(startTime).format("yyyy-MM-dd hh:mm:ss"),
        endTime.format("yyyy-MM-dd hh:mm:ss")
      ];
    },
     paginationSizeChange(v){
      this.pageSize=v;
      this.getTableData()
    },
    paginationChange(v){
      this.currentPage=v;
       this.getTableData()
    },
    //获取页面表格数据
    getTableData() {
      this.loading=true;
      this.tableHead=JSON.parse(JSON.stringify(this.factorModel));
      console.log(this.tableHead)
      this.$http
        .get("/Statistics-Service/dataReports/waterQualityReports", {
          params: {
            startTime: this.dateRange[0],
            endTime: this.dateRange[1],
            projectCode: this.factorModel.join(","),
            provinceId:this.provinceModel,
            basinnId:this.basinModel,
            stationClassifyId:this.stationClassModel,
            stationTypeId:this.stationTypeModel,
            operCompanyId:this.operCompanyModel,
            stationName:this.stationName,
            pageNumber:this.currentPage,
            pageSize:this.pageSize,
             userId:this.toolObj.getCookie('userId')
          }
        })
        .then(res => {
           if(res.data.code == 0){
              this.tableData = res.data.content.dataList;
              this.loading=false;
              this.total=res.data.content.totalRecords;
           }
           
        });
    },
     //导出报表
    exportExcel(){
        let {table} = this.$refs;
        let tableBox = table.$el;
        let header = tableBox.querySelector('.el-table__header');
        let title = '水质评价范围统计';
        this.fieldList=["areaName","basinnName","stationRiver","stationName","AudioContent"]
        for(let i =0;i<this.tableHead.length;i++){
         
          this.fieldList.push(this.tableHead[i]+'monitorSCOPE')
          this.fieldList.push(this.tableHead[i]+'monitorAVG')
        };
        this.fieldList.push("synLevelSCOPE")
        this.fieldList.push("synLevelAVG")
        let params = {
          headerProp:this.fieldList.join(','),
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          projectCode: this.factorModel.join(","),
          provinceId:this.provinceModel,
          basinnId:this.basinModel,
          stationClassifyId:this.stationClassModel,
          stationTypeId:this.stationTypeModel,
          operCompanyId:this.operCompanyModel,
          stationName:this.stationName,
         
         
        };
        exportTableData(header,title,'','1',"/Statistics-Service/exports/waterQualityExcel",params);
    }
  },
  computed: {
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  },
};
</script>

<style scope lang="less">
.scopePage {
}
</style>
