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
  destroyed() {
    this.removeMarkers(this.textMarkers);
  },
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
      markers: [],
      zhiGuiMarkers: [],
      textMarkers: [], //文本标注
      urlb: "http://61.172.115.211:21300",
      airurl: "http://120.77.41.22:21320",
      aniClass: ""
    };
  },
  methods: {
    initMap: function() {
      var map = new YunliMap.Map({
        container: "map",
        layers:["xiongan_river_line"],
        zoom: 11,
        center: [116, 38.9]
      });

      var amap = new YunliMap.AMapLayer({
        version: "1.4.15",
        gpsCoordinates: true,
        key: "05dfa1f8ec0ebabb6f2fd603bbcfc6f3",
        features: ["bg", "road", "building", "point"], //北京、道路、建筑物、标注
        mapStyle: "whitesmoke"
      });
      //  map.add(amap);
      this.map = map;
      var toolBar = new YunliMap.ToolBar({
        position: "LT",
        offset: [0, 10],
        ruler: true,
        backDefault: true,
        direction: true
      });
      toolBar.addTo(map);
      var riverLayer = new YunliMap.Layer({
        layername: "xiongan_river_line",
        zIndex: 1
      });
      map.add(riverLayer);
      var tianditu_anno = new YunliMap.Layer({
        layername: "tianditu_anno",
        zIndex: 0
      });
      var baseLayer = new YunliMap.Layer({
        layername: "tianditu",
        zIndex: 0
      });
      map.add(baseLayer);
      var satellite = new YunliMap.Layer({
        layername: "tianditu_img",
        zIndex: 0
      });
      map.add(satellite);
      map.add(tianditu_anno);
      baseLayer.hide(); //默认不显示卫星图
      // satellite.hide();
      this.baseLayer = baseLayer;
      this.satellite = satellite;
      this.loadFengxqW();
      let _this = this;
      map.on("click", function() {
        //console.log("mapc")
        if (_this.infowindow) {
          _this.infowindow.hide();
        }
      });
    },
    switchBaseLayer(val) {
      if (val == 1) {
        //矢量图
        this.satellite.hide();
        this.baseLayer.show();
      } else if (val == 3) {
        this.satellite.show();
        this.baseLayer.hide();
      }
    },
    iconStationType: function(type) {
      switch (type) {
        case "WQ08":
          return "jmz";
        case "WQ03":
          return "gkz";
        case "WQ04":
          return "skz";
        case "WQ01":
          return "dxs";
        case "WQ05":
          return "yjz";
        case "WQ06":
          return "szz";
        case "WQ07":
          return "pwk";
        case "WQ09":
          return "syz";
        case "WQ10":
          return "gdz";
        case "WQ11":
          return "fcz";
        default:
          return "jmz";
      }
    },
    iconStationType2: function(type) {
      switch (type) {
        case "MM01":
          return "kqz";
        case "MM02":
          return "ycz";
        case "MM03":
          return "wxz";
        default:
          return "kqz";
      }
    },
    judgeWanterLevel(level) {
      if (level == "-") {
        return "--";
      }
      level = parseInt(level);
      if (level <= 0) {
        return "Ⅰ";
      } else if (level <= 1) {
        return "Ⅱ";
      } else if (level <= 2) {
        return "Ⅲ";
      } else if (level <= 3) {
        return "Ⅳ";
      } else if (level <= 4) {
        return "Ⅴ";
      } else if (level <= 5) {
        return "劣Ⅴ";
      } else {
        return "-";
      }
    },
    //站点类型文字简写
    stationTypeNameJX(type){
      let name = "";
      switch (type) {
        case "WQ00":
          name = "表";
          break;
        case "WQ01":
          name = "下";
          break;
        case "WQ05":
          name = "预";
          break;
        case "WQ08":
          name = "手";
          break;
        case "WQ09":
          name = "溯";
          break;
        case "WQ10":
          name = "固";
          break;
        case "WQ11":
          name = "浮";
          break;
        default:
          break;
      }
      return name;
    },
    judgeStationIcon2(level, controlorLevel){
      let pre = "gk-I";
      if(controlorLevel == "1"){
        pre = "gk";
      }else if(controlorLevel == "3"){
        pre = "sk";
      }if(controlorLevel == "4"){
        pre = "qk";
      }
      level = parseInt(level);
      if (level <= 0) {
        pre += "-I";
      } else if (level <= 1) {
        pre +=  "-II";
      } else if (level <= 2) {
        pre +=  "-III";
      } else if (level <= 3) {
        pre +=  "-IV";
      } else if (level <= 4) {
        pre +=  "-V";
      } else if (level <= 5) {
        pre +=  "-劣V";
      } 
      return pre;
    },

    judgeStationTyepIc(sType){
      switch (sType) {
        case "WQ05":
          return"yujing";
          break;
        case "WQ08":
          return"shougong";
          break;
        case "WQ09":
          return"suyuan";
          break;
        case "WQ10":
          return"guding";
          break;
        case "WQ11":
          return"fuchuan";
          break;
        default:
          break;
      }
    },
    judgeStationIcon(level, sType, controlorLevel){
      let pre = "";
      if(controlorLevel == "1"){
        pre = "gk";
      }else if(controlorLevel == "3"){
        pre = "sk";
      }if(controlorLevel == "4"){
        pre = "xq";
      }
      level = parseInt(level);
      let lv = level +1;
      let ty = this.judgeStationTyepIc(sType);
      return pre + ty + lv;


    },
    removeMarkers(markers) {
      let map = this.map;
      if (this.infowindow) {
        this.infowindow.hide();
      }
      if (markers) {
        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i];
          map.remove(marker);
        }
      }
    },
    loadStationMarkers() {
      let map = this.map;
      let _this = this;
      this.loadStationTextMarkers();
      // console.log(this.mapPattern);
      this.loadStationZhiguiMarkers();
      this.removeMarkers(this.markers);
      this.markers = [];
      for (let i = 0; i < this.mapInfo.length; i++) {
        let stationInfo = this.mapInfo[i];
        let longitude = stationInfo.longitude;
        let latitude = stationInfo.latitude;
        let name = stationInfo.stationName;
        let sType = stationInfo.stationType || "WQ08"; // 站点类型
        let namej = this.stationTypeNameJX(sType);
        let controlorLevel = stationInfo.controlorLevel; //控制级别
       // let icon = this.iconStationType(sType);
        let realData = stationInfo.wRealData || {};
        let wq = realData.wq_tp || "0";
        let icon =  this.judgeStationIcon(wq, sType,controlorLevel);
        console.log(1, icon)
        let marker = new YunliMap.Marker({
          icon: "./static/img/gismap/new3/" + icon + ".png",
         // icon: "./static/img/gismap/21.svg",
          position: [longitude, latitude],
          offset: [-10, -18], //非必填
          rotation: 0, //非必填，旋转角度，0-360，单位:度
          width: 20, //非必填
          height: 30, //非必填
          zIndex: 0, //层级
          scale: 1 //非必填
        });
        let text = new YunliMap.Text({
          coordinate: [longitude, latitude],
          textAlign: "center",
          offsetX: 1, //横向偏移
          offsetY: -5, //纵向偏移
          scale: 1, //缩放
          text: namej, //文本
         // borderColor: "#000", //描边颜色
         // borderWidth: 2, //描边宽度
          font: "normal 12px 微软雅黑", //字体样式
          color: "#484848", //字体颜色
          zIndex: 1 //层级
        });
        if (this.mapPattern == "直观") {
          marker.hide();
        //  text.hide();
         // console.log(1,1)
        }
      // map.add(text);
       map.add(marker);
      // console.log(text)
       this.markers.push(marker);
      // this.markers.push(text);
        marker.on("click", function(e) {
          _this.$emit("childMethod", stationInfo);
        });
      }
    },

    //加载站点直观
    loadStationZhiguiMarkers() {
      let map = this.map;
      let _this = this;
      this.removeMarkers(this.zhiGuiMarkers);
      this.zhiGuiMarkers = [];
      for (let i = 0; i < this.mapInfo.length; i++) {
        let stationInfo = this.mapInfo[i];
        let longitude = stationInfo.longitude;
        let latitude = stationInfo.latitude;
        let name = stationInfo.stationName;
        let realData = stationInfo.wRealData || {};
        let wq = realData.wq_tp || "--";
        wq = this.judgeWanterLevel(wq);
        // let element = document.createElement('div');
        // element.className = 'custom_marker';
        // element.addEventListener('click',function(){
        //     console.log('事件处理');
        // },false);
        //这里根据水质等级wq去不同的class
        let Div = document.createElement("div");
        Div.className = "custom_marker target-level";
        // Div.innerHTML = '<span class=>'+wq+'</span>';
        Div.innerHTML = `
                ${
                  wq == "Ⅰ"
                    ? '<div class="colorValue0">' + wq + "</div>"
                    : wq == "Ⅱ"
                    ? '<div class="colorValue1">' + wq + "</div>"
                    : wq == "Ⅲ"
                    ? '<div class="colorValue2">' + wq + "</div>"
                    : wq == "Ⅳ"
                    ? '<div class="colorValue3">' + wq + "</div>"
                    : wq == "Ⅴ"
                    ? '<div class="colorValue4">' + wq + "</div>"
                    : wq == "劣Ⅴ"
                    ? '<div class="colorValue5">' + wq + "</div>"
                    : '<div class="colorValueii">--</div>'
                }`;
        Div.addEventListener(
          "click",
          function() {
            //console.log('事件处理');
            _this.$emit("childMethod", stationInfo);
          },
          false
        );
        let customMarker = new YunliMap.CustomMarker({
          position: [longitude, latitude],
          offset: [0, 0], //默认居中
          content: Div //'<div  class="custom_marker"><span>'+wq+'</span></div>'
        });
        map.add(customMarker);
        if (this.mapPattern == "常规") {
          customMarker.hide();
        }
        // customMarker.on("click", function(e) {
        //   _this.$emit('childMethod',stationInfo)
        // });
        // console.log(text)
        // if(this.siteName =="隐藏站点名称"){
        //   text.hide();
        // }else if(this.siteName =="显示站点名称"){
        //   text.show();
        // }
        this.zhiGuiMarkers.push(customMarker);
      }
      this.showHideZgCg(this.mapPattern);
    },
    loadStationTextMarkers() {
      let map = this.map;
      let _this = this;
      this.removeMarkers(this.textMarkers);
      this.textMarkers = [];
      for (let i = 0; i < this.mapInfo.length; i++) {
        let stationInfo = this.mapInfo[i];
        let longitude = stationInfo.longitude;
        let latitude = stationInfo.latitude;
        let name = stationInfo.stationName;
        let text = new YunliMap.Text({
          coordinate: [longitude, latitude],
          textAlign: "center",
          offsetX: 0, //横向偏移
          offsetY: -40, //纵向偏移
          scale: 1, //缩放
          text: name, //文本
          borderColor: "#000", //描边颜色
          borderWidth: 2, //描边宽度
          font: "bold 14px 微软雅黑", //字体样式
          color: "#46FFEA", //字体颜色
          zIndex: 2, //层级
          extData: {
            //自定义附加信息
            id: 11
          },
          draggable: false, //是否启用拖拽
          isEdit: false //是否允许编辑
          // zooms:[3,15]//缩放等级限制
        });
        map.add(text);
        // console.log(text)
        // if(this.siteName =="隐藏站点名称"){
        //   text.hide();
        // }else if(this.siteName =="显示站点名称"){
        //   text.show();
        // }
        this.textMarkers.push(text);
      }
      this.showHideStationName(this.siteName);
    },
    showHideZgCg(val) {
      console.log(val)
      if (val == "常规") {
        this.zhiGuiMarkers.forEach(marker => {
          marker.hide();
        });
        this.markers.forEach(marker => {
          marker.show();
        });
      } else if (val == "直观") {
        this.zhiGuiMarkers.forEach(marker => {
          marker.show();
        });
        this.markers.forEach(marker => {
          marker.hide();
        });
      }
    },
    //显示
    showHideStationName(val) {
      //console.log(this.siteName)
      if (val == "隐藏站点名称") {
        this.textMarkers.forEach(text => {
          text.hide();
        });
      } else if (val == "显示站点名称") {
        this.textMarkers.forEach(text => {
          text.show();
        });
      }
    },
    queryAirStationContent(info) {
      let realData = info.realData || {};
      // console.log(realData);
      let stationName = info.stationName;
      let spt = realData.collecttime || "--"; //时间
      let no2_v = realData.no2_v || "-"; //
      let o3_v = realData.o3_v || "--"; //
      let pm25_v = realData.pm25_v || "--"; //pm26
      let so2_v = realData.so2_v || "--"; //so2
      let wd_v = realData.wd_v || "--"; //风向
      let ws_v = realData.ws_v || "--"; //风速
      let pm10_v = realData.pm10_v || "--"; //pm10
      let co_v = realData.co_v || "--"; //co
      let aqi = realData.aqi || "--"; // AQI指数
      let primaryPollution = realData.primaryPollution || "--";
      let content = `<div class='map_dialog map_dialog1'>
          <h4 class="title">${stationName}</h4>
           <ul class="item-list clearfix">
              <li class="">
                <span class="label-leng">最新时间：${
                  spt === "null" ? "--" : spt
                }</span>
              </li>
               <li class="item">
                <span class="label">AQI：${aqi}
                ${
                  aqi >= 0 && aqi <= 50
                    ? '<span class="excellent aqiLabel"></span>'
                    : aqi >= 51 && aqi <= 100
                    ? '<span class="aqiLabel good"></span>'
                    : aqi >= 101 && aqi <= 150
                    ? '<span class="aqiLabel light"></span>'
                    : aqi >= 151 && aqi <= 200
                    ? '<span class="aqiLabel moderate"></span>'
                    : aqi >= 201 && aqi <= 300
                    ? '<span class="aqiLabel severe"></span>'
                    : aqi >= 301 && aqi <= 400
                    ? '<span class="aqiLabel serious"></span>'
                    : ""
                }
                </span>
                <span class="label">首要污染物：${primaryPollution}</span>
              </li>
              <li class="item">
                <span class="label">PM10：${
                  pm10_v === "null" ? "--" : pm10_v
                } (μg/m3)</span>
                <span class="label">PM25：${
                  pm25_v === "null" ? "--" : pm25_v
                } (μg/m3)</span>
              </li>
               <li class="item">
                <span class="label">NO2：${
                  no2_v === "null" ? "--" : no2_v
                }(μg/m3)</span>
                <span class="label">SO2：${
                  so2_v === "null" ? "--" : so2_v
                }(μg/m3)</span>
              </li>
              <li class="item">
                <span class="label">O3：${
                  o3_v === "null" ? "--" : o3_v
                }(mg/m3)</span>
                <span class="label">CO：${
                  co_v === "null" ? "--" : co_v
                }(μg/m3)</span>
              </li>
           </ul>
        </div>`;
      return content;
    },
    // 获取污染类型面板数据
    getPollutionTypeData(val) {
      if(this.clusterLayer){
        this.map.remove(this.clusterLayer)
      }
      this.$http
        .get("/waterEnvXA/event/pollutionType", {
          params: {
            boat: val.indexOf("boat") > -1 ? "boat" : "",
            enterprise: val.indexOf("enterprise") > -1 ? "enterprise" : "",
            farm: val.indexOf("farm") > -1 ? "farm" : "",
            governProject:
              val.indexOf("governProject") > -1 ? "governProject" : "",
            qianRenWd: val.indexOf("qianRenWd") > -1 ? "qianRenWd" : "",
            waterPool: val.indexOf("waterPool") > -1 ? "waterPool" : "",
            keyWord: this.keyWords
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            let wrPanelList = res.data.content;
            this.wrapPolluteData2Map(wrPanelList);
          }
        });
    },
    //解析污染数据地图展示
    wrapPolluteData2Map(datas){
      let clusterData = [];
      datas.forEach(item =>{
        let type = item.type;
        let dataList = item.dataList;
        dataList.forEach(subset =>{
          let name ="";
          let latitude = null, longitude = null;
          if(type =="'船舶码头"){
            name = subset.boatName ||"";
          }else  if(type =="企业"){
            name = subset.enterpriseName ||"";
            latitude = subset.latitude;
            longitude = subset.longitude;
          }else  if(type =="养殖场"){
            name = subset.farmName || "";
          }else  if(type =="千吨万人"){
            name = subset.WINM;
          }else  if(type =="纳污坑塘"){
            latitude = subset.latitude;
            longitude = subset.longitude;
            name = subset.proLoca;
          }else  if(type =="工程地"){
            name = subset.projectName;
          }
          if(latitude && longitude && latitude !="" && longitude!="" && !isNaN(latitude) && !isNaN(longitude)&&
          longitude >100){
            clusterData.push({
              lnglat:[longitude, latitude],
              extData:{
                type:type,
                childObj:subset
              }
            });
          }
          
        });
      });
      this.loadPollouteClusterLayer(clusterData);
    },
    //初始采样点聚合图层
      loadPollouteClusterLayer(clusterData){
        // console.log(clusterData)
        let _this = this;
        var clusterLayer = new YunliMap.Cluster({
          data:clusterData,
          distance:100,
          minNumber:3,
          style(extDatas){
            //  console.log(extDatas)
            let length = extDatas.length;
            if(length>1){
              let color =
              length < 10
                ? "#62B934"
                : length < 50
                ? "#ACD110"
                : length < 140
                ? "#E3CA0A"
                : "#E08334";
            let borderColor =
              length < 10
                ? "rgba(98,185,52,0.3)"
                : length < 50
                ? "rgba(172,209,16,0.3)"
                : length < 140
                ? "rgba(227,202,10,0.3)"
                : "rgba(224,131,52,0.3)";
              return {
                radius:length<=5?25:length>=30?40:0.6*length+22,
                borderColor:borderColor,//'#'+length.toString().padEnd(6,"98ff"),
                borderWidth:1,
                color:color, //'#'+length.toString().padStart(6,"944c"),
                text:length,
                font:'normal bold 12px/16px arial,sans-serif',
                fontColor:"#FFF"
              }
            }else{
              //  console.log(extDatas)
              let type = extDatas[0].type;
              let icon_i = _this.judgePolluteImage(type);
              // console.log("type", type)
              return {
                icon:'./static/img/'+icon_i+'.png',
                //offset:[-10,-28]
              }
            }
          }
        })
        this.map.add(clusterLayer);
        this.clusterLayer = clusterLayer;
       // this.markers.push(clusterLayer);
        clusterLayer.on('click',function(e){
            if(e.length==1){
              let extData = e.target.getExtData()[0];
              _this.$emit("pollutionTypeOpen", {type:extData.type},extData.childObj);
             // console.log("点击",e.target.getExtData());
            }
        })
      },
    judgePolluteImage(type){
      let icon = "";
      if(type =="'船舶码头"){
            icon ="cbmt";
      }else  if(type =="企业"){
        icon ="qy";
      }else  if(type =="养殖场"){
        icon ="yzc";
      }else  if(type =="千吨万人"){
        icon ="qdwr";
      }else  if(type =="纳污坑塘"){
        icon ="nwkt";
      }else  if(type =="工程地"){
        icon ="gc";
      }
      return icon;
    },
    meatureTool(type) {
      let this_ = this;
      this.map.drawFeature(type, {
        isMeasure: true,
        end: function(e) {
          // var html = "";
          // if (type == "LineString") {
          //   html = e.length.toFixed(2) + "m";
          //   this_.$message(html);
          // } else if (type == "Polygon") {
          //   html = e.area.toFixed(2) + "m<sup>2</sup>";
          //   this_.$message(html);
          // }
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
      this.$http.get("./static/data/xiongan3.geojson", this).then(res => {
        YunliMap.loadGeoJson(res.data).forEach(feature => {
          feature.setStyle({
            background: "rgba(6,44,76,0)",
            borderColor: "#2CFDFD", //"#2e9cfa",
            borderWidth: 2
            //lineDash:[10,5]
          });
          feature.setZIndex(3);
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
    },
    siteName(val) {
      this.showHideStationName(val);
    },
    mapPattern(val) {
      this.showHideZgCg(val);
    }
  }
};
</script>

<style lang="less" scoped>
.enterprise-map-wrap2 {
  width: 100%;
  float: left;
  height: 100%;
  z-index: 0;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  background: transparent;
  .custom_marker {
    text-align: center;
    background: #03ccbb;
    border: solid 2px #fff;
    border-radius: 3px;
    padding: 2px;
    cursor: pointer;
  }
  .custom_marker span {
    display: block;
    height: 18px;
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    font-weight: bold;
  }
  .custom_marker {
    width: 40px;
    border: solid 1px #fff;
  }
  .custom_marker > div {
    height: 18px;
  }
}
</style>
