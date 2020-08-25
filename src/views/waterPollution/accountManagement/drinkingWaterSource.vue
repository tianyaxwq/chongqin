<template>
  <!-- 饮用水源地基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入水源地名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
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
            label="水源地名称"
            width="200"
            show-overflow-tooltip
            align="center"
            prop="orilocationName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.orilocationName ? scope.row.orilocationName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="水源地编码" width="200" align="center" prop="orilocationCode">
            <template slot-scope="scope">
              <span>{{scope.row.orilocationCode ? scope.row.orilocationCode : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="水源地类型" align="center" prop="orilocationType">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.orilocationType == 0">地表水</span>
                <span v-if="scope.row.orilocationType == 1">地下水</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="所处城镇名称"
            width="200"
            show-overflow-tooltip
            align="center"
            prop="town"
          >
            <template slot-scope="scope">
              <span>{{scope.row.town ? scope.row.town : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="控制级别" align="center" prop="controlLevel">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.controlLevel == 0">国控</span>
                <span v-else-if="scope.row.controlLevel == 1">省控</span>
                <span v-else-if="scope.row.controlLevel == 2">市控</span>
                <span v-else-if="scope.row.controlLevel == 3">区县控</span>
                <span v-else-if="scope.row.controlLevel == 4">乡镇控</span>
                <span v-else-if="scope.row.controlLevel == 5">村控</span>
                <span v-else>--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="水质等级" align="center" prop="waterLevel">
            <template slot-scope="scope">
              <!-- 水质等级从0开始 -->
              <span v-if="!scope.row.waterLevel">--</span>
              <span
                class="target-level"
                :class="'colorValue' + scope.row.waterLevel"
                v-else
              >{{scope.row.waterLevel == "0" ? 'Ⅰ' : scope.row.waterLevel == "1" ? 'Ⅱ' : scope.row.waterLevel == "2" ? 'Ⅲ' : scope.row.waterLevel == "3" ? 'Ⅳ' : scope.row.waterLevel == "4" ? 'Ⅴ' : scope.row.waterLevel == "5" ? '劣Ⅴ' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column label="日供水量" align="center" prop="dws">
            <template slot-scope="scope">
              <span>{{scope.row.dws ? scope.row.dws : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="占地面积" align="center" prop="area">
            <template slot-scope="scope">
              <span>{{scope.row.area ? scope.row.area : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人" align="center" prop="userName">
            <template slot-scope="scope">
              <span>{{scope.row.userName ? scope.row.userName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" width="150" align="center" prop="tel">
            <template slot-scope="scope">
              <span>{{scope.row.tel ? scope.row.tel : '--'}}</span>
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

      queryPrams: {
        keyword: "",
        pageNo: 1,
        pageSize: 15
      },

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
        .get("/waterEnvXA/OriLocation", { params: this.queryPrams })
        .then(res => {
          me.loading = false;
          me.tableData = res.data.content.dataList;
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
      window.open(`/waterEnvXA/OriLocation/export?${params}`);
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
