<template>
  <!-- 污水处理厂基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入工程名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
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
          <el-table-column label="工程名称" show-overflow-tooltip align="center" prop="projectName">
            <template slot-scope="scope">
              <span>{{scope.row.projectName ? scope.row.projectName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="建设单位" show-overflow-tooltip align="center" prop="buildCompany">
            <template slot-scope="scope">
              <span>{{scope.row.buildCompany ? scope.row.buildCompany : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="施工单位"
            show-overflow-tooltip
            align="center"
            prop="constructCompany"
          >
            <template slot-scope="scope">
              <span>{{scope.row.constructCompany ? scope.row.constructCompany : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设计单位" show-overflow-tooltip align="center" prop="designCompany">
            <template slot-scope="scope">
              <span>{{scope.row.designCompany ? scope.row.designCompany : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="建设地点" show-overflow-tooltip align="center" prop="address">
            <template slot-scope="scope">
              <span>{{scope.row.address ? scope.row.address : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="建设内容" show-overflow-tooltip align="center" prop="content">
            <template slot-scope="scope">
              <span>{{scope.row.content ? scope.row.content : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="治理工艺" show-overflow-tooltip align="center" prop="technology">
            <template slot-scope="scope">
              <span>{{scope.row.technology ? scope.row.technology : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="投资规模" show-overflow-tooltip align="center" prop="investScale">
            <template slot-scope="scope">
              <span>{{scope.row.investScale ? scope.row.investScale : '--'}}</span>
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
      loading: true,
      tableData: [],

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
        .get("/waterEnvXA/governProject/queryByPage", {
          params: this.queryPrams
        })
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
      window.open(`/waterEnvXA/governProject/export?${params}`);
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
