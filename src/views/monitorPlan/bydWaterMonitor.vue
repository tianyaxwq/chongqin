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
        <el-button @click="visiDialog =true">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
         <el-button type="delet">
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
             <el-table-column label="报送部门" width="200" show-overflow-tooltip align="center" prop="reportunitName" fixed></el-table-column>
            <el-table-column label="监测部门" width="200" show-overflow-tooltip align="center" prop="monitorName" fixed></el-table-column>
            <el-table-column label="所在河流 " width="180" align="center" prop="river" fixed></el-table-column> 
            <el-table-column label="断面名称 " width="180" align="center" prop="stationName" fixed></el-table-column>
            <el-table-column label="断面代码" width="180" align="center" prop="stationCode"></el-table-column>
            <el-table-column label="经纬度" width="190" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.longitude}}</span>、<span>{{scope.row.latitude}}</span>
                  </div>
                </template>
            </el-table-column>
            <el-table-column label="跨界位置" width="180" align="center" prop="position"></el-table-column>
            <el-table-column label="采样日期" width="180" align="center" prop="receiveTime"></el-table-column>
            <el-table-column  align="center" label="水深" >
                <el-table-column  width="120" align="center" label="(m)" prop="depth">

                </el-table-column>
            </el-table-column>
             <el-table-column  align="center" label="流量" >
                <el-table-column  width="120" align="center" label="(m3)" prop="flow">

                </el-table-column>
            </el-table-column>
             <el-table-column  align="center" label="水温" >
                <el-table-column  width="120" align="center" label="(℃)" prop="temp">

                </el-table-column>
            </el-table-column>
             <el-table-column  align="center" label="化学需氧量" >
                <el-table-column  width="120" align="center" label="(mg/L)" prop="cod">

                </el-table-column>
            </el-table-column>
             <el-table-column  align="center" label="分析方法名称" >
                <el-table-column  width="120" align="center" label="标准号" prop="codAnalysisMethod">

                </el-table-column>
            </el-table-column>
              <el-table-column  align="center" label="氨氮" >
                <el-table-column  width="120" align="center" label="(mg/L)" prop="an">

                </el-table-column>
            </el-table-column>
              <el-table-column  align="center" label="分析方法名称" >
                <el-table-column  width="120" align="center" label="标准号" prop="anAnalysisMethod">

                </el-table-column>
            </el-table-column>
              <el-table-column  align="center" label="总磷" >
                <el-table-column  width="120" align="center" label="(mg/L)" prop="tp">

                </el-table-column>
            </el-table-column>
              <el-table-column  align="center" label="分析方法名称" >
                <el-table-column  width="120" align="center" label="标准号" prop="tpAnalysisMethod">

                </el-table-column>
            </el-table-column>
            <el-table-column label="备注" width="180" align="center" prop="receivingWater"></el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.farmId)">删除</el-button>
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
      <div class="dialogcontent noScrollX" style="height:580px">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px">
            <ul>
              <li class="liblock">
                <p class="lihead">基本信息</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="报送部门:">
                        <el-input placeholder="请输入" v-model="formData.reportunitName" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="监测部门:">
                        <el-input placeholder="请输入" v-model="formData.monitorName" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="断面名称:">
                        <el-input placeholder="请输入" v-model="formData.stationName" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="断面代码:">
                        <el-input placeholder="请输入" v-model="formData.stationCode" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="所在河流:">
                        <el-input placeholder="请输入" v-model="formData.river" style="width:280px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="采样日期 :">
                         <el-date-picker
                          v-model="formData.receiveTime"
                          type="date"
                          style="width:280px"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        ></el-date-picker>
                       
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
                    <el-col :span="24">
                      <el-form-item label="跨界位置:">
                        <el-input placeholder="请输入" v-model="formData.position" style="width:748px"></el-input>
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
                <p class="lihead">监测数据</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="水深:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.depth"
                          style="width:100px"
                          type="number"
                        ></el-input> (m)
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="流量:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.flow"
                          style="width:100px"
                          type="number"
                        ></el-input> (m3)
                      </el-form-item>
                    </el-col>
                   
                  </el-row>
                  <el-row>
                     <el-col :span="12">
                      <el-form-item label="水温:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.temp"
                          style="width:100px"
                          type="number"
                        ></el-input> (℃)
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="化学需氧量:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cod"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                         <el-input
                          placeholder="请输入分析方法"
                          v-model="formData.codAnalysisMethod"
                          style="width:150px"
                         
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="氨氮:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.an"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                         <el-input
                          placeholder="请输入分析方法"
                          v-model="formData.anAnalysisMethod"
                          style="width:150px"
                         
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="总磷:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tp"
                          style="width:100px"
                          type="number"
                        ></el-input> (mg/L)
                         <el-input
                          placeholder="请输入分析方法"
                          v-model="formData.tpAnalysisMethod"
                          style="width:150px"
                         
                        ></el-input>
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
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "",

  data() {
    return {
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
      vTitle: "白洋淀流域水质监测数据新增",
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
        id: "",
        reportunitName:"",//报送部门
        monitorName:"",//监测部门
        river:"",//所在河流
        stationName:"",//断面名称
        stationCode:"",//断面代码
        longitude:"",//经度
        latitude:"",//纬度
        position:"",//跨界位置
        remark:"",//备注
        receiveTime:null,//采样日期
        depth:null,//水深
        flow:null,//流量
        temp:null,//水温
        cod:null,//化学需氧量
        codAnalysisMethod:null,
        an:null,//氨氮
        anAnalysisMethod:null,
        tp:null,//总磷
        tpAnalysisMethod:null,
      },
      rules: {
        farmName: [
          { required: true, message: "请输入养殖场名称", trigger: "blur" }
        ]
      },
      factorList:[{factorName:'水温',factorUnit:'(℃)'},{factorName:'pH',factorUnit:'(无量纲)'},{factorName:'溶解氧',factorUnit:'(mg/L)'},{factorName:'高锰酸盐指数',factorUnit:'(mg/L)'},
      {factorName:'化学需氧量',factorUnit:'(mg/L)'},{factorName:'5日生化需氧量',factorUnit:'(mg/L)'},{factorName:'总磷',factorUnit:'(mg/L)'},{factorName:'总氮',factorUnit:'(mg/L)'}],
      loading: true,
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchTreedata();
    this.searchData()
  },
  methods: {
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
        this.ids += arr[i].farmId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    searchData() {
      this.loading = true;
      this.$http
        .get("/fileXA/basin/queryBasinArea", {
          params: {
            areaId: "",
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
                "/fileXA/basin/addBasinRiver",
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
                "/fileXA/basin/addBasinRiver",
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
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/waterFarm", id, this.searchData);
    },
    //批量删除
    allDelet() {
      this.globelDelet("/waterEnvXA/waterFarm", this.ids, this.searchData);
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
