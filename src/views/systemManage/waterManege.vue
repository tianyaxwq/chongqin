<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
           <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入" v-model="searchModel"></el-input>
          </div>&emsp;&emsp;
           <el-button @click="getBasinTable"><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button @click="basinAdd"><i class="iconfont icon-tianjia1"></i>新增</el-button>
           <el-button type="delet" @click="allDelet"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
           
    </div>
    <div class="currency-mode-wrap">

          <el-table border :data="tableData" height="calc(100% - 35px)" v-loading="loading"
               element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)" @selection-change="selectChange">
                 
                  <el-table-column
                      type="selection"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      type="index"
                      label="序号"
                      width="80">
                  </el-table-column>
                  <el-table-column
                      prop="basinnName"
                      
                      label="流域名称">
                  </el-table-column>
                  <el-table-column
                      prop="basinnCode"
                      width="300"
                      label="流域编码">
                  </el-table-column>
                  <el-table-column
                      prop="aimWaterLevel"
                       width="300"
                      label="水质目标等级">
                  </el-table-column>
                  <el-table-column
                      prop="basinnRemark"
                      label="备注">
                  </el-table-column>
                   <el-table-column
                      label="操作"
                      width="200">
                        <template  slot-scope="scope">
                          <div>
                                <el-button type="secondBtn" @click="editorBasin(scope.row)">编辑</el-button>
                                <el-button type="secondBtn" @click="delet(scope.row.basinnId)">删除</el-button>
                          </div>
                        </template>
                  </el-table-column>
          </el-table>
          <div class="paginationBox">
            <el-pagination
              @size-change="paginationSizeChange"
              @current-change="paginationChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              background
              :small = "true"
              popper-class = "select-common-option"
              :page-sizes = "pageList"
              layout="total,sizes,slot,->,prev, pager, next, jumper"
              :total="total">
              <span class="el-pagination__current">当前第{{currentPage}}/{{totalPageNumber}}页</span>
            </el-pagination>
          </div>
    </div>
    <el-dialog :visible.sync="visiDialog_add"  width="420px" title="流域新增" :before-close='closess'>
          <div class="dialogcontent">

                <div class="dialog-layout">
                    <el-form :model="basinObj" :rules="basinRules" ref="form">
                      <table class="whTable">
                            <tr>
                                 <td width="28%"><span  class="rCode">流域名称</span></td>
                                 <td>
                                    <el-form-item prop="basinnName">
                                              <el-input v-model="basinObj.basinnName"></el-input>
                                    </el-form-item>
                                 </td>
                                
                            </tr>
                            <tr>
                                 <td width="28%"><span  class="rCode">流域编码</span></td>
                                 <td>
                                    <el-form-item prop="basinnCode">
                                              <el-input v-model="basinObj.basinnCode"></el-input>
                                    </el-form-item>
                                 </td>
                                 
                            </tr>
                            <tr>
                                 <td width="28%"><span  class="rCode">水质目标等级</span></td>
                                  <td>
                                    <el-form-item prop="aimWaterLevel">
                                              <el-select v-model="basinObj.aimWaterLevel" placeholder="请选择">
                                                    <el-option
                                                      v-for="item in targetLevelData"
                                                      :key="item.name"
                                                      :label="item.name"
                                                      :value="item.name">
                                                    </el-option>
                                              </el-select>
                                    </el-form-item>
                                 </td> 
                               
                            </tr>
                            <tr>
                                <td width="28%"><span>备注</span></td>
                                 <td>
                                 
                                              <el-input v-model="basinObj.basinnRemark"></el-input>
                                    
                                 </td>
                                
                            </tr>
                      </table>
                    </el-form>
                </div>

          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="noticon" @click="submitForm('form')">保 存</el-button>
            <el-button type="noticonsecondBtn" @click="closeForm('form')">关 闭</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      value:'',
      visiDialog_add:false,
      tableData:[],
      targetLevelData:[],
      basinObj:{
        aimWaterLevel: "",
        basinnCode: "",
        basinnId: "",
        basinnName: "",
        basinnRemark: ""
      },
      basinRules:{
          basinnName: [
            { required: true, message: '请输入流域名称', trigger: 'blur' },
          ],
          basinnCode: [
            { required: true, message: '请输入流域编码', trigger: 'blur' },
          ],
          aimWaterLevel: [
            { required: true, message: '请选择水质目标等级', trigger: 'change' },
          ],
      },
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      total: 0, //总条数
      pageList: [10, 20, 30], //设置每页多少条
      searchModel:'',
      loading:true,
      isEditor: false, //判断是新增还是修改状态
      basinnId:'',
    };
  },
  inject:['globelDelet'],
  created() {
      this.init();
      this.getBasinTable()
  },
  mounted(){
     
  },
  methods: {
    selectChange(val, index){
        let arr =val;
        this.basinnId='';
        for(let i in arr){
            this.basinnId+=arr[i].basinnId+',';
        };
        this.basinnId=this.basinnId.substring(0,this.basinnId.length-1);
    },
    //删除
    delet(id){
       this.globelDelet('/SiteManagement/basinn/delete',id,this.getBasinTable);
    },
    //批量删除
    allDelet(){
      this.globelDelet('/SiteManagement/basinn/delete',this.basinnId,this.getBasinTable);
    },
    paginationSizeChange(v){
      this.pageSize=v;
      this.getBasinTable()
    },
    paginationChange(v){
       this.currentPage=v;
       this.getBasinTable()
    },
    //流域新增弹框打开
    basinAdd(){
      this.visiDialog_add=true;
      this.isEditor=false;
    },
    //流域新增弹框关闭
    closeForm(formName){
         this.visiDialog_add=false;
        
       this.resetForm(formName)
    },
    getBasinTable(){
       this.loading=true;
       let str='';
       if(this.searchModel == ''){
         str='%'
       }else{
        str=this.searchModel;
       }
       this.$http.post("/SiteManagement/basinn/query",this.paramsObj.GetPageData_P("queryParamDto",this.currentPage,this.pageSize,[str],true)).then(res=>{
              if (res.data.code == 0) {
                   this.tableData=res.data.content.dataList;
                   this.total= res.data.content.totalRecords;
                   this.loading=false;
              }
       })
    },
    init(){
      //获取水质目标等级下拉框数据
      this.$http.get("/SiteManagement/station/queryTargetLevel").then(res => {
        if (res.data.code == 0) {
          this.targetLevelData = res.data.content.dataList;
        
        }
      });
    },
    //编辑流域数据
    editorBasin(obj){
      this.visiDialog_add=true;
      this.isEditor=true;
       this.basinObj={
        aimWaterLevel: obj.aimWaterLevel,
        basinnCode: obj.basinnCode,
        basinnId: obj.basinnId,
        basinnName: obj.basinnName,
        basinnRemark: obj.basinnRemark,
      };
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.basinObj={
          aimWaterLevel: '',
          basinnCode: '',
          basinnId: '',
          basinnName: '',
          basinnRemark: '',
        };
    },
    closess(done) {
      done();
      this.resetForm("form");
    },
    //新增流域数据
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.isEditor){
                    let params={};
                    params.aimWaterLevel=this.basinObj.aimWaterLevel;
                    params.basinnCode=this.basinObj.basinnCode;
                    params.basinnName=this.basinObj.basinnName;
                    params.basinnRemark=this.basinObj.basinnRemark;
                      params.basinnId=this.basinObj.basinnId;
                    this.$http.post("/SiteManagement/basinn/edit",params).then(res=>{
                          if(res.data.code == 0){
                             this.$message({
                                message:res.data.message,
                                type: 'success',
                                duration:1500,
                              });
                              this.visiDialog_add=false;
                              this.resetForm(formName)
                              this.getBasinTable();
                          }
                    })
            }else{
                    let params={};
                    params.aimWaterLevel=this.basinObj.aimWaterLevel;
                    params.basinnCode=this.basinObj.basinnCode;
                    params.basinnName=this.basinObj.basinnName;
                    params.basinnRemark=this.basinObj.basinnRemark;
                  
                    this.$http.post("/SiteManagement/basinn/edit",params).then(res=>{
                          if(res.data.code == 0){
                             this.$message({
                                message:res.data.message,
                                type: 'success',
                                duration:1500,
                              });
                              this.visiDialog_add=false;
                              this.resetForm(formName)
                              this.getBasinTable();
                          }
                    })
            }
              
          } else {
           
            return false;
          }
        });
      },
  },
  computed: {
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  },
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
  .layoutspan{
    width:92px;
  }
}
.wrap_head{
    height: 45px;
    border: 1px solid #d6e3f2;
    border-bottom: 0px;
}
</style>
