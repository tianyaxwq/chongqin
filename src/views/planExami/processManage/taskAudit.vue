<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入" v-model="searchModel"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table
            border
            :data="tableData"
            height="100%"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
            <el-table-column label="任务名称" show-overflow-tooltip prop="taskName" align="center"></el-table-column>
            <el-table-column label="所属计划" show-overflow-tooltipalign="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.plan">{{scope.row.plan.planName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="任务指派" show-overflow-tooltip prop="pre" align="center"></el-table-column>
            <el-table-column label="完成日期" show-overflow-tooltip prop="thDate" align="center"></el-table-column>
            <el-table-column label="填报频率" show-overflow-tooltip prop="tbFrequency" align="center"></el-table-column>
            <el-table-column label="任务内容" show-overflow-tooltip prop="remark" align="center"></el-table-column>
            <el-table-column label="状态" width="80" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.state == 0">待办</span>
                  <span v-if="scope.row.state == 1">已审核</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">审核</el-button>
                  <!-- <el-button type="secondBtn" @click="visiDialogAss=true">下发</el-button> -->
                </div>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="任务审核" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">审核信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">审核意见：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-radio v-model="formData.type" label="1">通过</el-radio>
                        <el-radio v-model="formData.type" label="2">不通过</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span>备注：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.comment"
                        type="textarea"
                        :rows="3"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submit('ruleForm')">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="visiDialogAss" width="920px" title="任务下发" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">下发信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">下级机构：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-select
                          v-model="value"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">备注：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" type="textarea" :rows="3"></el-input>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="visiDialogAss=false">提交</el-button>
        <el-button type="noticonsecondBtn" @click="visiDialogAss=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      loading: true,
      fileList: [],
      radio: "1",
      radio1: "1",
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "计划新增",
      visiDialog: false,
      tableData: [
        { name: "2019年工作计划", id: "0", pre: "--", year: "2019年" }
      ],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [10, 15, 20], //设置每页多少条
      formData: {
        type: "1",
        comment: ""
      },
      rules: {
        comment: [{ required: false, message: "请输入审核备注", trigger: "blur"}]
      },
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    // 查询列表数据
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
          // 任务审核
          let formData = new FormData();
          formData.append("id", this.formData.id);
          formData.append("comment", this.formData.comment);
          formData.append("auditUserName", this.toolObj.getCookie("userName"));
          formData.append("auditUserId", this.toolObj.getCookie("userId"));
          formData.append("type", this.formData.type);
          this.$http.post("/planTaskCheck/task/approve", formData).then(res => {
            if (res.data.code == 0) {
              this.resetForm(formName);
              this.visiDialog = false;
              this.searchData();
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 1000
              });
            }
          });
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
      this.formData.id = row.id;
      this.visiDialog = true;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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

<style lang="less" scoped>
</style>
