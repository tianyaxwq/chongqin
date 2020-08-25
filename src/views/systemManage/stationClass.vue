<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
           <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入" v-model="searchModel"></el-input>
          </div>&emsp;&emsp;
           <el-button><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button @click="basinAdd"><i class="iconfont icon-tianjia1"></i>新增</el-button>
           <el-button type="delet" @click="allDelet"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
           
    </div>
    <div class="currency-mode-wrap">

          <el-table border :data="tableData" @selection-change="selectChange" v-loading="loading"
               element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)" height="100%">
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
                      prop="stationTypeName"
                      label="分类名称">
                  </el-table-column>
                  <el-table-column
                      prop="stationTypeCode"
                      
                      label="分类编码">
                  </el-table-column>
                   <el-table-column
                      prop="lastUpdateTime"
                      
                      label="最近更新时间">
                  </el-table-column>
                  <el-table-column
                      prop="remark"
                      label="备注">
                  </el-table-column>
                   <el-table-column
                      label="操作"
                      width="200">
                       <template slot-scope="scope">
                           <div>
                                <el-button type="secondBtn" @click="editorData(scope.row)">编辑</el-button>
                                <el-button type="secondBtn" @click="delet(scope.row.stationTypeId)">删除</el-button>
                           </div>
                       </template>
                  </el-table-column>
          </el-table>
    </div>
    <el-dialog :visible.sync="visiDialog_add"  width="420px" title="流域新增" :before-close="closess">
          <div class="dialogcontent">

                <div class="dialog-layout">
                    <el-form :model="formData" :rules="formRules" ref="form">
                      <table class="whTable">
                            <tr>
                                 <td width="28%"><span  class="rCode">分类名称</span></td>
                                 <td>
                                    <el-form-item prop="stationTypeName">
                                              <el-input v-model="formData.stationTypeName"></el-input>
                                    </el-form-item>
                                 </td>
                                
                            </tr>
                            <tr>
                                 <td width="28%"><span  class="rCode">分类编码</span></td>
                                 <td>
                                    <el-form-item prop="stationTypeCode">
                                              <el-input v-model="formData.stationTypeCode"></el-input>
                                    </el-form-item>
                                 </td>
                                
                            </tr>
                              <tr>
                                 <td width="16.5%"><span>备注</span></td>
                                 <td >
                                   
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
     
      visiDialog_add:false,
      tableData:[],
      formData:{
        stationTypeCode: "",
        stationTypeName: "",
        remark: "",
        lastUpdateTime: ""
      },
      formRules:{
          stationTypeName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
          stationTypeCode: [
            { required: true, message: '请输入分类编码', trigger: 'blur' },
          ],
         
      },
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      total: 0, //总条数
      pageList: [10, 20, 30], //设置每页多少条
      searchModel:'',
      loading:true,
      isEditor: false, //判断是新增还是修改状态
      stationTypeId:'',
    };
  },
  inject:['globelDelet'],
  created() {
     this.getTableData()
  },
  mounted(){
     
  },
  methods: {
    selectChange(val, index){
        let arr =val;
        this.stationTypeId='';
        for(let i in arr){
            this.stationTypeId+=arr[i].stationTypeId+',';
        };
        this.stationTypeId=this.stationTypeId.substring(0,this.stationTypeId.length-1);
    },
    //删除
    delet(id){
       this.globelDelet('/SiteManagement/stationType/delete',id,this.getTableData);
    },
    //批量删除
    allDelet(){
      this.globelDelet('/SiteManagement/stationType/delete',this.stationTypeId,this.getTableData);
    },
    //获取表格数据
    getTableData(){
       this.loading=true;
       let str='';
       if(this.searchModel == ''){
         str='%'
       }else{
        str=this.searchModel;
       }
       this.$http.post("/SiteManagement/stationType/query",this.paramsObj.GetPageData_P("stationType",this.currentPage,this.pageSize,[str],true)).then(res=>{
              if (res.data.code == 0) {
                   this.tableData=res.data.content.dataList;
                   this.total= res.data.content.totalRecords;
                   this.loading=false;
              }
       })
    },
    //提交表单数据
    submitForm(formName){
       this.$refs[formName].validate((valid) => {
           if (valid){
                if(this.isEditor){
                   let params={};
                    params.stationTypeCode=this.formData.stationTypeCode;
                    params.stationTypeName=this.formData.stationTypeName;
                    params.remark=this.formData.remark;
                     params.stationTypeId=this.stationTypeId;
                    this.$http.post("/SiteManagement/stationType/edit",params).then(res=>{
                          if(res.data.code == 0){
                             this.$message({
                                message:res.data.message,
                                type:'success',
                                duration:1500,
                              });
                              this.visiDialog_add=false;
                              this.resetForm(formName)
                              this.getTableData();
                          }
                    })
                }else{
                    let params={};
                    params.stationTypeCode=this.formData.stationTypeCode;
                    params.stationTypeName=this.formData.stationTypeName;
                    params.remark=this.formData.remark;
                    this.$http.post("/SiteManagement/stationType/edit",params).then(res=>{
                          if(res.data.code == 0){
                             this.$message({
                                message:res.data.message,
                                type:'success',
                                duration:1500,
                              });
                              this.visiDialog_add=false;
                              this.resetForm(formName)
                              this.getTableData();
                          }
                    })
                }
           }else{
             return false;
           }
       })
    },
    //重置表单
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.formData={
          stationTypeCode: "",
          stationTypeName: "",
          remark: "",
          lastUpdateTime: ""
        };
    },
    //编辑数据
    editorData(obj){
       this.visiDialog_add=true;
       this.isEditor=true;
       this.stationTypeId=obj.stationTypeId;
       this.formData={
          stationTypeCode: obj.stationTypeCode,
          stationTypeName: obj.stationTypeName,
          remark: obj.remark,
         
        };
    },
    //打开新增弹框
    basinAdd(){
      this.isEditor=false;
      this.visiDialog_add=true;
    },
    //关闭弹窗
    cancelForm(formName){
      this.visiDialog_add=false;
      this.resetForm(formName)
    },
    closess(done) {
      done();
      this.resetForm("form");
    },
  }
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
