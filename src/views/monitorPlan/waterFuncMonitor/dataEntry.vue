<template>
  <div class="pageContent">
    <div class="dialogcontent noScrollX">
      <el-scrollbar style="height:100%">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px">
          <ul>
            <li class="liblock">
              <p class="lihead">基本信息</p>
              <div class="libody clear">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="监测断面名称:" prop="monitorStationName">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.monitorStationName"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="断面编码:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.monitorStationCode"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="一级水功能区名称:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.primaryWaterFunctionArea"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="二级水功能区名称:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.secondaryWaterFunctionArea"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="监测单位:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.monitorUnit"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="重要水功能区索引码 :">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.waterFunctionAreaCode"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="采样时间:">
                      <el-date-picker
                        v-model="formData.receiveTime"
                        type="date"
                        style="width:280px"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="参考目标:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.targetLevel"
                        style="width:280px"
                      ></el-input>
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
                        style="width:calc(100% - 150px)"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </li>
            <li class="liblock">
              <p class="lihead">监测因子</p>
              <div class="libody clear">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="水温:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.temp"
                        style="width:100px"
                        type="number"
                      ></el-input>(℃)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="PH:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.ph"
                        style="width:100px"
                        type="number"
                      ></el-input>(无量纲)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="溶解氧:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.do_"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="氨氮:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.an"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="总磷:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.tp"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="总氮:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.tn"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="高锰酸盐指数:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.permanganate"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="化学需氧量:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.cod"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="5日生化需氧量:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.bod5"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="铜:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.cu"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="锌:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.zn"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="氟化物:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.flu"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="硒:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.se"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="砷:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.as_"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="汞:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.hg"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="镉:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.cd"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="六价铬:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.cr"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="铅:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.pb"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="氰化物:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.cyanide"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="挥发酚:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.volatilePhenol"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="石油类:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.petroleum"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="阴离子表面活性剂:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.sdbs"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="粪大肠菌群:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.fecalColiform"
                        style="width:100px"
                        type="number"
                      ></el-input>(个/l)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="硫化物:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.sulfide"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="硫酸盐:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.sulfate"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="氯化物:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.chloride"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="硝酸盐:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.nitrate"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="铁:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.fe"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="锰:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.mn"
                        style="width:100px"
                        type="number"
                      ></el-input>(mg/L)
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </li>
            <li class="liblock">
              <p class="lihead">全因子评价</p>
              <div class="libody clear">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="水功能区水质类别:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.allFactorWaterQualityCategory"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="主要超标项目及其超标倍数:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.allFactorOverstandardProjectandtimes"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="达标评价结论:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.allFactorEvaluation_conclusion"
                        type="textarea"
                        :rows="3"
                        style="width:calc(100% - 150px)"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </li>
            <li class="liblock">
              <p class="lihead">水功能区限值纳污红线主要控制项目达标评价</p>
              <div class="libody clear">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="水功能区水质类别:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.limitFactorWaterQualityCategory"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="主要超标项目及其超标倍数:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.limitOverstandardProjectandtimes"
                        style="width:280px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="达标评价结论:">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.limitEvaluation_conclusion"
                        type="textarea"
                        :rows="3"
                        style="width:calc(100% - 150px)"
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
    <div class="btnBox">
      <el-button @click="submit('ruleForm')">提交</el-button>&emsp;&emsp;&emsp;&emsp;
      <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">重置</el-button>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "",

  data() {
    return {
 
      formData: {
        userAccount:null,
        id: null,
        monitorStationName: "", //监测断面名称
        monitorStationCode: "", //监测断面编码
        primaryWaterFunctionArea: "", //一级水功能区
        secondaryWaterFunctionArea: "", //二级水功能区
        monitorUnit: "", //监测单位
        waterFunctionAreaCode: "", //水功能区索引码
        receiveTime: null, //采样时间
        targetLevel: "", //参考目标
        remark: "", //备注
        limitEvaluation_conclusion: "", //水功能区限制评价结论
        limitOverstandardProjectandtimes: "", //水功能区超标项目及倍数
        limitFactorWaterQualityCategory: "", //水功能区水质类别
        allFactorWaterQualityCategory: "", //全因子水质类别
        allFactorOverstandardProjectandtimes: "", //全因子超标项目及倍数
        allFactorEvaluation_conclusion: "", //全因子评价结论
        an: null, //氨氮
        as_: null, //砷
        bod5: null, //五日生化需氧量
        cd: null, //镉
        chloride: null, //氯化物
        cod: null, //化学需氧量
        cr: null, //六价铬
        cu: null, //铜
        cyanide: null, //氰化物
        do_: null, //溶解氧
        fe: null, //铁
        fecalColiform: null, //粪大肠菌群
        flu: null, //氟化物
        hg: null, //汞
        mn: null, //锰
        nitrate: null, //硝酸盐
        pb: null, //铅
        permanganate: null, //高锰酸盐指数
        petroleum: null, //石油类
        ph: null, //PH
        sdbs: null, //阴离子表面活性剂
        se: null, //硒
        sulfate: null, //硫酸盐
        sulfide: null, //硫化物
        temp: null, //水温
        tn: null, //总氮
        tp: null, //总磷
        volatilePhenol: null, //挥发酚
        zn: null //锌
      },
      rules: {
        monitorStationName: [
          { required: true, message: "请输入断面名称", trigger: "blur" }
        ]
      },
     
     
    };
  },
  inject: ["globelDelet"],
  created() {
   
    if(this.$route.params.id == 1){
      let row = this.$store.state.monitordataInfo;
      this.isEditor=true;
       this.formData.id = row.id;
      this.formData.monitorStationName = row.monitorStationName; //监测断面名称
      this.formData.monitorStationCode = row.monitorStationCode; //监测断面编码
      this.formData.primaryWaterFunctionArea = row.primaryWaterFunctionArea; //一级水功能区
      this.formData.secondaryWaterFunctionArea = row.secondaryWaterFunctionArea; //二级水功能区
      this.formData.monitorUnit = row.monitorUnit; //监测单位
      this.formData.waterFunctionAreaCode = row.waterFunctionAreaCode; //水功能区索引码
      this.formData.receiveTime = row.receiveTime; //采样时间
      this.formData.targetLevel = row.targetLevel; //参考目标
      this.formData.remark = row.remark; //备注
      this.formData.limitEvaluation_conclusion = row.limitEvaluation_conclusion; //水功能区限制评价结论
      this.formData.limitOverstandardProjectandtimes =
        row.limitOverstandardProjectandtimes; //水功能区超标项目及倍数
      this.formData.limitFactorWaterQualityCategory =
        row.limitFactorWaterQualityCategory; //水功能区水质类别
      this.formData.allFactorWaterQualityCategory =
        row.allFactorWaterQualityCategory; //全因子水质类别
      this.formData.allFactorOverstandardProjectandtimes =
        row.allFactorOverstandardProjectandtimes; //全因子超标项目及倍数
      this.formData.allFactorEvaluation_conclusion =
        row.allFactorEvaluation_conclusion; //全因子评价结论
      this.formData.an = row.an; //氨氮
      this.formData.as_ = row.as_; //砷
      this.formData.bod5 = row.bod5; //五日生化需氧量
      this.formData.cd = row.cd; //镉
      this.formData.chloride = row.chloride; //氯化物
      this.formData.cod = row.cod; //化学需氧量
      this.formData.cr = row.cr; //六价铬
      this.formData.cu = row.cu; //铜
      this.formData.cyanide = row.cyanide; //氰化物
      this.formData.do_ = row.do_; //溶解氧
      this.formData.fe = row.fe; //铁
      this.formData.fecalColiform = row.fecalColiform; //粪大肠菌群
      this.formData.flu = row.flu; //氟化物
      this.formData.hg = row.hg; //汞
      this.formData.mn = row.mn; //锰
      this.formData.nitrate = row.nitrate; //硝酸盐
      this.formData.pb = row.pb; //铅
      this.formData.permanganate = row.permanganate; //高锰酸盐指数
      this.formData.petroleum = row.petroleum; //石油类
      this.formData.ph = row.ph; //PH
      this.formData.sdbs = row.sdbs; //阴离子表面活性剂
      this.formData.se = row.se; //硒
      this.formData.sulfate = row.sulfate; //硫酸盐
      this.formData.sulfide = row.sulfide; //硫化物
      this.formData.temp = row.temp; //水温
      this.formData.tn = row.tn; //总氮
      this.formData.tp = row.tp; //总磷
      this.formData.volatilePhenol = row.volatilePhenol; //挥发酚
      this.formData.zn = row.zn; //锌
    }
  },
  methods: {
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            this.formData.userAccount=this.toolObj.getCookie('userAccount')
            this.$http.put("/fileXA/waterFunction", this.formData).then(res => {
              if (res.data.code == 0) {
                this.resetForm(formName);                        
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
                this.$parent.navClick({ name: "数据查看",path:'/monitorPlan/waterFuncMonitor/dataCons'});
              }
            });
          } else {
            this.$http
              .post("/fileXA/waterFunction", this.formData)
              .then(res => {
                if (res.data.code == 0) {
                  this.resetForm(formName);                
                  this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000
                  });
                    this.$parent.navClick({ name: "数据查看",path:'/monitorPlan/waterFuncMonitor/dataCons'});
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

    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.id = null;
      this.formData.monitorStationName = ""; //监测断面名称
      this.formData.monitorStationCode = ""; //监测断面编码
      this.formData.primaryWaterFunctionArea = ""; //一级水功能区
      this.formData.secondaryWaterFunctionArea = ""; //二级水功能区
      this.formData.monitorUnit = ""; //监测单位
      this.formData.waterFunctionAreaCode = ""; //水功能区索引码
      this.formData.receiveTime = null; //采样时间
      this.formData.targetLevel = ""; //参考目标
      this.formData.remark = ""; //备注
      this.formData.limitEvaluation_conclusion = ""; //水功能区限制评价结论
      this.formData.limitOverstandardProjectandtimes = ""; //水功能区超标项目及倍数
      this.formData.limitFactorWaterQualityCategory = ""; //水功能区水质类别
      this.formData.allFactorWaterQualityCategory = ""; //全因子水质类别
      this.formData.allFactorOverstandardProjectandtimes = ""; //全因子超标项目及倍数
      this.formData.allFactorEvaluation_conclusion = ""; //全因子评价结论
      this.formData.an = null; //氨氮
      this.formData.as_ = null; //砷
      this.formData.bod5 = null; //五日生化需氧量
      this.formData.cd = null; //镉
      this.formData.chloride = null; //氯化物
      this.formData.cod = null; //化学需氧量
      this.formData.cr = null; //六价铬
      this.formData.cu = null; //铜
      this.formData.cyanide = null; //氰化物
      this.formData.do_ = null; //溶解氧
      this.formData.fe = null; //铁
      this.formData.fecalColiform = null; //粪大肠菌群
      this.formData.flu = null; //氟化物
      this.formData.hg = null; //汞
      this.formData.mn = null; //锰
      this.formData.nitrate = null; //硝酸盐
      this.formData.pb = null; //铅
      this.formData.permanganate = null; //高锰酸盐指数
      this.formData.petroleum = null; //石油类
      this.formData.ph = null; //PH
      this.formData.sdbs = null; //阴离子表面活性剂
      this.formData.se = null; //硒
      this.formData.sulfate = null; //硫酸盐
      this.formData.sulfide = null; //硫化物
      this.formData.temp = null; //水温
      this.formData.tn = null; //总氮
      this.formData.tp = null; //总磷
      this.formData.volatilePhenol = null; //挥发酚
      this.formData.zn = null; //锌
    }
  },
 
};
</script>

<style lang="less" scoped>
.pageContent {
  position: relative;
  background: #fff;
  .dialogcontent {
    height: calc(100% - 60px);
    padding: 20px 30px 0px 30px;
    .lihead {
      font-weight: 700;
    }
  }
  .btnBox {
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
}
</style>
