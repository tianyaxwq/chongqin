<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>时间 :</span>&nbsp;
        <div class="layoutBox" style="width:360px">
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
        <!-- <span>监测项目 :</span>&nbsp;
        <div class="layoutBox" style="width:200px">
          <el-select v-model="factorModel" placeholder="请选择">
            <el-option
              v-for="item in factorData"
              :key="item.projectCode"
              :label="item.projectName"
              :value="item.projectCode"
            ></el-option>
          </el-select>
        </div>&emsp;&emsp;-->
        <el-button @click="getData('search')">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap calendarTable">
        <el-table
          border
          :data="tableData"
          ref="table"
          v-loading="loading"
          height="calc(100% - 35px)"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="断面名称" align="center" prop="dataEquipName" width="160">
            <template slot-scope="scope">
              <span>{{scope.row.dataEquipName == "null" || !scope.row.dataEquipName ? "--" : scope.row.dataEquipName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="站点类型" align="center" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.stationTypeName == "null" || !scope.row.stationTypeName ? "--" : scope.row.stationTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警时间" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.eventTime == "null" || !scope.row.eventTime ? "--" : scope.row.eventTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警指标" align="center" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.projectName == "null" || !scope.row.projectName ? "--" : scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警类型" align="center" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.alarmTypeName == "null" || !scope.row.alarmTypeName ? "--" : scope.row.alarmTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmTypeName" label="当前水质" width="100">
            <template slot-scope="scope">
              <!-- 水质等级从0开始 -->
              <span v-if="scope.row.waterQualityGrade == 'null' || !scope.row.waterQualityGrade">--</span>
              <span
                class="target-level"
                :class="'colorValue' + scope.row.waterQualityGrade"
                v-else
              >{{scope.row.waterQualityGrade == "0" ? 'Ⅰ' : scope.row.waterQualityGrade == "1" ? 'Ⅱ' : scope.row.waterQualityGrade == "2" ? 'Ⅲ' : scope.row.waterQualityGrade == "3" ? 'Ⅳ' : scope.row.waterQualityGrade == "4" ? 'Ⅴ' : scope.row.waterQualityGrade == "5" ? '劣Ⅴ' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警信息" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{scope.row.eventDesc == "null" || !scope.row.eventDesc ? "--" : scope.row.eventDesc}}</span>
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
      tableData: [],
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      flag: false,
      factorModel: "",
      factorData: [
        {
          projectName: "高锰酸盐指数",
          projectCode: "w01019"
        },
        {
          projectName: "溶解氧",
          projectCode: "w01009"
        },
        {
          projectName: "总氮",
          projectCode: "w21001"
        },
        {
          projectName: "水温",
          projectCode: "w01010"
        },
        {
          projectName: "电导率",
          projectCode: "w01014"
        },
        {
          projectName: "浊度",
          projectCode: "w01003"
        },
        {
          projectName: "氨氮",
          projectCode: "w21003"
        },
        {
          projectName: "总磷",
          projectCode: "w21011"
        },
        {
          projectName: "pH",
          projectCode: "w01001"
        },
        {
          projectName: "化学需氧量",
          projectCode: "w01018"
        }
      ],
      fieldList: []
    };
  },
  methods: {
    //导出表格
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "历史报警";
      this.fieldList = [
        "dataEquipName",
        "stationTypeName",
        "eventTime",
        "projectName",
        "alarmTypeName",
        "waterQualityGrade",
        "eventDesc"
      ];
      let params = {
        headerProp: this.fieldList.join(","),
        startTime: new Date(new Date(this.dateRange[0])).format(
          "yyyy-MM-dd hh:mm:ss"
        ),
        endTime: new Date(new Date(this.dateRange[1])).format(
          "yyyy-MM-dd hh:mm:ss"
        ),
        sortBy: "eventTime",
        order: "desc",
        mns: this.stationId,
        appId: "E9F262C16F814392AD5FDE5D217391BE",
        pageNumber: this.currentPage - 1,
        pageSize: this.pageSize,
        pattern: "yyyy-MM-dd hh:mm:ss"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/historyAlarmEventExcel",
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
      this.loading = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmEventData", {
          params: {
            startTime: new Date(new Date(this.dateRange[0])).format(
              "yyyy-MM-dd hh:mm:ss"
            ),
            endTime: new Date(new Date(this.dateRange[1])).format(
              "yyyy-MM-dd hh:mm:ss"
            ),
            sortBy: "eventTime",
            order: "desc",
            // projectCode: this.factorModel,
            pageNumber: this.currentPage - 1,
            pageSize: this.pageSize,
            mns: this.stationId,
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
            this.loading = false;
          }
        })
        .catch(err => {});
    }
  },
  mounted() {},
  created() {
    let start = new Date(new Date().getTime() - 3600 * 1000 * 24 * 30);
    let end = new Date();
    this.dateRange = [start, end];
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
      this.stationId = "";
      this.stationId = value[0].nodeId;
      this.getData();
    }
  }
};
</script>
<style lang="less" scoped>
</style>