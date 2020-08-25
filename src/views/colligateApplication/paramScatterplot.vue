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
          text: "水温变化趋势分析图",
          x: "center"
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          data: ["水温",'日均值'],
          y: "bottom"
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "2019/01/27",
            "2019/01/28",
            "2019/01/29",
            "2019/01/30",
            "2019/02/01",
            "2019/02/02",
            "2019/02/03",
            "2019/02/04",
            "2019/02/05",
            "2019/02/06",
            "2019/02/07",
            "2019/02/08",
            "2019/02/09",
            "2019/02/10",
          ]
        },
        yAxis: {
          type: "value",
          name: "监测值(℃)"
        },
        series: [
          {
            name: "日均值",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10, 12, 11, 16, 13, 8, 10, 12],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            symbolSize: 10,
            name:'水温',
            data: [
              [0,11.2],
              [0,11.3],
              [0,11.4],
              [0,11.5],
              [0,11.6],
              [1, 6.95],
              [2, 7.58],
              [3, 8.81],
              [4, 8.33],
              [5, 9.96],
              [6, 7.24],
              [7, 4.26],
              [8, 10.84],
              [9, 4.82],
              [10, 5.68],
              [11, 4.26],
              [12, 10.84],
              [13, 4.82],
              [14, 5.68]
            ],
            type: "scatter"
          }
        ]
      };
      //初始化echarts实例
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
