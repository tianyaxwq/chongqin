<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>关键字 :</span>
      <div class="layoutBox" style="width:220px">
        <el-input placeholder="请输入用户名称" v-model="searchModel"></el-input>
      </div>&emsp;&emsp;
      <el-button @click="getList">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="add">
        <i class="iconfont icon-tianjia"></i>新增
      </el-button>
      <el-button type="delet" @click="allDelet">
        <i class="iconfont icon-shanchu"></i>批量删除
      </el-button>
    </div>
    <div class="currency-mode-wrap">
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
        <el-table-column prop="userName" label="用户名称"></el-table-column>
        <el-table-column prop="userAccount" label="账号"></el-table-column>
        <el-table-column prop="phonenb" label="电话">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.phonenb && scope.row.phonenb !='null'">{{scope.row.phonenb}}</span>
                <span v-else>-</span>
              </div>
            </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
             <template slot-scope="scope">
              <div>
               <span v-if="scope.row.email &&  scope.row.email !='null'">{{scope.row.email}}</span>
                <span v-else>-</span>
              </div>
            </template>
        </el-table-column>
        <el-table-column prop="role" label="所属角色">
          <template slot-scope="scope">
            <div v-if="scope.row.role">{{scope.row.role.roleName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="资源配置" width="250">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="setStation(scope.row.userId)">站点配置</el-button>
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
              <el-button type="secondBtn" @click="delet(scope.row.userId)">删除</el-button>
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
                <span class="rCode">账号名</span>
              </td>
              <td>
                <el-form-item prop="userAccount">
                  <el-input placeholder="请输入" v-model="formData.userAccount"></el-input>
                </el-form-item>
              </td>
              <td width="16.5%">
                <span class="rCode">用户密码</span>
              </td>
              <td>
                <el-form-item prop="password">
                  <el-input placeholder="请输入" v-model="formData.password"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="16.5%">
                <span class="rCode">用户名称</span>
              </td>
              <td>
                <el-form-item prop="userName">
                  <el-input placeholder="请输入" v-model="formData.userName"></el-input>
                </el-form-item>
              </td>
              <td width="16.5%">
                <span>所属角色</span>
              </td>
              <td>
                <div style="margin-bottom:10px">
                  <el-form-item prop="role">
                    <el-select v-model="formData.role" collapse-tags placeholder="请选择">
                      <el-option
                        v-for="item in optionDataRole"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td width="16.5%">
                <span>邮箱</span>
              </td>
              <td>
                <div style="margin-bottom:10px">
                  <el-input placeholder="请输入" v-model="formData.email"></el-input>
                </div>
              </td>
              <td width="16.5%">
                <span>电话</span>
              </td>
              <td>
                <div style="margin-bottom:10px">
                  <el-input placeholder="请输入" v-model="formData.phonenb"></el-input>
                </div>
              </td>
            </tr>
            <tr>
              <td width="16.5%">
                <span>所属平台</span>
              </td>
              <td>
                <div style="margin-bottom:10px">
                  <el-form-item prop="plId">
                    <el-select v-model="formData.plId" collapse-tags placeholder="请选择">
                      <el-option
                        v-for="item in optionDataPl"
                        :key="item.id"
                        :label="item.customerName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </td>
               <td width="16.5%">
                <span>是否是管理员</span>
              </td>
              <td>
                <div style="margin-bottom:10px">
                  <el-form-item prop="plId">
                    <el-select v-model="formData.admin" collapse-tags placeholder="请选择">
                      <el-option
                        v-for="item in adminOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
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
      optionDataPl:[],
      adminOptions:[
        {"id":0, "name":"否"},
        {"id":1, "name":"是"},
      ],
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
        userName: "",
        password: "",
        userAccount: "",
        role: "",
        email: "",
        phonenb: "",
        plId:'',
        admin:0
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 25, message: "长度在 3 到 25 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 25, message: "长度在 6 到 25 个字符", trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择所属角色", trigger: "change" }],
        plId: [{ required: true, message: "请选择所属平台", trigger: "change" }]
      },
      isEditor: false, //判断是新增还是修改状态
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      userId: "",
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
       formData.append("userId", this.userId);
       formData.append("stationIds",pId.join(','));
     
       this.$http
         .post("/SiteManagement/stationSystem/addUserStations/ids", formData)
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
            groupStations: "",
            userId:this.toolObj.getCookie('userId')
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
      this.userId = id;
      this.stfilterText = "";
      this.stVisiDialog = true;
      this.$http
        .get("/SiteManagement/stationSystem/userStations", {
          params: {
            userId: this.userId
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
      this.userId = "";
      for (let i in arr) {
        this.userId += arr[i].userId + ",";
      }
      this.userId = this.userId.substring(0, this.userId.length - 1);
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
    //角色删除
    delet(id) {
      this.globelDelet("/AuthorityManagement/users/ids", id, this.getList);
    },
    //角色批量删除
    allDelet() {
      this.globelDelet(
        "/AuthorityManagement/users/ids",
        this.userId,
        this.getList
      );
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            let formData = new FormData();
            formData.append("userName", this.formData.userName);
            formData.append("plId", this.formData.plId);
            formData.append("password", this.formData.password);
            formData.append("userAccount", this.formData.userAccount);
            formData.append("role.roleId", this.formData.role);
            formData.append("email", this.formData.email);
            formData.append("phonenb", this.formData.phonenb);
            formData.append("userId", this.userId);
            formData.append("sex", 1);
            formData.append("admin", this.formData.admin);
            formData.append("appCode",'nwstation_app');
            this.$http.put("AuthorityManagement/users/", formData).then(res => {
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
            formData.append("appCode",'nwstation_app');
            formData.append("plId", this.formData.plId);
            formData.append("userName", this.formData.userName);
            formData.append("password", this.formData.password);
            formData.append("userAccount", this.formData.userAccount);
            formData.append("role.roleId", this.formData.role);
            formData.append("email", this.formData.email);
            formData.append("phonenb", this.formData.phonenb);
            formData.append("sex", 1);
            formData.append("admin", this.formData.admin);
            this.$http.post("AuthorityManagement/users", formData).then(res => {
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
    //角色修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.plId=row.plId;
      this.formData.userName = row.userName;
      this.formData.password = row.password;
      this.formData.userAccount = row.userAccount;
      if (row.role) {
        this.formData.role = row.role.roleId;
      }

      this.formData.email = row.email;
      this.formData.phonenb = row.phonenb;
      this.formData.admin = row.admin;
      this.userId = row.userId;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.userName = "";
      this.formData.password = "";
      this.formData.userAccount = "";
      this.formData.role = "";
      this.formData.email = "";
      this.formData.phonenb = "";
      this.userId = "";
    },
    //获取角色
    getRole() {
      this.$http.get("AuthorityManagement/roles").then(res => {
        this.optionDataRole = res.data.content.dataList;
      });
       this.$http
        .get("/AuthorityManagement/platformCustomer")
        .then(res => {
          this.optionDataPl=res.data.content.dataList;
        });
    },
    //获取表格数据
    getList() {
      this.loading = true;
      this.$http
        .get("AuthorityManagement/users", {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            userName: this.searchModel
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
