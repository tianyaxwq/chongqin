<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入企业名称" clearable v-model="searchModel"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i> 查询
        </el-button>
        <el-button @click="add">
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
              label="企业名称"
              show-overflow-tooltip
              align="center"
              prop="enterpriseName"
            >
              <template slot-scope="scope">
                <span>{{scope.row.enterpriseName ? scope.row.enterpriseName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="行政区划" show-overflow-tooltip align="center" prop="areaName">
              <template slot-scope="scope">
                <span>{{scope.row.areaName ? scope.row.areaName: '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="经度" show-overflow-tooltip align="center" prop="longitude">
              <template slot-scope="scope">
                <span v-if="scope.row.longitude || scope.row.longitude == 0">{{scope.row.longitude}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="纬度" show-overflow-tooltip align="center" prop="latitude">
              <template slot-scope="scope">
                <span v-if="scope.row.latitude || scope.row.latitude == 0">{{scope.row.latitude}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise2(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.enterpriseId)">删除</el-button>
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
                <p class="lihead">企业信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">企业名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="enterpriseName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.enterpriseName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">企业编号：</span>
                    <div class="layoutBox">
                      <el-form-item prop="enterpriseCode">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.enterpriseCode"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属区域：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.areaName"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionDataArea"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属行业：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.enterpriseType"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionDataHy"
                            :key="item.industryName"
                            :label="item.industryName"
                            :value="item.industryName"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">联系人：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.leaderName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">联系电话：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tel"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">上年实际产量：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.num"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">企业状态：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.state"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionDataEnstatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">技术改造措施：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-select
                          v-model="formData.technologyMeasures"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionData"
                            :key="item.technologyName"
                            :label="item.technologyName"
                            :value="item.technologyName"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- <div class="formDiv">
                    <span class="rCode">完成时间：</span>
                    <div class="layoutBox">
                      <el-form-item>
                       <el-date-picker v-model="formData.date" type="date" placeholder="选择日期"   style="width:255px"></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">改造进展：</span>
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
                  <div class="formDiv formDivTl">
                    <span class="rCode">企业地址：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input placeholder="请输入" v-model="formData.location" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- <div class="formDiv formDivTl">
                    <span class="rCode">备注：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.name" type="textarea" rows="3"></el-input>
                    </div>
                  </div>-->
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
      ids: "",
      loading: true,
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "企业信息新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      optionDataArea: [
        { value: 0, label: "雄县" },
        { value: 1, label: "安新" },
        { value: 2, label: "容城" }
      ],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        enterpriseId: "",
        enterpriseName: "", //企业名称
        enterpriseCode: "", //企业编号
        areaName: "", //所属区域
        areaId: "", //所属区域Id
        enterpriseType: "", //所属行业
        enterpriseTypeId: "", //所属行业Id
        leaderName: "", //联系人
        tel: "", //联系电话
        num: "", //上年实际产量
        state: "", //企业状态
        technologyMeasures: "", //技术改造措施
        location: "" //企业地址
      },
      rules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ]
      },
      optionDataEnstatus: [
        { value: 0, label: "正常营业" },
        { value: 1, label: "关停" }
      ],
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
        this.ids += arr[i].enterpriseId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    init() {
      this.$http.get("/waterEnvXA/technology").then(res => {
        this.optionData = res.data.content.dataList;
      });
      this.$http.get("/waterEnvXA/waterIndustry").then(res => {
        this.optionDataHy = res.data.content.dataList;
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
    add() {
      this.$router.push({ path: "/waterPollution/IndRegul/enterInfo" });
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            // let formData = new URLSearchParams();
            // formData.append("enterpriseName", this.formData.enterpriseName);
            // formData.append("enterpriseCode", this.formData.enterpriseCode);
            // formData.append("enterpriseType", this.formData.enterpriseType);
            // formData.append("enterpriseId", this.formData.enterpriseId);

            // formData.append("areaName", this.formData.areaName);
            // formData.append("leaderName", this.formData.leaderName);
            // formData.append("tel", this.formData.tel);
            // formData.append("num", this.formData.num);
            // formData.append("state", this.formData.state);
            // formData.append("location", this.formData.location);
            // formData.append(
            //   "technologyMeasures",
            //   this.formData.technologyMeasures
            // );
            this.$http
              .put(
                "/waterEnvXA/enter",
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
            // formData.append("enterpriseType", this.formData.enterpriseType);
            // formData.append("enterpriseName", this.formData.enterpriseName);
            // formData.append("enterpriseCode", this.formData.enterpriseCode);
            // formData.append("areaName", this.formData.areaName);
            // formData.append("leaderName", this.formData.leaderName);
            // formData.append("tel", this.formData.tel);
            // formData.append("num", this.formData.num);
            // formData.append("state", this.formData.state);
            // formData.append("location", this.formData.location);
            // formData.append(
            //   "technologyMeasures",
            //   this.formData.technologyMeasures
            // );
            this.$http
              .post(
                "/waterEnvXA/enter",
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

      this.formData.enterpriseId = row.enterpriseId;
      this.formData.enterpriseName = row.enterpriseName;
      this.formData.enterpriseCode = row.enterpriseCode;
      this.formData.areaName = row.areaName;
      this.formData.areaId = row.areaId;
      this.formData.enterpriseType = row.enterpriseType;
      this.formData.enterpriseTypeId = row.enterpriseTypeId;
      this.formData.leaderName = row.leaderName;
      this.formData.tel = row.tel;
      this.formData.num = row.num;
      this.formData.state = row.state;
      this.formData.technologyMeasures = row.technologyMeasures;
      this.formData.location = row.location;
    },
    revise2(row) {
      this.$router.push({
        path: "/waterPollution/IndRegul/enterInfo",
        query: { enterInfo: row }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/enter", id, this.searchData);
    },
    exportExcel () {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "企业信息管理";
      let fieldList = ["enterpriseName", "areaName", "longitude", "latitude", "solvedProblem"]
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
        "/waterEnvXA/exports/enterExcel",
        params
      );
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/enter", this.ids, this.searchData);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/enter", {
          params: {
            keyword: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
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
