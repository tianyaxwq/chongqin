<template>
  <!-- 污水处理厂基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入行政区划名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
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
          <el-table-column label="行政区划" show-overflow-tooltip align="center" prop="dist">
            <template slot-scope="scope">
              <span>{{scope.row.dist ? scope.row.dist : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="坑塘类型" show-overflow-tooltip align="center" prop="styp">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.styp == 0">水坑</span>
                <span v-else-if="scope.row.styp == 1">干坑</span>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="问题地点" show-overflow-tooltip align="center" prop="proLoca">
            <template slot-scope="scope">
              <span>{{scope.row.proLoca ? scope.row.proLoca : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="估算面积（㎡）" show-overflow-tooltip align="center" prop="area">
            <template slot-scope="scope">
              <span>{{scope.row.area ? scope.row.area : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="估算体积（m³）" show-overflow-tooltip align="center" prop="vol">
            <template slot-scope="scope">
              <span>{{scope.row.vol ? scope.row.vol : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="酸碱性" show-overflow-tooltip align="center" prop="abp">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.abp == 0">酸性</span>
                <span v-else-if="scope.row.abp == 1">碱性</span>
                <span v-else>--</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="其它特征污染物" show-overflow-tooltip align="center" prop="ocp">
            <template slot-scope="scope">
              <span>{{scope.row.ocp ? scope.row.ocp : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否通过验收" show-overflow-tooltip align="center" prop="acpt">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.acpt == 0">否</span>
                <span v-else-if="scope.row.acpt == 1">是</span>
                <span v-else>--</span>
              </div>
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
      pageList: [15, 25, 35]  //设置每页多少条
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
        .get("/waterEnvXA/pool", { params: this.queryPrams })
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
      window.open(`/waterEnvXA/pool/export?${params}`);
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

.currency-mode-wrap1 {
  min-height: 200px;
  margin-top: 5px;
  background: #fff;
  height: calc(100% - 86px);
}

.currency-mode-wrap1 {
  min-height: 200px;
  margin-top: 5px;
  height: calc(100% - 86px);
}
</style>
