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
        <el-button @click="getData('search')">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap calendarTable">
        <div class="title">
          <img src="../../assets/images/companyDetail/calIcon.png" alt />
          站点{{titleTime}}水质月历图
          <img
            src="../../assets/images/companyDetail/calIcon.png"
            alt
          />
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
          <el-table-column label="断面名称" show-overflow-tooltip align="center" prop="stnm"></el-table-column>
          <el-table-column
            :key="index"
            width="40"
            v-for="(item, index) in headcolumn"
            :label="item"
          >
            <template slot-scope="scope">
              <!-- <span>{{scope.row[(item < 10 ? '0' + item : item)] == '0' ? '--' : scope.row[(item < 10 ? '0' + item : item)]}}</span> -->
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
      stationId: [],
      dateRange: "",
      totalDay: "",
      headcolumn: [],
      tableData: [],
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      flag: false,
      titleTime: "",
      fieldList: []
    };
  },
  methods: {
    //导出表格
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "站点" + this.titleTime + "水质月历图";
      this.fieldList = ["stnm"];
      for (let i = 1; i < this.headcolumn.length; i++) {
        this.fieldList.push(i < 10 ? "0" + i : i);
      }
      let params = {
        stationCode: this.stationId.join(","),
        headerProp: this.fieldList.join(","),
        time: this.dateRange,
        timeType: "month",
        pattern: "yyyy-MM-dd"
      };
      console.log(params,"params")
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/siteWaterQualityMonthChartsExcel",
        params
      );
    },
    //切换月份
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
        this.titleTime = new Date(this.dateRange).format("yyyy-MM");
      } else if (flag == undefined) {
        this.flag = false;
        this.titleTime = new Date(this.dateRange).format("yyyy-MM");
      }
      this.loading = true;
      this.$http
        .get(
          "/Statistics-Service/statisticalReports/siteWaterQualityMonthCharts",
          {
            params: {
              stationMn: this.stationId.join(","),
              time: this.dateRange,
              timeType: "month",
              pageNumber: this.currentPage,
              pageSize: this.pageSize
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.mGetDate(
              new Date(new Date(this.dateRange)).format("yyyy"),
              new Date(new Date(this.dateRange)).format("M")
            );
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
    },
    // 表格数量
    mGetDate(year, month) {
      this.headcolumn = [];
      let d = new Date(year, month, 0);
      this.totalDay = d.getDate();
      for (var i = 1; i <= this.totalDay; i++) {
        // if(i < 10) {
        //   i = i.replace(/\b(0+)/gi,"")
        // }
        this.headcolumn.push(i);
      }
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
      this.getData();
    }
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
