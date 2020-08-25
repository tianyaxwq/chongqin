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
        <!-- <el-button @click="add">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button> -->
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
            @selection-change="tableChange"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="计划名称" show-overflow-tooltip prop="planName" align="center"></el-table-column>
            <el-table-column label="年份" show-overflow-tooltip prop="thYear" align="center"></el-table-column>
            <el-table-column
              label="包含行业"
              show-overflow-tooltip
              prop="industrys"
              :formatter="indusFormat"
              align="center"
            ></el-table-column>
            <el-table-column
              label="包含区域"
              show-overflow-tooltip
              align="center"
              prop="areas"
              :formatter="areaFormat"
            ></el-table-column>
            <el-table-column label="完成日期" show-overflow-tooltip prop="thDate" align="center"></el-table-column>
            <el-table-column label="是否需要审核" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.isAudit == 0">否</span>
                  <span v-if="scope.row.isAudit == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="是否需要填报" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.isTb== 0">否</span>
                  <span v-if="scope.row.isTb == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.state == 0">未审核</span>
                  <span v-if="scope.row.state == 1">已审核</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">督办</el-button>
                  <el-button type="secondBtn" @click="history(scope.row)">历史督办</el-button>
                  <!-- <el-button type="secondBtn" @click="delet(scope.row.userId)">删除</el-button> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationBox">
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="计划督办" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">督办信息</p>
                <div class="libody clear">
                  <div class="formDiv formDivTl">
                    <span class="rCode">督办内容：</span>
                    <div class="layoutBox">
                      <el-form-item prop="tbContent">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tbContent"
                          type="textarea"
                          :rows="3"
                        ></el-input>
                      </el-form-item>
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
    <el-dialog :visible.sync="visiDialogAss" width="920px" title="历史督办" :before-close="closess">
      <div class="dialogcontent noScrollX" style="height:250px">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">督办信息</p>
                <el-table border :data="tableDb">
                  <el-table-column label="督办内容" width="240px" align="center" prop="tbContent"></el-table-column>
                  <el-table-column label="督办时间" align="center" prop="tbDate"></el-table-column>
                </el-table>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "",

  data() {
    return {
      loading: true,
      fileList: [],
      tableDb: [],
      radio: "1",
      radio1: "1",
      visiDialogAss: false,
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
        tbContent: ""
      },
      rules: {
        tbContent: [
          { required: true, message: "请输入督办内容", trigger: "blur" }
        ]
      },
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    // 督办历史
    history (row) {
      this.visiDialogAss = true;
      this.$http
        .get("/planTaskCheck/planTbForm", {
          params: {
            planId: row.id,
            type: 1,
            userId: this.toolObj.getCookie("userId")
          }
        })
        .then(res => {
          this.tableDb = res.data.content.dataList
        });
    },
    indusFormat(row) {
      if (row.industrys && row.industrys.length > 0) {
        let str = "";
        for (let i = 0; i < row.industrys.length; i++) {
          str += row.industrys[i].industryName + ",";
        }
        str = str.slice(0, str.length - 1);
        return str;
      } else {
        return "-";
      }
    },
    areaFormat(row) {
      if (row.areas && row.areas.length > 0) {
        let str = "";
        for (let i = 0; i < row.areas.length; i++) {
          str += row.areas[i].areaName + ",";
        }
        str = str.slice(0, str.length - 1);
        return str;
      } else {
        return "-";
      }
    },
    // 选中操作
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].farmId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    //新增弹框
    add() {
      this.visiDialog = true;
      this.isEditor = false;
    },
    //批量删除
    allDelet() {
      this.globelDelet("/planTaskCheck/taskTbForm", this.ids, this.searchData);
    },
    // 查询列表数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/planTaskCheck/plan", {
          params: {
            key: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            planType: 1
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    paginationSizeChange() {
      this.pageSize = v;
      this.searchData();
    },
    paginationChange() {
      this.currentPage = v;
      this.searchData();
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            // 督办
            this.formData.userId = this.toolObj.getCookie("userId");
            this.formData.userName = this.toolObj.getCookie("userName");
            this.formData.formType = 1;
            this.$http
              .post("/planTaskCheck/planTbForm", qs.stringify(this.formData))
              .then(res => {
                if (res.data.code == 0) {
                  this.resetForm(formName);
                  this.visiDialog = false;
                  this.searchData();
                }
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
              });
          } else {
            // 新增
            delete this.formData.id;
            delete this.formData.planTaskId;
            this.formData.userId = this.toolObj.getCookie("userId");
            this.formData.userName = this.toolObj.getCookie("userName");
            this.formData.formType = 1;
            this.$http
              .post("/planTaskCheck/planTbForm", qs.stringify(this.formData))
              .then(res => {
                if (res.data.code == 0) {
                  this.resetForm(formName);
                  this.visiDialog = false;
                  this.searchData();
                }
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
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
      this.formData.planTaskId = row.id;
      this.isEditor = true;
      this.visiDialog = true;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //角色删除
    delet(id) {
      this.globelDelet("/planTaskCheck/planTbForm", id, this.getList);
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
