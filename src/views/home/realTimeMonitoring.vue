<template>
  <!--实时监测-->
  <div class="real-time-monitoring">
    <el-scrollbar style="height: 100%">
      <div v-if="!maximization" style="padding: 7px">
        <div class="modular-wrap">
          <div class="modular-header">
            <span class="title">系统集成</span>
            <div class="header-toolbar">
              <el-button type="secondBtn">远程巡视</el-button>
              <el-button type="secondBtn">运维录入</el-button>
              <el-button style="margin: 0;" type="secondBtn">工况模拟</el-button>
            </div>
          </div>
          <div class="modular-body clear">
            <div class="system-integration">
              <div class="subtitle">联网现状：{{realStationMoin.state}}</div>
              <div class="center">
                <div class="item">
                  <span>系统运行状态：{{realStationMoin.gzState}}</span>&emsp;
                  <!-- <div class="layoutBox" style="width:140px">
                    <el-select v-model="countercontrol" multiple collapse-tags placeholder="请选择">
                      <el-option
                        v-for="item in optionData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>&emsp;
                  <el-button type="secondBtn">远程反控</el-button> -->
                </div>
                <p class="item">今日数据联网率：{{realStationMoin.netlv}}</p>
                <p class="item">昨日数据有效率：{{realStationMoin.valv}}</p>
              </div>
              <div class="subtitle">动力环境数据</div>
              <div class="center">
                <!-- <span class="en-item">温度（18℃）</span>
                <span class="en-item">湿度（23.2%RH）</span>
                <span class="en-item">压力（101Kpa）</span> -->
              </div>
            </div>
            <div class="video-surveillance">
              <div class="video-box"></div>
              <div class="video-control">
                <span class="name">视频监控</span>
                <div class="toolbar">
                  <span class="toolbar-btn" title="一屏">
                    <i class="iconfont icon-yiping"></i>
                  </span>
                  <span class="toolbar-btn" title="二屏">
                    <i class="iconfont icon-liangping"></i>
                  </span>
                  <span class="toolbar-btn" title="三屏">
                    <i class="iconfont icon-sanping"></i>
                  </span>
                  <span class="toolbar-btn" title="四屏">
                    <i class="iconfont icon-siping"></i>
                  </span>
                  <span class="toolbar-btn" title="九屏">
                    <i class="iconfont icon-jiuping"></i>
                  </span>
                  <span class="toolbar-btn" title="最大化" @click="maximization = true;">
                    <i class="iconfont icon-quanping"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modular-wrap">
          <div class="modular-header">
            <span class="title">监测仪器</span>
             <el-button type="secondBtn" @click="gotoRemote" style="margin-top: 7px;vertical-align: middle;margin-right: 0;float:right">远程反控</el-button>
          </div>
          <div class="modular-body">
            <ul class="monitoring-list clear">
              <li v-for="(item,index) in monitoringList" :key="index">
                <div class="info-header">
                  <span>{{ item.name }}</span>
                </div>
                <div class="info-body">
                  <el-scrollbar style="height: 100%;">
                    <p v-for="(n) in item.list" class="item">{{ n.name }}：{{ n.value }}</p>
                  </el-scrollbar>
                </div>
                <!-- <div class="info-footer" v-if="item.code">
                  <div class="layoutBox" style="width:134px">
                    <el-select v-model="countercontrol" multiple collapse-tags placeholder="请选择">
                      <el-option
                        v-for="item in optionData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                 
                </div> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="maximization">
        <video-monitor @exitFullScreen="exitFullScreen"></video-monitor>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import videoMonitor from "@/views/home/videoMonitor";
export default {
  name: "realTimeMonitoring",
  components: {
    videoMonitor
  },
  data() {
    return {
      realStationMoin:{},
      countercontrol: "",
      remoteCountercontrol: "",
      optionData: [],
      monitoringList: [
       
      ],
      maximization: false
    };
  },
  mounted() {
    this.searchcolumn();
    this.queryStationRealMoin();
  },
  computed: {
    siteMn: {
      get: function() {
        return this.$store.state.siteMn.stationMn;
      }
    }
  },
  methods: {
    gotoRemote(){
      this.$router.push('/qualityControl/yccontrol/newRemoteControl')
    },
    //推出全屏
    exitFullScreen() {
      this.maximization = false;
    },
    queryStationRealMoin() {
      this.$http
        .get("/Receiving/queryStationRealMoin", {
          params: {
            mn: this.siteMn
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            this.realStationMoin = dataJson.content.info;
            //this.dataSearch();
          }
        })
        .catch(error => {});
    },
    searchcolumn() {
      this.$http
        .get("/Receiving/queryEquipmentInfosByh", {
          params: {
            mn: this.siteMn
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            this.monitoringList = dataJson.content.info;
            //this.dataSearch();
          }
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped lang="less">
.real-time-monitoring {
  height: 466px;
}
.modular-wrap {
  border: 1px solid #dce9fa;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
  .modular-header {
    height: 37px;
    line-height: 36px;
    border-bottom: 1px solid #dce9fa;
    padding: 0 16px;
    .title {
      font-size: 14px;
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
    .header-toolbar {
      float: right;
    }
  }
  .modular-body {
    min-height: 100px;
    padding: 8px;
  }
  .system-integration {
    float: left;
    width: calc(100% - 294px);
    padding-left: 8px;
    .subtitle {
      line-height: 32px;
      padding-left: 22px;
      background: url("../../assets/images/list-icon.png") no-repeat left center;
    }
    .item {
      padding-left: 20px;
      line-height: 26px;
    }
    .en-item {
      display: inline-block;
      vertical-align: top;
      height: 30px;
      line-height: 28px;
      text-align: center;
      font-size: 12px;
      padding: 0 14px;
      border: 1px solid #cad9eb;
    }
  }
  .video-surveillance {
    float: right;
    width: 294px;
    height: 200px;
    background: #616e7e;
    .video-box {
      height: calc(100% - 24px);
      background: #282a2b;
    }
    .video-control {
      height: 24px;
      .name {
        color: #fff;
        line-height: 24px;
        padding-left: 10px;
        font-size: 12px;
      }
      .toolbar {
        float: right;
        line-height: 24px;
        color: #fff;
        padding-right: 6px;
      }
      .toolbar-btn {
        margin: 0 2px;
        cursor: pointer;
        &:hover {
          color: #becfe6;
        }
      }
    }
  }
}
.monitoring-list {
  & > li {
    border: 1px solid #cad9eb;
    float: left;
    height: 284px;
    margin-right: 8px;
    width: calc(33.3% - 8px);
    .info-header {
      height: 37px;
      line-height: 36px;
      text-align: center;
      border-bottom: 1px solid #d5e4f5;
      font-weight: 700;
      background: #ebf2f7 url("../../assets/images/index/s_yiqi_bg.png")
        no-repeat;
      background-size: 100% 100%;
    }
    .info-body {
      height: calc(100% - 84px);
      padding: 0 12px;
      .item {
        line-height: 24px;
        font-size: 12px;
        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 3px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #166bce;
          margin-right: 10px;
        }
      }
    }
    .info-footer {
      height: 47px;
      margin: 0 12px;
      border-top: 1px dashed #c7d8ee;
      padding-top: 8px;
    }
  }
}
</style>
