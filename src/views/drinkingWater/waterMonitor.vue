<template>
  <div class="pageContent" style="height:100%">
    <div class="treeBox">
      <div class="treebody">
        <div class="treeTool clearfix">
          <el-input
            placeholder="请输入站点名称关键字"
            suffix-icon="el-icon-search"
            v-model="filter"
            @change="searchTreedata"
          ></el-input>
        </div>
        <ul class="clearfix treenav">
          <li
            v-for="(item,key) in treeNav"
            :key="key"
            :class="treeNavindex==key?'current':''"
            @click="treeNavclick(item,key)"
          >{{item.name}}</li>
        </ul>
        <div style="width:100%;height:calc(100% - 62px)" class="treescroll">
          <el-scrollbar style="height:100%">
            <div class="tree_content" style="padding:12px;width:450px">
              <el-tree
                :data="treeData"
                :indent="23"
                node-key="id"
                ref="tree"
                @node-click="treeNodeclick"
                :default-expanded-keys="defaultId"
                :filter-node-method="filterNode"
                highlight-current
                accordion
                :class="treeData.length==1?'noBr':''"
                :props="defaultProps"
              >
                <span class="custom-tree-node" slot-scope="{node,data}">
                  <span>
                    <i
                      class="iconCode"
                      :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'offlinestation'"
                    ></i>
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="secondary-page-section secondary-page-mode tapStyle">
      <div class="secondary-toolbar">
        <span>时间选择 :</span>&nbsp;
        <div class="layoutBox" style="width: 300px;">
          <sl-date-picker
            range-separator="至"
            v-model="dateRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></sl-date-picker>
        </div>&emsp;&emsp;
        <span>数据类型 :</span>&nbsp;
        <div class="layoutBox">
          <el-select v-model="status" placeholder="请选择" size="small" style="width:160px">
            <el-option
              v-for="item in dataStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>&emsp;&emsp;
        <el-button @click="searchHistoryData">
          <i class="iconfont icon-sousuo"></i> 查询
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <yf-tabs type="border-card" :value="tabActive" @tab-click="toggleTab">
          <yf-tab-pane name="a1" label="数据列表">
            <div
              ref="tableWra"
              class="tablebox"
              style="height: calc(100% - 35px);"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <el-table
                :data="tableData"
                ref="table"
                border
                height="100%"
                style="width: 100%"
                tooltip-effect="light"
              >
                <el-table-column type="index" label="序号" :index="indexMethod" width="50"></el-table-column>
                <el-table-column prop="oriLocationName" label="点位名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="oriLocationType" width="180" label="水源地类型"></el-table-column>
                <el-table-column prop="receiveTime" width="250" label="监测时间"></el-table-column>
                <el-table-column prop="temperature" width="100" label="水温(℃)"></el-table-column>
                <el-table-column prop="ph" width="100" label="pH(无量纲)"></el-table-column>
                <el-table-column prop="disOxygen" width="100" label="溶解氧(mg/L)"></el-table-column>
                <el-table-column prop="conductivity" width="160" label="电导率(μS/cm)"></el-table-column>
                <el-table-column prop="turbidity" width="100" label="浊度(NTU)"></el-table-column>
                <el-table-column prop="an" width="100" label="氨氮(mg/L)"></el-table-column>
                <el-table-column prop="permanganate" width="180" label="CODmn(mg/L)"></el-table-column>
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
          </yf-tab-pane>
          <yf-tab-pane name="a2" label="数据图表">
            <div
              class="chart-wrap"
              style="height: 100%"
              v-loading="loadingTwo"
              element-loading-text="加载中"
              element-loading-spinner="loading-type-a"
              element-loading-background="rgba(255, 255, 255, 1)"
            >
              <div id="trend-analysis" style="height: 100%"></div>
            </div>
          </yf-tab-pane>
        </yf-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { exportTableData } from "../../assets/js/tableExport";
export default {
  name: "",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultId: [],
      treeNav: [{ name: "区域" }, { name: "流域" }], //树结构菜单导航
      treeNavindex: 0,
      filter: "",
      treeData: [],
      status: "2",
      dataStatus: [
        { label: "自动监测数据", value: "1" },
        { label: "手工监测数据", value: "2" }
      ],
      dateRange: "",
      stationId: "",
      stationName: "",
      tableData: [],
      tabActive: "a1",
      tableWraHei: "",
      currentPage: 1, //分页组件当前页
      pageSize: 20, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [10, 15, 20], //设置每页多少条
      // siteType:false,
      fieldList: [],
      fieldListB: ["province", "basin", "stationName", "dataTime"],
      loading: true,
      loadingTwo: true,
      colors: {
        w01010: "#e53ce6", //水温
        w01009: "#297eff", //溶解氧
        w01003: "#1cad8b", //浑浊度
        w01014: "#00a3f5", //电导率
        w01019: "#1ebd1e", //高锰酸盐指数
        w21003: "#c2a100", //氨氮
        w21011: "#e68320", //总磷
        w21001: "#ff4242", //总氮
        w01001: "#8e42ff", //PH
        w01018: "#4258ff" //CODcr
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
        CODcr: "mg/L" //CODcr
      },
      legendData: [],
      xAxisData: [],
      yAxisData: [],
      seriesData: [],
      screenType: "area"
    };
  },
  methods: {
    //查询站点树数据
    searchTreedata() {
      this.$http
        .get("/waterEnvXA/station/oriTree", {
          params: {
            structureType: this.screenType,
            keywords: this.filter ? this.filter : ""
          }
        })
        .then(res => {
          this.treeData = res.data.content.dataList;
          this.$nextTick(() => {
            if (this.screenType == "area") {
              this.$refs.tree.setCurrentKey(
                this.treeData[0].children[0].children[0].children[0].id
              );
              this.defaultId.push(
                this.treeData[0].children[0].children[0].children[0].id
              );
              this.stationId = this.treeData[0].children[0].children[0].children[0].id;
            } else {
              this.$refs.tree.setCurrentKey(
                this.treeData[0].children[0].children[0].id
              );
              this.defaultId.push(this.treeData[0].children[0].children[0].id);
              this.stationId = this.treeData[0].children[0].children[0].id;
            }
            this.searchHistoryData();
          });
        });
    },
    //树节点筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    //树结构导航点击
    treeNavclick(item, key) {
      this.treeNavindex = key;
      if (item.name == "区域") {
        this.filter = "";
        this.screenType = "area";
        this.searchTreedata();
      } else if (item.name == "流域") {
        this.filter = "";
        this.screenType = "river";
        this.searchTreedata();
      } else if (item.name == "自定义") {
        this.screenType = "custom";
        //this.searchTreeData();
      }
    },
    //数据图表创建
    createTrendAnalysis() {
      let myChart = this.$echarts.init(
        document.getElementById("trend-analysis")
      );
      let option = {
        color: [
          "#8E42FF",
          "#00A3F5",
          "#1CAD8B",
          "#1EBD1E",
          "#C2A100",
          "#E68320",
          "#FF4242"
        ],
        title: {
          text: "变化趋势分析图",
          x: "center",
          y: 10
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["水温", "PH", "溶解氧", "电导率", "浊度"],
          top: 40
        },
        grid: {
          top: 80,
          left: 60,
          right: 60,
          bottom: 50,
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: "inside",
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#666"
            }
          },
          data: [
            "2019/02/07 5时",
            "2019/02/07 6时",
            "2019/02/07 7时",
            "2019/02/07 8时",
            "2019/02/07 9时",
            "2019/02/07 10时",
            "2019/02/07 11时"
          ]
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "水温",
            type: "line",
            smooth: true,
            data: [20, 32, 11, 34, 20, 30, 21],
            markArea: {
              silent: true,
              itemStyle: {
                color: "#d7e1eb",
                opacity: 0.6,
                borderWidth: 1,
                borderType: "dashed"
              },
              label: {
                color: "#000"
              }
              // data: [[{
              //   xAxis: '2019/02/07 6时',
              //   name:'周质控不合格',
              // },{
              //   xAxis: '2019/02/07 7时'
              // }],[{
              //   xAxis: '2019/02/07 8时',
              //   name:'月质控-集成干预检查不合格',
              // },{
              //   xAxis: '2019/02/07 10时'
              // }]]
            }
          },
          {
            name: "PH",
            type: "line",
            smooth: true,
            data: [22, 18, 19, 23, 29, 33, 31]
          },
          {
            name: "溶解氧",
            type: "line",
            smooth: true,
            data: [15, 23, 20, 15, 19, 33, 41]
          },
          {
            name: "电导率",
            type: "line",
            smooth: true,
            data: [32, 32, 30, 34, 30, 33, 32]
          },
          {
            name: "浊度",
            type: "line",
            smooth: true,
            data: [20, 32, 21, 34, 12, 13, 20]
          }
        ]
      };
      myChart.setOption(option);
    },
    selectChange(arr) {
      this.value = arr;
    },
    indexMethod(index) {
      return index + 1;
    },
    toggleTab(val) {
      let name = val.name;
      if (name === "a2") {
        this.getEchartData();
      }
    },
    //获取绘图数据
    getEchartData() {
      if (this.dateRange[0] != null && this.dateRange[1] != null) {
        this.loadingTwo = true;
        // let a = [];
        // a.push(this.stationId);
        this.$http
          // /Statistics-Service/dataCharts/queryRowToColHourDataCharts
          .get("/waterEnvXA/waterOriLocationData/queryManualByPic", {
            params: {
              projectNames: [],
              startTime: this.dateRange[0].format("yyyy-MM-dd 00:00:00"),
              endTime: this.dateRange[1].format("yyyy-MM-dd 23:59:59"),
              // oriLocationIds: JSON.stringify(a)
              oriLocationId: this.stationId
            }
          })
          .then(res => {
            this.loadingTwo = false;
            this.createTrendAnalysis();
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    //获取历史数据
    searchHistoryData() {
      if (this.dateRange[0] != null && this.dateRange[1] != null) {
        this.loading = true;
        this.$http
          .get("/waterEnvXA/waterOriLocationData/queryManualByList", {
            params: {
              startTime: this.dateRange[0].format("yyyy-MM-dd 00:00:00"),
              endTime: this.dateRange[1].format("yyyy-MM-dd 23:59:59"),
              oriLocationId: this.stationId, //this.stationId
              pageNo: this.currentPage,
              pageSize: this.pageSize
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.loading = false;
              this.tableData = res.data.content.dataList;
              this.totalRecords = res.data.content.totalRecords;
            }
          })
          .catch(error => {});
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    //树单选
    treeNodeclick(data) {
      this.stationId = data.id;
      this.searchHistoryData();
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
    //导出表格
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = this.stationName + "历史数据";
      let params = {
        headerProp: this.fieldList.join(","),
        startTime: this.dateRange[0].format("yyyy-MM-dd 00:00:00"),
        endTime: this.dateRange[1].format("yyyy-MM-dd 23:59:59"),
        indexCodes: this.value.join(","),
        stationCodes: this.stationId,
        pattern: "yyyy-MM-dd HH:mm:ss"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Receiving/exports/dataReceiveExcel",
        params
      );
    }
  },
  created() {
    this.searchTreedata();
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.dateRange = [start, end];
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    }
  },
  watch: {
    filter(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="less" scoped>
.pageContent {
  position: relative;
  background: #eff3f5;
  .treeBox {
    width: 204px;
    height: calc(100% - 12px);
    border: 1px solid #dce9fa;
    position: absolute;
    left: 6px;
    top: 6px;
    background: #ebf1f7;
    .closeBtn {
      width: 6px;
      height: 44px;
      background: url("../../assets/images/shuClose.png") center center
        no-repeat;
      position: absolute;
      top: 50%;
      transform: translateY(-3px);
      right: -6px;
      cursor: pointer;
      &:hover {
        background: url("../../assets/images/hover_shuClose.png") center center
          no-repeat;
      }
      i {
        width: 3px;
        height: 8px;
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translateY(-4px);
        background: url("../../assets/images/righticon.png") center center
          no-repeat;
      }
    }
    .treebody {
      background: #fff;
      width: 100%;
      height: calc(100% - 3px);
      .treeTool {
        border-bottom: 1px solid #dfe3f2;
        height: 34px;
        padding: 3px;
        > span {
          display: inline-block;
          height: 25px;
          width: 28px;
          text-align: center;
          line-height: 28px;
          color: #7b8fa4;
          cursor: pointer;
          font-weight: 700;
          vertical-align: -2px;
        }
      }
      .treenav {
        li {
          float: left;
          height: 28px;
          width: 49.99%;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
          color: #666;
          background: #ebf1f7;
          border-right: 1px solid #dce9fa;
          border-bottom: 1px solid #dce9fa;
          &:last-child {
            border-right: 0px;
          }
        }
        .current {
          color: #166bce;
          background: #fff;
          border-bottom: 0px;
          font-weight: 700;
        }
      }
      .tree_content {
        height: calc(100% - 52px);
      }
    }
  }
  .secondary-page-section {
    height: calc(100% - 12px);
    //  border: 1px solid #dce9fa;
    width: calc(100% - 222px);
    position: absolute;
    background: #fff;
    left: 216px;
    top: 6px;
    transition: all 0.3s;
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
</style>
