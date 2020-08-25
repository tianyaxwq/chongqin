<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
          <span>企业 : </span>&nbsp;
          <div class="layoutBox">
            <el-select v-model="queryPrams.enterpriseId" filterable   clearable  placeholder="请选择" @change="enterChange">
                  <el-option
                    v-for="item in enterpriseLst"
                    :key="item.enterpriseId"
                    :label="item.enterpriseName"
                    :value="item.enterpriseId">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;    

          <span>排口编号 : </span>
           <div class="layoutBox">
             <el-input placeholder="请输入" clearable v-model="queryPrams.code"></el-input>
          </div>&emsp;&emsp;
          
          <span>是否安装检测设备 : </span>&nbsp;
          <div class="layoutBox">
            <el-select v-model="queryPrams.isMonitor" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
          
           <el-button @click="search"><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button @click="openDialog"><i class="iconfont icon-tianjia"></i>新增</el-button>
    </div>
    <div class="currency-mode-wrap">
          <el-table border :data="tableData" height="calc(100% - 37px)">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="code" label="排口编号"></el-table-column>
              <el-table-column prop="name" label="排口名称"></el-table-column>
              <el-table-column prop="position" label="安装位置"></el-table-column>
              <el-table-column prop="longitude" label="经度"></el-table-column>
              <el-table-column prop="latitude" label="维度"></el-table-column>
              <el-table-column prop="isMonitor" label="是否安装监测设备">
                <template slot-scope="scope">
                  <div> 
                      <span style="color:#36C25E;font-size:14px;" v-if="scope.row.isMonitor == 'y'">是</span>
                      <span style="color:#FF3333;font-size:14px;" v-if="scope.row.isMonitor == 'n'">否</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="signFix" label="标志牌安装形式"></el-table-column>
              <el-table-column prop="dischargeAddress" label="排放去向"></el-table-column>
              <el-table-column label="操作" width="200">
                <template  slot-scope="scope">
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
                :total="total">
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
          </div>
    </div>
    <el-dialog :visible.sync="visiDialog"  width="650px" :title="title" :before-close="close">
       <div class="dialogcontent">
             <div class="dialog-layout">
                <el-form :model="ruleForm" :rules="formRules" ref="ruleForm">
                    <ul  class="formul">
                      <li>
                          <div>
                              <span class="layoutspan">排口编码 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="code">
                                    <el-input placeholder="请输入" v-model="ruleForm.code"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                          <div>
                              <span class="layoutspan">排口名称 : </span>&nbsp;
                              <div class="layoutBox">
                                  <el-form-item prop="name">
                                        <el-input placeholder="请输入" v-model="ruleForm.name"></el-input>
                                  </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan">经度 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="longitude">
                                      <el-input placeholder="请输入" v-model="ruleForm.longitude"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                           <div>
                              <span class="layoutspan">维度 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="latitude">
                                  <el-input placeholder="请输入" v-model="ruleForm.latitude"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan">安装位置 : </span>&nbsp;
                              <div class="layoutBox" style="width:442px">
                                <el-form-item prop="position">
                                      <el-input placeholder="请输入" v-model="ruleForm.position"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan">企业 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="enterpriseId">
                                  <el-select v-model="ruleForm.enterpriseId" filterable  clearable  placeholder="请选择">
                                      <el-option v-for="item in enterpriseLst" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId"></el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                          </div>
                           <div>
                              <span class="layoutspan">排放去向 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="dischargeAddress">
                                  <el-input placeholder="请输入" v-model="ruleForm.dischargeAddress"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan">监测设备 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="isMonitor">
                                  <el-select v-model="ruleForm.isMonitor" filterable clearable placeholder="请选择">
                                        <el-option
                                          v-for="item in types"
                                          :key="item.value"
                                          :label="item.name"
                                          :value="item.value">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                          </div>
                           <div>
                              <span class="layoutspan">标志牌 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item>
                                  <el-input placeholder="请输入" v-model="ruleForm.signFix"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                     
                    </ul>
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
export default {
  name: "",
  data() {
    return {
      value:'',
      visiDialog:false,
      tableData:[],
      typeValue:'',
      codeValue:'',

      queryPrams:{
          code:'',
          enterpriseId:'',
          isMonitor:'',
          pageNo:1,
          pageSize:10
      },
      enterpriseLst:[],
      types:[
        {name:'是',value:'y'},
        {name:'否',value:'n'}
      ],

      ruleForm:{
        id:'',
        name:'',
        code:'',
        longitude:'',
        latitude:'',
        position:'',
        isMonitor:'',
        signFix:'',
        enterpriseId:'',
        dischargeAddress:''
      },
      title:'新增排口',


      formRules:{
          code: [
            { required: true, message: '请输入排口编号', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入排口名称', trigger: 'blur' },
          ],
          longitude: [
            { required: true, message: '请输入经度', trigger: 'blur' },
          ],
          latitude: [
            { required: true, message: '请输入维度', trigger: 'blur' },
          ],
          position: [
            { required: true, message: '请填写安装位置', trigger: 'blur' },
          ],
          isMonitor: [
            { required: true, message: '请选择是否有监测设备', trigger: 'change' },
          ],
          enterpriseId: [
            { required: true, message: '请选择企业', trigger: 'change' },
          ],
      },
      
      instructionsId:'',
      instructionsType_instructionsTypeId:'',
      instructionsType_code:'',
      currentPage: 1, //分页组件当前页
      total: 0, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20] //设置每页多少条
    };
  },
  inject:['globelDelet'],
  created() {
    this.getEnterprise();
    this.fetchData();
  },
  mounted(){
     
  },
  methods: {
    fetchData(){
      var me = this;
      me.loading=true;
      me.$http.get("/waterEnvXA/waterSite/queryByPage",{params:me.queryPrams}
      ).then(res=>{
          if(res.data.code == 0){
              me.tableData = res.data.content.dataList;
              me.total = res.data.content.totalRecords;
              me.loading = false;
          }
      })
    },
    search(){
      this.queryPrams.pageSize = 10;
      this.queryPrams.currentPage = 1;
      this.fetchData();
    },
    enterChange(v){
      if(v == null){
        
      };
    },
    getEnterprise(){
      var me = this;
        me.$http.get("/waterEnvXA/enter",{}).then(res=>{
           if(res.data.code == 0){
               me.enterpriseLst = res.data.content.dataList;
           }
        })
    },
    delet(id){
      this.globelDelet("/waterEnvXA/waterSite",id,this.fetchData);   
    },

    paginationSizeChange(v){
      this.pageSize=v;
      this.fetchData()
    },
    paginationChange(v){
      this.currentPage=v;
       this.fetchData()
    },
    //编辑指令
    edit(v){
        this.visiDialog=true;
        this.title = '编辑排口';
        this.ruleForm.id = v.id;
        this.ruleForm.name = v.name;
        this.ruleForm.code = v.code;
        this.ruleForm.longitude = v.longitude;
        this.ruleForm.latitude = v.latitude;
        this.ruleForm.position = v.position;
        this.ruleForm.isMonitor = v.isMonitor;
        this.ruleForm.signFix = v.signFix;
        this.ruleForm.enterpriseId = v.enterpriseId;
        this.ruleForm.dischargeAddress = v.dischargeAddress;
    },
    openDialog(){
        this.visiDialog = true;
        this.title = '新增排口';
        this.clearData();
    },
    //新增
    save(form){
      var me = this;
      me.$refs[form].validate((valid) => {
          if (valid) {   
              if(me.ruleForm.id){
                me.$http.put('/waterEnvXA/waterSite',me.ruleForm).then(res=>{
                    if(res.data.code == 0){
                        me.visiDialog=false;
                        me.$message({message: res.data.message,type: 'success',duration:700});
                        me.fetchData();
                        me.resetForm('ruleForm');
                    }else{
                        this.$message({message: res.data.message,type: 'warning', duration:700});
                    }
                })
              }else{
                me.$http.post('/waterEnvXA/waterSite',me.ruleForm).then(res=>{
                    if(res.data.code == 0){
                        me.visiDialog=false;
                        me.$message({message: res.data.message,type: 'success',duration:700});
                        me.fetchData();
                        me.resetForm('ruleForm');
                    }else{
                        this.$message({message: res.data.message,type: 'warning', duration:700});
                    }
                    
                })
              }
                
          }else{
            return false;
          }
      });
    },
    clearData(){
        this.resetForm('ruleForm');
        this.ruleForm = {
              id:'',
              name:'',
              code:'',
              longitude:'',
              latitude:'',
              isMonitor:'',
              signFix:'',
              enterpriseId:'',
              dischargeAddress:''
            };
    },
    //关闭
    close(){
        this.visiDialog=false;
        this.resetForm('ruleForm');
    },
    //重置表单
    resetForm(formName) {
        this.$refs[formName].resetFields();
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

.wrap_head{
    height: 45px;
    border: 1px solid #d6e3f2;
    border-bottom: 0px;
}

.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
  .layoutspan{
    width:90px;
  }
}
.dialogcontent .uploaddiv{
  padding-left: 72px;
}
.wrap_head{
    height: 45px;
    border: 1px solid #d6e3f2;
    border-bottom: 0px;
}

.layoutBox{
  width:170px;
}
</style>

