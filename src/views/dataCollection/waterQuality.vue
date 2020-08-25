<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span class="label">日期：</span>
        <div class="layoutBox" style="width:300px">
          <sl-date-picker
            range-separator="至"
            v-model="dateRange"
            type="date"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></sl-date-picker>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
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
            <el-table-column label="测站名称" show-overflow-tooltip align="center" prop="STNM">
              <template slot-scope="scope">
                <span>{{scope.row.STNM == "null" || !scope.row.STNM ? '--' : scope.row.STNM}}</span>
              </template>
            </el-table-column>
            <el-table-column label="统计时间" show-overflow-tooltip align="center" prop="STAT_TIME">
              <template slot-scope="scope">
                <span>{{scope.row.STAT_TIME == "null" || !scope.row.STAT_TIME ? '--' : scope.row.STAT_TIME}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="统计时间单位"
              show-overflow-tooltip
              align="center"
              prop="STAT_TIME_UNIT"
            >
              <template slot-scope="scope">
                <span>{{scope.row.STAT_TIME_UNIT == "null" || !scope.row.STAT_TIME_UNIT ? '--' : scope.row.STAT_TIME_UNIT}}</span>
              </template>
            </el-table-column>
            <el-table-column label="水质等级" width="280" align="center" prop="WQG">
              <template slot-scope="scope">
                <span v-if="!scope.row.WQG || scope.row.WQG == 'null'">--</span>
                <span
                  v-else
                  class="target-level"
                  :class="'colorValue' + scope.row.WQG"
                >{{scope.row.WQG == "0" ? 'Ⅰ' : scope.row.WQG == "1" ? 'Ⅱ' : scope.row.WQG == "2" ? 'Ⅲ' : scope.row.WQG == "3" ? 'Ⅳ' : scope.row.WQG == "4" ? 'Ⅴ' : scope.row.WQG == "5" ? '劣Ⅴ' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="首要污染物" width="280" align="center" prop="PRIMARY_POLLUTANT">
              <template slot-scope="scope">
                <span>{{scope.row.PRIMARY_POLLUTANT == "null" || !scope.row.PRIMARY_POLLUTANT ? '--' : scope.row.PRIMARY_POLLUTANT}}</span>
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
                <p class="lihead">基本信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">养殖场名称：</span>
                    <div class="layoutBox" prop="farmName">
                      <el-form-item prop="farmName">
                        <el-input placeholder="请输入" v-model="formData.farmName" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="formDiv">
                    <span class="rCode">养殖场编码：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.farmCode" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">养殖小区名称：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.village" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">养殖场面积：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.area" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">负责人：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.userName" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属行政区：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.areaName" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">联系电话：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.tel" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">养殖场地址：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.farmLoca" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">饲养目的：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.farmTarget" size="small"></el-input>
                    </div>
                  </div>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">主要污染指标</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">污染物种类：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.pollutionTypes" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">粪便日产量：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.fecesDayily" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">污水日产量：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.waterDayily" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">粪便处理利用量：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.fecesTreatUse" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">污水处理利用量：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.waterTreatUse" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">粪便处理方式：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.fecesTreatType" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">污水处理方式：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.waterTreatType" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">受纳水体：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.receivingWater" size="small"></el-input>
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
export default {
  name: "",

  data() {
    return {
      name: "",
      vTitle: "养殖场信息新增",
      visiDialog: false,
      tableData: [],
      timeRank: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 14, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        farmId: "",
        farmName: "", //养殖场名称
        farmCode: "", //养殖场编号
        village: "", //养殖小区名称
        area: "", //养殖场面积
        userName: "", //负责人
        areaName: "", //行政区划
        areaId: "",
        tel: "", //联系电话
        farmLoca: "", //养殖场地址
        farmTarget: "", //饲养目的
        //主要污染指标
        pollutionTypes: "",
        fecesDayily: "", //粪便日产量
        waterDayily: "", //污水日产量
        fecesTreatUse: "", //粪便处理利用量
        waterTreatUse: "", //污水处理利用量
        fecesTreatType: "", //粪便处理方式
        waterTreatType: "", //污水处理方式
        receivingWater: "" //受纳水体
      },
      rules: {
        farmName: [
          { required: true, message: "请输入养殖场名称", trigger: "blur" }
        ]
      },
      dateRange: [],
      loading: true,
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    let startTime = new Date().setDate(new Date().getDate() - 6);
    let endTime = new Date();
    this.dateRange = [
      new Date(startTime).format("yyyy-MM-dd"),
      endTime.format("yyyy-MM-dd")
    ];
    // this.startTime = "2019-01-01";
    // this.endTime = new Date().format("yyyy-MM-dd");
    this.searchData();
  },
  methods: {
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].farmId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    searchData() {
      if (this.dateRange[0] != null && this.dateRange[1] != null) {
        this.loading = true;
        this.$http
          .get("/dataHandle/yunliBase/getDwsWq", {
            params: {
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              startTime: this.dateRange[0],
              endTime: this.dateRange[1]
            }
          })
          .then(res => {
            this.loading = false;
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
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
              .put(
                "/waterEnvXA/waterFarm",
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
            this.$http
              .post(
                "/waterEnvXA/waterFarm",
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
      this.formData.farmId = row.farmId;
      this.formData.farmName = row.farmName;
      this.formData.farmCode = row.farmCode;
      this.formData.village = row.village;
      this.formData.area = row.area;
      this.formData.userName = row.userName;
      this.formData.areaName = row.areaName;
      this.formData.tel = row.tel;
      this.formData.farmLoca = row.farmLoca;
      this.formData.farmTarget = row.farmTarget;
      this.formData.pollutionTypes = row.pollutionTypes;
      this.formData.fecesDayily = row.fecesDayily;
      this.formData.waterDayily = row.waterDayily;
      this.formData.fecesTreatUse = row.fecesTreatUse;
      this.formData.waterTreatUse = row.waterTreatUse;
      this.formData.fecesTreatType = row.fecesTreatType;
      this.formData.waterTreatType = row.waterTreatType;
      this.formData.receivingWater = row.receivingWater;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.farmId = "";
      this.formData.farmName = "";
      this.formData.farmCode = "";
      this.formData.village = "";
      this.formData.area = "";
      this.formData.userName = "";
      this.formData.areaName = "";
      this.formData.tel = "";
      this.formData.farmLoca = "";
      this.formData.farmTarget = "";
      this.formData.pollutionTypes = "";
      this.formData.fecesDayily = "";
      this.formData.waterDayily = "";
      this.formData.fecesTreatUse = "";
      this.formData.waterTreatUse = "";
      this.formData.fecesTreatType = "";
      this.formData.waterTreatType = "";
      this.formData.receivingWater = "";
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/waterFarm", id, this.searchData);
    },
    //批量删除
    allDelet() {
      this.globelDelet("/waterEnvXA/waterFarm", this.ids, this.searchData);
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
