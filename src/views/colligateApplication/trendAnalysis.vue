<template>
  <div class="trendPage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>时间类型 :</span>
      <div class="layoutBox" style="width:100px">
        <el-select v-model="value" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in optionData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>监测因子 :</span>
      <div class="layoutBox" style="width:120px">
        <el-select v-model="factorModel" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in factorData"
            :key="item.projectCode"
            :label="item.projectName"
            :value="item.projectCode"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <span>本期({{timeType}}) :</span>
      <div class="layoutBox" style="width:300px" v-show="dateType == 'daterange'">
        <sl-date-picker
          range-separator="至"
          v-model="dateRangeDayOne"
          v-show="dateType == 'daterange'"
          type="date"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="dateRangeChange"
        ></sl-date-picker>
      </div>
      <div class="layoutBox" style="width:140px" v-show="dateType == 'week'">
        <el-date-picker
          v-model="dateRangeWeekOne"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="请选择"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="layoutBox" style="width:140px" v-show="dateType == 'month'">
        <el-date-picker
          v-model="dateRangeMonthOne"
          type="month"
          placeholder="请选择"
          value-format="yyyy-MM"
        ></el-date-picker>
      </div>
      <yf-quarter v-show="dateType == 'quarter'" @getQuar="setQuerterOne"></yf-quarter>
      <div class="layoutBox" style="width:140px" v-show="dateType == 'year'">
        <el-date-picker
          v-model="dateRangeYearOne"
          type="year"
          placeholder="请选择"
          value-format="yyyy"
        ></el-date-picker>
      </div>&emsp;&emsp;
      <span>对比({{timeType}}) :</span>
      <div class="layoutBox" style="width:300px" v-show="dateType == 'daterange'">
        <sl-date-picker
          range-separator="至"
          v-model="dateRangeDayTwo"
          v-show="dateType == 'daterange'"
          type="date"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          disabled
        ></sl-date-picker>
      </div>
      <div class="layoutBox" style="width:140px" v-show="dateType == 'week'">
        <el-date-picker
          v-model="dateRangeWeekTwo"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="请选择"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="layoutBox" style="width:140px" v-show="dateType == 'month'">
        <el-date-picker
          v-model="dateRangeMonthTwo"
          type="month"
          placeholder="请选择"
          value-format="yyyy-MM"
        ></el-date-picker>
      </div>
      <yf-quarter v-show="dateType == 'quarter'" @getQuar="setQuerterTwo"></yf-quarter>
      <div class="layoutBox" style="width:140px" v-show="dateType == 'year'">
        <el-date-picker
          v-model="dateRangeYearTwo"
          type="year"
          placeholder="请选择"
          value-format="yyyy"
        ></el-date-picker>
      </div>&emsp;&emsp;
      <el-button @click="search">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </div>
    <div
      style="position:relative"
      class="currency-mode-wrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="loading-type-a"
      element-loading-background="rgba(255, 255, 255, 1)"
    >
      <div class="echartbox" id="echartbox" style="height: 680px"></div>
      <yf-Datastatus :dataStatus="dataStatus" v-if="dataStatus == 'no'"></yf-Datastatus>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      value: 1,
      dateRangeDayOne: [],
      dateRangeDayTwo: [],
      dateRangeWeekOne: "",
      dateRangeWeekTwo: "",
      dateRangeMonthOne: "",
      dateRangeMonthTwo: "",
      dateRangeYearOne: "",
      dateRangeYearTwo: "",
      querterOne: {},
      querterTwo: {},
      optionData: [
        { label: "日", value: 1 },
        // { label: "周", value: 2 },
        { label: "月", value: 3 },
        { label: "季", value: 4 },
        { label: "年", value: 5 }
      ],
      // optionData1: [
      //     { label: "数据值", value: 1 },
      //     { label: "平均值", value: 2 },
      //     { label: "中位值", value: 3 }
      // ],
      timeType: "日",
      dateType: "daterange",
      factorData: [
        {
          projectName: "CODmn",
          projectCode: "w01019"
        },
        {
          projectName: "溶解氧",
          projectCode: "w01009"
        },
        {
          projectName: "TN",
          projectCode: "w21001"
        },
        {
          projectName: "水温",
          projectCode: "w01010"
        },
        {
          projectName: "电导率",
          projectCode: "w01014"
        },
        {
          projectName: "浊度",
          projectCode: "w01003"
        },
        {
          projectName: "氨氮",
          projectCode: "w21003"
        },
        {
          projectName: "TP",
          projectCode: "w21011"
        },
        {
          projectName: "pH",
          projectCode: "w01001"
        },
        {
          projectName: "CODcr",
          projectCode: "w01018"
        }
      ],
      factorModel: "",
      legendData: [],
      xAxisData: [],
      seriesData: [],
      stationId: "",
      dataStatus: "",
      loading: true
    };
  },
  created() {
    this.dateRangeDayOne = [
      new Date(new Date().setDate(new Date().getDate() - 2)).format(
        "yyyy-MM-dd"
      ),
      new Date().format("yyyy-MM-dd")
    ];

    let lData = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    this.dateRangeDayTwo = [
      lData.format("yyyy") +
        "-" +
        new Date(new Date().setDate(new Date().getDate() - 2)).format("MM-dd"),
      lData.format("yyyy-MM-dd")
    ];
    this.getFactors();
    this.getEchartData();
  },
  mounted() {
    // this.$nextTick(()=>{
    //     this.initEchart()
    // })
  },
  methods: {
    selectChange(arr) {
      for (let i in this.optionData) {
        if (arr == this.optionData[i].value) {
          this.timeType = this.optionData[i].label;
        }
      }
      if (this.timeType == "日") {
        this.dateType = "daterange";
      } else if (this.timeType == "周") {
        this.dateType = "week";
      } else if (this.timeType == "月") {
        this.dateType = "month";
      } else if (this.timeType == "季") {
        this.dateType = "quarter";
        0;
      } else if (this.timeType == "年") {
        this.dateType = "year";
      }
    },
    //获取监测因子
    getFactors() {
      this.factorModel = this.factorData[0].projectCode;
      //  this.$http.get("/SiteManagement/index/getDownLine").then(res => {
      //   if (res.data.code == 0) {
      //     this.factorData = res.data.content.dataList;
      //     this.factorModel=this.factorData[0].projectCode
      //   }
      // });
    },
    //时间类型为日时，时间改变，默认填充第二个时间框时间
    dateRangeChange() {
      let lData1 = new Date(
        new Date(this.dateRangeDayOne[0]).setFullYear(
          new Date(this.dateRangeDayOne[0]).getFullYear() - 1
        )
      );
      let lData2 = new Date(
        new Date(this.dateRangeDayOne[1]).setFullYear(
          new Date(this.dateRangeDayOne[1]).getFullYear() - 1
        )
      );
      this.dateRangeDayTwo = [
        lData1.format("yyyy-MM-dd"),
        lData2.format("yyyy-MM-dd")
      ];
    },
    initEchart(xAxisData, seriesData, legendData) {
      var option = {
        title: {
          text: legendData[0] + "变化分析图",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let showHtm =
              params[0].axisValue +
              "<br>" +
              params[0].seriesName +
              ":" +
              params[0].value +
              seriesData[0].unit;
            return showHtm;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          splitLine: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: {
          splitNumber: 3,
          name: "监测值",
          splitLine: {
            show: false
          }
        },
        series: seriesData
      };
      var myChart = this.$echarts.init(document.getElementById("echartbox"));
      //使用制定的配置项和数据显示图表
      myChart.setOption(option);
    },
    search() {
      this.getEchartData();
    },
    //获取季度组件传出的数据
    setQuerterOne(obj) {
      this.querterOne = obj;
    },
    setQuerterTwo(obj) {
      this.querterTwo = obj;
    },
    //获取绘图数据
    getEchartData() {
      
      if (
        (this.dateRangeDayOne[0] != null && this.dateRangeDayOne[1] != null) ||
        (this.dateRangeMonthOne && this.dateRangeMonthTwo) ||
        (this.querterOne.year && this.querterTwo.year) ||
        (this.dateRangeYearOne && this.dateRangeYearTwo)
      ) {
        this.loading = true;
        //根据时间选择类型组装搜索参数
        let params = {};
        if (this.timeType == "日") {
          params = {
            stationCode: this.stationId,
            factorCode: this.factorModel,
            startTime: this.dateRangeDayOne[0],
            endTime: this.dateRangeDayOne[1],
            startQuarter: "",
            endQuarter: "",
            type: "day",
            compareStart: this.dateRangeDayTwo[0],
            compareEnd: this.dateRangeDayTwo[1]
          };
        } else if (this.timeType == "周") {
          var now = new Date(this.dateRangeWeekOne);
          var nowTime = now.getTime();
          var day = now.getDay();
          var oneDayTime = 24 * 60 * 60 * 1000;
          var MondayTime = nowTime - day * oneDayTime; //显示周一
          var SundayTime = nowTime + (6 - day) * oneDayTime; //显示周日

          var af = new Date(this.dateRangeWeekTwo);
          var afTime = af.getTime();
          var day = af.getDay();
          var MondayTime1 = afTime - day * oneDayTime; //显示周一
          var SundayTime1 = afTime + (6 - day) * oneDayTime; //显示周日

          params = {
            stationCode: this.stationId,
            factorCode: this.factorModel,
            startTime: new Date(MondayTime).format("yyyy-MM-dd"),
            endTime: new Date(SundayTime).format("yyyy-MM-dd"),
            startQuarter: "",
            endQuarter: "",
            type: "day",
            compareStart: new Date(MondayTime1).format("yyyy-MM-dd"),
            compareEnd: new Date(SundayTime1).format("yyyy-MM-dd")
          };
        } else if (this.timeType == "月") {
          params = {
            stationCode: this.stationId,
            factorCode: this.factorModel,
            startTime: this.dateRangeMonthOne,
            endTime: this.dateRangeMonthOne,
            startQuarter: "",
            endQuarter: "",
            type: "month",
            compareStart: this.dateRangeMonthTwo,
            compareEnd: this.dateRangeMonthTwo
          };
        } else if (this.timeType == "季") {
          params = {
            stationCode: this.stationId,
            factorCode: this.factorModel,
            startTime: this.querterOne.year,
            endTime: this.querterOne.year,
            startQuarter: this.querterOne.quarter,
            endQuarter: this.querterTwo.quarter,
            type: "quarter",
            compareStart: this.querterTwo.year,
            compareEnd: this.querterTwo.year
          };
        } else if (this.timeType == "年") {
          params = {
            stationCode: this.stationId,
            factorCode: this.factorModel,
            startTime: this.dateRangeYearOne,
            endTime: this.dateRangeYearOne,
            startQuarter: "",
            endQuarter: "",
            type: "year",
            compareStart: this.dateRangeYearTwo,
            compareEnd: this.dateRangeYearTwo
          };
        }
        this.$http
          .get("/Statistics-Service/dataCharts/annualRatioCharts", {
            params: params
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
            if (res.data.code == 0) {
              this.xAxisData = res.data.content.info.xAxis;
              this.seriesData = res.data.content.info.series;
              this.legendData = res.data.content.info.legend;
              var myChart = this.$echarts.init(
                document.getElementById("echartbox")
              );

              myChart.clear();
              this.initEchart(this.xAxisData, this.seriesData, this.legendData);
            }
          });
      } else {
        this.$message.error('请先选择时间查询')
      }
    }
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    }
  },
  watch: {
    stationInfo(value) {
      if (value.length > 0) {
        this.stationId = value[0].nodeId;
        this.getEchartData();
      }
    }
  }
};
</script>

<style scope lang="less">
.echartbox {
  margin-top: 5px;
  height: 680px;
}
</style>
