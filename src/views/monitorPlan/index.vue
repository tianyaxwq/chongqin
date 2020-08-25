<template>
  <div class="monitorplanPage" v-if="this.$store.state.showMoniReportlist">
    <el-carousel :autoplay="false" style="height:100%">
      <el-carousel-item v-for="(item,key) in reportList" :key="key">
        <div class="listContent">
          <div class="list">
            <ul>
              <li v-for="(v,i) in item.list" :key="i" :class="v.iconClass" @click="toRouter(v)"></li>
            </ul>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="monitorplanPage" v-else>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      reportList: [
        {
          list: [
            { name: "饮用水源地", url: "", iconClass: "yysydIcon" },
            {
              name: "重要水功能监测",
              url: "/monitorPlan/waterFuncMonitor",
              iconClass: "zysgnjcIcon"
            },
            { name: "地表水水质", url: "", iconClass: "dbsszIcon" },
            {
              name: "流域水质监测",
              url: "/monitorPlan/bydWaterMonitor",
              iconClass: "lyszjcIcon"
            },
            {
              name: "声环境质量监测",
              url: "/monitorPlan/voiceEnvMonitor",
              iconClass: "shjzljcIcon"
            },
            { name: "土壤环境质量监测", url: "", iconClass: "trhjzljcIcon" },
            { name: "重点县城考核", url: "", iconClass: "zdxckhIcon" },
            { name: "农村环境质量", url: "", iconClass: "nchjzlIcon" },
            {
              name: "农村生活污水处理",
              url: "/monitorPlan/countryWasteWater",
              iconClass: "ncshwsclIcon"
            },
            {
              name: "万人千吨水源地",
              url: "/monitorPlan/thousTonWaterarea",
              iconClass: "wrqdsydIcon"
            }
          ]
        },
        {
          list: [
            { name: "60个点加密监测", url: "", iconClass: "jmjcIcon" },
            { name: "白洋淀内源监测", url: "", iconClass: "bydnyjcIcon" },
            { name: "监督性管理", url: "", iconClass: "jdxglIcon" },
            { name: "入河入淀排污口", url: "", iconClass: "rhrdpwkIcon" },
            { name: "生态补水监测", url: "", iconClass: "stbsjcIcon" },
            { name: "生活垃圾", url: "", iconClass: "shljIcon" },
            { name: "其他", url: "", iconClass: "qtIcon" }
          ]
        }
      ]
    };
  },
  created() { },
  methods: {
    toRouter(v) {
      if (v.url == "") {
        return false;
      } else {
        this.$store.commit("setshowMoniReportlist", false);
        this.$router.push(v.url);
      }
    }
  },
 
};
</script>

<style lang="less" scoped>
.monitorplanPage {
  height: 100%;
  .listContent {
    height: 100%;
    padding: 80px 0;
    .list {
      height: 100%;
      width: 1200px;
      margin: 0 auto;
      position: relative;
      ul {
        width: 100%;
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-177px);
      }
      li {
        display: inline-block;
        width: 144px;
        height: 144px;

        margin-right: 120px;
        margin-bottom: 60px;
        cursor: pointer;
        &:nth-child(5n) {
          margin-right: 0px;
        }
        &:nth-child(6),
        &:nth-child(7),
        &:nth-child(8),
        &:nth-child(9),
        &:nth-child(10) {
          margin-bottom: 0px;
        }
      }

      .yysydIcon {
        background: url("../../assets/images/stationIcon/yysydIcon.png");
        background-size: 100% 100%;
      }
      .zysgnjcIcon {
        background: url("../../assets/images/stationIcon/zysgnjcIcon.png");
        background-size: 100% 100%;
      }
      .dbsszIcon {
        background: url("../../assets/images/stationIcon/dbsszIcon.png");
        background-size: 100% 100%;
      }
      .lyszjcIcon {
        background: url("../../assets/images/stationIcon/lyszjcIcon.png");
        background-size: 100% 100%;
      }
      .shjzljcIcon {
        background: url("../../assets/images/stationIcon/shjzljcIcon.png");
        background-size: 100% 100%;
      }
      .trhjzljcIcon {
        background: url("../../assets/images/stationIcon/trhjzljcIcon.png");
        background-size: 100% 100%;
      }
      .zdxckhIcon {
        background: url("../../assets/images/stationIcon/zdxckhIcon.png");
        background-size: 100% 100%;
      }
      .nchjzlIcon {
        background: url("../../assets/images/stationIcon/nchjzlIcon.png");
        background-size: 100% 100%;
      }
      .ncshwsclIcon {
        background: url("../../assets/images/stationIcon/ncshwsclIcon.png");
        background-size: 100% 100%;
      }
      .wrqdsydIcon {
        background: url("../../assets/images/stationIcon/wrqdsydIcon.png");
        background-size: 100% 100%;
      }
      .jmjcIcon {
        background: url("../../assets/images/stationIcon/jmjcIcon.png");
        background-size: 100% 100%;
      }
      .bydnyjcIcon {
        background: url("../../assets/images/stationIcon/bydnyjcIcon.png");
        background-size: 100% 100%;
      }
      .jdxglIcon {
        background: url("../../assets/images/stationIcon/jdxglIcon.png");
        background-size: 100% 100%;
      }
      .rhrdpwkIcon {
        background: url("../../assets/images/stationIcon/rhrdpwkIcon.png");
        background-size: 100% 100%;
      }
      .stbsjcIcon {
        background: url("../../assets/images/stationIcon/stbsjcIcon.png");
        background-size: 100% 100%;
      }
      .shljIcon {
        background: url("../../assets/images/stationIcon/shljIcon.png");
        background-size: 100% 100%;
      }
      .qtIcon {
        background: url("../../assets/images/stationIcon/qtIcon.png");
        background-size: 100% 100%;
      }
    }
  }
}
</style>
