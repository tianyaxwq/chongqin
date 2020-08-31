<template>
  <div class="realTimeAlarmpage clearfix secondary-page-mode">
    <el-scrollbar class="currency-mode-scroll" style="height: 100%;">
      <div class="secondary-toolbar">
        <span>断面名称：</span>&nbsp;
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入断面名称" clearable v-model="stnmName" size="small"></el-input>
        </div>&emsp;&emsp;
        <span>报警类型：</span>&nbsp;
        <div class="layoutBox">
          <el-select v-model="value" placeholder="请选择" size="small" style="width:200px">
            <el-option
              v-for="item in optionData"
              :key="item.alarmTypeId"
              :label="item.alarmTypeName"
              :value="item.alarmTypeId"
            ></el-option>
          </el-select>
        </div>&emsp;&emsp;
        <el-button @click="getData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <ul class="layoutBox alarmLevel">
          <span>报警等级：</span>
          <li>
            <i></i>
            <span>一级</span>
          </li>
          <li>
            <i></i>
            <span>二级</span>
          </li>
        </ul>
      </div>
      <div class="currency-mode-wrap">
        <el-table
          :data="tableData"
          style="overflow-y: auto; height: 415px;"
          border
          v-loading="loading"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="dataEquipName" width="160" label="断面名称">
            <template slot-scope="scope">
              <span>{{scope.row.dataEquipName == "null" || !scope.row.dataEquipName ? "--" : scope.row.dataEquipName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventTime" width="160" label="报警时间">
            <template slot-scope="scope">
              <span>{{scope.row.eventTime == "null" || !scope.row.eventTime ? "--" : scope.row.eventTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="报警指标" width="130">
            <template slot-scope="scope">
              <span>{{scope.row.projectName == "null" || !scope.row.projectName ? "--" : scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmTypeName" label="报警类型" width="130">
            <template slot-scope="scope">
              <span>{{scope.row.alarmTypeName == "null" || !scope.row.alarmTypeName ? "--" : scope.row.alarmTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmTypeName" label="当前水质" width="100">
            <template slot-scope="scope">
              <!-- 水质等级从0开始 -->
              <span v-if="scope.row.waterQualityGrade == 'null' || !scope.row.waterQualityGrade">--</span>
              <span
                class="target-level"
                :class="'colorValue' + scope.row.waterQualityGrade"
                v-else
              >{{scope.row.waterQualityGrade == "0" ? 'Ⅰ' : scope.row.waterQualityGrade == "1" ? 'Ⅱ' : scope.row.waterQualityGrade == "2" ? 'Ⅲ' : scope.row.waterQualityGrade == "3" ? 'Ⅳ' : scope.row.waterQualityGrade == "4" ? 'Ⅴ' : scope.row.waterQualityGrade == "5" ? '劣Ⅴ' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventDesc" label="报警信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.eventDesc == "null" || !scope.row.eventDesc ? "--" : scope.row.eventDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmLevel" label="报警等级" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.alarmLevel == 'null' || !scope.row.alarmLevel">--</span>
              <span v-else :class="scope.row.alarmLevel == 1 ? 'oneLevel' : 'twoLevel'"></span>
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
        <div class="alarmsNum">
          <div
            class="chart-wrap"
            v-loading="loadingTwo"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <p class="title">
              <img src="../../assets/images/companyDetail/bjNumToday.png" alt /> 今日各指标报警次数
            </p>
            <yf-Datastatus :dataStatus="dataStatus" v-if="dataStatus == 'no'"></yf-Datastatus>
            <div
              id="trend-analysis"
              ref="analysisDiv"
              style="height: calc(100% - 41px);"
              :style="!dataStatus?'opacity:1':'opacity:0'"
            ></div>
          </div>
          <div class="numTable" style="margin-right: 10px">
            <p class="title">
              <img src="../../assets/images/companyDetail/bjNum.png" alt /> 今日报警次数排名
            </p>
            <div style="padding: 8px">
              <el-table
                :data="numTableData"
                style="height: calc(100% - 41px);"
                border
                v-loading="loadingThree"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="stationName" label="断面名称"></el-table-column>
                <el-table-column prop="count" width="100" label="报警次数"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="numTable">
            <p class="title">
              <img src="../../assets/images/companyDetail/bjNum.png" alt /> 今日超标倍数排名
            </p>
            <div style="padding: 8px">
              <el-table
                :data="numTableData1"
                style="height: calc(100% - 41px);"
                border
                v-loading="loadingThree"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="stationName" label="断面名称"></el-table-column>
                <el-table-column prop="count" width="100" label="超标倍数"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: "realTimeAlarm",
  data() {
    return {
      dataStatus: "no",
      loading: false,
      loadingTwo: false,
      loadingThree: false,
      stnmName: "",
      value: "",
      optionData: [],
      tableData: [],
      numTableData: [],
      numTableData1: [
        {
          "count" : 2.5,
          "stationName" : "望亭桥"
        }, {
          "count" : 2.2,
          "stationName" : "北际头"
        }, {
          "count" : 2.1,
          "stationName" : "蒲口"
        }, {
          "count" : 1.8,
          "stationName" : "东向阳"
        }, {
          "count" : 1.6,
          "stationName" : "思乡桥"
        }, {
          "count" : 1.5,
          "stationName" : "后赵桥"
        }, {
          "count" : 1.5,
          "stationName" : "膳马庙村北"
        }, {
          "count" : 1.4,
          "stationName" : "寨里"
        }, {
          "count" : 1.1,
          "stationName" : "任庄"
        }
      ],
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [10, 15, 25] //设置每页多少条
    };
  },
  methods: {
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
      this.getData();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // 获取下拉条件查询
    getAlarmType() {
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmType", {
          params: {
            dataStatus: 1
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.optionData = res.data.content.dataList;
          }
        });
    },
    // 获取表格数据
    getData() {
      this.loading = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmEventData", {
          params: {
            startTime: new Date(
              new Date().getTime() - 3600 * 1000 * 24 * 2
            ).format("yyyy-MM-dd hh:mm:ss"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            sortBy: "eventTime",
            order: "desc",
            alarmTypeId: this.value,
            keyword: this.stnmName,
            pageNumber: this.currentPage - 1,
            pageSize: this.pageSize,
            appId: "E9F262C16F814392AD5FDE5D217391BE"
            // startTime: "2020-04-11 10:09:33",
            // endTime: "2020-04-13 10:09:33",
            // appId: "E9F262C16F814392AD5FDE5D217391BE",
            // mns: "WT_00018075",
            // sortBy: "eventTime",
            // order: "desc",
            // pageNumber: this.currentPage - 1,
            // pageSize: this.pageSize
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
          } else {
            this.tableData = [];
          }
        });
    },
    // 各指标报警次数指标柱状图
    getBar() {
      let XData = [];
      let YData = [];
      this.loadingTwo = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/monitorCountBar", {
          params: {
            startTime: new Date().format("yyyy-MM-dd 00:00:00"),
            endTime: new Date().format("yyyy-MM-dd 23:59:59"),
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          this.loadingTwo = false;
          if (res.data.code == 0) {
            if (
              res.data.content.info.series &&
              res.data.content.info.series.length > 0
            ) {
              this.dataStatus = "";
            } else {
              this.dataStatus = "no";
              return;
            }
            let barEcharts = this.$echarts.init(
              document.getElementById("trend-analysis")
            );
            YData = res.data.content.info.series;
            XData = res.data.content.info.xAxis;
            let option = {
              tooltip: {
                show: true
              },
              grid: {
                top: "15%",
                left: "3%",
                right: "3%",
                bottom: 10,
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  data: XData,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#D9E6F7"
                    }
                  },
                  axisLabel: {
                    color: "#1A1A1A"
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: "#D9E6F7"
                    }
                  }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  name: "单位：次",
                  nameTextStyle: {
                    color: "#1A1A1A"
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    textStyle: {
                      //改变刻度字体样式
                      color: "#1A1A1A"
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#D9E6F7"
                    }
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: "#D9E6F7"
                    }
                  }
                }
              ],
              series: [
                {
                  type: "bar",
                  data: YData,
                  label: {
                    show: false
                  },
                  itemStyle: {
                    normal: {
                      //每根柱子颜色设置
                      color: function(params) {
                        let colorList = [
                          "#1890FF",
                          "#F5222D",
                          "#FA8C16",
                          "#FADB14",
                          "#A0D911",
                          "#722ED1"
                        ];
                        return colorList[params.dataIndex];
                      }
                    }
                  },
                  barWidth: 20
                }
              ]
            };
            barEcharts.setOption(option);
          }
        });
    },
    // 获取排名次数表格数据
    getRank() {
      this.loadingThree = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/stationCountTable", {
          params: {
            startTime: new Date().format("yyyy-MM-dd 00:00:00"),
            endTime: new Date().format("yyyy-MM-dd 23:59:59"),
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loadingThree = false;
            this.numTableData = res.data.content.dataList;
          }
        });
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    }
  },
  created() {},
  mounted() {
    this.getAlarmType();
    this.getData();
    this.getBar();
    this.getRank();
  }
};
</script>
<style lang="less" scoped>
.realTimeAlarmpage {
  height: 100%;
  .oneLevel {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #ffef36;
  }
  .twoLevel {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #f71515;
  }
  .secondary-toolbar {
    position: relative;
    .alarmLevel {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #666;
      font-size: 13px;
      > li {
        display: inline-block;
        > i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #ffef36;
        }
        &:last-child {
          > i {
            background-color: #f71515;
          }
        }
      }
    }
  }
  .currency-mode-wrap {
    background: #eaeef4;
    .paginationBox {
      background: #fff;
    }
    .alarmsNum {
      margin-top: 10px;
      display: flex;
      height: 312px;
      .title {
        padding: 10px 0;
        font-weight: bold;
        font-size: 14px;
        color: #1a1a1a;
        border-bottom: 1px solid #dce9fa;
        > img {
          margin: 0 5px 0 15px;
        }
      }
      > div {
        flex: 1;
        background-color: #fff;
      }
      .chart-wrap {
        position: relative;
        margin-right: 10px;
      }
    }
  }
}
</style>
