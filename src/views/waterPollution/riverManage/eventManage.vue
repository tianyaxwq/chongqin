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
        <div class="layoutBox" style="width:220px">
          <el-input
            placeholder="请输入事件名称"
            v-model="searchModel"
            clearable
            style="width:220px"
            size="small"
          ></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData()">
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
            <el-table-column label="事件名称" show-overflow-tooltip align="center" prop="eventName">
              <template slot-scope="scope">
                <span>{{scope.row.eventName ? scope.row.eventName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="事件类型" show-overflow-tooltip align="center" prop="eventType">
              <template slot-scope="scope">
                <span>{{scope.row.eventType ? scope.row.eventType : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="来源" show-overflow-tooltip align="center" prop="eventSource">
              <template slot-scope="scope">
                <span>{{scope.row.eventSource ? scope.row.eventSource : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="上报时间"
              show-overflow-tooltip
              align="center"
              :formatter="formatTime"
            ></el-table-column>
            <el-table-column label="所属网格" align="center" prop="gridName">
              <template slot-scope="scope">
                <span>{{scope.row.gridName ? scope.row.gridName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.status == 0">待处理</span>
                  <span v-if="scope.row.status == 1">已处理</span>
                  <span v-if="scope.row.status == 2">完成</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.eventId)">删除</el-button>
                  <el-button type="secondBtn" @click="assgn(scope.row.eventId)">指派</el-button>
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
                <p class="lihead">事件信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">事件名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="eventName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.eventName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">事件类型：</span>
                    <div class="layoutBox">
                      <el-form-item prop="eventType">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.eventType"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">事件来源：</span>
                    <div class="layoutBox">
                      <el-form-item prop="eventSource">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.eventSource"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属河流：</span>
                    <div class="layoutBox">
                      <el-form-item prop="riverName">
                        <el-select
                          v-model="formData.riverName"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in riverArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">行政区划：</span>
                    <div class="layoutBox">
                      <el-form-item prop="areaName">
                        <el-select
                          v-model="formData.areaName"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in areaArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">河湖长：</span>
                    <div class="layoutBox">
                      <el-form-item prop="userId">
                        <el-select
                          v-model="formData.userId"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionRiver"
                            :key="item.riverName"
                            :label="item.riverName"
                            :value="item.riverName"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属网格：</span>
                    <div class="layoutBox">
                      <el-form-item prop="gridName">
                        <el-select
                          v-model="formData.gridName"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionGrid"
                            :key="item.gridName"
                            :label="item.gridName"
                            :value="item.gridName"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">事件状态：</span>
                    <div class="layoutBox">
                      <el-form-item prop="status">
                        <el-select
                          v-model="formData.status"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in optionStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">上报时间：</span>
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
                  <div class="formDiv formDivTl">
                    <span>备注：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.remark"
                        type="textarea"
                        :rows="4"
                      ></el-input>
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
    <el-dialog :visible.sync="visiDialogAss" width="920px" title="事件指派">
      <div class="secondary-page-mode" style="height:350px">
        <div class="secondary-toolbar">
          <span>行政区划:</span>
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
          <span>人员类型:</span>
          <div class="layoutBox" style="width:120px">
            <el-select v-model="value" placeholder="请选择" style="width:120px" size="small">
              <el-option
                v-for="item in optionData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>&emsp;&emsp;
          <span>人员名字 :</span>
          <div class="layoutBox">
            <el-input placeholder="请输入" v-model="searchModel" style="width:120px" size="small"></el-input>
          </div>&emsp;&emsp;
          <el-button>
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
        </div>
        <div class="currency-mode-wrap">
          <div class="el_table_box">
            <el-table border :data="tableData" height="100%">
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column label="网格人员姓名" show-overflow-tooltip width="200" align="center"></el-table-column>
              <el-table-column label="人员类型" width="140" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="所属网格" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button type="secondBtn">指派</el-button>
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
      ids: "",
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "事件新增",
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
        eventId: "",
        eventName: "", //事件名称
        eventType: "", //事件类型
        eventSource: "", //事件来源
        riverName: "", //河流名称
        areaId: "", //行政区划
        userId: "", //河湖长
        gridName: "", //网格名称
        remark: "", //备注
        status: "", //事件状态 0待处理 1已处理 2完成
        uploadTime: null,
        areaName: ""
      },
      rules: {
        eventName: [
          { required: true, message: "请输入事件名称", trigger: "blur" }
        ],
        eventType: [
          { required: true, message: "请输入事件类型", trigger: "blur" }
        ],
        eventSource: [
          { required: true, message: "请输入事件来源", trigger: "blur" }
        ],
        riverName: [
          { required: true, message: "请选择所属河流", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "请选择行政区划", trigger: "blur" }
        ],
        userId: [{ required: true, message: "请选择河湖长", trigger: "blur" }],
        gridName: [
          { required: true, message: "请选择所属网格", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择事件状态", trigger: "blur" }
        ],
        uploadTime: [
          { required: true, message: "请选择上报时间", trigger: "change" }
        ]
      },
      areaArr: [
        { label: "雄县", value: "0" },
        { label: "安新", value: "1" },
        { label: "容城", value: "2" }
      ],
      riverArr: [
        { label: "河流A", value: "0" },
        { label: "河流B", value: "1" },
        { label: "河流C", value: "2" }
      ],
      optionStatus: [
        { label: "待处理", value: 0 },
        { label: "已处理", value: 1 },
        { label: "完成", value: 2 }
      ],
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
      optionGrid: [],
      optionRiver: [],
      loading: true,
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.vTitle = "事件新增";
    this.init();
    this.searchData();
    this.getAreaTree();
  },
  methods: {
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "事件管理";
      let fieldList = [
        "eventName",
        "eventType",
        "eventSource",
        "uploadTime",
        "gridName",
        "status"
      ];
      let params = {
        headerProp: fieldList.join(","),
        keyword: this.searchModel,
        areaId: this.areaId,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/waterEventExcel",
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
        this.ids += arr[i].eventId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    formatTime(row) {
      if (row.uploadTime) {
        return new Date(row.uploadTime).format("yyyy-MM-dd");
      } else {
        return "-";
      }
    },
    init() {
      this.$http.get("/waterEnvXA/waterGrid").then(res => {
        this.loading = false;
        this.optionGrid = res.data.content.dataList;
      });
      this.$http.get("/waterEnvXA/waterLeader").then(res => {
        this.optionRiver = res.data.content.dataList;
      });
    },
    //事件指派
    assgn() {
      this.visiDialogAss = true;
    },
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/event", {
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
            if (this.formData.uploadTime != null) {
              this.formData.uploadTime = new Date(
                this.formData.uploadTime
              ).format("yyyy-MM-dd 00:00:00");
            }

            this.$http
              .put(
                "/waterEnvXA/event",
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
            if (this.formData.uploadTime != null) {
              this.formData.uploadTime = new Date(
                this.formData.uploadTime
              ).format("yyyy-MM-dd 00:00:00");
            }

            this.$http
              .post(
                "/waterEnvXA/event",
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
      this.vTitle = "事件编辑";
      this.visiDialog = true;
      this.formData.eventId = row.eventId;
      this.formData.eventName = row.eventName;
      this.formData.eventType = row.eventType;
      this.formData.eventSource = row.eventSource;
      this.formData.riverName = row.riverName;
      this.formData.areaName = row.areaName;
      this.formData.areaId = row.areaId;
      this.formData.userId = row.userId;
      this.formData.gridName = row.gridName;
      this.formData.remark = row.remark;
      this.formData.uploadTime = row.uploadTime;
      this.formData.status = row.status;
      if (this.formData.uploadTime != null) {
        this.formData.uploadTime = new Date(row.uploadTime).format(
          "yyyy-MM-dd"
        );
      } else {
        this.formData.uploadTime = null;
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.eventId = "";
      this.formData.eventName = "";
      this.formData.eventType = "";
      this.formData.eventSource = "";
      this.formData.riverName = "";
      this.formData.areaName = "";
      this.formData.areaId = null;
      this.formData.userId = "";
      this.formData.gridName = "";
      this.formData.remark = "";
      this.formData.status = "";
      this.formData.uploadTime = null;
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/event", id, this.searchData);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/event", this.ids, this.searchData);
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

<style lang="less" scoped>
</style>
