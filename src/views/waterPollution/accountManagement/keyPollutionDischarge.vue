<template>
  <!-- 重点排污单位基本信息 -->
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入企业名称" clearable v-model="queryPrams.keyword" size="small"></el-input>
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
            label="企业名称"
            width="180"
            show-overflow-tooltip
            align="center"
            prop="enterpriseName"
          >
            <template slot-scope="scope">
              <span>{{scope.row.enterpriseName ? scope.row.enterpriseName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="企业编号" align="center" prop="enterpriseCode">
            <template slot-scope="scope">
              <span>{{scope.row.enterpriseCode ? scope.row.enterpriseCode : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属区域" width="100" align="center" prop="areaName">
            <template slot-scope="scope">
              <span>{{scope.row.areaName ? scope.row.areaName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="经度" width="120" align="center" prop="longitude">
            <template slot-scope="scope">
              <span v-if="scope.row.longitude || scope.row.longitude == 0">{{scope.row.longitude}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="纬度" width="120" align="center" prop="latitude">
            <template slot-scope="scope">
              <span v-if="scope.row.latitude || scope.row.latitude == 0">{{scope.row.latitude}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="所属行业" align="center" width="100" prop="enterpriseType">
            <template slot-scope="scope">
              <span>{{scope.row.enterpriseType ? scope.row.enterpriseType : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系人" align="center" prop="leaderName">
            <template slot-scope="scope">
              <span>{{scope.row.leaderName ? scope.row.leaderName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" width="120" align="center" prop="tel">
            <template slot-scope="scope">
              <span>{{scope.row.tel ? scope.row.tel : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="上年实际产量" width="120" align="center" prop="num">
            <template slot-scope="scope">
              <span>{{scope.row.num ? scope.row.num : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业状态" align="center" prop="state">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.state == 0">正常营业</span>
                <span v-else-if="scope.row.state == 1">关停</span>
                <span v-else>--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="技术改造措施"
            align="center"
            width="100"
            show-overflow-tooltip
            prop="technologyMeasures"
          >
            <template slot-scope="scope">
              <span>{{scope.row.technologyMeasures ? scope.row.technologyMeasures : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="企业地址"
            width="160"
            show-overflow-tooltip
            align="center"
            prop="location"
          >
            <template slot-scope="scope">
              <span>{{scope.row.location ? scope.row.location : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="detail(scope.row)">查看详情</el-button>
                  <el-button type="secondBtn" @click="open()">排污许可证</el-button>
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
    open() {
      window.open(
        `http://permit.mee.gov.cn/permitExt/syssb/xxgk/xxgk!sqqlist.action`
      );
    },
    // 查看企业详情
    detail(row) {
      this.$router.push({
        path: "/waterPollution/IndRegul/companyDetail",
        query: {
          enterpriseName: row.enterpriseName,
          enterpriseId: row.enterpriseId
        }
      });
    },
    //查询数据
    searchData() {
      var me = this;
      me.loading = true;
      me.$http
        .get("/waterEnvXA/enter", { params: this.queryPrams })
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
      window.open(`/waterEnvXA/enter/export?${params}`);
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
