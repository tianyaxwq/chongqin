<template>
  <div class="overview-control">
    <el-scrollbar style="height: 100%">
      <div style="padding: 7px;">
        <div class="modular-wrap">
          <div class="modular-header">
            <span class="title">基础信息</span>
          </div>
          <div class="modular-body">
            <div class="modular-row clear">
              <div class="base-info">
                <div class="base-title">
                  <i class="base-site-icon"></i>
                  <span class="base-site-name">{{ siteInfo.stationName || "--" }}</span>
                  <!-- <a href="javascript:;" class="details-ben" @click="siteDetails = true;">详情</a> -->
                </div>
                <ul class="base-info-list">
                  <li>
                    全&emsp;&emsp;称：
                    {{ siteInfo.stationName || "--" }}
                  </li>
                  <li class="alitter">
                    所属流域：
                    {{ siteInfo.basinName || "--" }}
                  </li>
                  <li>
                    建站时间：
                    {{siteInfo.enabledTime || "--" }}
                  </li>
                  <li class="alitter">
                    所属区域：
                    {{ siteInfo.areaName || "--" }}
                  </li>
                  <li>站点类型：{{ siteInfo.stationType == 'WQ03' ? "国控站" : siteInfo.stationType == 'WQ04' ? "省控站" : siteInfo.stationType == 'WQ08' ? "加密站" : siteInfo.stationType == 'WQ07' ? "排污口" : siteInfo.stationType == 'WQ01' ? "地下水质站" : siteInfo.stationType == 'WQ05' ? "预警站" : siteInfo.stationType == 'WQ06' ? "水质监测" : siteInfo.stationType == 'WQ09' ? "溯源站" : siteInfo.stationType == 'WQ10' ? "固定站" : "--"}}</li>
                  <li class="alitter">
                    水质目标级别：
                    <i v-if="siteInfo.targetLevel == 'null' || !siteInfo.targetLevel">--</i>
                    <i
                      class="target-level"
                      :class="'colorValue' + siteInfo.targetLevel"
                      v-else
                    >{{siteInfo.targetLevel == "0" ? 'Ⅰ' : siteInfo.targetLevel == "1" ? 'Ⅱ' : siteInfo.targetLevel == "2" ? 'Ⅲ' : siteInfo.targetLevel == "3" ? 'Ⅳ' : siteInfo.targetLevel == "4" ? 'Ⅴ' : siteInfo.targetLevel == "5" ? '劣Ⅴ' : ''}}</i>
                  </li>
                </ul>
              </div>
              <div class="base-img">
                <img src="../../assets/images/index/site-icon.png" />
              </div>
            </div>
            <!-- <div class="modular-row clear">
              <div class="secondary-title">仪器参数</div>
              <div class="secondary-menu">
                <span
                  class="item"
                  v-for="(item,key) in pList"
                  :key="key"
                >{{item.PROJECT_NAME}}（{{item.EQUIPMENT_NAME}}）</span>
              </div>
            </div>-->
          </div>
        </div>
        <div class="modular-wrap">
          <div class="limitBox" :style="limitShow ? 'opacity: 1;' : 'opacity: 0;'">
            <img src="../../assets/images/index/limitBox.png" alt />
          </div>
          <div class="modular-header">
            <span class="title">监测数据</span>
            <span class="limit" @mouseenter="enterLimit" @mouseleave="leaveLimit">
              标准限值
              <img src="../../assets/images/index/qusition.png" />
            </span>
          </div>
          <div class="modular-body" style="padding: 0">
            <div class="monitoring-info">
              <!-- <div class="monitoring-title">
                <span class="title" v-if="monitorObj.stationState == '2'">
                  <i class="abnormal-icon"></i> 异常超标
                </span>
                <span class="title" v-if="monitorObj.stationState == '1'">
                  <i class="site-normal-icon"></i> 站点正常
                </span>
                <span class="title" v-if="monitorObj.stationState == '0'">
                  <i class="site-offline-icon"></i> 站点离线
                </span>
                <div class="toolbar"> primaryPollutant: "",
        targerWaterQuality: "",
        waterQuality: ""
                  <el-button type="secondBtn">去溯源</el-button>
                </div>
              </div>-->
              <div class="monitoring-text" v-if="realData">
                <div class="nonFactor">
                  <span>
                    <img src="../../assets/images/companyDetail/clock.png" alt />
                    最新数据时间：
                    {{realData.spt == "null" || !realData.spt ? "--" : realData.spt}}
                  </span>
                  <span>
                    当前水质类别：
                    <i v-if="realData.wq_tp == 'null' || !realData.wq_tp">--</i>
                    <i
                      v-else
                      class="target-level"
                      :class="'colorValue' + realData.wq_tp"
                    >{{realData.wq_tp == "0" ? 'Ⅰ' : realData.wq_tp == "1" ? 'Ⅱ' : realData.wq_tp == "2" ? 'Ⅲ' : realData.wq_tp == "3" ? 'Ⅳ' : realData.wq_tp == "4" ? 'Ⅴ' : realData.wq_tp == "5" ? '劣Ⅴ' : ''}}</i>
                  </span>
                </div>
                <span v-for="(item, index) in tableHeadData" :key="index">
                  <i>{{item.label}}</i>
                  <br />
                  <i
                    :style="{color: paramsObj.contrast(realData[item.str + '_level'], siteInfo.targetLevel)}"
                  >{{realData[item.str] == "null" || !realData[item.str] ? "--" : realData[item.str]}}</i>
                  {{item.unit ? "(" + item.unit + ")" : ""}}
                </span>
              </div>
              <div class="monitoring-text" v-else>
                <div class="nonFactor">
                  <span>
                    <img src="../../assets/images/companyDetail/clock.png" alt />
                    最新数据时间：--
                  </span>
                  <span>当前水质类别：--</span>
                </div>
                <span v-for="(item, index) in tableHeadData" :key="index">
                  <i>{{item.label}}</i>
                  <br />
                  <i
                  >--</i>
                  {{item.unit ? "(" + item.unit + ")" : ""}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      width="780px"
      :title="siteInfo.stationName"
      :append-to-body="true"
      custom-class="no-padding-dialog"
      :visible.sync="siteDetails"
    >
      <site-details-info></site-details-info>
    </el-dialog>
  </div>
</template>

<script>
import siteDetailsInfo from "./siteDetailsInfo";
export default {
  name: "overviewControl",
  components: {
    siteDetailsInfo
  },
  data() {
    return {
      siteDetails: false,
      //审核最新数据
      auditData: [
        {
          value: "7",
          company: "",
          factor: "PH",
          grade: 1
        },
        {
          value: "20",
          company: "℃",
          factor: "水温",
          grade: 2
        },
        {
          value: "27.2",
          company: "NTU",
          factor: "浊度",
          grade: 3
        },
        {
          value: "0.13",
          company: "mg/L",
          factor: "氨氮",
          grade: 4
        },
        {
          value: "0.13",
          company: "mg/L",
          factor: "总氮",
          grade: 5
        },
        {
          value: "0.13",
          company: "mg/L",
          factor: "总磷",
          grade: 6
        },
        {
          value: "0.2",
          company: "mg/L",
          factor: "溶解氧",
          grade: 6
        },
        {
          value: "0.2",
          company: "μS/cm",
          factor: "电导率",
          grade: 1
        },
        {
          value: "0.2",
          company: "mg/L",
          factor: "高锰酸盐指数",
          grade: 1
        }
      ],
      siteInfo: {
        stationName: "-",
        area: {
          areaName: ""
        },
        basinn: {
          basinnName: "-"
        },
        buildTime: "-",
        stationtype: "-"
      },
      monitorObj: {
        stationState: "",
        primaryPollutant: "",
        targerWaterQuality: "",
        waterQuality: ""
      },
      pList: [],
      realData: {},
      limitShow: false,
      tableHeadData: []
    };
  },
  computed: {
    siteMn: {
      get: function() {
        return this.$store.state.siteMn.stationMn;
      }
    },
    stationMn: {
      get: function() {
        return this.$store.state.siteMn;
      }
    }
  },
  methods: {
    enterLimit() {
      this.limitShow = true;
    },
    leaveLimit() {
      this.limitShow = false;
    },
    setGradeClass(item, type) {
      let grade = item.grade;
      let cls = "";
      let val = "";
      switch (grade) {
        case 1:
          cls = "grade-a";
          val = "Ⅰ类";
          break;
        case 2:
          cls = "grade-a";
          val = "Ⅱ类";
          break;
        case 3:
          cls = "grade-b";
          val = "Ⅲ类";
          break;
        case 4:
          cls = "grade-c";
          val = "Ⅳ类";
          break;
        case 5:
          cls = "grade-d";
          val = "Ⅴ类";
          break;
        case 6:
          cls = "grade-e";
          val = "劣Ⅴ类";
          break;
      }
      if (type === "val") {
        return val;
      } else {
        return cls;
      }
    },
    //去审核
    auditDate() {
      this.$confirm("跳转后不可返回", "是否进入数据审核模块", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$router.push("/dataAudit/data/threelevelAudit");
        })
        .catch(() => {});
    },
    // 获取表头数据
    getTabelHeadData() {
      this.tableHeadData = [];
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.siteInfo.stationCode
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.content.dataList.length == 0) {
              this.tableHeadData = [];
            } else {
              res.data.content.dataList.map((el, index) => {
                this.tableHeadData.push({
                  label: el.monitoring_factor_nm,
                  str: el.cd,
                  unit: el.monitoring_factor_dw
                });
              });
            }
          } else {
            this.tableHeadData = [];
          }
        })
        .catch(error => {
          this.tableHeadData = [];
        });
    }
    // setLev(n){
    //   if(n == '1'){
    //     return 'I类'
    //   }else if(n == '2'){
    //      return 'II类'
    //   }else if(n == '3'){
    //      return 'III类'
    //   }else if(n == '4'){
    //      return 'IV类'
    //   }else if(n == '5'){
    //      return 'V类'
    //   }else if(n == '6'){
    //      return 'I类'
    //   }
    // },
    // I 1 II 2 III 3 IV 4 V 5
  },
  mounted() {
    this.siteInfo = this.stationMn;
    this.realData = this.stationMn.wRealData;
    this.getTabelHeadData();
  },
  created() {}
};
</script>

<style scoped lang="less">
.overview-control {
  height: 466px;
}
.link-btn {
  float: right;
  color: #999999;
  &:hover {
    color: #166bce;
  }
  &:hover {
    color: #0f509c;
  }
}

.modular-wrap {
  border: 1px solid #dce9fa;
  margin-bottom: 8px;
  position: relative;
  .limitBox {
    position: absolute;
    right: 0;
    top: -80px;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .modular-header {
    height: 37px;
    line-height: 36px;
    border-bottom: 1px solid #dce9fa;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 14px;
      color: #333;
      &:before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 3px;
        height: 10px;
        background: #166bce;
        margin-right: 8px;
      }
    }
    .limit {
      font-size: 12px;
      color: #0f80e8;
      cursor: pointer;
    }
  }
  .modular-body {
    min-height: 100px;
    padding: 16px;
  }
  .base-info {
    float: left;
    width: calc(100% - 134px);
    .base-site-icon {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 3px;
      width: 23px;
      height: 29px;
      background: url("../../assets/images/state-icon.png") no-repeat;
      margin-right: 8px;
    }
    .base-site-name {
      font-size: 14px;
      color: #333;
      margin-right: 14px;
    }
    .details-ben {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 3px;
      border: 1px solid #9cb0c9;
      border-radius: 5px;
      font-size: 12px;
      color: #778699;
      padding: 0 6px;
      &:hover {
        color: #166bce;
        border: 1px solid #166bce;
      }
      &:active {
        color: #fff;
        border: 1px solid #166bce;
        background: #166bce;
      }
    }
    .base-info-list {
      & > li {
        float: left;
        width: 60%;
        line-height: 26px;
        color: #333;
      }
      .alitter {
        width: 40%;
      }
    }
  }
  .secondary-title {
    font-weight: 700;
    padding-left: 20px;
    margin-bottom: 10px;
    background: url("../../assets/images/list-icon.png") no-repeat left center;
  }
  .secondary-menu {
    .item {
      display: inline-block;
      vertical-align: top;
      border: 1px solid #cad9eb;
      height: 30px;
      line-height: 28px;
      padding: 0 15px;
      margin-bottom: 7px;
    }
  }
  .base-img {
    float: right;
    width: 134px;
    line-height: 110px;
    height: 110px;
  }
  .alarm-reminder-list {
    & > li {
      border-bottom: 1px solid #dce9fa;
      line-height: 44px;
      padding-left: 8px;
      .name {
        display: inline-block;
        vertical-align: top;
        padding-left: 20px;
        width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: url("../../assets/images/dian_aa_icon.png") no-repeat left
          center;
      }
      .handle-btn {
        float: right;
        color: #999999;
        &:hover {
          color: #166bce;
        }
        &:active {
          color: #0f509c;
        }
      }
    }
    & > li:last-child {
      border: none;
    }
  }
  .warning-reminder-list {
    & > li {
      border-bottom: 1px solid #dce9fa;
      line-height: 44px;
      padding-left: 8px;
      .name {
        display: inline-block;
        vertical-align: top;
        padding-left: 20px;
        width: 500px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: url("../../assets/images/list-icon.png") no-repeat left
          center;
      }
      .operation-btn {
        float: right;
        color: #999999;
        &:hover {
          color: #166bce;
        }
        &:active {
          color: #0f509c;
        }
      }
    }
    & > li:last-child {
      border: none;
    }
  }
  .operation-title {
    padding-bottom: 6px;
    .title {
      padding-left: 20px;
      background: url("../../assets/images/list-icon.png") no-repeat left center;
    }
    .btn-wrap {
      float: right;
    }
    .operation-btn {
      color: #166bce;
      padding: 0 16px;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        top: 4px;
        right: 0;
        width: 1px;
        height: 12px;
        background: #dce9fa;
      }
      &:hover {
        color: #1155a3;
      }
    }
  }
  .operation-text {
    padding-left: 20px;
    line-height: 28px;
    & > span {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 3px;
      width: calc(50% - 4px);
    }
  }
  .monitoring-info {
    border-bottom: 1px solid #dce9fa;
    padding: 14px 16px;
    .monitoring-title {
      font-size: 15px;
      .title {
        color: #333333;
      }
    }
    .monitoring-text {
      .nonFactor {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        span {
          &:first-child {
            img {
              vertical-align: sub;
            }
            color: #868686;
            font-size: 12px;
          }
          &:last-child {
            color: #333333;
            font-size: 13px;
          }
        }
      }
      > span {
        display: inline-block;
        vertical-align: middle;
        background-color: #ecf1f7;
        width: 120px;
        height: 60px;
        margin-bottom: 10px;
        margin-left: 20px;
        text-align: center;
        color: #3c3c3c;
        font-size: 12px;
        i {
          font-style: normal;
          &:first-child {
            display: inline-block;
            padding: 8px 0;
            font-size: 14px;
          }
          &:last-child {
            color: #666666;
          }
        }
      }
    }
    .toolbar {
      float: right;
    }
  }
  .audit-status {
    padding: 14px 16px 0;
    .audit-title {
      font-size: 15px;
      .title {
        color: #333333;
        .audit-icon {
          display: inline-block;
          vertical-align: middle;
          width: 19px;
          height: 18px;
          background: url("../../assets/images/index/s_shenghe_icon.png")
            no-repeat;
        }
      }
    }
    .audit-wrap {
      margin-bottom: 3px;
      padding-left: 26px;
      line-height: 28px;
      & > span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 48px;
      }
      .state-icon {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #c1ccd9;
        margin-right: 6px;
      }
      .state-normal {
        background: #36c25e;
      }
    }
  }
  .audit-data-wrap {
    padding: 0 16px 0;
    .audit-data-title {
      .title {
        padding-left: 20px;
        background: url("../../assets/images/list-icon.png") no-repeat left
          center;
        font-size: 12px;
      }
      .toolbar {
        float: right;
      }
    }
    .audit-data-content {
      .audit-data-list {
        & > li {
          width: 20%;
          text-align: center;
          float: left;
          padding: 10px 0;
          .value {
            font-size: 16px;
            color: #333;
            font-weight: 700;
          }
          .company {
            font-size: 12px;
          }
          .audit-text {
            line-height: 28px;
          }
        }
      }
    }
  }
}
.abnormal-icon,
.site-normal-icon,
.site-offline-icon {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 3px;
  width: 21px;
  height: 21px;
}
.abnormal-icon {
  background: url("../../assets/images/index/abnormal-icon.png") no-repeat;
}
.site-normal-icon {
  background: url("../../assets/images/index/normalSite.png") no-repeat;
}
.site-offline-icon {
  background: url("../../assets/images/index/siteOffline.png") no-repeat;
}
.water-quality {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.typeA {
  background: url("../../assets/images/water_quality_01.png") no-repeat;
  background-size: 100% 100%;
}
.typeB {
  background: url("../../assets/images/water_quality_02.png") no-repeat;
  background-size: 100% 100%;
}
.typeC {
  background: url("../../assets/images/water_quality_03.png") no-repeat;
  background-size: 100% 100%;
}
.typeD {
  background: url("../../assets/images/water_quality_04.png") no-repeat;
  background-size: 100% 100%;
}
.typeE {
  background: url("../../assets/images/water_quality_05.png") no-repeat;
  background-size: 100% 100%;
}
.grade-icon {
  display: inline-block;
  vertical-align: middle;
  width: 10px;
  height: 11px;
  margin: 0 3px 3px;
}
.grade-a {
  background: url("../../assets/images/index/s_yierlei_icon.png") no-repeat;
}
.grade-b {
  background: url("../../assets/images/index/s_sanlei_icon.png") no-repeat;
}
.grade-c {
  background: url("../../assets/images/index/s_silei_icon.png") no-repeat;
}
.grade-d {
  background: url("../../assets/images/index/s_wulei_icon.png") no-repeat;
}
.grade-e {
  background: url("../../assets/images/index/s_liewulei_icon.png") no-repeat;
}
</style>
