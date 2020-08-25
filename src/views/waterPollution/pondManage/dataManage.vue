<template>
  <div class="pageContent">

    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>行政区划 :</span>
        <div class="layoutBox">
          <el-select v-model="value" placeholder="请选择" style="width:120px" size="small">
            <el-option
              v-for="item in optionData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>&emsp;&emsp;
        <span>审批时间 :</span>
        <div class="layoutBox" style="width:250px">
          <el-date-picker
           style="width:250px"
           size="small"
            v-model="value1"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>&emsp;&emsp;
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input placeholder="请输入" v-model="searchModel"  style="width:220px" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button  type="primary yf-button" size="small">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table border :data="tableData" height="100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="纳污坑塘编号" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="所属河流" width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="行政区划" width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="上报时间" width="170" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="整治起始时间" width="160" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="整治进度" width="100" show-overflow-tooltip align="center"></el-table-column>
             <el-table-column label="审核情况" width="80" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="操作" width="160"  align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="primary yf-button"
                    size="mini"
                    plain
                    @click="revise(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="primary yf-button"
                    size="mini"
                    plain
                    @click="delet(scope.row.userId)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-box">
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
        <div slot="title" class="title"><i class="iconfont icon-biaotitubiao"></i>信息编辑<div class="title_bg"></div></div>
     
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">纳污坑塘基本信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">编号：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name"  size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">状态：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name"  size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">问题地点：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name"  size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属河流：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">行政区划：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">来源：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">提交人：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">上报时间：</span>
                    <div class="layoutBox">
                      <el-date-picker v-model="formData.name" type="date" placeholder="选择日期"  style="width:255px"></el-date-picker>
                    </div>
                  </div>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">调查人员信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">责任人：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">联系电话：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">工作单位：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">职务：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                    </div>
                  </div>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead" style="margin-bottom:12px;">
                  过程监管&emsp;&emsp;&emsp;
                  <el-button  type="primary yf-button" size="small">
                    <i class="iconfont icon-tianjia1"></i>新增过程
                  </el-button>
                </p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">过程名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">过程负责人：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.name" size="small" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">上报时间：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-date-picker v-model="formData.name" type="date" placeholder="选择日期" style="width:255px"></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" style="text-align:right">
                    <el-button  type="primary yf-button" size="small" plain>
                      <i class="iconfont icon-shanchu"></i>删除
                    </el-button>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div  class="yf-footer">
          <el-button @click="submit('ruleForm')" type="primary yf-button" size="small" style="width: 100px">提交</el-button>
          <el-button type="primary yf-button" size="small" plain  @click="cancel('ruleForm')" style="width: 100px">取消</el-button>
        </div>
    
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "",

  data() {
    return {
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
  methods: {
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

<style>
</style>
