<template>
  <div class="site-details-page">
    <ul class="site-link-list" v-if="!hasData">
      <li
        :class="{active: index === selectIndex}"
        :key="index"
        v-for="(item,index) in siteDetailsList"
        @click="tabToggle(item,index)"
      >{{ item.name }}</li>
    </ul>
    <ul class="site-link-list" v-if="hasData">
      <li
        :class="{active: index === selectIndex}"
        :key="index"
        v-for="(item,index) in siteDetailsListTwo"
        @click="tabToggle(item,index)"
      >{{ item.name }}</li>
    </ul>
    <ul>
      <li v-if="sitePenal === 'overviewControl'">
        <overview-control></overview-control>
      </li>
      <li v-if="sitePenal === 'realTimeMonitoring'">
        <real-time-monitoring ref="crealTimeMonitoring" @showwindtitle="onshowwindtitle"></real-time-monitoring>
      </li>
      <li v-if="sitePenal === 'historicalData'">
        <historical-data ref="historicalData"></historical-data>
      </li>
      <li v-if="sitePenal === 'realTimeParam'">
        <real-time-param></real-time-param>
      </li>
      <!--<li v-if = "sitePenal === 'videoMonitor'">
        <video-monitor></video-monitor>
      </li>-->
      <!-- <li v-if = "sitePenal === 'qualityControl'">
        <quality-control></quality-control>
      </li>-->
      <li v-if="sitePenal === 'maintenance'">
        <maintenance></maintenance>
      </li>
      <li v-if="sitePenal === 'dataStatistics'">
        <data-statistics ref="cdataStatistics"></data-statistics>
      </li>
      <li v-if="sitePenal === 'realTimeAlarm'">
        <real-time-alarm ref="realTimeAlarm"></real-time-alarm>
      </li>
      <li v-if="sitePenal === 'pollutionCalendar'">
        <pollution-calendar ref="pollutionCalendar"></pollution-calendar>
      </li>
      <li v-if="sitePenal === 'proportion'">
        <proportion ref="proportion"></proportion>
      </li>
      <li v-if="sitePenal === 'flowmeter'">
        <flowmeter ref="flowmeter" :siteInfo="queryFlowMeterData"></flowmeter>
      </li>
    </ul>
  </div>
</template>

<script>
import realTimeAlarm from "@/views/home/alarm";
import proportion from "@/views/home/proportion";
import pollutionCalendar from "@/views/home/pollutionCalendar";
import overviewControl from "@/views/home/overviewControl";
import realTimeMonitoring from "@/views/home/realTimeMonitoring";
import videoMonitor from "@/views/home/videoMonitor";
import qualityControl from "@/views/home/qualityControl";
import maintenance from "@/views/home/maintenance";
import dataStatistics from "@/views/home/dataStatistics";
import historicalData from "@/views/home/historicalData";
import realTimeParam from "@/views/home/realTimeParam";
import flowmeter from "@/views/home/flowmeter";
let siteDetailsList = [
  {
    name: "管控概览",
    src: "overviewControl"
  },
  // {
  //   name:'实时监控',
  //   src:'realTimeMonitoring'
  // },
  // {
  //   name:'实时参数',
  //   src:'realTimeParam'
  // },
  // {
  //   name:'运维评价',
  //   src:'maintenance'
  // },
  {
    name: "历史数据",
    src: "historicalData"
  },
  {
    name: "实时报警",
    src: "realTimeAlarm"
  },
  {
    name: "污染日历",
    src: "pollutionCalendar"
  },
  {
    name: "水质类别占比",
    src: "proportion"
  }
  /*,{
      name:'视频监控',
      src:'videoMonitor'
    }*/
  // ,{
  //   name:'数据统计',
  //   src:'dataStatistics'
  // }
];
let siteDetailsListTwo = [
  {
    name: "管控概览",
    src: "overviewControl"
  },
  // {
  //   name:'实时监控',
  //   src:'realTimeMonitoring'
  // },
  // {
  //   name:'实时参数',
  //   src:'realTimeParam'
  // },
  // {
  //   name:'运维评价',
  //   src:'maintenance'
  // },
  {
    name: "历史数据",
    src: "historicalData"
  },
  {
    name: "实时报警",
    src: "realTimeAlarm"
  },
  {
    name: "污染日历",
    src: "pollutionCalendar"
  },
  {
    name: "水质类别占比",
    src: "proportion"
  },
  {
    name: "流量计",
    src: "flowmeter"
  }
  /*,{
      name:'视频监控',
      src:'videoMonitor'
    }*/
  // ,{
  //   name:'数据统计',
  //   src:'dataStatistics'
  // }
];
export default {
  name: "siteDetails",
  data() {
    return {
      siteDetailsList,
      siteDetailsListTwo,
      selectIndex: 0,
      sitePenal: "overviewControl",
      equipId: 0,
      siteinfo: [],
      hasData: false,
      queryFlowMeterData: {}
    };
  },
  computed: {
    stationMn: {
      get: function() {
        return this.$store.state.siteMn;
      }
    }
  },
  methods: {
    onshowwindtitle(val) {
      this.siteinfo = val;
      this.$emit("showwindtitle", val);
    },
    tabToggle(item, index) {
      this.selectIndex = index;
      this.sitePenal = item.src;
      let self = this;
    },
    //获取流量计实时数据 GET /yunliBase/queryFlowMeterDataReal
    queryFlowMeterDataReal() {
      let params = {
        mn: this.stationMn.stationCode
      };
      this.$http
        .get("/dataHandle/yunliBase/queryFlowMeterDataReal", {
          params: params
        })
        .then(res => {
          if (res.data.code == 0) {
            let dataInfo = res.data.content.dataList;
            if (dataInfo && dataInfo.length == 1) {
              this.queryFlowMeterData = dataInfo[0];
              this.queryFlowMeterData.stationCode = this.stationMn.stationCode;
              this.hasData = true;
            } else {
              this.queryFlowMeterData = {};
              this.hasData = false;
            }
          }
        });
    },
  },
  mounted() {
    this.queryFlowMeterDataReal()
  },
  components: {
    proportion,
    realTimeAlarm,
    pollutionCalendar,
    overviewControl,
    realTimeMonitoring,
    videoMonitor,
    qualityControl,
    dataStatistics,
    historicalData,
    maintenance,
    realTimeParam,
    flowmeter
  }
};
</script>

<style scoped lang="less">
.site-link-list {
  height: 32px;
  line-height: 30px;
  display: flex;
  li {
    // width: calc(100% / 6);
    // float: left;
    flex: 1;
    text-align: center;
    border-left: 1px solid #d6e3f2;
    border-bottom: 1px solid #d6e3f2;
    position: relative;
    cursor: pointer;
  }
  li:first-child {
    border-left: none;
  }
  li:hover {
    background: #eaeff4;
  }
  li.active {
    color: #166bce;
    border-bottom: 1px solid #fff;
  }
  li.active:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: #166bce;
  }
}
.site-details-scrollbar {
  height: 386px;
}
</style>
