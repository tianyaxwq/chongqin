<template>
  <div class="enterprise-map-wrap212" id="map21">

  </div>

</template>

<script>
   import {Meatures} from "@/assets/js/mapMeatures"
  export default {
    name: 'airMap',
    components: {},
    props: {
      mapInfo: Array,
      siteName: String,
      mapPattern:String,
      qualityGrade:Boolean
    },
    created() {
   
    },
    mounted() {
      setTimeout(()=>{
        this.initMap()
      },320)
    //  this.loadAirData()
    },
    data() {
      return {
        map: Object,
        loadNum :1 ,
        mapTypeNet : 1, // 1外网  2内网
        fxUrl :"http://10.0.254.123:8088/iserver/services/map-HB/rest/maps/HBMAP",
        quZColorObj:{
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
      }
    },
    methods: {
      initMap: function () {
       let map = L.map('map21',{
         attributionControl:false,
         zoomControl:false,
         minZoom:6,
         crs: L.CRS.EPSG4326,
         }
         ).setView([29.605325600,106.5869800800], 10);
        this.map = map;
        this.queryClientIP();
        //站点图层组
        var stationLayerGroup = new L.LayerGroup();
        //站点名称图层组
        var stationNameLayerGroup = new L.LayerGroup();
          //站点名称图层组
        var zhiguanLayerGroup = new L.LayerGroup();
        this.zhiguanLayerGroup = zhiguanLayerGroup;
        this.stationLayerGroup = stationLayerGroup;
        this.stationNameLayerGroup = stationNameLayerGroup;
        this.map.addLayer(zhiguanLayerGroup);
        this.map.addLayer(stationLayerGroup);
        this.map.addLayer(stationNameLayerGroup);
      //  this.loadFengxqW();
        //初始化地图工具组件js
       // this.initMapToolBar();
        this.getMouseLntLat()
      //  this.loadFengxSX();
       // this.loadFengxqWXZ();
      //  this.initThemeLayer();
      },
      //判断是否启用天地图
      queryClientIP(){
        this.baseLayer = L.supermap.tiandituTileLayer({
          layerType: "vec",
          url: "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
        }).addTo(this.map);
        L.supermap.tiandituTileLayer({
            isLabel:true,
            url: "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
        }).addTo(this.map);
        //  document.write(returnCitySN["cip"]+','+returnCitySN["cname"]);  
      },
      getMouseLntLat(){
        let _this=this;
        this.map.on("click",function(r){
         
            _this.$emit("getLntLat",r.latlng)
        });
      },


      initMapToolBar(){
        setTimeout(() => {
                var meatures = new Meatures(this.map,this);
                this.meatures = meatures;
        }, 200);
        this.geolocationSelf()
      },
      //地图展示自己位置
      showMapSelf(lat,lon){
        this.$message("您当前位置的维度："+lat+"，经度："+lon);
      },
      //定位自己坐标
      geolocationSelf(){
        let _this = this;
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position)  {
              x = position.coords.longitude;
              y = position.coords.latitude;
            },(err) =>{
              console.log(err);
            },{timeout:60000});
        }else{
          this.$message('您当前使用的浏览器不支持地理定位服务！');
        }
      },
      /**
       * 放大缩小地图
       */
      setMapZoom(type){
        if(type == "in"){
          this.map.zoomIn();
        }else if(type == "out"){
          this.map.zoomOut();
        }
      },
      /**
       * 测距 测面
       */
      meatureTool(type) {
        switch (type) {
          case "polyline":
                this.meatures.drawController("polyline");
              break;
          case "polygon":
                this.meatures.drawController("polygon");
                  break;
          case "point":
                this.meatures.drawController("point");
                break;
            case "circle":
                this.meatures.drawController("circle");
                break;
          default:
              break;
          }
      },
      //清除
      resetMeatureTool(type){
        //this.yewuLayerGroup.clearLayers();
        this.meatures.clearLayers();
      },
      /**
       * 切换底图
       */
      changeBaseLayer:function (type){
        if(!type){
          return;
        }
        this.map.removeLayer(this.baseLayer);
        if(this.mapTypeNet == 2 && type === "vec"){
          this.baseLayer = L.supermap.tiledMapLayer(this.fxUrl,{
              zIndex : 0
           }).addTo(this.map);
        }else {
          this.baseLayer = L.supermap.tiandituTileLayer({
            layerType: type,
            zIndex : 0,
            url: "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
          }).addTo(this.map);
        }
      },
      initThemeLayer :function () {

        let themeLayer = L.supermap.labelThemeLayer("ThemeLayer",{opacity:1,isAllowFeatureStyle:true}).addTo(this.map);
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
          }, {
            start: 51,
            end: 101,
            style: {
              fillColor: "#FBD12A",
              fontSize: "19px"
            }
          }, {
            start: 101,
            end: 151,
            style: {
              fillColor: "#FE8800",
              fontSize: "22px"
            }
          }, {
            start: 151,
            end: 201,
            style: {
              fillColor: "#FF0000",
              fontSize: "24px"
            }
          }, {
            start: 201,
            end: 301,
            style: {
              fillColor: "#CC0000",
              fontSize: "26px"
            }
          }, {
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
      addThemeFeatures:function () {
        var labelFeatures = [];
        var feat;
        let themeData = this.mapInfo;
        for (var i = 0; i < themeData.length; i++) {
          let lng = parseFloat(this.mapInfo[i].lng);
          let lat = parseFloat(this.mapInfo[i].lat);
          var text = themeData[i].wqlindex;
          feat =  L.supermap.themeFeature([lat, lng, text], themeData[i]);
          labelFeatures.push(feat);
        }
        this.themeLayer.addFeatures(labelFeatures);
      },
      /**
       * 隐藏或者显示站点名称
       * @param op 透明度
       */
      hideShowStationName:function (op) {
        this.stationNameLayerGroup.eachLayer(function (layer) {
          layer.setOpacity(op);
        });
      },
       /**
       * 隐藏或者显示直观
       * @param op 透明度
       */
      hideShowStationZhig:function (op) {
        this.zhiguanLayerGroup.eachLayer(function (layer) {
          layer.setOpacity(op);
        });
      },
     /**
      * 直观与常规切换 op  1直观 0 常规
      * */
      cgzhiguanChange:function (op) {
        let sop =1;
        //直观
        if(op ==1 ){
          sop = 0
         // this.hideShowStationZhig(1);
        }else {
         // this.themeLayer.removeAllFeatures()
        }
        this.hideShowStationZhig(op);
        this.hideShowStationName(sop);
        this.stationLayerGroup.eachLayer(function (layer) {
          layer.setOpacity(sop);
        });
      },
       //加载奉贤区水系
      loadFengxSX: function () {
        let _this = this;
        this.$http.get("./static/data/fengxsx.json").then(res =>{
          L.geoJSON(res.data, {
            style: function (feature) {
              let wid = feature.properties.wid;
              return {fillColor: "red",stroke:false,fillOpacity:1,"className":"fxdtc_2"};
            }
          })/*.bindPopup(function (layer) {
            return  layer.feature.properties.name;
          })*/.addTo(this.map);
          let path = document.getElementsByClassName("fxdtc_2")[0]
          var svgDom = path.parentNode.parentNode
          _this.initAniColorYUj(svgDom,path);

        });
      },
       initAniColorYUj(svgDom, path){
        var defs= this.makeSVG('defs', {id:'colors'});
		    svgDom.appendChild(defs);
        var idName = "ditujb_xx";
        var radialGradient= this.makeSVG('linearGradient', {id:idName,x1:"0%",y1:"0%", x2:"0%",y2:"100%"});
        var stop= this.makeSVG('stop', { offset:"0%", 'stop-color':"#ade6cd",'stop-opacity':'1'});
        var stop1= this.makeSVG('stop', { offset:"100%", 'stop-color':"#79d1cf",'stop-opacity':'1'});
        document.getElementById('colors').appendChild(radialGradient);
        document.getElementById(idName).appendChild(stop);
        document.getElementById(idName).appendChild(stop1);
        path.setAttribute("fill","url(#ditujb_xx)");
       
      },
      //给svg添加渐变
     makeSVG(tag, attrs) {
      var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs)
          el.setAttribute(k, attrs[k]);
      return el;
    },
      //加载奉贤区网格
      loadFengxqW: function () {
        this.$http.get("./static/data/fengxq.json").then(res =>{
          L.geoJSON(res.data, {
            style: function (feature) {
              return {fillColor: "red",fillOpacity:0};
            }
          })/*.bindPopup(function (layer) {
            return  layer.feature.properties.name;
          })*/.addTo(this.map);

        });
      },
      //加载奉贤区子乡镇网格
      loadFengxqWXZ: function () {
        var me = this;
        if( me.zwgLayer){
           me.zwgLayer.remove();
        }
        this.$http.get("./static/data/fengxqz.json").then(res =>{
          var zwgLayer = L.geoJSON(res.data, {
            style: function (feature) {
              return {
                fillColor: me.quZColorObj[feature.properties.name],
                fillOpacity:0.56,
                weight:2,
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
      hideShowQYWG:function (op) {
        let style ={};
        //显示
        if(op){
          style = {
            fillOpacity:0.56,
            opacity:1
          }
        }else{
          style = {
            fillOpacity:0,
            opacity:0
          }
        }
        if( this.zwgLayer){
           this.zwgLayer.setStyle(style)
        }
       
      },
      loadAirData: async function () {
        setTimeout(()=>{
          this.markerSetup()
      },320)
      },
      /**
       * 企业图标绘制
       */
      childMothed(data){
        this.$emit('childMethod',data)
      },
      convertDateFromString(dateString){
        if (dateString) {
          var date = new Date(dateString.replace(/-/,"/"))
          return date;
        }
      },
      markerSetup: function () {
        this.stationLayerGroup.clearLayers();
        this.zhiguanLayerGroup.clearLayers();
        this.stationNameLayerGroup.clearLayers();
        let _this=this;
        for (let i = 0; i < this.mapInfo.length; i++) {
          let stationInfo = this.mapInfo[i];
          let longitude = parseFloat(stationInfo.lng);
          let latitude = parseFloat(stationInfo.lat);
          
          //图片icon
          let sType = stationInfo.category ||"地表水自动监测站"; // 站点类型
          let cValue =stationInfo.grade; // 污染等级
          var date=new Date();
          var cdate=this.convertDateFromString(stationInfo.time);
          if(!cdate){
             cValue=0;
          }else{
            var dbvalue=date.getTime()-cdate.getTime();
            dbvalue=Math.abs(dbvalue/1000);
            if(dbvalue>3600*8 || cValue > 10){
              cValue=0;
            }
          }
          
          let airIcon = this.airIconCreate(sType, cValue); //根据等级确定站点点位图标颜色
          let airMarker = L.marker([latitude, longitude], {icon: airIcon});//.addTo(this.map)

          airMarker.on('click', function(e) {
          //  _this.childMothed(stationInfo.equipId);
          })
         
          //站点图标的扩散动画
          var classAni = this.aniStationGrade(cValue);
          var aniIcon = L.divIcon({html: "<div class='circle-animationA'></div><div class='circle-animationB'></div>",
            className: classAni ,iconSize:[60, 60],iconAnchor:[30,30]
          });
          let aniMarker = L.marker([latitude, longitude], {icon: aniIcon});
          if(cValue >= 4||cValue==0){
            this.stationLayerGroup.addLayer(aniMarker);
          }
          this.stationLayerGroup.addLayer(airMarker);
          airMarker.popupAnchor = [0, -10];
          var text = stationInfo.name;
          var content = this.getStationTemplateC(stationInfo);

          var myIcon = L.divIcon({html: text, className: 'my-div-icon'
            ,iconSize:[120, 12],iconAnchor:[12,31]
          });
          let textMarker = L.marker([latitude, longitude], {icon: myIcon});
          this.stationNameLayerGroup.addLayer(textMarker);
           //直观
          var aqi = "<span class='border-text'><i></i>"+this.mapInfo[i].wqlindex+"("+this.toWQLString(this.mapInfo[i].grade)+")</span>";
          var text = "<span class='border-text'>"+text+"</span>";
          var waterQualityLevel = this.mapInfo[i].grade;//水质等级
          var cls = this.gradeShuiZhigClass(waterQualityLevel);
          var myIcon2 = L.divIcon({html: "<div class='"+cls+"'>"+aqi + text+"</div>", className: 'my-div-icon'
           // ,iconSize:[191, 12],iconAnchor:[0,0]
          });
          let zhigMarker = L.marker([latitude, longitude], {icon: myIcon2});
          zhigMarker.on('click', function(e) {
          //  _this.childMothed(stationInfo);
          });
          this.zhiguanLayerGroup.addLayer(zhigMarker);
        }
        this.hideShowStationZhig(0);
      },
        /**
       * 站点水质等级颜色
       */
       gradeShuiZhigClass:function (grade){
        let cls = "lixian";
         switch (grade) {
          case 0:
             cls = "levoneandtwo";
             break;
          case 1:
             cls = "levoneandtwo";
              break;
          case 2:
             cls = "levoneandthree";
              break;
          case 3:
             cls = "levoneandfour";
              break;
          case 4:
             cls = "levoneandfive";
              break;
          case 5:
            cls = "levoneandsix";
             break;
          default:
             cls = "lixian";
             break;
              
        }
        return cls;
      },
      pulseIconCreate(){
        return L.icon.pulse({
          iconSize: [22, 22],
          iconUrl : './static/img/map_Location_gong_04.png',
          color: '#2f8'
        });
      },
      toWQLString(wql){
        if(wql=='1'){
          return 'Ⅰ类';
        }else if(wql=='2'){
          return 'Ⅱ类';
        }else if(wql=='3'){
          return "Ⅲ类"
        }else if(wql=='4'){
          return "Ⅳ类";
        }else if(wql=='5'){
          return "Ⅴ类";
        }else if(wql=='6'){
          return "劣Ⅴ类";
        }else {
          return '';
        }
      },
      /**
       * 获取超标污染的站点扩散动画class
       * */
      aniStationGrade(grade){
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
          case 0:
          return "alarm-animation-wrapF";
        }
      },
      /**
       * 获取站点类型icon的标识
       * @param type 0 公 1 境..
       * */
      iconStationType:function(type){
        switch (type) {
          case '地表水信息公开断面':
            return "gong";
          case '地表水出入境断面':
            return "jing";
          case '地表水区控监测断面':
            return "qu";
          case '地表水三年行动计划监测断面':
            return "xing";
          case '区级饮用水源地断面':
            return "yin";
          case '地表水镇级监测断面':
            return "zhen";
          case '地表水自动监测站':
            return "zi";
        }
      },
      airIconCreate(type, airValue) {
        var iconT = this.iconStationType(type);
        switch (airValue) {
          case 1: //一二类
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_01.png', iconSize : [24, 31]});
          case 2: //一二类
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_01.png', iconSize : [24, 31]});
          case 3: // 三类
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_02.png', iconSize : [24, 31]});
          case 4:
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_03.png', iconSize : [24, 31]});
          case 5:
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_04.png', iconSize : [24, 31]});
          case 6:
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_05.png', iconSize : [24, 31]});
          case 0: //离线
            return L.icon({iconUrl : './static/img/map_Location_'+iconT+'_06.png', iconSize : [24, 31]});
        }
      },
      /**
       * 获取站点弹出框html
       * @param station
       */
      getStationTemplateC :function (station) {
        return station.name;
      },
      airMarkerColorSetup(value) {
        switch (value) {
          case 0:
            return 'airLevelOffline';
          case 1:
            return 'airLevelOne';
          case 2:
            return 'airLevelTwo';
          case 3:
            return 'airLevelThree';
          case 4:
            return 'airLevelFour';
          case 5:
            return 'airLevelFive';
          case 6:
            return 'airLevelSix'
        }
      },
      nf(href){
        window.href = href.href;
      },
      timeFormat: function (originTime) {
        let day = originTime.substring(8, 10);
        let hour = originTime.substring(11, 13);
        let time = day + '日' + ' ' + hour + '时';
        return time
      }
    },
    watch: {
      mapInfo: {
        handler(newValue, oldValue) {
          this.loadAirData();
          },
        deep: true
      },
      siteName:{
        handler(newValue, oldValue) {
          let opacity = 1;
          if(newValue == "隐藏站点名称"){
            opacity = 0;
          }else if(newValue == "显示站点名称"){
            opacity = 1;
          }
          this.hideShowStationName(opacity);
        }

      },
      mapPattern:{
        handler(newValue, oldValue) {
          let opacity = 1;
          if(newValue == "直观"){
            opacity = 1;
          }else if(newValue == "常规"){
            opacity = 0;
          }
          this.cgzhiguanChange(opacity);
        }
      },
      qualityGrade:{
        handler(newValue, oldValue) {
          this.hideShowQYWG(newValue);
        }
      }
      ,quZColorObj:{
        handler(newValue, oldValue) {
          var me = this;
          if(this.zwgLayer){
            this.zwgLayer.eachLayer(function (layer) {
              layer.setStyle({
                  fillColor:me.quZColorObj[layer.feature.properties.name]
                });
            // layer.options.fillColor =  me.quZColorObj[layer.feature.properties.name];
            });
          }else{
            this.loadFengxqWXZ();
          }
        }
      }
    }
  }
</script>

<style lang="less">
 //水环境
 .leaflet-marker-icon.leaflet-interactive{
   white-space: nowrap;
   >div{
      span:nth-child(1){
          position: relative;
          i{
              content: '';
              width: 6px;
              height: 6px;
              position: absolute;
              background: transparent;
              left: 5px;
              bottom: -5px;
          }
      }
    }
    span{
      padding: 6px;
    }
 }
  .lixian{
      span:nth-child(1){
        background: #c1ccd9;
        color: #fff;
      }
      span:nth-child(2){
          border: 1px solid #c1ccd9;
          border-left: 0;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.45)
      }
  }
  .levoneandtwo{
      span:nth-child(1){
        background: #1269ff;
        color: #fff;
      }
      span:nth-child(2){
          border: 1px solid #1269ff;
          border-left: 0;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.45)
      }
  }
  .levoneandthree{
      span:nth-child(1){
        background: #00e400;
        color: #fff;
      }
      span:nth-child(2){
          border: 1px solid #00e400;
          border-left: 0;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.45)
      }
  }
  .levoneandfour{
      span:nth-child(1){
        background: #edc24a;
        color: #fff;
      }
      span:nth-child(2){
          border: 1px solid #edc24a;
          border-left: 0;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(134, 53, 53, 0.45)
      }
  }
  .levoneandfive{
      span:nth-child(1){
        background: #ff7e00;
        color: #fff;
      }
      span:nth-child(2){
          border: 1px solid #ff7e00;
          border-left: 0;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.45)
      }
  }
  .levoneandsix{
      span:nth-child(1){
        background: #ff0000;
        color: #fff;
      }
      span:nth-child(2){
          border: 1px solid #ff0000;
          border-left: 0;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.45)
      }
  }
  .enterprise-map-wrap212{
    width: 100%;
   // float: left;
    height: 100%;
    //border-left: 1px solid #dce2e8;
  }

  .my-div-icon{
    color: #8f51e8;
    font-style: normal;
    font-weight: bold;
    font-size: 14px
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
  .alarm-animation-wrapA{
    .circle-animationA{
      background:hsla(198, 100%, 45%, 0.459);
    }
    .circle-animationB{
      background:rgba(0, 161, 228, 0.46);
    }
  }
  .alarm-animation-wrapB{
    .circle-animationA{
      background:rgba(36, 198, 103, 0.459);
    }
    .circle-animationB{
      background:rgba(36,199,104,0.46);
    }
  }
  .alarm-animation-wrapC{
    .circle-animationA{
      background:rgba(228, 207, 15, 0.459);
    }
    .circle-animationB{
      background:rgba(229,206,16,0.46);
    }
  }
  .alarm-animation-wrapD{
    .circle-animationA{
      background:rgba(255, 126, 0, 0.459);
    }
    .circle-animationB{
      background:rgba(255,126,0,0.46);
    }
  }
  .alarm-animation-wrapE{
    .circle-animationA{
      background:rgba(255, 0, 0, 0.459);
    }
    .circle-animationB{
      background:rgba(255,0,0,0.46);
    }
    
  }
  .alarm-animation-wrapF{
    .circle-animationA{
      background:rgba(112,128,144, 0.46);
    }
    .circle-animationB{
      background:rgba(112,128,144,0.46);
    }
  }
  .circle-animationA{
    position:absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    top:0;
    left: 0;
    -webkit-animation:twinkling 2.1s infinite ease-in-out;
    animation:twinkling 2.1s infinite ease-in-out;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }
  .circle-animationB{
    position: absolute;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    top: 9px;
    left: 9px;
    -webkit-animation:twinkling 2.1s infinite ease-in-out;
    animation:twinkling 2.1s infinite ease-in-out;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }
  @-webkit-keyframes twinkling {
    0% {
      opacity:0.2;
      filter:alpha(opacity=20);
      -webkit-transform:scale(1);
    }
    50% {
      opacity:0.5;
      filter:alpha(opacity=50);
      -webkit-transform:scale(1.12);
    }
    100% {
      opacity:0.2;
      filter:alpha(opacity=20);
      -webkit-transform:scale(1);
    }
  }@keyframes twinkling {
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
