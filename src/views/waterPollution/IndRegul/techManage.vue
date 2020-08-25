<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入技术方案名称" clearable v-model="searchModel" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i> 查询
        </el-button>
        <el-button @click="visiDialog =true">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
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
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              label="技术方案名称"
              show-overflow-tooltip
              align="center"
              prop="technologyName"
            >
              <template slot-scope="scope">
                <span>{{scope.row.technologyName ? scope.row.technologyName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="所属行业"
              width="100"
              show-overflow-tooltip
              align="center"
              prop="industryName"
            >
              <template slot-scope="scope">
                <span>{{scope.row.industryName ? scope.row.industryName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="适用范围"
              width="100"
              show-overflow-tooltip
              align="center"
              prop="scope"
            >
              <template slot-scope="scope">
                <span>{{scope.row.scope ? scope.row.scope : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="技术主要内容"
              width="130"
              show-overflow-tooltip
              align="center"
              prop="technologyContext"
            >
              <template slot-scope="scope">
                <span>{{scope.row.technologyContext ? scope.row.technologyContext : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="解决的主要问题"
              width="130"
              show-overflow-tooltip
              align="center"
              prop="solvedProblem"
            >
              <template slot-scope="scope">
                <span>{{scope.row.solvedProblem ? scope.row.solvedProblem : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="应用前景分析"
              width="130"
              show-overflow-tooltip
              align="center"
              prop="analysis"
            >
              <template slot-scope="scope">
                <span>{{scope.row.analysis ? scope.row.analysis : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.technologyId)">删除</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="920px" :title="vTitle" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">技术方案信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">技术方案名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="technologyName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.technologyName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属行业：</span>
                    <div class="layoutBox">
                      <el-form-item prop="industryName">
                        <el-select
                          v-model="formData.industryName"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionData"
                            :key="item.industryName"
                            :label="item.industryName"
                            :value="item.industryName"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">试用范围：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.scope" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">技术主要内容：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.technologyContext"
                        type="textarea"
                        rows="3"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">解决的主要问题：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.solvedProblem"
                        type="textarea"
                        rows="3"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">应用前景分析：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.analysis"
                        type="textarea"
                        rows="3"
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
  </div>
</template>

<script>
import qs from "qs";
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",

  data() {
    return {
      loading: true,
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "生产技术方案新增",
      visiDialog: false,
      tableData: [{}],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        technologyId: "", //技术方案Id
        technologyName: "", //技术方案名称
        industryName: "", //所属行业
        industryId: "", //所属行业Id
        scope: "", //试用范围
        technologyContext: "", //技术主要内容
        solvedProblem: "", //解决的主要问题
        analysis: "" //应用前景分析
      },
      loading: true,
      rules: {
        technologyName: [
          { required: true, message: "请输入技术方案名称", trigger: "blur" }
        ],
        industryName: [
          { required: true, message: "请选择所属行业", trigger: "change" }
        ]
      },
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.init();
    this.searchData();
  },
  methods: {
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].technologyId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    init() {
      this.$http.get("/waterEnvXA/waterIndustry").then(res => {
        this.optionData = res.data.content.dataList;
      });
    },
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get(
          "/waterEnvXA/technology",
          {
            params: {
              keyword: this.searchModel,
              pageNo: this.currentPage,
              pageSize: this.pageSize
            }
          }
        )
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
      for (let i = 0; i < this.optionData.length; i++) {
        if (this.formData.industryName == this.optionData[i].industryName) {
          this.formData.industryId = this.optionData[i].industryId;
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            // let formData = new URLSearchParams();
            // formData.append("technologyId", this.formData.technologyId);
            // formData.append("technologyName", this.formData.technologyName);
            // formData.append("industryName", this.formData.industryName);
            // formData.append("industryId", this.formData.industryId);
            // formData.append("scope", this.formData.scope);
            // formData.append(
            //   "technologyContext",
            //   this.formData.technologyContext
            // );
            // formData.append("solvedProblem", this.formData.solvedProblem);
            // formData.append("analysis", this.formData.analysis);
            this.$http
              .put(
                "/waterEnvXA/technology",
                qs.stringify(this.formData, { skipNulls: true })
              )
              .then(res => {
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
            // let formData = new FormData();
            // formData.append("technologyId", this.formData.technologyId);
            // formData.append("technologyName", this.formData.technologyName);
            // formData.append("industryName", this.formData.industryName);
            // formData.append("industryId", this.formData.industryId);
            // formData.append("scope", this.formData.scope);
            // formData.append(
            //   "technologyContext",
            //   this.formData.technologyContext
            // );
            // formData.append("solvedProblem", this.formData.solvedProblem);
            // formData.append("analysis", this.formData.analysis);
            this.$http
              .post(
                "/waterEnvXA/technology",
                qs.stringify(this.formData, { skipNulls: true })
              )
              .then(res => {
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
    //修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.technologyId = row.technologyId;
      this.formData.technologyName = row.technologyName;
      this.formData.industryName = row.industryName;
      this.formData.industryId = row.industryId;
      this.formData.scope = row.scope;
      this.formData.technologyContext = row.technologyContext;
      this.formData.solvedProblem = row.solvedProblem;
      this.formData.analysis = row.analysis;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.technologyId = "";
      this.formData.technologyName = "";
      this.formData.industryName = "";
      this.formData.industryId = "";
      this.formData.scope = "";
      this.formData.technologyContext = "";
      this.formData.solvedProblem = "";
      this.formData.analysis = "";
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/technology", id, this.searchData);
    },
    exportExcel () {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "生产技术方案管理";
      let fieldList = ["technologyName", "industryName", "scope", "technologyContext", "solvedProblem", "analysis"]
      let params = {
        headerProp: fieldList.join(","),
        keyword: this.searchModel,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/technologyExcel",
        params
      );
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/technology", this.ids, this.searchData);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
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
.gridBox {
  height: 400px;
  border: 1px solid #d6e3f2;
  padding: 8px;
  .lBox {
    width: 200px;
    height: 100%;
    float: left;
  }
  .rBox {
    float: left;
    height: 100%;
    width: calc(100% - 200px);
    background: #999;
  }
}
</style>
