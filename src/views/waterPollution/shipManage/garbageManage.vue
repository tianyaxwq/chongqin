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
            placeholder="请输入垃圾种类"
            v-model="searchModel"
            clearable
            size="small"
            style="width:220px"
          ></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
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
            <el-table-column label="垃圾种类" show-overflow-tooltip align="center" prop="garbageType"><template slot-scope="scope">
                <span>{{scope.row.garbageType ? scope.row.garbageType : '--'}}</span>
              </template></el-table-column>
            <el-table-column
              label="垃圾量"
              width="150"
              show-overflow-tooltip
              align="center"
              prop="garbageTotal"
            ><template slot-scope="scope">
                <span>{{scope.row.garbageTotal ? scope.row.garbageTotal : '--'}}</span>
              </template></el-table-column>
            <el-table-column
              label="车辆类型"
              width="250"
              show-overflow-tooltip
              align="center"
              prop="carType"
            ><template slot-scope="scope">
                <span>{{scope.row.carType ? scope.row.carType : '--'}}</span>
              </template></el-table-column>
            <el-table-column
              label="垃圾车编号"
              width="170"
              show-overflow-tooltip
              align="center"
              prop="carNum"
            ><template slot-scope="scope">
                <span>{{scope.row.carNum ? scope.row.carNum : '--'}}</span>
              </template></el-table-column>
            <el-table-column label="港口" width="180" align="center" prop="portName"><template slot-scope="scope">
                <span>{{scope.row.portName ? scope.row.portName : '--'}}</span>
              </template></el-table-column>
            <el-table-column label="处理过程" width="200" align="center">
              <template slot-scope="scope">
                <div>
                  <span
                    v-if="scope.row.process && scope.row.process.length>0"
                  >{{scope.row.process[0].processName}}</span>
                  <span v-else>--</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.garbageId)">删除</el-button>
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
                <p class="lihead">垃圾基本信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">垃圾种类：</span>
                    <div class="layoutBox">
                      <el-form-item prop="garbageType">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.garbageType"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">垃圾量：</span>
                    <div class="layoutBox">
                      <el-form-item prop="garbageTotal">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.garbageTotal"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>产垃圾港口：</span>
                    <div class="layoutBox">
                      <el-form-item prop="portName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.portName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>所属河流：</span>
                    <div class="layoutBox">
                      <el-form-item prop="riverName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.riverName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>提交人：</span>
                    <div class="layoutBox">
                      <el-form-item prop="userName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.userName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>上报时间：</span>
                    <div class="layoutBox">
                      <el-form-item prop="uploadTime">
                        <el-date-picker
                          v-model="formData.uploadTime"
                          type="date"
                          placeholder="选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">垃圾车信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span>垃圾车车型：</span>
                    <div class="layoutBox">
                      <el-form-item prop="carType">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.carType"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>垃圾车车牌：</span>
                    <div class="layoutBox">
                      <el-form-item prop="carNum">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.carNum"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>垃圾车司机：</span>
                    <div class="layoutBox">
                      <el-form-item prop="driver">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.driver"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>联系电话：</span>
                    <div class="layoutBox">
                      <el-form-item prop="tel">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tel"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead" style="margin-bottom:12px;">
                  过程监管&emsp;&emsp;&emsp;
                  <el-button @click="addProcess">
                    <i class="iconfont icon-tianjia1"></i>新增过程
                  </el-button>
                </p>
                <div
                  class="libody clear"
                  v-for="(item,key) in formData.process"
                  :key="key"
                  style="margin-top:12px"
                >
                  <div class="formDiv">
                    <span>过程名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="processName"> 
                        <el-input
                          placeholder="请输入"
                          v-model="item.processName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>过程负责人：</span>
                    <div class="layoutBox">
                      <el-form-item prop="userName">
                        <el-input
                          placeholder="请输入"
                          v-model="item.userName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- <div class="formDiv">
                    <span class="rCode">过程状态：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.name"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>-->
                  <div class="formDiv">
                    <span>上报时间：</span>
                    <div class="layoutBox">
                      <el-form-item prop="receiveTime">
                        <el-date-picker
                          v-model="item.receiveTime"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" style="text-align:right">
                    <el-button type="delet" @click="deletProcess(key)">
                      <i class="iconfont icon-shanchu"></i>删除
                    </el-button>
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
      visiDialogB: false,
      name: "",
      vTitle: "垃圾管理新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      formData: {
        garbageId: "",
        garbageType: "", //垃圾种类
        garbageTotal: "", //垃圾量
        portName: "", //港口
        riverName: "", //所属河流
        userName: "", //提交人
        uploadTime: null, //上报时间
        carType: "", //垃圾车车型
        carNum: "", //垃圾车车牌
        driver: "", //垃圾车司机
        tel: "", //联系电话
        process: [{ processName: "", userName: "", receiveTime: null }]
      },
      rules: {
        garbageTotal:[
          { required: true, message: "请输入垃圾量", trigger: "blur" }
        ],
        garbageType: [
          { required: true, message: "请输入垃圾种类", trigger: "blur" }
        ]
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
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.getAreaTree()
    this.searchData();
  },
  methods: {
    exportExcel () {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "垃圾管理";
      let fieldList = ["garbageType", "garbageTotal", "carType", "carNum", "portName",  "process"]
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
        "/waterEnvXA/exports/garbageExcel",
        params
      );
    },
    getAreaTree() {
      this.$http.get("/dataHandle/yunliBase/getAreaTree", {}).then(res => {
        this.areaOptions = res.data.content.dataList;
      });
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].garbageId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    //新增过程
    addProcess() {
      this.formData.process.push({
        processName: "",
        userName: "",
        receiveTime: null
      });
    },
    //删除过程
    deletProcess(key) {
      this.formData.process.splice(key, 1);
    },
    add() {
      this.vTitle = "垃圾管理新增";
      this.visiDialog = true;
      this.isEditor = false;
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.searchData();
    },
    //searchData
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/garbage", {
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
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            //   let formData = new FormData();
            for (let i = 0; i < this.formData.process.length; i++) {
              if (this.formData.process[i].receiveTime) {
                this.formData.process[i].receiveTime =
                  new Date(this.formData.process[i].receiveTime).format(
                    "yyyy-MM-dd"
                  ) + " 00:00:00";
              }
            }
            if (this.formData.uploadTime) {
              this.formData.uploadTime =
                new Date(this.formData.uploadTime).format("yyyy-MM-dd") +
                " 00:00:00";
            }

            this.$http.put("/waterEnvXA/garbage", this.formData).then(res => {
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
            for (let i = 0; i < this.formData.process.length; i++) {
              if (this.formData.process[i].receiveTime) {
                this.formData.process[i].receiveTime =
                  new Date(this.formData.process[i].receiveTime).format(
                    "yyyy-MM-dd"
                  ) + " 00:00:00";
              }
            }
            if (this.formData.uploadTime) {
              this.formData.uploadTime =
                new Date(this.formData.uploadTime).format("yyyy-MM-dd") +
                " 00:00:00";
            }
            this.$http.post("/waterEnvXA/garbage", this.formData).then(res => {
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
      this.vTitle = "垃圾管理编辑";
      this.formData.garbageId = row.garbageId;
      this.formData.garbageType = row.garbageType;
      this.formData.garbageTotal = row.garbageTotal;
      this.formData.portName = row.portName;
      this.formData.riverName = row.riverName;
      this.formData.userName = row.userName;

      if (row.uploadTime) {
        this.formData.uploadTime = row.uploadTime;
      } else {
        this.formData.uploadTime = null;
      }
      this.formData.carType = row.carType;
      this.formData.carNum = row.carNum;
      this.formData.driver = row.driver;
      this.formData.tel = row.tel;
      if (row.process && row.process.length > 0) {
        this.formData.process = row.process;
      } else {
        this.formData.process = [
          { processName: "", userName: "", receiveTime: null }
        ];
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();

      this.formData.garbageId = "";
      this.formData.garbageType = "";
      this.formData.garbageTotal = "";
      this.formData.portName = "";
      this.formData.riverName = "";
      this.formData.userName = "";
      this.formData.uploadTime = null;
      this.formData.carType = "";
      this.formData.carNum = "";
      this.formData.driver = "";
      this.formData.tel = "";
      this.formData.process = [
        { processName: "", userName: "", receiveTime: null }
      ];
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/garbage", id, this.searchData);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/garbage", this.ids, this.searchData);
      } else {
        this.$message.error('请选择要删除的数据')
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

<style>
</style>
