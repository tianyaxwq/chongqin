<template>
  <div class="enterprise-map-wrap2" id="map"></div>
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
    // this.loadAirData()
    // this.initScatterEcharts()
  },
  data() {
    return {
      map: Object,
      stationLayerGroup: Object,
      request: {},
      waterAir: 1, //1 水  2空气
      layersObj: {},
      urlb: "http://61.172.115.211:21300",
      airurl: "http://120.77.41.22:21320",
      aniClass: ""
    };
  },
  methods: {
    initMap: function() {
      var map = new YunliMap.Map({
        container: "map",
        zoom: 10,
        center: [116, 38.9]
      });

      var amap = new YunliMap.AMapLayer({
        version: "1.4.15",
        gpsCoordinates: true,
        key: "05dfa1f8ec0ebabb6f2fd603bbcfc6f3",
        features: ["bg", "road", "building", "point"], //北京、道路、建筑物、标注
        mapStyle: "whitesmoke"
      });
      map.add(amap);
      this.map = map;
      var toolBar = new YunliMap.ToolBar({
        position: "RT",
        offset: [0, 40],
        ruler: true,
        backDefault: true,
        direction: true
      });
      toolBar.addTo(map);
      //this.loadFengxqW();
      let _this = this;
      map.on("click", function(){
        if(_this.infowindow){
          _this.infowindow.hide();
        }
      });
    },
    loadStationMarkers() {
      let map = this.map;
      let _this = this;
      for (let i = 0; i < this.mapInfo.length; i++) {
        let data = this.mapInfo[i];
        let lng = data.lng;
        let lat = data.lat;
        let name = data.name || "88888";
        let icon = data.icon;
        let marker = new YunliMap.Marker({
          icon: "./static/img/" + icon + ".png",
          position: [lng, lat],
          offset: [-10, -28], //非必填
          rotation: 0, //非必填，旋转角度，0-360，单位:度
          width: 30, //非必填
          height: 30, //非必填
          scale: 1 //非必填
        });
        map.add(marker);
        let content = this.queryWaterStationContent(data);
        let infowindow = new YunliMap.InfoWindow({
          content: content,
          position: [lng, lat],
          anchor: "bottom-center", //top-left/bottom-left/center-left/middle-left/top-center/bottom-center/center-center/middle-center/top-right/bottom-right/center-right/middle-right
          offset: [0, -32],
          visible: false
        });
        map.add(infowindow);

        infowindow.hide();
        marker.on("click", function(e) {
          if (_this.infowindow) {
            _this.infowindow.hide();
          }
          _this.infowindow = infowindow;
          infowindow.show();
          e.stopPropagation();
          //console.log(e)
        });
        marker.on("mouseout", function() {
          //infowindow.hide();
        });
      }
      //  console.log(this.markers)
      //      marker.on('click',function(){
      //         alert("您点击了点标记");
      //   // marker.off('click');//移除marker下所有click事件
      //      });
    },
    queryWaterStationContent(info) {
      let content = `<div class='map_dialog'>
         <div class="title">
            <span>${info.name + " - 水源地"}</span>
            ${
              info.level == "II"
                ? '<span class="two"></span>'
                : info.level == "I"
                ? '<span class="one"></span>'
                : info.level == "III"
                ? '<span class="three"></span>'
                : info.level == "IV"
                ? '<span class="four"></span>'
                : info.level == "V"
                ? '<span class="five"></span>'
                : info.level == "劣V"
                ? '<span class="six"></span>'
                : ""
            }
         </div>
           <ul class="item-list clearfix">
              <li class="">
                <span class="label-leng">最新时间：${
                  info.lng === "null"
                    ? "-"
                    : '<span class="dataValue">2020-03-19 14:00</span>'
                }</span>
              </li>
              <li class="item">
                <span class="label">首要污染物：${
                  info.lng === "null" ? "-" : "-"
                }</span>
                <span class="label">氨氮：${
                  info.lng === "null" ? "-" : "- ( mg/L)"
                }</span>
              </li>
               <li class="item">
                <span class="label">CODmn：${
                  info.lng === "null" ? "-" : "- ( mg/L)"
                }</span>
                <span class="label">pH：${
                  info.lng === "null" ? "-" : "-（无量纲)"
                }</span>
              </li>
              <li class="item">
                <span class="label">水温：${
                  info.lng === "null" ? "-" : "- ( ℃)"
                }</span>
                <span class="label">溶解氧：${
                  info.lng === "null" ? "-" : "- (mg/L)"
                }</span>
              </li>
               <li class="item">
                <span class="label">电导率：${
                  info.lng === "null" ? "-" : "- ( us/cm)"
                }</span>
                <span class="label">浊度：${
                  info.lng === "null" ? "-" : "- ( NTU)"
                }</span>
              </li>
           </ul>
        </div>`;
      return content;
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
}
.map_dialog {
  top: -15px;
  background: #fff;
  box-shadow: 0px 3px 10px rgba(113, 113, 113, 0.38);
  padding: 10px 20px;
  color: #2f3b4d;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 169px;
    bottom: -33px;
    width: 0px;
    height: 0px;
    border-width: 16px;
    border-style: solid;
    border-color: transparent transparent transparent transparent;
  }
  &::after {
    content: "";
    position: absolute;
    left: 170px;
    bottom: -30px;
    border-width: 15px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
    color: #1f1f1f;
    > span:nth-of-type(2) {
      display: inline-block;
      width: 27px;
    }
    .one {
      background: url(../../assets/images/oneLevel.png) no-repeat center;
    }
    .two {
      background: url(../../assets/images/twoLevel.png) no-repeat center;
    }
    .three {
      background: url(../../assets/images/threeLevel.png) no-repeat center;
    }
    .four {
      background: url(../../assets/images/fourLevel.png) no-repeat center;
    }
    .five {
      background: url(../../assets/images/fiveLevel.png) no-repeat center;
    }
    .six {
      background: url(../../assets/images/sixLevel.png) no-repeat center;
    }
  }
  .item-list {
    li {
      line-height: 29px;
      height: 30px;
      border-bottom: 1px dashed rgba(204, 222, 229, 0.21);
      font-size: 12px;
      &:first-child {
        background: url(../../assets/images/time.png) no-repeat 5px;
      }
      .label-leng {
        padding-left: 25px;
        .dataValue {
          color: #939393;
        }
      }
      .label {
        padding-right: 30px;
        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fff;
          margin-bottom: 3px;
          margin-right: 6px;
        }
      }
      &.item {
        & > span:first-child {
          display: inline-block;
          vertical-align: top;
          width: 50%;
          position: relative;
        }
      }
    }
  }
}
</style>
