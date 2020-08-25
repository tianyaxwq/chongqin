<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>关键字:</span>&nbsp;
      <div class="layoutBox">
        <el-input placeholder="请输入事件名称" clearable v-model="queryPrams.title"></el-input>
      </div>&emsp;&emsp;
      <span>事件类型 :</span>
      <div class="layoutBox">
        <el-select v-model="queryPrams.type" filterable clearable placeholder="请选择">
          <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>事件等级 :</span>
      <div class="layoutBox">
        <el-select v-model="queryPrams.grade" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in grades"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <el-button @click="search">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="openDialog">
        <i class="iconfont icon-tianjia"></i>新增
      </el-button>
      <el-button type="delet" @click="allDelet">
        <i class="iconfont icon-shanchu"></i>批量删除
      </el-button>
      <el-button type="delet" @click="exportExcel">
        <i class="iconfont icon-daochu"></i>导出
      </el-button>
    </div>
    <div class="currency-mode-wrap">
      <el-table
        border
        :data="tableData"
        v-loading="loading"
        ref="table"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        height="calc(100% - 37px)"
        element-loading-background="rgba(255, 255, 255, 1)"
        @selection-change="tableChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="环境污染事件名称"></el-table-column>
        <el-table-column prop="type" label="事件类型">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.type == '1'">预警</span>
              <span v-if="scope.row.type == '2'">报警</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="事件等级">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.grade == '1'">Ⅰ级预警</span>
              <span v-if="scope.row.grade == '2'">Ⅱ级预警</span>
              <span v-if="scope.row.grade == '3'">Ⅲ级预警</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="latitude" label="上报附件">
          <template slot-scope="scope">
            <div v-for="item in scope.row.attachments" :key="item.id">
              <a href="#" @click="downLoad(item.id);">{{item.name}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="产生时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTimeStr ? scope.row.createTimeStr : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="secondBtn" @click="edit(scope.row)">编辑</el-button>
              <el-button type="secondBtn" @click="delet(scope.row.id)">删除</el-button>
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
    <el-dialog
      :visible.sync="visiDialog"
      width="650px"
      :title="title"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <div class="dialogcontent">
        <div class="dialog-layout">
          <el-form :model="ruleForm" :rules="formRules" ref="ruleForm">
            <p class="lihead">应急事件</p>
            <div class="libody clear">
              <ul class="formul">
                <li>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>事件名称 :
                    </span>&nbsp;
                    <div class="layoutBox" style="width:442px">
                      <el-form-item prop="title">
                        <el-input placeholder="请输入" v-model="ruleForm.title"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>事件类型 :
                    </span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="type">
                        <el-select v-model="ruleForm.type" filterable clearable placeholder="请选择">
                          <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>事件等级 :
                    </span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="grade">
                        <el-select v-model="ruleForm.grade" filterable clearable placeholder="请选择">
                          <el-option
                            v-for="item in grades"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="layoutspan">
                      <i>*</i>附件上报 :
                    </span>&nbsp;
                    <div class="layoutBox">
                      <el-form-item prop="file">
                        <el-upload
                          action="/waterEnvXA/file/upload"
                          :on-remove="handleRemove"
                          :on-success="uploadSuccess"
                          :before-upload="beforeUpload"
                          :file-list="attachs"
                        >
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="noticon" @click="save('ruleForm')">保 存</el-button>
        <el-button type="noticonsecondBtn" @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",
  data() {
    var me = this;
    var validateFile = (rule, value, callback) => {
      if (me.attachs.length == 0) {
        callback(new Error("请上传应急文件"));
      } else {
        callback();
      }
    };

    return {
      ids: "",
      visiDialog: false,
      tableData: [],
      queryPrams: {
        title: "",
        type: "",
        grade: "",
        pageNo: 1,
        pageSize: 10
      },
      types: [
        { name: "预警", value: "1" },
        { name: "报警", value: "2" }
      ],
      grades: [
        { name: "Ⅰ级预警", value: "1" },
        { name: "Ⅱ级预警", value: "2" },
        { name: "Ⅲ级预警", value: "3" }
      ],
      ruleForm: {
        id: "",
        title: "",
        type: "",
        grade: "",
        attachmentIds: ""
      },
      attachs: [],
      atts: [],
      title: "新增应急事件",
      formRules: {
        title: [
          { required: true, message: "请输入应急事件名称", trigger: "blur" }
        ],
        grade: [
          { required: true, message: "请选择应急事件等级", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择应急事件类型", trigger: "change" }
        ],
        file: [{ required: true, validator: validateFile, trigger: "change" }]
      },
      loading: false,
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 15, //分页每页多少条数据
      pageList: [15, 25, 35] //设置每页多少条
    };
  },
  inject: ["globelDelet"],
  created() {
    this.fetchData();
  },
  mounted() {},
  methods: {
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "应急管理";
      let fieldList = [
        "title",
        "type",
        "grade",
        "attachments",
        "createTimeStr"
      ];
      let params = {
        headerProp: fieldList.join(","),
        type: this.queryPrams.areaId,
        grade: this.queryPrams.grade,
        keyword: this.queryPrams.title,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/waterEmergencyExcel",
        params
      );
    },
    fetchData() {
      var me = this;
      me.loading = true;
      me.$http
        .get("/waterEnvXA/waterEmergency/queryByPage", {
          params: me.queryPrams
        })
        .then(res => {
          if (res.data.code == 0) {
            me.tableData = res.data.content.dataList;
            me.total = res.data.content.totalRecords;
            me.loading = false;
          }
        });
    },
    search() {
      this.queryPrams.pageSize = 10;
      this.queryPrams.currentPage = 1;
      this.fetchData();
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet(
          "/waterEnvXA/waterEmergency",
          this.ids,
          this.fetchData
        );
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    delet(id) {
      this.globelDelet("/waterEnvXA/waterEmergency", id, this.fetchData);
    },
    downLoad(id) {
      window.open("/waterEnvXA/file/download?id=" + id);
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.fetchData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.fetchData();
    },
    //编辑指令
    edit(v) {
      this.visiDialog = true;
      this.title = "编辑应急事件";
      this.ruleForm.id = v.id;
      this.ruleForm.title = v.title;
      this.ruleForm.type = v.type;
      this.ruleForm.grade = v.grade;
      this.attachs = v.attachments;
      var arr = [];
      for (var i in this.attachs) {
        arr.push(this.attachs[i].id);
      }
      this.ruleForm.attachmentIds = arr.join(",");
    },
    openDialog() {
      this.visiDialog = true;
      this.title = "新增应急事件";
      this.clearData();
    },
    //新增
    save(form) {
      var me = this;
      me.$refs[form].validate(valid => {
        if (valid) {
          if (me.ruleForm.id) {
            me.$http
              .put("/waterEnvXA/waterEmergency", me.ruleForm)
              .then(res => {
                if (res.data.code == 0) {
                  me.visiDialog = false;
                  me.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 700
                  });
                  me.fetchData();
                  me.resetForm("ruleForm");
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning",
                    duration: 700
                  });
                }
              });
          } else {
            me.$http
              .post("/waterEnvXA/waterEmergency", me.ruleForm)
              .then(res => {
                if (res.data.code == 0) {
                  me.visiDialog = false;
                  me.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 700
                  });
                  me.fetchData();
                  me.resetForm("ruleForm");
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning",
                    duration: 700
                  });
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    clearData() {
      this.resetForm("ruleForm");
      this.ruleForm = {
        id: "",
        name: "",
        code: "",
        longitude: "",
        latitude: "",
        isMonitor: "",
        signFix: "",
        enterpriseId: "",
        dischargeAddress: ""
      };
      this.attachs = [];
    },
    //关闭
    close() {
      this.visiDialog = false;
      this.resetForm("ruleForm");
    },
    //重置表单
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    uploadSuccess(resp, file) {
      var me = this;
      var { code, data, msg } = resp;
      if (code == 0) {
        // 开始添加到文件列表中
        var item = Object.assign({}, data, {});
        me.$http.post("/waterEnvXA/attachment", resp.content.info).then(res => {
          if (res.data.code == 0) {
            var obj = {};
            obj.id = res.data.content.info.id;
            obj.attachmentUrl = res.data.content.info.attachmentUrl;
            obj.name = res.data.content.info.attachName;
            me.attachs.push(obj);
            var arr = [];
            for (var i in me.attachs) {
              arr.push(me.attachs[i].id);
            }
            me.ruleForm.attachmentIds = arr.join(",");
          }
        });
      } else {
        me.$message.info(msg);
      }
    },
    beforeUpload(file) {
      var isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.warning("上传图片大小不能超过 20MB!");
        return false;
      }
    },
    handleRemove(file, fileList) {
      var me = this;
      for (var i in me.attachs) {
        if (me.attachs[i].attachmentUrl == file.attachmentUrl) {
          var id = me.attachs[i].id;
          me.$http
            .delete("/waterEnvXA/attachment", { params: { id: id } })
            .then(res => {
              if (res.code == 0) {
                this.$message.success("删除附件成功!");
              }
            });
        }
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
  }
};
</script>

<style scoped lang="less">
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}

.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
  .layoutspan {
    width: 90px;
  }
}
.dialogcontent .uploaddiv {
  padding-left: 72px;
}
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}

.layoutBox {
  width: 170px;
}

.layoutspan {
  width: 90px;
  i {
    color: red;
    margin-right: 4px;
    float: right;
  }
}
</style>

