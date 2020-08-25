<template>
  <!-- 船舶码头基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入船舶名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button @click="exportData" type="delet">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <el-table
          border
          :data="tableData"
          height="calc(100% - 37px)"
          v-loading="loading"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            label="船舶名称"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="boatName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.boatName ? scope.row.boatName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="IMO" width="150" show-overflow-tooltip align="center" prop="imo">
            <template slot-scope="scope">
              <span>{{scope.row.imo ? scope.row.imo : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="MMSI"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="mmsi"
          >
            <template slot-scope="scope">
              <span>{{scope.row.mmsi ? scope.row.mmsi : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="呼号"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="boatImoCode"
          >
            <template slot-scope="scope">
              <span>{{scope.row.boatImoCode ? scope.row.boatImoCode : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="boatTypeId"
          >
            <template slot-scope="scope">
              <span>{{scope.row.boatTypeId ? scope.row.boatTypeId : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="船旗"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="boatFlag"
          >
            <template slot-scope="scope">
              <span>{{scope.row.boatFlag ? scope.row.boatFlag : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="DWT" width="150" show-overflow-tooltip align="center" prop="dwt">
            <template slot-scope="scope">
              <span>{{scope.row.dwt ? scope.row.dwt : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="建造时间"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="createTimeStr"
          >
            <template slot-scope="scope">
              <span>{{scope.row.createTimeStr ? scope.row.createTimeStr : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="吃水" width="150" show-overflow-tooltip align="center" prop="draft">
            <template slot-scope="scope">
              <span>{{scope.row.draft ? scope.row.draft : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="船籍港"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="portId"
          >
            <template slot-scope="scope">
              <span>{{scope.row.portId ? scope.row.portId : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="船速" width="150" show-overflow-tooltip align="center" prop="speed">
            <template slot-scope="scope">
              <span>{{scope.row.speed ? scope.row.speed : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="船龄" width="150" show-overflow-tooltip align="center" prop="age">
            <template slot-scope="scope">
              <span>{{scope.row.age ? scope.row.age : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="长*宽*型深"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="dept"
          >
            <template slot-scope="scope">
              <span>{{scope.row.dept ? scope.row.dept : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="主机功率"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="power"
          >
            <template slot-scope="scope">
              <span>{{scope.row.power ? scope.row.power : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="船东"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="userName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.userName ? scope.row.userName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="运营商"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="operator"
          >
            <template slot-scope="scope">
              <span>{{scope.row.operator ? scope.row.operator : '--'}}</span>
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
import qs from "qs";
export default {
  data() {
    return {
      queryPrams: {
        keyword: "",
        pageNo: 1,
        pageSize: 15
      },

      loading: true,
      tableData: [],
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [15, 25, 35] //设置每页多少条
    };
  },
  created() {
    this.searchData();
  },
  methods: {
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/boat", { params: this.queryPrams })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    exportData() {
      var me = this;
      let params = {
        keyword: me.queryPrams.keyword
      };
      params = qs.stringify(params);
      window.open(`/waterEnvXA/boat/export?${params}`);
    },
    paginationSizeChange(v) {
      this.queryPrams.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.queryPrams.pageNo = v;
      this.searchData();
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number;
    }
  }
};
</script>

<style lang="less" scoped>
.pageContent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
