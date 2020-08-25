<template>
  <div class="scopePage threePadding">
    <div class="toolbox">
      <span>时间选择 :</span>&nbsp;
      <div class="layoutBox" style="width:300px">
        <sl-date-picker
          range-separator="至"
          v-model="dateRange"
          type="date"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></sl-date-picker>
      </div>&emsp;&emsp;
      <span>监测项目 :</span>&nbsp;
      <div class="layoutBox" style="width:160px">
        <el-select
          v-model="factorModel"
          multiple
          collapse-tags
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option
            v-for="item in factorData"
            :key="item.projectCode"
            :label="item.projectName"
            :value="item.projectCode"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <el-button @click="getTableData">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button type="delet" @click="exportExcel">
        <i class="iconfont icon-daochu"></i>导出
      </el-button>
    </div>
    <div class="table table-wrap statisticsTable" style="height:calc(100% - 70px)">
      <el-table
        border
        :data="tableData"
        ref="table"
        height="100%"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="时间" prop="time" width="100"></el-table-column>
        <el-table-column
          :label="getfactorName(item)"
          width="140"
          v-for="(item,key) in tableHead"
          :key="key"
        >
          <template slot-scope="scope">
            <span v-if="scope.row[item]">{{scope.row[item]}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="水质类别" prop="level">
          <template slot-scope="scope">
            <span v-if="scope.row.level == '-'">-</span>
            <span
              v-else
              class="target-level"
              :class="'colorValue' + (scope.row.level == 'I类' ? 0 : scope.row.level == 'II类' ? 1 : scope.row.level == 'III类' ? 2 : scope.row.level == 'IV类' ? 3 : scope.row.level == 'V类' ? 4 : scope.row.level == '劣V类' ? 5 : '')"
            >{{scope.row.level.substring(0, scope.row.level.length - 1)}}</span>
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
          :total="total"
        >
          <span class="el-pagination__current">当前第{{currentPage}}/{{totalPageNumber}}页</span>
        </el-pagination>
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
      dateRange: [],
      value: "",
      factorData: [
        // {
        //   projectName: "CODmn",
        //   unit: "mg/L",
        //   projectCode: "w01019"
        // },
        // {
        //   projectName: "溶解氧",
        //   unit: "mg/L",
        //   projectCode: "w01009"
        // },
        // {
        //   projectName: "TN",
        //   unit: "mg/L",
        //   projectCode: "w21001"
        // },
        // {
        //   projectName: "水温",
        //   unit: "℃",
        //   projectCode: "w01010"
        // },
        // {
        //   projectName: "电导率",
        //   unit: "μS/cm",
        //   projectCode: "w01014"
        // },
        // {
        //   projectName: "浊度",
        //   unit: "NTU",
        //   projectCode: "w01003"
        // },
        // {
        //   projectName: "氨氮",
        //   unit: "mg/L",
        //   projectCode: "w21003"
        // },
        // {
        //   projectName: "TP",
        //   unit: "mg/L",
        //   projectCode: "w21011"
        // },
        // {
        //   projectName: "pH",
        //   unit: "无量纲",
        //   projectCode: "w01001"
        // },
        // {
        //   projectName: "CODcr",
        //   unit: "mg/L",
        //   projectCode: "w01018"
        // }
      ], //监测项目
      factorModel: [],
      tableData: [],
      tableHead: [],
      loading: true,
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      total: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      fieldList: []
    };
  },
  created() {
    this.initTime();
  },
  methods: {
    initTime() {
      //初始化时间
      let startTime = new Date().setDate(new Date().getDate() - 6);
      let endTime = new Date();
      this.dateRange = [
        new Date(startTime).format("yyyy-MM-dd"),
        endTime.format("yyyy-MM-dd")
      ];
    },
    selectChange(arr) {
      this.factorModel = arr;
    },
    //查询
    search() {
      this.init();
    },
    getfactorName(item) {
      let fName = "";
      for (let i in this.factorData) {
        if (item == this.factorData[i].projectCode) {
          fName =
            this.factorData[i].unit ? this.factorData[i].projectName +
            "(" +
            this.factorData[i].unit +
            ")" : this.factorData[i].projectName;
        }
      }
      return fName;
    },
    //获取页面搜索各下拉框数据
    init() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.factorData = [];
            this.factorModel = [];
            res.data.content.dataList.map(el => {
              this.factorData.push({
                projectName: el.monitoring_factor_nm,
                projectCode: el.cd,
                unit: el.monitoring_factor_dw ? el.monitoring_factor_dw : ""
              });
            });
            if (this.factorData.length > 0) {
              this.factorData.map(el2 => {
                this.factorModel.push(el2.projectCode);
              })
            }
            this.tableHead = JSON.parse(JSON.stringify(this.factorModel));
            this.getTableData();
          }
        })
        .catch(error => {});
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.getTableData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.getTableData();
    },
    //获取页面表格数据
    getTableData() {
      if (this.dateRange[0] != null && this.dateRange[1] != null) {
        this.loading = true;
        this.$http
          .get(
            "/Statistics-Service/statisticalReports/waterQualityStatistics",
            {
              params: {
                startTime: this.dateRange[0],
                endTime: this.dateRange[1],
                stationCode: this.stationId,
                type: "day",
                factorCode: this.factorModel.join(","),
                pageNumber: this.currentPage,
                pageSize: this.pageSize
              }
            }
          )
          .then(res => {
            if (res.data.code == 0) {
              this.tableData = res.data.content.dataList;
              this.total = res.data.content.totalRecords;
              this.loading = false;
            }
          })
          .catch(error => {
            this.tableData = [];
            this.loading = false;
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    //导出报表
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "断面时段水质统计";
      this.fieldList = ["time"];
      for (let i = 0; i < this.tableHead.length; i++) {
        this.fieldList.push(this.tableHead[i]);
      }
      this.fieldList.push("level");
      let params = {
        headerProp: this.fieldList.join(","),
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        stationCode: this.stationId,
        type: "day",
        factorCode: this.factorModel.join(","),
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/waterQualityStatisticsExcel",
        params
      );
    }
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    },
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  },
  watch: {
    stationInfo(value) {
      if (value.length > 0) {
        this.stationId = value[0].nodeId;
        this.init();
      }
    }
  }
};
</script>

<style scope lang="less">
.scopePage {
  height: 100%;
}
</style>
