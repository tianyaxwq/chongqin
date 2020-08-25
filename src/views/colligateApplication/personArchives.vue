<template>
  <div style="height:100%;background: #eff3f5;">
    <el-scrollbar style="height:100%">
      <div class="mesBox">
            <div class="imgbox">

            </div>
            <div class="btnbox">
                <el-button><i class="iconfont icon-daochu"></i>打印</el-button>
                <el-button><i class="iconfont icon-daochu"></i>导出</el-button>
                 <el-button @click="visiDialog=true"><i class="iconfont icon-daochu"></i>编辑</el-button>
            </div>
            <div class="mes">
                <el-row>
                  <el-col :span="12"><p class="namep">曲丽丽 <span>(编号 : 123456789)</span></p></el-col>
                  <el-col :span="12"><p class="mesp">基本信息</p></el-col>
                </el-row>
                 <el-row>
                  <el-col :span="6"><p class="colp">岗位 : 质检员</p></el-col>
                  <el-col :span="6"><p class="colp">电话 : 18711111111</p></el-col>
                  <el-col :span="6"><p class="colp">性别 : 女</p></el-col>
                  <el-col :span="6"><p class="colp">地址 : 湖南省长沙市岳麓区</p></el-col>
                </el-row>
                 <el-row>
                  <el-col :span="6"><p class="colp">负责站点数 : 12</p></el-col>
                  <el-col :span="6"><p class="colp">邮箱 : 623512262@qq.com</p></el-col>
                  <el-col :span="6"><p class="colp">学历 : 本科</p></el-col>
                  <el-col :span="6"><p class="colp" title="430681199209100956">身份证 : 430681199209100956</p></el-col>
                </el-row>
                 <el-row>
                  <el-col :span="6"><p class="colp">负责设备数 : 1)</p></el-col>
                  <el-col :span="6"><p class="colp">入职时间 : 2019-01-01</p></el-col>
                  <el-col :span="6"><p class="colp">能力等级 : 高级</p></el-col>
                  <el-col :span="6"><p class="colp" title="环保工程师.doc 环保工程师.doc">证书信息 : 环保工程师.doc 环保工程师.doc</p></el-col>
                </el-row>
            </div>
      </div>
      <div class="box_a box_layout">
            <div class="box_title_layout">
                  历史考核信息
            </div>
            <div class="box_tool_layout">
                  <span>考核类型 : </span>&nbsp;
                  <div class="layoutBox" style="width:120px">
                    <el-select v-model="value" multiple collapse-tags placeholder="请选择" @change="selectChange">
                          <el-option
                            v-for="item in optionData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                    </el-select>
                  </div>&emsp;&emsp;
                  <span>时间范围 : </span>&nbsp;
                  <div class="layoutBox" style="width:242px">
                    <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </div>&emsp;&emsp;
                 
            </div>
            <div class="box_table_layout">
                  <el-table
                      :data="tableData"
                      border
                      style="height:100%">
                      <el-table-column
                        type="index"
                        label="序号"
                        :index="indexMethod"
                        width="50">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="考核时间">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="考核存档时间">
                      </el-table-column>
                       <el-table-column
                        prop="name"
                        label="考核得分">
                      </el-table-column>    
                       <el-table-column
                        prop="name"
                        label="得分等级">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="考核说明">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="详情">
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
      </div>
      <div class="box_b box_layout">
            <div class="box_title_layout">
                  历史运维工作信息
            </div>
            <div class="box_tool_layout">
                  <span>工作内容 : </span>&nbsp;
                  <div class="layoutBox" style="width:120px">
                    <el-select v-model="value" multiple collapse-tags placeholder="请选择" @change="selectChange">
                          <el-option
                            v-for="item in optionData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                    </el-select>
                  </div>&emsp;&emsp;
                  <span>时间范围 : </span>&nbsp;
                  <div class="layoutBox" style="width:242px">
                    <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </div>&emsp;&emsp;
                 
            </div>
            <div class="box_table_layout">
                  <el-table
                      :data="tableData"
                      border
                      style="height:100%">
                      <el-table-column
                        prop="name"
                        label="站点">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="设备">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="记录时间">
                      </el-table-column>
                       <el-table-column
                        prop="name"
                        label="记录单号">
                      </el-table-column>    
                       <el-table-column
                        prop="name"
                        label="工作内容">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="内容说明">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="详情">
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
      </div>

    </el-scrollbar>
    <el-dialog :visible.sync="visiDialog"  width="660px" title="基础信息编辑" :before-close="closess">
       <div class="dialogcontent">
             <div class="dialog-layout">
                    <ul class="formul">
                      <li>
                          <div>
                                <span class="layoutspan">岗位 : </span>&emsp;
                                <div class="layoutBox input_code" style="width:178px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                          <div>
                                <span class="layoutspan" style="width:129px">电话 : </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div>
                                <span class="layoutspan">性别 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                          <div>
                               <span class="layoutspan" style="width:127px">籍贯 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div>
                                <span class="layoutspan">负责站点数 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                          <div>
                               <span class="layoutspan" style="width:127px">邮箱 :  </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div>
                                <span class="layoutspan">学历 :  </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                          <div>
                               <span class="layoutspan" style="width:127px">身份证 :  </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                      </li>
                       <li>
                          <div>
                                <span class="layoutspan">负责设备数 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                  <el-input v-model="input" ></el-input>
                                </div>
                          </div>
                          <div>
                               <span class="layoutspan" style="width:127px">入职时间 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                  <el-date-picker
                                    v-model="value"
                                    type="date"
                                    placeholder="选择日期">
                                  </el-date-picker>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div style="width:100%">
                                <span class="layoutspan">能力等级 : </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                    <el-select v-model="value" placeholder="请选择">
                                          <el-option
                                            v-for="item in optionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                          </el-option>
                                    </el-select>
                                </div>
                          </div>
                      </li>
                     
                      <li>
                          <span class="layoutspan">证书信息 : </span>&emsp;
                                <el-upload
                                  class="upload-demo"
                                  ref="upload"
                                  action="https://jsonplaceholder.typicode.com/posts/"
                                  :on-preview="handlePreview"
                                  :on-remove="handleRemove"
                                  :file-list="fileList"
                                  :auto-upload="false">
                                  <span slot="trigger" class="upload_span_sc"><i class="icon-shangchuan1 iconfont"></i> 上传</span>
                                 
                                </el-upload>
                      </li>
                    </ul>
             </div>
       </div>
       <div slot="footer" class="dialog-footer">
          <el-button type="noticon" @click="visiDialog = false">确 定</el-button>
          <el-button type="noticonsecondBtn" @click="visiDialog = false">取 消</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data(){
      return{
        optionData:[],
        dateRange:[],
        tableData:[],
        visiDialog:false,
        value:'',
        fileList:[],
        input:'',
        currentPage: 1, //分页组件当前页
        total: 200, //分页总条数
        pageSize: 10, //分页每页多少条数据
        pageList: [10, 15, 20] //设置每页多少条
      }
  },
  created(){
     this.$store.commit("setShowlefttree", true);
  },
  methods:{
    indexMethod(index) {
      return index + 1;
    },
    selectChange(){

    },
    closess(done) {
      done();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
    },
    paginationSizeChange(val) {
      //分页pageSize改变时执行
      this.currentPage = 1;
      this.pageSize = val;
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
}
</script>

<style scoped lang="less">
.dialog-layout{
     .layoutspan{
         width: 78px;
      }
}
.mesBox{
  height:147px;
  border: 1px solid #d9e6f7;
  background: #fff;
  margin-bottom: 10px;
  padding: 0px 250px 0px 100px;
  position: relative;
  .mes{
    height: 100%;
    width: 100%;
    padding-top: 14px;
    .colp{
      height: 26px;
      line-height: 26px;
      min-width: 188px;
       overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
    }
    .namep{
      height: 38px;
      font-size: 16px;
      font-weight: 700;
      span{
        font-weight: 400;
        font-size: 13px;
        color: #999;
      }
    }
    .mesp{
      height: 38px;
      font-size: 16px;
      font-weight: 700;
      position: relative;
       padding-left: 10px;
      &:before{
        content:'';
        width: 3px;
        height: 10px;
        background: #166bce;
        position: absolute;
        left: 2px;
        top: 6px;
      }
    }
  }
  .imgbox{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #eff3f5;
    position: absolute;
    left: 15px;
    top: 15px;
  }
  .btnbox{
    width: 250px;
    position: absolute;
    right: 15px;
    top: 15px;
  }
}
.box_a{
  margin-bottom: 10px;

}
.box_layout{
  border: 1px solid #d9e6f7;
  background: #fff;
  padding: 10px;
  height: calc((100% - 167px)/2);
  min-height: 255px;
  .box_title_layout{
    font-size: 16px;
    color: #1a1a1a;
    padding-left: 10px;
    position: relative;
    margin-bottom: 10px;
    &:before{
        content:'';
        width: 3px;
        height: 10px;
        background: #166bce;
        position: absolute;
        left: 2px;
        top: 6px;
    }
  }
  .box_tool_layout{
    margin-bottom: 10px;
  }
  .box_table_layout{
    height: calc(100% - 110px);
    min-height: 121px;
  }
}
</style>
