<template>
    <div class="processPage clearfix ">
        <div class="leftbox tree_content">
            <ul>
                <li v-for="(item,key) in processData" :key="key" :class="pIndex==key?'on':''" @click="pClick(item,key)">{{item.name}}</li>
            </ul>
        </div>
        <div class="rightbox secondary-page-mode" >
            <div class="secondary-toolbar clear">
                <div class="btn_grop">
                    <el-button @click="deletProcess">删除流程</el-button>
                    <!--<el-button @click="editorProcess">编辑流程</el-button>-->
                    <el-button @click="ceratedProcess">新建流程</el-button>
                    <el-button @click="deployProcess">部署流程</el-button>
                </div>
            </div>
            <div class="currency-mode-wrap"
                 v-loading="iframeLoading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <iframe :src="iframeSrc" id="processIframe" frameborder="none" style="margin-top: -40px;width: 100%;height: calc(100% + 40px);"></iframe>
            </div>
        </div>
        <el-dialog :visible.sync="visiDialog"  width="660px" title="流程新增" :before-close="closess">
            <div class="dialogcontent">
                <div class="dialog-layout">
                    <el-form :model="pObj" :rules="rules" ref="proForm">
                        <ul class="formul">
                            <li>
                                <div>
                                    <span class="layoutspan">流程名称 :  </span>&emsp;
                                    <div class="layoutBox input_code" style="width:180px">
                                        <el-form-item prop="name">
                                            <el-input v-model="pObj.name" ></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div>
                                    <span class="layoutspan " style="width:127px">流程key :  </span>&emsp;
                                    <div class="layoutBox input_code" style="width:180px">
                                        <el-form-item prop="key">
                                            <el-input v-model="pObj.key" ></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span class="layoutspan">流程分类 :  </span>&emsp;
                                    <div class="layoutBox" style="width:180px">

                                        <el-input v-model="pObj.category" ></el-input>

                                    </div>
                                </div>
                            </li>
                            <li>
                                <div style="width:100%">
                                    <span class="layoutspan">流程描述 :  </span>&emsp;
                                    <div class="layoutBox" style="width:510px">
                                        <el-input v-model="pObj.description" type="textarea" :rows="3"></el-input>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="noticon" @click="sureBtn('proForm')">确 定</el-button>
                <el-button type="noticonsecondBtn" @click="cancelBtn('proForm')">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {
                processData: [],
                pIndex:0,
                visiDialog:false,
                pId:'',//流程Id
                pObj:{
                    name:'',
                    key:'',
                    category:'',
                    description:'',
                },
                rules: {
                    name: [
                        { required: true, message: "请输入流程名称", trigger: "blur" },

                    ],
                    key: [
                        { required: true, message: "请输入流程Key", trigger: "blur" },

                    ],
                },
                iframeSrc:'',
                iframeLoading: true,
            };
        },
        created() {
            this.getProcess()
        },
        methods: {
            closess(done) {
                done();
            },
            pClick(item,key){
                this.pIndex=key;
                this.pId=item.id;
                this.iframeLoading = false;
                this.iframeSrc = "/DataAudit/modeler.html?modelId="+this.pId;
            },
            getProcess(){
                this.$http.get('/DataAudit/deploy/list').then((res)=>{
                    if(res.data.code == 0){
                        this.processData=res.data.content.dataList;
                        this.pId=res.data.content.dataList[0].id;
                        this.iframeSrc = "/DataAudit/modeler.html?modelId="+this.pId;
                    }
                })
            },
            //确定提交
            sureBtn(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params=this.pObj;
                        this.$http.get("/DataAudit/deploy/create",{
                            params:params
                        }).then(res=>{
                            if(res.data.code == 0){
                                this.$message({
                                    message: res.data.message,
                                    type: "success",
                                    duration: 1500
                                });
                                this.visiDialog=false;
                                this.resetForm(formName)
                                this.getProcess()
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            //取消
            cancelBtn(formName){
                this.visiDialog=false;
                this.resetForm(formName)
            },
            //新建流程
            ceratedProcess(){
                this.visiDialog=true;
            },
            //删除流程
            deletProcess(){
                this.$confirm("是否将选中的流程删除？", "消息提示", {
                    type: "warning",
                    center: true,
                    cancelButtonClass:'noticonsecondBtn',
                    confirmButtonClass: "",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(action =>{
                    this.$http.get("/DataAudit/deploy/delete/"+this.pId+"").then(res=>{
                        if(res.data.code == 0){
                            this.$message({
                                message: res.data.message,
                                type: "success",
                                duration: 1500
                            });
                            this.pIndex=this.pIndex--
                            this.getProcess()
                        }
                    })
                }).catch(function() {})

            },
            //编辑流程
            // editorProcess(){
            //     //alert(this.pId)
            //     // window.open("/activity/modeler.html?modelId="+this.pId);
            //     this.iftrameSrc = "/activity/modeler.html?modelId="+this.pId;
            // },
            //部署流程
            deployProcess(){
                //  alert(this.pId)
                // this.$message({
                //     message: "部署待完善!",
                //     type: "success",
                //     duration: 1500
                // });
                this.$confirm("是否将选中的流程部署？", "消息提示", {
                    type: "warning",
                    center: true,
                    cancelButtonClass:'noticonsecondBtn',
                    confirmButtonClass: "",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(action =>{
                    this.$http.get("/DataAudit/deploy/deploy/"+this.pId+"").then(res=>{
                        if(res.data.code == 0){
                            this.$message({
                                message: res.data.message,
                                type: "success",
                                duration: 1500
                            });
                            this.pIndex=this.pIndex--
                            this.getProcess()
                        }
                    })
                }).catch(function() {})
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        mounted(){
            let iframe = document.getElementById('processIframe');
            let _this = this;
            iframe.addEventListener("load", function() {
                setTimeout(()=>{
                    _this.iframeLoading = false;
                },1000);
            });
        },
        watch:{

        }
    };
</script>

<style scoped lang="less">
    .processPage {
        height: 100%;
        background: #eff3f5;
        .leftbox {
            border: 1px solid #d9e6f7;
            height: 100%;
            width: 300px;
            background: #fff;
            float: left;
            margin-right: 6px;
            padding: 12px;
            .treeTool{
                width: 275px;
                margin-bottom: 12px;
            }
            li{
                height: 30px;
                line-height: 30px;
                padding-left: 12px;
                cursor: pointer;
                &:hover{

                    color: #166bce;
                }
            }
            .on{
                background: #166bce;
                color: #fff;
                &:hover{

                    color: #fff;
                }
            }

        }
        .rightbox {
            float: right;
            height: 100%;
            width: calc(100% - 306px);
            .btn_grop {
                float: right;
            }
            .currency-mode-wrap {
                overflow: hidden;
                border: 1px solid #d9e6f7;
                height: calc(100% - 56px);
            }
        }
    }
</style>
