<template>
  <!-- 河湖长基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入姓名" clearable v-model="queryPrams.keyword" size="small"></el-input>
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
          <el-table-column label="姓名" show-overflow-tooltip align="center" prop="userName">
            <template slot-scope="scope">
              <span>{{scope.row.userName ? scope.row.userName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" width="220" show-overflow-tooltip align="center" prop="tel">
            <template slot-scope="scope">
              <span>{{scope.row.tel ? scope.row.tel : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="160" align="center" prop="sex">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.sex == 0">男</span>
                <span v-if="scope.row.sex == 1">女</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="管辖河流" show-overflow-tooltip align="center" prop="riverName">
            <template slot-scope="scope">
              <span>{{scope.row.riverName ? scope.row.riverName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="行政区划"
            width="220"
            show-overflow-tooltip
            align="center"
            prop="areaName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.areaName ? scope.row.areaName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所在单位"
            width="160"
            show-overflow-tooltip
            align="center"
            prop="unitName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.unitName ? scope.row.unitName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属网格" show-overflow-tooltip align="center" prop="gridName">
            <template slot-scope="scope">
              <span>{{scope.row.gridName ? scope.row.gridName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="220"
            show-overflow-tooltip
            align="center"
            prop="remark"
          >
            <template slot-scope="scope">
              <span>{{scope.row.remark ? scope.row.remark : '--'}}</span>
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

      queryPrams: {
        keyword: "",
        pageNo: 1,
        pageSize: 15
      },

      tableData: [],
      searchModel: "",
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
        .get("/waterEnvXA/waterLeader", { params: this.queryPrams })
        .then(res => {
          me.loading = false;
          me.tableData = res.data.content.dataList;
          me.totalRecords = res.data.content.totalRecords;
        });
    },
    exportData() {
      var me = this;
      let params = {
        keyword: me.queryPrams.keyword
      };
      params = qs.stringify(params);
      window.open(`/waterEnvXA/waterLeader/export?${params}`);
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
