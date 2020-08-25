<template>
    <div class="maintenance">
      <el-scrollbar style="height: 100%">
        <div style="padding: 7px;">
          <div class="modular-wrap">
            <div class="modular-header">
              <span class="title">综合评级</span>
              <div class="header-toolbar">
                <el-button type="secondBtn">运维历史</el-button>
                <el-button style="margin: 0;" type="secondBtn">运维录入</el-button>
              </div>
            </div>
            <div class="modular-body clear">
              <div class="clock-dial-box">
                <span class="scale scale-a">0</span>
                <span class="scale scale-b">25</span>
                <span class="scale scale-c">50</span>
                <span class="scale scale-d">75</span>
                <span class="scale scale-e">100</span>
                <span class="grade">良好</span>
                <span class="name">综合评价</span>
                <span class="pointer" :style="setTransition()"></span>
              </div>
              <div class="comprehensive-rating">
                <span>站点级别：未知</span>
                <span>设备数量：3</span>
                <span>负责人：凌晨</span>
                <span>电话：1870790299</span>
                <a class="link-btn">新建任务 <i class="el-icon-d-arrow-right"></i></a>
              </div>
            </div>
          </div>

          <div class="modular-wrap">
            <div class="modular-header">
              <span class="title">两率考核</span>
            </div>
            <div class="modular-body clear" style="padding: 0;">
              <div class="assessment-left">
                <span class="assessment-grade grade-a"></span>
              </div>
              <div class="assessment-center">
                <div id="two-rate-assessment"></div>
                <p class="chart-name"><span>数据上传率</span><span>数据有效率</span></p>
              </div>
              <div class="assessment-right">
                <h5>考核标准</h5>
                <p>取两率中最差的</p>
                <p>100优秀 &emsp; 90-100良好</p>
                <p>80-90合格 &emsp; <80不合格</p>
              </div>
            </div>
          </div>

          <div class="modular-wrap">
            <div class="modular-header">
              <span class="title">运维活动考核</span>
            </div>
            <div class="modular-body clear">
              <div class="assessment-left">
                <span class="assessment-grade grade-d"></span>
              </div>
              <div class="assessment-center">
                <ul class="center-list">
                  <li>
                    <p><span class="number">8</span><span class="company">次</span></p>
                    <p>巡检次数</p>
                  </li>
                  <li>
                    <p><span class="number">20</span><span class="company">次</span></p>
                    <p>对比次数</p>
                  </li>
                  <li>
                    <p><span class="number">60</span><span class="company">次</span></p>
                    <p>校准次数</p>
                  </li>
                </ul>
              </div>
              <div class="assessment-right">
                <h5>考核标准</h5>
                <p>根据频率设置次数达到就合格，否则不合格</p>
              </div>
            </div>
          </div>

          <div class="modular-wrap">
            <div class="modular-header">
              <span class="title">故障响应考评</span>
            </div>
            <div class="modular-body clear">
              <div class="assessment-left">
                <span class="assessment-grade grade-e"></span>
              </div>
              <div class="assessment-center">
                <ul class="center-list">
                  <li>
                    <p><span class="number">8</span><span class="company">次</span></p>
                    <p>故障次数</p>
                  </li>
                  <li>
                    <p><span class="number">20</span><span class="company">h</span></p>
                    <p>平均响应时间次数</p>
                  </li>
                  <li>
                    <p><span class="number">60</span><span class="company">h</span></p>
                    <p>最长响应时间</p>
                  </li>
                </ul>
              </div>
              <div class="assessment-right">
                <h5>考核标准</h5>
                <p>故障最长响应时间<8小时合格，否则不合格</p>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
</template>

<script>
    export default {
        name: "maintenance",
        data(){
          return{
            rating: 25
          }
        },
        methods:{
          //设置综合评级仪表盘指针旋转角度
          setTransition(){
            let n = parseFloat(120/50);
            let deg = (25*n) - 120;
            return {
              transform:'rotate('+deg+'deg)'//transform: rotate(-120deg);
            }
          },
          //创建数据上传率与数据有效率环形图表
          createRateAssessment(){
            let myChart = this.$echarts.init(document.getElementById('two-rate-assessment'));
            let option = {
              color:['#297eff'],
              tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
              },
              series: [{
                name: '数据上传率',
                type: 'pie',
                radius: ['70%', '80%'],
                center:['25%','52%'],
                label: {
                  position: 'center',
                  verticalAlign:'middle',
                },
                data: [{
                  value: 20,
                  name: '数据上传率',
                  label: {
                    normal: {
                      formatter: '{a|{d}}{b| %}',
                      rich:{
                        a:{
                          color: '#297eff',
                          fontSize: 22,
                          fontWeight:700,
                          padding: [0, 0, 0, 0],
                        },
                        b:{
                          fontSize: 12,
                          color: '#297eff',
                          verticalAlign:'bottom'
                        }
                      }
                    },
                  }
                },{
                  value: 80,
                  name: '占位',
                  label: {
                    normal: {
                      show:false,
                      formatter: '%',
                      textStyle: {
                        color: '#297eff',
                        fontSize: 12
                      }
                    }
                  },
                  tooltip: {
                    show: false
                  },
                  itemStyle: {
                    normal: {
                      color: '#d1def0'
                    },
                    emphasis: {
                      color: '#d1def0'
                    }
                  },
                  hoverAnimation: false
                }]
              },{
                name: '数据有效率',
                type: 'pie',
                radius: ['70%', '80%'],
                center:['75%','58%'],
                label: {
                  position: 'center',
                  verticalAlign:'middle',
                },
                data: [{
                  value: 70,
                  name: '数据有效率',
                  label: {
                    normal: {
                      formatter: '{a|{d}}{b| %}',
                      rich:{
                        a:{
                          color: '#297eff',
                          fontSize: 22,
                          fontWeight:700,
                          padding: [0, 0, 0, 0],
                        },
                        b:{
                          fontSize: 12,
                          color: '#297eff',
                          verticalAlign:'bottom'
                        }
                      }
                    },
                  }
                },{
                  value: 30,
                  name: '占位',
                  label: {
                    normal: {
                      show:false,
                      formatter: '%',
                      textStyle: {
                        color: '#297eff',
                        fontSize: 12
                      }
                    }
                  },
                  tooltip: {
                    show: false
                  },
                  itemStyle: {
                    normal: {
                      color: '#d1def0'
                    },
                    emphasis: {
                      color: '#d1def0'
                    }
                  },
                  hoverAnimation: false
                }]
              }]
            };
            myChart.setOption(option);
          }
        },
        mounted(){
          this.createRateAssessment();
        },

    }
</script>

<style scoped lang="less">
.maintenance{
  height: 466px;
}
.modular-wrap{
  border: 1px solid #dce9fa;
  margin-bottom: 8px;
  &:last-child{
    margin-bottom: 0;
  }
  .modular-header{
    height: 37px;
    line-height: 36px;
    border-bottom: 1px solid #dce9fa;
    padding: 0 16px;
    .title{
      font-size: 14px;
      &:before{
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 3px;
        height: 10px;
        background: #166bce;
        margin-right: 8px;
      }
    }
    .header-toolbar{
      float: right;
    }
  }
  .modular-body{
    min-height: 100px;
    padding: 8px;
  }
}
.clock-dial-box{
  width: 176px;
  height: 144px;
  margin: 0 auto;
  position: relative;
  background: url("../../assets/images/index/s_yibiao_pic.png") no-repeat;
  .scale{
    position: absolute;
    color: #666666;
    font-size: 12px;
  }
  .scale-a{
    left: 30px;
    top: 112px;
  }
  .scale-b{
    left: 30px;
    top: 46px;
  }
  .scale-c{
    left: 80px;
    top: 20px;
  }
  .scale-d{
    left: 134px;
    top: 46px;
  }
  .scale-e{
    left: 128px;
    top: 112px;
  }
  .pointer{
    position: absolute;
    left: 50%;
    top: 32px;
    margin-left: -8px;
    width: 17px;
    height: 68px;
    background: url("../../assets/images/index/s_zhizheng_pic.png") no-repeat;
    transform: rotate(-120deg);
    transform-origin: 50% 82%;
    transition: 0.3s;
  }
  .grade{
    position: absolute;
    width: 80px;
    left: 50%;
    margin-left: -40px;
    text-align: center;
    top: 102px;
    font-size: 24px;
    color: #004ecc;
  }
  .name{
    position: absolute;
    width: 80px;
    left: 50%;
    top: 132px;
    margin-left: -40px;
    text-align: center;
    font-size: 12px;
    color: #999999;
  }
}
.comprehensive-rating{
  &>span{
    display: inline-block;
    vertical-align: top;
    margin-right: 40px;
  }
  text-align: center;
  padding: 16px 0 10px;
  &>.link-btn{
    color: #166bce;
    &:hover{
      text-decoration: underline;
      color: #0f519e;
    }
  }
}
.assessment-left{
  float: left;
  width: 138px;
  height: 146px;
  position: relative;
  .assessment-grade{
    display: block;
    height: 100%;
    width: 100%;
  }
  .grade-a{
    background: url("../../assets/images/index/s_youxiu_pic.png") no-repeat center center;
  }
  .grade-b{
    background: url("../../assets/images/index/s_lianghao_pic.png") no-repeat center center;
  }
  .grade-c{
    background: url("../../assets/images/index/s_hege_b_pic.png") no-repeat center center;
  }
  .grade-d{
    background: url("../../assets/images/index/s_buhege_pic.png") no-repeat center center;
  }
  .grade-e{
    background: url("../../assets/images/index/s_hege_a_pic.png") no-repeat center center;
  }
}
.assessment-left:after,
.assessment-center:after{
  content: '';
  position: absolute;
  width: 1px;
  height: 72px;
  top: 50%;
  right: 0;
  margin-top: -36px;
  background: -webkit-repeating-linear-gradient(#e7eef7, #d1def0 50%, #e7eef7); /* Safari 5.1 - 6.0 */
  background: -o-repeating-linear-gradient(#e7eef7, #d1def0 50%, #e7eef7); /* Opera 11.1 - 12.0 */
  background: -moz-repeating-linear-gradient(#e7eef7, #d1def0 50%, #e7eef7); /* Firefox 3.6 - 15 */
  background: repeating-linear-gradient(#e7eef7, #d1def0 50%, #e7eef7); /* 标准的语法（必须放在最后） */
}
.assessment-center{
  position: relative;
  float: left;
  width: calc(100% - 328px);
  height: 146px;
  .chart-name{
    &>span{
      display: inline-block;
      vertical-align: top;
      width: 50%;
      text-align: center;
      padding-top: 4px;

    }
  }
  .center-list{
    display: table;
    width: 100%;
    height: 100%;
    &>li{
      display: table-cell;
      width: 33.3%;
      text-align: center;
      vertical-align: middle;
      color: #666666;
      .number{
        font-size: 24px;
        color: #333;
      }
    }
  }
}
.assessment-right{
  width: 190px;
  height: 146px;
  float: left;
  line-height: 22px;
  font-size: 12px;
  padding: 30px 0 0 15px;
}
#two-rate-assessment{
 height: 110px;
}
</style>
