<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入" v-model="searchModel"></el-input>
        </div>&emsp;&emsp;
        <el-button>
          <i class="iconfont icon-sousuo" @click="searchData"></i>查询
        </el-button>
        <!-- <el-button @click="add">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button> -->
        <!-- <el-button type="delet" @click="allDelet">
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
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="任务名称" show-overflow-tooltip prop="taskName" align="center"></el-table-column>
            <el-table-column label="所属计划" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.plan">{{scope.row.plan.planName}}</span>
                </div>
              </template>
            </el-table-column>
            </el-table-column>
            <el-table-column label="任务指派" show-overflow-tooltip prop="pre" align="center"></el-table-column>
            <el-table-column label="完成日期" show-overflow-tooltip prop="thDate" align="center"></el-table-column>
            <el-table-column label="填报频率" show-overflow-tooltip prop="tbFrequency" align="center"></el-table-column>
            <el-table-column label="任务内容" show-overflow-tooltip prop="remark" align="center"></el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.state == 0">待办</span>
                  <span v-if="scope.row.state == 1">已审核</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">填报</el-button>
                  <!-- <el-button type="secondBtn" @click="delet(scope.row.userId)">删除</el-button> -->
                  <el-button type="secondBtn" @click="history(scope.row)">填报历史</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="任务填报" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">填报信息</p>
                <div class="libody clear">
                  <div class="formDiv formDivTl">
                    <span class="rCode">填报内容：</span>
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
    <el-dialog :visible.sync="visiDialogH" width="920px" title="填报历史" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <ul>
            <li class="liblock">
              <p class="lihead">填报历史</p>
              <div class="libody clear" style="padding:12px 0 0 20px">
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.timestamp"
                  >{{activity.content}}</el-timeline-item>
                </el-timeline>
              </div>
            </li>
          </ul>
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
      visiDialogH: false,
      loading: true,
      fileList: [],
      radio: "1",
      radio1: "1",
      visiDialogAss: false,
      name: "",
      vTitle: "计划新增",
      visiDialog: false,
      tableData: [
        { name: "2019年工作计划", id: "0", pre: "--", year: "2019年" }
      ],
      ids: "",
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
          { required: true, message: "请输入填报内容", trigger: "blur" }
        ]
      },
      activities: [],  
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    // 填报历史
    history(row) {
      this.visiDialogH = true;
      this.$http
        .get("/planTaskCheck/taskTbForm", {
          params: {
            taskId: row.id,
            type: 2,
            userId: this.toolObj.getCookie("userId")
          }
        })
        .then(res => {
          res.data.content.dataList.map(el => {
            this.activities.push({
              timestamp: el.tbContent,
              content: el.tbDate
            })
          })
        });
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
            // 填报
            this.formData.userId = this.toolObj.getCookie("userId");
            this.formData.userName = this.toolObj.getCookie("userName");
            this.formData.formType = 2;
            this.$http
              .post("/planTaskCheck/taskTbForm", qs.stringify(this.formData))
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
    //批量删除
    allDelet() {
      this.globelDelet("/planTaskCheck/taskTbForm", this.ids, this.searchData);
    },
    //角色删除
    delet(id) {
      this.globelDelet("/planTaskCheck/taskTbForm", id, this.searchData);
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
