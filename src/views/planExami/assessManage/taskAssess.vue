<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入" v-model="searchModel"></el-input>
        </div>&emsp;&emsp;
        <el-button>
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table border :data="tableData" height="100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              label="计划名称"
              show-overflow-tooltip
              prop="taskName"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column label="指派人" width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column
              label="完成时间"
              prop="thDate"
              width="150"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column label="自评分" show-overflow-tooltip align="center">
              <template>
                <div>--</div>
              </template>
            </el-table-column>
            <el-table-column label="上级评分" show-overflow-tooltip align="center">
              <template>
                <div>--</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.state == 0">待办</span>
                  <span v-if="scope.row.state == 1">已审核</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
              <template slot-scope="scope">
                <!-- <div>
                  <el-button type="secondBtn" @click="revise">自评</el-button>
                  <el-button type="secondBtn" @click="revise">上级评分</el-button>
                  <el-button type="secondBtn" @click="revise">复评</el-button>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination-wrap">
          <el-pagination
            @size-change="paginationSizeChange"
            @current-change="paginationChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            background
            :small="true"
            popper-class="select-common-option"
            :page-sizes="pageList"
            layout="total,sizes,slot,->,prev, pager, next, jumper"
            :total="totalRecords"
          >
            <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="visiDialog" width="920px" title="评分" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <el-table border :data="scoreData">
                <el-table-column label="指标名称" align="center"></el-table-column>
                <el-table-column label="指标权重" align="center"></el-table-column>
                <el-table-column label="分数" align="center">
                  <template>
                    <el-input placeholder="请输入" v-model="formData.name" size="small"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submit('ruleForm')">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      scoreData: [{}],
      value1: "",
      name: "",
      vTitle: "新增",
      visiDialog: false,
      tableData: [{}],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [10, 15, 20], //设置每页多少条
      formData: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入养殖场名称", trigger: "blur" }]
      },

      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    searchData() {
      this.loading = true;
      this.$http
        .get("/planTaskCheck/task", {
          params: {
            key: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            taskType: 1
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.searchData();
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
            formData.append("appCode", "nwstation_app");
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
            formData.append("appCode", "nwstation_app");
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
    //关闭弹框
    closess(done) {
      done();
      this.resetForm("ruleForm");
    },
    //角色修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //角色删除
    delet(id) {
      this.globelDelet("/AuthorityManagement/users/ids", id, this.getList);
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number;
    }
  }
};
</script>

<style>
</style>
