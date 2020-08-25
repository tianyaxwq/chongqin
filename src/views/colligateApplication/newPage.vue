<template>
  <div class="newpage">
    <div class="secondary-toolbar">
      <span>流域:</span>&nbsp;
      <div class="layoutBox" style="width: 200px">
        <el-select v-model="basicName" placeholder="请选择">
          <el-option
            v-for="item in basicList"
            :key="item.RIVER_CODE"
            :label="item.RIVER_NM"
            :value="item.RIVER_CODE"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <el-button @click="getData">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </div>
    <div id="monitoring-map">
      <mapComp v-bind:mapInfo="mapInfo" v-on:childMethod="getFactor" ref="cmap"></mapComp>
    </div>
    <div class="contPart">
      <el-carousel trigger="click" :autoplay="false" style="width: 58%;float: left;">
        <div class="leftPart" :class="!isDataTrue ? 'noBefore' : ''">
          <el-carousel-item v-for="(list, key) in resultArr" :key="key">
            <div class="itemPart" v-for="(item, index) in list" :key="index" v-if="isDataTrue">
              <span
                @click="getEchartData(item.stcd)"
                :class="item.isActive ? 'active' : ''"
              >{{item.stnm}}</span>
              <div class="publicBg" :class="index%2 != 0 ? 'oddBox' : 'evenBox'">
                <p>COD: {{item.codcr}}mg/L</p>
                <p>nh3n: {{item.nh3n}}mg/L</p>
              </div>
              <div
                class="speed"
                :class="index%2 != 0 ? 'oddNum' : ''"
                v-if="index < stationList.length - 1"
              >
                距离：{{item.dis_down ? item.dis_down + '公里' : '--'}}
                <br />
                所需时间：{{item.speedTime ? item.speedTime + ' 小时' : '--'}}
                <br />
                流速：{{item.speed_of_avg ? item.speed_of_avg + 'm/s' : '--'}}
              </div>
            </div>
          </el-carousel-item>
          <div v-if="!isDataTrue">
            <img src="../../assets/images/no-data-100.png" alt />
            <p style="text-align: center; padding: 8px 0;">暂无数据</p>
          </div>
        </div>
      </el-carousel>
      <div class="rightPart">
        <div class="secondary-toolbar">
          <span>监测项目 :</span>&nbsp;
          <div class="layoutBox" style="width:200px">
            <el-select v-model="factorModel" multiple placeholder="请选择">
              <el-option
                v-for="item in factorData"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></el-option>
            </el-select>
          </div>&nbsp;
          <span>
            监测时间：{{new Date(
            new Date().getTime() - 3600 * 1000 * 24 * 1
            ).format("yyyy-MM-dd hh:mm:ss")}} - {{new Date(
            new Date()
            ).format("yyyy-MM-dd hh:mm:ss")}}
          </span>
        </div>
        <div
          style="position:relative"
          class="chartCont"
          v-loading="loading"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <div
            class="echartbox"
            id="echartbox"
            style="height: 100%"
            :style="!dataStatus?'opacity:1':'opacity:0'"
          ></div>
          <div v-if="dataStatus == 'no'" class="noChartData">
            <img src="../../assets/images/no-data-100.png" alt v-if="!isDataTrue" />
            <p style="text-align: center; padding: 8px 0;">暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import mapComp from "@/views/colligateApplication/mapNewPage";
export default {
  name: "newPage",
  data() {
    return {
      stationId: "",
      dataStatus: "no",
      loading: false,
      basicList: [],
      basicName: "",
      factorData: [],
      factorModel: [],
      mapInfo: [],
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      colors: {
        w01010: "#e53ce6", //水温
        w01009: "#297eff", //溶解氧
        w01003: "#1cad8b", //浑浊度
        w01014: "#00a3f5", //电导率
        w01019: "#1ebd1e", //高锰酸盐指数
        nh3n: "#c2a100", //氨氮
        w21011: "#e68320", //总磷
        w21001: "#ff4242", //总氮
        w01001: "#8e42ff", //PH
        codcr: "#4258ff" //CODcr
      },
      unit: {
        水温: "℃", //水温
        溶解氧: "mg/L", //溶解氧
        浊度: "NTU", //浑浊度
        电导率: "μS/cm", //电导率
        高锰酸盐指数: "mg/L", //高锰酸盐指数
        氨氮: "mg/L", //氨氮
        总磷: "mg/L", //总磷
        总氮: "mg/L", //总氮
        PH: "无量纲", //PH
        化学需氧量: "mg/L" //CODcr
      },
      stationList: [],
      isDataTrue: false,
      resultArr: []
    };
  },
  created() {
    this.searchData();
  },
  methods: {
    getData() {
      this.$http
        .get("/dataHandle/yunliBase/riverFlowSpeed", {
          params: {
            riverId: this.basicName
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.stationList = res.data.content.dataList;
            this.resultArr = [];
            for (var i = 0; i < this.stationList.length; i += 4) {
              this.resultArr.push(this.stationList.slice(i, i + 4));
            }
            this.mapInfo = this.stationList;
            if (this.stationList.length && this.stationList.length > 0) {
              this.isDataTrue = true;
              this.getFactor(this.stationList[0].stcd);
            } else {
              this.isDataTrue = false;
              this.dataStatus = "no";
            }
          }
        });
    },
    //查询流域
    searchData() {
      this.$http
        .get("/dataHandle/yunliBase/getDwdRiver", {
          params: {
            key: "",
            pageNum: "",
            pageSize: ""
          }
        })
        .then(res => {
          this.basicList = [];
          res.data.content.dataList.map(el => {
            if (el.RIVER_CODE) {
              this.basicList.push({
                RIVER_CODE: el.RIVER_CODE,
                RIVER_NM: el.RIVER_NM
              });
            }
            if (el.RIVER_NM == "府河") {
              this.basicName = el.RIVER_CODE;
            }
          });
          this.getData();
        });
    },
    //获取所有监测项目
    getFactor(id) {
      this.factorModel = [];
      this.factorData = [
        {
          projectName: "氨氮",
          projectCode: "nh3n"
        },
        {
          projectName: "化学需氧量",
          projectCode: "codcr"
        }
      ];
      for (let i in this.factorData) {
        this.factorModel.push(this.factorData[i].projectCode);
      }
      this.getEchartData(id);
    },
    // 使用站点id查询图表
    getEchartData(id) {
      this.stationList.map((el, index) => {
        if (el.stcd == id) {
          el.isActive = true;
        } else {
          el.isActive = false;
        }
      });
      this.loading = true;
      this.dataStatus = "";
      this.$http
        .get("/Statistics-Service/dataCharts/moreDatasCharts", {
          params: {
            stationCode: id, //站点编码（mn）'40000000000001'
            factorCode: this.factorModel.join(","), //因子参数（编码）'w01019'
            startTime: new Date(
              new Date().getTime() - 3600 * 1000 * 24 * 1
            ).format("yyyy-MM-dd hh"), //开始时间
            endTime: new Date(new Date()).format("yyyy-MM-dd hh"), //结束时间
            type: "hour"
          }
        })
        .then(res => {
          this.loading = false;
          if (!res.data.content) {
            var myChart = this.$echarts.init(
              document.getElementById("echartbox")
            );
            //使用制定的配置项和数据显示图表
            myChart.clear();
            this.dataStatus = "no";
            return false;
          } else {
            this.dataStatus = "";
          }
          let obj = res.data.content.info;
          this.legendData = obj.legend;
          this.xAxisData = obj.xAxis;
          this.yAxisData = [];
          this.seriesData = [];
          let yArr = res.data.content.info.series;
          if (yArr && yArr.length > 0) {
            for (let i = 0; i < yArr.length; i++) {
              //根据因子数添加绘图数据seriesData
              this.seriesData.push({
                name: yArr[i].name,
                type: "line",
                data: yArr[i].data,
                itemStyle: {
                  color: this.colors[yArr[i].code]
                }
                // markPoint: {
                //   data: [
                //     { type: "max", name: "最大值" },
                //     { type: "min", name: "最小值" }
                //   ]
                // }
              });
            }
            this.initEchart(
              this.legendData,
              this.xAxisData,
              this.yAxisData,
              this.seriesData
            );
          }
        });
    },
    initEchart(legendData, xAxisData, yAxisData, seriesData) {
      let _this = this;
      var option = {
        // title: {
        //   text: "变化趋势分析图",
        //   x: "center"
        // },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let res = params[0].axisValue + "<br/>";
            for (let i = 0; i < params.length; i++) {
              var value = params[i].value == undefined ? "-" : params[i].value;
              res +=
                "<p>" +
                params[i].seriesName +
                " : " +
                value +
                " " +
                _this.unit[params[i].seriesName] +
                "</p>";
            }
            return res;
          }
        },
        legend: {
          data: legendData,
          y: "bottom"
        },
        toolbox: {
          show: false,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData
        },
        // yAxis: yAxisData,
        yAxis: {
          type: "value"
        },

        series: seriesData
      };
      //初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("echartbox"));

      //使用制定的配置项和数据显示图表
      myChart.setOption(option);
      myChart.on("click", function(params) {
        console.log(params);
      });
    }
  },
  components: {
    mapComp
  }
};
</script>
<style scoped lang="less">
.newpage {
  position: relative;
  height: 100%;
  .secondary-toolbar {
    position: absolute;
    z-index: 999;
  }
  #monitoring-map {
    width: 100%;
    height: 70%;
  }
  .contPart {
    height: 30%;
    /deep/ .el-carousel {
      height: 100%;
    }
    /deep/ .el-carousel__container {
      height: 100%;
    }
    /deep/ .el-carousel__item {
      // position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      &::before {
        position: absolute;
        content: "";
        background-color: #40a9ff;
        width: 100%;
        height: 2px;
      }
    }
    /deep/ .el-carousel__arrow {
      background-color: transparent;
      color: #e3e3e3;
      font-size: 30px;
    }
    /deep/ .el-carousel__arrow--left {
      left: -5px;
    }
    /deep/ .el-carousel__arrow--right {
      right: -5px;
    }
    /deep/ .el-carousel__indicators--horizontal {
      .el-carousel__button {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #e3e3e3;
      }
      .el-carousel__indicator.is-active button {
        background-color: #0c8cef;
      }
    }
    .leftPart { 
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      .itemPart {
        position: relative;
        z-index: 99;
        flex: 1;
        > span {
          cursor: pointer;
          margin-left: 20px;
          padding: 2px 5px;
          background: #40a9ff;
          color: #fff;
          border-radius: 4px;
        }
        .speed {
          position: absolute;
          left: 80px;
          width: 130px;
        }
        .oddNum {
          top: -60px;
        }
        .active {
          background: #ff0000;
        }
        .publicBg {
          background-color: #c7e2ff;
          // padding: 5px 100px 5px 5px;
          border-radius: 2px;
          height: 100px;
          width: 150px;
          position: absolute;
          font-size: 14px;
          color: #999999;
          p {
            padding-top: 5px;
            padding-left: 5px;
          }
        }
        .oddBox {
          bottom: -105px;
        }
        .evenBox {
          top: -105px;
        }
      }
    }
    .noBefore {
      &::before {
        height: 0;
      }
    }
    .rightPart {
      float: right;
      width: 40%;
      height: 100%;
      .secondary-toolbar {
        border: none;
      }
      .chartCont {
        height: 100%;
        .noChartData {
          position: absolute;
          top: 90px;
          left: 165px;
        }
      }
    }
  }
}
</style>