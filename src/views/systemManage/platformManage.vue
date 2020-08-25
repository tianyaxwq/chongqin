<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>关键字 :</span>
      <div class="layoutBox" style="width:220px">
        <el-input placeholder="请输入平台名称" v-model="searchModel"></el-input>
      </div>&emsp;&emsp;
      <el-button @click="getList">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="add">
        <i class="iconfont icon-tianjia"></i>新增
      </el-button>
    </div>
    <div class="currency-mode-wrap" >
      <el-table
        border
        :data="tableData"
        height="calc(100% - 30px)"
        @selection-change="selectChange"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="customerName" label="平台名称"></el-table-column>
        <el-table-column prop="lng" label="经度"></el-table-column>
        <el-table-column prop="lat" label="纬度">
           
        </el-table-column>·
        <el-table-column prop="zoom" label="缩放比例">
          
        </el-table-column>
        <el-table-column prop="discrib" label="描述">
              <template slot-scope="scope">
              <div>
                <span v-if="scope.row.discrib && scope.row.discrib !='null'">{{scope.row.discrib}}</span>
                <span v-else>-</span>
              </div>
            </template>
        </el-table-column>
        <el-table-column label="资源配置" width="250">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="setStation(scope.row.id)">站点配置</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
                      prop="logtime"
                      label="最近登录时间">
                  </el-table-column>
                   <el-table-column
                      prop="logtime"
                      label="最近一次操作">
                  </el-table-column>
                   <el-table-column
                      prop="logtime"
                      label="最近登录IP">
        </el-table-column>-->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
              <!-- <el-button type="secondBtn" @click="delet(scope.row.userId)">删除</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination-wrap">
        <el-pagination
          @size-change="paginationSizeChange"
          @current-change="paginationChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          popper-class="select-pagination-option"
          background
          :small="true"
          :page-sizes="pageList"
          layout="total, sizes, slot,->,prev, pager, next, jumper"
          :total="total"
        >
          <template v-slot:default>
            <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
          </template>
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="visiDialog" width="920px" :title="vTitle" :before-close="closess">
      <div class="dialogcontent">
        <el-form :model="formData" :rules="rules" ref="ruleForm">
          <table class="whTable">
            <tr>
              <td width="16.5%">
                <span class="rCode">平台名称</span>
              </td>
              <td>
                <el-form-item prop="customerName">
                  <el-input placeholder="请输入" v-model="formData.customerName"></el-input>
                </el-form-item>
              </td>
              <td width="16.5%">
                <span class="rCode">地图缩放比例</span>
              </td>
              <td>
                <el-form-item prop="zoom">
                  <el-input placeholder="请输入" v-model="formData.zoom"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="16.5%">
                <span class="rCode">经度</span>
              </td>
              <td>
                <el-form-item prop="lng">
                  <el-input placeholder="请输入" v-model="formData.lng"></el-input>
                </el-form-item>
              </td>
              <td width="16.5%">
                <span  class="rCode">纬度</span>
              </td>
              <td>
                <el-form-item prop="lat">
                  <el-input placeholder="请输入" v-model="formData.lat"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="16.5%">
                <span>平台描述</span>
              </td>
              <td colspan="3">
                <div style="margin-bottom:10px">
                  <el-input placeholder="请输入" v-model="formData.discrib" type="textarea" :rows="3"></el-input>
                </div>
              </td>
              
            </tr>
          </table>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="submit('ruleForm')">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="stVisiDialog" width="450px" title="站点配置">
      <div class="dialogcontent tree_content" style="height:300px;padding:0px">
        <el-scrollbar style="height:100%">
          <div style="width:255px;margin-bottom:12px;">
            <el-input placeholder="请输入站点名" suffix-icon="el-icon-search" v-model="stfilterText"></el-input>
          </div>
          <el-tree
            :data="stationData"
            :indent="23"
            node-key="stationId"
            ref="stationTree"
            :default-checked-keys="stdefaultId"
            default-expand-all
            highlight-current
            show-checkbox
            :filter-node-method="stfilterNode"
            :class="stationData.length==1?'noBr':''"
            :props="stdefaultProps"
          >
            <span class="custom-tree-node" slot-scope="{node,data}">
              <span>
                <i class="iconCode" :class="data.stationId == 'quanbu'?'sf':'station'"></i>
                {{ node.label}}
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submitStation">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancelsSub">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      userId:'',
      stVisiDialog: false,
      stationData: [],
      stdefaultId: [],
      stdefaultProps: {
        children: "children",
        label: "nodeName"
      },

      value: "",
      searchModel: "", //搜索框model
      tableData: [],

      visiDialog: false,
      vTitle: "用户新增",
      optionDataRole: [], //角色选择数据
      formData: {
        customerName: "",//平台 名称
        discrib: "",//平台描述
        lat: "",//纬度
        lng: "",//经度
        zoom:''//地图缩放
      },
      rules: {
        customerName: [
          { required: true, message: "请输入平台名称", trigger: "blur" }
        ],
         lng: [
          { required: true, message: "请输入经度", trigger: "blur" }
        ],
         lat: [
          { required: true, message: "请输入纬度", trigger: "blur" }
        ],
         zoom: [
          { required: true, message: "请输入地图缩放比例", trigger: "blur" }
        ],
      },
      isEditor: false, //判断是新增还是修改状态
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      id: "",
      loading: true
    };
  },
  inject: ["globelDelet"],
  created() {
    this.init()
    this.getRole();
    this.getList();
  },
  mounted() {},
  methods: {
     //提交站点数据
    submitStation(){
       let stationArr = this.$refs.stationTree.getCheckedNodes(false,true);
       let pId=[];
       let nId=[];
 
       for(let i in stationArr){
         if(stationArr[i].stationId != 'quanbu' && stationArr[i].structureType=='3'){
             pId.push(stationArr[i].stationId)
           //  nId.push(stationArr[i].nodeId)
         }
       }

       let formData = new FormData();
       formData.append("platformId", this.id);
       formData.append("stationIds",pId.join(','));
     
       this.$http
         .post("/SiteManagement/stationSystem/addPlatformCustomerStations/ids", formData)
         .then(res => {
           if (res.data.code == 0) {
              this.$message({
                message:res.data.message,
                type:'success',
                duration:1500,
              });
               this.stVisiDialog=false
           }
         });
    },
    cancelsSub(){
      this.stVisiDialog=false;
    },
    init() {
      this.$http
        .get("/SiteManagement/station/queryTree", {
          params: {
            keyName: "",
            typeCode: "",
            isUsedString: "",
            isMonitoring: "",
            basinnOrAreaOrCustom: "area",
            groupName: "",
            groupStations: ""
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            let arr = [];
            arr = res.data.content.dataList;
            this.stationData.push({
              nodeName: "全部",
              stationId: "quanbu",
              children: arr
            });
          }
        });
    },
    //站点树过滤
    stfilterNode(value, data) {
      if (!value) return true;
      return data.stationName.indexOf(value) !== -1;
    },
    //设置角色站点数据
    setStation(id) {
      this.id = id;
      this.stfilterText = "";
      this.stVisiDialog = true;
      this.$http
        .get("/SiteManagement/stationSystem/platformStations", {
          params: {
            platformId: id
          }
        })
        .then(res => {
          let arr = res.data.content.dataList;
          this.stdefaultId = [];
          this.$refs.stationTree.setCheckedNodes([]);
         
          for (let i in arr) {
            this.stdefaultId.push(arr[i].stationId);
          }
        });
    },
    selectChange(val, index) {
      let arr = val;
      this.id = "";
      for (let i in arr) {
        this.id += arr[i].id + ",";
      }
      this.id = this.id.substring(0, this.id.length - 1);
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.getList();
    },
    //新增弹框
    add() {
      this.visiDialog = true;
      this.isEditor = false;
    },
    //删除
    delet(id) {
      this.globelDelet("/AuthorityManagement/users/ids", id, this.getList);
    },
    //批量删除
    allDelet() {
      this.globelDelet(
        "/AuthorityManagement/users/ids",
        this.id,
        this.getList
      );
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            let formData = new FormData();
            formData.append("customerName", this.formData.customerName);
            formData.append("discrib", this.formData.discrib);
            formData.append("lat", this.formData.lat);
            formData.append("lng", this.formData.lng);
            formData.append("zoom", this.formData.zoom);
            formData.append("id", this.id);
            this.$http.put("AuthorityManagement/platformCustomer", formData).then(res => {
              if (res.data.code == 0) {
                this.resetForm(formName);
                this.visiDialog = false;
                this.getList();
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
              }
            });
          } else {
            let formData = new FormData();	
            formData.append("customerName", this.formData.customerName);
            formData.append("discrib", this.formData.discrib);
            formData.append("lat", this.formData.lat);
            formData.append("lng", this.formData.lng);
            formData.append("zoom", this.formData.zoom);
           
            this.$http.post("AuthorityManagement/platformCustomer", formData).then(res => {
              if (res.data.code == 0) {
                this.resetForm(formName);
                this.visiDialog = false;
                this.getList();
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //取消
    cancel(formName) {
      this.visiDialog = false;
      this.resetForm(formName);
    },
    closess(done) {
      done();
      this.resetForm("ruleForm");
    },
    //修改
    revise(row) { 
      this.isEditor = true;
      this.visiDialog = true;
      this.id=row.id;
      this.formData.customerName = row.customerName;
      this.formData.discrib = row.discrib;
      this.formData.lat = row.lat;
      this.formData.lng = row.lng;
      this.formData.zoom = row.zoom;
    
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.customerName = "";
      this.formData.discrib ="";
      this.formData.lat = "";
      this.formData.lng = "";
      this.formData.zoom = "";
      this.id = "";
    },
    //获取
    getRole() {
      this.$http.get("AuthorityManagement/roles").then(res => {
        this.optionDataRole = res.data.content.dataList;
      });
    },
    //获取表格数据
    getList() {
      this.loading = true;
      this.$http
        .get("AuthorityManagement/platformCustomer", {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            key: this.searchModel
          }
        })
        .then(res => {
          this.tableData = res.data.content.dataList;
          this.total = res.data.content.totalRecords;
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="less">
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}
</style>
