<template>
    <!-- 报警管理弹窗=》历史数据 -->
    <div class="historical-data">
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
        <el-checkbox v-model="rawData">原始数据</el-checkbox>
        <el-button>
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
      </div>
      <div class="content-wrap">
        <div id="trends-historical"></div>
        <div class="table-wrap">
          <el-table
            :data="tableData"
            height="100%"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="60">
            </el-table-column>
            <el-table-column
              prop="date"
              label="监测时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="factor"
              :show-overflow-tooltip="true"
              label="CODmn">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "historicalData",
        data(){
          return {
            dateRange:'',
            rawData:false,
            tableData:[{
              date:'2019-08-10 12时',
              factor:'1.8'
            }],
          }
        },
        methods:{
          trendsHistoricalChart(){
            let eChart = this.$echarts.init(document.getElementById('trends-historical'));
            let option = option = {
              title: {
                text: '高锰酸盐指数变化趋势图',
                x:'center',
                y: 20,
                textStyle:{
                  fontSize: 16,
                }
              },
              tooltip : {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              legend: {
                show: false,
              },
              dataZoom: [{
                type: 'inside'
              }, {
                type: 'slider'
              }],
              grid: {
                left: '3%',
                right: '8%',
                bottom: 46,
                containLabel: true
              },
              xAxis : [
                {
                  type : 'category',
                  boundaryGap : false,
                  data : ['2019-02-07 06时','2019-02-07 07时','2019-02-07 08时','2019-02-07 09时',
                    '2019-02-07 10时','2019-02-07 11时','2019-02-07 12时'],
                  axisLine:{
                    show: false,
                  },
                  axisTick:{
                    show: false,
                  }
                }
              ],
              yAxis : [
                {
                  type : 'value',
                  axisLine:{
                    show: false,
                  },
                  axisTick:{
                    show: false,
                  }
                }
              ],
              series : [
                {
                  name:'浓度',
                  type:'line',
                  itemStyle: {
                    color: '#297EFF'
                  },
                  areaStyle: {
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(41, 126, 255, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(41, 126, 255, 0.2)'
                    }])
                  },
                  smooth: true,
                  // color:'#297EFF',
                  data:[120, 132, 101, 134, 90, 230, 210]
                },
              ]
            };
            eChart.setOption(option);
          }
        },
        mounted(){
          this.trendsHistoricalChart();
        }
    }
</script>

<style scoped lang="less">
.historical-data{
  height: 100%;
  .content-wrap{
    height: calc(100% - 30px);
    #trends-historical{
      height: 55%;
    }
    .table-wrap{
      height: 45%;
    }
  }
}
</style>
