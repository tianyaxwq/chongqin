<template>
  <div
    class="water-ranking-content"
    v-loading="waterLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="loading-type-a"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <div class="water_search">
      <el-select v-model="value" placeholder="请选择" size="small" style="width: 200px; margin-right: 10px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <template v-if="value == 2">
        <el-date-picker
          id="weekSelected"
          @change="formatWeek"
          style="width: 200px; margin-right: 10px"
          v-model="timeFormatDate[0]"
          type="week"
          format="yyyyWW"
          placeholder="选择周">
        </el-date-picker>
      </template>

      <template v-if="value == 3">
        <el-date-picker
          style="width: 200px; margin-right: 10px"
          v-model="timeFormatDate[1]"
          type="month"
          value-format="yyyyMM"
          placeholder="选择月">
        </el-date-picker>
      </template>

      <template v-if="value == 4">
        <el-date-picker
          style="width: 200px; margin-right: 10px"
          v-model="timeFormatDate[2]"
          type="year"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
      </template>

      <el-button @click="searchData">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button @click="exportData" type="delet">
        <i class="iconfont icon-daochu"></i>导出
      </el-button>
    </div>
    <!--<div v-if="waterLoading" class="loading-wrap"></div>-->
    <div v-if="waterNoDataState" class="no-data-wrap small no-data-table">
      <p>暂无数据</p>
    </div>
    <el-scrollbar style="height:100%">
      <div class="water-ranking-table">
        <el-table :data="tableData" border empty-text=" " size="small" style="width: 100%" ref="table">
          <el-table-column type="index" label="排名" width="56"></el-table-column>
          <el-table-column prop="stationName" label="断面名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="wqg" label="水质等级">
            <template slot-scope="scope">
              <span v-if="scope.row.wRealData == null || scope.row.wRealData.wq_tp == 'null' || !scope.row.wRealData.wq_tp">--</span>
              <span v-else>
                <i
                  class="target-level"
                  :class="'colorValue' + scope.row.wRealData.wq_tp"
                >{{ transformationText(scope.row.wRealData.wq_tp) }}</i>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div id="myEcharts" style="height: 300px">

        </div>
      </div>
      <!-- <div class="water-ranking-paging">
        <el-pagination
          @size-change="paginationSizeChange"
          @current-change="paginationChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          background
          :small="true"
          popper-class="select-common-option"
          :page-sizes="pageList"
          layout="->,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div> -->
    </el-scrollbar>
  </div>
</template>

<script>
// import {formatDate} from '../../dateformat.js'
import { exportTableData } from "../../assets/js/tableExport";
export default {
  name: "waterRanking",
  props: ["equipIds", "datas", "levels", "controllers", "panelName"],
  watch: {
    tableData(val) {
      if (val.length === 0) {
        this.waterNoDataState = true;
      } else {
        this.waterNoDataState = false;
      }
    }
  },
  mounted() {
    this.tableData.forEach((item,index)=>{
      if( item.wRealData && item.wRealData.wq_tp ) {
        this.dataForm[Number(item.wRealData.wq_tp)] ++
      }
    })
    if( JSON.stringify(this.echarts) == "{}" ) {
      this.drawLine()
    }
  },
  data() {
    return {
      dataForm: [0, 0, 0, 0, 0, 0],
      timeFormatDate: [
        "",
        "",
        ""
      ],
      options: [
        {
          value: 1,
          label: '实时排名'
        },
        {
          value: 2,
          label: '周排名'
        },
        {
          value: 3,
          label: '月度排名'
        },
        {
          value: 4,
          label: '年度排名'
        },
      ],
      value: 1,
      weekString: "",
      waterLoading: false,
      waterNoDataState: false,
      total: 62, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      tableData: [],
      echarts: {},
      currentPage: 1
    };
  },
  computed: {
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  },
  methods: {
    formatWeek(val){
      setTimeout(()=>{
        this.weekString = $("#weekSelected").val()
      }, 500)
    },
    paginationChange(val) {
      //分页页码改变时执行
      this.seachData();
    },
    exportData(){
      // 导出排名
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "站点水质排名";
      let dateType = ["", "周", "月", "年"]
      let params = {
        headerProp: "stationName,wq_tp",
        types: '',
        controllers: '',
        dataType: dateType[this.value - 1],
        time: ""
      }
      if( this.value > 1 ) {
        if( this.value == 2 ) {
          // params.time = this.weekString
          // 没有周的数据，暂时用2月的数据
          params.dataType = "月"
          params.time = "202002"
        } else {
          params.time = this.timeFormatDate[this.value-2]
        }
      }
      if( this.panelName == "站点类型" ) {
        params.types = this.levels
      } else if( this.panable == "污染类型" ) {

      } else {
        params.controllers = this.controllers
      }
      // this.$http.post("/waterEnvXA/exports/waterDataRankExcel", params, {responseType:'blob'}).then(res=>{
      //   const blob =new Blob([res.data], {type:'application/octet-stream;charset=utf-8'});
      //   const fileName ='站点水质排名.xlsx';
      //   const elink =document.createElement('a');
      //   elink.download =fileName;
      //   elink.style.display ='none';
      //   elink.href =URL.createObjectURL(blob);
      //   document.body.appendChild(elink);
      //   elink.click();
      //   URL.revokeObjectURL(elink.href);
      //   document.body.removeChild(elink);
      // })
      console.log(header, title)
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/waterDataRankExcel",
        params
      );
    },
    searchData(){
      if( this.value == 1 ) {
        this.seachData()
      } else {
        // 查询
        // { types: "WQ11", controllers: this.stationLevelTypes, dataType: "月", time: "202002" }
        let dateType = ["", "周", "月", "年"]
        let params = {
          types: '',
          controllers: '',
          dataType: dateType[this.value - 1],
          time: ""
        }
        if( this.value > 1 ) {
          if( this.value == 2 ) {
            // params.time = this.weekString
            // 没有周的数据，暂时用2月的数据
            params.dataType = "月"
            params.time = "202002"
          } else {
            params.time = this.timeFormatDate[this.value-2]
          }
        }
        if( this.panelName == "站点类型" ) {
          params.types = this.levels
        } else if( this.panable == "污染类型" ) {

        } else {
          params.controllers = this.controllers
        }
        this.$http.get("/dataHandle/yunliBase/waterStationDataSortBy", { params: params }).then(res=>{
          this.tableData = res.data.content.dataList
          this.dataForm = [0, 0, 0, 0, 0, 0]
          this.tableData.forEach((item,index)=>{
            if( item.wRealData && item.wRealData.wq_tp ) {
              this.dataForm[Number(item.wRealData.wq_tp)] ++
            }
          })
          this.echarts.clear()
          this.drawLine()
        })
      }
    },
    drawLine() {
      this.echarts = this.$echarts.init(document.getElementById("myEcharts"))
      let color = [
        "#CCFFFF",
        "#00CCFF",
        "#00FF00",
        "#FFFF00",
        "#FF9B00",
        "#FF0000",
        "#E8E8E8",
      ]
      let option  = {
        title: {
          show: true,
          text: "水质类别占比"
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: "right",
          y: "center",
          padding:[0, 80, 0, 0],
          data: ['Ⅰ类', 'Ⅱ类', "Ⅲ类", "Ⅳ类", "Ⅴ类", "劣Ⅴ类"]
        },
        series: [
          {
            name: '水质类别占比',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            data: [
              {value: this.dataForm[0], name: 'Ⅰ类', itemStyle: {normal: {color: color[0]}}},
              {value: this.dataForm[1], name: 'Ⅱ类', itemStyle: {normal: {color: color[1]}}},
              {value: this.dataForm[2], name: 'Ⅲ类', itemStyle: {normal: {color: color[2]}}},
              {value: this.dataForm[3], name: 'Ⅳ类', itemStyle: {normal: {color: color[3]}}},
              {value: this.dataForm[4], name: 'Ⅴ类', itemStyle: {normal: {color: color[4]}}},
              {value: this.dataForm[5], name: '劣Ⅴ类', itemStyle: {normal: {color: color[5]}}},
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} \n {c} ({d}%)'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.echarts.setOption(option)
    },
    paginationSizeChange(val) {
      //分页pageSize改变时执行
      this.pageSize = val;
    },
    frountpage(list) {
      //前端分页方法
      var start = (this.currentPage - 1) * this.pageSize;
      var end = this.pageSize * this.currentPage;
      var rtn = [];
      var len = end;
      if (end > list.length) {
        len = list.length;
      }
      for (var i = start; i < len; i++) {
        rtn.push(list[i]);
      }
      this.tableData = rtn;
    },
    seachData() {
      // 直接使用上级传入数据 20-08-07 by wangch
      this.tableData = [];
      if (this.datas && this.datas.length) {
        for (let item of this.datas) {
          if (item.wRealData) {
            item.wRealData.wqg = item.wRealData.wq_tp;
            this.tableData.push(item);
          }
        }
        return false
      }

      this.waterLoading = true;
      this.waterNoDataState = false;
      var date = new Date();
      this.$http
        .get("/dataHandle/waterBigScreen/waterQuStationSort")
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var list = dataJson.content.dataList;
            var listData = [];
            list.forEach(element => {
              if ("999999" != element.waterQuality) {
                listData.push(element);
              }
            });
            this.tableData = listData
            this.total = listData.length;
            // this.frountpage(listData);
            // this.$emit("setDatas", list);
          }
          this.waterLoading = false;
        })
        .catch(error => {
          console.info(error);
          this.waterLoading = false;
          this.waterNoDataState = true;
        });
    },
    rankingFormatter(cellValue) {
      let cls = "";
      switch (cellValue) {
        case 1:
          cls = "ranking-first";
          break;
        case 2:
          cls = "rank-second";
          break;
        case 3:
          cls = "rank-third";
          break;
        default:
          cls = "rank-other";
      }
      return cls;
    },
    transformation(cellValue) {
      let cls = "";
      switch (cellValue) {
        case "0":
          cls = "excellent";
          break;
        case "1":
          cls = "excellent";
          break;
        case "2":
          cls = "good";
          break;
        case "3":
          cls = "milder";
          break;
        case "4":
          cls = "moderate";
          break;
        case "5":
          cls = "severe";
          break;
      }
      return cls;
    },
    transformationText(cellValue) {
      let cls = "";
      switch (cellValue) {
        case "0":
          cls = "Ⅰ";
          break;
        case "1":
          cls = "Ⅱ";
          break;
        case "2":
          cls = "Ⅲ";
          break;
        case "3":
          cls = "Ⅳ";
          break;
        case "4":
          cls = "Ⅴ";
          break;
        case "5":
          cls = "劣Ⅴ";
          break;
      }
      return cls;
    }
  },
};
</script>

<style lang="less">
.water-ranking-content {
  height: 100%;
  position: relative;
  .water_search{
    padding: 10px;
  }
  .water-ranking-table {
    margin: 0 8px;
    height: 330px;
  }
  .el-table--border{
    border-bottom: 1px solid #EBEEF5 !important;
  }
  .el-table::before {
    background: none;
  }
  .el-table .el-table__row:last-child td {
    border-bottom: none;
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid #c7d8ee;
  }
  .el-table td {
    border-bottom: 1px solid #e1ebf9;
  }
  .el-table td,
  .el-table th {
    padding: 3px 0;
    font-size: 13px;
    color: #1a1a1a;
  }
  .el-table .caret-wrapper {
    height: 23px;
    vertical-align: top;
  }
  .el-table .sort-caret.ascending {
    top: 0;
  }
  .el-table .sort-caret.descending {
    bottom: 0;
  }
  .ranking-number {
    display: inline-block;
    vertical-align: middle;
    width: 18px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    background: #cadaeb;
    font-size: 12px;
  }
  .ranking-number.ranking-first,
  .ranking-number.rank-second,
  .ranking-number.rank-third {
    width: 18px;
    height: 22px;
    line-height: 18px;
    color: #fff;
    vertical-align: top;
  }
  .ranking-number.ranking-first {
    background: url("../../assets/images/index/ranking_first_bg.png") center
      center;
  }
  .ranking-number.rank-second {
    background: url("../../assets/images/index/ranking_Second_bg.png") center
      center;
  }
  .ranking-number.rank-third {
    background: url("../../assets/images/index/ranking_Third_bg.png") center
      center;
  }
  .water-ranking-paging {
    margin: 0 8px;
    border-top: 1px solid #e1ebf9;
    height: 56px;
    padding-top: 14px;
  }
  .el-pager li,
  .el-pagination--small .el-pager li:last-child {
    border: 1px solid #d6e3f2;
    height: 24px;
    line-height: 24px;
    min-width: 24px;
    font-weight: normal;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    border-color: #166bce;
    background-color: #166bce;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    border-radius: 0;
    border: 1px solid #d6e3f2;
    height: 24px;
    line-height: 24px;
    min-width: 24px;
  }
  .el-pagination__editor.el-input {
    width: 32px;
    font-size: 12px;
  }
  .el-pagination__editor.el-input,
  .el-input__inner {
    border-radius: 0;
    border-color: #d6e3f2;
  }
  .el-input__inner:focus {
    border-color: #166bce;
  }
}
</style>
