<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>时间 :</span>&nbsp;
        <div class="layoutBox" style="width:200px">
          <el-date-picker
            @change="dateChange"
            v-model="dateRange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
          ></el-date-picker>
        </div>&emsp;&emsp;
        <el-button @click="getData('search')">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap calendarTable" style="position:relative">
        <div class="title">
          <img src="../../assets/images/companyDetail/calIcon.png" alt />
          站点{{titleTime}}水质日历图
          <img src="../../assets/images/companyDetail/calIcon.png" alt />
        </div>
        <el-table
          border
          :data="tableData"
          v-loading="loading"
          ref="table"
          height="calc(100% - 88px)"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="断面名称" align="center" prop="stnm">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>断面名称: {{ scope.row.stnm }}</p>
                <p>{{getWords(scope.$index)}}</p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.stnm }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            width="40"
            v-for="(item, index) in headcolumn"
            :label="item < 10 ? '0' + item : item"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[(item < 10 ? '0' + item : item)] == '-1' ">--</span>
              <div
                v-else
                style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;line-height: 35px;"
                :class="'colorValue' + (scope.row[(item < 10 ? '0' + item : item)])"
              >{{scope.row[(item < 10 ? '0' + item : item)] == "0" ? 'Ⅰ' : scope.row[(item < 10 ? '0' + item : item)] == "1" ? 'Ⅱ' : scope.row[(item < 10 ? '0' + item : item)] == "2" ? 'Ⅲ' : scope.row[(item < 10 ? '0' + item : item)] == "3" ? 'Ⅳ' : scope.row[(item < 10 ? '0' + item : item)] == "4" ? 'Ⅴ' : scope.row[(item < 10 ? '0' + item : item)] == "5" ? '劣Ⅴ' : ''}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBox">
          <el-pagination
            @size-change="paginationSizeChange"
            @current-change="paginationChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            background
            :small="true"
            popper-class="select-common-option"
            :page-sizes="pageList"
            layout="total,sizes,slot,->,prev, pager, next, jumper"
            :total="totalRecords"
          >
            <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { exportTableData } from "../../assets/js/tableExport";
export default {
  name: "",
  data() {
    return {
      loading: false,
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      stationId: [],
      dateRange: "",
      totalDay: "",
      headcolumn: [],
      tableData: [],
      flag: false,
      titleTime: ""
    };
  },
  methods: {
    getWords(index){
      // console.log(this.tableData[index], "index")
      let dataTable = [0, 0, 0, 0, 0, 0]
      let count = 0
      Object.keys(this.tableData[index]).forEach((k)=>{
        if( ( !isNaN(k) || k == 0 ) && this.tableData[index][k] != '-1' ) {
          dataTable[Number(this.tableData[index][k])] ++
          count++
        }
      })
      return "Ⅰ类水" + dataTable[0] + "个小时(" + this.getPecenrt(dataTable[0], count) + ")，Ⅱ类水" + dataTable[1] + "个小时(" + this.getPecenrt(dataTable[1], count) + ")，Ⅲ类水" + dataTable[2] + "个小时(" + this.getPecenrt(dataTable[2], count) + ")，Ⅳ类水" + dataTable[3] + "个小时(" + this.getPecenrt(dataTable[3], count) + ")，Ⅴ类水" + dataTable[4] + "个小时(" + this.getPecenrt(dataTable[4], count) + ")，劣Ⅴ类水" +dataTable[5]+ "个小时(" + this.getPecenrt(dataTable[5], count) + ")。"
    },
    getPecenrt(val,count){
      if( count > 0 ) {
        return ( (val / count) * 100 ).toFixed(1) + "%"
      } else {
        return "0%"
      }
    },
    //导出表格
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "站点" + this.titleTime + "水质日历图";
      this.fieldList = ["stnm"];
      this.headcolumn.map(el => {});
      for (let i = 0; i < this.headcolumn.length; i++) {
        this.fieldList.push(i < 10 ? "0" + i : i);
      }
      let params = {
        stationCode: this.stationId.join(","),
        headerProp: this.fieldList.join(","),
        time: this.dateRange,
        timeType: "day",
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/siteWaterQualityDayChartsExcel",
        params
      );
    },
    //切换日期
    dateChange(val) {
      this.flag = false;
    },
    //分页页码改变时执行
    paginationChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    getData(flag) {
      if (flag == "search") {
        this.flag = true;
        this.titleTime = new Date(this.dateRange).format("yyyy-MM-dd");
      } else if (flag == undefined) {
        this.flag = false;
        this.titleTime = new Date(this.dateRange).format("yyyy-MM-dd");
      }
      this.loading = true;
      this.$http
        .get(
          "/Statistics-Service/statisticalReports/siteWaterQualityDayCharts",
          {
            params: {
              stationMn: this.stationId.join(","),
              time: this.dateRange,
              timeType: "day",
              pageNumber: this.currentPage,
              pageSize: this.pageSize
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.content) {
              this.tableData = res.data.content.dataList;
              this.totalRecords = res.data.content.totalRecords;
            } else {
              this.tableData = [];
              this.totalRecords = 0;
            }
            this.loading = false;
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    // 单元格数量
    for (var i = 0; i < 24; i++) {
      this.headcolumn.push(i);
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    },
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    }
  },
  watch: {
    stationInfo(value) {
      this.stationId = [];
      if (value.length > 0) {
        for (let i in value) {
          this.stationId.push(value[i].nodeId);
        }
      }
      this.getData();
    }
  },
  created() {
    this.dateRange = new Date().format("yyyy-MM-dd");
  }
};
</script>
<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #0f80e8;
  padding: 15px 0;
  > img {
    padding: 0 10px;
    &:last-child {
      transform: rotate(180deg);
    }
  }
}
</style>
