<template>
  <div class="pageContent">

    <div class="secondary-page-section secondary-page-mode">
      <div class="lBox tree_content">
        <p class="title">年度计划</p>
        <el-tree
          :data="treeData"
          :indent="23"
          node-key="nodeId"
          ref="tree"
          @node-click="treeNodeclick"
          :default-expanded-keys="defaultId"
          highlight-current
          accordion
          :class="treeData.length==1?'noBr':''"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span>
              <i
                class="iconCode"
                :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'offlinestation'"
              ></i>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="rBox">
        <div class="secondary-toolbar">
          <span>处室名称 :</span>
          <div class="layoutBox" style="width:100px">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in optionData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>&emsp;
          <span>审批时间 :</span>
          <div class="layoutBox" style="width:240px">
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>&emsp;
          <span>关键字 :</span>
          <div class="layoutBox" style="width:100px">
            <el-input placeholder="请输入" v-model="searchModel"></el-input>
          </div>&emsp;
          <el-button>
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
        </div>
        <div class="currency-mode-wrap">
          <div class="el_table_box">
            <el-table border :data="tableData" height="100%">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column label="计划名称" show-overflow-tooltip prop="name"></el-table-column>
              <el-table-column label="重点指标" width="180" show-overflow-tooltip prop="year"></el-table-column>
              <el-table-column label="指标类型" show-overflow-tooltip prop="pre" width="130"></el-table-column>
              <el-table-column label="责任处室" show-overflow-tooltip prop="pre" width="130"></el-table-column>
               <el-table-column label="状态" show-overflow-tooltip prop="pre" width="100"></el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <div>
                    <el-button type="secondBtn" @click="revise(scope.row)">详情</el-button>
                  
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
    </div>
    <el-dialog :visible.sync="visiDialogDetail" width="900px" title="任务详情" :before-close="closess">
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
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      defaultId: "1",
      treeData: [
        {
          nodeName: "2019年工作计划",
          nodeId: 0,
          structureType: "1",
          children: [
            {
              nodeName: "雄县",
              structureType: "2",
              nodeId: 1,
              children: [
                {
                  nodeName: "电镀行业",
                  structureType: "2",
                  nodeId: 4
                }
              ]
            },
            {
              nodeName: "安新县",
              structureType: "2",
              nodeId: 2,
              children: [
                {
                  nodeName: "电镀行业",
                  structureType: "2",
                  nodeId: 5
                }
              ]
            },
            {
              nodeName: "容城县",
              structureType: "2",
              nodeId: 3,
              children: [
                {
                  nodeName: "电镀行业",
                  structureType: "2",
                  nodeId: 6
                }
              ]
            }
          ]
        }
      ],
      tableData: [{}],
      visiDialogDetail: false,
      value1: "",
      name: "",
      vTitle: "计划审核",
      visiDialog: false,
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
      this.visiDialogDetail = true;
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
  mounted() {
    this.$refs.tree.setCurrentKey("4");
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
.secondary-page-section {
  .lBox {
    float: left;
    width: 220px;
    height: 100%;
    margin-right: 5px;
    background: #fff;
    .title {
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      height: 50px;
      line-height: 50px;
    }
  }
  .rBox {
    float: left;
    width: calc(100% - 225px);
    height: 100%;
  }
}
</style>
