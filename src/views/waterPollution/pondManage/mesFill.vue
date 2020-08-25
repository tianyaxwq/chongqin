<template>
  <div class="pageContent dialogcontent" style="height:100%">
    <div class="secondary-page-section" style="height:100%">
      <div class="dialogcontent noScrollX" style="height:calc(100% - 50px)">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px">
            <ul>
              <li class="liblock">
                <p class="lihead">纳污坑塘基本信息</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="编号：" prop="poolCode">
                        <el-input placeholder="请输入" v-model="formData.poolCode" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="地市：">
                        <el-input placeholder="请输入" v-model="formData.city" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="县区：">
                        <el-input placeholder="请输入" v-model="formData.dist" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="乡镇：">
                        <el-input placeholder="请输入" v-model="formData.town" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="村：">
                        <el-input placeholder="请输入" v-model="formData.vil" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="所在村庄具体方位：">
                        <el-input placeholder="请输入" v-model="formData.proLoca" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="中心经度：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.longitude"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="中心纬度：">
                        <el-input placeholder="请输入" v-model="formData.latitude" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="估算面积（㎡）：">
                        <el-input placeholder="请输入" v-model="formData.area" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="估算体积（m³）：">
                        <el-input placeholder="请输入" v-model="formData.vol" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="坑塘周边污染情况：">
                        <el-input placeholder="请输入" v-model="formData.psp" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否仍在纳污：">
                        <el-radio v-model="formData.cap" :label="1">是</el-radio>
                        <el-radio v-model="formData.cap" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="废水性质：">
                        <el-select v-model="formData.pww" placeholder="请选择" style="width:255px">
                          <el-option
                            v-for="item in watertypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="酸碱性：">
                        <el-radio v-model="formData.abp" :label="1">碱性</el-radio>
                        <el-radio v-model="formData.abp" :label="0">酸性</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否涉重金属：">
                        <el-radio v-model="formData.hm" :label="1">是</el-radio>
                        <el-radio v-model="formData.hm" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="坑塘类型：">
                        <el-radio v-model="formData.styp" :label="1">干坑</el-radio>
                        <el-radio v-model="formData.styp" :label="0">水坑</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="所属河流：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.riverName"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="是否有恶臭：">
                        <el-radio v-model="formData.stink" :label="1">是</el-radio>
                        <el-radio v-model="formData.stink" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="化学需氧量：">
                        <el-input placeholder="请输入" v-model="formData.cod" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="氨氮：">
                        <el-input placeholder="请输入" v-model="formData.nh3n" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="其他特征污染物：">
                        <el-input placeholder="请输入" v-model="formData.ocp" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="来源：">
                        <el-input placeholder="请输入" v-model="formData.source" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="治理进展：">
                        <el-select v-model="formData.status" placeholder="请选择" style="width:255px">
                          <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="问题地点：">
                        <el-input placeholder="请输入" v-model="formData.proLoca" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="提交人：">
                        <el-input placeholder="请输入" v-model="formData.userName" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="上报时间：">
                        <el-date-picker
                          v-model="formData.uploadTime"
                          type="date"
                          placeholder="选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否涉油等有机物：">
                        <el-radio v-model="formData.om" :label="1">是</el-radio>
                        <el-radio v-model="formData.om" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="坑塘是否已通过验收：">
                        <el-radio v-model="formData.acpt" :label="1">是</el-radio>
                        <el-radio v-model="formData.acpt" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="坑塘底泥及周边土壤是否受到污染,采取治理措施：">
                        <el-radio v-model="formData.ots" :label="1">是</el-radio>
                        <el-radio v-model="formData.ots" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="坑塘周边地下水是否受到污染,采取措施：">
                        <el-radio v-model="formData.wts" :label="1">是</el-radio>
                        <el-radio v-model="formData.wts" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="采取主要治理措施和方法：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.method"
                          :rows="3"
                          type="textarea"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">调查人员信息</p>
                <div class="libody clear">
                   <el-row>
                    <el-col :span="12">
                      <el-form-item label="责任人：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.investigationUserName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                       <el-form-item  label="联系电话：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tel"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="工作单位：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.unit"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                       <el-form-item  label="职务：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.job"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                </div>
              </li>
              <li class="liblock">
                <p class="lihead" style="margin-bottom:12px;">
                  过程监管&emsp;&emsp;&emsp;
                  <el-button @click="addProcess">
                    <i class="iconfont icon-tianjia1"></i>新增过程
                  </el-button>
                </p>
                <div
                  class="libody clear"
                  v-for="(item,key) in formData.process"
                  :key="key"
                  style="margin-top:12px"
                > 
                   <el-row>
                    <el-col :span="12">
                      <el-form-item label="过程名称：">
                        <el-input
                          placeholder="请输入"
                          v-model="item.processName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                       <el-form-item  label="过程负责人：">
                        <el-input
                          placeholder="请输入"
                          v-model="item.userName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                   <el-row>
                    <el-col :span="12">
                      <el-form-item label="上报时间：">
                         <el-date-picker
                          v-model="item.receiveTime"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-button type="delet" @click="deletProcess(key)" style="margin-left:150px">
                      <i class="iconfont icon-shanchu"></i>删除
                    </el-button>
                    </el-col>
                  </el-row>
                 
                 
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div class="btnBox">
        <el-button @click="submit('ruleForm')" style="width:100px">提交</el-button>
        <el-button style="width:100px" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      statusOption: [
        { label: "未完成", value: 0 },
        { label: "已完成", value: 1 }
      ],
      watertypeOption: [
        { label: "工业废水", value: 0 },
        { label: "生活污水", value: 1 },
        { label: "养殖废水", value: 2 },
        { label: "混合废水", value: 3 },
        { label: "其他", value: 4 }
      ],
      formData: {
        city: "",//地市
        dist: "",//县区
        town: "",//乡镇
        vil: "",//村
        longitude: "",//中心经度
        latitude: "",//中心纬度
        area: "",//估算面积
        vol: "",//估算体积
        psp: "",//坑塘周边污染情况
        cap: 0,//是否仍在纳污
        pww: 0,//废水性质
        abp: 0,//酸碱性
        hm: 0,//是否涉重金属
        om: 0,//是否涉废油等有机物
        stink: 0,//是否有恶臭
        cod: "",//化学需氧量
        nh3n: "",//氨氮
        ocp: "",//其他特征污染物
        ots: 0,//坑塘底泥及周边土壤是否受到污染,采取治理措施
        wts: 0,//坑塘周边地下水是否受到污染,采取措施
        method: "",//采取主要治理措施和方法
        acpt: 0,//坑塘是否已通过验收
        styp: 0,//坑塘类型
        dpsp: "",//干坑周边污染情况
        poolId: "", //纳污坑塘Id
        poolCode: "", //编号
        status: "", //状态
        proLoca: "", //问题地点
        riverName: "", //所属河流
        areaName: "", //行政区划
        source: "", //来源
        userName: "", //提交人
        uploadTime: null, //上报时间
        investigationUserName: "", //责任人
        tel: "", //联系电话
        unit: "", //工作单位
        job: "", //职务
        process: [{ processName: "", userName: "", receiveTime: null }]
      },
      rules: {
        poolCode: [
          { required: true, message: "请输入纳污塘坑编号", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //新增过程
    addProcess() {
      this.formData.process.push({
        processName: "",
        userName: "",
        receiveTime:null
      });
    },
    //删除过程
    deletProcess(key) {
      this.formData.process.splice(key, 1);
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.formData.process.length; i++) {
            if (this.formData.process[i].receiveTime != null) {
              this.formData.process[i].receiveTime = new Date(
                this.formData.process[i].receiveTime
              ).format("yyyy-MM-dd 00:00:00");
            }
          }
          if (this.formData.uploadTime != null) {
            this.formData.uploadTime = new Date(
              this.formData.uploadTime
            ).format("yyyy-MM-dd 00:00:00");
          }
          this.$http.post("/waterEnvXA/pool", this.formData).then(res => {
            if (res.data.code == 0) {
              this.resetForm(formName);
              this.visiDialog = false;
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 1000
              });
              this.$router.push("/waterPollution/pondManage/historyMes");
            }
          });
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.poolId = "";
      this.formData.poolCode = "";
      this.formData.status = "";
      this.formData.proLoca = "";
      this.formData.riverName = "";
      this.formData.areaName = "";
      this.formData.source = "";
      this.formData.userName = "";
      this.formData.uploadTime = null;
      this.formData.investigationUserName = "";
      this.formData.tel = "";
      this.formData.unit = "";
      this.formData.job = "";
      this.formData.city = "";
      this.formData.dist = "";
      this.formData.town = "";
      this.formData.vil = "";
      this.formData.longitude = "";
      this.formData.latitude = "";
      this.formData.area = "";
      this.formData.vol = "";
      this.formData.psp = "";
      this.formData.area = "";
      this.formData.cod = "";
      this.formData.nh3n = "";
      this.formData.ocp = "";
      this.formData.method = "";
      this.formData.pww = "";
      this.formData.process = [
        { processName: "", userName: "", receiveTime: null }
      ];
    }
  }
};
</script>

<style lang="less" scoped>
.secondary-page-section {
  padding: 10px;
  border: 1px solid #dcdfe6;

  .dialogcontent {
    height: calc(100% - 50px);
  }
  .btnBox {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
}
</style>
