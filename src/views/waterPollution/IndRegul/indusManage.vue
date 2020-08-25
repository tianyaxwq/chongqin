<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入行业名称" clearable v-model="searchModel" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button @click="add">
          <i class="iconfont icon-tianjia"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box indusBox">
          <el-table
            border
            :span-method="arraySpanMethod"
            :data="tableData"
            height="100%"
            ref="table"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
            @selection-change="tableChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="行业编码" align="center" prop="industryCode"></el-table-column>
            <el-table-column label="行业名称" show-overflow-tooltip align="center" prop="industryName"></el-table-column>
            <el-table-column label="说明" show-overflow-tooltip align="center" prop="remark">
              <template slot-scope="scope">
                <span>{{scope.row.remark ? scope.row.remark : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="sort"></el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.industryId)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="table-pagination-wrap">
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
        </div>-->
      </div>
    </div>
    <el-dialog :visible.sync="visiDialog" width="920px" :title="vTitle" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">行业信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">行业编号：</span>
                    <div class="layoutBox">
                      <el-form-item prop="industryCode">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.industryCode"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">行业名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="industryName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.industryName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="formDiv">
                    <span class="rCode">排序：</span>
                    <div class="layoutBox">
                      <el-form-item prop="sort">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.sort"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span>备注：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.remark"
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
      labelStr: "",
      ids: "",
      loading: true,
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "行业新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        industryId: "",
        industryName: "",
        industryCode: "",
        sort: "",
        remark: ""
      },
      rules: {
        industryName: [
          { required: true, message: "请输入行业名称", trigger: "blur" }
        ],
        industryCode: [
          { required: true, message: "请输入行业编号", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入排序", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请输入数字"
          }
        ]
      },
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].industryId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/waterIndustry", {
          params: {
            keyword: this.searchModel
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          // this.totalRecords = res.data.content.totalRecords;
          // this.totalRecords = 1;
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
            this.$http
              .post("/waterEnvXA/waterIndustry/edit", this.formData)
              // qs.stringify(this.formData, { skipNulls: true })
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
                } else {
                  this.$message.error(res.data.message);
                }
              });
          } else {
            this.$http
              .post("/waterEnvXA/waterIndustry/edit", this.formData)
              // qs.stringify(this.formData, { skipNulls: true })
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
                } else {
                  this.$message.error(res.data.message);
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
    //新增
    add() {
      this.vTitle = "行业新增";
      this.visiDialog = true;
      this.resetForm("ruleForm");
      this.formData.industryCode = "";
      this.formData.industryId = "";
      this.formData.remark = "";
      this.formData.sort = "";
      this.formData.industryName = "";
    },
    //修改
    revise(row) {
      this.vTitle = "行业编辑";
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.industryCode = row.industryCode;
      this.formData.industryId = row.industryId;
      this.formData.remark = row.remark;
      this.formData.sort = row.sort;
      this.formData.industryName = row.industryName;
    },
    //重置表单
    resetForm(formName) {
      this.formData.industryId = "";
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/waterIndustry", id, this.searchData);
    },
    exportExcel () {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "行业管理";
      let fieldList = ["industryCode", "industryName", "remark", "sort"]
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
        "/waterEnvXA/exports/waterIndustryExcel",
        params
      );
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet(
          "/waterEnvXA/waterIndustry",
          this.ids,
          this.searchData
        );
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
.indusBox {
  height: calc(100% - 0px);
}
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
