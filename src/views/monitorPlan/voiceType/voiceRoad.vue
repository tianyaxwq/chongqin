<template>
  <div style="height:100%" class="tapStyle">
 
     
      
        <div class="secondary-page-section secondary-page-mode">
          <div class="secondary-toolbar">
            <span>关键字 :</span>
            <div class="layoutBox">
              <el-input placeholder="请输入" v-model="searchModel" size="small" style="width:220px"></el-input>
            </div>&emsp;&emsp;
            <el-button>
              <i class="iconfont icon-sousuo"></i>查询
            </el-button>
            <el-button @click="addDialog">
              <i class="iconfont icon-tianjia1"></i>新增
            </el-button>
            <el-button type="delet">
              <i class="iconfont icon-shanchu"></i>批量删除
            </el-button>
            <el-button type="delet">
              <i class="iconfont icon-tianjia1"></i>导入
            </el-button>
            <el-button type="delet" type="delet">
              <i class="iconfont icon-daochu"></i>导出
            </el-button>
          </div>
          <div class="currency-mode-wrap">
            <div class="el_table_box" style="height:calc(100% - 34px)">
              <el-table
                border
                :data="tableData"
                height="100%"
                v-loading="!loading"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column
                  label="监测站名"
                  width="220"
                  show-overflow-tooltip
                  align="center"
                  prop="farmName"
                ></el-table-column>
                <el-table-column label="监测仪器（型号、编号）" width="180" align="center" prop="area"></el-table-column>
                <el-table-column
                  label="声校准器（型号、编号）"
                  width="180"
                  align="center"
                  prop="pollutionTypes"
                ></el-table-column>
                <el-table-column label="监测前校准值dB" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="监测后校准值dB" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="气象条件" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="网格代码" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="测点名称" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="监测时间" width="180" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="声源代码" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column
                  align="center"
                  :label="item.factorName"
                  v-for="(item,key) in factorList"
                  :key="key"
                ></el-table-column>
                <el-table-column label="标准差（SD）" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="车流量（辆/min）" align="center">
                  <el-table-column label="大型车" width="120" align="center" prop="receivingWater"></el-table-column>
                  <el-table-column label="中小型车" width="120" align="center" prop="receivingWater"></el-table-column>
                </el-table-column>
                <el-table-column label="备注" width="120" align="center" prop="receivingWater"></el-table-column>
                <el-table-column label="操作" width="160" align="center">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="secondBtn">编辑</el-button>
                      <el-button type="secondBtn">删除</el-button>
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
     
     
   
   
    <el-dialog :visible.sync="visiDialog" width="1000px" title="道路" :before-close="closess">
      <div class="dialogcontent noScrollX" style="height:550px">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="160px">
            <ul>
              <li class="liblock">
                <p class="lihead">基本信息</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="监测站名:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="监测仪器(型号、编号):">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="声校准器(型号、编号):">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="监测前校准值dB:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="监测后校准值dB:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="气象条件 :">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="网格代码:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="测点名称:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="监测时间:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="声源代码:">
                        <el-input placeholder="请输入" v-model="formData.value" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          type="textarea"
                          :rows="3"
                          style="width:748px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">车流量（辆/ min）</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="大型车:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:280px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="中小型车:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:280px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">监测数据</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="Leq:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="L10:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="L50:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="L90:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="Lmax:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="Lmin:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="标准差（SD）:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.value"
                          style="width:100px"
                          type="number"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
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
export default {
  name: "",
  data() {
    return {
      visiDialog: false,
     
    
      searchModel: "",
      tableData: [],
      loading: true,
      currentPage: 1, //分页组件当前页
      pageSize: 25, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [25, 35, 55], //设置每页多少条
      factorList: [
        { factorName: "Leq" },
        { factorName: "L10" },
        { factorName: "L50" },
        { factorName: "L90" },
        { factorName: "Lmax" },
        { factorName: "Lmin" }
      ],
      formData: {
        value: ""
      },
      rules: {
        farmName: [
          { required: true, message: "请输入养殖场名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //打开弹框
    addDialog(v) {
      this.visiDialog = true;
    },
    searchData() {},
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            this.$http
              .put(
                "/waterEnvXA/waterFarm",
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
                "/waterEnvXA/waterFarm",
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
      this.visiDialog = true;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/waterFarm", id, this.searchData);
    },
    //批量删除
    allDelet() {
      this.globelDelet("/waterEnvXA/waterFarm", this.ids, this.searchData);
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
