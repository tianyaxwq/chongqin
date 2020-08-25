<template>
  <div class="singlePage secondary-page-mode">
    <div class="secondary-toolbar">
          <span>时间选择 : </span>&nbsp;
          <div class="layoutBox" style="width:242px">
            <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>&emsp;&emsp;
          <span>监测项目 : </span>&nbsp;
          <div class="layoutBox" style="width:120px">
            <el-select v-model="value" multiple collapse-tags placeholder="请选择" @change="selectChange">
                  <el-option
                    v-for="item in optionData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
          <el-button><i class="iconfont icon-sousuo"></i>查询</el-button>
        
    </div>
    <div class="currency-mode-wrap">
           <div class="echartbox" id="echartbox">

           </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      dateRange: "",
      value:'',
      optionData: [],
    };
  },
  created() {
    this.$store.commit("setShowlefttree", true);
  },
  mounted() {
      this.$nextTick(()=>{
           this.initEchart()
      }) 
  },
  methods: {
    initEchart() {
      var option = {
        title: {
          text: "水温变化分析图",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data:['2019-01-20','2019-01-21','2019-01-22','2019-01-23','2019-01-24','2019-01-25','2019-01-26','2019-01-27','2019-01-28'],
          splitLine: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: {
          splitNumber: 3,
          name:'监测值',
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "最小值",
            type: "line",
            data:[100,80,50,85,90,40,50,60,270],
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            stack: "confidence-band",
            symbol: "none"
          },
          {
            name: "最大值",
            type: "line",
            data:[200,180,150,185,190,140,150,160,60],
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: "#ccc"
              }
            },
            stack: "confidence-band",
            symbol: "none"
          },
          {
            type: "line",
            name:'平均值',
            data:[150,130,100,160,140,90,100,110,275],
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
              normal: {
                color: "#c23531"
              }
            },
            showSymbol: true
          }
        ]
      };
      var myChart = this.$echarts.init(document.getElementById("echartbox"));

      //使用制定的配置项和数据显示图表
      myChart.setOption(option);
    },
    selectChange(arr) {}
  }
};
</script>

<style scope lang="less">
.singlePage {
  .echartbox {
    margin-top: 5px;
    height: 450px;
  }
}
</style>
