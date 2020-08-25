<template>
  <!--自动站单站报表-->
  <div class="single-station-report-page">
    <div class="secondary-page-mode">
      <div class="secondary-toolbar">
        <span>数据类型：</span>
        <el-button-group>
          <el-button
            :class="{active:dataType === index}"
            size="small"
            type="primary"
            plain
            :key="index"
            v-for="(item,index) in dataTypeList"
            @click="dataTypeToggle(index)"
          >{{ item.name }}</el-button>
        </el-button-group>&emsp;
        <span>时间：</span>
        <div class="layoutBox" style="width:150px">
          <el-date-picker
            v-model="dataValue"
            :format="format"
            :type="headtimetype"
            placeholder="选择时间"
          ></el-date-picker>
        </div>&emsp;
        <el-button @click="getTableData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div
        class="currency-mode-wrap"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-scrollbar class="currency-mode-scroll">
          <h4 class="report-form-title">{{headtitle}}</h4>
          <p class="report-form-subtitle">{{statisDate}}</p>
          <div class="report-table-wrap" style="position: relative;">
            <el-table
              :data="tableData"
              border
              ref="table"
              tooltip-effect="light"
              style="width: 100%;"
            >
              <el-table-column type="index" label="序号" fixed width="50"></el-table-column>
              <el-table-column prop="name" label="站点名称" fixed width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.name ? scope.row.name : '--'}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="name" label="所属河流" fixed>
                <template slot-scope="scope">
                  <span>{{scope.row.name ? scope.row.name : '--'}}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                :key="index"
                v-for="(item,index) in headcolumn"
                :label="item.monitoring_factor_nm"
              >
                <el-table-column width="140" :label="item.monitoring_factor_dw">
                  <template slot-scope="scope">
                    <span v-if="scope.row[item.cd]">{{scope.row[item.cd]}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="level" label="水质类别">
                <template slot-scope="scope">
                  <span v-if="!scope.row.level">--</span>
                  <span
                    v-else
                    class="target-level"
                    :class="'colorValue' + (scope.row.level == 'I类' ? 0 : scope.row.level == 'II类' ? 1 : scope.row.level == 'III类' ? 2 : scope.row.level == 'IV类' ? 3 : scope.row.level == 'V类' ? 4 : scope.row.level == '劣V类' ? 5 : '')"
                  >{{scope.row.level.substring(0, scope.row.level.length - 1)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="waterCondition" label="水质状况">
                <template slot-scope="scope">
                  <span>{{scope.row.waterCondition ? scope.row.waterCondition : '--'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="keyPollution" label="主要污染指标" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.keyPollution ? scope.row.keyPollution : '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../../assets/js/dateformat";
import { exportTableData } from "../../assets/js/tableExport";
let dataTypeList = [
  {
    name: "日报",
    type: "date"
  },
  // {
  //   name: "周报",
  //   type: "week"
  // },
  {
    name: "月报",
    type: "month"
  },
  {
    name: "年报",
    type: "year"
  }
];
let pickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};

export default {
  name: "singleStationReport",
  data() {
    return {
      dataTypeList, //数据类型
      dataType: 0, //数据类型选中下标
      pickerOptions, //时间快捷菜单数据
      dataValue: "", //时间绑定数据
      tableData: [], //表格数据,
      stationInfo: [],
      headcolumn: [],
      headtitle: "",
      statisDate: "",
      headtimetype: "date",
      loading: true,
      format: "",
      factors: []
    };
  },
  methods: {
    dataTypeToggle(index) {
      this.dataType = index;
      if (index == 0) {
        this.headtimetype = "date";
        this.format = "";
      } else if (index == 1) {
        this.headtimetype = "month";
        this.format = "";
      } else if (index == 2) {
        this.headtimetype = "year";
        this.format = "";
      }
      // if (index == 1) {
      //   this.headtimetype = "week";
      //   this.format = "yyyy 第 WW 周";
      // } else
    },
    initTime() {
      if (this.headtimetype == "date") {
        this.dataValue = new Date().format("yyyy-MM-dd");
      } else if (this.headtimetype == "month") {
        this.dataValue = new Date().format("yyyy-MM");
      } else if (this.headtimetype == "year") {
        this.dataValue = new Date().format("yyyy");
      }
    },
    initTitle() {
      if (this.headtimetype == "date") {
        this.headtitle = "多站日报";
      } else if (this.headtimetype == "month") {
        this.headtitle = "多站月报";
      } else if (this.headtimetype == "year") {
        this.headtitle = "多站年报";
      } else if (this.headtimetype == "week") {
        this.headtitle = "多站周报";
      }
    },
    //获取表格数据
    getTableData() {
      if (this.dataValue) {
        this.loading = true;
        let d = "";
        let timeType = "";
        let weekSatrt = "";
        let weekEnd = "";
        if (this.headtimetype == "date") {
          d = new Date(this.dataValue).format("yyyy-MM-dd");
          timeType = "day";
        } else if (this.headtimetype == "month") {
          d = new Date(this.dataValue).format("yyyy-MM");
          timeType = "month";
        } else if (this.headtimetype == "year") {
          d = new Date(this.dataValue).format("yyyy");
          timeType = "year";
        } else if (this.headtimetype == "week") {
          let now = new Date(this.dataValue);
          let nowTime = now.getTime();
          let day = now.getDay();
          let oneDayTime = 24 * 60 * 60 * 1000;
          let MondayTime = nowTime - day * oneDayTime; //显示周一
          let SundayTime = nowTime + (6 - day) * oneDayTime; //显示周日
          weekSatrt = new Date(MondayTime).format("yyyy-MM-dd");
          weekEnd = new Date(SundayTime).format("yyyy-MM-dd");
          timeType = "week";
        }
        this.initTitle();
        this.$http
          .get("/Statistics-Service/statisticalReports/multiStationReport", {
            params: {
              timeType: timeType,
              time: d,
              stationMn: this.stationInfo.join(","),
              // time: this.value
              weekSatrt: weekSatrt,
              weekEnd: weekEnd,
              factorList: this.factors.join(",")
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.tableData = res.data.content.dataList;
              this.statisDate = res.data.content.info.message;
            } else {
              this.tableData = [];
              this.statisDate = "";
            }
            this.loading = false;
          })

          
          .catch(res => {
            this.tableData = [];
            this.statisDate = "";
            this.loading = false;
          });
      } else {
        this.$message.error("请先选择时间查询");
      }
    },
    //获取所有监测项目
    getFactor() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.stationInfo.join(",")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.headcolumn = res.data.content.dataList;
            let factorList = [];
            this.headcolumn.map(el => {
              factorList.push(el.cd);
            });
            this.factors = factorList;
          } else {
            this.headcolumn = [];
          }
          this.getTableData();
        })
        .catch(error => {
          this.headcolumn = [];
        });
    },
    //导出报表
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = this.headtitle;
      let d = "";
      let timeType = "";
      let weekSatrt = "";
      let weekEnd = "";
      if (this.headtimetype == "date") {
        d = new Date(this.dataValue).format("yyyy-MM-dd");
        timeType = "day";
      } else if (this.headtimetype == "month") {
        d = new Date(this.dataValue).format("yyyy-MM");
        timeType = "month";
      } else if (this.headtimetype == "year") {
        d = new Date(this.dataValue).format("yyyy");
        timeType = "year";
      } else if (this.headtimetype == "week") {
        let now = new Date(this.dataValue);
        let nowTime = now.getTime();
        let day = now.getDay();
        let oneDayTime = 24 * 60 * 60 * 1000;
        let MondayTime = nowTime - day * oneDayTime; //显示周一
        let SundayTime = nowTime + (6 - day) * oneDayTime; //显示周日
        weekSatrt = new Date(MondayTime).format("yyyy-MM-dd");
        weekEnd = new Date(SundayTime).format("yyyy-MM-dd");
        timeType = "week";
      }
      this.fieldList = ["name"];
      for (let i = 0; i < this.headcolumn.length; i++) {
        this.fieldList.push(this.headcolumn[i].cd);
      }
      this.fieldList.push("level");
      this.fieldList.push("waterCondition");
      this.fieldList.push("keyPollution");
      let params = {
        headerProp: this.fieldList.join(","),
        timeType: timeType,
        time: d,
        stationMn: this.stationInfo.join(","),
        // time: this.dataValue
        weekSatrt: weekSatrt,
        weekEnd: weekEnd,
        factorList: this.factors.join(",")
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/Statistics-Service/exports/multiStationReportExcel",
        params
      );
    }
  },
  mounted() {},
  created() {
    this.initTime();
  },
  components: {},
  computed: {
    station() {
      return this.$store.state.stationInfo;
    }
  },
  watch: {
    station(value) {
      this.stationInfo = [];
      if (value.length > 0) {
        for (let i in value) {
          this.stationInfo.push(value[i].nodeId);
        }
      }
      //  this.stationInfo = newvalue[0];
      this.getFactor();
    }
  },
  destroy() {}
};
</script>

<style scoped lang="less">
.single-station-report-page {
  height: 100%;
  .currency-mode-wrap {
    height: calc(100% - 56px);
  }
  .currency-mode-scroll {
    height: 100%;
  }
  .report-form-title {
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    text-align: center;
    margin-top: 12px;
  }
  .report-form-subtitle {
    text-align: center;
    line-height: 24px;
    padding: 0 16px;
  }
}
</style>
