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
            placeholder="请输入网格名称"
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
              label="网格名称"
              width="290"
              show-overflow-tooltip
              align="center"
              prop="gridName"
            >
              <template slot-scope="scope">
                <span>{{scope.row.gridName ? scope.row.gridName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="网格编号" align="center" prop="gridCode">
              <template slot-scope="scope">
                <span>{{scope.row.gridCode ? scope.row.gridCode : '--'}}</span>
              </template>
            </el-table-column>

            <el-table-column label="行政区划" show-overflow-tooltip align="center" prop="areaName">
              <template slot-scope="scope">
                <span>{{scope.row.areaName ? scope.row.areaName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="河湖长" show-overflow-tooltip align="center" prop="userId">
              <template slot-scope="scope">
                <span>{{scope.row.userId ? scope.row.userId : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所含河流" show-overflow-tooltip align="center" prop="riverName">
              <template slot-scope="scope">
                <span>{{scope.row.riverName ? scope.row.riverName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.gridId)">删除</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="网格新增" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">网格信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">网格名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="gridName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.gridName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">网格编号：</span>
                    <div class="layoutBox">
                      <el-form-item prop="gridCode">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.gridCode"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>所含河流：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.riverName"
                          placeholder="请选择"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in riverArr"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>网格选择：</span>
                    <div class="layoutBox" style="width:185px">
                      <el-input
                        placeholder="请选择"
                        v-model="formData.gisDataId"
                        disabled
                        size="small"
                        style="width:185px"
                      ></el-input>
                    </div>
                    <div class="layoutBox" style="width:50px">
                      <el-button @click="visiDialogGrid=true">选择</el-button>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>行政区划：</span>
                    <div class="layoutBox">
                      <treeselect
                        :normalizer="normalizer"
                        style="margin-bottom:-12px;border-radius: 0px;height:30px;"
                        :disable-branch-nodes="true"
                        placeholder="请选择"
                        v-model="formData.areaId"
                        :multiple="false"
                        :options="areaOptions"
                      />
                    </div>
                  </div>
                  <!-- <div class="formDiv">
                    <span>河湖长：</span>
                    <div class="layoutBox">
                      <el-select v-model="formData.userId" placeholder="请选择" multiple collapse-tags style="width:255px">
                        <el-option
                          v-for="item in optionData"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>-->
                  <div class="formDiv">
                    <span>环境数据接入：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.source" style="width:255px"></el-input>
                      <!-- <el-select v-model="value" placeholder="请选择" size="small" style="width:255px">
                        <el-option
                          v-for="item in optionData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>-->
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
    <el-dialog :visible.sync="visiDialogGrid" width="800px" title="网格选择">
      <div class="gridBox clearfix">
        <div class="lBox tree_content">
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
        <div class="rBox"></div>
      </div>

      <div slot="footer">
        <el-button @click="visiDialogGrid=false">确认</el-button>
        <el-button type="noticonsecondBtn" @click="visiDialogGrid=false">取消</el-button>
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
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      defaultId: "1",
      treeData: [
        {
          nodeName: "雄安新区",
          nodeId: 0,
          structureType: "1",
          children: [
            {
              nodeName: "雄县",
              structureType: "2",
              nodeId: 1
            },
            {
              nodeName: "安新县",
              structureType: "2",
              nodeId: 2
            },
            {
              nodeName: "容城县",
              structureType: "2",
              nodeId: 3
            }
          ]
        }
      ],
      visiDialogGrid: false,
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
        gridName: "",
        gridCode: "",
        gridId: "",
        gisDataId: "",
        riverName: "",
        areaId: null,
        userId: [],
        source: "",
        remark: ""
      },
      rules: {
        gridName: [
          { required: true, message: "请输入网格名称", trigger: "blur" }
        ],
        gridCode: [
          { required: true, message: "请输入网格编号", trigger: "blur" }
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
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "网格管理";
      let fieldList = [
        "gridName",
        "gridCode",
        "areaName",
        "userId",
        "riverName"
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
        "/waterEnvXA/exports/waterGridExcel",
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
        this.ids += arr[i].gridId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    setGrid() {
      this.visiDialogGrid = true;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey("1");
      });
    },
    treeNodeclick() {},
    paginationSizeChange(v) {
      this.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.searchData();
    },
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/waterGrid", {
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
            this.$http
              .put(
                "/waterEnvXA/waterGrid",
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
                "/waterEnvXA/waterGrid",
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
      this.formData.gridName = "";
      this.formData.gridCode = "";
      this.formData.gridId = "";
      this.formData.riverName = "";
      this.formData.areaId = null;
      // this.formData.userId=[];
      this.formData.source = "";
      this.formData.remark = "";
    },
    //修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.gridName = row.gridName;
      this.formData.gridCode = row.gridCode;
      this.formData.gridId = row.gridId;
      this.formData.riverName = row.riverName;
      this.formData.areaId = row.areaId;
      // if(this.formData.userId){
      //    this.formData.userId=row.userId.split(',');
      // }else{
      //    this.formData.userId=[];
      // }

      this.formData.source = row.source;
      this.formData.remark = row.remark;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/waterGrid", id, this.searchData);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/waterGrid", this.ids, this.searchData);
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
