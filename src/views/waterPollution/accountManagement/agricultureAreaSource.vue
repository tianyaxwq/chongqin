<template>
  <!-- 农业面源基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入养殖场名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
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
            label="养殖场名称"
            width="200"
            show-overflow-tooltip
            align="center"
            prop="farmName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.farmName ? scope.row.farmName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="养殖场编码"
            width="200"
            show-overflow-tooltip
            align="center"
            prop="farmCode"
          >
            <template slot-scope="scope">
              <span>{{scope.row.farmCode ? scope.row.farmCode : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="养殖小区名称"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="village"
          >
            <template slot-scope="scope">
              <span>{{scope.row.village ? scope.row.village : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="养殖场面积"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="area"
          >
            <template slot-scope="scope">
              <span>{{scope.row.area ? scope.row.area : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属行政区"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="areaName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.areaName ? scope.row.areaName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="养殖场地址"
            width="200"
            show-overflow-tooltip
            align="center"
            prop="farmLoca"
          >
            <template slot-scope="scope">
              <span>{{scope.row.farmLoca ? scope.row.farmLoca : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="饲养目的"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="farmTarget"
          >
            <template slot-scope="scope">
              <span>{{scope.row.farmTarget ? scope.row.farmTarget : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="负责人"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="userName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.userName ? scope.row.userName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" width="150" show-overflow-tooltip align="center" prop="tel">
            <template slot-scope="scope">
              <span>{{scope.row.tel ? scope.row.tel : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="污染物种类"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="pollutionTypes"
          >
            <template slot-scope="scope">
              <span>{{scope.row.pollutionTypes ? scope.row.pollutionTypes : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="污水日产量"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="waterDayily"
          >
            <template slot-scope="scope">
              <span>{{scope.row.waterDayily ? scope.row.waterDayily : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="污水处理利用量"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="waterTreatUse"
          >
            <template slot-scope="scope">
              <span>{{scope.row.waterTreatUse ? scope.row.waterTreatUse : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="粪便日产量"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="fecesDayily"
          >
            <template slot-scope="scope">
              <span>{{scope.row.fecesDayily ? scope.row.fecesDayily : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="粪便处理利用量"
            width="150"
            show-overflow-tooltip
            align="center"
            prop="fecesTreatUse"
          >
            <template slot-scope="scope">
              <span>{{scope.row.fecesTreatUse ? scope.row.fecesTreatUse : '--'}}</span>
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
  name: "",

  data() {
    return {
      loading: true,
      name: "",
      tableData: [],
      searchModel: "",

      queryPrams: {
        keyword: "",
        pageNo: 1,
        pageSize: 15
      },

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
      var me = this;
      me.loading = true;
      me.$http
        .get("/waterEnvXA/waterFarm", { params: this.queryPrams })
        .then(res => {
          me.tableData = res.data.content.dataList;
          me.totalRecords = res.data.content.totalRecords;
          me.loading = false;
        });
    },
    exportData() {
      var me = this;
      let params = {
        keyword: me.queryPrams.keyword
      };
      params = qs.stringify(params);
      window.open(`/waterEnvXA/waterFarm/export?${params}`);
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
