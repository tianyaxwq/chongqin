<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>指令名称 :</span>&nbsp;
      <div class="layoutBox" style="width:120px">
        <el-select v-model="nameValue" filterable clearable placeholder="请选择" @change="nameChange">
          <el-option
            v-for="item in optionName"
            :key="item.instructionsId"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>指令类型 :</span>&nbsp;
      <div class="layoutBox" style="width:120px">
        <el-select v-model="typeValue" filterable clearable placeholder="请选择" @change="typeChange">
          <el-option
            v-for="item in optionType"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>指令编号 :</span>
      <div class="layoutBox" style="width:180px">
        <el-input placeholder="请输入" v-model="codeValue"></el-input>
      </div>
&emsp;&emsp;
      <el-button @click="searchInst">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="openDialog">
        <i class="iconfont icon-tianjia"></i>新增
      </el-button>
      <el-button type="delet" @click="InstDeletAll">
        <i class="iconfont icon-shanchu"></i>批量删除
      </el-button>
    </div>
    <div class="currency-mode-wrap">
      <el-table
        border
        :data="tableData"
        height="calc(100% - 37px)"
        @selection-change="instSelectChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="指令名称"></el-table-column>
        <el-table-column prop="code" label="指令编号"></el-table-column>
        <el-table-column prop="numbers" label="指令序号"></el-table-column>
        <el-table-column prop="instructionsType_name" label="指令类型"></el-table-column>
        <el-table-column prop="contenttemplate" label="内容模板"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="editorInst(scope.row)">编辑</el-button>
              <el-button type="secondBtn" @click="deletInst(scope.row.instructionsId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination-wrap">
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
          :total="total"
        >
          <template v-slot:default>
            <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
          </template>
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="visiDialog" width="650px" :title="instMes" :before-close="instClose">
      <div class="dialogcontent">
        <div class="dialog-layout">
          <el-form :model="instObj" :rules="instRules" ref="instForm">
            <ul class="formul">
              <li>
                <div style="margin-right:42px">
                  <span class="layoutspan">指令名称 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="instName">
                      <el-input placeholder="请输入" v-model="instObj.instName"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div>
                  <span class="layoutspan">指令类型 :</span>&nbsp;
                  <div class="layoutBox" style="width:150px">
                    <el-form-item prop="instType">
                      <el-select
                        v-model="instObj.instType"
                        placeholder="请选择"
                        filterable
                        @change="instTypeChange"
                      >
                        <el-option
                          v-for="item in optionType"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="layoutBox" style="width:50px;vertical-align: -1px;">
                    <el-button @click="visiDialog_editor=true">编辑</el-button>
                  </div>
                </div>
              </li>
              <li>
                <div style="margin-right:42px">
                  <span class="layoutspan">指令编号 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="instCode">
                      <el-input placeholder="请输入" v-model="instObj.instCode"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div>
                  <span class="layoutspan">指令序号 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="instSerial">
                      <el-input placeholder="请输入" v-model="instObj.instSerial" type="number"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>

              <li>
                <div class="uploaddiv">
                  <span class="layoutspan">内容模板 :</span>
                  <div class="layoutBox" style="width:98%">
                    <el-form-item prop="instContent">
                      <el-input
                        v-model="instObj.instContent"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        resize="none"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="instSave('instForm')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="instClose">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="visiDialog_editor" width="750px" title="指令类型" :before-close="closess">
      <div class="dialogcontent">
        <div style="margin-bottom:12px">
          <el-button @click="visiDialog_add=true">
            <i class="iconfont icon-tianjia1"></i>新增
          </el-button>
          <el-button type="delet" @click="InstTypeDeletAll">
            <i class="iconfont icon-shanchu"></i>批量删除
          </el-button>
        </div>
        <el-table
          border
          :data="optionType"
          height="300px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="指令类型名称"></el-table-column>
          <el-table-column prop="code" label="指令类型编号"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div>
                <el-button type="secondBtn" @click="InstTypeEditor(scope.row)">编辑</el-button>
                <el-button type="secondBtn" @click="InstTypeDelet(scope.row.instructionsTypeId)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="visiDialog_add"
      width="360px"
      title="指令类型新增"
      :before-close="InstTypeClose"
    >
      <div class="dialogcontent">
        <div class="dialog-layout">
          <el-form :model="addInstObj" :rules="typeRules" ref="typeForm">
            <ul class="formul">
              <li>
                <div style="width:100%">
                  <span class="layoutspan">指令类型名称 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="TypeName">
                      <el-input v-model="addInstObj.TypeName"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>
              <li>
                <div style="width:100%">
                  <span class="layoutspan">指令类型编码 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="TypeCode">
                      <el-input v-model="addInstObj.TypeCode"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="InstTypeSave('typeForm')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="InstTypeClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      value: "",
      visiDialog: false,
      visiDialog_editor: false, //协议类型表格框
      visiDialog_add: false, //协议类型新增编辑弹框
      dateRange: [],
      tableData: [],
      optionName: [],
      optionType: [],
      nameValue: "",
      typeValue: "",
      codeValue: "",
      instObj: {
        instName: "",
        instType: "",
        instCode: "",
        instSerial: "",
        instContent: ""
      }, //指令新增字段名

      instRules: {
        instName: [
          { required: true, message: "请输入指令名称", trigger: "blur" }
        ],
        instType: [
          { required: true, message: "请选择指令类型", trigger: "change" }
        ],
        instCode: [
          { required: true, message: "请输入指令编号", trigger: "blur" }
        ],
        instSerial: [
          { required: true, message: "请输入指令序号", trigger: "blur" }
        ],
        instContent: [
          { required: true, message: "请输入内容模板", trigger: "blur" }
        ]
      },
      addInstObj: {
        TypeName: "",
        TypeCode: "",
        TypeId: ""
      }, //指令类型新增字段名
      typeRules: {
        TypeName: [
          { required: true, message: "请输入指令类型名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        TypeCode: [
          { required: true, message: "请输入指令类型编码", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      }, //指令类型新增验证
      typeInstId: "",
      InstId: "",
      typeInstObj: {},
      instMes: "指令新增",
      isEditor: false,
      instructionsId: "",
      instructionsType_instructionsTypeId: "",
      instructionsType_code: "",
      currentPage: 1, //分页组件当前页
      total: 200, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20] //设置每页多少条
    };
  },
  inject: ["globelDelet"],
  created() {
    this.$store.commit("setShowlefttree", false);
    this.getInstName();
    this.getInstType();
    this.getInstTable();
  },
  mounted() {},
  methods: {
    selectChange(arr) {},
    nameChange(v) {
      if (v == null) {
        this.nameValue = "";
      }
      this.getInstTable();
    },
    typeChange(v) {
      if (v == null) {
        this.typeValue = "";
      }
      this.getInstTable();
    },
    closess(done) {
      done();
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.getInstTable();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.getInstTable();
    },
    //编辑指令
    editorInst(v) {
      this.visiDialog = true;
      this.isEditor = true;
      this.instMes = "指令编辑";
      this.instructionsId = v.instructionsId;
      this.instructionsType_instructionsTypeId =
        v.instructionsType_instructionsTypeId;
      for (let i in this.optionType) {
        if (v.instructionsType_name == this.optionType[i].name) {
          this.instructionsType_code = this.optionType[i].code;
        }
      }
      this.instructionsType_code;
      this.instObj = {
        instName: v.name,
        instType: v.instructionsType_name,
        instCode: v.code,
        instSerial: v.numbers,
        instContent: v.contenttemplate
      };
    },
    //删除指令
    deletInst(id) {
      this.globelDelet("/httpApi/instructions/delete", id, this.getInstTable);
    },
    openDialog() {
      this.visiDialog = true;
      this.isEditor = false;
      this.instMes = "指令新增";
      this.clearInst();
    },
    //获取指令名称
    getInstName() {
      this.$http
        .post(
          "/httpApi/instructions/query",
          this.paramsObj.GetData_P("instructionsId,name,code")
        )
        .then(res => {
          if (res.data.code == 0) {
            this.optionName = res.data.content.dataList;
          }
        });
    },
    //获取指令类型
    getInstType() {
      this.$http
        .post(
          "/httpApi/instructionsType/query",
          this.paramsObj.GetData_P("instructionsTypeId,name,code")
        )
        .then(res => {
          if (res.data.code == 0) {
            this.optionType = res.data.content.dataList;
          }
        });
    },
    //查询表格
    searchInst() {
      this.getInstTable();
    },
    //获取指令表格数据
    getInstTable() {
      this.$http
        .post(
          "/httpApi/instructions/query",
          this.paramsObj.GetPageData_P(
            "instManage",
            this.currentPage,
            this.pageSize,
            [this.nameValue, this.typeValue, this.codeValue],
            true
          )
        )
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.total = res.data.content.totalRecords;
            this.getInstName();
          }
        });
    },
    //指令新增
    instSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsObj = {};
          if (this.isEditor) {
            paramsObj = {
              code: this.instObj.instCode, //指令编号
              contenttemplate: this.instObj.instContent, //内容模板
              instructionsType: {
                code: this.instructionsType_code, // 指令类型编号
                instructionsTypeId: this.instructionsType_instructionsTypeId, // 指令类型ID
                name: this.instObj.instType // 指令类型名称
              },
              instructionsId: this.instructionsId,
              name: this.instObj.instName, // 指令名称
              numbers: this.instObj.instSerial // 指令序号
            };
          } else {
            paramsObj = {
              code: this.instObj.instCode, //指令编号
              contenttemplate: this.instObj.instContent, //内容模板
              instructionsType: this.typeInstObj,
              name: this.instObj.instName, // 指令名称
              numbers: this.instObj.instSerial // 指令序号
            };
          }

          this.$http.post("/httpApi/instructions/edit", paramsObj).then(res => {
            if (res.data.code == 0) {
              this.visiDialog = false;
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 700
              });
              this.getInstTable();
              this.resetForm("instForm");
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
                duration: 700
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    clearInst() {
      this.instructionsId = "";
      this.instructionsType_code = "";
      this.instructionsType_instructionsTypeId = "";
      this.instObj = {
        instName: "",
        instType: "",
        instCode: "",
        instSerial: "",
        instContent: ""
      };
    },
    //指令新增弹框内指令类型选择
    instTypeChange(v) {
      for (let i in this.optionType) {
        if (v == this.optionType[i].name) {
          this.typeInstObj = {
            code: this.optionType[i].code,
            instructionsTypeId: this.optionType[i].instructionsTypeId,
            name: this.optionType[i].name
          };
        }
      }
    },
    //指令框关闭
    instClose() {
      this.visiDialog = false;
      this.resetForm("instForm");
    },
    //指令类型新增
    InstTypeSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/httpApi/instructionsType/edit", {
              code: this.addInstObj.TypeCode,
              name: this.addInstObj.TypeName,
              protocolTypeId: this.addInstObj.TypeId
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 700
                });
                this.getInstType();
                this.visiDialog_add = false;
                this.resetForm("typeForm");
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  duration: 700
                });
              }
            });
        } else {
          return false;
        }
      });

      // this.visiDialog_add=false;
    },
    //指令类型删除
    InstTypeDelet(id) {
      this.globelDelet(
        "/httpApi/instructionsType/delete",
        id,
        this.getInstType
      );
    },
    //指令类型批量删除
    InstTypeDeletAll() {
      this.globelDelet(
        "/httpApi/instructionsType/delete",
        this.typeInstId,
        this.getInstType
      );
    },
    //指令类型表格勾选事件
    handleSelectionChange(val, index) {
      let arr = val;
      this.typeInstId = "";
      for (let i in arr) {
        this.typeInstId += arr[i].instructionsTypeId + ",";
      }
      this.typeInstId = this.typeInstId.substring(
        0,
        this.typeInstId.length - 1
      );
    },
    instSelectChange(val, index) {
      let arr = val;
      this.InstId = "";
      for (let i in arr) {
        this.InstId += arr[i].instructionsId + ",";
      }
      this.InstId = this.InstId.substring(0, this.InstId.length - 1);
    },
    //指令批量删除
    InstDeletAll() {
      this.globelDelet(
        "/httpApi/instructions/delete",
        this.InstId,
        this.getInstTable
      );
    },
    //协议类型新增关闭
    InstTypeClose() {
      this.visiDialog_add = false;
      this.resetForm("typeForm");
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
.dialogcontent .uploaddiv {
  padding-left: 72px;
}
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}
</style>
