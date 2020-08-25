<template>
    <!-- 水质公报 -->
    <div class="water-quality-bulletin">
      <el-button  class="download-btn" @click="exportData"> 下载 </el-button  class="download-btn" >
      <h4 class="bulletin-title"> {{headtitle}} </h4>
      <p class="subtext">该数据未经审核，仅供参考</p>
      <div class="report-table-wrap"
           v-loading="waterLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="loading-type-a"
           element-loading-background="rgba(255, 255, 255, 1)"
           style="position: relative"
      >
        <!--<div v-if="waterLoading" class="loading-wrap"></div> -->
        <div v-if="waterNoDataState" class="no-data-wrap small no-data-table">
          <p>暂无数据</p>
        </div>
        <el-table
          :data="tableData"
          border
          empty-text=" "
          height="100%"
          style="width: 100%">
          <el-table-column
            label="序号"
            align="center"
            fixed
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="stationName"
            label="站点"
            fixed
            :show-overflow-tooltip = "true"
            width="112">
          </el-table-column>
          <el-table-column
              prop="dataTime"
              label="监测时间"
              fixed
              :show-overflow-tooltip = 'true'
              width="112">
          </el-table-column>
          <el-table-column :key="index" v-for="item,index in headcolumn" :label="item.projectName">
            <el-table-column
              :prop="item.code"
              :width="setWidth(item.projectName+item.projectUnit)"
              :label="item.projectUnit">
            </el-table-column>
          </el-table-column> 
          <el-table-column
            prop="waterQualityIndex"
            width="156"
            label="断面综合指数（PⅢ）">
          </el-table-column>
          <el-table-column
            prop="evaluation"
            width="120"
            label="水质定性评价">
          </el-table-column> 
        </el-table>
      </div>
    </div>
</template>

<script>
    // import {formatDate} from '../../dateformat.js'
    export default {
        name: "waterQualityBulletin",
        props:["equipIds"],
        data(){
          return {
            waterLoading:true,
            waterNoDataState:false,
            tableData:[],
            headcolumn:[
              {code:"w01010", projectName:"水温", projectUnit:"℃"},
              {code:"w01001", projectName:"pH", projectUnit:"无量纲"},
              {code:"w01009", projectName:"溶解氧", projectUnit:"mg/L"},
              {code:"w01003", projectName:"浑浊度", projectUnit:"NTU"},
              {code:"w01014", projectName:"电导率", projectUnit:"μS/cm"},
              {code:"w01019", projectName:"高锰酸盐指数", projectUnit:"mg/L"},
              {code:"w21003", projectName:"氨氮", projectUnit:"mg/L"},
              {code:"w21011", projectName:"总磷", projectUnit:"mg/L"},
              {code:"w21001", projectName:"总氮", projectUnit:"mg/L"},
            ],
            headtitle:''
          }
          
        },
        methods:{
          setWidth(str){
            if(str){
              let num = str.length;
              return (num*14)>104?(num*14+20):104;
            }
          },
          getpropertys(item){
            return 'projects.'+item.projectCode+'.value';
          },
          searchcolumn(){
            // this.waterLoading = false;
             this.dataSearch();
           
          },
          dataSearch(){
            var statisType='month';
            var date=new Date();
            date.setMonth(date.getMonth()-1);
            // var startTime=formatDate(date,'yyyy-MM-01 00:00:00');
            var startTime = date.format('yyyy-MM-01 00:00:00');
            this.headtitle='顺德水道地表水'+startTime.substring(0,7)+'月报';
            date.setMonth(date.getMonth()+1);
            // var endTime=formatDate(date,'yyyy-MM-01 00:00:00');
            var endTime=date.format('yyyy-MM-01 00:00:00');
            var paramsp={
              mn: this.equipIds.toString(),
              pageNum:1,
              beginTime:  startTime, //"2019-06-01 00:00:00",//  startTime,
              endTime: endTime, //"2019-06-21 00:00:00",// endTime,
              pageSize:'10000'
            };
            this.$http.get('/Receiving/queryRowToColHourData',{
              params:paramsp
            }).then((response)=>{
              let dataJson = response.data;
              if(dataJson.code === 0){
                this.tableData = dataJson.content.dataList;
                this.total=dataJson.content.total;
                if(dataJson.content.dataList.length === 0) {
                  this.waterNoDataState = true;
                }else{
                  this.waterNoDataState = false;
                }
              }
              this.waterLoading = false;
            }).catch((error)=>{
              this.waterNoDataState = true;
              this.waterLoading = false;
              console.info(error);
            });
          },
          exportData(){
            var statisType='month';
            var date=new Date();
            date.setMonth(date.getMonth()-1);
            // var startTime=formatDate(date,'yyyy-MM-01 00:00:00');
            var startTime = date.format('yyyy-MM-01 00:00:00');
            date.setMonth(date.getMonth()+1);
            // var endTime=formatDate(date,'yyyy-MM-01 00:00:00');
            var endTime = date.format('yyyy-MM-01 00:00:00');
            window.open("/waterenvapi/report/autoStationMuiltiDbszgbExport?queryType=station&equipdIds="+this.equipIds.toString()+'&statisType='+statisType+'&startTime='+startTime+'&endTime='+endTime)
          }
        }
        
    }
</script>

<style scoped lang="less">
.water-quality-bulletin{
  position: relative;
  padding: 10px 28px;
  .download-btn{
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 99;
  }
  .bulletin-title{
    line-height: 28px;
    font-size: 16px;
    text-align: center;
  }
  .subtext{
    text-align: center;
    color: #999;
  }
  .report-table-wrap{
    margin-top: 14px;
    height: 330px;
  }
  .no-data-table.no-data-wrap p{
    top: 70px;
  }
}
</style>
