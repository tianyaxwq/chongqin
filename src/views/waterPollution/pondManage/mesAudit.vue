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
        <!-- <span>审核时间 :</span>
        <div class="layoutBox" style="width: 300px">
          <sl-date-picker
            range-separator="至"
            v-model="value1"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></sl-date-picker>
        </div>&emsp;&emsp; -->
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
            ref="table"
            height="100%"
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
                  <el-button type="secondBtn" @click="revise(scope.row)">审核</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="审核" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">审核</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">审核意见：</span>
                    <div class="layoutBox">
                      <el-form-item prop="verifyFlag">
                        <el-radio v-model="formData.verifyFlag" :label="0">同意</el-radio>
                        <el-radio v-model="formData.verifyFlag" :label="1">驳回</el-radio>
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
                        :rows="3"
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
        verifyFlag: "",
        remark: "",
        poolId: ""
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
        verifyFlag: [
          { required: true, message: "请选择审批意见", trigger: "blur" }
        ]
      },
      loading: true,
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
      let title = "信息审核";
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
        "/waterEnvXA/exports/poolAuditExcel",
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new URLSearchParams();
          formData.append("verifyFlag", this.formData.verifyFlag);
          formData.append("remark", this.formData.remark);
          formData.append("id", this.formData.poolId);
          this.$http.put("/waterEnvXA/pool/verify", formData).then(res => {
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
          return false;
        }
      });
    },
    //取消
    cancel(formName) {
      this.visiDialog = false;
      this.resetForm(formName);
      this.remark = "";
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
      this.formData.poolId = row.poolId;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
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

<style lang="less" scoped>
.dialogcontent {
  .formDiv {
    width: 100%;
  }
}
</style>
