<template>
  <div class="historypage tapStyle secondary-page-mode">
    <div class="secondary-toolbar">
      <span>时间选择 :</span>&nbsp;
      <div class="layoutBox" style="width:420px">
        <sl-date-picker
          range-separator="至"
          v-model="dateRange"
          type="datetime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></sl-date-picker>
      </div>&emsp;&emsp;
      <el-button @click="search">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button type="delet" @click="exportExcel">
        <i class="iconfont icon-daochu"></i>导出
      </el-button>
      <div class="toolbar-right">
        <el-radio-group v-model="pageType" size="mini" @change="pageTypeChange">
          <el-radio-button label="1">表格</el-radio-button>
          <el-radio-button label="2">图表</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="currency-mode-wrap">
      <!-- <el-scrollbar class="currency-mode-scroll" style="height: 100%;"> -->
      <div ref="tableWra" class="tablebox" style="height: 100%;">
        <!-- style="height: calc(100% - 85px)" -->
        <div class="table-wrap" v-show="pageType ==='1'" style="height:100%">
          <el-table
            :data="tableData"
            ref="table"
            border
            height="calc(100% - 36px)"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
            <el-table-column prop="areaName" width="100" label="区域"></el-table-column>
            <el-table-column prop="stationName" width="150" label="断面名称" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="stationName" show-overflow-tooltip label="所在河流">
                <template slot-scope="scope">
                  <span>{{!scope.row.stationName || scope.row.stationName == 'null' ? '--' : scope.row.stationName}}</span>
                </template>
            </el-table-column>-->
            <el-table-column prop="spt" width="160" label="监测时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="wq_tp" label="水质类别">
              <template slot-scope="scope">
                <!-- 水质等级从0开始 -->
                <span v-if="scope.row.wq_tp == 'null' || !scope.row.wq_tp">--</span>
                <span
                  class="target-level"
                  :class="'colorValue' + scope.row.wq_tp"
                  v-else
                >{{scope.row.wq_tp == "0" ? 'Ⅰ' : scope.row.wq_tp == "1" ? 'Ⅱ' : scope.row.wq_tp == "2" ? 'Ⅲ' : scope.row.wq_tp == "3" ? 'Ⅳ' : scope.row.wq_tp == "4" ? 'Ⅴ' : scope.row.wq_tp == "5" ? '劣Ⅴ' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="item.monitoring_factor_nm"
              v-for="(item, index) in tableHeadData"
              :key="index"
            >
              <el-table-column :label="item.monitoring_factor_dw">
                <template slot-scope="scope">
                  <div
                    v-if="paramsObj.contrast(scope.row[item.cd + '_level'], scope.row.targetLevel) == ''"
                  >{{!scope.row[item.cd] || scope.row[item.cd] == 'null' ? '--' : scope.row[item.cd] }}</div>
                  <div>
                    <el-popover
                      trigger="hover"
                      placement="top"
                      v-if="paramsObj.contrast(scope.row[item.cd + '_level'], scope.row.targetLevel)"
                    >
                      <p v-if="item.cd == 'codmn'">CODmn: ≤10</p>
                      <p v-if="item.cd == 'tp'">TP: ≤0.3</p>
                      <p v-if="item.cd == 'tn'">TN: ≤1.5</p>
                      <p v-if="item.cd == 'nh3n'">氨氮: ≤1.5</p>
                      <p v-if="item.cd == 'ph'">pH: 6~9</p>
                      <p v-if="item.cd == 'codcr'">CODcr: ≤30</p>
                      <p v-if="item.cd == 'wt'">水温: --</p>
                      <p v-if="item.cd == 'dox'">溶解氧: ≥3</p>
                      <p v-if="item.cd == 'cond'">电导率: --</p>
                      <p v-if="item.cd == 'turb'">浊度: --</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="small">
                          {{!scope.row[item.cd] || scope.row[item.cd] == 'null' ? '--' : scope.row[item.cd]}}
                          <i
                            class="el-icon-question"
                            v-if="paramsObj.contrast(scope.row[item.cd + '_level'], scope.row.targetLevel)"
                          ></i>
                        </el-tag>
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
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
        <div class="chart-wrap" v-show="pageType ==='2'" style="height:100%">
          <div
            class="chart-wrap"
            style="height: 100%"
            v-loading="loadingTwo"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <ul class="chartUl" v-if="!dataStatus">
              <li
                v-for="(item, index) in optionData"
                :key="index"
                :class="item.isTrue ? 'active' : ''"
                @click="getEchartData(item.str, item)"
              >{{item.label}}</li>
            </ul>
            <yf-Datastatus :dataStatus="dataStatus" v-if="dataStatus == 'no'"></yf-Datastatus>
            <div
              id="trend-analysis"
              ref="analysisDiv"
              style="height: calc(100% - 30px)"
              :style="!dataStatus?'opacity:1':'opacity:0'"
            ></div>
          </div>
        </div>
      </div>
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import { exportTableData } from "../../assets/js/tableExport";
export default {
  name: "",
  inject: ["home"],
  data() {
    return {
      dataStatus: "no",
      headcolumnA: [
        { value: "codmn", label: "高锰酸盐指数（mg/L）" },
        { value: "tp", label: "总磷（mg/L）" },
        { value: "tn", label: "总氮（mg/L）" },
        { value: "nh3n", label: "氨氮（mg/L）" },
        { value: "ph", label: "PH（无量纲）" },
        { value: "wt", label: "水温（℃）" },
        { value: "dox", label: "溶解氧（mg/L）" },
        { value: "cond", label: "电导率（μS/cm）" },
        { value: "turb", label: "浊度（NTU）" },
        { value: "codcr", label: "化学需氧量（mg/L）" },
      ],
      dateRange: "",
      stationId: "",
      titleName: "",
      stationName: "",
      value: [
        "w01010",
        "w01001",
        "w01009",
        "w01014",
        "w01003",
        "w01019",
        "w21003",
        "w21011",
        "w21001",
        "w01016",
        "w01018",
      ],
      optionData: [],
      selectCheck: [], //选中的监测项目
      tableData: [],
      tableHead: [
        { value: "w01018", label: "化学需氧量", standard: "", isShow: true },
        { value: "w01010", label: "水温", standard: "", isShow: true },
        { value: "w01001", label: "PH", standard: "6~9", isShow: true },
        { value: "w01009", label: "溶解氧", standard: "≥5", isShow: true },
        { value: "w01014", label: "电导率", standard: "", isShow: true },
        { value: "w01003", label: "浊度", standard: "", isShow: true },
        { value: "w01019", label: "高锰酸盐", standard: "6", isShow: true },
        { value: "w21003", label: "氨氮", standard: "1", isShow: true },
        { value: "w21011", label: "总磷", standard: "0.2", isShow: true },
        { value: "w21001", label: "总氮", standard: "", isShow: true },
        //  { value: 'w01016', label: "叶绿素", standard: "", isShow: true }
      ],
      tabActive: "a1",
      tableWraHei: "",
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [10, 15, 25], //设置每页多少条
      // siteType:false,
      fieldList: [],
      fieldListB: ["province", "basin", "stationName", "dataTime"],
      loading: true,
      loadingTwo: true,
      colors: {
        wt: "#e53ce6", //水温
        dox: "#297eff", //溶解氧
        turb: "#1cad8b", //浑浊度
        cond: "#00a3f5", //电导率
        codmn: "#1ebd1e", //高锰酸盐指数
        nh3n: "#c2a100", //氨氮
        tp: "#e68320", //总磷
        tn: "#ff4242", //总氮
        ph: "#8e42ff", //PH
        CODcr: "#4258ff", //CODcr
      },
      unit: {
        水温: "℃", //水温
        溶解氧: "mg/L", //溶解氧
        浊度: "NTU", //浑浊度
        电导率: "μS/cm", //电导率
        CODmn: "mg/L", //高锰酸盐指数
        氨氮: "mg/L", //氨氮
        TP: "mg/L", //总磷
        TN: "mg/L", //总氮
        pH: "无量纲", //PH
        CODcr: "mg/L", //CODcr
      },
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      isfirst: true,
      labelStr: "",
      tableHeadData: [],
      pageType: "1",
      hisChart:null
    };
  },
  methods: {
    selectChange(arr) {
      this.value = arr;
    },
    indexMethod(index) {
      return index + 1;
    },
    search(callback) {
      for (let j in this.tableHead) {
        this.tableHead[j].isShow = false;
      }
      for (let i in this.value) {
        for (let j in this.tableHead) {
          if (this.value[i] === this.tableHead[j].value) {
            this.tableHead[j].isShow = true;
            break;
          }
        }
      }
      this.getTabelHeadData();
    },
    //获取绘图数据
    getEchartData(str, item) {
      if (item) {
        this.labelStr = item.str;
        this.optionData.map((el) => {
          if (item.label == el.label) {
            el.isTrue = true;
          } else {
            el.isTrue = false;
          }
        });
      }
      if (this.dateRange[0] != null && this.dateRange[1] != null) {
        this.loadingTwo = true;
        this.$http
          .get("/dataHandle/yunliBase/waterHistoryDataLine", {
            params: {
              mn: this.stationId,
              startTime:
                this.dateRange != null
                  ? this.dateRange[0].format("yyyy-MM-dd")
                  : "",
              endTime:
                this.dateRange != null
                  ? this.dateRange[1].format("yyyy-MM-dd")
                  : "",
              factor: str,
            },
          })
          .then((res) => {
            if (res.data.code == 0) {
              this.loadingTwo = false;
              let obj = res.data.content.info;
              if (JSON.stringify(obj) == "{}") {
                this.dataStatus = "no";
                return false;
              } else {
                this.dataStatus = "";
              }
              this.legendData = obj.legend;
              this.xAxisData = obj.xAils;
              this.yAxisData = [
                {
                  type: "value",
                  name: "单位：" + res.data.content.info.series[0].unit,
                },
              ];
              this.seriesData = [];
              let yArr = res.data.content.info.series;
              if (yArr && yArr.length > 0) {
                for (let i = 0; i < yArr.length; i++) {
                  //根据因子数添加绘图数据seriesData
                  this.seriesData.push({
                    name: yArr[i].name,
                    type: "line",
                    data: yArr[i].data,
                    yAxisIndex: i,
                    itemStyle: {
                      color: this.colors[yArr[i].code],
                    },
                  });
                }
                this.initEchart(
                  this.legendData,
                  this.xAxisData,
                  this.yAxisData,
                  this.seriesData,
                  res.data.content.info.series[0].unit
                );
              }
            }
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    initEchart(legendData, xAxisData, yAxisData, seriesData, unit) {
      let _this = this;
      var option = {
        title: {
          text: _this.titleName + "变化趋势分析图",
          x: "50",
          y: 60,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let res = params[0].axisValue + "<br/>";
            let bq = `<i style="display:inline-block;width: 12px;height: 12px;border-radius:50%;margin-right: 5px;background: ${params[0].color}"></i>`;
            var value = params[0].value == undefined ? "-" : params[0].value;
            res +=
              "<p>" +
              bq +
              params[0].seriesName +
              " : " +
              value +
              " " +
              unit +
              "</p>";
            return res;
          },
        },
        grid: {
          y: 120,
        },
        legend: {
          data: legendData,
          y: "bottom",
        },
        toolbox: {
          show: false,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: yAxisData,
        series: seriesData,
      };
      //初始化echarts实例
      this.hisChart = this.$echarts.init(
        document.getElementById("trend-analysis")
      );

      //使用制定的配置项和数据显示图表
      // myChart.clear();
      this.hisChart.setOption(option, true);
      this.hisChart.on("click", function (params) {
        console.log(params);
      });
    },
    //获取历史数据
    searchHistoryData() {
      if (this.dateRange[0] != null && this.dateRange[1] != null) {
        this.loading = true;
        this.$http
          .get("/dataHandle/yunliBase/waterHistoryData", {
            params: {
              startTime:
                this.dateRange != null
                  ? this.dateRange[0].format("yyyy-MM-dd hh:mm:ss")
                  : "",
              endTime:
                this.dateRange != null
                  ? this.dateRange[1].format("yyyy-MM-dd hh:mm:ss")
                  : "",
              //indexCodes: this.value.join(","),
              mns: this.stationId, //this.stationId
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              // isNnusual: this.status
            },
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.loading = false;
              this.isfirst = false;
              this.tableData = res.data.content.dataList;
              this.totalRecords = res.data.content.totalRecords;
            }
          })
          .catch((error) => {});
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
      this.searchHistoryData();
    },
    paginationSizeChange(val) {
      //分页pageSize改变时执行
      this.pageSize = val;
      this.searchHistoryData();
    },
    //获取表格字段
    getFieldList() {
      this.fieldList = JSON.parse(JSON.stringify(this.fieldListB));
      for (let j in this.tableHead) {
        this.tableHead[j].isShow = false;
      }
      for (let i in this.value) {
        for (let j in this.tableHead) {
          if (this.value[i] === this.tableHead[j].value) {
            this.tableHead[j].isShow = true;
            this.fieldList.push(this.tableHead[j].value);
            break;
          }
        }
      }
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
              this.optionData = [];
              this.tableHeadData.map((el, index) => {
                this.optionData.push({
                  // value: "w01018",
                  label: el.monitoring_factor_nm,
                  // standard: "",
                  // isShow: true,
                  str: el.cd,
                  isTrue: index == 0 ? true : false,
                });
              });
            }

            this.searchHistoryData();
          } else {
            this.tableHeadData = [];
          }
        })
        .catch((error) => {
          this.tableHeadData = [];
        });
    },
    //导出表格
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "历史数据";
      this.fieldList = ["areaName", "stationName", "spt", "wq_tp"];
      for (let i = 0; i < this.tableHeadData.length; i++) {
        this.fieldList.push(this.tableHeadData[i].cd);
      }
      let params = {
        headerProp: this.fieldList.join(","),
        startTime: this.dateRange[0].format("yyyy-MM-dd"),
        endTime: this.dateRange[1].format("yyyy-MM-dd"),
        mn: this.stationId,
        pattern: "yyyy-MM-dd",
      };
      console.log("导出参数==", params);
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/monitoringHistoryDataExcel",
        params
      );
    },
    pageTypeChange(val) {
      if (val === "2" && !this.hisChart) {
        setTimeout(() => {
          this.getEchartData(
            this.optionData && this.optionData.length
              ? this.optionData[0].str
              : ""
          );
        }, 500);
      }
    },
  },
  mounted() {},
  created() {
    this.$store.commit("setShowlefttree", false);
    this.selectCheck = this.value;
    let startTime = new Date(new Date().getTime() - 3600 * 1000 * 24 * 7);
    let endTime = new Date(new Date().getTime());
    this.dateRange = [startTime, endTime];
    // this.home.setTreestatus();
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
  },
  watch: {
    stationInfo(value) {
      this.stationId = value[0].nodeId;
      this.titleName = value[0].nodeName;
      this.getTabelHeadData();
    },
  },
};
</script>

<style scoped lang="less">
.historypage {
  /deep/ .el-tag {
    font-size: 14px;
    color: #ff0000;
    background-color: transparent;
    border-color: transparent;
  }
  height: 100%;
  .currency-mode-wrap {
    margin-top: 5px;
    .tablebox {
      /deep/ .el-table__body-wrapper {
        height: calc(100% - 100px) !important;
      }
    }
  }
  .unusual {
    color: #ff0000;
  }
  .bq {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .chart-wrap {
    padding-top: 20px;
    position: relative;
    .chartUl {
      position: absolute;
      right: 20px;
      z-index: 99;
      > li {
        display: inline-block;
        padding: 5px 10px;
        font-size: 12px;
        color: #1a1a1a;
        cursor: pointer;
        border: 1px solid rgba(199, 209, 223, 1);
        &:not(:nth-of-type(1)) {
          border-left: none;
        }
      }
      .active {
        color: #ffffff;
        background-color: #1f82f4;
      }
    }
  }
}
.secondary-toolbar {
  position: relative;
  .code {
    position: absolute;
    right: 30px;
    top: 15px;
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
.toolbar-right {
  float: right;
}
</style>
