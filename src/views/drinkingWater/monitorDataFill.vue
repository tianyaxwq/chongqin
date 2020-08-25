<template>
  <div class="pageContent" style="height:100%">
    <div class="secondary-page-section" style="height:100%">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">手工监测数据</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">监测点位名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="oriLocationId">
                        <el-select
                          v-model="formData.oriLocationId"
                          placeholder="请选择"
                          filterable
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in stationArr"
                            :key="item.orilocationId"
                            :label="item.orilocationName"
                            :value="item.orilocationId"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">监测地点：</span>
                    <div class="layoutBox">
                      <el-form-item prop="position">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.position"
                          style="width:255px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">监测时间：</span>
                    <div class="layoutBox">
                      <el-form-item prop="receiveTime">
                        <el-date-picker
                          v-model="formData.receiveTime"
                          type="date"
                          placeholder="选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">氨氮：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="an">
                        <el-input
                          type="number"
                          v-model="formData.an"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (mg/L)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">CODmn：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="permanganate">
                        <el-input
                          type="number"
                          v-model="formData.permanganate"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (mg/L)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">pH：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="ph">
                        <el-input
                          type="number"
                          v-model="formData.ph"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (无量纲)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">水温：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="temperature">
                        <el-input
                          type="number"
                          v-model="formData.temperature"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (℃)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">溶解氧：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="disOxygen">
                        <el-input
                          type="number"
                          v-model="formData.disOxygen"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (mg/L)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">电导率：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="conductivity">
                        <el-input
                          type="number"
                          v-model="formData.conductivity"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (us/cm)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">浊度：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="turbidity">
                        <el-input
                          controls-position="right"
                          type="number"
                          v-model="formData.turbidity"
                          style="width:215px"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div> (NTU)
                  </div>
                  <!-- <div class="formDiv">
                    <span class="rCode">总磷：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="name">
                        <el-input-number
                          controls-position="right"
                          :min="0"
                          v-model="formData.name"
                          style="width:215px"
                          size="small"
                        ></el-input-number>
                      </el-form-item>
                    </div>(mg/L)
                  </div>
                  <div class="formDiv">
                    <span class="rCode">总氮：</span>
                    <div class="layoutBox" style="width:215px">
                      <el-form-item prop="name">
                        <el-input-number
                          controls-position="right"
                          :min="0"
                          v-model="formData.name"
                          style="width:215px"
                          size="small"
                        ></el-input-number>
                      </el-form-item>
                    </div>(mg/L)
                  </div>-->
                  <div class="formDiv formDivTl">
                    <span>备注：</span>
                    <div class="layoutBox">
                      <el-input
                        placeholder="请输入"
                        v-model="formData.remark"
                        type="textarea"
                        :rows="4"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div class="btnBox">
        <el-button style="width:100px" @click="submit('ruleForm')">提交</el-button>
        <el-button style="width:100px" @click="resetForm('ruleForm')">重置</el-button>
      </div>
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
        oriLocationId: "",
        position: "",
        // areaId: "",
        receiveTime: null,
        an: "",
        permanganate: "",
        ph: "",
        temperature: "",
        disOxygen: "",
        conductivity: "",
        turbidity: "",
        remark: ""
      },
      stationArr: [],
      rules: {
        oriLocationId: [
          { required: true, message: "请选择监测点位名称", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请输入监测地点", trigger: "blur" }
        ],
        // areaId: [
        //   { required: true, message: "请选择新政区域", trigger: "blur" }
        // ],
        receiveTime: [
          { required: true, message: "请选择监测时间", trigger: "blur" }
        ],
        an: [{ required: true, message: "请输入氨氮值", trigger: "blur" }],
        permanganate: [
          { required: true, message: "请输入高锰酸钾指数", trigger: "blur" }
        ],
        ph: [{ required: true, message: "请输入ph值", trigger: "blur" }],
        temperature: [
          { required: true, message: "请输入水温值", trigger: "blur" }
        ],
        disOxygen: [
          { required: true, message: "请输入溶解氧值", trigger: "blur" }
        ],
        conductivity: [
          { required: true, message: "请输入电导率值", trigger: "blur" }
        ],
        turbidity: [
          { required: true, message: "请输入浊度值", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$http.get("/waterEnvXA/OriLocation").then(res => {
        this.stationArr = res.data.content.dataList;
      });
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formData.receiveTime != null) {
            this.formData.receiveTime = new Date(
              this.formData.receiveTime
            ).format("yyyy-MM-dd 00:00:00");
          }

          this.$http
            .post(
              "/waterEnvXA/waterOriLocationData",
              qs.stringify(this.formData, { skipNulls: true })
            )
            .then(res => {
              if (res.data.code == 0) {
                this.resetForm(formName);
                this.visiDialog = false;

                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
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

      this.formData.oriLocationId = "";
      this.formData.position = "";
      // this.formData.areaId = "";
      this.formData.receiveTime = null;
      this.formData.an = "";
      this.formData.permanganate = "";
      this.formData.ph = "";
      this.formData.temperature = "";
      this.formData.disOxygen = "";
      this.formData.conductivity = "";
      this.formData.turbidity = "";
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
