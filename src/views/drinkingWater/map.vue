<template>
  <div class="enterprise-map-wrap2" id="map">
    
  </div>
</template>

<script>
export default {
  name: "airMap",
  components: {},
  props: {
    mapInfo: Array,
    siteName: String,
    mapPattern: String,
    qualityGrade: Boolean
  },
  created() {},
  destroyed() {
    this.selectStations = [];
  },
  mounted() {
    this.initMap();
    // this.loadAirData()
    // this.initScatterEcharts()
  },
  data() {
    return {
      checkList: ["WQ03"],
      togglePanel: false,
      statistics: false,
      checkBoxList: [
        { name: "国控站", label: "WQ03", icon: "icon18" },
        { name: "预警站", label: "WQ05", icon: "icon6" },
        { name: "水质监测", label: "WQ06", icon: "icon7" },
        { name: "排污口", label: "WQ07", icon: "icon4" },
        { name: "加密站", label: "WQ08", icon: "icon1" },
        { name: "溯源站", label: "WQ09", icon: "icon8" },
        { name: "固定站", label: "WQ10", icon: "icon9" },
        { name: "浮船站", label: "WQ11", icon: "icon10" }
      ],
      map: Object,
      stationLayerGroup: Object,
      request: {},
      selectStations: [],
      markers:[],
      selectMap: {},
      waterAir: 1, //1 水  2空气
      aniClass: ""
    };
  },
  methods: {
    changeStationType(values) {
      //let size = values.length;
      if (values) {
        values = values.join(",");
        this.loadWaterMarkers(values);
      } else {
      }
    },
    initMap: function() {
      var map = new YunliMap.Map({
        container: "map",
       // layers: ["xiongan_img"],
        zoom: 10,
        center: [116, 38.9]
      });
      var toolBar = new YunliMap.ToolBar({
        position: "RT",
        offset: [0, 40],
        ruler: true,
        backDefault: true,
        direction: true
      });
      toolBar.addTo(map);

      var amap = new YunliMap.AMapLayer({
        version: "1.4.15",
        gpsCoordinates: true,
        key: "05dfa1f8ec0ebabb6f2fd603bbcfc6f3",
        features: ["bg", "road", "building", "point"], //北京、道路、建筑物、标注
        mapStyle: "whitesmoke"
      });
      map.add(amap);
      this.map = map;
      //this.loadWaterMarkers("WQ03");
    },
    //移除所有选中站点
    removeSelectStations() {
      this.selectStations = [];
    },
    removeMarkers(markers) {
      let map = this.map;
      if(this.infowindow){
        this.infowindow.hide();
      }
      if (markers) {
        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i];
          map.remove(marker);
        }
        this.markers = [];
      }
      },
    //加载水质采样点
    loadWaterMarkers(stationTypes) {
      let _this = this;
      let map = this.map;
      this.removeMarkers(this.markers);
      this.$http
        .get("/dataHandle/yunliBase/getXhWaterData", {
          params: {
            types:stationTypes
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            let clusterData = [];
            var stations = dataJson.content.dataList;
            //this.mapInfo = stations;
            for (let i = 0; i < stations.length; i++) {
              let stationInfo = stations[i];
              let longitude = stationInfo.longitude;
              let latitude = stationInfo.latitude;
              let name = stationInfo.stationName;
              let sType = stationInfo.stationType || "WQ08"; // 站点类型
              let icon = this.queryIcon(sType);
              let marker = new YunliMap.Marker({
                icon: "./static/img/" + icon + ".png",
                position: [longitude, latitude],
                show: true, //非必填
                anchor: "bottom-center", //非必填，可选值:top-left/bottom-left/center-left/baseline-left/top-center/bottom-center/center-center/baseline-center/top-right/bottom-right/center-right/baseline-right
                offset: [0, 0], //非必填
                rotation: 0, //非必填，旋转角度，0-360，单位:度
                width: 24, //非必填
                height: 24, //非必填
                scale: 1 //非必填
              });
              map.add(marker);
              _this.markers.push(marker);
              marker.on("click", function() {
                _this.addOrRemoveSelect(stationInfo);
              });
            }
          }
        });
    },
    addOrRemoveSelect(stationInfo) {
      let stationId = stationInfo.stationId;
      let isRemove = false;
      for (let i = 0; i < this.selectStations.length; i++) {
        const element = this.selectStations[i];
        let id = element.stationId;
        if (id == stationId) {
          isRemove = true;
          this.selectStations.splice(i, 1);
        }
      }
      if (!isRemove) {
        this.selectStations.push(stationInfo);
      };
    
      this.$emit("selectStations",this.selectStations)
    },
    queryIcon(type) {
      if (type == "WQ08") {
        return "jmz";
      }
      if (type == "WQ03") {
        return "gkz";
      }
      if (type == "WQ04") {
        return "skz";
      }
      if (type == "WQ07") {
        return "pwk";
      }
      if (type == "ZS02") {
        return "zsz";
      }
      if (type == "MM01") {
        return "kqz";
      }
      if (type == "WQ01") {
        return "dxs";
      }
      if (type == "WQ05") {
        return "yjz";
      }
      if (type == "WQ06") {
        return "ncs";
      }
      if (type == "WQ09") {
        return "syz";
      }
      if (type == "WQ10") {
        return "gdz";
      }
      if (type == "WQ11") {
        return "fcz";
      }
      if (type == "MT01") {
        return "mt";
      }
      if (type == "SZ01") {
        return "sz";
      }
      if (type == "WQ13") {
        return "rdk";
      }
      if (type == "MM02") {
        return "ycz";
      }
      if (type == "MM03") {
        return "wxz";
      }
      if (type == "TR02") {
        return "trz";
      }
      return "rdk";
    },
    meatureTool(type) {
      let this_ = this;
      this.map.drawFeature(type, {
        isMeasure: true,
        end: function(e) {
          var html = "";
          if (type == "LineString") {
            html = e.length.toFixed(2) + "m";
            this_.$message(html);
          } else if (type == "Polygon") {
            html = e.area.toFixed(2) + "m<sup>2</sup>";
            this_.$message(html);
          }
        }
      });
    },
    //清除
    resetMeatureTool(type) {
      this.map.clearDraw();
    },
    loadFengxqW: function() {
      let me = this;
      let map = this.map;
      this.$http.get("./static/data/xiongan_hole.geojson", this).then(res => {
        YunliMap.loadGeoJson(res.data).forEach(feature => {
          feature.setStyle({
            background: "rgba(6,44,76,0.65)",
            borderColor: "#2e9cfa",
            borderWidth: 2
            //lineDash:[10,5]
          });
          map.add(feature);
        });
      });
    },
    nf(href) {
      window.href = href.href;
    }
  },
  watch: {
    mapInfo: {
      handler(newValue, oldValue) {
        this.loadStationMarkers();
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
.enterprise-map-wrap2 {
  width: 100%;
  float: left;
  height: 100%;
  z-index: 0;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  // border-left: 1px solid #dce2e8;
  background: transparent;
  .toolbar2 {
    float: left;
    z-index: 1999;
    left: 20px;
    top: 20px;
    position: absolute;
    background: #fff;
    padding: 12px;
    width: 500px;
    height: 80px;
    .station {
      font-size: 12px;
      display: inline-block;
      width: 80px;
      height: 18px;
      line-height: 15px;
      vertical-align: -8px;
      overflow: hidden;
      margin-right: 5px;
      background: #ccc;
      margin-bottom: 5px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 5px;
      padding: 2px 5px;
    }
  }

  // background: url("../../assets/home_images/base-map_bg.png") no-repeat;
}
</style>
