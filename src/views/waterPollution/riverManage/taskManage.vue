<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入" v-model="searchModel" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button>
          <i class="iconfont icon-sousuo"></i> 查询
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table border :data="tableData" height="100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="计划名称" show-overflow-tooltip width="240" align="center"></el-table-column>
            <el-table-column label="计划时间" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="上级计划" width="160" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="计划内容" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="反馈内容" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="督办内容" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="操作" width="250" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">反馈</el-button>
                  <!-- <el-button type="secondBtn" @click="visiDialogD=true">督办</el-button>
                  <el-button type="secondBtn">转派</el-button> -->
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="任务反馈" :before-close="closess">
  
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">反馈信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">反馈时间：</span>
                    <div class="layoutBox">
                      <el-date-picker v-model="formData.name" type="date" placeholder="选择日期"></el-date-picker>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">反馈内容：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" type="textarea" :rows="4"></el-input>
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
    <el-dialog :visible.sync="visiDialogD" width="920px" title="任务督办" :before-close="closess">


      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">督办信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">督办时间：</span>
                    <div class="layoutBox">
                      <el-date-picker v-model="formData.name" type="date" placeholder="选择日期"></el-date-picker>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">备注：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" type="textarea" :rows="4"></el-input>
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
    <el-dialog :visible.sync="visiDialogDetail" width="920px" title="任务详情" :before-close="closess">

      <div class="dialogcontent noScrollX" style="height:400px">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">任务情况：</p>
                <div class="libody clear">
                  <div class="formDiv formDivTl">
                    <span class="rCode">反馈内容：</span>
                    <div class="layoutBox" style="padding-left:12px">
                      <el-timeline :reverse="reverse">
                        <el-timeline-item
                          v-for="(activity, index) in activities"
                          :key="index"
                          :timestamp="activity.timestamp"
                        >{{activity.content}}</el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">督办内容：</span>
                    <div class="layoutBox" style="padding-left:12px">
                      <el-timeline :reverse="reverse">
                        <el-timeline-item
                          v-for="(activity, index) in activities"
                          :key="index"
                          :timestamp="activity.timestamp"
                        >{{activity.content}}</el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      reverse: true,
      activities: [
        {
          content: "计划开始",
          timestamp: "2018-04-15"
        },
        {
          content: "通过审核",
          timestamp: "2018-04-13"
        },
        {
          content: "创建成功",
          timestamp: "2018-04-11"
        }
      ],
      radio: "1",
      visiDialogDetail: false,
      visiDialogD: false,
      value1: "",
      name: "",
      vTitle: "计划审核",
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
  methods: {
    //事件指派
    assgn() {
      this.visiDialogAss = true;
    },
    paginationSizeChange() {},
    paginationChange() {},
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

<style lang="less" scoped>
</style>
