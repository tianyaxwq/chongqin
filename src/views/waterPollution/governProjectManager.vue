<template>
  <!-- 污水处理厂基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入工程名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button @click="openDialog">
          <i class="iconfont icon-tianjia"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">批量删除</el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap1">
        <div style="height:100%">
          <el-table
            border
            ref="table"
            :data="tableData"
            height="100%"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
            @selection-change="tableChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="工程名称" show-overflow-tooltip align="center" prop="projectName"></el-table-column>
            <el-table-column label="建设单位" show-overflow-tooltip align="center" prop="buildCompany"></el-table-column>
            <el-table-column
              label="施工单位"
              show-overflow-tooltip
              align="center"
              prop="constructCompany"
            ></el-table-column>
            <el-table-column label="设计单位" show-overflow-tooltip align="center" prop="designCompany"></el-table-column>
            <el-table-column label="建设地点" show-overflow-tooltip align="center" prop="address"></el-table-column>
            <el-table-column label="建设内容" show-overflow-tooltip align="center" prop="content"></el-table-column>
            <el-table-column label="治理工艺" show-overflow-tooltip align="center" prop="technology"></el-table-column>
            <el-table-column label="投资规模" show-overflow-tooltip align="center" prop="investScale"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="edit(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.id)">删除</el-button>
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

    <el-dialog
      :visible.sync="visiDialog"
      width="650px"
      :title="title"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <div class="dialogcontent">
        <div class="dialog-layout">
          <el-form :model="ruleForm" :rules="formRules" ref="ruleForm">
            <p class="lihead">工程管理</p>
            <div class="libody clear">
              <ul class="formul">
                <li>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>工程名称 :
                    </span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="projectName">
                        <el-input placeholder="请输入" v-model="ruleForm.projectName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>建设单位 :
                    </span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="buildCompany">
                        <el-input placeholder="请输入" v-model="ruleForm.buildCompany"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="layoutspan">施工单位 :</span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="title">
                        <el-input placeholder="请输入" v-model="ruleForm.constructCompany"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <span class="layoutspan">设计单位 :</span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="type">
                        <el-input placeholder="请输入" v-model="ruleForm.designCompany"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>建设地点 :
                    </span>&nbsp;
                    <div class="layoutBox" style="width:450px">
                      <el-form-item prop="address">
                        <el-input placeholder="请输入" v-model="ruleForm.address"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>建设内容 :
                    </span>&nbsp;
                    <div class="layoutBox" style="width:450px">
                      <el-form-item prop="content">
                        <el-input placeholder="请输入" type="textarea" v-model="ruleForm.content"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="layoutspan">处理工艺 :</span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="title">
                        <el-input placeholder="请输入" v-model="ruleForm.technology"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <span class="layoutspan">投资规模 :</span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="type">
                        <el-input placeholder="请输入" v-model="ruleForm.investScale"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="save('ruleForm')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { exportTableData } from "../../assets/js/tableExport";
export default {
  data() {
    return {
      visiDialog: false,
      loading: true,
      tableData: [],
      title: "新增工程",

      queryPrams: {
        keyword: "",
        pageNo: 1,
        pageSize: 15
      },
      ruleForm: {
        id: "",
        projectName: "",
        buildCompany: "",
        constructCompany: "",
        designCompany: "",
        address: "",
        content: "",
        technology: "",
        investScale: ""
      },
      formRules: {
        projectName: [
          { required: true, message: "请输入工程名称", trigger: "blur" }
        ],
        buildCompany: [
          { required: true, message: "请输入建设单位", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入建设地点", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入建设内容", trigger: "change" }
        ]
      },
      ids: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [15, 25, 35] //设置每页多少条
    };
  },
  inject: ["globelDelet"],
  created() {
    this.fetchData();
  },
  methods: {
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "工程管理";
      let fieldList = [
        "projectName",
        "buildCompany",
        "constructCompany",
        "designCompany",
        "address",
        "content",
        "technology",
        "investScale"
      ];
      let params = {
        headerProp: fieldList.join(","),
        keyword: this.queryPrams.keyword,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/governProjectExcel",
        params
      );
    },
    //查询数据
    fetchData() {
      this.queryPrams.pageNo = 1;
      this.searchData();
    },
    searchData() {
      var me = this;
      me.loading = true;
      me.$http
        .get("/waterEnvXA/governProject/queryByPage", {
          params: this.queryPrams
        })
        .then(res => {
          me.tableData = res.data.content.dataList;
          me.totalRecords = res.data.content.totalRecords;
          me.loading = false;
        });
    },
    openDialog() {
      this.visiDialog = true;
      this.title = "新增工程";
      this.clearData();
    },
    //新增
    save(form) {
      var me = this;
      me.$refs[form].validate(valid => {
        if (valid) {
          if (me.ruleForm.id) {
            me.$http.put("/waterEnvXA/governProject", me.ruleForm).then(res => {
              if (res.data.code == 0) {
                me.visiDialog = false;
                me.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 700
                });
                me.fetchData();
                me.resetForm("ruleForm");
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  duration: 700
                });
              }
            });
          } else {
            me.$http
              .post("/waterEnvXA/governProject", me.ruleForm)
              .then(res => {
                if (res.data.code == 0) {
                  me.visiDialog = false;
                  me.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 700
                  });
                  me.fetchData();
                  me.resetForm("ruleForm");
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning",
                    duration: 700
                  });
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    //编辑指令
    edit(v) {
      this.visiDialog = true;
      this.title = "编辑工程";
      this.ruleForm.id = v.id;
      this.ruleForm.projectName = v.projectName;
      this.ruleForm.buildCompany = v.buildCompany;
      this.ruleForm.constructCompany = v.constructCompany;
      this.ruleForm.designCompany = v.designCompany;
      this.ruleForm.address = v.address;
      this.ruleForm.content = v.content;
      this.ruleForm.technology = v.technology;
      this.ruleForm.investScale = v.investScale;
    },
    clearData() {
      this.resetForm("ruleForm");
    },
    delet(id) {
      this.globelDelet("/waterEnvXA/governProject", id, this.fetchData);
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/governProject", this.ids, this.fetchData);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //关闭
    close() {
      this.visiDialog = false;
      this.resetForm("ruleForm");
    },
    //重置表单
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    paginationSizeChange(v) {
      this.queryPrams.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.queryPrams.pageNo = v;
      this.searchData();
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
.pageContent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.layoutspan {
  width: 90px;
  i {
    color: red;
    margin-right: 4px;
    float: right;
  }
}
</style>
