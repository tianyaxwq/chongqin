<template>
  <div class="tranceSource">
    <div class="topTool">
      <span @click="goRoute()">
        <i class="iconfont icon-tuichu"></i>返回
      </span>
      <span @click="clearBufferAlany()">
        <i class="iconfont icon-qingchuhuancun"></i>清除
      </span>
    </div>
    <div class="tsContent">
      <div class="left_box" style="position:relative">
        <div class="tsBox" v-show="isShow">
          <div class="content">
            <ul>
              <li>
                <div class="title">溯源推论</div>
                <p v-html="analyresult"></p>
              </li>
              <li>
                <div class="t">污染贡献比</div>
                <div class="echartdiv" id="echartdiv" style="height:52px;"></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="mapBox" style="width:100%; height:100%;position:absolute;left:0px;top:0px;">
          <mapComp v-bind:mapInfo="mapInfo" v-bind:wraduis="num" ref="cmap"></mapComp>
           <!-- 水质预测时间栏 -->
        <div class="water-quality-prediction-time">
          <div class="prediction-play-fun">
            <span class="time-line"></span>
            <button
              class="play-prediction"
              :class="{active:playActive}"
              @click="playPredictionRecord"
            >
              <i class="play-icon"></i>
            </button>
          </div>
          <div class="prediction-time-wrap">
            <span class="time-line"></span>
            <span id="prediction-time-line" class="prediction-time-line"></span>
            <ul class="prediction-time-list">
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">12/23(周一)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">12/24(周二)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">12/25(周三)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">12/26(周四)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">12/27(周五)</p>
              </li>
            </ul>
          </div>
         
        </div>
        </div>
        <div class="waterQualityPrediction clearfix" v-show="isShow">
          <ul class="qualityPrediction_box">
            <li class="top_process">
              <i class="process_item" :style="{width:processWidth+'%'}">
                <!-- <i class="time_msg" >10:00</i> -->
              </i>
              <!-- <i class="currentTime" title="当前时间：2019-01-16 09:00"></i> -->
            </li>
            <li class="play">
              <button class="play_btn" @click="play" :class="isplay?'active':''"></button>
            </li>
            <li
              class="time_box"
              v-for="(item,key) in dateList"
              :key="key"
              :style="{width:widthIndex+'%'}"
            >
              <div class="item_time">
                <i>06</i>
                <i>12</i>
                <i>18</i>
              </div>
              <div class="item_data">{{item}}</div>
            </li>
          </ul>
        </div>
        <div class="legend"></div>
      </div>
      <div class="right_box">
        <div class="title_box">溯源配置中心</div>
        <div class="right_content">
          <div class="distance modul">
            <p>距离 :</p>
            <div style="padding-left:15px;width:150px">
              <el-input-number v-model="num" controls-position="right" :min="1" :max="8"></el-input-number>KM
            </div>
          </div>
          <div class="factor modul">
            <p>因子 :</p>
            <el-checkbox-group v-model="checkList" style="padding-left:15px;">
            
              <el-checkbox label="氨氮"></el-checkbox>
              <el-checkbox label="总磷"></el-checkbox>
              <el-checkbox label="总氮"></el-checkbox>
              <el-checkbox label="高锰酸盐指数"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="time modul">
            <p>时间 :</p>
            <div class="timebox" style="padding-left:15px;">
              <el-radio v-model="radio" label="1">1天</el-radio>
              <el-radio v-model="radio" label="2">2天</el-radio>
              <el-radio v-model="radio" label="3">3天</el-radio>
            </div>
          </div>
          <div class="trancebox">
            <div class="btn" @click="startTrance" v-if="!isTrance">
              <i class="iconfont icon-leida"></i>
              开始溯源
            </div>
            <div class="tranceIcon" v-if="isTrance">
              <i :class="isRotate?'on':''"></i>
            </div>
            <p v-if="isTrance">{{descp}}({{percentage}}%)</p>
          </div>
          <div class="progressBox">
            <i class="bar" :style="styleObject"></i>
          </div>
          <div class="nav_box">
            <el-scrollbar style="height:100%">
              <ul class="result_nav">
                <li :class="stepone?'active':''">
                  <div class="process_box">
                    <div class="item" :style="styleObjectone"></div>
                  </div>
                  <div class="title">第一步：缓冲分析</div>
                  <i class="arrow down"></i>
                  <ul class="result_sub_item">
                    <li>
                      <i class="state_icon iconfont" :class="step1?'icon-huanchong':'icon-gou'"></i>污染源分析
                      <i class="details">(0)</i>
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step2?'icon-huanchong':'icon-gou'"></i>超标站点筛选
                      <i class="details">(0)</i>
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step3?'icon-huanchong':'icon-gou'"></i>同因子超标源标识
                      <i class="details">(0)</i>
                    </li>
                  </ul>
                </li>
                <li :class="steptwo?'active':''">
                  <div class="process_box">
                    <div class="item" :style="styleObjecttwo"></div>
                  </div>
                  <div class="title">第二步：数据预处理</div>
                  <i class="arrow down"></i>
                  <ul class="result_sub_item">
                    <li>
                      <i class="state_icon iconfont" :class="step4?'icon-huanchong':'icon-gou'"></i>实时数据收集
                      <!-- <i class="details_btn" @click="showCurrent">详情</i> -->
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step5?'icon-huanchong':'icon-gou'"></i>处理异常数据
                      <!-- <i class="details_btn" @click="showAbnormal">详情</i> -->
                    </li>
                  </ul>
                </li>
                <li :class="stepthree?'active':''">
                  <div class="process_box">
                    <div class="item" :style="styleObjectthree"></div>
                  </div>
                  <div class="title">第三步：污染动图生成</div>
                  <i class="arrow down"></i>
                  <ul class="result_sub_item">
                    <li>
                      <i class="state_icon iconfont" :class="step6?'icon-huanchong':'icon-gou'"></i>地图信息收集
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step7?'icon-huanchong':'icon-gou'"></i>水质等级渲染
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step8?'icon-huanchong':'icon-gou'"></i>时序数据生成
                    </li>
                  </ul>
                </li>
                <li :class="stepfour?'active':''">
                  <div class="process_box">
                    <div class="item" :style="styleObjectfour"></div>
                  </div>
                  <div class="title">第四步：污染源初步推断</div>
                  <i class="arrow down"></i>
                  <ul class="result_sub_item">
                    <li>
                      <i class="state_icon iconfont" :class="step9?'icon-huanchong':'icon-gou'"></i>分析模型数据导入-输出
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step10?'icon-huanchong':'icon-gou'"></i>上下游水质时序对比
                    </li>
                    <li>
                      <i class="state_icon iconfont" :class="step11?'icon-huanchong':'icon-gou'"></i>污染源监测因子对比
                    </li>
                  </ul>
                </li>
                <li :class="stepfive?'active':''" :style="styleObjectfive">
                  <div class="process_box">
                    <div class="item"></div>
                  </div>
                  <div class="title">第五步：溯源推论</div>
                  <i class="arrow down"></i>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <!-- 实时数据弹框 -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="currentVisible"
      width="795px"
      :before-close="handleCloseone"
    >
      <div slot="title" class="dialogtitle_box">
        <p>实时数据</p>
        <p>
          最新数据更新时间 : {{realTime}}
          <span @click="queryOverStationsRealdata()">刷新</span>
        </p>
      </div>
      <div class="dialogcontent_box">
        <el-table border :data="currentData" height="362px" style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="污染源" width="120"></el-table-column>
          <el-table-column v-for="(item,key) in factors" :key="key" :label="item.factorName">
            <el-table-column :prop="item.factorName" :label="item.unit"></el-table-column>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="table-pagination-wrap">
          <el-pagination
            @size-change="paginationSizeChangeone"
            @current-change="paginationChangeone"
            :current-page.sync="currentPageone"
            :page-size="pageSizeone"
            background
            :small="true"
            popper-class="select-common-option"
            :page-sizes="pageListone"
            layout="total, sizes, slot ,->,prev, pager, next, jumper"
            :total="totalone"
          >
            <span class="el-pagination__current">当前第{{ currentPageone }}/{{totalPageNumberone}}页</span>
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 异常数据弹框 -->
    <el-dialog
      title="异常数据"
      :modal-append-to-body="false"
      :visible.sync="abnormalVisible"
      width="795px"
      center
      :before-close="handleClosetwo"
    >
      <div class="dialogcontent_box">
        <div class="time_box">
          <span>时间段 :</span>
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>&nbsp;
          <button type="button" @click="queryOverStationsHisArm()" class="default-btn">
            <i class="iconfont icon-chaxun"></i> 查询
          </button>
        </div>
        <el-table border height="332px" :data="abnormalData" style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="STATION_NAME" label="污染源" width="120"></el-table-column>
          <el-table-column prop="START_TIME" label="时间" width="120"></el-table-column>
          <el-table-column prop="FACTOR_NAME" label="因子"></el-table-column>
          <el-table-column prop="UNIT" label="单位"></el-table-column>
          <el-table-column prop="DATA_AVG" label="监测值"></el-table-column>
          <el-table-column prop="STATE" label="异常类型"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="table-pagination-wrap">
          <el-pagination
            @size-change="paginationSizeChangetwo"
            @current-change="paginationChangetwo"
            :current-page.sync="currentPagetwo"
            :page-size="pageSizetwo"
            background
            :small="true"
            popper-class="select-common-option"
            :page-sizes="pageListtwo"
            layout="total, sizes, slot ,->,prev, pager, next, jumper"
            :total="totaltwo"
          >
            <span class="el-pagination__current">当前第{{ currentPagetwo }}/{{totalPageNumbertwo}}页</span>
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mapComp from "./map_source";
import { formatDate } from "../../assets/js/dateformat";
export default {
  name: "tranceSource",
  components: { mapComp },
  data() {
    return {
      playActive:false,
      predictionTimer: null,
      predictionBfb: 0,
      factors: [],
      realTime: "",
      overStationIdArr: [5354, 5367],
      currentVisible: false, //实时数据弹框控制显示隐藏
      pageListone: [10, 15, 20],
      totalone: 10,
      pageSizeone: 10,
      currentPageone: 1,
      currentData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      abnormalVisible: false, //异常数据弹框控制显示隐藏
      abnormalData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      pageListtwo: [10, 15, 20],
      totaltwo: 10,
      pageSizetwo: 10,
      currentPagetwo: 1,
      dateValue: [],
      descp: "正在溯源,请稍后",
      dateList: ["01/17", "01/18", "01/19", "01/20", "01/21", "01/22"],
      widthIndex: 0, //计算日期盒子的宽度
      processWidth: 0, //进度条宽度
      processIndex: 0, //进度条索引控制
      clear: "",
      checkList: ["氨氮"],
      radio: "1",
      mapInfo: [],
      num: 18,
      isplay: false,
      isTrance: false, //开始溯源控制
      isRotate: false, //图标旋转
      isShow: false, //溯源推论展示
      stepone: false,
      steptwo: false,
      stepthree: false,
      stepfour: false,
      stepfive: false,
      step1: true,
      step2: true,
      step3: true,
      step4: true,
      step5: true,
      step6: true,
      step7: true,
      step8: true,
      step9: true,
      step10: true,
      step11: true,
      percentage: 0,
      styleObjectone: {
        height: "0%"
      },
      styleObjecttwo: {
        height: "0%"
      },
      styleObjectthree: {
        height: "0%"
      },
      styleObjectfour: {
        height: "0%"
      },
      styleObjectfive: {
        height: "0%"
      },
      styleObject: {
        width: "0%"
      },
      analyresult: "",
      gongxbDatas: [
        { value: 20, name: "2企业1" },
        { value: 30, name: "3企业2" },
        { value: 50, name: "4企业3" }
      ]
    };
  },
  computed: {
    totalPageNumberone() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalone / this.pageSizeone);
      return number;
    },
    totalPageNumbertwo() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totaltwo / this.pageSizetwo);
      return number;
    }
  },
  methods: {
    playPredictionRecord() {
      let line = document.getElementById("prediction-time-line");
      let _this = this;
      if (this.predictionBfb === 100) {
        this.predictionBfb = 0;
      }
      if (this.playActive) {
        this.playActive = false;
        clearInterval(this.predictionTimer);
      } else {
        this.playActive = true;
        this.predictionTimer = setInterval(function() {
          _this.predictionBfb += 3.33;
          let index = Math.ceil(_this.predictionBfb / 5);
          _this.$refs.cmap.playKusImages(index);
          if (_this.predictionBfb >= 100) {
            _this.predictionBfb = 100;
            _this.playActive = false;
            clearInterval(_this.predictionTimer);
          }

          line.style.width = _this.predictionBfb + "%";
        }, 900);
      }
    },
    showCurrent() {
      this.currentVisible = true;
    },
    showAbnormal() {
      this.abnormalVisible = true;
    },
    paginationSizeChangeone(value) {
      this.pageSizeone = value;
      this.queryOverStationsRealdata();
    },
    paginationChangeone(value) {
      this.currentPageone = value;
      this.queryOverStationsRealdata();
    },
    paginationSizeChangetwo(value) {
      this.pageSizetwo = value;
      this.queryOverStationsHisArm();
    },
    paginationChangetwo(value) {
      this.currentPagetwo = value;
      this.queryOverStationsHisArm();
    },
    handleCloseone() {
      this.currentVisible = false;
    },
    handleClosetwo() {
      this.abnormalVisible = false;
    },
    play() {
      this.isplay = !this.isplay;
      if (this.processWidth == 100) {
        this.processWidth = 0;
        this.processIndex = 0;
      }
      if (this.isplay) {
        this.controlPlay();
      } else {
        clearInterval(this.clear);
      }
    },
    controlPlay() {
      this.clear = setInterval(() => {
        this.processIndex++;
        this.processWidth =
          (100 / (this.dateList.length * 4)) * this.processIndex;
          let index = Math.ceil(this.processWidth / 5);
          this.$refs.cmap.playKusImages(index);
        if (this.processWidth == 100) {
          clearInterval(this.clear);
          this.isplay = false;
        }
      }, 500);
    },
    goRoute() {
      this.$router.push("/gisMap");
    },
    startTrance() {
      this.stepone = true;
      this.isTrance = true;
      this.isRotate = true;
      this.styleObjectone = {
        height: "30%"
      };
      this.styleObject = {
        width: "9%"
      };
      this.percentage = 9;
      this.step1 = false;
      this.queryWuryEnter();
    },
    //复原朔源
    resetShuoyuan() {
      this.stepone = false;
      this.isTrance = false;
      this.isRotate = false;
      this.isShow = false; //溯源推论展示
      this.steptwo = false;
      this.stepthree = false;
      this.stepfour = false;
      this.stepfive = false;
      this.step1 = true;
      this.step2 = true;
      this.step3 = true;
      this.step4 = true;
      this.step5 = true;
      this.step6 = true;
      this.step7 = true;
      this.step8 = true;
      this.step9 = true;
      this.step10 = true;
      this.step11 = true;
      this.percentage = 0;
      this.styleObjectone = {
        height: "0%"
      };
      this.styleObjecttwo = {
        height: "0%"
      };
      this.styleObjectthree = {
        height: "0%"
      };
      this.styleObjectfour = {
        height: "0%"
      };
      this.styleObjectfive = {
        height: "0%"
      };
      this.styleObject = {
        width: "0%"
      };
    },
    //污染源推论 第五大步
    wurYTuilun() {
      this.stepfive = true;
      this.styleObjectfive = {
        height: "0%"
      };
      this.isRotate = false;
      this.isShow = true;
      this.descp = "溯源分析完成";
      //this.$refs.cmap.setWuryanCenter();
      this.querySourceResult();
    },
    //污染源朔源初步推断 第四大步
    wurChubtuiDuan() {
      setTimeout(() => {
        this.stepfour = true;
        this.styleObjectfour = {
          height: "35%"
        };
        this.styleObject = {
          width: "81%"
        };
        this.step9 = false;
        this.percentage = 81;
      }, 2000);
      setTimeout(() => {
        this.styleObjectfour = {
          height: "75%"
        };
        this.styleObject = {
          width: "90%"
        };
        this.percentage = 90;
        this.step10 = false;
      }, 3000);
      setTimeout(() => {
        this.styleObjectfour = {
          height: "100%"
        };
        this.styleObject = {
          width: "100%"
        };
        this.percentage = 100;
        this.step11 = false;
        this.wurYTuilun();
      },4000);
    },
    //污染动图更新 第三大步
    wurDongtuGengxin() {
      setTimeout(() => {
        this.stepthree = true;
        this.styleObjectthree = {
          height: "30%"
        };
        this.styleObject = {
          width: "54%"
        };
        this.percentage = 54;
        this.step6 = false;
      }, 5000);
      setTimeout(() => {
        this.styleObjectthree = {
          height: "65%"
        };
        this.styleObject = {
          width: "63%"
        };
        this.percentage = 63;
        this.step7 = false;
      }, 6000);
      setTimeout(() => {
        this.styleObjectthree = {
          height: "100%"
        };
        this.styleObject = {
          width: "72%"
        };
        this.percentage = 72;
        this.step8 = false;
        this.wurChubtuiDuan();
      }, 7000);
    },
    initEchart() {
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%"
        },

        series: [
          {
            name: "污染贡献比",
            type: "pie",
            radius: "65%",
            center: ["50%", "60%"],
            data: this.gongxbDatas,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      var echart = this.$echarts.init(document.getElementById("echartdiv"));
      echart.setOption(option);
    },

    //加载点位
    loadStationPoint() {
      this.$http
          .get("/SiteManagement/station/queryAllStationInfo", {
          params: {
            userId: this.toolObj.getCookie("userId")
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var stations = dataJson.content.dataList;
            this.siteTypeList = dataJson.content.siteTypeList;
            this.mapInfo = [];
            this.equipIds = [];
            for (var i = 0; i < stations.length; i++) {
              var station = stations[i];
              this.equipIds.push(station.equipId);
              this.mapInfo.push({
                lng: station.lng,
                lat: station.lat,
                name: station.name,
                equipId: station.equipId,
                //grade:6,
                grade: parseInt(station.waterQualityLevel),
                wqlindex: station.waterQualityIndex || 0,
                category: station.category,
                time: station.time
              });
            }
          }
        })
        .catch(error => {});
    },
    /**
     * 查询污染源企业
     */
    queryWuryEnter() {
      let me = this;
    //   this.$http
    //     .get("/wpps/pollution/external/enterpriseInfo/allEnter", {
    //       params: {
    //         //riverId: null
    //       }
    //     })
    //     .then(response => {
    //       let dataJson = response.data;
    //       if (dataJson.code == 0) {
    //         let dataList = dataJson.content.dataList;
    //         var content = "";
    //         me.$refs.cmap.bufferAnalysis(dataList);
    //         me.queryOverStations(dataList);
    //       }
    //     });
            let dataList = [];
            var content = "";
          //  me.$refs.cmap.bufferAnalysis(dataList);
            me.queryOverStations(dataList);
      this.dateValue = [me.addDate(me.radio), new Date()];
    },
    /**
     * 清除
     */
    clearBufferAlany() {
      this.$refs.cmap.clearBufferAlany();
    },
    /**
     * 查询企业下的超标站点
     */
    queryOverStations(dataL) {
      let me = this;
      let enterIds = [];
      //    me.radio = 88;
      for (let i = 0; i < dataL.length; i++) {
        let data = dataL[i];
        enterIds.push(data.id);
      }
      let dataList = [];
            var content = "";
            var sidArr = [];
            for (let i = 0; i < dataList.length; i++) {
              let data = dataList[i];
              let id = data.stationId;
              sidArr.push(id);
            }
            me.overStationIdArr = sidArr;
            this.styleObjectone = {
              height: "60%"
            };
            this.styleObject = {
              width: "18%"
            };
            this.percentage = 18;
            this.step2 = false;
             this.styleObjectone = {
                height: "100%"
              };
              this.styleObject = {
                width: "27%"
              };
              this.percentage = 27;
              this.step3 = false;
              me.queryOverStationsRealdata(true);
             
    //   if (me.checkList.length == 0) {
    //     this.$message("请选择分析因子");
    //     return;
    //   }
    //   this.$http
    //     .get("/wpps/pollution/external/enterpriseInfo/overStations", {
    //       params: {
    //         enterpriseIds: enterIds.toString(),
    //         projectNames: me.checkList.toString(),
    //         startTime: formatDate(me.addDate(me.radio), "yyyy-MM-dd hh:mm:ss"), //"2019-01-01 01:01:11",
    //         endTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss") //"2019-01-17 01:01:11"
    //       }
    //     })
    //     .then(response => {
    //       let dataJson = response.data;
    //       if (dataJson.code == 0) {
    //         let dataList = dataJson.content.dataList;
    //         var content = "";
    //         var sidArr = [];
    //         for (let i = 0; i < dataList.length; i++) {
    //           let data = dataList[i];
    //           let id = data.stationId;
    //           sidArr.push(id);
    //         }
    //         me.overStationIdArr = sidArr;
    //         this.styleObjectone = {
    //           height: "60%"
    //         };
    //         this.styleObject = {
    //           width: "18%"
    //         };
    //         this.percentage = 18;
    //         this.step2 = false;
    //         if (sidArr.length == 0) {
    //           this.$message("朔源超标站点未找到,朔源结束!");
    //           this.resetShuoyuan();
    //         } else {
    //           this.styleObjectone = {
    //             height: "100%"
    //           };
    //           this.styleObject = {
    //             width: "27%"
    //           };
    //           this.percentage = 27;
    //           this.step3 = false;
    //           me.queryOverStationsRealdata(true);
    //           me.queryOverStationsHisArm(true);
    //         }
    //       }
    //     });
    },
    querySourceResult() {
      let time = formatDate(new Date(), "yyyy年MM月dd日 hh时")
      let me = this;
      let name ="金陡"
      let projectName ="氨氮"
      let avg =12.3
      let unit="mg/L";
      let beis = 1.2;
      let svg = 67;
      let content =
      "英雄"+time+" <span style='color:red'>溶解氧（0.86mg/L，低于下限2.6倍）</span>，经系统溯源分析推论，" +
      "上游" +
      name +
      "在此时间段内出现<span style='color:red'>" +
      projectName +
      "(" +
      avg +
      unit +
      "," +
      "超标" +
      beis +
      "倍" +
      ")</span>超高报警结合当前气象、河流基础数据分析，" +
      "<span style='color:red'>" +
      name +
      "</span>造成此次污染事件的概率为" +
      svg +
      "%。";
       me.analyresult = content;
            me.gongxbDatas = [{name:'氨氮',value:15},{name:'总磷',value:55},];
           setTimeout(()=>{
                me.initEchart();
           },1000)
    //   if (me.checkList.length == 0) {
    //     this.$message("请选择分析因子");
    //     return;
    //   }
    //   this.$http
    //     .get("/wpps/pollution/external/enterpriseInfo/sourceResult", {
    //       params: {
    //         stationIds: me.overStationIdArr.toString(),
    //         projectName: me.checkList[0],
    //         startTime: formatDate(me.addDate(me.radio), "yyyy-MM-dd hh:mm:ss"), //"2019-01-01 01:01:11",
    //         endTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss") //"2019-01-17 01:01:11"
    //       }
    //     })
    //     .then(response => {
    //       let dataJson = response.data;
    //       if (dataJson.code == 0) {
    //         let dataList = dataJson.content.dataList;
    //         var content = "";
    //         var Csvg = 0;
    //         var qiyeDats = [];
    //         var gxbDatas = [];
    //         for (var name in dataList) {
    //           let data = dataList[name];
    //           qiyeDats.push(data);
    //           let avg = data.avg_v;
    //           let unit = data.unit;
    //           let overF = data.overF;
    //           let projectName = data.projectName;
    //           let svg = data.svg;
    //           Csvg += svg;
    //           let beis = avg / overF;
    //           avg = avg.toFixed(2);
    //           beis = beis.toFixed(2);
    //           content =
    //             "浦南运河-青村站2018年12日15时 <span style='color:red'>氨氮（1.6mg/L，超标0.6倍）</span>，经系统溯源分析推论，" +
    //             "上游" +
    //             name +
    //             "在此时间段内出现<span style='color:red'>" +
    //             projectName +
    //             "(" +
    //             avg +
    //             unit +
    //             "," +
    //             "超标" +
    //             beis +
    //             "倍" +
    //             ")</span>超高报警结合当前气象、河流基础数据分析，" +
    //             "<span style='color:red'>" +
    //             name +
    //             "</span>造成此次污染事件的概率为" +
    //             svg +
    //             "%。";
    //           gxbDatas.push({ name: name, value: svg });
    //           me.$refs.cmap.setWyryEnter(name);
    //         }
    //         me.analyresult = content;
    //         me.gongxbDatas = gxbDatas;
    //         me.initEchart();
    //       }
    //     });
    },
    /**
     * 查询超标站点的实时数据
     */
    queryOverStationsRealdata(jinBool) {
      let me = this;
      //进度条更新
            if (jinBool) {
              this.steptwo = true;
              this.styleObjecttwo = {
                height: "50%"
              };
              this.styleObject = {
                width: "36%"
              };
              this.percentage = 36;
              this.step4 = false;
               me.queryOverStationsHisArm(true);
            }
    //   this.$http
    //     .get("/wpps/pollution/external/enterpriseInfo/overStationRealDatas", {
    //       params: {
    //         stationIds: me.overStationIdArr.toString(),
    //         offset: (me.currentPageone - 1) * me.pageSizeone,
    //         limit: me.pageSizeone
    //       }
    //     })
    //     .then(response => {
    //       let dataJson = response.data;
    //       if (dataJson.code == 0) {
    //         let dataList = dataJson.content.dataList;
    //         var content = "";
    //         me.currentData = dataList.bodyData;
    //         me.factors = dataList.factors;
    //         me.totalone = dataList.total;
    //         me.realTime = dataList.time;
    //         //进度条更新
    //         if (jinBool) {
    //           this.steptwo = true;
    //           this.styleObjecttwo = {
    //             height: "50%"
    //           };
    //           this.styleObject = {
    //             width: "36%"
    //           };
    //           this.percentage = 36;
    //           this.step4 = false;
    //         }
    //       }
    //     });
    },
    /**
     * 查询历史异常数据
     */
    queryOverStationsHisArm(jinBool) {
      let me = this;
        //进度条更新
            if (jinBool) {
              this.styleObjecttwo = {
                height: "100%"
              };
              this.styleObject = {
                width: "45%"
              };
              this.percentage = 45;
              this.step5 = false;
              this.wurDongtuGengxin();
            }
    //   if (this.dateValue.length == 0) {
    //     this.$message("请选择时间!");
    //     return;
    //   }
     // let startTime = formatDate(this.dateValue[0], "yyyy-MM-dd hh:mm:ss");
     // let endTime = formatDate(this.dateValue[1], "yyyy-MM-dd hh:mm:ss");
      //console.log(formatDate(this.dateValue[0],"yyyy-MM-dd hh:mm:ss"));
    //   this.$http
    //     .get(
    //       "/wpps/pollution/external/enterpriseInfo/overStationhistoryDatas",
    //       {
    //         params: {
    //           stationIds: me.overStationIdArr.toString(),
    //           startTime: startTime,
    //           endTime: endTime,
    //           offset: (me.currentPagetwo - 1) * me.pageSizetwo,
    //           limit: me.pageSizetwo
    //         }
    //       }
    //     )
    //     .then(response => {
    //       let dataJson = response.data;
    //       if (dataJson.code == 0) {
    //         let dataList = dataJson.content.dataList;
    //         var content = "";
    //         me.abnormalData = dataList.bodyData;
    //         me.totaltwo = dataList.total;
    //         //进度条更新
    //         if (jinBool) {
    //           this.styleObjecttwo = {
    //             height: "100%"
    //           };
    //           this.styleObject = {
    //             width: "45%"
    //           };
    //           this.percentage = 45;
    //           this.step5 = false;
    //           this.wurDongtuGengxin();
    //         }
    //       }
    //     });
    },
    /**
     * 日期减几天
     */
    addDate(days) {
      var date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    }
  },
  created() {
    this.widthIndex = 100 / this.dateList.length; //根据日期数计算百分比宽度
  },
  mounted() {
    this.loadStationPoint();
  },
  watch: {
    processIndex(newValue, oldValue) {
      this.$refs.cmap.ksAnimateCss("1221", this.processIndex);
    }
  }
};
</script>

<style scoped lang="less">
/* 水质预测时间栏 */
  .water-quality-prediction-time {
    position: absolute;
    width: 100%;
    height: 52px;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .prediction-play-fun {
      width: 52px;
      height: 100%;
      background: rgba(0, 0, 0, 0.52);
      float: left;
      .play-prediction {
        width: 100%;
        height: 48px;
        background: #0091ff;
        cursor: pointer;
        i {
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 20px;
          background: url("../../assets/images/index/icon_play.png") no-repeat;
        }
      }
      .play-prediction.active {
        i {
          background: url("../../assets/images/index/icon_suspend.png")
            no-repeat;
        }
      }
    }
    .prediction-time-wrap {
      float: left;
      width: calc(100% - 52px);
      z-index: 9999;
      height: 100%;
      background: rgba(0, 0, 0, 0.52);
      position: relative;
      .prediction-time-list {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        li {
          width: 20%;
          height: 100%;
          float: left;
          border-left: 1px solid #d1d1d0;
          .time-item {
            display: block;
            float: left;
            padding-top: 6px;
            position: relative;
            color: #cccccc;
            width: calc(100% / 6);
            text-align: right;
            font-size: 12px;
            span {
              margin-right: -6px;
            }
          }
          .time-item:after {
            content: "";
            position: absolute;
            width: 1px;
            height: 6px;
            background: #ccc;
            top: 0;
            right: 0;
          }
          .date-text {
            text-align: center;
            color: #fff;
            padding-top: 26px;
          }
        }
      }
    }
    .prediction-ater-quality {
      width: 246px;
      height: 100%;
      float: left;
      background: rgba(0, 0, 0, 0.42);
      li {
        width: 20%;
        float: left;
        height: 52px;
        color: #fff;
        text-align: center;
        font-size: 12px;
        .quality-grade-line {
          display: block;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
        }
        .quality-grade-line.gradeA {
          background: #00a1e4;
        }
        .quality-grade-line.gradeB {
          background: #24c768;
        }
        .quality-grade-line.gradeC {
          background: #e5ce10;
        }
        .quality-grade-line.gradeD {
          background: #ff7e00;
        }
        .quality-grade-line.gradeE {
          background: #ff0000;
        }
        .quality-grade-name {
          padding-top: 16px;
        }
      }
    }
    .prediction-play-fun > .time-line,
    .prediction-time-wrap > .time-line {
      display: block;
      height: 6px;
      background: rgba(255, 255, 255, 0.4);
    }

    .prediction-play-fun > .time-line {
      background: #3ace7e;
    }
    .prediction-time-wrap .prediction-time-line {
      display: block;
      height: 6px;
      background: url("../../assets/images/index/prediction-time-line.png")
        repeat-y;
      background-size: 100% 1px;
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      transition: all 0.3s;
    }
  }
.dialogtitle_box {
  text-align: center;
  height: 62px;
  padding-top: 12px;
  p {
    height: 16px;
    line-height: 16px;
    color: #505e66;
    &:nth-child(1) {
      font-size: 16px;
      height: 25px;
      font-weight: 700;
    }
    &:nth-child(2) {
      font-size: 13px;
      span {
        display: inline-block;
        color: #166bce;
        cursor: pointer;
        margin-left: 12px;
      }
    }
  }
}
.dialogcontent_box {
  padding: 8px;
  .time_box {
    height: 48px;
    border: 1px solid #d9e6f7;
    margin-bottom: 8px;
    padding: 8px 0 8px 12px;
    > span {
      display: inline-block;
      margin-right: 8px;
      height: 32px;
      color: #1a1a1a;
      line-height: 32px;
    }
  }
}
.tranceSource {
  height: 100%;
  .topTool {
    width: 100%;
    height: 34px;
    line-height: 34px;
    box-shadow: 0px 1px 0px 0px rgba(219, 219, 219, 1);
    span {
      display: inline-block;
      width: 68px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
      i {
        vertical-align: -1px;
        margin-right: 3px;
      }
      &:nth-child(1) {
        background: rgba(235, 235, 235, 1);
        border-radius: 4px;
        color: #1973d2;
        font-size: 12px;
        margin: 0 9px;
      }
    }
  }
  .tsContent {
    padding: 7px;
    height: calc(100% - 34px);
    .left_box {
      width: calc(100% - 247px);
      float: left;
      height: 100%;
      position: relative;
      border: 1px solid rgba(220, 220, 220, 1);
      .tsBox {
        width: 100%;
        height: 88px;
        position: absolute;
        left: 0px;
        top: 0px;
        padding: 11px;
        z-index: 999;
        .content {
          height: 88px;
          border: 1px solid rgba(25, 114, 210, 1);
          box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.26);
          background: rgba(255, 255, 255, 0.8);
          border-radius: 4px;
          padding: 9px;
          ul {
            height: 100%;
          }
          li {
            float: left;
            height: 100%;
            &:nth-child(1) {
              width: calc(100% - 290px);
              .title {
                font-size: 18px;
                font-weight: 700;
                color: #1870d0;
                margin-bottom: 3px;
              }
            }
            &:nth-child(2) {
              width: 290px;
              padding-left: 24px;
              position: relative;
              &:before {
                width: 1px;
                height: 47px;
                background: rgba(184, 184, 184, 1);
                content: "";
                position: absolute;
                left: 0px;
                top: 50%;
                transform: translateY(-23.5px);
              }
              .t {
                color: #1870d0;
                font-size: 12px;
              }
            }
          }
        }
      }
      .waterQualityPrediction {
        position: absolute;
        bottom: 2px;
        left: 2px;
        right: 2px;
        height: 54px;
        .qualityPrediction_box {
          width: 100%;
          float: left;
          position: relative;
          padding-left: 54px;
          height: 100%;
          background: rgba(0, 0, 0, 0.52);
          li {
            float: left;
            height: 100%;
          }
          .top_process {
            position: absolute;
            width: calc(100% - 54px);
            top: 0;
            height: 6px;
            left: 54;
            right: 0;
            background: rgba(255, 255, 255, 0.4);
            .process_item {
              width: 30%;
              background-image: linear-gradient(to left, #2c8fa7, #2cc072);
              display: block;
              height: 100%;
              position: relative;
              .time_msg {
                position: absolute;
                background: red;
                width: 38px;
                height: 23px;
                top: -26px;
                right: -19px;
                font-size: 12px;
                color: #fff;
                text-align: center;
              }
              .currentTime {
                position: absolute;
                background: red;
                width: 11px;
                height: 10px;
                bottom: 0px;
                left: 55px;
              }
            }
          }
          .play {
            width: 54px;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
            line-height: 54px;
            .play_btn {
              background: url("../../assets/images/index/icon_play.png")
                no-repeat center center;
              height: 48px;
              margin-top: 5px;
              width: 100%;
              border: none;
              background-color: transparent;
              &:hover {
                background-color: #0a9e9e;
              }
            }
            .active {
              background-image: url("../../assets/images/index/icon_suspend.png");
            }
          }
          .time_box {
            border-left: 1px solid #aba9a8;
            width: 16.666%;
            position: relative;
            .item_time {
              overflow: hidden;
              i {
                width: 25%;
                text-align: right;
                float: left;
                position: relative;
                padding-top: 6px;
                font-size: 12px;
                color: #ccc;
                &:before {
                  content: "";
                  display: block;
                  border-right: 1px solid #d1d1d0;
                  position: absolute;
                  top: 0;
                  height: 6px;
                  right: 0px;
                }
              }
            }
            .item_data {
              text-align: center;
              color: #fff;
              margin-top: 5px;
            }
          }
        }
      }
      .legend {
        position: absolute;
        width: 66px;
        height: 200px;
        bottom: 88px;
        right: 11px;
        background: url("../../assets/images/index/img_legend_0003.png")
          no-repeat center center;
      }
    }
    .right_box {
      width: 240px;
      float: right;
      height: 100%;
      border-bottom: 1px solid rgba(220, 220, 220, 1);
      .title_box {
        height: 33px;
        line-height: 33px;
        text-align: center;
        background: #1973d2;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        &:before,
        &:after {
          content: "";
          display: inline-block;
          width: 39px;
          height: 15px;
          vertical-align: middle;
          margin-top: -3px;
        }
        &:before {
          background-image: url(../../assets/images/index/title_bg.png);
          margin-right: 5px;
        }
        &:after {
          background-image: url(../../assets/images/index/title_bg.png);
          margin-left: 5px;
        }
      }
      .right_content {
        height: calc(100% - 33px);
        border-left: 1px solid rgba(220, 220, 220, 1);
        border-right: 1px solid rgba(220, 220, 220, 1);
        .modul {
          padding: 10px 10px;
          p {
            font-size: 16px;
            margin-bottom: 7px;
          }
        }
        .trancebox {
          position: relative;
          height: 68px;
          .btn {
            width: 92px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            background: linear-gradient(
              -90deg,
              rgba(23, 147, 208, 1),
              rgba(22, 107, 206, 1)
            );
            box-shadow: 0px 3px 6px 0px rgba(25, 115, 210, 0.26);
            border-radius: 4px;
            font-size: 13px;
            color: #fff;
            position: absolute;
            left: 50%;
            cursor: pointer;
            transform: translateX(-46px);
            top: 17px;
          }
          .tranceIcon {
            position: absolute;
            width: 48px;
            height: 48px;
            left: 10px;
            top: 50%;
            transform: translateY(-24px);
            &:before {
              content: "";
              width: 34px;
              height: 34px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-17px, -17px);
              background: url("../../assets/images/index/icon_Traceability_ing.png")
                no-repeat center center;
            }

            i {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0px;
              top: 0px;
              background: url("../../assets/images/index/icon_Traceability_ing_02.png")
                no-repeat center center;
            }
            .on {
              animation: rotate 3s linear infinite;
            }
          }
          p {
            height: 68px;
            line-height: 68px;
            padding-left: 70px;
          }
        }
        .progressBox {
          height: 8px;
          background: rgba(0, 0, 0, 0.06);
          position: relative;
          .bar {
            transition: all 1.3s;
            height: 8px;
            width: 0px;
            background: #1973d2;
            position: absolute;
            left: 0px;
            top: 0px;
            border-radius: 0px 4px 4px 0px;
          }
        }
        .nav_box {
          height: calc(100% - 330px);
        }
        .result_nav {
          padding: 8px;
          color: #666;
          > li {
            position: relative;
            padding-left: 30px;
            line-height: 40px;
            .process_box {
              position: absolute;
              top: 12px;
              left: 0;
              bottom: -14px;
              width: 15px;
              &:before {
                content: "";
                box-sizing: border-box;
                display: block;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                border: 2px solid #dbdbdb;
                position: absolute;
                left: 0;
                top: 2px;
                background: #f2f2f2;
                z-index: 1;
              }
              &:after {
                content: "";
                box-sizing: border-box;
                position: absolute;
                left: 50%;
                width: 3px;
                top: 8px;
                bottom: -2px;
                background: #dbdbdb;
                margin-left: -1.5px;
              }
              .item {
                position: absolute;
                left: 50%;
                width: 3px;
                margin-left: -1.5px;
                top: 2px;
                transition: all 1.3s;
              }
            }
            .result_sub_item {
              line-height: 30px;
              font-size: 12px;
              display: none;
              li {
                position: relative;
                padding-right: 24px;
                min-height: 30px;
                line-height: 20px;

                .details_btn {
                  color: #1973d2;
                  font-size: 12px;
                  font-style: normal;
                  float: right;
                  cursor: pointer;
                }
                .state_icon {
                  vertical-align: -2px;
                  margin-right: 8px;
                  display: inline-block;
                }
                .icon-huanchong {
                  animation: rotate 2s linear infinite;
                }
                .icon-gou {
                  color: #22bc4f;
                }
              }
            }
            &:first-child .process_box:after {
              top: 3px;
            }
            &:last-child .process_box:after {
              bottom: 28px;
            }
          }
          .active {
            .process_box {
              .item {
                z-index: 1;
                background: #22bc4f;
                transition: all 1.3s;

                &:before {
                  content: "";
                  display: block;
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  position: absolute;
                  left: -6px;
                  top: 0px;
                  background: #22bc4f;
                  z-index: 1;
                }
              }
            }
            .result_sub_item {
              display: block;
            }
          }
        }
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
