<template>
  <div class="alarmPage">
    <div class="table-wrap" style="height: calc(100% - 35px);">
      <el-table
        :data="tableData"
        border
        height="100%"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="eventTime" width="160" label="报警时间">
          <template slot-scope="scope">
            <span>{{scope.row.eventTime == "null" || !scope.row.eventTime ? "--" : scope.row.eventTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="报警指标" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.projectName == "null" || !scope.row.projectName ? "--" : scope.row.projectName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="报警类型" width="120">
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
        <el-table-column label="报警信息" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.eventDesc == "null" || !scope.row.eventDesc ? "--" : scope.row.eventDesc}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        layout="total,sizes,->,prev, pager, next, jumper"
        :total="totalRecords"
      >
        <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "alarm",
  data() {
    return {
      tableData: [],
      loading: false,
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [10, 15, 25] //设置每页多少条
    };
  },
  mounted() {
    this.getAlarmList();
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    },
    stationMn: {
      get: function() {
        return this.$store.state.siteMn;
      }
    }
  },
  methods: {
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
      this.getAlarmList();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.getAlarmList();
    },
    // 获取数据
    getAlarmList() {
      this.loading = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmEventData", {
          params: {
            startTime: new Date(
              new Date().getTime() - 3600 * 1000 * 24 * 2
            ).format("yyyy-MM-dd hh:mm:ss"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            sortBy: "eventTime",
            order: "desc",
            pageNumber: this.currentPage - 1,
            pageSize: this.pageSize,
            mns: this.stationMn.stationCode,
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
          } else {
            this.tableData = [];
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.alarmPage {
  height: 466px;
  padding: 20px 10px;
}
</style>