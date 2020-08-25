<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="secondary-page-section secondary-page-mode">
        <div class="secondary-toolbar">
          <span>时间:</span>
          <div class="layoutBox" style="width:200px">
            <el-date-picker
              @change="dateChange"
              v-model="dateRange"
              type="date"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>&emsp;&emsp;
          <el-button @click="searchData('change')">
            <i class="iconfont icon-sousuo"></i>查询
          </el-button>
          <!-- <el-button type="delet">
            <i class="iconfont icon-tianjia1"></i>导出
          </el-button>-->
        </div>
        <div class="currency-mode-wrap">
          <div class="el_table_box">
            <div>
              <div class="overview">表1 {{ showDate }}白洋淀及上游流域水质自动监测值一览表</div>
              <el-table
                border
                :data="tableData"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
                :span-method="objectSpanMethod"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column label="所考核地市" align="center" prop="ADD">
                  <template slot-scope="scope">
                    <span>{{scope.row.ADD ? scope.row.ADD : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="断面名称" align="center" prop="STNM">
                  <template slot-scope="scope">
                    <span>{{scope.row.STNM ? scope.row.STNM : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="河流名称" align="center" prop="RIVER">
                  <template slot-scope="scope">
                    <span>{{scope.row.RIVER ? scope.row.RIVER : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="断面属性" width="160" align="center" prop="SECTION_nature">
                  <template slot-scope="scope">
                    <span>{{scope.row.SECTION_nature ? scope.row.SECTION_nature : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="各评价因子日均值 单位：mg/L（pH 无量纲）">
                  <el-table-column label="pH" prop="pH">
                    <template slot-scope="scope">
                      <span>{{scope.row.pH ? scope.row.pH : '--'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="溶解氧" prop="DOX">
                    <template slot-scope="scope">
                      <span>{{scope.row.DOX ? scope.row.DOX : '--'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="CODmn" prop="CODMN">
                    <template slot-scope="scope">
                      <span>{{scope.row.CODMN ? scope.row.CODMN : '--'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="CODcr" prop="CODCR">
                    <template slot-scope="scope">
                      <span>{{scope.row.CODCR ? scope.row.CODCR : '--'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="氨氮" prop="NH3N">
                    <template slot-scope="scope">
                      <span>{{scope.row.NH3N ? scope.row.NH3N : '--'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="TP" prop="TP">
                    <template slot-scope="scope">
                      <span>{{scope.row.TP ? scope.row.TP : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="水质类别" align="center" prop="WQ_TP">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.WQ_TP">--</span>
                    <span
                      v-else
                      class="target-level"
                      :class="'colorValue' + (scope.row.WQ_TP == 'I类' ? 0 : scope.row.WQ_TP == 'II类' ? 1 : scope.row.WQ_TP == 'III类' ? 2 : scope.row.WQ_TP == 'IV类' ? 3 : scope.row.WQ_TP == 'V类' ? 4 : scope.row.WQ_TP == '劣V类' ? 5 : '')"
                    >{{scope.row.WQ_TP.substring(0, scope.row.WQ_TP.length - 1)}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="达标情况" align="center" prop="QUALIFIED">
                  <template slot-scope="scope">
                    <span>{{scope.row.QUALIFIED ? scope.row.QUALIFIED : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="考核目标" align="center" prop="CHECK">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.CHECK">--</span>
                    <span
                      v-else
                      class="target-level"
                      :class="'colorValue' + scope.row.CHECK"
                    >{{scope.row.CHECK == "0" ? 'I' : scope.row.CHECK == "1" ? 'II' : scope.row.CHECK == "2" ? 'III' : scope.row.CHECK == "3" ? 'IV' : scope.row.CHECK == "4" ? 'V' : scope.row.CHECK == "5" ? '劣V' : ''}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div>
              <div class="overview">表2 {{ showDate }}白洋淀及上游流域水质自动监测超标情况一览表(单位：mg/L（pH无量纲）)</div>
              <el-table
                border
                :data="tableData2"
                height="400px"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column label="所考核地市" align="center" prop="exam_area">
                  <template slot-scope="scope">
                    <span>{{scope.row.exam_area ? scope.row.exam_area : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="所考核县区" align="center" prop="exam_districts">
                  <template slot-scope="scope">
                    <span>{{scope.row.exam_districts ? scope.row.exam_districts : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="断面名称" align="center" prop="stnm">
                  <template slot-scope="scope">
                    <span>{{scope.row.stnm ? scope.row.stnm : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="河流名称" align="center" prop="RIVER">
                  <template slot-scope="scope">
                    <span>{{scope.row.RIVER ? scope.row.RIVER : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="超标项目" width="120">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.inList"
                      :key="index"
                      class="borderB"
                    >{{item.primary_pollutant}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="超标时段" width="120">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.inList"
                      :key="index"
                      class="borderB"
                    >{{item.stat_time}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="监测值">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.inList"
                      :key="index"
                      class="borderB"
                    >{{item.pollutant_test_value}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="超标倍数" prop="primary_pollutant_mush">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.inList"
                      :key="index"
                      class="borderB"
                    >{{item.primary_pollutant_mush}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="考核目标" prop="exam_target">
                  <template slot-scope="scope">
                    <span>{{scope.row.exam_target ? scope.row.exam_target : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="今日均值" prop="primary_pollutant_value">
                  <template slot-scope="scope">
                    <span>{{scope.row.primary_pollutant_value ? scope.row.primary_pollutant_value : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="昨日均值" prop="primary_pollutant_lastday">
                  <template slot-scope="scope">
                    <span>{{scope.row.primary_pollutant_lastday ? scope.row.primary_pollutant_lastday : '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="日均值变化情况"
                  width="150"
                  align="center"
                  prop="primary_pollutant_UpDown"
                >
                  <template slot-scope="scope">
                    <i
                      class="el-icon-top"
                      style="color: #ff0000;"
                      v-if="scope.row.primary_pollutant_UpDown > 0"
                    ></i>
                    <i class="el-icon-bottom" v-else></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "",

  data() {
    return {
      name: "",
      tableData2: [],
      tableData: [],
      optionData: [],
      dateRange: new Date(2020, 2, 29).format("yyyy-MM-dd"),
      currentPage: 1,
      currentPage1: 1, //分页组件当前页
      pageSize1: 25,
      pageSize: 25, //分页每页多少条数据
      totalRecords: 14, //总条数
      totalRecords1: 1,
      pageList1: [25, 30],
      pageList: [25, 30], //设置每页多少条
      loading: false,
      ids: "",
      flag: false
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    // 改变备注单元格文字对齐样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let str = this.tableData.length;
      if (
        (columnIndex == 2 && rowIndex == str - 3) ||
        (columnIndex == 2 && rowIndex == str - 2) ||
        (columnIndex == 2 && rowIndex == str - 1)
      ) {
        return "text-align: left;";
      }
    },
    // 合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let str = this.tableData.length;
      if (columnIndex == 1) {
        if (row.ADD == "备注" && rowIndex == str - 3) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if (rowIndex == str - 2 || rowIndex == str - 1) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (
        (columnIndex == 2 && rowIndex == str - 3) ||
        (columnIndex == 2 && rowIndex == str - 2) ||
        (columnIndex == 2 && rowIndex == str - 1)
      ) {
        return {
          rowspan: 1,
          colspan: 12
        };
      }
    },
    dateChange(val) {
      this.flag = false;
    },
    searchData(flag) {
      if (this.dateRange) {
        this.loading = true;
        if (flag == "change") {
          this.flag = true;
          this.showDate = new Date(this.dateRange).format("MM月dd日");
        } else if (flag == undefined) {
          this.flag = false;
          this.showDate = new Date(this.dateRange).format("MM月dd日");
        }
        this.$http
          .get("/Statistics-Service/reportManage/WaterQualityDaily", {
            params: {
              time: this.dateRange
            }
          })
          .then(res => {
            this.tableData = [];
            this.loading = false;
            this.tableData = res.data.content;
            if (this.tableData.length) {
              this.tableData.push(
                {
                  ADD: "备注",
                  STNM: "1、上述各断面自动监测数据未经最终审核，数据仅供参考。"
                },
                {
                  STNM: "2、湖心区、南刘庄等两个断面评价标准为湖库标准。"
                },
                {
                  STNM:
                    "3、无自动监测数据上传的13个断面为：焦庄、北河店、码头、大石峪村、神北村、高岭、留祥佐、北斗门北大桥、兰沟村、兑坎庄、膳马庙村北、平王、新盖房（北刘庄）。"
                }
              );
            }
          });

        this.$http
          .get("/Statistics-Service/reportManage/waterQualityOver", {
            params: {
              time: this.dateRange
            }
          })
          .then(res => {
            this.loading = false;
            this.tableData2 = res.data.content;
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      //   this.searchData('one');
    },
    paginationChange(v) {
      this.currentPage = v;
      //   this.searchData('one');
    },
    paginationSizeChange1(v) {
      this.pageSize1 = v;
      //   this.searchData('two');
    },
    paginationChange1(v) {
      this.currentPage1 = v;
      //   this.searchData('two');
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number;
    },
    totalPage1() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords1 / this.pageSize1);
      return number;
    }
  }
};
</script>

<style lang="less" scoped>
.overview {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 20px 0;
}
.borderB {
  border-bottom: 1px solid #d6e3f2;
}
.borderB:last-child {
  border-bottom: none;
}
</style>>
</style>
