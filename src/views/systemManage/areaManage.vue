<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>关键字 :</span>
      <div class="layoutBox" style="width:220px">
        <el-input placeholder="请输入" v-model="searchModel"></el-input>
      </div>&emsp;&emsp;
      <el-button @click="getTableData">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="addData">
        <i class="iconfont icon-tianjia1"></i>新增
      </el-button>
      <el-button type="delet" @click="allDelet">
        <i class="iconfont icon-shanchu"></i>批量删除
      </el-button>
    </div>
    <div class="currency-mode-wrap">
      <el-table
        border
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
        height="100%"
        row-key="areaId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="areaName" label="区域名称"></el-table-column>
        <el-table-column prop="areaCode" label="区域编码"></el-table-column>
        <el-table-column prop="parentId" label="区域父编码"></el-table-column>
        <el-table-column prop="status" label="区域级别">
          <template slot-scope="scope">
            <div>{{scope.row.areaLevel.areaLevelName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="aimWaterLevel" label="水质目标等级"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="editorData(scope.row)">编辑</el-button>
              <el-button type="secondBtn" @click="delet(scope.row.areaId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total">
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
      </div>-->
    </div>
    <el-dialog :visible.sync="visiDialog_add" width="920px" title="区域新增" :before-close="closess">
      <div class="dialogcontent">
        <div class="dialog-layout">
          <el-form :model="formData" :rules="formRules" ref="form">
            <table class="whTable">
              <tr>
                <td width="16.5%">
                  <span class="rCode">区域名称</span>
                </td>
                <td>
                  <el-form-item prop="name">
                    <el-input placeholder="请输入" v-model="formData.name"></el-input>
                  </el-form-item>
                </td>
                <td width="16.5%">
                  <span class="rCode">区域编码</span>
                </td>
                <td>
                  <el-form-item prop="code">
                    <el-input placeholder="请输入" v-model="formData.code"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="16.5%">
                  <span class="rCode">区域级别</span>
                </td>
                <td>
                  <el-form-item prop="levelId">
                    <el-select v-model="formData.levelId" placeholder="请选择" @change="areaLevChange">
                      <el-option
                        v-for="item in areaLevData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td width="16.5%">
                  <span>父级区域</span>
                </td>
                <td>
                  <div style="margin-bottom:10px">
                    <el-select v-model="formData.fatherCode" placeholder="请选择">
                      <el-option
                        v-for="item in optionFarea"
                        :key="item.areaCode"
                        :label="item.areaName"
                        :value="item.areaCode"
                      ></el-option>
                    </el-select>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="16.5%">
                  <span class="rCode">水质目标等级</span>
                </td>
                <td>
                  <el-form-item prop="aimWaterLevel">
                    <el-select v-model="formData.aimWaterLevel" placeholder="请选择">
                      <el-option
                        v-for="item in targetLevelData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td width="16.5%">
                  <span class="rCode">排序</span>
                </td>
                <td>
                  <el-form-item prop="sort">
                    <el-input placeholder="请输入" v-model="formData.sort" type="number"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="16.5%">
                  <span>备注</span>
                </td>
                <td colspan="3">
                  <el-input placeholder="请输入" v-model="formData.remark"></el-input>
                </td>
              </tr>
            </table>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="submitForm('form')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="cancelForm('form')">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      searchModel: "",
      visiDialog_add: false,
      tableData: [],
      optionFarea: [],
      targetLevelData: [],
      formData: {
        code: "",
        name: "",
        fatherCode: "",
        levelId: "",
        remark: "",
        aimWaterLevel: "",
        sort: ""
      },
      formRules: {
        name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入区域编码", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        levelId: [
          { required: true, message: "请选择区域级别", trigger: "change" }
        ],
        aimWaterLevel: [
          { required: true, message: "请选择水质目标等级", trigger: "change" }
        ]
      },
      areaLevData: [
        {
          name: "省级",
          value: "ffbb7faf62044604b7fae55a75303c22"
        },
        {
          name: "市级",
          value: "ffbb7faf62044604b7fae55a75303c23"
        },
        {
          name: "区级",
          value: "ffbb7faf62044604b7fae55a75303c30"
        }
      ],
      loading: true,
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      isEditor: false,
      areaId: ""
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  inject: ["globelDelet"],
  methods: {
    selectChange(val, index) {
      let arr = val;
      this.areaId = "";
      for (let i in arr) {
        this.areaId += arr[i].areaId + ",";
      }
      this.areaId = this.areaId.substring(0, this.areaId.length - 1);
    },
    //删除
    delet(id) {
      this.globelDelet("/SiteManagement/area/delete", id, this.getTableData);
    },
    //批量删除
    allDelet() {
      this.globelDelet(
        "/SiteManagement/area/delete",
        this.areaId,
        this.getTableData
      );
    },
    init() {
      //获取水质目标等级下拉框数据
      this.$http.get("/SiteManagement/station/queryTargetLevel").then(res => {
        if (res.data.code == 0) {
          this.targetLevelData = res.data.content.dataList;
        }
      });
      this.getTableData();
    },
    //获取表格数据
    getTableData() {
      this.loading = true;

      this.$http
        .get("/SiteManagement/area/areaTree", {
          params: {
            name: this.searchModel
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;

            this.loading = false;
          }
        });
    },
    //新增弹框
    addData() {
      this.visiDialog_add = true;
      this.isEditor = false;
    },
    //提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            let params = {};
            params.name = this.formData.name;
            params.code = this.formData.code;
            params.fatherCode = this.formData.fatherCode;
            params.levelId = this.formData.levelId;
            params.aimWaterLevel = this.formData.aimWaterLevel;
            params.sort = this.formData.sort;
            params.remark = this.formData.remark;
            params.areaId = this.areaId;
            this.$http
              .post("/SiteManagement/area/addOrEdit", params)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1500
                  });
                  this.visiDialog_add = false;
                  this.resetForm(formName);
                  this.getTableData();
                }
              });
          } else {
            let params = {};
            params.name = this.formData.name;
            params.code = this.formData.code;
            params.fatherCode = this.formData.fatherCode;
            params.levelId = this.formData.levelId;
            params.aimWaterLevel = this.formData.aimWaterLevel;
            params.sort = this.formData.sort;
            params.remark = this.formData.remark;
            this.$http
              .post("/SiteManagement/area/addOrEdit", params)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1500
                  });
                  this.visiDialog_add = false;
                  this.resetForm(formName);
                  this.getTableData();
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.optionFarea = [];
      this.formData = {
        code: "",
        name: "",
        fatherCode: "",
        levelId: "",
        remark: "",
        aimWaterLevel: "",
        sort: ""
      };
    },
    //区域级别下拉框数据改变
    areaLevChange(v) {
      let lev = "";
      if (v == "ffbb7faf62044604b7fae55a75303c22") {
        this.optionFarea = [];
        return false;
      } else if (v == "ffbb7faf62044604b7fae55a75303c23") {
        lev = 1;
      } else if (v == "ffbb7faf62044604b7fae55a75303c30") {
        lev = 2;
      }
      this.$http
        .post(
          "/SiteManagement/area/query",
          this.paramsObj.GetPageData_P(
            "area",
            this.currentPage,
            this.pageSize,
            [lev],
            false
          )
        )
        .then(res => {
          if (res.data.code == 0) {
            this.optionFarea = res.data.content.dataList;
          }
        });
    },
    //编辑数据

    editorData(obj) {
      this.visiDialog_add = true;
      this.isEditor = true;
      this.areaId = obj.areaId;
      let lev = "";
      if (obj.areaLevel.areaLevelId == "ffbb7faf62044604b7fae55a75303c22") {
        this.optionFarea = [];
      } else if (
        obj.areaLevel.areaLevelId == "ffbb7faf62044604b7fae55a75303c23"
      ) {
        lev = 1;
        this.$http
          .post(
            "/SiteManagement/area/query",
            this.paramsObj.GetPageData_P(
              "area",
              this.currentPage,
              this.pageSize,
              [lev],
              false
            )
          )
          .then(res => {
            if (res.data.code == 0) {
              this.optionFarea = res.data.content.dataList;
            }
          });
      } else if (
        obj.areaLevel.areaLevelId == "ffbb7faf62044604b7fae55a75303c30"
      ) {
        lev = 2;
        this.$http
          .post(
            "/SiteManagement/area/query",
            this.paramsObj.GetPageData_P(
              "area",
              this.currentPage,
              this.pageSize,
              [lev],
              false
            )
          )
          .then(res => {
            if (res.data.code == 0) {
              this.optionFarea = res.data.content.dataList;
            }
          });
      }

      this.formData = {
        code: obj.areaCode,
        name: obj.areaName,
        fatherCode: obj.parentId,
        levelId: obj.areaLevel.areaLevelId,
        remark: obj.remark,
        aimWaterLevel: obj.aimWaterLevel,
        sort: obj.sort
      };
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.getTableData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.getTableData();
    },
    //关闭弹窗
    cancelForm(formName) {
      this.visiDialog_add = false;
      this.resetForm(formName);
    },
    closess(done) {
      done();
      this.resetForm("form");
    }
  },
  computed: {
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
}
</style>
