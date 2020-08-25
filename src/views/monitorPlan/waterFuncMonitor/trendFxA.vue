<template>
  <div class="singlePage secondary-page-mode">
     <div class="secondary-toolbar">
         
          <span>时间选择 : </span>&nbsp;
           <div class="layoutBox" style="width:250px" v-show="value == 1">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="left"
               range-separator="~"
              format = 'yyyy-MM-dd'
              value-format = 'yyyy-MM-dd'
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
           <div class="layoutBox" style="width:250px" v-show="value == 2">
             <el-date-picker
              v-model="weekRange"
              type="daterange"
              align="left"
               range-separator="~"
              format = 'yyyy-MM-dd'
              value-format = 'yyyy-MM-dd'
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="layoutBox" style="width:250px" v-show="value == 3">
            <el-date-picker
              v-model="month"
              type="monthrange"
               format = 'yyyy-MM'
              value-format = 'yyyy-MM'
              range-separator="~"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
             >
            </el-date-picker>
          </div>&emsp;&emsp;
           <div class="layoutBox" style="width:100px" v-show="value == 4">
            <el-date-picker
              v-model="yearStart"
              type="year"
              placeholder="开始年份"
               format = 'yyyy'
              value-format = 'yyyy'
             >
            </el-date-picker>
          </div>&emsp;
           <div class="layoutBox" style="width:100px" v-show="value == 4">
            <el-date-picker
              v-model="yearEnd"
              type="year"
              placeholder="结束年份"
               format = 'yyyy'
              value-format = 'yyyy'

             >
            </el-date-picker>
          </div>&emsp;
           <span>监测站点 : </span>
          <div class="layoutBox" style="width:100px">
             <el-select v-model="stationvalue" placeholder="请选择">
                   <el-option
                     v-for="item in optionStationat"
                     :key="item.label"
                     :label="item.label"
                     :value="item.label">
                   </el-option>
             </el-select>
          </div>&emsp;&emsp;
          <span>监测项目 : </span>&nbsp;
          <div class="layoutBox" style="width:187px">
            <el-select v-model="factorModel" multiple collapse-tags placeholder="请选择" >
                  <el-option
                    v-for="item in factorData"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
            </el-select>
          </div>&emsp;&emsp;
          <el-button @click="getEchartData"><i class="iconfont icon-sousuo"></i>查询</el-button>
        
     </div>
     <div style="position:relative" class="currency-mode-wrap"  v-loading="loading"  element-loading-text="加载中"
               element-loading-spinner="loading-type-a"
               element-loading-background="rgba(255, 255, 255, 1)">
           <div class="echartbox" id="echartbox">

           </div>
            <yf-Datastatus :dataStatus="dataStatus" v-if="dataStatus == 'no'"></yf-Datastatus>
     </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      dateRange: [],
      factorModel: [],
      factorData: [],
      loading: true,
      colors: {
        an: "#e53ce6", //水温
        temp: "#297eff", //溶解氧
        ph: "#1cad8b", //浑浊度
        do_: "#00a3f5", //电导率
        permanganate: "#1ebd1e", //高锰酸盐指数
       
      },
      unit: {
        水温: "℃", //水温
        溶解氧: "mg/L", //溶解氧
        浊度: "NTU", //浑浊度
        电导率: "μS/cm", //电导率
        CODmn: "mg/L", //高锰酸盐指数
        氨氮: "mg/L", //氨氮
        TP: "mg/L", //总磷
        TN: "mg/L", //总氮
        pH: "无量纲", //PH
        CODcr: "mg/L" //CODcr
      },
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      dataStatus: "",
      optionStationat: [
          { label: "北青", value:1 },
          { label: "安新桥", value:2 },
          { label: "采蒲台", value:3 },
          { label: "大张庄", value:4 },
          { label: "端村", value:5 },
          { label: "留通", value:6 },
          { label: "圈头", value:7 },
          { label: "同口", value: 8 },
           { label: "王家寨", value: 9 },
          { label: "枣林庄", value: 10 },
          { label: "张青口", value: 11 }
      ],
      stationvalue:'北青',
      value:1,
     yearStart:'2018',
      yearEnd:"2019",
      dateRange:[],
      weekRange:[],
      month:[],
    };
  },
  created() {
    this.initTime();
    this.getFactor();
  },
  mounted() {},
  methods: {
    initEchart(legendData, xAxisData, seriesData) {
      let _this = this;
      var option = {
        title: {
          text: "变化趋势分析图",
          x: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let res = params[0].axisValue + "<br/>";
            for (let i = 0; i < params.length; i++) {
              res +=
                "<p>" +
                params[i].seriesName +
                " : " +
                params[i].value +
                "" +
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
          show: true,
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
        yAxis:{
                  type: "value",
                  name: "",
                 
                 
                 
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
    },
    selectChange(arr) {},
    initTime() {
      //初始化时间
      let startTime = new Date('2019-11-01');
      let endTime = new Date('2019-11-30');
      this.dateRange = [
        new Date(startTime).format("yyyy-MM-dd hh:mm:ss"),
        endTime.format("yyyy-MM-dd hh:mm:ss")
      ];
    },
    //获取所有监测项目
    getFactor() {
      this.$http.get("/fileXA/waterFunction/queryWaterFunctionProjects").then(res => {
        if (res.data.code == 0) {
          this.factorModel = [];
          this.factorData = res.data.content.dataList;
          for (let i in this.factorData) {
            if(i<5){
              this.factorModel.push(this.factorData[i].code);
            }
          }
          this.getEchartData();
        }
      });
    },
    getEchartData() {
       this.loading = true;
       this.dataStatus='';
       let startTime="";
       let endTime="";
       let type="";
        if(this.value == 1){
           startTime=this.dateRange[0];
           endTime=this.dateRange[1];
           type="day"
        }else if(this.value ==2){
           startTime=this.weekRange[0];
           endTime=this.weekRange[1];
             type="week"
        }else if(this.value ==3){
           startTime=this.month[0];
           endTime=this.month[1];
            type="month"
        }else if(this.value ==4){
           startTime=this.yearStart;
           endTime=this.yearEnd;
            type="year"
        }
      this.$http
        .get("/fileXA/waterFunction/queryMultiProjects", {
          params: {
            stationNames: this.stationvalue, //站点编码（mn）'40000000000001'
            projects: this.factorModel.join(","), //因子参数（编码）'w01019'
            startTime:startTime, //开始时间
            endTime: endTime, //结束时间
            
          }
        })
        .then(res => {
             this.loading = false;
            if(!res.data.content){
                var myChart = this.$echarts.init(document.getElementById("echartbox"));

                //使用制定的配置项和数据显示图表
                myChart.clear();
                this.dataStatus='no';
                return false;
            }else{
              this.dataStatus='';
            }
          let arr = res.data.content.dataList;
          this.legendData=[];
          this.xAxisData=[];
           this.seriesData=[];
          if(arr && arr.length>0){
             var myChart = this.$echarts.init(document.getElementById("echartbox"));

            myChart.clear();
            this.xAxisData=arr[0].category
            for(let i=0;i<arr.length;i++){
              this.legendData.push(arr[i].factor);
              this.seriesData.push({
                name: arr[i].factor,
                type: "line",
                data: arr[i].series,               
                markPoint: {
                  data: [
                    { type: "max", name: "最大值" },
                    { type: "min", name: "最小值" }
                  ]
                }
              })
            }
          }
          this.initEchart(
              this.legendData,
              this.xAxisData,
              this.seriesData
            );
        });
       
    }
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    },
    detailTree: {
      get: function() {
        return this.$store.state.detailTree;
      }
    }
  },
  watch: {
    
    detailTree(value) {
      //监听站点树开启关闭重新绘图
      var myChart = this.$echarts.init(document.getElementById("echartbox"));
      setTimeout(() => {
        myChart.resize();
      }, 300);
    }
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
