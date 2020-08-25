<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>协议名称 :</span>&nbsp;
      <div class="layoutBox" style="width:120px">
        <el-select v-model="nameValue" filterable placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in optionName"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>协议类型 :</span>&nbsp;
      <div class="layoutBox" style="width:120px">
        <el-select v-model="typeValue" filterable placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in optionType"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>协议编号 :</span>
      <div class="layoutBox" style="width:180px">
        <el-input placeholder="请输入"></el-input>
      </div>&emsp;&emsp;
      <span>发布日期 :</span>&nbsp;
      <div class="layoutBox" style="width:242px">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>&emsp;&emsp;
      <el-button>
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="addAgree">新增</el-button>
      <el-button type="delet" @click="allagreeDelet">批量删除</el-button>
    </div>
    <div class="currency-mode-wrap">
      <el-table border :data="tableData" height="100%" @selection-change="agreetableChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div style="padding-left:235px">
              <p style="text-align:left;margin-bottom:8px">版本信息 :</p>
              <el-table border :data="scope.row.protocol_file">
                <el-table-column label="发布日期" prop="publishedDate" width="200px"></el-table-column>
                <el-table-column label="文件" prop="url"></el-table-column>
                <el-table-column label="操作" width="200px">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="secondBtn" @click="downFile(scope.row.url)">下载</el-button>
                      <el-button type="secondBtn" @click="lookupFile(scope.row.url)">查看</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="protocol_name" label="协议名称"></el-table-column>
        <el-table-column prop="protocol_code" label="协议编号"></el-table-column>
        <el-table-column prop="protocol_protocolType_name" label="协议类型"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="agreeEditor(scope.row)">编辑</el-button>
              <el-button type="secondBtn" @click="agreeDelet(scope.row.protocol_protocolId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="visiDialog" width="650px" :title="agreeTxt" :before-close="closess">
      <div class="dialogcontent">
        <div class="dialog-layout agreePage">
          <el-form :model="agreeObj" :rules="agreeRules" ref="agreeForm">
            <ul class="formul">
              <li>
                <div style="margin-right:42px">
                  <span class="layoutspan">协议名称 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="nameValue">
                      <el-input placeholder="请输入" v-model="agreeObj.nameValue"></el-input>
                      <!-- <el-select v-model="agreeObj.nameValue" placeholder="请输入或选择"  filterable allow-create default-first-option>
                                          <el-option
                                            v-for="item in optionName"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.name">
                                          </el-option>
                      </el-select>-->
                    </el-form-item>
                  </div>
                </div>
                <div>
                  <span class="layoutspan">协议类型 :</span>&nbsp;
                  <div class="layoutBox" style="width:150px">
                    <el-form-item prop="typeValue">
                      <el-select v-model="agreeObj.typeValue" placeholder="请选择" filterable>
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
                  <span class="layoutspan">协议编号 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="codeValue">
                      <el-input placeholder="请输入" v-model="agreeObj.codeValue"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div>
                  <span class="layoutspan">协议序号 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="numberValue">
                      <el-input placeholder="请输入" v-model="agreeObj.numberValue" type="number"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>
              <li>
                <div style="margin-right:42px">
                  <span class="layoutspan">版本信息 :</span>&nbsp;
                  <div class="layoutBox">
                    <el-button @click="addEdition">添加</el-button>
                  </div>
                </div>
              </li>
              <li>
                <el-table border :data="editionTable">
                  <el-table-column prop="mn" width="120" label="发布日期">
                    <template slot-scope="scope">
                      <div :class="scope.row.dateEmpty?'empty':''">
                        <el-date-picker
                          v-model="scope.row.publishedDate"
                          type="year"
                          @change="yearChange(scope.$index)"
                          value-format="yyyy"
                          placeholder="选择年"
                        ></el-date-picker>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mn" label="协议内容">
                    <template slot-scope="scope">
                      <div>
                        <el-upload
                          class="upload-demo"
                          :limit="1"
                          :ref="upload(scope.$index)"
                          :on-change="function(files,fileList){return fileChange(files,fileList,scope.$index)}"
                          action="/httpApi/protocol/editProtocol"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :file-list="scope.row.file"
                          :http-request="function(files){return uploadFile(files,scope.$index)}"
                          :auto-upload="false"
                        >
                          <el-button slot="trigger">
                            <i class="icon-shangchuan1 iconfont"></i>选择文件
                          </el-button>
                        </el-upload>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="操作">
                    <template slot-scope="scope">
                      <div>
                        <el-button
                          type="secondBtn"
                          @click="editionDelet(scope.row.id,scope.$index)"
                        >删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </li>
            </ul>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="saveClick('agreeForm')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="agreeClose">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="visiDialog_editor" width="750px" title="协议类型" :before-close="closess">
      <div class="dialogcontent">
        <div style="margin-bottom:12px">
          <el-button @click="visiDialog_add=true">
            <i class="iconfont icon-tianjia1"></i>新增
          </el-button>
          <el-button type="delet" @click="agreeTypeDeletAll">
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
          <el-table-column prop="name" label="协议类型名称"></el-table-column>
          <el-table-column prop="code" label="协议类型编号"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div>
                <el-button type="secondBtn" @click="agreeTypeEditor(scope.row)">编辑</el-button>
                <el-button type="secondBtn" @click="agreeTypeDelet(scope.row.protocolTypeId)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="visiDialog_add"
      width="360px"
      title="协议类型新增"
      :before-close="agreeTypeClose"
    >
      <div class="dialogcontent">
        <div class="dialog-layout">
          <el-form :model="addAgreeObj" :rules="typeRules" ref="typeForm">
            <ul class="formul">
              <li>
                <div style="width:100%">
                  <span class="layoutspan">协议类型名称 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="TypeName">
                      <el-input v-model="addAgreeObj.TypeName"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>
              <li>
                <div style="width:100%">
                  <span class="layoutspan">协议类型编码 :</span>&nbsp;
                  <div class="layoutBox" style="width:200px">
                    <el-form-item prop="TypeCode">
                      <el-input v-model="addAgreeObj.TypeCode"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="agreeTypeSave('typeForm')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="agreeTypeClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  inject: ["globelDelet"],
  data() {
    return {
      value: "",
      fileList: [],
      visiDialog: false,
      visiDialog_editor: false, //协议类型表格框
      visiDialog_add: false, //协议类型新增编辑弹框
      editionTable: [{ id: "", publishedDate: "", file: [], dateEmpty: false }], //弹框内版本信息table
      dateRange: [],
      tableData: [],
      name: "name",
      nameValue: "", //协议名称
      typeValue: "", //协议类型
      optionName: [],
      optionType: [],
      optionData: [],
      agreeTxt: "协议新增",
      agreeObj: {
        nameValue: "",
        typeValue: "",
        codeValue: "",
        numberValue: ""
      }, //协议新增字段名

      agreeRules: {
        nameValue: [
          { required: true, message: "请输入或选择协议名称", trigger: "blur" }
        ],
        typeValue: [
          { required: true, message: "请选择协议类型", trigger: "change" }
        ],
        codeValue: [
          { required: true, message: "请输入协议编号", trigger: "blur" }
        ],
        numberValue: [
          { required: true, message: "请输入协议序号", trigger: "blur" }
        ]
      },
      addAgreeObj: {
        TypeName: "",
        TypeCode: "",
        TypeId: ""
      }, //协议类型新增字段名
      typeRules: {
        TypeName: [
          { required: true, message: "请输入协议类型名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        TypeCode: [
          { required: true, message: "请输入协议类型编码", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      }, //协议类型新增验证
      typeAgreeId: "",
      agreeId: "",
      protocolId: "",
      isEdit: false,
      file: null,
      formData: null
    };
  },
  created() {
    this.getAgreeName();
    this.getAgreeType();
    this.getAgreeTable();
  },
  mounted() {},
  methods: {
    addAgree() {
      this.visiDialog = true;
      this.agreeTxt = "协议新增";
      this.isEdit = false;
      this.agreeObj = {
        nameValue: "",
        typeValue: "",
        codeValue: ""
      };
      this.protocolId = "";
      this.editionTable = [
        { id: "", publishedDate: "", file: [], dateEmpty: false }
      ];
    },
    //协议编辑
    agreeEditor(obj) {
      this.visiDialog = true;
      this.agreeTxt = "协议编辑";
      this.isEdit = true;
      this.agreeObj = {
        nameValue: obj.protocol_name,
        typeValue: obj.protocol_protocolType_name,
        codeValue: obj.protocol_code,
        numberValue: obj.protocol_numbers
      };
      this.protocolId = obj.protocol_protocolId;
      this.editionTable = [];
      for (let i = 0; i < obj.protocol_file.length; i++) {
        this.editionTable.push({
          id: obj.protocol_file[i].id,
          publishedDate: obj.protocol_file[i].publishedDate,
          file: [{ name: obj.protocol_file[i].url }],
          dateEmpty: false
        });
      }
    },
    //下载文件
    downFile(url) {
      window.open(
        "/httpApi/file/download?isOnLine=false&fileUrl=" +
          encodeURIComponent(url) +
          ""
      );
    },
    lookupFile(url) {
      window.open(
        "/httpApi/file/download?isOnLine=true&fileUrl=" +
          encodeURIComponent(url) +
          ""
      );
    },
    upload(key) {
      return "upload" + key;
    },
    yearChange(key) {
      if (this.editionTable[key].publishedDate != "") {
        this.editionTable[key].dateEmpty = false;
      } else {
        this.editionTable[key].dateEmpty = true;
      }
    },
    //获取协议名称
    getAgreeName() {
      this.$http
        .post("/httpApi/protocol/query", this.paramsObj.GetData_P("name,code"))
        .then(res => {
          if (res.data.code == 0) {
            this.optionName = res.data.content.dataList;
          }
        });
    },
    //获取协议类型
    getAgreeType() {
      this.$http
        .post(
          "/httpApi/protocolType/query",
          this.paramsObj.GetData_P("protocolTypeId,name,code")
        )
        .then(res => {
          if (res.data.code == 0) {
            this.optionType = res.data.content.dataList;
          }
        });
    },
    //获取协议表格数据
    getAgreeTable() {
      this.$http
        .post(
          "/httpApi/protocolData/query",
          this.paramsObj.GetPageData_P("agreeMange", 1, 20, ["", "", ""], false)
        )
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.getAgreeName();
          }
        });
    },
    //协议类型新增
    agreeTypeSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/httpApi/protocolType/edit", {
              code: this.addAgreeObj.TypeCode,
              name: this.addAgreeObj.TypeName,
              protocolTypeId: this.addAgreeObj.TypeId
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
                this.getAgreeType();
                this.visiDialog_add = false;
                this.resetForm("typeForm");
              }
            });
        } else {
          return false;
        }
      });

      // this.visiDialog_add=false;
    },
    //协议类型删除
    agreeTypeDelet(id) {
      this.globelDelet("/httpApi/protocolType/delete", id, this.getAgreeType);
    },
    //协议删除
    agreeDelet(id) {
      this.globelDelet("/httpApi/protocol/delete", id, this.getAgreeTable);
    },
    allagreeDelet() {
      this.globelDelet(
        "/httpApi/protocol/delete",
        this.agreeId,
        this.getAgreeTable
      );
    },
    //协议类型批量删除
    agreeTypeDeletAll() {
      this.globelDelet(
        "/httpApi/protocolType/delete",
        this.typeAgreeId,
        this.getAgreeType
      );
    },
    //协议类型表格勾选事件
    handleSelectionChange(val, index) {
      this.typeAgreeId = "";
      let arr = val;
      for (let i in arr) {
        this.typeAgreeId += arr[i].protocolTypeId + ",";
      }
      this.typeAgreeId = this.typeAgreeId.substring(
        0,
        this.typeAgreeId.length - 1
      );
    },
    agreetableChange(val, index) {
      this.agreeId = "";
      let arr = val;
      for (let i in arr) {
        this.agreeId += arr[i].protocol_protocolId + ",";
      }
      this.agreeId = this.agreeId.substring(0, this.agreeId.length - 1);
    },
    //协议类型新增关闭
    agreeTypeClose() {
      this.visiDialog_add = false;
      this.resetForm("typeForm");
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    agreeClose() {
      this.resetForm("agreeForm");
      this.visiDialog = false;
    },
    selectChange(arr) {},
    closess(done) {
      done();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    fileChange(files, fileList, a) {
      this.editionTable[a].file = fileList;
      this.file = files;
    },
    uploadFile(file, key) {
      this.formData.append("files[" + key + "]", file.file);
    },
    //添加版本
    addEdition() {
      for (let i = 0; i < this.editionTable.length; i++) {
        if (!this.editionTable[i].publishedDate) {
          return false;
        }
      }
      this.editionTable.push({
        id: "",
        publishedDate: "",
        file: [],
        dateEmpty: false
      });
    },
    //保存
    saveClick(formName) {
      //this.visiDialog = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formData = new FormData();

          for (let i = 0; i < this.editionTable.length; i++) {
            if (!this.editionTable[i].publishedDate) {
              this.editionTable[i].dateEmpty = true;

              return false;
            } else {
              this.editionTable[i].dateEmpty = false;
            }
            this.formData.append(
              "protocolDataIds[" + i + "]",
              this.editionTable[i].id
            );
            this.formData.append(
              "publishedDates[" + i + "]",
              this.editionTable[i].publishedDate
            );
          }
          for (let i = 0; i < this.editionTable.length; i++) {
            this.$refs["upload" + i + ""].submit();
          }
          this.formData.append("code", this.agreeObj.codeValue);
          this.formData.append("name", this.agreeObj.nameValue);
          this.formData.append("numbers", this.agreeObj.numberValue);
          this.formData.append("protocolId", this.protocolId);
          let obj = {};
          for (let i = 0; i < this.optionType.length; i++) {
            if (this.agreeObj.typeValue == this.optionType[i].name) {
              obj = this.optionType[i];
            }
          }
          this.formData.append("protocolTypeCode", obj.code);
          this.formData.append("protocolTypeName", obj.name);
          this.formData.append("protocolTypeIds", obj.protocolTypeId);
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.$http
            .post("/httpApi/protocol/editProtocol", this.formData, config)
            .then(res => {
              if (res.data.code == 0) {
                this.visiDialog = false;

                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
                this.getAgreeTable();
                this.getAgreeName();
                this.resetForm("agreeForm");
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  duration: 1500
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    //版本信息删除
    editionDelet(id, index) {
      if (this.isEdit) {
        let self = this;
        this.globelDelet("/httpApi/protocolData/delete", id, function(index) {
          if (self.editionTable.length == 1) {
            return false;
          }
          self.editionTable.splice(index, 1);
          self.getAgreeTable();
        });
      } else {
        if (this.editionTable.length == 1) {
          this.$message({
            message: "必须保留至少一条版本信息",
            type: "warning",
            duration: 1500
          });
          return false;
        }
        this.editionTable.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
}
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}
</style>
