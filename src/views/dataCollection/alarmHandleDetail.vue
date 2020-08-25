<template>
  <div class="process-wrap">
    <div class="step-bar">
      <div class="step-item" :class="[curStep === idx ? 'isActive' : '']" v-for="(item, idx) of processOptions" :key="idx" @click="onStep(idx)">
        <i class="el-icon-circle-check" v-if="isComplete"></i>
        <span class="num" v-if="!isComplete">{{idx + 1}}</span>
        <span class="text" v-if="!isComplete">{{item}}</span>
        <i class="el-icon-arrow-right" v-if="idx <= 1"></i>
      </div>
    </div>
    <div class="content-box">
      <template v-if="type === '1'">
        <div v-show="curStep === 0">
          <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="100px" style="margin-top: 40px;padding: 0 15%;">
            <el-row>
              <el-col :span="11">
                <el-form-item label="断面名称：">
                  <div class="static-data">膳马庙村北</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="站点类型：">
                  <div class="static-data">预警站</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="报警时间：">
                  <div class="static-data">2020-07-20 12:08:02</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="报警指标：">
                  <div class="static-data">CODCR</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="报警类型：">
                  <div class="static-data">连续高报警</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="当前水质：">
                  <div class="static-data">
                    <span class="wq-flag red">劣V</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="报警信息：">
                  <div class="static-data">膳马庙村北于2020-06-06 16：00：00产生连续高报警</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="标题：" prop="title">
                  <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="下发类型：" prop="type">
                  <el-select v-model="ruleForm.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="负责人：" prop="dutyPerson">
                  <el-select v-model="ruleForm.dutyPerson" placeholder="请选择">
                    <el-option v-for="item in chargerOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="产生时间：" prop="time">
                  <el-date-picker v-model="ruleForm.time" type="date" placeholder="请选择"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="截至时间：" prop="endTime">
                  <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="请选择"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="报警级别：" prop="level">
                  <el-radio v-model="ruleForm.level" :label="item.value" v-for="item of levelOptions" :key="item.value" style="margin-right: 20px">{{item.label}}</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="display:flex;justify-content:center;margin-bottom:30px">
            <el-button type="noticon" @click="submit('ruleForm')" style="margin-right:40px">提交</el-button>
            <el-button type="noticonsecondBtn" @click="$emit('close')">取消</el-button>
          </div>
        </div>
        <div v-show="curStep === 1">
          <el-form :model="ruleForm2" label-width="100px" style="margin-top: 40px;padding: 0 15%;">
            <el-row>
              <el-col :span="24">
                <div class="step2-label">定位信息</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="经度：">
                  <div class="static-data">36.5811</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="纬度：">
                  <div class="static-data">42.5478</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="step2-label">基本信息</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="标题：">
                  <div class="static-data">府河-孝义河预警站超标报警现场勘查</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="下发类型：">
                  <div class="static-data">APP推送</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="负责人：">
                  <div class="static-data">刘婕</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="产生时间：">
                  <div class="static-data">2020-06-10</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="截至时间：">
                  <div class="static-data">2020-06-16</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="报警级别：" prop="level">
                  <div class="static-data">一般</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="事件内容：" prop="level">
                  <div class="static-data">府河-孝义河预警站超标报警现场勘查，现安排负责人刘婕进行现场勘测排查问题。</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="照片：" prop="level">
                  <div class="step2-media">
                    <div class="image-box">
                      <img src="" alt="" height="100%">
                    </div>
                    <div class="info">
                      <div class="type">414.png</div>
                      <div class="text">187.4kb  来自 刘婕 | 6月11日 09：42</div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="视频：" prop="level">
                  <div class="step2-media">
                    <div class="video-box">
                      <video src=""></video>
                    </div>
                    <div class="info">
                      <div class="type">414.png</div>
                      <div class="text">187.4kb  来自 刘婕 | 6月11日 09：42</div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="display:flex;justify-content:center;margin-bottom:30px">
            <el-button type="noticon" @click="curStep = 3" style="margin-right:40px">下一步</el-button>
            <el-button type="noticonsecondBtn" @click="$emit('close')">取消</el-button>
          </div>
        </div>
        <div v-show="curStep === 2">
          <el-form :rules="rules" :model="ruleForm3" ref="ruleForm3" label-width="130px" style="margin: 40px auto 0;width:666px;">
            <el-row>
              <el-col :span="24">
                <div class="step3-title">
                  <i class="el-icon-warning"></i>
                  <span>启动预案后，事件转入指挥调度平台进行调度处理，该流程结束。不启动预案，该流程到此结束。</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="标题：">
                  <div>府河-孝义河预警站超标报警现场勘查</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否启动预案：">
                  <el-radio v-model="ruleForm3.radio" label="1" style="margin-right: 20px">启动</el-radio>
                  <el-radio v-model="ruleForm3.radio" label="2" style="margin-right: 20px">不启动</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="事件核查判定：" prop="deal">
                  <el-input type="textarea" v-model="ruleForm3.deal" placeholder="请输入" style="width: 450px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="display:flex;justify-content:center;margin-bottom:30px">
            <el-button type="noticon" @click="submit('ruleForm3')" style="margin-right:40px">提交</el-button>
            <el-button type="noticonsecondBtn" @click="$emit('close')">取消</el-button>
          </div>
        </div>
      </template>
      <template v-if="type === '2'"></template>
      <template v-if="type === '3'"></template>
      <template v-if="type === '4'"></template>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type', 'datas'],                                                                               
  data () {
    return {
      isComplete: false,
      curStep: 0,
      processOptions: ['报警处理', '现场勘测', '是否启动预案'],
      typeOptions: [
        { label: 'APP推送', value: '1' }
      ],
      chargerOptions: [],
      levelOptions: [
        { label: '一般', value: '1' },
        { label: '中等', value: '2' },
        { label: '紧急', value: '3' }
      ],
      ruleForm: {
        title: '',
        type: '1',
        dutyPerson: '',
        time: '',
        endTime: '',
        level: '1'
      },
      ruleForm3: {
        radio: '1',
        deal: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题'}],
        type: [{ required: true, message: '请选择下发类型' }],
        dutyPerson: [{ required: true, message: '请选择负责人' }],
        time: [{ required: true, message: '请选择产生时间' }],
        endTime: [{ required: true, message: '请选择截至时间' }],
        level: [{ required: true, message: '请选择报警级别' }],
        deal: [{ required: true, message: '请输入核查判定' }]
      },
      ruleForm2: {}
    }
  },
  methods: {
    onStep(idx) {
      this.curStep = idx
      console.log(idx)
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('refresh')
        }
      })
    }
  }
}
</script>

<style lang="less">
.process-wrap {
  width: 100%;
  height: 100%;
  .content-box {
    height: calc(100% - 52px);
    > div {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  .step-bar {
    width: 100%;
    height: 50px;
    display: flex;
    background:rgba(245,247,250,1);
    .step-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      .el-icon-arrow-right {
        position: absolute;
        right: 30px;
        top: 12px;
        font-size: 28px;
        color: rgba(203,207,214,1);
      }
      .el-icon-circle-check {
        font-size: 24px;
        color: #0f800f;
      }
      .num {
        width: 24px;
        height: 24px;
        background: transparent;
        border:1px solid rgba(0,0,0,0.15);
        border-radius: 14px;
        font-size: 16px;
        color: rgba(0,0,0,0.25);
        text-align: center;
        line-height: 24px;
      }
      .text {
        font-weight: 400;
        font-size: 15px;
        color: #333;
        margin-left: 10px;
      }
      &.isActive {
        .num {
          border-color: #0F80E8;
          background: #0F80E8;
          color: #fff;
        }
        .text {
          color: #0F80E8;
        }
      }
    }
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .wq-flag {
    padding: 1px 10px;
    color: #ffffff;
    &.red {
      background: #ff0000;
    }
  }
  .static-data {
    padding-left: 10px;
    border: 1px solid #c6d1de;
  }
  .step2-label {
    height: 16px;
    margin-bottom: 20px;
    color: #000;
    font-size: 16px;
    line-height: 16px;
    padding-left: 10px;
    border-left: 3px solid #1890FF;
  }
  .step2-media {
    display: flex;
    .image-box, .video-box {
      width: 110px;
      height: 65px;
      border: 1px dashed rgba(0,0,0,0.18);
    }
    .info {
      display: flex;
      align-items: center;
      margin-left: 15px;
      .type {
        font-size: 14px;
        color: rgba(51,51,51,1);
      }
      .text {
        font-size: 12px;
        color: rgba(153,153,153,1);
      }
    }
  }
  .step3-title {
    width: 100%;
    height:40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    background:rgba(230,247,255,1);
    border:1px solid rgba(145,213,255,1);
    border-radius:4px;
    color:rgba(0,0,0,0.65);
    font-size: 14px;
    i {
      font-size: 16px;
      color: #1890FF;
      margin-right: 10px;
    }
  }
}
</style>
