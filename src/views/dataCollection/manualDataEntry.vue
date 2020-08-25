<template>
  <div class="pageContent secondary-page-mode" style="height:100%">
    <div class="secondary-toolbar">
      <img src="../../assets/images/companyDetail/calIcon.png" alt />
      <span>手工数据监测</span>
      <div class="rightBtn">
        <el-button>
          <i class="el-icon-edit-outline"></i>文件导入
        </el-button>
        <el-button class="downBtn">
          <i class="el-icon-download"></i>下载模板
        </el-button>
      </div>
    </div>
    <div class="currency-mode-wrap">
      <el-form :model="formData" :rules="rules" ref="ruleForm">
        <div class="headTitle">
          <el-button type="primary" icon="el-icon-edit"></el-button>数据录入
        </div>
        <div class="entryData">
          <el-row>
            <el-col :span="8">
              <el-form-item>
                <div>监测点位名称：</div>
                <!-- <el-select v-model="formData.pointName" placeholder="请选择" style="width:295px">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>-->
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="formData.pointName"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入监测点位名称"
                  @select="handleSelect"
                  style="width:295px"
                >
                  <i class="el-icon-edit el-input__icon" slot="suffix"></i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div>监测时间：</div>
                <el-date-picker
                  v-model="formData.time"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width:295px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div>氨氮：</div>
                <el-input placeholder="请输入" v-model="formData.nh3n" style="width:295px">
                  <template slot="append">mg/L</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">CODmn：</div>
                <el-input placeholder="请输入" v-model="formData.codmn" style="width:295px">
                  <template slot="append">mg/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">TP：</div>
                <el-input placeholder="请输入" v-model="formData.tp" style="width:295px">
                  <template slot="append">mg/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">TN：</div>
                <el-input placeholder="请输入" v-model="formData.tn" style="width:295px">
                  <template slot="append">mg/L</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">pH：</div>
                <el-input placeholder="请输入" v-model="formData.ph" style="width:295px">
                  <template slot="append">无量纲</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">CODcr：</div>
                <el-input placeholder="请输入" v-model="formData.codcr" style="width:295px">
                  <template slot="append">mg/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">浊度：</div>
                <el-input placeholder="请输入" v-model="formData.turb" style="width:295px">
                  <template slot="append">NTU</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">电导率：</div>
                <el-input placeholder="请输入" v-model="formData.cond" style="width:295px">
                  <template slot="append">μS/cm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">溶解氧：</div>
                <el-input placeholder="请输入" v-model="formData.dox" style="width:295px">
                  <template slot="append">mg/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="labelName">水温：</div>
                <el-input placeholder="请输入" v-model="formData.wt" style="width:295px">
                  <template slot="append">℃</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
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
      formData: {
        pointName: "",
        time: "",
        nh3n: "",
        codmn: "",
        tp: "",
        tn: "",
        ph: "",
        codcr: "",
        turb: "",
        cond: "",
        dox: "",
        wt: "",
      },
      rules: {
        poolCode: [
          { required: true, message: "请输入纳污塘坑编号", trigger: "blur" },
        ],
      },
      restaurants: [
         { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
         { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        //   { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        //   { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        //   { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        //   { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        //   { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
        //   { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
        //   { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
      ],
    };
  },
  methods: {
    //提交
    submit(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     for (let i = 0; i < this.formData.process.length; i++) {
      //       if (this.formData.process[i].receiveTime != null) {
      //         this.formData.process[i].receiveTime = new Date(
      //           this.formData.process[i].receiveTime
      //         ).format("yyyy-MM-dd 00:00:00");
      //       }
      //     }
      //     if (this.formData.uploadTime != null) {
      //       this.formData.uploadTime = new Date(
      //         this.formData.uploadTime
      //       ).format("yyyy-MM-dd 00:00:00");
      //     }
      //     this.$http.post("/waterEnvXA/pool", this.formData).then(res => {
      //       if (res.data.code == 0) {
      //         this.resetForm(formName);
      //         this.visiDialog = false;
      //         this.$message({
      //           message: res.data.message,
      //           type: "success",
      //           duration: 1000
      //         });
      //         this.$router.push("/waterPollution/pondManage/historyMes");
      //       }
      //     });
      //   } else {
      //     return false;
      //   }
      // });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.pointName = "";
      this.formData.time = "";
      this.formData.nh3n = "";
      this.formData.codmn = "";
      this.formData.tp = "";
      this.formData.tn = "";
      this.formData.ph = "";
      this.formData.codcr = "";
      this.formData.turb = "";
      this.formData.cond = "";
      this.formData.dox = "";
      this.formData.wt = "";
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
  },
};
</script>

<style lang="less" scoped>
.secondary-toolbar {
  padding: 15px 12px;
}
.rightBtn {
  float: right;
  margin-top: -7px;
}
.downBtn {
  background: linear-gradient(to right, #ffa300, #fe7e00);
}
.currency-mode-wrap {
  .headTitle {
    font-size: 16px;
    color: #000;
    padding: 10px 0;
    margin: 0 50px;
    border-bottom: 1px solid #e9e9e9;
    /deep/ .el-button {
      border-radius: 5px;
    }
  }
  .entryData {
    padding-top: 20px;
    .el-row {
      padding: 15px 0;
    }
    .labelName {
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
    }
    /deep/ .el-input-group__append {
      background: #f5f5f5;
      border-color: #c6d1de;
    }
    /deep/ .el-form-item__content {
      margin-left: 75px !important;
    }
  }
  .btnBox {
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin-top: 100px;
  }
}
</style>
