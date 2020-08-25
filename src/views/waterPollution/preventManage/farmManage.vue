<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>行政区划 :</span>
        <div class="layoutBox">
          <treeselect
            :normalizer="normalizer"
            style="margin-bottom:-12px;border-radius: 0px;width:180px;height:30px;"
            :disable-branch-nodes="true"
            placeholder="请选择"
            v-model="areaId"
            :multiple="false"
            :options="areaOptions"
          />
        </div>&emsp;&emsp;
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input placeholder="请输入养殖场名称" v-model="searchModel" clearable size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button @click="visiDialog =true">
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
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="养殖场名称" show-overflow-tooltip align="center" prop="farmName">
              <template slot-scope="scope">
                <span>{{scope.row.farmName ? scope.row.farmName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="养殖场编码" show-overflow-tooltip align="center" prop="farmCode">
              <template slot-scope="scope">
                <span>{{scope.row.farmCode ? scope.row.farmCode : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="行政区划" show-overflow-tooltip align="center" prop="areaName">
              <template slot-scope="scope">
                <span>{{scope.row.areaName ? scope.row.areaName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="养殖小区名称" show-overflow-tooltip align="center" prop="village">
              <template slot-scope="scope">
                <span>{{scope.row.village ? scope.row.village : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="养殖场地址" show-overflow-tooltip align="center" prop="farmLoca">
              <template slot-scope="scope">
                <span>{{scope.row.farmLoca ? scope.row.farmLoca : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="面积（公顷）" align="center" prop="area">
              <template slot-scope="scope">
                <span>{{scope.row.area ? scope.row.area : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="负责人" align="center" prop="userName">
              <template slot-scope="scope">
                <span>{{scope.row.userName ? scope.row.userName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center" prop="tel">
              <template slot-scope="scope">
                <span>{{scope.row.tel ? scope.row.tel : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="污染物种类" align="center" prop="pollutionTypes">
              <template slot-scope="scope">
                <span>{{scope.row.pollutionTypes ? scope.row.pollutionTypes : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="受纳水体" align="center" prop="receivingWater">
              <template slot-scope="scope">
                <span>{{scope.row.receivingWater ? scope.row.receivingWater : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.farmId)">删除</el-button>
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
                <p class="lihead">基本信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">养殖场名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="farmName">
                        <el-input placeholder="请输入" v-model="formData.farmName" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="formDiv">
                    <span class="rCode">养殖场编码：</span>
                    <div class="layoutBox">
                      <el-form-item prop="farmCode">
                        <el-input placeholder="请输入" v-model="formData.farmCode" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>养殖小区名称：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.village" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>养殖场面积(公顷)：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.area" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>负责人：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.userName" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>所属行政区：</span>
                    <div class="layoutBox">
                      <treeselect
                        :normalizer="normalizer"
                        style="margin-bottom:-12px;border-radius: 0px;width:255px;height:30px;"
                        :disable-branch-nodes="true"
                        :key="index"
                        placeholder="请选择"
                        v-model="formData.areaId"
                        @select="areaChange"
                        :multiple="false"
                        :options="areaOptions"
                      />
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>联系电话：</span>
                    <div class="layoutBox">
                      <el-form-item prop="tel">
                        <el-input placeholder="请输入" v-model="formData.tel" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>养殖场地址：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.farmLoca" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>饲养目的：</span>
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
                    <span>污染物种类：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.pollutionTypes" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>粪便日产量(kg)：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.fecesDayily" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>污水日产量(t)：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.waterDayily" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>粪便处理利用量(kg)：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.fecesTreatUse" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>污水处理利用量(t)：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.waterTreatUse" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>粪便处理方式：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.fecesTreatType" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>污水处理方式：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.waterTreatType" size="small"></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>受纳水体：</span>
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
        <el-button @click="submit('ruleForm')" :disabled="isDisabled">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",
  components: { Treeselect },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value != null && value != "") {
        setTimeout(() => {
          var patrn = /^1[0123456789]\d{9}$/;
          if (patrn.exec(value) == null || value == "") {
            callback(new Error("联系电话格式有误"));
          } else {
            callback();
          }
        }, 1000);
      } else {
        callback();
      }
    };
    return {
      isDisabled: false,
      name: "",
      vTitle: "养殖场信息新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      areaId: null,
      searchModel: "",
      areaOptions: [],
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.ad_CD,
          label: node.ad_NM
        };
      },
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        farmId: "",
        farmName: "", //养殖场名称
        farmCode: "", //养殖场编号
        village: "", //养殖小区名称
        area: "", //养殖场面积
        userName: "", //负责人
        areaName: "", //行政区划
        areaId: null,
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
        ],
        farmCode: [
          { required: true, message: "请输入养殖场编码", trigger: "blur" }
        ],
        tel: [{ required: true, validator: validatePhone }]
      },
      loading: true,
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.getAreaTree();
    this.searchData();
  },
  methods: {
    getAreaTree() {
      this.$http.get("/dataHandle/yunliBase/getAreaTree", {}).then(res => {
        this.areaOptions = res.data.content.dataList;
      });
    },
    areaChange(v) {
      this.formData.areaName = v.ad_NM;
      this.formData.areaId = v.ad_CD;
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].farmId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/waterFarm", {
          params: {
            areaId: this.areaId,
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
      this.isDisabled = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            // let formData = new URLSearchParams();
            // formData.append("farmId", this.formData.farmId);
            // formData.append("farmName", this.formData.farmName);
            // formData.append("farmCode", this.formData.farmCode);
            // formData.append("village", this.formData.village);
            // formData.append("area", this.formData.area);
            // formData.append("userName", this.formData.userName);
            // formData.append("areaName", this.formData.areaName);
            // formData.append("tel", this.formData.tel);
            // formData.append("farmTarget", this.formData.farmTarget);
            // formData.append("farmLoca", this.formData.farmLoca);
            // formData.append("pollutionTypes", this.formData.pollutionTypes);
            // formData.append("fecesDayily", this.formData.fecesDayily);
            // formData.append("waterDayily", this.formData.waterDayily);
            // formData.append("fecesTreatUse", this.formData.fecesTreatUse);
            // formData.append("waterTreatUse", this.formData.waterTreatUse);
            // formData.append("fecesTreatType", this.formData.fecesTreatType);
            // formData.append("waterTreatType", this.formData.waterTreatType);
            // formData.append("receivingWater", this.formData.receivingWater);
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
                  this.isDisabled = false;
                }
              });
          } else {
            // let formData = new FormData();
            // formData.append("farmName", this.formData.farmName);
            // formData.append("farmCode", this.formData.farmCode);
            // formData.append("village", this.formData.village);
            // formData.append("area", this.formData.area);
            // formData.append("userName", this.formData.userName);
            // formData.append("areaName", this.formData.areaName);
            // formData.append("tel", this.formData.tel);
            // formData.append("farmTarget", this.formData.farmTarget);
            // formData.append("farmLoca", this.formData.farmLoca);

            // formData.append("pollutionTypes", this.formData.pollutionTypes);
            // formData.append("fecesDayily", this.formData.fecesDayily);
            // formData.append("waterDayily", this.formData.waterDayily);
            // formData.append("fecesTreatUse", this.formData.fecesTreatUse);
            // formData.append("waterTreatUse", this.formData.waterTreatUse);
            // formData.append("fecesTreatType", this.formData.fecesTreatType);
            // formData.append("waterTreatType", this.formData.waterTreatType);
            // formData.append("receivingWater", this.formData.receivingWater);
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
                  this.isDisabled = false;
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
      this.formData.areaId = row.areaId;
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
      this.formData.areaId = null;
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
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "养殖场信息";
      let fieldList = [
        "farmName",
        "farmCode",
        "areaName",
        "village",
        "farmLoca",
        "area",
        "userName",
        "tel",
        "pollutionTypes",
        "receivingWater"
      ];
      let params = {
        headerProp: fieldList.join(","),
        areaId: this.areaId,
        keyword: this.searchModel,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/waterFarmExcel",
        params
      );
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/waterFarm", this.ids, this.searchData);
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

