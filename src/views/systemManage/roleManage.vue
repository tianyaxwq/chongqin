<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>关键字 :</span>
      <div class="layoutBox" style="width:220px">
        <el-input placeholder="请输入" v-model="searchModel"></el-input>
      </div>&emsp;&emsp;
      <el-button @click="search">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="addRole">
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
        <el-table-column prop="roleName" width="300" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>

        <el-table-column label="资源配置" width="250">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="setMenu(scope.row.roleId)">菜单配置</el-button>
              <!-- <el-button type="secondBtn" @click="setStation(scope.row.roleId)">站点配置</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="revise(scope.row)">修改</el-button>
              <el-button type="secondBtn" @click="delet(scope.row.roleId)">删除</el-button>
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
                <span class="rCode">用户名称</span>
              </td>
              <td>
                <el-form-item prop="roleName">
                  <el-input placeholder="请输入" v-model="formData.roleName"></el-input>
                </el-form-item>
              </td>
              <td width="16.5%">
                <span>序号</span>
              </td>
              <td>
                <el-form-item prop="seqNum">
                  <el-input placeholder="请输入" v-model.number="formData.seqNum"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="16.5%">
                <span>描述</span>
              </td>
              <td colspan="3">
                <el-input placeholder="请输入" type="textarea" v-model="formData.description"></el-input>
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
    <el-dialog :visible.sync="menuVisiDialog" width="450px" title="菜单配置">
      <div class="dialogcontent tree_content" style="height:300px;padding:0px">
        <el-scrollbar style="height:100%">
          <div style="width:255px;margin-bottom:12px;">
            <el-input placeholder="请输入菜单名" suffix-icon="el-icon-search" v-model="filterText"></el-input>
          </div>
          <el-tree
            :data="menuData"
            :indent="23"
            node-key="id"
            ref="menuTree"
            :default-checked-keys="defaultId"
            default-expand-all
            highlight-current
            show-checkbox
            :filter-node-method="filterNode"
            :class="menuData.length==1?'noBr':''"
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{node,data}">
              <span>
                <i
                  class="iconCode"
                  :class="data.level == '0'?'sf':data.level == '1'?'sf':data.level == '2'?'city':''"
                ></i>
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submitMenu">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancelmSub">取消</el-button>
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
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("序号不能为空"));
      }

      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值并且不为负数"));
      } else {
        callback();
      }
    };
    return {
      filterText: "", //菜单名搜索
      stfilterText: "", //站点名搜索
      stationData: [],
      value: "",
      loading: true,
      visiDialog: false,
      searchModel: "",
      vTitle: "角色新增",
      tableData: [],
      roleId: "",
      formData: {
        roleName: "",
        seqNum: "",
        description: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 1, max: 25, message: "长度在 1 到 25 个字符", trigger: "blur" }
        ],
        seqNum: [{ validator: checkAge, trigger: "blur" }]
      },
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      isEditor: false, //判断是新增还是修改状态
      menuVisiDialog: false,
      stVisiDialog: false,
      menuData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      stdefaultProps: {
        children: "children",
        label: "nodeName"
      },
      defaultId: [],
      stdefaultId: []
    };
  },
  inject: ["globelDelet"],
  created() {
    //this.init()
    this.getMenuData();
    this.getList();
  },
  mounted() {},
  methods: {
    //菜单树过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //站点树过滤
    stfilterNode(value, data) {
      if (!value) return true;
      return data.stationName.indexOf(value) !== -1;
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
            userId: this.toolObj.getCookie("userId")
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
    selectChange(val, index) {
      let arr = val;
      this.roleId = "";
      for (let i in arr) {
        this.roleId += arr[i].roleId + ",";
      }
      this.roleId = this.roleId.substring(0, this.roleId.length - 1);
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.getList();
    },
    //角色新增弹框
    addRole() {
      this.isEditor = false;
      this.visiDialog = true;
    },
    //角色新增提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            let formData = new FormData();
            formData.append("roleName", this.formData.roleName);
            formData.append("seqNum", this.formData.seqNum);
            formData.append("description", this.formData.description);
            formData.append("roleId", this.roleId);
            this.$http.put("AuthorityManagement/roles", formData).then(res => {
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
            formData.append("roleName", this.formData.roleName);
            formData.append("seqNum", this.formData.seqNum);
            formData.append("description", this.formData.description);

            this.$http.post("AuthorityManagement/roles", formData).then(res => {
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
    //角色修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.roleName = row.roleName;
      this.formData.seqNum = row.seqNum;
      this.formData.description = row.description;
      this.roleId = row.roleId;
    },
    //角色删除
    delet(id) {
      this.globelDelet("/AuthorityManagement/roles/ids", id, this.getList);
    },
    //角色批量删除
    allDelet() {
      this.globelDelet(
        "/AuthorityManagement/roles/ids",
        this.roleId,
        this.getList
      );
    },
    //角色列表获取
    getList() {
      this.loading = true;
      this.$http
        .get("AuthorityManagement/roles", {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            roleName: this.searchModel
          }
        })
        .then(res => {
          this.tableData = res.data.content.dataList;
          this.total = res.data.content.totalRecords;
          this.loading = false;
        });
    },
    //查询
    search() {
      this.getList();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.description = "";
      this.formData.roleId = "";
    },
    cancel(formName) {
      this.resetForm(formName);
      this.visiDialog = false;
    },
    closess(done) {
      done();
      this.resetForm("ruleForm");
    },
    //获取菜单树
    getMenuData() {
      this.$http.get("AuthorityManagement/permissions/menus").then(res => {
        this.menuData = res.data.content.dataList;
      });
    },
    //提交菜单树数据
    submitMenu() {
      let menuArr = this.$refs.menuTree.getCheckedNodes(false, true);
      let pId = [];
      for (let i in menuArr) {
        pId.push(menuArr[i].id);
      }
      let formData = new FormData();
      formData.append("roleId", this.roleId);
      formData.append("permissionIds", pId.join(","));

      this.$http
        .post("AuthorityManagement/roles/permissions/ids", formData)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.message,
              type: "success",
              duration: 1500
            });
            this.menuVisiDialog = false;
          }
        });
    },
    //提交站点数据
    submitStation() {
      let stationArr = this.$refs.stationTree.getCheckedNodes(false, true);
      let pId = [];
      let nId = [];

      for (let i in stationArr) {
        if (stationArr[i].stationId != "quanbu") {
          pId.push(stationArr[i].stationId);
          //  nId.push(stationArr[i].nodeId)
        }
      }

      let formData = new FormData();
      formData.append("roleId", this.roleId);
      formData.append("stationIds", pId.join(","));

      this.$http
        .post("AuthorityManagement/roles/stations/ids", formData)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.message,
              type: "success",
              duration: 1500
            });
            this.stVisiDialog = false;
          }
        });
    },
    //设置角色的权限菜单
    setMenu(id) {
      this.roleId = id;
      this.filterText = "";
      this.menuVisiDialog = true;
      this.$http
        .get("AuthorityManagement/roles/rolePermissions", {
          params: {
            roleId: this.roleId
          }
        })
        .then(res => {
          let arr = res.data.content.dataList;
          this.defaultId = [];
          this.$refs.menuTree.setCheckedNodes([]);

          for (let i in arr) {
            if (arr[i] != null) {
              this.defaultId.push(arr[i].permissionId);
            }

            // if(arr[i].permissionLevel == 2 || arr[i].permissionName == 'GIS一张图' || arr[i].permissionName == '知识库'){
            //     this.defaultId.push(arr[i].permissionId)
            // }
          }
        });
    },
    cancelmSub() {
      this.menuVisiDialog = false;
    },
    cancelsSub() {
      this.stVisiDialog = false;
    },
    //设置角色站点数据
    setStation(id) {
      this.roleId = id;
      this.stfilterText = "";
      this.stVisiDialog = true;
      this.$http
        .get("AuthorityManagement/roles/roleStations", {
          params: {
            roleId: this.roleId
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
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
    stfilterText(val) {
      this.$refs.stationTree.filter(val);
    }
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
}
</style>
