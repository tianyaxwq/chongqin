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
          <el-input
            placeholder="请输入船名"
            v-model="searchModel"
            clearable
            style="width:220px"
            size="small"
          ></el-input>
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
            ref="table"
            height="100%"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
            @selection-change="tableChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="船名" show-overflow-tooltip align="center" prop="boatName">
              <template slot-scope="scope">
                <span>{{scope.row.boatName ? scope.row.boatName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="呼号"
              show-overflow-tooltip
              align="center"
              prop="boatImoCode"
              width="290"
            >
              <template slot-scope="scope">
                <span>{{scope.row.boatImoCode ? scope.row.boatImoCode : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="船东"
              show-overflow-tooltip
              align="center"
              prop="userName"
              width="290"
            >
              <template slot-scope="scope">
                <span>{{scope.row.userName ? scope.row.userName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="IMO编号"
              width="170"
              show-overflow-tooltip
              align="center"
              prop="imo"
            >
              <template slot-scope="scope">
                <span>{{scope.row.imo ? scope.row.imo : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="船籍港" width="100" align="center" prop="portId">
              <template slot-scope="scope">
                <span>{{scope.row.portId ? scope.row.portId : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="船舶种类"
              width="160"
              show-overflow-tooltip
              align="center"
              prop="boatTypeId"
            >
              <template slot-scope="scope">
                <span>{{scope.row.boatTypeId ? scope.row.boatTypeId : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.boatId)">删除</el-button>
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
                    <span class="rCode">船舶名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="boatName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.boatName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>IMO：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.imo"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>MMSI：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.mmsi"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>呼号：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.boatImoCode"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="formDiv">
                    <span>船舶类型：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.boatTypeId"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>船旗：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.boatFlag"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>DWT：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.dwt"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>船籍港：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.portId"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>

                  <div class="formDiv">
                    <span>建造年代：</span>
                    <div class="layoutBox">
                      <el-date-picker
                        v-model="formData.createTime"
                        type="year"
                        placeholder="选择日期"
                        style="width:255px"
                      ></el-date-picker>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>吃水：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.draft"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>船速：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.speed"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>船龄：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.age"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>运营商：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.operator"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>长*宽*型深：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.dept"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>主机功率：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.power"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>船东：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.userName"
                        size="small"
                        style="width:255px"
                      ></el-input>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>报废时间：</span>
                    <div class="layoutBox">
                      <el-date-picker
                        v-model="formData.discardedTime"
                        type="date"
                        placeholder="选择日期"
                        style="width:255px"
                      ></el-date-picker>
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
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      value1: "",
      name: "",
      vTitle: "船舶信息新增",
      visiDialog: false,
      tableData: [{}],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        imo: "", //IMO
        mmsi: "", //mmsi
        boatName: "",
        boatId: "",
        boatImoCode: "", //呼号
        boatTypeId: "", //类型
        boatFlag: "", //船旗
        dwt: "", //DWT
        portId: "", //船籍港
        createTime: null, //建造年代
        draft: "", //吃水
        speed: "", //船速
        age: "", //船龄
        operator: "", //运营商
        dept: "", //长*宽*型深
        power: "", //主机功率
        userName: "", //船东
        discardedTime: null //报废时间
      },
      areaId: null,
      areaOptions: [],
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.ad_CD,
          label: node.ad_NM
        };
      },
      rules: {
        boatName: [{ required: true, message: "请输入船名", trigger: "blur" }],
        createTime: [
          {
            type: "date",
            required: true,
            message: "请选择建造年代",
            trigger: "change"
          }
        ],
        discardedTime: [
          {
            type: "date",
            required: true,
            message: "请选择报废时间",
            trigger: "change"
          }
        ]
      },
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.formData.boatId = "";
    this.getAreaTree()
    this.searchData();
  },
  methods: {
    getAreaTree() {
      this.$http.get("/dataHandle/yunliBase/getAreaTree", {}).then(res => {
        this.areaOptions = res.data.content.dataList;
      });
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].boatId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
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
          if (this.formData.boatId) {
            if (this.formData.createTime != null) {
              this.formData.createTime = new Date(
                this.formData.createTime
              ).format("yyyy-01-01 00:00:00");
            }

            if (this.formData.discardedTime != null) {
              this.formData.discardedTime = new Date(
                this.formData.discardedTime
              ).format("yyyy-MM-dd 00:00:00");
            }
            this.$http
              .put(
                "/waterEnvXA/boat",
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
            if (this.formData.createTime != null) {
              this.formData.createTime = new Date(
                this.formData.createTime
              ).format("yyyy-01-01 00:00:00");
            }

            if (this.formData.discardedTime != null) {
              this.formData.discardedTime = new Date(
                this.formData.discardedTime
              ).format("yyyy-MM-dd 00:00:00");
            }

            this.$http
              .post(
                "/waterEnvXA/boat",
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
      this.visiDialog = true;
      this.formData.boatId = row.boatId;
      this.formData.imo = row.imo;
      this.formData.mmsi = row.mmsi;
      this.formData.boatName = row.boatName;
      this.formData.boatImoCode = row.boatImoCode;
      this.formData.boatTypeId = row.boatTypeId;
      this.formData.boatFlag = row.boatFlag;
      this.formData.dwt = row.dwt;
      this.formData.portId = row.portId;
      this.formData.draft = row.draft;
      this.formData.speed = row.speed;
      this.formData.age = row.age;
      this.formData.operator = row.operator;
      this.formData.dept = row.dept;
      this.formData.power = row.power;
      this.formData.userName = row.userName;
      if (row.createTime) {
        this.formData.createTime = new Date(row.createTime).format("yyyy");
      } else {
        this.formData.createTime = null;
      }
      if (row.discardedTime) {
        this.formData.discardedTime = new Date(row.discardedTime).format(
          "yyyy-MM-dd"
        );
      } else {
        this.formData.discardedTime = null;
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.boatId = "";
      this.formData.imo = "";
      this.formData.mmsi = "";
      this.formData.boatName = "";
      this.formData.boatImoCode = "";
      this.formData.boatTypeId = "";
      this.formData.boatFlag = "";
      this.formData.dwt = "";
      this.formData.portId = "";
      this.formData.draft = "";
      this.formData.speed = "";
      this.formData.age = "";
      this.formData.operator = "";
      this.formData.dept = "";
      this.formData.power = "";
      this.formData.userName = "";
      this.formData.createTime = null;
      this.formData.discardedTime = null;
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/boat", id, this.searchData);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/boat", this.ids, this.searchData);
      } else {
        this.$message.error("请先选择数据");
      }
    },
    exportExcel () {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "船舶管理";
      let fieldList = ["boatName", "boatImoCode", "userName", "imo", "portId",  "boatTypeId"]
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
        "/waterEnvXA/exports/boatExcel",
        params
      );
    },
    //查询
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/boat", {
          params: {
            keyword: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            areaId: this.areaId
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

<style>
</style>
