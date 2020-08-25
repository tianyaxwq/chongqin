<template>
  <div class="enterprise-map-wrap" id="map"></div>
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
  mounted() {
    this.initMap();
    //  this.loadAirData()
  },
  data() {
    return {
      map: Object,
      stationLayerGroup: Object,
      quZColorObj: {
        // "南桥镇":"#00a1e4",
        // "奉城镇":"#24c768",
        // "庄行镇":"#ff7e00",
        // "金汇镇":"#e5ce10",
        // "四团镇":"#ee2323",
        // "青村镇":"#e5ce10",
        // "柘林镇":"#e5ce10",
        // "海湾镇":"#e5ce10"
        // ,
        // "奉浦社区":"#ff7e00",
        // "上海市奉贤区海湾旅游区":"#ff7e00",
        // "金海社区":"#ff7e00",
        // "上海海港综合经济开发区":"#ff7e00",
      }
    };
  },
  methods: {
    initMap: function() {
      let lat = 22.9155;
      let lng = 113.206;
      let zoom = 12;

      let platformStr = this.toolObj.getCookie("platform");
      if (platformStr) {
        platformStr = JSON.parse(platformStr);
        lat = platformStr.lat || 22.9155;
        lng = platformStr.lng || 113.206;
        zoom = platformStr.zoom || 12;
      }
      let map = L.map("map", {
        attributionControl: false,
        zoomControl: false,
        minZoom: 6,
        crs: L.CRS.EPSG4326
      }).setView([lat, lng], zoom);
      // let tileAddress = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
      // L.tileLayer(tileAddress, {
      //   maxZoom: 18,
      //   id: 'mapbox.streets'
      // }).addTo(map);
      //  L.supermap.tiandituTileLayer({layerType: "img"}).addTo(map);
      this.map = map;
      // let url ="http://support.supermap.com.cn:8090/iserver/services/map-china400/rest/maps/China_4326";
      // L.supermap.tiledMapLayer(url).addTo(map);
      this.queryClientIP();
      //站点图层组
      var stationLayerGroup = new L.LayerGroup();
      //站点名称图层组
      var stationNameLayerGroup = new L.LayerGroup();
      this.stationLayerGroup = stationLayerGroup;
      this.stationNameLayerGroup = stationNameLayerGroup;
      this.map.addLayer(stationLayerGroup);
      this.map.addLayer(stationNameLayerGroup);
      //this.loadFengxqW();
      //this.loadFengxqWXZ();
      //this.initThemeLayer();
    },
    //判断是否启用天地图
    queryClientIP() {
      // L.supermap.cloudTileLayer("http://t2.supermapcloud.com/FileService/image").addTo(this.map);
      this.baseLayer = L.supermap
        .tiandituTileLayer({
          layerType: "vec",
          url:
            "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
        })
        .addTo(this.map);
      L.supermap
        .tiandituTileLayer({
          isLabel: true,
          url:
            "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
        })
        .addTo(this.map);
      //  document.write(returnCitySN["cip"]+','+returnCitySN["cname"]);
    },
    /**
     * 切换底图
     */
    changeBaseLayer: function(type) {},
    initThemeLayer: function() {
      let themeLayer = L.supermap
        .labelThemeLayer("ThemeLayer", {
          opacity: 1,
          isAllowFeatureStyle: true
        })
        .addTo(this.map);
      // this.map.addLayer(themeLayer);
      this.themeLayer = themeLayer;
      // this.themeLayer.setOpacity(1);
      this.themeLayer.style = new SuperMap.ThemeStyle({
        labelRect: true,
        fontColor: "#000000",
        fontWeight: "bolder",
        fontSize: "18px",
        fill: true,
        fillColor: "#FFFFFF",
        fillOpacity: 1,
        stroke: false,
        strokeColor: "#8B7B8B"
      });
      //用于专题图的属性字段名称
      this.themeLayer.themeField = "wqlindex";
      //风格数组，设定值对应的样式
      this.themeLayer.styleGroups = [
        {
          start: 0,
          end: 51,
          style: {
            fillColor: "#6ACD06",
            fontSize: "17px"
          }
        },
        {
          start: 51,
          end: 101,
          style: {
            fillColor: "#FBD12A",
            fontSize: "19px"
          }
        },
        {
          start: 101,
          end: 151,
          style: {
            fillColor: "#FE8800",
            fontSize: "22px"
          }
        },
        {
          start: 151,
          end: 201,
          style: {
            fillColor: "#FF0000",
            fontSize: "24px"
          }
        },
        {
          start: 201,
          end: 301,
          style: {
            fillColor: "#CC0000",
            fontSize: "26px"
          }
        },
        {
          start: 301,
          end: 601,
          style: {
            fillColor: "#960453",
            fontSize: "28px"
          }
        }
      ];
      //  themeLayer.on("mousemove", handleMouseOver);

      // this.addThemeFeatures();
    },
    addThemeFeatures: function() {
      var labelFeatures = [];
      var feat;
      let themeData = this.mapInfo;
      for (var i = 0; i < themeData.length; i++) {
        let lng = parseFloat(this.mapInfo[i].lng);
        let lat = parseFloat(this.mapInfo[i].lat);
        var text = themeData[i].wqlindex;
        feat = L.supermap.themeFeature([lat, lng, text], themeData[i]);
        labelFeatures.push(feat);
      }
      this.themeLayer.addFeatures(labelFeatures);
    },
    /**
     * 隐藏或者显示站点名称
     * @param op 透明度
     */
    hideShowStationName: function(op) {
      this.stationNameLayerGroup.eachLayer(function(layer) {
        layer.setOpacity(op);
      });
    },
    /**
     * 直观与常规切换 op  1直观 0 常规
     * */
    cgzhiguanChange: function(op) {
      let sop = 1;
      //直观
      if (op == 1) {
        sop = 0;
        this.addThemeFeatures();
      } else {
        this.themeLayer.removeAllFeatures();
      }
      this.stationLayerGroup.eachLayer(function(layer) {
        layer.setOpacity(sop);
      });
    },
    //加载奉贤区网格
    loadFengxqW: function() {
      this.$http.get("./static/data/fengxq.json").then(res => {
        L.geoJSON(res.data, {
          style: function(feature) {
            return { fillColor: "red", fillOpacity: 0 };
          }
        }) /*.bindPopup(function (layer) {
            return  layer.feature.properties.name;
          })*/
          .addTo(this.map);
      });
    },
    //加载奉贤区子乡镇网格
    loadFengxqWXZ: function() {
      var me = this;
      if (me.zwgLayer) {
        me.zwgLayer.remove();
      }
      this.$http.get("./static/data/fengxqz.json").then(res => {
        var zwgLayer = L.geoJSON(res.data, {
          style: function(feature) {
            return {
              fillColor: me.quZColorObj[feature.properties.name],
              fillOpacity: 0.56,
              weight: 2,
              dashArray: "5 5"
            };
          }
        }).addTo(this.map);
        // zwgLayer.setStyle({
        //   fillOpacity:0,
        //   opacity:0
        // })
        me.zwgLayer = zwgLayer;
      });
    },
    /**
     * 显示或者隐藏区域水质等级
     * @param op 1显示  0 隐藏
     */
    hideShowQYWG: function(op) {
      let style = {};
      //显示
      if (op) {
        style = {
          fillOpacity: 0.56,
          opacity: 1
        };
      } else {
        style = {
          fillOpacity: 0,
          opacity: 0
        };
      }
      this.zwgLayer.setStyle(style);
    },
    loadAirData: async function() {
      this.markerSetup();
    },
    /**
     * 企业图标绘制
     */
    childMothed(equipId) {
      this.$emit("childMethod", equipId);
    },
    markerSetup: function() {
      this.stationLayerGroup.clearLayers();
      let _this = this;
      for (let i = 0; i < this.mapInfo.length; i++) {
        let stationInfo = this.mapInfo[i];
        let longitude = parseFloat(stationInfo.lng);
        let latitude = parseFloat(stationInfo.lat);

        //图片icon
        let sType = stationInfo.category; // 站点类型
        let cValue = stationInfo.grade; // 污染等级
        let airIcon = this.airIconCreate(sType, cValue); //根据等级确定站点点位图标颜色
        let airMarker = L.marker([latitude, longitude], { icon: airIcon }); //.addTo(this.map)

        airMarker.on("click", function(e) {
          _this.childMothed(stationInfo.equipId);
        });

        //站点图标的扩散动画
        var grade = stationInfo.grade; //等级
        var classAni = this.aniStationGrade(grade);
        var aniIcon = L.divIcon({
          html:
            "<div class='circle-animationA'></div><div class='circle-animationB'></div>",
          className: classAni,
          iconSize: [60, 60],
          iconAnchor: [30, 30]
        });
        let aniMarker = L.marker([latitude, longitude], { icon: aniIcon });
        this.stationLayerGroup.addLayer(aniMarker);

        this.stationLayerGroup.addLayer(airMarker);
        airMarker.popupAnchor = [0, -10];
        var text = stationInfo.name;
        var content = this.getStationTemplateC(stationInfo);

        var myIcon = L.divIcon({
          html: text,
          className: "my-div-icon",
          iconSize: [120, 12],
          iconAnchor: [12, 31]
        });
        let textMarker = L.marker([latitude, longitude], { icon: myIcon });
        this.stationNameLayerGroup.addLayer(textMarker);
      }
    },
    pulseIconCreate() {
      return L.icon.pulse({
        iconSize: [22, 22],
        iconUrl: "./static/img/map_Location_gong_04.png",
        color: "#2f8"
      });
    },
    /**
     * 获取超标污染的站点扩散动画class
     * */
    aniStationGrade(grade) {
      switch (grade) {
        case 1:
          return "alarm-animation-wrapA";
        case 2:
          return "alarm-animation-wrapB";
        case 3:
          return "alarm-animation-wrapC";
        case 4:
          return "alarm-animation-wrapD";
        case 5:
          return "alarm-animation-wrapE";
        case 6:
          return "alarm-animation-wrapE";
      }
    },
    /**
     * 获取站点类型icon的标识
     * @param type 0 公 1 境..
     * */
    iconStationType: function(type) {
      switch (type) {
        case "地表水信息公开断面":
          return "gong";
        case "地表水出入境断面":
          return "jing";
        case "地表水区控监测断面":
          return "qu";
        case "地表水三年行动计划监测断面":
          return "xing";
        case "区级饮用水源地断面":
          return "yin";
        case "地表水镇级监测断面":
          return "zhen";
        case "地表水自动监测站":
          return "zi";
      }
    },
    airIconCreate(type, airValue) {
      var iconT = this.iconStationType(type);
      switch (airValue) {
        case 1: //一二类
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_01.png",
            iconSize: [24, 31]
          });
        case 2: //一二类
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_01.png",
            iconSize: [24, 31]
          });
        case 3: // 三类
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_02.png",
            iconSize: [24, 31]
          });
        case 4:
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_03.png",
            iconSize: [24, 31]
          });
        case 5:
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_04.png",
            iconSize: [24, 31]
          });
        case 6:
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_05.png",
            iconSize: [24, 31]
          });
        case 0: //离线
          return L.icon({
            iconUrl: "./static/img/map_Location_" + iconT + "_06.png",
            iconSize: [24, 31]
          });
      }
    },
    /**
     * 获取站点弹出框html
     * @param station
     */
    getStationTemplateC: function(station) {
      return station.name;
    },
    airMarkerColorSetup(value) {
      switch (value) {
        case 0:
          return "airLevelOffline";
        case 1:
          return "airLevelOne";
        case 2:
          return "airLevelTwo";
        case 3:
          return "airLevelThree";
        case 4:
          return "airLevelFour";
        case 5:
          return "airLevelFive";
        case 6:
          return "airLevelSix";
      }
    },
    nf(href) {
      window.href = href.href;
    },
    timeFormat: function(originTime) {
      let day = originTime.substring(8, 10);
      let hour = originTime.substring(11, 13);
      let time = day + "日" + " " + hour + "时";
      return time;
    }
  },
  watch: {
    mapInfo: {
      handler(newValue, oldValue) {
        this.loadAirData();
      },
      deep: true
    },
    siteName: {
      handler(newValue, oldValue) {
        let opacity = 1;
        if (newValue == "隐藏站点名称") {
          opacity = 0;
        } else if (newValue == "显示站点名称") {
          opacity = 1;
        }
        this.hideShowStationName(opacity);
      }
    },
    mapPattern: {
      handler(newValue, oldValue) {
        let opacity = 1;
        if (newValue == "直观") {
          opacity = 1;
        } else if (newValue == "常规") {
          opacity = 0;
        }
        this.cgzhiguanChange(opacity);
      }
    },
    qualityGrade: {
      handler(newValue, oldValue) {
        this.hideShowQYWG(newValue);
      }
    },
    quZColorObj: {
      handler(newValue, oldValue) {
        var me = this;
        if (this.zwgLayer) {
          this.zwgLayer.eachLayer(function(layer) {
            //   console.log( me.quZColorObj[layer.feature.properties.name])
            //    console.log(layer)
            layer.setStyle({
              fillColor: me.quZColorObj[layer.feature.properties.name]
            });
            //  layer.options.fillColor =  me.quZColorObj[layer.feature.properties.name];
            // layer.redraw();
          });
        }
      }
    }
  }
};
</script>

<style lang="less">
.enterprise-map-wrap {
  width: 100%;
  float: left;
  height: 100%;
  border-left: 1px solid #dce2e8;
}

.my-div-icon {
  color: #8f51e8;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
}

.legendContainer {
  left: 0;
  position: fixed;
  bottom: 20px;
  width: 100%;
  height: 34px;
  display: flex;
  justify-content: center;
}

.airLevelOffline {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #c1ccd9;
}

.airLevelOne {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #00e400;
  text-align: center;
}

.airLevelTwo {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #edc24a;
}

.airLevelThree {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #ff7e00;
}

.airLevelFour {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #ff0000;
}

.airLevelFive {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #990000;
}

.airLevelSix {
  width: 35px;
  height: 20px;
  color: white;
  line-height: 20px;
  background: #7e0000;
}

.infoWindow {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: space-around;
}

.top-section {
  display: flex;
  align-items: center;
  flex-basis: 100%;
  justify-content: space-around;
}

.address {
  color: #1a1a1a;
  font-size: 16px;
}

.level {
  color: #ffffff;
  flex-basis: 70px;
  text-align: center;
  background-color: #00e400;
}

.bottom-section {
  display: flex;
  flex-basis: 100%;
  justify-content: space-around;
}

.time {
  color: #666666;
  font-size: 13px;
  align-self: flex-start;
}

.aqi {
  padding-left: 5px;
}

/* 地图报警动画与样式 */
.alarm-animation-wrapA {
  .circle-animationA {
    background: rgba(0, 161, 228, 0.46);
  }
  .circle-animationB {
    background: rgba(0, 161, 228, 0.46);
  }
}
.alarm-animation-wrapB {
  .circle-animationA {
    background: rgba(36, 199, 104, 0.46);
  }
  .circle-animationB {
    background: rgba(36, 199, 104, 0.46);
  }
}
.alarm-animation-wrapC {
  .circle-animationA {
    background: rgba(229, 206, 16, 0.46);
  }
  .circle-animationB {
    background: rgba(229, 206, 16, 0.46);
  }
}
.alarm-animation-wrapD {
  .circle-animationA {
    background: rgba(255, 126, 0, 0.46);
  }
  .circle-animationB {
    background: rgba(255, 126, 0, 0.46);
  }
}
.alarm-animation-wrapE {
  .circle-animationA {
    background: rgba(255, 0, 0, 0.46);
  }
  .circle-animationB {
    background: rgba(255, 0, 0, 0.46);
  }
}
.circle-animationA {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  top: 0;
  left: 0;
  -webkit-animation: twinkling 2.1s infinite ease-in-out;
  animation: twinkling 2.1s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.circle-animationB {
  position: absolute;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  top: 9px;
  left: 9px;
  -webkit-animation: twinkling 2.1s infinite ease-in-out;
  animation: twinkling 2.1s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes twinkling {
  0% {
    opacity: 0.2;
    filter: alpha(opacity=20);
    -webkit-transform: scale(1);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=50);
    -webkit-transform: scale(1.12);
  }
  100% {
    opacity: 0.2;
    filter: alpha(opacity=20);
    -webkit-transform: scale(1);
  }
}
@keyframes twinkling {
  0% {
    opacity: 0.2;
    filter: alpha(opacity=20);
    -webkit-transform: scale(1);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=50);
    -webkit-transform: scale(1.12);
  }
  100% {
    opacity: 0.2;
    filter: alpha(opacity=20);
    -webkit-transform: scale(1);
  }
}
</style>
