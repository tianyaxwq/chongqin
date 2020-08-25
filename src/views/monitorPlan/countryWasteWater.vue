<template>
  <div class="pageContent">
     <div class="treeBox" v-show="treeStatus">
      <div class="treebody">
        <div class="treeTool clearfix">
          <el-input placeholder="关键字" suffix-icon="el-icon-search" v-model="filter"></el-input>
        </div>
        <div style="width:100%;height:calc(100% - 34px)" class="treescroll">
          <el-scrollbar style="height:100%">
            <div class="tree_content" style="padding:12px;width:450px">
              <el-tree
               :data="treeData"
                      :indent="23"
                      node-key="id"
                      ref="tree"
                      @check="treeCheckchange"
                      :default-expanded-keys="defaultId"
                      default-expand-all
                      :filter-node-method="filterNode"
                      highlight-current
                      accordion
                      show-checkbox
                    
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
          </el-scrollbar>
        </div>
      </div>
      <div class="closeBtn" @click="closeTree">
        <i></i>
      </div>
    </div>
    <div class="briefBox" v-show="!treeStatus">
            <div style="height:100%">
              <el-scrollbar style="height:100%">
                <div class="inputbox" @click="openMidtree">
                  <input type="text" />
                  <i class="iconfont icon-sousuo"></i>
                </div>
                <p>当前站点</p>
                <div class="ulbox">
                  <i class="iconfont icon-lefticon" @click="stationLeft"></i>
                  <i class="iconfont icon-righticon" @click="stationRight"></i>
                  <div class="gdbox">
                    <ul class="clearfix" v-bind:style="{left: -staionPos + 'px' }">
                      <li
                        v-for="(item,key) in brieStationList"
                        :key="key"
                      >{{item.label}}</li>
                    </ul>
                  </div>
                  <div>{{stationCode+1}}/{{brieStationList.length}}</div>
                </div>
                <div class="stationdetail">
                  <span class="tl"></span>
                  <span class="tr"></span>
                  <ul>
                    <li>
                      <p>站点总数</p>
                      <p>111</p>
                    </li>
                    <li>
                      <p>在线数</p>
                      <p style="color:#36c25e">111</p>
                    </li>
                    <li>
                      <p>停运数</p>
                      <p style="color:#ff3333">0</p>
                    </li>
                    <li>
                      <p>离线数</p>
                      <p>0</p>
                    </li>
                  </ul>
                </div>
              </el-scrollbar>
            </div>
            <div class="closeBtn" @click="openMidtree">
              <i></i>
            </div>
          </div>
    <div class="secondary-page-section secondary-page-mode" :class="treeStatus?'':'larScreen'">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input placeholder="请输入" v-model="searchModel" size="small" style="width:220px"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button @click="visiDialog =true;isEditor=false">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button>
          <el-button >审核</el-button>
         <el-button>提交</el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
          <el-button type="delet" @click="importReport">
          <i class="iconfont icon-tianjia1"></i>导入
        </el-button>
         <el-button type="delet">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table
            border
            :data="tableData"
            height="100%"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
            @selection-change="tableChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center" fixed></el-table-column>
            <el-table-column label="县（区）" width="150" show-overflow-tooltip align="center" prop="area" fixed></el-table-column>
            <el-table-column label="村名" width="150" align="center" prop="village" fixed></el-table-column> 
             <el-table-column label="污水处理厂（人工湿地）名" width="180" align="center" prop="factor" fixed></el-table-column>
             <el-table-column label="状态" width="100" align="center" prop="status" fixed>
                <template slot-scope="scope">
                  <div>
                      <span v-if="scope.row.status == 0">待提交</span>
                      <span v-if="scope.row.status == 1">已提交</span>
                      <span v-if="scope.row.status == 2">已审核</span>
                      <span v-if="scope.row.status == 3">驳回</span>
                  </div>
                </template>
             </el-table-column>
            <el-table-column label="经度" width="150" align="center" prop="longitude"></el-table-column>
            <el-table-column label="纬度" width="150" align="center" prop="latitude"></el-table-column>
           
            <el-table-column label="污水处理方法" width="180" align="center" prop="method"></el-table-column>
            <el-table-column label="监测时间" width="180" align="center" prop="receiveTime"></el-table-column>
            <el-table-column  align="center" label="处理规模" >
                <el-table-column  width="120" align="center" label="(m3/d)" prop="treatScale">

                </el-table-column>
            </el-table-column>
             <el-table-column  align="center" label="服务人口数量" >
                <el-table-column  width="120" align="center" label="(人)" prop="peoples">

                </el-table-column>
            </el-table-column>
             <el-table-column  align="center" :label="item.factorName" v-for="(item,key) in factorList" :key="key">
                <el-table-column  width="120" align="center" :label="item.factorUnit" :prop="item.code">

                </el-table-column>
            </el-table-column>
          
            <el-table-column label="备注" width="180" align="center" prop="remark"></el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)" v-if="scope.row.status == 0 || scope.row.status == 3">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="1000px" :title="vTitle" :before-close="closess">
      <div class="dialogcontent noScrollX" style="height:550px">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px">
            <ul>
              <li class="liblock">
                <p class="lihead">基本信息</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="县（区）:">
                        <el-input placeholder="请输入" v-model="formData.area" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="村名:">
                        <el-input placeholder="请输入" v-model="formData.village" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="经度:">
                        <el-input placeholder="请输入" v-model="formData.longitude" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="纬度:">
                        <el-input placeholder="请输入" v-model="formData.latitude" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="污水处理厂（人工湿地）名:">
                        <el-input placeholder="请输入" v-model="formData.factor" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="污水处理方法:">
                        <el-input placeholder="请输入" v-model="formData.method" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="服务人口数量 :">
                        <el-input placeholder="请输入" v-model="formData.peoples" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="处理规模:">
                        <el-input placeholder="请输入" v-model="formData.treatScale" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                   <el-row>
                    <el-col :span="12">
                      <el-form-item label="监测时间:">
                        <el-date-picker
                            v-model="formData.receiveTime"
                            type="date"
                            style="width:280px"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                          </el-date-picker>
                      </el-form-item>
                    </el-col>
                   
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.remark"
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
                <p class="lihead">监测因子</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="化学需氧量:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cod"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="氨氮:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.an"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="PH:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.ph"
                          style="width:100px"
                          type="number"
                        ></el-input> (无量纲)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="五日生化需氧量:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.bod5"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="悬浮物:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tss"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="总磷:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tp"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                   <el-row>
                    <el-col :span="8">
                      <el-form-item label="粪大肠菌群:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.fecalColiform"
                          style="width:100px"
                          type="number"
                        ></el-input> (个/l)
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
     <el-dialog
      :visible.sync="visiDialogReport"
      width="520px"
      title="数据导入"
      :before-close="closessReport"
    >
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <ul>
            <li class="liblock"  v-loading="exportLoading"
            element-loading-text="数据导入中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)">
              <p class="lihead">数据导入</p>
              <div class="libody clear">
                <div class="formDivTl" style="height:100px">
                  <span>文件：</span>
                  <div class="layoutBox">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="/"
                      :limit="1"
                      :file-list="fileList"
                      :http-request="uploadFile"
                      :auto-upload="false"
                    >
                      <el-button slot="trigger">选取文件</el-button>
                    </el-upload>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submitReport">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancelReport">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "",

  data() {
    return {
      exportLoading:false,
      visiDialogReport: false,
      fileList: [],
      brieStationList:[],
      staionPos: 0,
      stationCode: 0,
      treeStatus:true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultId: [],
       filter: "",
      treeData: [],
      name: "",
      vTitle: "农村村庄生活污水数据新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 25, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [25, 35, 55], //设置每页多少条
      formData: {
       
        id:"",
        area:"",//县(区)
        village:"",//村
        longitude:"",//经度
        latitude:"",//纬度
        factor:"",	//污水处理厂
        method:"",	//污水处理方法
        receiveTime:null,
        treatScale:"",//处理规模
        peoples:null,//服务人数	
	      years:null,		
	      month:null,
	      day:null,	
	      cod:null,	//化学需氧量			
	      an:null,//氨氮			
	      ph:null,	//ph值					
	      bod5:null,//五日生化需氧量					
	      tss:null,//悬浮物				
	      tp:null,//总磷			
	      fecalColiform:null,//粪大肠菌群	
	      remark:'',//备注
      },
      rules: {
        farmName: [
          { required: true, message: "请输入养殖场名称", trigger: "blur" }
        ]
      },
      factorList:[ {factorName:'化学需氧量',factorUnit:'(mg/L)',code:'cod'},
      {factorName:'氨氮',factorUnit:'(mg/L)',code:'an'},
      {factorName:'pH',factorUnit:'(无量纲)',code:'ph'},
      {factorName:'五日生化需氧量 ',factorUnit:'(mg/L)',code:'bod5'},
     {factorName:'悬浮物',factorUnit:'(mg/L)',code:'tss'},
     {factorName:'总磷',factorUnit:'(mg/L)',code:'tp'},
     {factorName:'粪大肠菌群 ',factorUnit:'(个/L)',code:'fecalColiform'}],
      loading: true,
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData()
    this.searchTreedata();
  },
  methods: {
    uploadFile(file) {
      this.formD.append("file", file.file);
    },
    audit(id) {
      this.visiDialogA = true;
    },
    //导入
    importReport(){
       this.visiDialogReport = true;
    },
    //导入提交
    submitReport(formName) {
      this.exportLoading=true;
      let excelHeader = [
        { fieldName: "area", fieldType: "String" },
        { fieldName: "village", fieldType: "String" },
        { fieldName: "longitude", fieldType: "String" },
        { fieldName: "latitude", fieldType: "String" },
        { fieldName: "factor", fieldType: "String" },
        { fieldName: "method", fieldType: "String" },
        { fieldType: "treatScale", fieldName: "String" },
        { fieldType: "peoples", fieldName: "String" },
        { fieldName: "String", fieldType: "years" },
        { fieldType: "String", fieldName: "month" },
        { fieldType: "String", fieldName: "day" },
        { fieldType: "String", fieldName: "cod" },
        { fieldType: "String", fieldName: "an" },
        { fieldType: "String", fieldName: "ph" },
        { fieldType: "String", fieldName: "bod5" },
        { fieldType: "String", fieldName: "tss" },
        { fieldType: "String", fieldName: "tp" },
        { fieldType: "String", fieldName: "fecalColiform" },
        { fieldType: "String", fieldName: "remark" },
      ];
    
      this.formD = new FormData();
      this.$refs.upload.submit();
      this.formD.append("excelImportBo", JSON.stringify(excelHeader));
      this.formD.append("flag", "rural");
       this.$http
              .post("/fileXA/excel/import", this.formD)
              .then(res=>{
                  this.visiDialogReport = false;
                  this.exportLoading=false;
                  this.searchData()
              })
    },
    //取消导入
    cancelReport(formName) {
      this.visiDialogReport = false;
    },
    treeCheckchange(){
       
        this.brieStationList=this.$refs.tree.getCheckedNodes();
    },
   //站点左切换
    stationLeft() {
      if (this.stationCode == 0) {
        return false;
      }
      this.stationCode--;
      this.staionPos = this.stationCode * 34;
    },
    //站点右切换
    stationRight() {
      if (this.stationCode > this.brieStationList.length - 2) {
        return false;
      }
      this.stationCode++;
      this.staionPos = this.stationCode * 34;
    },
    openMidtree(){
        this.treeStatus=true;
    },
    closeTree(){
       this.treeStatus=false;
    },
     //查询站点树数据
    searchTreedata() {
      
      this.$http.get("/waterEnvXA/station/oriTree", {
          params: {
            structureType: "river"
          }
        }).then(res => {
          this.treeData = res.data.content.dataList;
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([this.treeData[0].children[0].children[0].id]);
            this.defaultId.push(this.treeData[0].children[0].children[0].id);
           
            this.brieStationList=this.$refs.tree.getCheckedNodes();
          });
          
        })
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    searchData() {
      this.loading = true;
      this.$http
        .get("/fileXA/ruralSewage", {
          params: {
           
            key: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize
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
            this.$http
              .put(
                "/fileXA/ruralSewage",
                this.formData
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
                "/fileXA/ruralSewage",
                this.formData
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
        this.formData.id=row.id;
        this.formData.area=row.area;//县(区)
        this.formData.village=row.village;//村
        this.formData.longitude=row.longitude;//经度
        this.formData.latitude=row.latitude;//纬度
        this.formData.factor=row.factor;	//污水处理厂
        this.formData.method=row.method;	//污水处理方法
        this.formData.receiveTime=row.receiveTime;
        this.formData.treatScale=row.treatScale;//处理规模
        this.formData.peoples=row.peoples;//服务人数	
	      this.formData.years=row.years;		
	      this.formData.month=row.month;
	      this.formData.day=row.day;
	      this.formData.cod=row.cod;//化学需氧量			
	      this.formData.an=row.an;//氨氮			
	      this.formData.ph=row.ph;	//ph值					
	      this.formData.bod5=row.bod5;//五日生化需氧量					
	      this.formData.tss=row.tss;//悬浮物				
	      this.formData.tp=row.tp;//总磷			
	      this.formData.fecalColiform=row.fecalColiform;//粪大肠菌群	
	      this.formData.remark=row.remark;//备注
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
        this.formData.id='';
        this.formData.area='';//县(区)
        this.formData.village='';//村
        this.formData.longitude='';//经度
        this.formData.latitude='';//纬度
        this.formData.factor='';	//污水处理厂
        this.formData.method='';	//污水处理方法
        this.formData.receiveTime='';
        this.formData.treatScale='';//处理规模
        this.formData.peoples='';//服务人数	
	      this.formData.years=null;		
	      this.formData.month=null;	
	      this.formData.day=null;	
	      this.formData.cod=null;	//化学需氧量			
	      this.formData.a=null;	//氨氮			
	      this.formData.ph=null;		//ph值					
	      this.formData.bod5=null;	//五日生化需氧量					
	      this.formData.tss=null;	//悬浮物				
	      this.formData.tp=null;	//总磷			
	      this.formData.fecalColiform=null;	//粪大肠菌群	
	      this.formData.remark='';	;//备注
    },
    //删除
    delet(id) {
      this.globelDelet("/fileXA/ruralSewage", id, this.searchData);
    },
    //批量删除
    allDelet() {
      this.globelDelet("/fileXA/ruralSewage", this.ids, this.searchData);
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
.pageContent {
  position: relative;
  background: #eff3f5;
  .treeBox {
    width: 204px;
    height: 100%;
    border: 1px solid #dce9fa;
    position: absolute;
    left: 0px;
    top: 0px;
    background: #ebf1f7;
    .closeBtn {
      width: 6px;
      height: 44px;
      background: url("../../assets/images/shuClose.png") center center
        no-repeat;
      position: absolute;
      top: 50%;
      transform: translateY(-3px);
      right: -6px;
      cursor: pointer;
      &:hover {
        background: url("../../assets/images/hover_shuClose.png") center
          center no-repeat;
      }
      i {
        width: 3px;
        height: 8px;
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translateY(-4px);
        background: url("../../assets/images/righticon.png") center center
          no-repeat;
      }
    }
    .treebody {
      background: #fff;
      width: 100%;
      height: calc(100% - 3px);
      .treeTool {
        border-bottom: 1px solid #dfe3f2;
        height: 34px;
        padding: 3px;
        > span {
          display: inline-block;
          height: 25px;
          width: 28px;
          text-align: center;
          line-height: 28px;
          color: #7b8fa4;
          cursor: pointer;
          font-weight: 700;
          vertical-align: -2px;
        }
      }
      .treenav {
        li {
          float: left;
          height: 28px;
          width: 49.99%;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
          color: #666;
          background: #ebf1f7;
          border-right: 1px solid #dce9fa;
          border-bottom: 1px solid #dce9fa;
          &:last-child {
            border-right: 0px;
          }
        }
        .current {
          color: #166bce;
          background: #fff;
          border-bottom: 0px;
          font-weight: 700;
        }
      }
      .tree_content {
        height: calc(100% - 52px);
      }
    }
  }
  .briefBox {
        width: 63px;
        height:100%;
        border: 1px solid #dce9fa;
        position: absolute;
        left: 0px;
        top: 0px;
        background: #fff;

        padding: 4px;
        .inputbox {
          position: relative;
          margin-bottom: 15px;
          cursor: pointer;
          input {
            width: 50px;
            height: 25px;
            border-radius: 25px;
            border: 1px solid #c6d1de;
            outline: none;
          }
          i {
            font-size: 16px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-8px, -8px);
            color: #c6d1de;
          }
        }
        > p {
          height: 28px;
          font-size: 13px;
          color: #666666;
        }
        .ulbox {
          height: 248px;
          text-align: center;
          margin-bottom: 15px;
          position: relative;
          > i {
            font-size: 12px;
            color: #166bce;
            cursor: pointer;
            position: absolute;
            top: 90px;
          }
          .icon-lefticon {
            left: 0px;
          }
          .icon-righticon {
            right: 0px;
          }
          .gdbox {
            display: inline-block;
            width: 34px;
            height: 205px;
            position: relative;
            overflow: hidden;
            ul {
              height: 205px;
              position: absolute;
              left: 0px;
              top: 0px;
              width: 10000px;
              transition: all 0.5s;
              li {
                width: 34px;
                padding: 2px 10px;
                padding-top: 5px;
                height: 205px;
                font-size: 13px;
                writing-mode: vertical-lr;
                background: url("../../assets/images/jiao_j.png") center center
                  no-repeat;
                color: #fff;
                float: left;
                text-align: center;
              }
            }
          }
        }
        .stationdetail {
          font-size: 12px;
          color: #666;
          text-align: center;
          padding: 10px 0px;
          position: relative;
          > span {
            position: absolute;
            width: 6px;
            height: 6px;
            top: 0px;
          }
          &:after,
          &:before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            bottom: 0px;
          }
          &:after {
            background: url("../../assets/images/jiao_f.png") center center
              no-repeat;
            right: 0px;
          }
          &:before {
            background: url("../../assets/images/jiao_h.png") center center
              no-repeat;
            left: 0px;
          }
          .tl {
            background: url("../../assets/images/jiao_e.png") center center
              no-repeat;
            left: 0px;
          }
          .tr {
            background: url("../../assets/images/jiao_g.png") center center
              no-repeat;
            right: 0px;
          }
          li {
            margin-bottom: 10px;
            &:last-child {
              margin: 0px;
            }
            p {
              height: 20px;
            }
          }
        }
        .closeBtn {
          width: 6px;
          height: 44px;
          background: url("../../assets/images/shuClose.png") center center
            no-repeat;
          position: absolute;
          top: 50%;
          transform: translateY(-3px);
          right: -6px;
          cursor: pointer;
          &:hover {
            background: url("../../assets/images/hover_shuClose.png") center
              center no-repeat;
          }
          i {
            width: 3px;
            height: 8px;
            position: absolute;
            left: 2px;
            top: 50%;
            transform: translateY(-4px);
            background: url("../../assets/images/righticon.png") center center
              no-repeat;
          }
        }
      }
  .secondary-page-section {
    height: 100%;
    //  border: 1px solid #dce9fa;
    width: calc(100% - 210px);
    position: absolute;
    background: #fff;
    left: 210px;
    top: 0px;
    transition: all 0.3s;
  }
  .larScreen{
      width: calc(100% - 70px);
       left: 70px;
  }
}
</style>
