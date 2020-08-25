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
        <el-button @click="visiDialog = true;vTitle = '计划新增'">
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
              label="计划名称"
              show-overflow-tooltip
              prop="planName"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column label="年份" show-overflow-tooltip prop="thYear" align="center"></el-table-column>
            <el-table-column
              label="包含行业"
              show-overflow-tooltip
              align="center"
              prop="industrys"
              :formatter="indusFormat"
            ></el-table-column>
            <el-table-column
              label="包含区域"
              show-overflow-tooltip
              align="center"
              prop="areas"
              :formatter="areaFormat"
            ></el-table-column>
            <el-table-column label="完成日期" show-overflow-tooltip prop="thDate" align="center"></el-table-column>
            <el-table-column label="是否需要审核" width="120" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.isAudit == 0">否</span>
                  <span v-if="scope.row.isAudit == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="是否需要填报" width="120" show-overflow-tooltip align="center">
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
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.id)">删除</el-button>
                  <el-button type="secondBtn">下发</el-button>
                  <!-- <el-button type="secondBtn" @click="delet(scope.row.userId)">暂停</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.userId)">废止</el-button>-->
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
                <p class="lihead">计划信息</p>
                <div class="libody clear">
                  <div class="formDiv formDivTl">
                    <span class="rCode" style="vertical-align: middle;">计划名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="planName">
                        <el-input placeholder="请输入" v-model="formData.planName" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属年份：</span>
                    <div class="layoutBox">
                      <el-form-item prop="thYear">
                        <el-date-picker
                          v-model="formData.thYear"
                          type="year"
                          placeholder="选择年"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">计划完成日期：</span>
                    <div class="layoutBox">
                      <el-form-item prop="thDate">
                        <el-date-picker
                          v-model="formData.thDate"
                          type="date"
                          placeholder="选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">包含行业：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.industrys"
                          placeholder="请选择"
                          multiple
                          collapse-tags
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in industrysOpt"
                            :key="item.industryId"
                            :label="item.industryName"
                            :value="item.industryId"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">包含区域：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.areas"
                          placeholder="请选择"
                          multiple
                          collapse-tags
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in areasOpt"
                            :key="item.areaId"
                            :label="item.areaName"
                            :value="item.areaId"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="formDiv">
                    <span>上级计划：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-select
                          v-model="formData.pId"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in superiorPlanOpt"
                            :key="item.id"
                            :label="item.planName"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>是否需要审核：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-radio v-model="formData.isAudit" label="1">是</el-radio>
                        <el-radio v-model="formData.isAudit" label="0">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" v-if="formData.isAudit =='1'">
                    <span class="rCode">审核人：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.auditUserName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>是否需要填报：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-radio v-model="formData.isTb" label="1">是</el-radio>
                        <el-radio v-model="formData.isTb" label="0">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" v-if="formData.isTb =='1'">
                    <span class="rCode">填报频率：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.tbFrequency"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in freOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span style="vertical-align: top;">附件：</span>
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
    <el-dialog :visible.sync="visiDialogAss" width="920px" title="计划下发" :before-close="closess">
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
      visiDialogAss: false,
      fileList: [],
      radio: "1",
      radio1: "1",
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "计划新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [25, 35, 55], //设置每页多少条
      freOpt: [
        { label: "无", value: "0" },
        { label: "一天一次", value: "1" },
        { label: "一周一次", value: "2" },
        { label: "一月一次", value: "3" }
      ],
      industrysOpt: [],
      industrysObj: {},
      areasOpt: [],
      areasObj: {},
      superiorPlanOpt: [],
      formData: {
        id: null,
        planName: "", //计划名称
        thYear: null, //所属年份
        industrys: [], //包含行业
        areas: [], //包含区域
        thDate: null, //计划完成时间
        planType: "1", //计划类型 1水环境2土壤
        pId: null, //上级计划
        isAudit: "0", //是否审核
        auditUserName: "", //审核人
        isTb: "0", //是否填报
        tbFrequency: "0", //填报频率
        file: [], //附件
        thDepartment: "", //填报人部门
        userName: "" //填报人
      },
      formD: null,
      rules: {
        planName: [
          { required: true, message: "请填写计划名称", trigger: "blur" }
        ],
        thYear: [
          { required: true, message: "请选择所属年份", trigger: "change" }
        ],
        thDate: [
          { required: true, message: "请选择计划完成时间", trigger: "change" }
        ]
      },
      i: 0,
      ids: "",
      loading: true,
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.init();
  },
  methods: {
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
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    init() {
      this.$http.get("/waterEnvXA/waterIndustry").then(res => {
        this.industrysOpt = res.data.content.dataList;
        for (let i = 0; i < this.industrysOpt.length; i++) {
          let key = this.industrysOpt[i].industryId;
          this.industrysObj[key] = this.industrysOpt[i].industryName;
        }
      });
      // 加载区域
      this.inclusiveRegion();
      // 加载上级计划
      this.superiorPlan();
      this.searchData();
    },
    // 包含区域查询
    inclusiveRegion() {
      this.$http.post("/basicData/area/query").then(res => {
        this.areasOpt = res.data.content.dataList;
        for (let i = 0; i < this.areasOpt.length; i++) {
          let key = this.areasOpt[i].areaId;
          this.areasObj[key] = this.areasOpt[i].areaName;
        }
      });
    },
    // 加载上级计划
    superiorPlan() {
      this.$http
        .get("/planTaskCheck/plan", {
          params: {
            planType: 1
          }
        })
        .then(res => {
          this.superiorPlanOpt = res.data.content.dataList;
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
    searchData() {
      this.loading = true;
      this.$http
        .get("/planTaskCheck/plan/planTree", {
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
    uploadFile(file) {
      this.formD.append("file[" + this.i + "]", file.file);
      this.i++;
    },
    //删除文件
    handleRemove(file) {
      if (file.id) {
        this.$http
          .delete("/planTaskCheck/plan/file", {
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
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            this.formD = new FormData();
            this.$refs.upload.submit();
            this.i = 0;
            if (this.formData.thYear != null) {
              this.formData.thYear = new Date(this.formData.thYear).format(
                "yyyy"
              );
            } else {
              this.formData.thYear = "";
            }
            if (this.formData.thDate != null) {
              this.formData.thDate = new Date(this.formData.thDate).format(
                "yyyy-MM-dd"
              );
            } else {
              this.formData.thDate = "";
            }

            for (let i = 0; i < this.formData.industrys.length; i++) {
              this.formD.append(
                "industrys[" + i + "].industryId",
                this.formData.industrys[i]
              );
              this.formD.append(
                "industrys[" + i + "].industryName",
                this.industrysObj[this.formData.industrys[i]]
              );
            }
            for (let i = 0; i < this.formData.areas.length; i++) {
              this.formD.append(
                "areas[" + i + "].areaId",
                this.formData.areas[i]
              );
              this.formD.append(
                "areas[" + i + "].areaName",
                this.areasObj[this.formData.areas[i]]
              );
            }
            this.toolObj.parseFormData(this.formData, this.formD);
            this.$http.put("/planTaskCheck/plan", this.formD).then(res => {
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
            this.formD = new FormData();
            this.$refs.upload.submit();
            this.i = 0;
            if (this.formData.thYear != null) {
              this.formData.thYear = new Date(this.formData.thYear).format(
                "yyyy"
              );
            } else {
              this.formData.thYear = null;
            }
            if (this.formData.thDate != null) {
              this.formData.thDate = new Date(this.formData.thDate).format(
                "yyyy-MM-dd"
              );
            } else {
              this.formData.thDate = null;
            }

            for (let i = 0; i < this.formData.industrys.length; i++) {
              this.formD.append(
                "industrys[" + i + "].industryId",
                this.formData.industrys[i]
              );
              this.formD.append(
                "industrys[" + i + "].industryName",
                this.industrysObj[this.formData.industrys[i]]
              );
            }
            for (let i = 0; i < this.formData.areas.length; i++) {
              this.formD.append(
                "areas[" + i + "].areaId",
                this.formData.areas[i]
              );
              this.formD.append(
                "areas[" + i + "].areaName",
                this.areasObj[this.formData.areas[i]]
              );
            }
            this.toolObj.parseFormData(this.formData, this.formD);
            // this.formD.append("planName", this.formData.planName);
            // this.formD.append("thYear", this.formData.thYear);
            // this.formD.append("thDate", this.formData.thDate);

            // this.formD.append("pId", this.formData.pId);
            // this.formD.append("isAudit", this.formData.isAudit);
            // this.formD.append("auditUserName", this.formData.auditUserName);
            // this.formD.append("isTb", this.formData.isTb);
            // this.formD.append("tbFrequency", this.formData.tbFrequency);
            // this.formD.append("thDepartment", this.formData.thDepartment);
            // this.formD.append("userName", this.formData.userName);
            this.$http.post("/planTaskCheck/plan", this.formD).then(res => {
              if (res.data.code == 0) {
                this.resetForm(formName);
                this.visiDialog = false;
                this.i = 0;
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
          this.i = 0;
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
      this.vTitle = '计划编辑';
      this.formData.id = row.id;
      this.formData.planName = row.planName;
      this.formData.thYear = row.thYear;
      this.formData.thDate = row.thDate;
      this.formData.pId = row.pid;
      this.formData.isAudit = row.isAudit;
      this.formData.auditUserName = row.auditUserName;
      this.formData.isTb = row.isTb;
      this.formData.tbFrequency = row.tbFrequency;
      this.formData.industrys = [];
      if (row.industrys && row.industrys.length > 0) {
        for (let i = 0; i < row.industrys.length; i++) {
          this.formData.industrys.push(row.industrys[i].industryId);
        }
      }
      this.formData.areas = [];
      if (row.areas && row.areas.length > 0) {
        for (let i = 0; i < row.areas.length; i++) {
          this.formData.areas.push(row.areas[i].areaId);
        }
      }
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
    //删除
    delet(id) {
      this.globelDelet("/planTaskCheck/plan", id, this.searchData);
    },
    //批量删除
    allDelet() {
      this.globelDelet("/planTaskCheck/plan", this.ids, this.searchData);
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
