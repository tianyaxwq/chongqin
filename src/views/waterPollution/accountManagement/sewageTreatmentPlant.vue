<template>
  <!-- 污水处理厂基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入污水处理厂名称" clearable v-model="queryPrams.key" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <!-- <el-button @click="exportData" type="delet">
          <i class="iconfont icon-daochu"></i>导出
        </el-button> -->
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
          <el-table-column label="污水处理厂名称" show-overflow-tooltip align="center" prop="stf_nm">
            <template slot-scope="scope">
              <span>{{scope.row.stf_nm ? scope.row.stf_nm : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="行政分区名称" show-overflow-tooltip align="center" prop="ad_nm">
            <template slot-scope="scope">
              <span>{{scope.row.ad_nm ? scope.row.ad_nm : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="污水设施设计处理能力" show-overflow-tooltip align="center" prop="dstc">
            <template slot-scope="scope">
              <span>{{scope.row.dstc ? scope.row.dstc : '--'}}万吨/日</span>
            </template>
          </el-table-column>
          <el-table-column label="污水设施实际处理能力" show-overflow-tooltip align="center" prop="astc">
            <template slot-scope="scope">
              <span>{{scope.row.astc ? scope.row.astc : '--'}}万吨/日</span>
            </template>
          </el-table-column>
          <el-table-column label="在线监测污染物名称" width="360" show-overflow-tooltip align="center" prop="pollutant_nm">
            <template slot-scope="scope">
              <span>{{scope.row.pollutant_nm ? scope.row.pollutant_nm : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="污泥处理处置方式" show-overflow-tooltip align="center" prop="st">
            <template slot-scope="scope">
              <span>{{scope.row.st ? scope.row.st : '--'}}</span>
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
        key: "",
        pageNum: 1,
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
        .get("/dataHandle/yunliBase/getWasteWaterTread", {
          params: this.queryPrams
        })
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
      window.open(`/waterEnvXA/waterStation/export?${params}`);
    },
    paginationSizeChange(v) {
      this.queryPrams.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.queryPrams.pageNum = v;
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
