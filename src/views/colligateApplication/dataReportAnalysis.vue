<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>时间 :</span>&nbsp;
        <div class="layoutBox" style="width:200px">
          <el-date-picker
            v-model="dateRange"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            placeholder="请选择月份"
          ></el-date-picker>
        </div>&emsp;&emsp;
        <el-button @click="getTabelHeadData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportData">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <el-table
          border
          ref="table"
          :data="tableData"
          height="calc(100% - 37px)"
          v-loading="loading"
          @header-click="cellClick"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="监测点位" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{scope.row.stnm ? scope.row.stnm : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="item.monitoring_factor_nm"
            v-for="(item, index) in tableHeadData"
            :key="index"
          >
            <el-table-column label="浓度" show-overflow-tooltip align="center" :prop="'dq' + item.cd">
              <template slot-scope="scope">{{scope.row["dq" + item.cd]}}</template>
            </el-table-column>
            <el-table-column label="环比" show-overflow-tooltip align="center" :prop="'hb' + item.cd + '%'">
              <template slot-scope="scope">
                <span
                  v-if="Number(scope.row['hb' + item.cd + '%'].split('%')[0]) > 0"
                  style="color: #FF0000"
                >
                  {{scope.row['hb' + item.cd + '%']}}
                  <i class="el-icon-top"></i>
                </span>
                <span
                  v-if="Number(scope.row['hb' + item.cd + '%'].split('%')[0]) <= 0"
                  style="color: #00FF00;"
                >
                  {{scope.row['hb' + item.cd + '%']}}
                  <i class="el-icon-bottom"></i>
                </span>
                <span
                  v-if="scope.row['hb' + item.cd + '%'] == '--'"
                >{{scope.row['hb' + item.cd + '%']}}</span>
              </template>
            </el-table-column>
            <el-table-column label="同比" show-overflow-tooltip align="center" :prop="'tb' + item.cd + '%'">
              <template slot-scope="scope">
                <span
                  v-if="Number(scope.row['tb' + item.cd + '%'].split('%')[0]) > 0"
                  style="color: #FF0000"
                >
                  {{scope.row['tb' + item.cd + '%']}}
                  <i class="el-icon-top"></i>
                </span>
                <span
                  v-if="Number(scope.row['tb' + item.cd + '%'].split('%')[0]) <= 0"
                  style="color: #00FF00;"
                >
                  {{scope.row['tb' + item.cd + '%']}}
                  <i class="el-icon-bottom"></i>
                </span>
                <span
                  v-if="scope.row['tb' + item.cd + '%'] == '--'"
                >{{scope.row['tb' + item.cd + '%']}}</span>
              </template>
            </el-table-column>
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
      stationId: [],
      loading: false,
      dateRange: "",
      totalDay: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      tableHeadData: [],
      tableData: [
        // {
        //   dqw01019: "4.7",
        //   "hbw01019%": "4.7%",
        //   "tbw01019%": "-4.7%"
        // }
      ],
      fieldList: [],
      factors: []
    };
  },
  methods: {
    cellClick(column, event) {
      if(column.property) {
        let str = ""
        if(column.property.indexOf("%") > -1) {
          str = column.property.split("%")[0].substring(2);
        } else {
          str = column.property.substring(2)
        }
        this.getData(str, column.property.indexOf("dq") > -1 ? 1 : column.property.indexOf("hb") > -1 ? 2 : 3);
      }
    },
    // 导出
    exportData() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "数据对比分析";
      this.fieldList = ["stnm"];
      for (let i = 0; i < this.tableHeadData.length; i++) {
        this.fieldList.push('dq' + this.tableHeadData[i].cd);
        this.fieldList.push('hb' + this.tableHeadData[i].cd + '%');
        this.fieldList.push('tb' + this.tableHeadData[i].cd + '%');
      }
      let params = {
        factorList: this.factors.join(","),
        headerProp: this.fieldList.join(","),
        stationMn: this.stationId.join(","),
        time: this.dateRange,
        timeType: "month",
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/multiStationCompareReportExcel",
        params
      );
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
    // 获取表头数据
    getTabelHeadData() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationId.join(",")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.content.dataList.length == 0) {
              this.tableHeadData = [];
            } else {
              this.tableHeadData = res.data.content.dataList;
              let factorList = [];
              this.tableHeadData.map(el => {
                factorList.push(el.cd);
              });
              this.factors = factorList;
            }
          } else {
            this.tableHeadData = [];
          }
          this.getData();
        })
        .catch(error => {});
    },
    // 获取表格数据
    getData(factor, tag) {
      this.loading = true;
      let obj = {
        factorList: this.factors.join(","),
        factor: factor ? factor : "",
        tag: tag ? tag : "",
        stationMn: this.stationId.join(","),
        time: this.dateRange,
        timeType: "month",
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      };
      this.$http
        .get(
          "/Statistics-Service/statisticalReports/multiStationCompareReport",
          {
            params: obj
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
  mounted() {},
  created() {
    this.dateRange = new Date().format("yyyy-MM");
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
      this.getTabelHeadData();
    }
  }
};
</script>
<style lang="less" scoped>
</style>