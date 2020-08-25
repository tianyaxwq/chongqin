<template>
  <div class="overview-control">
    <el-scrollbar style="height: 100%">
      <div style="padding: 7px;">
        <div class="modular-wrap">
          <div class="modular-header">
            <span class="title">实时数据</span>
          </div>
          <div class="modular-body">
            <div class="modular-row clear">
              <div class="base-info">
                <div class="base-title">
                  <i class="base-site-icon"></i>
                  <span class="base-site-name">{{ siteInfo.stnm || "--" }}</span>
                </div>
                <ul class="base-info-list">
                  <li>
                    水&emsp;&emsp;位：
                    {{ siteInfo.water_level || "--" }}m
                  </li>
                  <li class="alitter">
                    设备地址：
                    {{ siteInfo.device_addr || "--" }}
                  </li>
                  <li>
                    瞬间流量：
                    {{siteInfo.instant_flow || "--" }}m³/s
                  </li>
                  <li class="alitter">
                    正向累计流量：
                    {{ siteInfo.pos_total_flow || "--" }}m³
                  </li>
                  <li>反向累计流量：{{ siteInfo.nag_total_flow || "--"}}m³</li>
                  <li class="alitter">
                    过水面积：
                    {{siteInfo.pass_water_area || '--'}}㎡
                  </li>
                  <li>平均流速：{{speed_of_avg || "--"}}m/s</li>
                  <li class="alitter">
                    数据写入时间：
                    {{ siteInfo.insert_time || "--" }}
                  </li>
                </ul>
              </div>
              <div class="base-img">
                <img src="../../assets/images/index/site-icon.png" />
              </div>
            </div>
          </div>
        </div>
        <div class="modular-wrap">
          <div class="modular-header">
            <span class="title">历史数据</span>
          </div>
          <div class="modular-body" style="padding: 0">
            <div class="monitoring-info">
              <div class="toolbar-wrap">
                <span>时间段：</span>
                <div class="layoutBox" style="width: 360px;">
                  <sl-date-picker
                    v-model="flowHistoryDate"
                    type="date"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></sl-date-picker>
                </div>&emsp;
                <el-button @click="getFlowHistoryDate">
                  <i class="iconfont icon-sousuo"></i> 查询
                </el-button>&emsp;
              </div>
              <div class="table-wrap" style="margin-top: 20px">
                <el-table border :data="flowTableData" style="width: 100%;" height="208px">
                  <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                  <!-- <el-table-column
                    prop="device_addr"
                    :show-overflow-tooltip="true"
                    label="设备地址"
                    align="center"
                  ></el-table-column> -->
                  <el-table-column
                    label="监测时间"
                    width="180"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="insert_time"
                  ></el-table-column>
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
                <div class="paginationBox">
                  <el-pagination
                    @size-change="flowpaginationSizeChange"
                    @current-change="flowpaginationChange"
                    :current-page.sync="flowParams.currentPage"
                    :page-size="flowParams.pageSize"
                    background
                    :small="true"
                    popper-class="select-common-option"
                    :page-sizes="flowPageList"
                    layout="total,sizes,slot,->,prev, pager, next, jumper"
                    :total="flowTotalRecords"
                  >
                    <span class="el-pagination__current">
                      当前第{{ flowParams.currentPage }}/{{
                      flowTotalPage
                      }}页
                    </span>
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "overviewControl",
  props: ["siteInfo"],
  data() {
    return {
      flowHistoryDate: "",
      flowTableData: [],
      flowParams: {
        pageSize: 10,
        currentPage: 1
      },
      flowTotalRecords: 0,
      flowPageList: [10, 15, 20]
    };
  },
  computed: {
    flowTotalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.flowTotalRecords / this.flowParams.pageSize);
      return number === 0 ? "1" : number;
    }
  },
  methods: {
    flowpaginationSizeChange(val) {
      this.flowParams.pageSize = val;
      this.getFlowHistoryDate();
    },
    flowpaginationChange(val) {
      this.flowParams.currentPage = val;
      this.getFlowHistoryDate();
    },
    getFlowHistoryDate() {
      this.flowTableData = [];
      let params = {
        mn: this.siteInfo.stationCode,
        startTime: this.flowHistoryDate
          ? new Date(this.flowHistoryDate[0]).format("yyyy-MM-dd")
          : "",
        endTime: this.flowHistoryDate
          ? new Date(this.flowHistoryDate[1]).format("yyyy-MM-dd")
          : "",
        pageSize: this.flowParams.pageSize,
        pageNum: this.flowParams.currentPage
      };
      this.$http
        .get("/dataHandle/yunliBase/queryFlowMeterDataHisPage", {
          params: params
        })
        .then(res => {
          if (res.data.code == 0) {
            let dataInfo = res.data.content.info.list;
            this.flowTableData = dataInfo;
            this.flowTotalRecords = res.data.content.info.totalRecords;
          }
        });
    }
  },
  mounted() {
    this.getFlowHistoryDate();
  },
  created() {
    let startTime = new Date(new Date().getTime() - 3600 * 1000 * 24 * 7);
    let endTime = new Date(new Date().getTime());
    this.flowHistoryDate = [startTime, endTime];
  }
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
