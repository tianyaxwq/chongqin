<template>
    <!-- 报警管理弹窗=》上下游数据 -->
  <div class="up-and-down-data">
    <div class="toolbar-wrap">
      <span>时间选择 :</span>
      <div class="layoutBox" style="width:242px">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>&emsp;
      <el-button>
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </div>
    <div class="content-wrap">
      <div id="up-and-down-chart"></div>
      <div class="map-wrap"></div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "upAndDownData",
      data(){
        return {
          dateRange: ''
        }
      },
      methods:{
        upAndDownChart(){
          let chart = this.$echarts.init(document.getElementById('up-and-down-chart'));
          let option = {
            color:['#297EFF','#1CAD8B','#C2A100'],
            title: {
              text: '高锰酸盐-上下游趋势图',
              x:'center',
              y:20,
              textStyle:{
                fontSize: 16,
              }
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['中位值','最新值','平均值'],
              top: 50
            },
            grid: {
              top: 80,
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['站点1','站点2','站点3','站点4','站点5','站点6','站点7'],
              axisLine:{
                show: false,
              },
              axisTick:{
                show: false,
              }
            },
            yAxis: {
              type: 'value',
              axisLine:{
                show: false,
              },
              axisTick:{
                show: false,
              }
            },
            series: [
              {
                name:'中位值',
                type:'line',
                smooth: true,
                data:[120, 132, 101, 134, 90, 230, 210]
              },
              {
                name:'最新值',
                type:'line',
                smooth: true,
                data:[220, 182, 191, 234, 290, 330, 310]
              },
              {
                name:'平均值',
                type:'line',
                smooth: true,
                data:[150, 232, 201, 154, 190, 330, 410]
              }
            ]
          };
          chart.setOption(option);
        }
      },
      mounted(){
        this.upAndDownChart();
      },
    }
</script>

<style scoped lang="less">
.up-and-down-data{
  height: 100%;
  .content-wrap{
    height: calc(100% - 30px);
    #up-and-down-chart{
      height: 55%;
    }
    .map-wrap{
      height: 45%;
    }
  }
}
</style>
