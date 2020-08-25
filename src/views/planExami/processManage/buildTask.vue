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
        <el-button @click="add">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table
            border
            :data="tableData"
            height="100%"
            row-key="id"
            tooltip-effect="light"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
            @selection-change="tableChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              label="任务名称"
              show-overflow-tooltip
              prop="taskName"
              align="center"
              width="140px"
            ></el-table-column>
            <el-table-column label="所属计划" show-overflow-tooltip align="center">
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
            <el-table-column label="操作" width="330" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.id)">删除</el-button>
                  <!-- <el-button type="secondBtn" @click="visiDialogAss=true">下发</el-button> -->
                  <!-- <el-button type="secondBtn" @click="delet(scope.row.userId)">暂停</el-button> -->
                  <!-- <el-button type="secondBtn" @click="delet(scope.row.userId)">废止</el-button> -->
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
          <el-form :model="insertFormData" :rules="newlyBuild" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">任务信息</p>
                <div class="libody clear">
                  <div class="formDiv formDivTl">
                    <span class="rCode" style="vertical-align: middle;">任务名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="taskName">
                        <el-input placeholder="请输入" v-model="insertFormData.taskName" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属计划：</span>
                    <div class="layoutBox">
                      <el-form-item prop="pId">
                        <el-select
                          v-model="insertFormData.pId"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in planArr"
                            :key="item.id"
                            :label="item.planName"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">完成日期：</span>
                    <div class="layoutBox">
                      <el-form-item prop="thDate">
                        <el-date-picker
                          v-model="insertFormData.thDate"
                          type="date"
                          placeholder="请选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- <div class="formDiv">
                    <span class="rCode">任务指派：</span>
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
                  </div>-->

                  <div class="formDiv">
                    <span class="rCode">是否需要审核：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-radio v-model="insertFormData.isAudit" label="1">是</el-radio>
                        <el-radio v-model="insertFormData.isAudit" label="2">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" v-if="insertFormData.isAudit =='1'">
                    <span class="rCode">审核人：</span>
                    <div class="layoutBox">
                      <el-form-item prop="auditUserId">
                        <el-select
                          v-model="insertFormData.auditUserId"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in auditUserNameArr"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">是否需要填报：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-radio v-model="insertFormData.isTb" label="1">是</el-radio>
                        <el-radio v-model="insertFormData.isTb" label="2">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" v-if="radio1 =='1'">
                    <span class="rCode">填报频率：</span>
                    <div class="layoutBox">
                      <el-form-item prop="tbFrequency">
                        <el-select
                          v-model="insertFormData.tbFrequency"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in frequencyArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">任务内容：</span>
                    <div class="layoutBox">
                      <el-form-item prop="remark">
                        <el-input
                          placeholder="请输入"
                          v-model="insertFormData.remark"
                          size="small"
                          type="textarea"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode" style="vertical-align: top;">附件：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-upload
                          class="upload-demo"
                          ref="upload"
                          action="/"
                          :on-remove="handleRemove"
                          :file-list="fileList"
                          :auto-upload="false"
                          :http-request="uploadFile"
                        >
                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        </el-upload>
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
      ids: "",
      fileList: [],
      radio: "1",
      radio1: "1",
      visiDialogAss: false,
      name: "",
      vTitle: "任务新增",
      visiDialog: false,
      tableData: [
        {
          name: "2019年工作计划",
          id: "0",
          pre: "--",
          status: "1",
          children: [
            { name: "任务1", id: "1", pre: "test", status: "2" },
            { name: "任务2", id: "2", pre: "test", status: "2" }
          ]
        }
      ],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [10, 15, 20], //设置每页多少条
      auditUserNameArr: [], //审核人
      planArr: [], // 所属计划
      frequencyArr: [
        {
          label: "一天一次",
          value: "1"
        },
        {
          label: "一个月一次",
          value: "2"
        }
      ], // 填报频率
      newlyBuild: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" }
        ],
        pId: [{ required: true, message: "请选择所属计划", trigger: "blur" }],
        thDate: [
          { required: true, message: "请选择完成日期", trigger: "blur" }
        ],
        auditUserId: [
          { required: true, message: "请选择审核人", trigger: "blur" }
        ],
        tbFrequency: [
          { required: true, message: "请选择填报频率", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入填报内容", trigger: "blur" }]
      },
      insertFormData: {
        taskName: "",
        pId: "",
        thDate: "",
        isAudit: "1",
        auditUserId: "",
        isTb: "1",
        tbFrequency: "",
        remark: ""
      },
      formData: {
        name: ""
      },
      i: 0,
      formD: null,
      loading: true,
      rules: {
        name: [{ required: true, message: "", trigger: "blur" }]
      },
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.init();
  },
  methods: {
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    uploadFile(file) {
      this.formD.append("file[" + this.i + "]", file.file);
      this.i++;
    },
    // 获取所属计划
    getPlanArr() {
      this.$http
        .get("/planTaskCheck/plan", {
          params: {
            planType: 1
          }
        })
        .then(res => {
          this.planArr = res.data.content.dataList;
        });
    },
    //删除文件
    handleRemove(file) {
      if (file.id) {
        this.$http
          .delete("/planTaskCheck/task/file", {
            params: {
              id: file.id
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 1000
              });
            }
          });
      }
    },
    //批量删除
    allDelet() {
      this.globelDelet("/planTaskCheck/task", this.ids, this.searchData);
    },
    // 新建任务
    add() {
      this.isEditor = false;
      this.visiDialog = true;
      this.vTitle = '任务新增'
    },
    init() {
      // 获取审核人
      this.$http.get("/IdentityManagement/users").then(res => {
        this.auditUserNameArr = res.data.content.dataList;
      });
      // 页面数据
      this.searchData();
      this.getPlanArr();
    },
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
            // 编辑任务
            this.formD = new FormData();
            this.$refs.upload.submit();
            if (this.insertFormData.thDate != null) {
              this.insertFormData.thDate = new Date(
                this.insertFormData.thDate
              ).format("yyyy-MM-dd");
            } else {
              this.insertFormData.thDate = "";
            }
            // for (let i = 0; i < this.planArr.length; i++) {
            //   if (this.insertFormData.pId == this.planArr[i].id) {
            //     this.formD.append("planName", this.planArr[i].planName);
            //   }
            // }
            for (let i = 0; i < this.auditUserNameArr.length; i++) {
              if (
                this.insertFormData.auditUserId ==
                this.auditUserNameArr[i].userId
              ) {
                this.formD.append(
                  "auditUserName",
                  this.auditUserNameArr[i].userName
                );
              }
            }
            this.toolObj.parseFormData(this.insertFormData, this.formD);
            this.$http.put("/planTaskCheck/task", this.formD).then(res => {
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
            // 新建任务
            this.formD = new FormData();
            this.$refs.upload.submit();
            if (this.insertFormData.thDate != null) {
              this.insertFormData.thDate = new Date(
                this.insertFormData.thDate
              ).format("yyyy-MM-dd");
            } else {
              this.insertFormData.thDate = null;
            }
            this.formD.append("taskType", 1);
            this.formD.append("userId", this.toolObj.getCookie("userId"));
            this.formD.append("userName", this.toolObj.getCookie("userName"));
            // for (let i = 0; i < this.planArr.length; i++) {
            //   if (this.insertFormData.pId == this.planArr[i].id) {
            //     this.formD.append("planName", this.planArr[i].planName);
            //   }
            // }
            for (let i = 0; i < this.auditUserNameArr.length; i++) {
              if (
                this.insertFormData.auditUserId ==
                this.auditUserNameArr[i].userId
              ) {
                this.formD.append(
                  "auditUserName",
                  this.auditUserNameArr[i].userName
                );
              }
            }
            this.toolObj.parseFormData(this.insertFormData, this.formD);
            this.$http.post("/planTaskCheck/task", this.formD).then(res => {
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
    //角色修改
    revise(row) {
      this.vTitle = '任务编辑'
      this.isEditor = true;
      this.visiDialog = true;
      this.insertFormData.id = row.id;
      this.insertFormData.auditUserId = row.auditUserId;
      this.insertFormData.auditUserName = row.auditUserName;
      this.insertFormData.isAudit = row.isAudit;
      this.insertFormData.isTb = row.isTb;
      this.insertFormData.pId = row.plan.id;
      this.insertFormData.taskType = 1;
      this.insertFormData.taskName = row.taskName;
      this.insertFormData.remark = row.remark;
      this.insertFormData.tbFrequency = row.tbFrequency;
      this.insertFormData.thDate = row.thDate;
      this.insertFormData.userId = this.toolObj.getCookie("userId");
      this.insertFormData.userName = this.toolObj.getCookie("userName");
      this.fileList = [];
      if (row.files && row.files.length > 0) {
        for (let i = 0; i < row.files.length; i++) {
          this.fileList.push({
            id: row.files[i].id,
            name: row.files[i].fileName,
            url: row.files[i].fileUrl
          });
        }
      } else {
        this.fileList = [];
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //角色删除
    delet(id) {
      this.globelDelet("/planTaskCheck/task", id, this.searchData);
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
