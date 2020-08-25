<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <!-- <span>行政区划 :</span>
        <div class="layoutBox">
          <el-select v-model="value" placeholder="请选择" style="width:120px" size="small">
            <el-option
              v-for="item in optionData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>&emsp;&emsp; -->
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input placeholder="请输入河流名称" v-model="searchModel" clearable style="width:220px" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
        <!-- <el-button @click="visiDialog =true">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button> -->
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table border :data="tableData" height="100%" v-loading="loading"
            element-loading-text="加载中"
            ref="table"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="河流编码" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                 <div>
                   <span v-if="scope.row.RIVER_CODE == ''">--</span>
                   <span v-else>{{scope.row.RIVER_CODE}}</span>
                 </div>
               </template>
            </el-table-column>
            <el-table-column label="河流名称" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                 <div>
                   <span v-if="scope.row.RIVER_NM == ''">--</span>
                   <span v-else>{{scope.row.RIVER_NM}}</span>
                 </div>
               </template>
            </el-table-column>
            <el-table-column label="河流起止点（县、乡、村名)" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                 <div>
                   <span v-if="scope.row.POSITION == ''">--</span>
                   <span v-else>{{scope.row.POSITION}}</span>
                 </div>
               </template>
            </el-table-column>
            <el-table-column label="长度"  show-overflow-tooltip align="center">
              <template slot-scope="scope">
                 <div>
                   <span v-if="scope.row.LEN == ''">--</span>
                   <span v-else>{{scope.row.LEN}}</span>
                 </div>
               </template>
            </el-table-column>
            <el-table-column label="所跨县"  show-overflow-tooltip align="center">
              <template slot-scope="scope">
                 <div>
                   <span v-if="scope.row.PASS_PR == ''">--</span>
                   <span v-else>{{scope.row.PASS_PR}}</span>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="河湖长新增" :before-close="closess">


      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">河湖长信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">姓名：</span>
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
                    <span class="rCode">手机号码：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tel"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">性别：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.sex"
                          placeholder="请选择"
                          size="small"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in sexArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">管辖河流：</span>
                    <div class="layoutBox">
                      <el-select v-model="formData.riverName" placeholder="请选择" size="small" style="width:255px">
                        <el-option
                          v-for="item in riverArr"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">行政区划：</span>
                    <div class="layoutBox">
                      <el-select v-model="formData.areaName" placeholder="请选择" size="small" style="width:255px">
                        <el-option
                          v-for="item in areaArr"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所在单位：</span>
                    <div class="layoutBox">
                       <el-input
                          placeholder="请输入"
                          v-model="formData.unitName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                     
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">所属网格：</span>
                    <div class="layoutBox">
                      <el-select v-model="formData.gridId" placeholder="请选择" size="small" style="width:255px">
                        <el-option
                          v-for="item in gridData"
                          :key="item.gridId"
                          :label="item.gridName"
                          :value="item.gridId"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="formDiv formDivTl">
                    <span class="rCode">备注：</span>
                    <div class="layoutBox">
                      <el-input placeholder="请输入" v-model="formData.remark" type="textarea" :rows="4"></el-input>
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
import qs from "qs";
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",

  data() {
    return {
      areaArr:[{label:'雄县',value:'0'},{label:'安新',value:'1'},{label:'容城',value:'2'}],
      riverArr:[{label:'河流A',value:'0'},{label:'河流B',value:'1'},{label:'河流C',value:'2'}],
      value1: "",
      name: "",
      vTitle: "河湖长信息新增",
      visiDialog: false,
      tableData: [],
      gridData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      sexArr:[{label:'男',value:'0'},{label:'女',value:'1'}],
      formData: {
        id:'',
        userName: "",
        tel:"",
        sex:"",
        riverName:'',
        areaName:"",
        unitName:"",
        gridId:'',
        remark:"",
      },
      rules: {
        userName: [{ required: true, message: "请输入名字", trigger: "blur" }]
      },
      loading:true,
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created(){
    this.searchData()
      //this.init()
  },
  methods: {
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "河流基本信息";
      let fieldList = [
        "RIVER_CODE",
        "RIVER_NM",
        "POSITION",
        "LEN",
        "PASS_PR"
      ];
      let params = {
        headerProp: fieldList.join(","),
        keyword: this.searchModel,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/waterBasicExcel",
        params
      );
    },
    gridFormat(row){
      let name='';
        for(let i=0;i<this.gridData.length;i++){
            if(row.gridId == this.gridData[i].gridId){
              name=this.gridData[i].gridName;
            }
        }
        return name;
    },
    init(){
       this.$http.get("/waterEnvXA/waterGrid").then(res => {
          this.gridData = res.data.content.dataList;
      });
    },
    searchData(){
      this.loading = true;
      this.$http.get("/dataHandle/yunliBase/getDwdRiver", {
          params: {
            key: this.searchModel,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
           
          
          }
        }).then(res => {
          this.loading=false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
      });
    },
     paginationSizeChange(v) {
      this.pageSize=v;
      this.searchData()
    },
    paginationChange(v) {
       this.currentPage=v;
       this.searchData()
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
          
            this.$http.put("/waterEnvXA/waterLeader",  qs.stringify(this.formData,{skipNulls:true})).then(res => {
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
           
            this.$http.post("/waterEnvXA/waterLeader",  qs.stringify(this.formData,{skipNulls:true})).then(res => {
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
         this.formData.id=row.id;
        this.formData.userName=row.userName;
        this.formData.tel=row.tel;
        this.formData.sex=row.sex;
         this.formData.riverName=row.riverName;
        this.formData.areaName=row.areaName;
        this.formData.unitName=row.unitName;
         this.formData.gridId=row.gridId;
        this.formData.remark=row.remark;
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/waterLeader", id, this.searchData);
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
