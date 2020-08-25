<template>
  <div style="height:100%;background: #eff3f5;" class="stationarch">
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
                  <el-col :span="24"><p class="namep">站点 : 橘子洲<span> (MN : 123456789)</span></p></el-col>
                </el-row>
                 <el-row>
                  <el-col :span="7"><p class="colp">负责人 : 曲丽丽</p></el-col>
                  <el-col :span="7"><p class="colp">站点级别 : 2A</p></el-col>
                  <el-col :span="10"><p class="colp">合同开始时间 : 2017-01-01</p></el-col>
                 
                </el-row>
                 <el-row>
                  <el-col :span="7"><p class="colp">安装时间 : 2017-01-01</p></el-col>
                  <el-col :span="7"><p class="colp">运营合同号 : 423562</p></el-col>
                  <el-col :span="10"><p class="colp">合同结束时间 : 2019-01-01</p></el-col>
                 
                </el-row>
            </div>
      </div>
      <div style="height:calc(100% - 130px)">
        <el-scrollbar style="height:100%">
          <yf-tabs type="border-card" style="height:100%">
           

           
            <yf-tab-pane label="详情">
              <div class="box_a box_layout">
                <div class="box_title_layout">
                          分析设备
                </div>
                <div class="box_table_layout clearfix">
                      <ul>
                        <li v-for="item in 9">
                            <p>
                                <i class="iconfont"></i>
                                <span class="span">水温/</span>
                                <span>水质自动分析仪</span>
                            </p>
                            <div class="div_c">
                                  <p>仪器厂家 : </p>
                                  <p>力合科技(湖南)股份有限公司</p>
                                  <p>分析方法 : 热电阻法</p>
                                  <p>检出限 : 无</p>
                                  <p>检出上下限 : 无</p>
                            </div>
                        </li>
                      </ul>
                </div>
              </div>
              <div class="box_a box_layout">
                <div class="box_title_layout">
                          故障信息
                </div>
                <div class="box_tool_layout">
                  <span>关键信息 : </span>&nbsp;
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
                <div class="box_table_layout second_tab_layout">
                    <yf-tabs type="border-card" style="height:100%">
                        <yf-tab-pane label="故障统计">
                                <el-table  :data="tableData" border style="height:100%">
                                      <el-table-column
                                        prop="name"
                                        label="设备名称">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="出厂编号">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="监测因子">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="总故障数">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="电源故障树">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="仪器故障数">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="仪器通讯故障数">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="仪器离线数">
                                      </el-table-column>
                                       <el-table-column
                                        prop="name"
                                        label="取水故障数">
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
                        </yf-tab-pane>
                        <yf-tab-pane label="故障详情">

                          故障详情
                        </yf-tab-pane>
                    </yf-tabs>
                </div>
              </div>
              <div class="box_b box_layout">
                <div class="box_title_layout">
                      备品备件更换记录
                </div>
                <div class="box_tool_layout">
                      <span>关键信息 : </span>&nbsp;
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
                        label="设备名称">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="出厂编号">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="监测因子">
                      </el-table-column>
                       <el-table-column
                        prop="name"
                        label="更换备件备品">
                      </el-table-column>    
                       <el-table-column
                        prop="name"
                        label="更换时间">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="该备品前次更换时间">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="更换人">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="更换原因">
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
                      试剂更换记录
                </div>
                <div class="box_tool_layout">
                      <span>关键信息 : </span>&nbsp;
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
                        label="设备名称">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="出厂编号">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="监测因子">
                      </el-table-column>
                       <el-table-column
                        prop="name"
                        label="更换时间">
                      </el-table-column>    
                       <el-table-column
                        prop="name"
                        label="试剂">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="该试剂前次更换时间">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="更换人">
                      </el-table-column> 
                       <el-table-column
                        prop="name"
                        label="更换原因">
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
                      历史质控记录
                </div>
                <div class="box_tool_layout">
                      <span>关键信息 : </span>&nbsp;
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
                        width="110"
                        label="质控日期">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                         width="110"
                        label="质控人员">
                      </el-table-column> 
                      <el-table-column
                        prop="name"
                        label="质控内容">
                          <template>
                            <div class="contnet_zk">
                                <span class="card">五参数周质控</span>
                                <span class="card">自动与手工对比测试</span>
                            </div>
                          </template>
                      </el-table-column> 
                      <el-table-column
                        prop="name"
                         width="110"
                        label="有无故障">
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
                      历史运维记录
                </div>
                <div class="box_tool_layout">
                      <span>关键信息 : </span>&nbsp;
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
                        width="110"
                        label="质控日期">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                         width="110"
                        label="巡检人员">
                      </el-table-column> 
                      <el-table-column
                        prop="name"
                        label="运维内容">
                          <template>
                            <div class="contnet_zk">
                                <span class="card">五参数周质控</span>
                                <span class="card">自动与手工对比测试</span>
                            </div>
                          </template>
                      </el-table-column> 
                      <el-table-column
                        prop="name"
                         width="110"
                        label="有无故障">
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
            </yf-tab-pane>
            <yf-tab-pane label="活动日历">

                  <div style="padding:10px">
                        活动日历
                  </div>
            </yf-tab-pane>
          </yf-tabs>
         </el-scrollbar>
      </div>
      <el-dialog :visible.sync="visiDialog"  width="750px" title="站点信息编辑" :before-close="closess">
       <div class="dialogcontent">
             <div class="dialog-layout">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <ul class="formul">
                      <li>
                          <div>
                                <span class="layoutspan">负责人 : </span>&emsp;
                                <div class="layoutBox input_code" style="width:178px">
                                    <el-form-item prop="responsi">
                                      <el-input v-model="ruleForm.responsi"></el-input>
                                    </el-form-item>
                                </div>
                          </div>
                          <div>
                                <span class="layoutspan" style="width:129px">站点级别 : </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                   <el-form-item prop="lev">
                                      <el-select v-model="ruleForm.lev" placeholder="请选择">
                                            <el-option
                                              v-for="item in optionData"
                                              :key="item.value"
                                              :label="item.label"
                                              :value="item.value">
                                            </el-option>
                                      </el-select>
                                    </el-form-item>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div>
                                <span class="layoutspan">运营合同号 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                    <el-form-item prop="contract">
                                      <el-input v-model="ruleForm.contract"></el-input>
                                    </el-form-item>
                                </div>
                          </div>
                          <div>
                               <span class="layoutspan" style="width:127px">安装时间 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                   <el-form-item prop="installdata">
                                      <el-date-picker
                                        v-model="ruleForm.installdata"
                                        type="date"
                                        placeholder="选择日期">
                                      </el-date-picker>
                                   </el-form-item>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div>
                                <span class="layoutspan">合同开始时间 :  </span>&emsp;
                                <div class="layoutBox" style="width:180px">
                                   <el-form-item  prop="startdata">
                                      <el-date-picker
                                        v-model="ruleForm.startdata"
                                        type="date"
                                        placeholder="选择日期">
                                      </el-date-picker>
                                  </el-form-item>
                                </div>
                          </div>
                          <div>
                               <span class="layoutspan" style="width:127px">合同结束时间 :  </span>&emsp;
                                <div class="layoutBox input_code" style="width:180px">
                                   <el-form-item prop="enddata">
                                    <el-date-picker
                                      v-model="ruleForm.enddata"
                                      type="date"
                                      placeholder="选择日期">
                                    </el-date-picker>
                                   </el-form-item>
                                </div>
                          </div>
                      </li>
                    </ul>
                </el-form>
             </div>
       </div>
       <div slot="footer" class="dialog-footer">
          <el-button type="noticon" @click="submitForm('ruleForm')">确 定</el-button>
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
        tableData:[{}],
        value:'',
        input:'',
        visiDialog:false,
        currentPage: 1, //分页组件当前页
        total: 200, //分页总条数
        pageSize: 10, //分页每页多少条数据
        pageList: [10, 15, 20], //设置每页多少条
        ruleForm:{
          responsi:'',
          lev:'',
          contract:'',
          installdata:'',
          startdata:'',
          enddata:'',
        },
        rules:{
          responsi: [
            { required: true, message: '请输入负责人', trigger: 'blur' },
          ],
          lev: [
            { required: true, message: '请选择级别', trigger: 'change' },
          ],
          contract: [
            { required: true, message: '请输入合同运营号', trigger: 'blur' },
          ],
          installdata: [
            { required: true, message: '请选择安装日期', trigger: 'change' },
          ],
          startdata: [
            { required: true, message: '请选择开始日期', trigger: 'change' },
          ],
          enddata: [
            { required: true, message: '请选择结束日期', trigger: 'change' },
          ],
        },
      }
  },
  created(){
     this.$store.commit("setShowlefttree", true);
  },
  methods:{
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    indexMethod(index) {
      return index + 1;
    },
    selectChange(){

    },
    closess(done) {
      done();
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
         width: 127px;
      }
}
.mesBox{
  height:120px;
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
  background: #fff;
  padding: 10px;
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
    min-height: 151px;
    ul{
      li{
        margin-right: 12px;
        margin-bottom: 12px;
        float: left;
        width:calc((100% - 48px)/5);
        border: 1px solid #cad9eb;
        &:nth-child(5n){
          margin-right: 0px;
        }
        >p{
          height: 30px;
          line-height: 30px;
          padding-left: 33px;
          border-bottom: 1px solid #cad9eb;
          .span{
            font-weight: 700;
          }
        }
        .div_c{
          padding: 10px;
          padding-top: 17px;
          p{
            height: 25px;
            &:first-child{
              height: 16px;
            }
          }
        }
      }
    }
  }
}
.contnet_zk{
  text-align: left;
  padding-left: 15px;
    .card{
      padding: 0px 9px;
      height: 22px;
      margin-right: 12px;
      line-height: 22px;
      display: inline-block;
      border: 1px solid #999;
      color: #1a1a1a;
    }
}
</style>
