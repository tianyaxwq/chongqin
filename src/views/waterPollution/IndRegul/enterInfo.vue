<template>
    <div class="historypage tapStyle secondary-page-mode" style="margin-top:0px">
        <div class="currency-mode-wrap" style="height: 100%;margin-top:0px">
            <yf-tabs type="border-card" >
            <yf-tab-pane label="企业基本信息">
                <el-scrollbar style="height:100%">
                    <div class="baseinfo">
                    <el-form :model="ruleForm" :rules="enterRules" ref="ruleForm">
                        <ul>
                           <li>
                              <span class="layoutspan"><i>*</i>企业名称 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="enterpriseName">
                                    <el-input v-model="ruleForm.enterpriseName" style="width:250px;"></el-input>
                                </el-form-item>
                              </div>
                              <span class="layoutspan"><i>*</i>企业编号 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="enterpriseCode">
                                    <el-input v-model="ruleForm.enterpriseCode" style="width:250px;"></el-input>
                                </el-form-item>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan"><i>*</i>所属区域 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="areaName">
                                    <el-select
                                        v-model="ruleForm.areaName"
                                        placeholder="请选择"
                                        size="small"
                                        style="width:250px;"
                                        >
                                        <el-option
                                            v-for="item in optionDataArea"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                              </div>
                              <span class="layoutspan"><i>*</i>所属行业 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="enterpriseType">
                                    <el-select
                                        v-model="ruleForm.enterpriseType"
                                        placeholder="请选择"
                                        size="small"
                                        style="width:250px;"
                                        >
                                        <el-option
                                            v-for="item in optionDataHy"
                                            :key="item.industryName"
                                            :label="item.industryName"
                                            :value="item.industryName"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan">联系人 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="leaderName">
                                    <el-input
                                        placeholder="请输入"
                                        v-model="ruleForm.leaderName"
                                        size="small"
                                        style="width:250px"
                                        ></el-input>
                                </el-form-item>
                              </div>
                              <span class="layoutspan">联系电话 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="tel">
                                    <el-input
                                        placeholder="请输入"
                                        v-model="ruleForm.tel"
                                        size="small"
                                        style="width:250px"
                                        ></el-input>
                                </el-form-item>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan">上年实际产量 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="num">
                                    <el-input
                                        placeholder="请输入"
                                        v-model="ruleForm.num"
                                        size="small"
                                        style="width:250px"
                                        ></el-input>
                                </el-form-item>
                              </div>
                              <span class="layoutspan"><i>*</i>企业状态 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="state">
                                    <el-select
                                        v-model="ruleForm.state"
                                        placeholder="请选择"
                                        size="small"
                                        style="width:250px"
                                        >
                                        <el-option
                                            v-for="item in optionDataEnstatus"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                        </el-select>
                                </el-form-item>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan">技术改造措施 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="num">
                                    <el-select
                                        v-model="ruleForm.technologyMeasures"
                                        placeholder="请选择"
                                        size="small"
                                        style="width:250px"
                                        >
                                        <el-option
                                            v-for="item in technologs"
                                            :key="item.technologyName"
                                            :label="item.technologyName"
                                            :value="item.technologyName"
                                        ></el-option>
                                        </el-select>
                                </el-form-item>
                              </div>
                              <span class="layoutspan">企业地址 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item  prop="location">
                                    <el-input
                                        placeholder="请输入"
                                        v-model="ruleForm.location"
                                        size="small"
                                        style="width:250px"
                                        ></el-input>
                                </el-form-item>
                              </div>
                          </li>
                        </ul>  
                    </el-form>
                  </div> 
                  <div>
                        
                  </div>
                  <div class="btn" style="text-align: center">
                        <el-button @click="addEnterInfo('ruleForm')" type="noticon">保存</el-button>
                        <el-button type="noticonsecondBtn" @click="backEnterInfo">返回</el-button>
                  </div>
                </el-scrollbar>
            </yf-tab-pane>
            <yf-tab-pane label="污水排口管理">
                <div class="secondary-toolbar">
                    <span>关键字 : </span>
                    <div class="layoutBox">
                        <el-input placeholder="请输入" clearable v-model="queryPrams.keyword"></el-input>
                    </div>&emsp;&emsp;
                    <el-button @click="searchSite"><i class="iconfont icon-sousuo"></i>查询</el-button>
                    <el-button @click="openAddSiteDialog"><i class="iconfont icon-tianjia"></i>新增</el-button>
                </div>
                 <div class="currency-mode-wrap">
                    <el-table border :data="siteTableData" height="calc(100% - 37px)">
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
                                <el-button type="secondBtn" @click="editSite(scope.row)">编辑</el-button>
                                <el-button type="secondBtn" @click="deletSite(scope.row.id)">删除</el-button>
                            </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-pagination-wrap">
                        <el-pagination
                            @size-change="paginationSiteSizeChange"
                            @current-change="paginationSiteChange"
                            :current-page.sync="siteCurrentPage"
                            :page-size="sitePageSize"
                            popper-class="select-pagination-option"
                            background
                            :small="true"
                            :page-sizes="sitePageList"
                            layout="total, sizes, slot,->,prev, pager, next, jumper"
                            :total="siteTotal">
                            <template v-slot:default>
                            <span class="el-pagination__current">当前第{{ siteCurrentPage }}/{{siteTotalPageNumber}}页</span>
                            </template>
                        </el-pagination>
                    </div>
                </div>
            </yf-tab-pane>
            <yf-tab-pane label="排放标准管理">
                <div class="secondary-toolbar">
                    <span>关键字 : </span>
                    <div class="layoutBox">
                        <el-input placeholder="请输入" clearable v-model="queryStandardPrams.keyword"></el-input>
                    </div>&emsp;&emsp;
                    <el-button @click="searchStandard"><i class="iconfont icon-sousuo"></i>查询</el-button>
                    <el-button @click="openStandardDialog"><i class="iconfont icon-tianjia"></i>新增</el-button>
                </div>
                 <div class="currency-mode-wrap">
                    <el-table border :data="standTableData" height="calc(100% - 37px)">
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="siteCode" label="排口编号"></el-table-column>
                        <el-table-column prop="siteName" label="排口名称"></el-table-column>
                        <el-table-column prop="polluteCode" label="污染编号"></el-table-column>
                        <el-table-column prop="polluteName" label="污染名称"></el-table-column>
                        <el-table-column prop="standType" label="标准类型"></el-table-column>
                        <el-table-column prop="exeStand" label="执行标准"></el-table-column>
                        <el-table-column prop="upperValue" label="标准值上限"></el-table-column>
                        <el-table-column prop="lowerValue" label="标准值下限"></el-table-column>
                        <el-table-column label="操作" width="200">
                            <template  slot-scope="scope">
                            <div>
                                <el-button type="secondBtn" @click="editStand(scope.row)">编辑</el-button>
                                <el-button type="secondBtn" @click="deletStand(scope.row.id)">删除</el-button>
                            </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-pagination-wrap">
                        <el-pagination
                            @size-change="paginationStandardSizeChange"
                            @current-change="paginationStandardChange"
                            :current-page.sync="standardCurrentPage"
                            :page-size="standardPageSize"
                            popper-class="select-pagination-option"
                            background
                            :small="true"
                            :page-sizes="standardPageList"
                            layout="total, sizes, slot,->,prev, pager, next, jumper"
                            :total="standardTotal">
                            <template v-slot:default>
                            <span class="el-pagination__current">当前第{{ siteCurrentPage }}/{{siteTotalPageNumber}}页</span>
                            </template>
                        </el-pagination>
                    </div>
                </div>
                
            </yf-tab-pane>
            </yf-tabs>
        </div>

        <el-dialog :visible.sync="visiSiteDialog"  width="640px" :title="title" :before-close="close">
            <div class="dialogcontent">
             <div class="dialog-layout">
                <el-form :model="ruleSiteForm" :rules="formSiteRules" ref="ruleSiteForm">
                    <p class="lihead">排口信息</p>
                    <div class="libody clear">
                    <ul  class="formul">
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>排口编码 :</span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="code">
                                    <el-input placeholder="请输入" v-model="ruleSiteForm.code"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                          <div>
                              <span class="layoutspan"><i>*</i>排口名称 : </span>&nbsp;
                              <div class="layoutBox">
                                  <el-form-item prop="name">
                                        <el-input placeholder="请输入" v-model="ruleSiteForm.name"></el-input>
                                  </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>经度 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="longitude">
                                      <el-input placeholder="请输入" v-model="ruleSiteForm.longitude"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                           <div>
                              <span class="layoutspan"><i>*</i>维度 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="latitude">
                                  <el-input placeholder="请输入" v-model="ruleSiteForm.latitude"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>安装位置 : </span>&nbsp;
                              <div class="layoutBox" style="width:450px">
                                <el-form-item prop="position">
                                      <el-input placeholder="请输入" v-model="ruleSiteForm.position"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                           <div>
                              <span class="layoutspan">排放去向 : </span>&nbsp;
                              <div class="layoutBox" style="width:450px">
                                <el-form-item prop="dischargeAddress">
                                  <el-input placeholder="请输入" v-model="ruleSiteForm.dischargeAddress"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>监测设备 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="isMonitor">
                                  <el-select v-model="ruleSiteForm.isMonitor" filterable clearable placeholder="请选择">
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
                                  <el-input placeholder="请输入" v-model="ruleSiteForm.signFix"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                     
                    </ul>
                    </div>
                </el-form>
             </div>
       </div>

       
        <div slot="footer" class="dialog-footer">
            <el-button type="noticon" @click="saveSite('ruleSiteForm')">保 存</el-button>
            <el-button type="noticonsecondBtn" @click="closeSite">关 闭</el-button>
        </div>
      </el-dialog>


      <el-dialog :visible.sync="standardDialog"  width="640px" :title="standTitle" :before-close="close">
            <div class="dialogcontent">
             <div class="dialog-layout">
                <el-form :model="ruleStandForm" :rules="formStandRules" ref="ruleStandForm">
                    <p class="lihead">排放标准</p>
                    <div class="libody clear">
                    <ul  class="formul">
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>排口 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="waterSiteId">
                                     <el-select
                                        v-model="ruleStandForm.waterSiteId"
                                        placeholder="请选择"
                                        size="small"
                                        >
                                        <el-option
                                            v-for="item in optionSite"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                              </div>
                          </div>
                          <div>
                              <span class="layoutspan"><i>*</i>污染物 : </span>&nbsp;
                              <div class="layoutBox">
                                    <el-form-item prop="polluteName">
                                      <el-select
                                        v-model="ruleStandForm.polluteName"
                                        @change="polluteChange"
                                        placeholder="请选择"
                                        size="small"
                                        >
                                        <el-option
                                            v-for="item in optionPollute"
                                            :key="item.projectCode"
                                            :label="item.projectName"
                                            :value="item"
                                        ></el-option>
                                    </el-select>
                                  </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>标准值下限 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="lowerValue">
                                      <el-input placeholder="请输入" v-model="ruleStandForm.lowerValue"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                           <div>
                              <span class="layoutspan"><i>*</i>标准值上限 : </span>&nbsp;
                              <div class="layoutBox">
                                <el-form-item prop="upperValue">
                                  <el-input placeholder="请输入" v-model="ruleStandForm.upperValue"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                          <div>
                              <span class="layoutspan"><i>*</i>标准类型 : </span>&nbsp;
                              <div class="layoutBox" style="width:450px">
                                <el-form-item prop="standType">
                                      <el-input placeholder="请输入" v-model="ruleStandForm.standType"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                      <li>
                           <div>
                              <span class="layoutspan"><i>*</i>执行标准 : </span>&nbsp;
                              <div class="layoutBox" style="width:450px">
                                <el-form-item prop="exeStand">
                                  <el-input placeholder="请输入" v-model="ruleStandForm.exeStand"></el-input>
                                </el-form-item>
                              </div>
                          </div>
                      </li>
                    </ul>
                    </div>
                </el-form>
             </div>
       </div>

       
        <div slot="footer" class="dialog-footer">
            <el-button type="noticon" @click="saveStand('ruleStandForm')">保 存</el-button>
            <el-button type="noticonsecondBtn" @click="closeStand">关 闭</el-button>
        </div>
      </el-dialog>

    </div>
</template>


<script>
import qs from "qs";

export default {
  name: "",
  data() {
    var me = this;
    var validateFile = (rule, value, callback) => {
				if (me.attachs.length == 0) {
				  callback(new Error("请上传应急文件"));
        }
         else {
          callback();
        }
		}

    return {
      visiSiteDialog:false,
      standardDialog:false,
      tableData:[],

      optionDataArea: [
        { value: 0, label: "雄县" },
        { value: 1, label: "安新" },
        { value: 2, label: "容城" }
      ],

      technologs:[],


      queryPrams:{
          enterpriseId:'',
          keyword:'',
          pageNo:1,
          pageSize:20
      },

      ruleForm:{
        enterpriseId: "",
        enterpriseName: "", //企业名称
        enterpriseCode: "", //企业编号
        areaName: "", //所属区域
        areaId: "", //所属区域Id
        enterpriseType: "", //所属行业
        enterpriseTypeId: "", //所属行业Id
        leaderName: "", //联系人
        tel: "", //联系电话
        num: "", //上年实际产量
        state: "", //企业状态
        technologyMeasures: "", //技术改造措施
        location: "" //企业地址
      },
      optionDataHy:[],
      optionDataEnstatus: [
        { value: 0, label: "正常营业" },
        { value: 1, label: "关停" }
      ],
      enterRules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        enterpriseCode: [
          { required: true, message: "请输入企业编号", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "请选择所属区域", trigger: "change" }
        ],
        enterpriseType: [
          { required: true, message: "请选择所属行业", trigger: "change" }
        ],
        state: [
          { required: true, message: "请选择企业状态", trigger: "blur" }
        ]
      },


      optionSite:[],
      optionPollute:[],
      formSiteRules:{
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
          ]
      },
      siteTableData:[],
      siteTotal: 0, //分页总条数
      siteCurrentPage: 1, //分页组件当前页
      sitePageSize: 10, //分页每页多少条数据
      sitePageList: [10, 15, 20], //设置每页多少条
      types:[
        {name:'是',value:'y'},
        {name:'否',value:'n'}
      ],

      ruleSiteForm:{
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

      loading:false,

      standTitle:'新增排放标准',
      ruleStandForm:{
        id:'',
        waterSiteId:'',
        enterpriseId:'',
        polluteCode:'',
        upperValue:'',
        lowerValue:'',
        standType:'',
        exeStand:''
      },
      queryStandardPrams:{
          enterpriseId:'',
          keyword:'',
          pageNo:1,
          pageSize:20
      },
      
      formStandRules:{
          waterSiteId: [
            { required: true, message: '请选择排口', trigger: 'change' },
          ],
          polluteName: [
            { required: true, message: '请选择污染物', trigger: 'change' },
          ],
          upperValue: [
            { required: true, message: '请输入标准值上限', trigger: 'blur' },
          ],
          lowerValue: [
            { required: true, message: '请输入标准值下限', trigger: 'blur' },
          ],
          standType: [
            { required: true, message: '请输入标准类型', trigger: 'blur' },
          ],
          exeStand: [
            { required: true, message: '请输入执行标准', trigger: 'blur' },
          ]
      },
      standTableData:[],
      standardTotal: 0, //分页总条数
      standardCurrentPage: 1, //分页组件当前页
      standardPageSize: 10, //分页每页多少条数据
      standardPageList: [10, 15, 20], //设置每页多少条
      
      
    };
  },
  inject:['globelDelet'],
  created() {
    this.fetchData();
  },
  mounted(){
     
  },
  methods: {
    fetchData(){
      this.$http.get("/waterEnvXA/waterIndustry").then(res => {
        this.optionDataHy = res.data.content.dataList;
      });
      this.$http.get("/waterEnvXA/technology").then(res => {
        this.technologs = res.data.content.dataList;
      });
      var enterInfo = this.$route.query.enterInfo;
      if(enterInfo){
          this.ruleForm = enterInfo;
      }
      this.getSiteData();
      this.getStandData();
      this.getSitOption();
      this.getIndexOption();
    },
    addEnterInfo(ruleForm){
        this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.ruleForm.enterpriseId) {
            this.$http.put("/waterEnvXA/enter",  qs.stringify(this.ruleForm,{skipNulls:true})).then(res => {
              if (res.data.code == 0) {
                this.$message({message: res.data.message,type: "success",duration: 1000 });
              }
            });
          } else {
            this.$http.post("/waterEnvXA/enter",  qs.stringify(this.ruleForm,{skipNulls:true})).then(res => {
              if (res.data.code == 0) {
                this.$message({message: res.data.message,type: "success",duration: 1000});
                this.ruleForm.enterpriseId = res.data.content.id;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    openAddSiteDialog(){
        if(this.ruleForm.enterpriseId){
            this.visiSiteDialog = true;
            this.ruleSiteForm.enterpriseId = this.ruleForm.enterpriseId;
        }else{
            this.$message({message: '请先添加企业信息',type: "error",duration: 1000});
        } 
    },
    backEnterInfo(){
        this.$router.push({path:'/waterPollution/IndRegul/enterInfoManage'});
    },

    getSiteData(){
        var me = this;
        if(me.ruleForm.enterpriseId){
            me.queryPrams.enterpriseId = me.ruleForm.enterpriseId;
            me.$http.get("/waterEnvXA/waterSite/queryByPage",{params:me.queryPrams}
            ).then(res=>{
            if(res.data.code == 0){
                me.siteTableData = res.data.content.dataList;
                me.siteTotal = res.data.content.totalRecords;
                me.loading = false;
            }
            })
        }else{
            me.siteTableData = [];
            me.siteTotal = 0;
        }
        
    },
    searchSite(){
      this.queryPrams.pageSize = 10;
      this.queryPrams.currentPage = 1;
      this.getSiteData();
    },
    //新增
    saveSite(ruleSiteForm){
      var me = this;
      me.$refs[ruleSiteForm].validate((valid) => {
          if (valid) {   
              if(me.ruleSiteForm.id){
                me.$http.put('/waterEnvXA/waterSite',me.ruleSiteForm).then(res=>{
                    if(res.data.code == 0){
                        me.visiSiteDialog=false;
                        me.$message({message: res.data.message,type: 'success',duration:700});
                        me.getSiteData();
                        me.resetForm('ruleSiteForm');
                    }else{
                        this.$message({message: res.data.message,type: 'warning', duration:700});
                    }
                })
              }else{
                me.$http.post('/waterEnvXA/waterSite',me.ruleSiteForm).then(res=>{
                    if(res.data.code == 0){
                        me.visiSiteDialog=false;
                        me.$message({message: res.data.message,type: 'success',duration:700});
                        me.getSiteData();
                        me.resetForm('ruleSiteForm');
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
    //编辑指令
    editSite(v){
        this.visiSiteDialog=true;
        this.title = '编辑排口';
        this.ruleSiteForm.id = v.id;
        this.ruleSiteForm.name = v.name;
        this.ruleSiteForm.code = v.code;
        this.ruleSiteForm.longitude = v.longitude;
        this.ruleSiteForm.latitude = v.latitude;
        this.ruleSiteForm.position = v.position;
        this.ruleSiteForm.isMonitor = v.isMonitor;
        this.ruleSiteForm.signFix = v.signFix;
        this.ruleSiteForm.enterpriseId = v.enterpriseId;
        this.ruleSiteForm.dischargeAddress = v.dischargeAddress;
    },
    deletSite(id){
      this.globelDelet("/waterEnvXA/waterSite",id,this.searchSite);   
    },
    closeSite(){
        this.visiSiteDialog=false;
        this.resetForm('ruleSiteForm');
    },
    paginationSiteSizeChange(v){
      this.pageSize=v;
      this.getSiteData()
    },
    paginationSiteChange(v){
      this.currentPage=v;
       this.getSiteData()
    },
    //查询企业污水排放口
    getSitOption(){
        var me = this;
        me.$http.get("/waterEnvXA/waterSite",{params:{enterpriseId:me.ruleForm.enterpriseId}}
        ).then(res=>{
          if(res.data.code == 0){
              me.optionSite = res.data.content.dataList;
          }
        })
    },
    //查询污染因子
    getIndexOption(){
        var me = this;
        var params = {};
        var assembleCondition = ["0"];
        params.assembleCondition = assembleCondition;
        var order = ["sortIndex,asc"];
        var assembleSql = {};
        assembleSql.order = order;
        var queryCondition = {};
        var property = ["projectType.projectTypeId"];
        var operator = ["="];
        var content = ["40282bb16a4400b9016a440107279999"];
        queryCondition.property = property;
        queryCondition.operator = operator;
        queryCondition.content = content;
        params.assembleSql = assembleSql;
        params.queryCondition = queryCondition;

        me.$http.post("/basicData/index/query",params
        ).then(res=>{
          if(res.data.code == 0){
              me.optionPollute = res.data.content.dataList;
          }
        })
    },  
    getStandData(){
        var me = this;
        if(me.ruleForm.enterpriseId){
            me.queryStandardPrams.enterpriseId = me.ruleForm.enterpriseId;
            me.$http.get("/waterEnvXA/standard/queryByPage",{params:me.queryStandardPrams}
            ).then(res=>{
            if(res.data.code == 0){
                me.standTableData = res.data.content.dataList;
                me.standardTotal = res.data.content.totalRecords;
                me.loading = false;
            }
            })
        }else{
            me.standTableData = [];
            me.standardTotal = 0;
        }
    },
    polluteChange(v){
        this.ruleStandForm.polluteCode = v.projectCode;
        this.ruleStandForm.polluteName = v.projectName;
        this.ruleStandForm.unit = v.projectUnit;
    },
    searchStandard(){
      this.queryStandardPrams.pageSize = 10;
      this.queryPrams.currentPage = 1;
      this.getStandData();
    },
    openStandardDialog(){
        if(this.ruleForm.enterpriseId){
            this.standardDialog = true;
            this.ruleStandForm.enterpriseId = this.ruleForm.enterpriseId;
        }else{
            this.$message({message: '请先添加企业信息',type: "error",duration: 1000});
        }
    },
    //新增
    saveStand(ruleStandForm){
      var me = this;
      me.$refs[ruleStandForm].validate((valid) => {
          if (valid) {   
              if(me.ruleStandForm.id){
                me.$http.put('/waterEnvXA/standard',me.ruleStandForm).then(res=>{
                    if(res.data.code == 0){
                        me.standardDialog=false;
                        me.$message({message: res.data.message,type: 'success',duration:700});
                        me.getStandData();
                        me.resetForm('ruleStandForm');
                    }else{
                        this.$message({message: res.data.message,type: 'warning', duration:700});
                    }
                })
              }else{
                me.$http.post('/waterEnvXA/standard',me.ruleStandForm).then(res=>{
                    if(res.data.code == 0){
                        me.standardDialog=false;
                        me.$message({message: res.data.message,type: 'success',duration:700});
                        me.getStandData();
                        me.resetForm('ruleStandForm');
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
     //编辑排放标准
    editStand(v){
        this.standardDialog = true;
        this.standTitle = '编辑排放标准';
        this.ruleStandForm = v;
    },
    deletStand(id){
      this.globelDelet("/waterEnvXA/standard",id,this.searchStandard);   
    },
    closeStand(){
        this.standardDialog=false;
        this.resetForm('ruleStandForm');
    },
    //重置表单
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    computed: {
        siteTotalPageNumber() {
        //计算总页数
        let number = 0;
        number = Math.ceil(this.siteTotal / this.sitePageSize);
        return number;
        }
    },
  }
};
</script>


<style scoped lang="less">
.historypage {
  height: 100%;
}

.edui-editor {
  background: #fff;
}

.layoutspan {
    width: 90px;
    i {
      color: red;
      margin-right: 4px;
      float: right;
    }
  }



.baseinfo {
  padding: 12px;
  width: 820px;
  margin: 40px auto;
  li {
    margin-bottom: 30px;
    .sousuo {
      cursor: pointer;
      display: inline-block;
      width: 34px;
      height: 30px;
      vertical-align: -2px;
      line-height: 30px;
      text-align: center;
    }
  }
}
.stationManage {
  .uploadImg {
    li {
      padding-left: 20px;
      margin-bottom: 12px;
      p {
        height: 32px;
        font-size: 16px;
        position: relative;
        &:before {
          content: "";
          width: 3px;
          height: 10px;
          background: #166bce;
          position: absolute;
          left: -10px;
          top: 5px;
        }
      }
    }
  }
}
.uploadBtnBox {
  margin-bottom: 32px;
  padding: 8px 0px 0px 8px;
  > span {
    color: rgba(153, 153, 153, 1);
  }
}
</style>