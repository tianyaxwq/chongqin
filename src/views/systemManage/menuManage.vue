<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
           <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入"></el-input>
          </div>&emsp;&emsp;
           <el-button ><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button @click="add"><i class="iconfont icon-tianjia"></i>新增</el-button>
           <el-button type="delet"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
    </div>
    <div class="currency-mode-wrap">
        
          <el-table border :data="tableData" height="calc(100% - 30px)" @selection-change="selectChange" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                  <el-table-column
                      type="selection"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      type="index"
                      label="序号"
                      width="50">
                  </el-table-column>
                  <!-- <el-table-column
                      prop="mn"
                      label="图标">
                  </el-table-column> -->
                  <el-table-column
                      prop="name"
                        width="220px"
                      label="菜单名称">
                  </el-table-column>
                  <el-table-column
                      prop="url"
                     
                      label="菜单地址">
                  </el-table-column>
                  <!-- <el-table-column
                      prop="stationname"
                      label="所属一级">
                  </el-table-column>
                  <el-table-column
                      prop="stationname"
                      label="所属二级">
                  </el-table-column> -->
                  <el-table-column
                      prop="seqNum"
                      width="100px"
                      label="菜单排序">
                  </el-table-column>
                  <el-table-column
                      prop="stationname"
                      label="菜单描述">
                  </el-table-column>
                   <el-table-column
                      prop="stationname"
                      label="是否启用">
                  </el-table-column>
                   <el-table-column
                      label="操作"
                      width="200">
                      <template  slot-scope="scope">
                           <div>
                                <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                                <el-button type="secondBtn"  @click="delet(scope.row.id)">删除</el-button>
                           </div>
                       </template>
                  </el-table-column>
          </el-table>
    </div>
    <el-dialog :visible.sync="visiDialog"  width="920px" :title="vTitle" :before-close="closess">
          <div class="dialogcontent">
              <el-form :model="formData" :rules="rules" ref="ruleForm" >
                   <table class="whTable">
                        <tr>  
                            <td width="16.5%"><span  class="rCode">菜单名称</span></td>
                            <td>
                               <el-form-item  prop="permissionName">
                                   <el-input placeholder="请输入" v-model="formData.permissionName"></el-input>
                               </el-form-item>
                            </td>
                            <td width="16.5%"><span>菜单地址</span></td>
                            <td>
                                <div style="margin-bottom:10px">
                                   <el-input placeholder="请输入" v-model="formData.url"></el-input>
                               </div>
                            </td>
                        </tr>
                        <tr>  
                            <td width="16.5%"><span >父级菜单</span></td>
                            <td>
                                <div style="margin-bottom:10px">
                                     <el-input placeholder="请输入" v-model="formData.permissionParentName" @focus="getFmenu"></el-input>
                                </div>
                            </td>
                            <td width="16.5%"><span class="rCode">菜单级别</span></td>
                            <td>
                               <el-form-item  prop="permissionLevel">
                                   <el-input placeholder="请输入" v-model="formData.permissionLevel"></el-input>
                               </el-form-item>
                            </td>
                        </tr>
                        <tr>  
                            <td width="16.5%"><span  class="rCode">菜单顺序</span></td>
                            <td>
                               <el-form-item  prop="seqNum">
                                   <el-input placeholder="请输入" v-model="formData.seqNum"></el-input>
                               </el-form-item>
                            </td>
                            <td width="16.5%"><span>菜单图标</span></td>
                            <td>
                               <div style="margin-bottom:10px">
                                   <el-input placeholder="请输入" v-model="formData.permissionPictureUrl"></el-input>
                               </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="16.5%"><span>是否启用</span></td>
                            <td colspan="3" style="text-align:left">
                               <div style="margin-bottom:10px">
                                   <el-radio v-model="formData.status" label="1">是</el-radio>
                                   <el-radio v-model="formData.status" label="2">否</el-radio>
                               </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="16.5%"><span>菜单描述</span></td>
                            <td colspan="3">
                              
                                   <el-input placeholder="请输入" v-model="formData.description" type="textarea"></el-input>
                              
                            </td>
                        </tr>
                   </table>
              </el-form>   
               
          </div>
           <div slot="footer">
              <el-button @click="submit('ruleForm')">提交</el-button>
              <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
          </div>
    </el-dialog>
    <el-dialog :visible.sync="visiDialogF"  width="920px" title="父级菜单" :before-close="closess">
         <div class="dialogcontent">
             <el-table border :data="fTableData" @select="selectChangeF" ref="multipleTable" @select-all="selectAll" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                  <el-table-column
                    type="selection"
                    width="50">
                  </el-table-column>
                   <el-table-column
                      prop="name"
                      label="菜单名称">
                  </el-table-column>
                  <el-table-column
                      prop="url"
                      label="菜单地址">
                  </el-table-column>
             </el-table>
         </div>
          <div slot="footer">
              <el-button @click="sureSelect">确定</el-button>
              <el-button type="noticonsecondBtn" @click="cencelSelect">返回</el-button>
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
      tableData: [],
      fTableData: [], //父级菜单选择列表
      vTitle: "菜单新增",
      visiDialog: false,
      visiDialogF: false,
      formData: {
        permissionName: "", //菜单名称
        url: "", //菜单地址
        permissionParentID: "", //父菜单ID
        permissionParentName: "", //父菜单名字
        permissionLevel: "", //菜单级别
        seqNum: "", //菜单顺序
        permissionPictureUrl: "", //菜单图标
        status: "1", //菜单状态
        description: "" //菜单描述
      },
      rules: {
        permissionName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],

        permissionLevel: [
          { required: true, message: "请输入菜单级别", trigger: "blur" }
        ],
        seqNum: [{ required: true, message: "请输入菜单顺序", trigger: "blur" }]
      },
      isEditor: false, //判断是新增还是修改状态
      fMenu: {}, //选择的父菜单
      id: "",//菜单ID
      menuData:[],
    };
  },
  created() {
      this.getAlllist()
      this.getList();
  },
  mounted() {},
  inject: ["globelDelet"],
  methods: {
    selectChange(val, index) {
      let arr = val;
      this.id = "";
      for (let i in arr) {
        this.id += arr[i].id + ",";
      }
      this.id = this.id.substring(0, this.id.length - 1);
    },
    //打开新增弹框
    add() {
      this.visiDialog = true;
      this.isEditor=false;
    },
    //删除
    delet(id) {
      this.globelDelet(
        "/AuthorityManagement/permissions/ids",
        id,
        this.getList
      );
    },
    //批量删除
    allDelet() {
      this.globelDelet(
        "/AuthorityManagement/permissions/ids",
        this.id,
        this.getList
      );
    },
    //打开父菜单弹框并且获取数据
    getFmenu() {
      this.visiDialogF = true;
      //实时获取菜单数据
      this.$http.get("AuthorityManagement/permissions/menus").then(res => {
        this.fTableData = res.data.content.dataList;
      });
    },
    //选择父菜单
    selectChangeF(selection, row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);
      this.fMenu = row;
    },
    selectAll() {
      this.$refs.multipleTable.clearSelection();
    },
    //确定选择的父菜单
    sureSelect() {
      this.formData.permissionParentID = this.fMenu.id; //父菜单ID
      this.formData.permissionParentName = this.fMenu.name; //父菜单名字
      this.visiDialogF = false;
    },
    //返回
    cencelSelect() {
      this.fMenu = {};
      this.visiDialogF = false;
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            let formData = new FormData();
              formData.append("appCode",this.toolObj.getCookie("appCode"));
            formData.append("permissionName", this.formData.permissionName);
            formData.append("url", this.formData.url);
            formData.append(
              "permissionParentID",
              this.formData.permissionParentID
            );
            formData.append("permissionLevel", this.formData.permissionLevel);
            formData.append("seqNum", this.formData.seqNum);
            formData.append(
              "permissionPictureUrl",
              this.formData.permissionPictureUrl
            );
            formData.append("status", this.formData.status);
            formData.append("description", this.formData.description);
            formData.append("permissionType", 1);
            formData.append("permissionId", this.id);
            this.$http
              .put("AuthorityManagement/permissions", formData)
              .then(res => {
                if (res.data.code == 0) {
                  this.resetForm(formName);
                  this.visiDialog = false;
                  this.getList();
                  this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000
                  });
                }
              });
          } else {
            let formData = new FormData();
           
             formData.append("appCode",this.toolObj.getCookie("appCode"));
            formData.append("permissionName", this.formData.permissionName);
            formData.append("url", this.formData.url);
            formData.append(
              "permissionParentID",
              this.formData.permissionParentID
            );
            formData.append("permissionLevel", this.formData.permissionLevel);
            formData.append("seqNum", this.formData.seqNum);
            formData.append(
              "permissionPictureUrl",
              this.formData.permissionPictureUrl
            );
            formData.append("status", this.formData.status);
            formData.append("description", this.formData.description);
            formData.append("permissionType", 1);
            this.$http
              .post("AuthorityManagement/permissions", formData)
              .then(res => {
                if (res.data.code == 0) {
                  this.resetForm(formName);
                  this.visiDialog = false;
                  this.getList();
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
    //关闭
    cancel(formName) {
      this.visiDialog = false;
      this.resetForm(formName);
    },
    closess(done) {
      done();
      this.resetForm("ruleForm");
    },
    //编辑
    revise(row) {
      
       this.id = row.id;
       this.isEditor = true;
       this.$http
        .get("AuthorityManagement/permissions/id", {
          params: {
            permissionId: this.id
          }
        })
        .then(res => {
          this.visiDialog = true;
          let info = res.data.content.info;
          this.formData = {
            permissionName: info.permissionName, //菜单名称
            url: info.url, //菜单地址
            permissionParentID: info.permissionParentID, //父菜单ID
            permissionParentName: "", //父菜单名字
            permissionLevel: info.permissionLevel, //菜单级别
            seqNum: info.seqNum, //菜单顺序
            permissionPictureUrl: info.permissionPictureUrl, //菜单图标
            status: info.status+'', //菜单状态
            description: info.description //菜单描述
          };
          for(let i in this.menuData){
              if(this.formData.permissionParentID == this.menuData[i].permissionId){
                   this.formData.permissionParentName = this.menuData[i].permissionName
              }
          }
        });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData={
          permissionName: "", //菜单名称
          url: "", //菜单地址
          permissionParentID: "", //父菜单ID
          permissionParentName: "", //父菜单名字
          permissionLevel: "", //菜单级别
          seqNum: "", //菜单顺序
          permissionPictureUrl: "", //菜单图标
          status: "1", //菜单状态
          description: "" //菜单描述
      }
     
    },
    getAlllist(){
      this.$http.get("AuthorityManagement/permissions").then(res => {
        this.menuData = res.data.content.dataList;
      });
    },
    getList() {
      this.$http.get("AuthorityManagement/permissions/menus").then(res => {
        this.tableData = res.data.content.dataList;
      });
    }
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
}
</style>
