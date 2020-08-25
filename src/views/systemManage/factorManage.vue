<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
           <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入" v-model="searchModel"></el-input>
          </div>&emsp;&emsp;
           <el-button @click="getTableData"><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button @click="addData"><i class="iconfont icon-tianjia1"></i>新增</el-button>
           <el-button type="delet" @click="allDelet"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
    </div>
    <div class="currency-mode-wrap">
          <el-table border :data="tableData"  v-loading="loading"
               element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)" height="100%"
               row-key="areaId"
               :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="selectChange">
                  <el-table-column
                      type="selection"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      type="index"
                      label="序号"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      prop="projectName"
                      label="因子名称">
                  </el-table-column>
                  <el-table-column
                      prop="projectCode"
                      label="因子编码">
                  </el-table-column>
                  <el-table-column
                      prop="parentId"
                      label="因子类型">
                       <template  slot-scope="scope">
                          <div>
                              {{scope.row.projectType.projectTypeName}}
                          </div>
                       </template>
                  </el-table-column>
                  <el-table-column
                      prop="projectUnit"
                      label="因子单位">
                     
                  </el-table-column>
                  <el-table-column
                      prop="decimalDigits"
                      label="小数位数">
                  </el-table-column>
                   <el-table-column
                      prop="sortIndex"
                      label="排序">
                  </el-table-column>
                  <el-table-column
                      prop="remark"
                      label="是否启用">
                       <template  slot-scope="scope">
                          <div>
                              <span v-if="scope.row.enabled == 1">是</span>
                              <span v-if="scope.row.enabled == 0">否</span>
                             
                          </div>
                       </template>
                  </el-table-column>
                   <el-table-column
                      prop="remark"
                      label="是否重金属">
                       <template  slot-scope="scope">
                          <div>
                              <span v-if="scope.row.metal == 1">是</span>
                              <span v-if="scope.row.metal == 0">否</span>
                            
                          </div>
                       </template>
                  </el-table-column>
                   <el-table-column
                      label="操作"
                      width="200">
                       <template  slot-scope="scope">
                          <div>
                             <el-button type="secondBtn" @click="editorData(scope.row)">编辑</el-button>
                                <el-button type="secondBtn" @click="delet(scope.row.projectId)">删除</el-button>
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
          </div> -->
    </div>
     <el-dialog :visible.sync="visiDialog_add"  width="920px" title="因子新增" :before-close="closess">
          <div class="dialogcontent">

                <div class="dialog-layout">
                    <el-form :model="formData" :rules="formRules" ref="form">
                      <table class="whTable">
                            <tr>
                                 <td width="16.5%"><span  class="rCode">因子名称</span></td>
                                 <td>
                                    <el-form-item  prop="projectName">
                                        <el-input placeholder="请输入" v-model="formData.projectName"></el-input>
                                    </el-form-item>
                                 </td>
                                 <td width="16.5%"><span  class="rCode">因子编码</span></td>
                                 <td>
                                     <el-form-item  prop="projectCode">
                                        <el-input placeholder="请输入" v-model="formData.projectCode"></el-input>
                                     </el-form-item>
                                 </td>
                            </tr>
                            <tr>
                                 <td width="16.5%"><span  class="rCode">因子类型</span></td>
                                 <td>
                                     <el-form-item  prop="projectType">
                                        <el-select v-model="formData.projectType" placeholder="请选择">
                                                    <el-option
                                                      v-for="item in projectTypeData"
                                                      :key="item.projectTypeId"
                                                      :label="item.projectTypeName"
                                                      :value="item.projectTypeId">
                                                    </el-option>
                                        </el-select>
                                     </el-form-item>
                                 </td>
                                 <td width="16.5%"><span class="rCode">因子单位</span></td>
                                 <td>
                                    <div style="margin-bottom:10px">
                                        <el-form-item  prop="projectUnit">
                                        <el-input placeholder="请输入" v-model="formData.projectUnit"></el-input>
                                        </el-form-item>
                                        
                                    </div>
                                 </td>
                                
                            </tr>
                             <tr>
                                 <td width="16.5%"><span >小数位数</span></td>
                                 <td>
                                    <el-form-item >
                                         <el-input placeholder="请输入" v-model="formData.decimalDigits"  type="number"></el-input>
                                    </el-form-item>
                                 </td>
                                 <td width="16.5%"><span>排序</span></td>
                                 <td>
                                     <el-form-item>
                                        <el-input placeholder="请输入" v-model="formData.sortIndex" type="number"></el-input>
                                     </el-form-item>
                                 </td>
                            </tr>
                             <tr>
                                 <td width="16.5%"><span >是否启用</span></td>
                                 <td>
                                    <div style="margin-bottom:10px">
                                          <el-radio v-model="formData.enabled" label="1">是</el-radio>
                                          <el-radio v-model="formData.enabled" label="0">否</el-radio>
                                      </div>
                                 </td>
                                 <td width="16.5%"><span>是否重金属</span></td>
                                 <td>
                                      <div style="margin-bottom:10px">
                                          <el-radio v-model="formData.metal" label="1">是</el-radio>
                                          <el-radio v-model="formData.metal" label="0">否</el-radio>
                                      </div>
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
      searchModel:'',
      visiDialog_add:false,
      tableData:[],
      optionFarea:[],
      targetLevelData:[],
      formData:{
         projectName:"",
         projectCode: "",
         projectId: "",
         projectType:"",
         projectUnit:"",
         decimalDigits:"",
         sortIndex:"",
         enabled:"1",
         metal:"0",
      },
      formRules:{
          projectName: [
            { required: true, message: '请输入因子名称', trigger: 'blur' },
          ],
          projectCode: [
            { required: true, message: '请输入因子编码', trigger: 'blur' },
          ],
          projectUnit: [
            { required: true, message: '请输入因子单位', trigger: 'blur' },
          ],
          projectType: [
            { required: true, message: '请选择因子类型', trigger: 'change' },
          ],
         
      },
      projectTypeData:[],
      loading:true,
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      isEditor:false,
      projectId:'',
    };
  },
  created() {
    this.init()
  },
  mounted(){
     
  },
  inject:['globelDelet'],
  methods: {
      selectChange(val, index){
        let arr =val;
        this.projectId='';
        for(let i in arr){
            this.projectId+=arr[i].projectId+',';
        };
        this.projectId=this.projectId.substring(0,this.projectId.length-1);
    },
    //删除
    delet(id){
       this.globelDelet('/SiteManagement/index/delete',id,this.getTableData);
    },
    //批量删除
    allDelet(){
      this.globelDelet('/SiteManagement/index/delete',this.projectId,this.getTableData);
    },
    init(){
      //获取水质目标等级下拉框数据
      this.$http.post("/SiteManagement/indexType/query").then(res => {
        if (res.data.code == 0) {
          this.projectTypeData = res.data.content.dataList;
        
        }
      });
      this.getTableData()
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
       this.$http.post("/SiteManagement/index/query",this.paramsObj.GetPageData_P("factor",this.currentPage,this.pageSize,[str],true)).then(res=>{
              if (res.data.code == 0) {
                   this.tableData=res.data.content.dataList;
                
                   this.loading=false;
              }
       })
      
    },
    //新增弹框
    addData(){
       this.visiDialog_add=true;
       this.isEditor=false;
    },
    //提交表单数据
    submitForm(formName){
       this.$refs[formName].validate((valid) => {
           if (valid){
                if(this.isEditor){
                    let params={};                                
                    params.projectName=this.formData.projectName;
                    params.projectCode=this.formData.projectCode;
                    //params.typeId=this.formData.projectType;
                    params.projectUnit=this.formData.projectUnit;
                    params.decimalDigits=this.formData.decimalDigits;
                    params.sortIndex=this.formData.sortIndex;
                    params.enabled=this.formData.enabled;
                    params.metal=this.formData.metal;
                    params.projectId=this.projectId;
                    this.$http.post("/SiteManagement/index/edit?typeId="+this.formData.projectType+"",params).then(res=>{
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
                    params.projectName=this.formData.projectName;
                    params.projectCode=this.formData.projectCode;
                    //params.typeId=this.formData.projectType;
                    params.projectUnit=this.formData.projectUnit;
                    params.decimalDigits=this.formData.decimalDigits;
                    params.sortIndex=this.formData.sortIndex;
                    params.enabled=this.formData.enabled;
                    params.metal=this.formData.metal;
                    this.$http.post("/SiteManagement/index/edit?typeId="+this.formData.projectType+"",params).then(res=>{
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
        this.optionFarea=[];
        this.formData={
         projectName:"",
         projectCode: "",
         projectId: "",
         projectType:"",
         projectUnit:"",
         decimalDigits:"",
         sortIndex:"",
         enabled:"1",
         metal:"0",
        };
    },
   
    //编辑数据
   
    editorData(obj){
       this.visiDialog_add=true;
       this.isEditor=true;
       this.projectId=obj.projectId;
       this.formData={
            projectName: obj.projectName,
            projectCode: obj.projectCode,
            projectType:obj.projectType.projectTypeId,
            projectUnit:obj.projectUnit,
            sortIndex:obj.sortIndex,
            decimalDigits:obj.decimalDigits,
            enabled:obj.enabled+'',
             metal:obj.metal+''
         
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
    cancelForm(formName){
      this.visiDialog_add=false;
      this.resetForm(formName)
    },
    closess(done) {
      done();
      this.resetForm("form");
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

}
</style>
