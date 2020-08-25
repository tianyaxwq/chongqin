<template>
  <div class="curdataPage clearfix">
    <div class="currency-mode-wrap revision-table" style="height: calc(100% - 70px)">
      <el-table
        :data="tableData"
        border
        height="100%"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="areaName" label="区域">
          <template slot-scope="scope">
            <span>{{!scope.row.areaName || scope.row.areaName == 'null' ? '--' : scope.row.areaName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stationName" show-overflow-tooltip label="断面名称">
          <template slot-scope="scope">
            <span>{{!scope.row.stationName || scope.row.stationName == 'null' ? '--' : scope.row.stationName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="basinName" show-overflow-tooltip label="所在河流">
          <template slot-scope="scope">
            <span>{{!scope.row.basinName || scope.row.basinName == 'null' ? '--' : scope.row.basinName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="insert_time" label="监测时间" width="180">
          <template slot-scope="scope">
            <span>{{!scope.row.insert_time || scope.row.insert_time == 'null' ? '--' : scope.row.insert_time}}</span>
          </template>
        </el-table-column>
        <el-table-column
                    label="瞬间流量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="instant_flow"
                  >
                    <el-table-column
                      prop="instant_flow"
                      label="m³/s"
                      :show-overflow-tooltip="true"
                      align="center"
                    ></el-table-column>
                  </el-table-column>
                  <el-table-column
                    label="平均流速"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="speed_of_avg"
                  >
                    <el-table-column
                      prop="speed_of_avg"
                      label="m/s"
                      :show-overflow-tooltip="true"
                      align="center"
                    ></el-table-column>
                  </el-table-column>
                  <el-table-column prop="water_level" label="水位" align="center">
                    <el-table-column
                      prop="water_level"
                      label="m"
                      :show-overflow-tooltip="true"
                      align="center"
                    ></el-table-column>
                  </el-table-column>
                   <el-table-column
                    label="过水面积"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="pass_water_area"
                  >
                    <el-table-column
                      prop="pass_water_area"
                      label="㎡"
                      :show-overflow-tooltip="true"
                      align="center"
                    ></el-table-column>
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
        layout="total,sizes,slot,->,prev, pager, next, jumper"
        :total="totalRecords"
      >
        <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>
    <div class="tips-text">
      <p v-if="!stationTypeName">
        <i class="el-icon-warning"></i>
        <span>提示：自动站数据未经审核，仅供参考。</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "currentData",
  components: {},
  data() {
    return {
      realNetData: {},
      tableData: [],
      stationId: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      siteType: false,
      loading: true,
      tableHeadData: [],
    };
  },
  methods: {
    adda(inedx, prop, key) {
      let name = this.tableData[inedx][prop];
      let row = 0;
      for (let i = inedx; i < this.tableData.length; i++) {
        if (name === this.tableData[i][prop]) {
          row++;
        } else {
          break;
        }
      }
      this.tableData[inedx][key] = row;
      return row;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (row.sf) {
          return {
            colspan: 1,
            rowspan: row.sf,
          };
        } else {
          return {
            colspan: 1,
            rowspan: 0,
          };
        }
      }
    },
    goToPage() {
      this.$router.push(
        "/colligateApplication/analysisReport/waterQualityEvaluation"
      );
    },
    //获取实时数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/dataHandle/yunliBase/waterFlowRealData", {
          params: {
            // beginTime: this.dateRange[0].format('yyyy-MM-dd 00:00:00'),
            // endTime: this.dateRange[1].format('yyyy-MM-dd 23:59:59'),
            //indexCodes: this.value.join(","),
            mns: this.stationId, //this.stationId
            pageNum: this.currentPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.loading = false;
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    //获取实时联网统计
    realDataNetStateLv() {
      this.loading = true;
      this.$http
        .get("/dataHandle/realDataNetStateLv", {
          params: {
            mn: this.toolObj.getCookie("equipIds"),
          },
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.realNetData = res.data.content.info;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    //分页页码改变时执行
    paginationChange(val) {
      this.currentPage = val;
      this.searchData();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 获取表头数据
    getTabelHeadData() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationId,
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            if (res.data.content.dataList.length == 0) {
              this.tableHeadData = [];
            } else {
              this.tableHeadData = res.data.content.dataList;
            }
            this.searchData();
          } else {
            this.loading = false;
            this.tableData = [];
            this.tableHeadData = [];
          }
        })
        .catch((error) => {});
    },
  },
  created() {
    this.$store.commit("setShowlefttree", false);
    for (let i = 0; i < this.tableData.length; i++) {
      let num = this.adda(i, "province", "sf");
      i += num - 1;
    }
  },
  mounted() {
    //this.realDataNetStateLv();
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    },
    stationInfo: {
      get: function () {
        return this.$store.state.stationInfo;
      },
    },
    stationTypeName: {
      get: function () {
        return this.$store.state.stationTypeName;
      },
    },
  },
  watch: {
    stationInfo(value) {
      if (value.length > 0) {
        let arr = [];
        for (let i = 0; i < value.length; i++) {
          arr.push(value[i].nodeId);
        }
        this.stationId = arr.join(",");
        if (value[0].stationType1 === "001") {
          this.siteType = false;
        } else if (value[0].stationType1 === "002") {
          this.siteType = true;
        }
      } else {
        this.stationId = "";
      }
      this.getTabelHeadData();
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-table__body-wrapper {
  height: calc(100% - 95px) !important;
}
/deep/ .el-table__fixed {
  &:before {
    height: 0 !important;
  }
}
/deep/ .el-tag {
  font-size: 14px;
  color: #ff0000;
  background-color: transparent;
  border-color: transparent;
}
/deep/.el-table__fixed-right::before,
.el-table__fixed::before {
  height: 0 !important;
}
.secondary-toolbar {
  position: relative;
  .code {
    position: absolute;
    right: 30px;
    top: 10px;
    &:before {
      content: "";
      width: 8px;
      height: 8px;
      background: #ff0000;
      position: absolute;
      left: -13px;
      top: 5px;
    }
  }
}
.curdataPage {
  height: 100%;
  .currency-mode-wrap {
    margin-top: 0;
  }
  .cardUl {
    height: 100%;
    padding: 50px;
    .card {
      float: left;
      width: calc((100% - 200px) / 3);
      margin-right: 100px;
      height: 369px;
      box-shadow: 0px 0px 8px rgb(190, 190, 190);
      &:nth-child(3n) {
        margin-right: 0px;
        margin-bottom: 50px;
      }
      &:nth-last-child(1) {
        margin-bottom: 5px;
      }
      .liHead {
        height: 57px;
        line-height: 57px;
        margin-right: 100px;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        padding-left: 10px;
        font-size: 16px;
        color: #1a1a1a;
        padding-right: 13px;
        .online {
          font-size: 14px;
          color: #666;
        }
        .time {
          float: right;
          color: #666;
          font-size: 12px;
        }
      }
      .liBody {
        padding: 24px 25px;
        padding-bottom: 11px;
        ul {
          height: 237px;
          li {
            float: left;
            margin-bottom: 30px;
            width: 25%;

            p {
              &:nth-child(1) {
                height: 30px;
                font-size: 12px;
                color: #666;
              }
              &:nth-child(2) {
                color: #1a1a1a;
                font-size: 22px;
              }
            }
            &:nth-last-child(1) {
              margin-bottom: 0px;
            }
            &:nth-last-child(2) {
              margin-bottom: 0px;
            }
          }
        }
      }
      .liFooter {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #166bce;
        cursor: pointer;
      }
    }
  }
  .secondary-toolbar {
    p {
      float: left;
      span {
        margin-right: 20px;
      }
    }
  }
  .link-btn {
    float: right;
  }
}
.item-symbol {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #0066cc;
  transform: rotate(45deg);
  margin-right: 6px;
}
.item-symbol:before {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  margin: 1px;
  background: #0066cc;
}
.normal-state,
.drop-line,
.abnormal-state {
  display: inline-block;
  width: 20px;
  height: 17px;
  vertical-align: middle;
  margin-bottom: 2px;
}
.normal-state {
  background: url("../../assets/images/acquisition/normal-state.png") no-repeat
    center center;
}
.drop-line {
  background: url("../../assets/images/acquisition/drop-line-state.png")
    no-repeat center center;
}
.abnormal-state {
  background: url("../../assets/images/acquisition/abnormal-state.png")
    no-repeat center center;
}
.tips-text {
  color: #666666;
  padding-left: 10px;
  line-height: 30px;
  border: 1px solid #d6e3f2;
  border-top: none;
}
.el-icon-warning {
  color: #166bce;
}
.unusual {
  color: #ff0000;
}
</style>
