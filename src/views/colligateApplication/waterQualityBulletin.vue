<template>
  <!--自动站单站报表-->
  <div class="single-station-report-page">

    <div class="secondary-page-mode" style="height: 100%;">
      <div class="secondary-toolbar">
        <span>时间段：</span>
        <div class="layoutBox" style="width:125px">
          <el-date-picker
            v-model = "dataValue"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择时间">
          </el-date-picker>
        </div>&emsp;
        <el-button @click="getTableData"><i class="iconfont icon-sousuo"></i>生成</el-button>
        <el-button type='delet'  @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      </div>
      <div class="currency-mode-wrap">

        <el-scrollbar class="currency-mode-scroll">
          <h4 class="report-form-title">{{stationName}}地表水水质公报</h4>
          <p style="text-align:center">{{headtitle}}</p>
          <div class="report-table-wrap" style="position: relative;">
           
            <el-table
              :data="tableData"
              border
              ref="table"
              tooltip-effect="light"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                fixed
                width="50">
              </el-table-column>
              <el-table-column
                prop="name"
                label="站点"
                fixed
                :show-overflow-tooltip = 'true'
                width="230">
              </el-table-column>
              <el-table-column
                prop="keyPollution"
                label="主要污染指标"
                fixed
                :show-overflow-tooltip = 'true'
                width="130">
              </el-table-column>
              <el-table-column :key="index" v-for="(item,index) in headcolumn"
                  :label="item.name" :prop="item.code" width="130">
              </el-table-column>
              <el-table-column
                prop="compositeIndex"
                width="150"
                label="断面综合指数（PⅢ）">
              </el-table-column>
              <el-table-column
                prop="waterCondition"
                width="106"
                label="水质定性评价">
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import {exportTableData} from '../../assets/js/tableExport'
export default {
  name: "waterQualityBulletin",
  data() {
    return {
      reportLoading: true,
      reportNoDataState: false,
      dataValue: "", //时间绑定数据
      tableData: [], //表格数据
      headtitle: "",
      stationName:'',
      headcolumn: [],
      stationId: "",
      openPage:'',
      fieldList:[],
    };
  },
  methods: {
    getTableData() {
      this.$http
        .get("/Statistics-Service/dataReports/publicWaterQualityReports", {
          params: {
            timeType: "month",
            time: this.dataValue,
            queryCode: this.stationId,
            queryType:this.openPage,
             userId:this.toolObj.getCookie('userId')
          }
        })
        .then(res => {
           if (res.data.code == 0) {
            this.headcolumn = res.data.content.info.project;
            this.tableData = res.data.content.dataList;
            this.headtitle=res.data.content.info.message;
          }
        });
    },
     //导出报表
    exportExcel(){
        let {table} = this.$refs;
        let tableBox = table.$el;
        let header = tableBox.querySelector('.el-table__header');
        let title = '地表水水质公报';
        this.fieldList=["name","keyPollution"]
        for(let i =0;i<this.headcolumn.length;i++){
         
          this.fieldList.push(this.headcolumn[i].code)
         
        };
       
        this.fieldList.push("compositeIndex");
         this.fieldList.push("waterCondition")
        let params = {
          headerProp:this.fieldList.join(','),
          timeType: "month",
          time: this.dataValue,
          queryCode: this.stationId,
          queryType:this.openPage,
         
        };
        exportTableData(header,title,'','1',"/Statistics-Service/exports/waterQaulityPublicReports",params);
    }
  },
  mounted() {},
  created() {
    this.dataValue = new Date().format("yyyy-MM");
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.strictlyinfo;
      }
    }
  },
  watch: {
    stationInfo(value) {
      if (value.length > 0) {
        this.stationId = value[0].nodeId;
        this.openPage = value[0].nodeType;
        this.stationName = value[0].nodeName;
        this.getTableData()
      }
    }
  }
};
</script>

<style scoped lang="less">
.single-station-report-page {
  height: 100%;
  .currency-mode-wrap {
    height: calc(100% - 56px);
  }
  .currency-mode-scroll {
    height: 100%;
  }
  .report-form-title {
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    text-align: center;
    margin-top: 12px;
  }
  .report-form-subtitle {
    text-align: center;
    line-height: 24px;
  }
  .report-table-wrap {
    padding: 10px 34px 0;
  }
  .majorPollutants {
  }
}
</style>
