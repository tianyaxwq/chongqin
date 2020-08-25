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
        <!-- <span>审批时间 :</span>
        <div class="layoutBox" style="width: 300px">
          <sl-date-picker
            range-separator="至"
            v-model="value1"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></sl-date-picker>
        </div>&emsp;&emsp;-->
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input
            placeholder="请输入问题地点"
            v-model="searchModel"
            clearable
            style="width:220px"
            size="small"
          ></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
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
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="行政区划" show-overflow-tooltip align="center" prop="dist">
              <template slot-scope="scope">
                <span>{{scope.row.dist ? scope.row.dist : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="坑塘类型" show-overflow-tooltip align="center" prop="styp">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.styp == 0">水坑</span>
                  <span v-if="scope.row.styp == 1">干坑</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="问题地点" show-overflow-tooltip align="center" prop="proLoca">
              <template slot-scope="scope">
                <span>{{scope.row.proLoca ? scope.row.proLoca : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="估算面积（㎡）" show-overflow-tooltip align="center" prop="area">
              <template slot-scope="scope">
                <span>{{scope.row.area ? scope.row.area : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="估算体积（m³）" show-overflow-tooltip align="center" prop="vol">
              <template slot-scope="scope">
                <span>{{scope.row.vol ? scope.row.vol : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="酸碱性" show-overflow-tooltip align="center" prop="abp">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.abp == 0">酸性</span>
                  <span v-if="scope.row.abp == 1">碱性</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="其它特征污染物" show-overflow-tooltip align="center" prop="ocp">
              <template slot-scope="scope">
                <span>{{scope.row.ocp ? scope.row.ocp : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否通过验收" show-overflow-tooltip align="center" prop="acpt">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.styp == 0">否</span>
                  <span v-if="scope.row.styp == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">发布</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="信息发布" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">纳污坑塘基本信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span>编号：</span>
                    <div class="layoutBox">
                      <p>{{formData.poolCode}}</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>状态：</span>
                    <div class="layoutBox">
                      <p v-if="formData.status == 0">调查中</p>
                      <p v-if="formData.status == 1">完成</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>问题地点：</span>
                    <div class="layoutBox">
                      <p>{{formData.proLoca}}</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>所属河流：</span>
                    <div class="layoutBox">
                      <p>{{formData.riverName}}</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>行政区划：</span>
                    <div class="layoutBox">
                      <p>{{formData.areaName}}</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>来源：</span>
                    <div class="layoutBox">
                      <p>{{formData.source}}</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>提交人：</span>
                    <div class="layoutBox">
                      <p>{{formData.userName}}</p>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>上报时间：</span>
                    <div class="layoutBox">
                      <p>{{formData.uploadTime}}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submit('ruleForm')">发布</el-button>
        <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",
  components: { Treeselect },
  data() {
    return {
      value1: "",
      name: "",
      vTitle: "新增",
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
        poolId: "",
        poolCode: "", //编号
        status: "", //状态
        proLoca: "", //问题地点
        riverName: "", //所属河流
        areaName: "", //行政区划
        source: "", //来源
        userName: "", //提交人
        uploadTime: "" //上报时间
      },
      rules: {
        name: [{ required: true, message: "请输入养殖场名称", trigger: "blur" }]
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
    this.getAreaTree();
    let startTime = new Date(
      new Date().getTime() - 3600 * 1000 * 24 * 7
    ).format("yyyy-MM-dd");
    let endTime = new Date(new Date().getTime()).format("yyyy-MM-dd");
    this.value1 = [startTime, endTime];
    this.searchData();
  },
  methods: {
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "发布信息";
      let fieldList = [
        "dist",
        "styp",
        "proLoca",
        "area",
        "vol",
        "abp",
        "ocp",
        "acpt"
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
        "/waterEnvXA/exports/poolReleaseExcel",
        params
      );
    },
    getAreaTree() {
      this.$http.get("/dataHandle/yunliBase/getAreaTree", {}).then(res => {
        this.areaOptions = res.data.content.dataList;
      });
    },
    paginationSizeChange(n) {
      this.pageSize = n;
      this.searchData();
    },
    paginationChange(n) {
      this.currentPage = n;
      this.searchData();
    },
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/pool", {
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
      // if (this.value1[0] != null && this.value1[1] != null) {
      //   this.loading = true;
      //   this.$http
      //     .get("/waterEnvXA/pool", {
      //       params: {
      //         keyword: this.searchModel,
      //         pageNo: this.currentPage,
      //         pageSize: this.pageSize,
      //         startTime: this.value1[0],
      //         endTime: this.value1[1],
      //         areaId: this.areaId
      //       }
      //     })
      //     .then(res => {
      //       this.loading = false;
      //       this.tableData = res.data.content.dataList;
      //       this.totalRecords = res.data.content.totalRecords;
      //     });
      // } else {
      //   this.$message.error("请先选择时间查询");
      // }
    },
    //提交
    submit(formName) {
      let formData = new URLSearchParams();
      formData.append("id", this.formData.poolId);
      this.$http.put("/waterEnvXA/pool/publish", formData).then(res => {
        if (res.data.code == 0) {
          this.visiDialog = false;
          this.searchData();
          this.$message({
            message: res.data.message,
            type: "success",
            duration: 1000
          });
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
    //发布弹框
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.poolId = row.poolId;
      this.formData.poolCode = row.poolCode;
      this.formData.status = row.status;
      this.formData.proLoca = row.proLoca;
      this.formData.riverName = row.riverName;
      this.formData.areaName = row.dist;
      this.formData.source = row.source;
      this.formData.userName = row.userName;
      this.formData.uploadTime = row.uploadTime;
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
