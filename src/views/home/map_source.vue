<template>
  <div class="enterprise-map-wrap" id="map">

  </div>

</template>

<script>
  export default {
    name: 'airMap',
    components: {},
    props: {
      mapInfo: Array,
      wraduis : Number,
      siteName: String,
      mapPattern:String,
      qualityGrade:Boolean
    },
    created() {
   
    },
    mounted() {
      this.initMap()
    //  this.loadAirData()
    },
    data() {
      return {
        map: Object,
        loadNum :1 ,
        widArr : [],
        buffCenter :[32.141189575, 120.9526062011],
        stationLayerGroup:Object,
        enterLayerObj :{},
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
        let lat = 22.9155;
        let lng = 113.206;
        let zoom = 12;
        
        let platformStr = this.toolObj.getCookie("platform");
        if(platformStr){
        platformStr = JSON.parse(platformStr);
        lat = platformStr.lat || 22.9155;
        lng = platformStr.lng || 113.206;
        zoom = platformStr.zoom || 12;
        }
        let map = L.map('map',{
          attributionControl:false,
          zoomControl:false,
          minZoom:6,
          crs: L.CRS.EPSG4326,
          }
          ).setView([lat, lng], zoom);
        this.map = map;
        this.queryClientIP();
        //站点图层组
        var stationLayerGroup = new L.LayerGroup();
        //站点名称图层组
        var stationNameLayerGroup = new L.LayerGroup();
          //站点名称图层组
        var zhiguanLayerGroup = new L.LayerGroup();

        var wuryLayerGroup = new L.LayerGroup();
        this.wuryLayerGroup = wuryLayerGroup;
        this.zhiguanLayerGroup = zhiguanLayerGroup;
        this.stationLayerGroup = stationLayerGroup;
        this.stationNameLayerGroup = stationNameLayerGroup;
        this.map.addLayer(zhiguanLayerGroup);
        this.map.addLayer(stationLayerGroup);
        this.map.addLayer(stationNameLayerGroup);
         this.map.addLayer(wuryLayerGroup);
        this.loadFengxqW();
        this.loadFengxSX();
       // this.loadFengxqWXZ();
      //  this.initThemeLayer();
          map.on('click', function(ev) {
            console.log(ev.latlng); 
          });
      },
      //判断是否启用天地图
       queryClientIP(){
        try {
          console.log(returnCitySN)  
          var cip = returnCitySN["cip"];
          if(cip == "58.247.249.189"){
            console.log("启用内网底图");
            let url ="http://10.0.254.123:8088/iserver/services/map-HB/rest/maps/HBMAP";
            L.supermap.tiledMapLayer(url).addTo(this.map);
            return;
          }
        } catch (error) {
          console.log("获取客户端ip失败! "+error);
        }
        console.log("启用天地图");
        L.supermap.tiandituTileLayer({
          url: "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
        }).addTo(this.map);
        L.supermap.tiandituTileLayer({
            isLabel:true,
            url: "http://t{s}.tianditu.com/{layer}_{proj}/wmts?tk=8152cdbb730f2c6ebf35266845e82c74"
        }).addTo(this.map);
        //  document.write(returnCitySN["cip"]+','+returnCitySN["cname"]);  
        this.loadImageKSOv();
      },
      /**
       * 插值地图加上
       */
      loadImageKSOv:function(val){
        if(!val){
          //清楚定时器取消分析
          if(this.imageKSV && this.imageOverlay_ks){
            clearInterval(this.imageKSV);
            this.imageOverlay_ks.setOpacity(0);
            return;
          }
        }
        if(!this.imageOverlay_ks){
          var imageUrl = './static/img/sdcjgyy/1.png',
            imageBounds = [[22.671661756928, 113.005915435312], [23.02061713715, 113.387065803405]];
          this.imageOverlay_ks = L.imageOverlay(imageUrl, imageBounds,{opacity:0.66}).addTo(this.map);
        }
        this.imageOverlay_ks.setOpacity(0.66);
        var imageOverlay_ = this.imageOverlay_ks;
        var index = 1;
        // this.imageKSV = setInterval(() => {
        //   imageOverlay_.setUrl('./static/img/'+index+'.png');
        //   if(index == 14){
        //     index = 0;
        //   }
        //   index ++;
        // }, 800);
      },
      playKusImages(index){
        if(this.imageOverlay_ks){
          this.imageOverlay_ks.setUrl('./static/img/sdcjgyy/'+index+'.png');
        }else{
          console.log("扩散图层未初始!")
        }
      },
      /**
       * 切换底图
       */
      changeBaseLayer:function (type){

      },
      /**
       * 污染朔源完成 中心点设置
       */
      setWuryanCenter(){
        this.map.setView(this.buffCenter, 11);
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
        let widArr = this.widArr = [];
        this.$http.get("./static/data/fengxsx.json").then(res =>{
          L.geoJSON(res.data, {
            style: function (feature) {
              let wid = feature.properties.wid;
              if(wid){
                widArr.push(wid);
                return {fillColor: "red",stroke:false,fillOpacity:0,"className":"ks_"+wid};
              }
              return {fillColor: "red",stroke:false,fillOpacity:0};
            }
          })/*.bindPopup(function (layer) {
            return  layer.feature.properties.name;
          })*/.addTo(this.map);
          for (let i = 0; i < widArr.length; i++) {
            let wid = widArr[i];
            let idName = "ks_"+wid;
            let path = document.getElementsByClassName(idName)[0]
            if( i == 0){
              var svgDom = path.parentNode.parentNode
              _this.createdDefs(svgDom);
            }
            _this.initAniColorYUj(path, idName);
          }
        //  _this.ksAnimateCss("1221", 1);
        });
      //  this.bufferAnalysis();
      },
      createdDefs(svgDom){
        var defs= this.makeSVG('defs', {id:'colors'});
		    svgDom.appendChild(defs);
      },
      initAniColorYUj( path, idName){
        var radialGradient= this.makeSVG('linearGradient', {id:idName,x1:"0%",y1:"0%", x2:"0%",y2:"100%"});
        var stop= this.makeSVG('stop', { offset:"0%", 'stop-color':"#00a1e4",'stop-opacity':'1'});
        var stop1= this.makeSVG('stop', { offset:"30%", 'stop-color':"#24c768",'stop-opacity':'1'});
        var stop2= this.makeSVG('stop', { offset:"50%", 'stop-color':"#e5ce10",'stop-opacity':'1'});
        var stop3= this.makeSVG('stop', { offset:"70%", 'stop-color':"#ff7e00",'stop-opacity':'1'});
        var stop4= this.makeSVG('stop', { offset:"100%", 'stop-color':"#ff0000",'stop-opacity':'1'});
        document.getElementById('colors').appendChild(radialGradient);
        document.getElementById(idName).appendChild(stop);
        document.getElementById(idName).appendChild(stop1);
        document.getElementById(idName).appendChild(stop2);
        document.getElementById(idName).appendChild(stop3);
        document.getElementById(idName).appendChild(stop4);
        path.setAttribute("fill","url(#"+idName+")");
       
      },
      /**
       * 裤松
       */
      ksAnimateCss(wid, index){
        this.hideRiverCss();
        if(wid){
          let idName = "ks_"+wid;
          let path = document.getElementsByClassName(idName)[0];
          path.setAttribute("fill-opacity","1");
          let x1 = index * 10;
          let x2 = x1 + 40;
          document.getElementById(idName).setAttribute("x1",x1+"%");
          document.getElementById(idName).setAttribute("x2", x2 +"%");
        }
      },
      hideRiverCss(){
        let widArr = this.widArr;
        for (let i = 0; i < widArr.length; i++) {
          let wid = widArr[i];
          let idName = "ks_"+wid;
          let path = document.getElementsByClassName(idName)[0];
          path.setAttribute("fill-opacity","0");
        }
      },
      //给svg添加渐变
    makeSVG(tag, attrs) {
      var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs)
          el.setAttribute(k, attrs[k]);
      return el;
    },
    /**
     * 污染源企业缓冲分析
     */
    bufferAnalysis(wuryDatas){
      //alert(this.wraduis);
      this.wuryLayerGroup.clearLayers();
      let radius = this.wraduis;
      radius = 22;
      let circle = L.circle(this.buffCenter, {"radius": radius * 1000});
      this.wuryLayerGroup.addLayer(circle);
      var options = {steps: 100, units: 'kilometers', properties: {foo: 'bar'}};
      let geo = turf.circle([this.buffCenter[1], this.buffCenter[0]], radius, options);
      if(wuryDatas){
        let airIcon = L.icon({iconUrl : './static/img/yuan_b_pic.png', iconSize : [24, 31]});
        this.enterLayerObj = {};//污染源企业图层对象
        wuryDatas.forEach(data => {
          let lnt = data.longitude;
          let lat = data.latitude;
          let enterName = data.enterName;
          if(lnt && lat){
            lnt = parseFloat(lnt);
            lat = parseFloat(lat)
            var point = turf.point([lnt, lat]);
            var contains = turf.booleanContains(geo, point);
            if(contains) {
              let airMarker = L.marker([lat, lnt], {icon: airIcon});//.addTo(this.map)
              this.wuryLayerGroup.addLayer(airMarker);
              this.enterLayerObj[enterName] = airMarker;
            }
          }
          
        });
      }
     
    },
    /**
     * 清除
     */
    clearBufferAlany(){
      this.wuryLayerGroup.clearLayers();
    },
    /**
     * 设置污染源企业 污染朔源结论企业 红色图标
     */
    setWyryEnter(enterName){
      var layer = this.enterLayerObj[enterName];
      if(layer) {
        let airIcon = L.icon({iconUrl : './static/img/yuan_e_pic.png', iconSize : [24, 31]});
        layer.setIcon(airIcon);
      }
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
        this.markerSetup()
      },
      /**
       * 企业图标绘制
       */
      childMothed(equipId){
        this.$emit('childMethod',equipId)
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
          var dbvalue=date.getTime()-cdate.getTime();
          dbvalue=Math.abs(dbvalue/1000);
          if(dbvalue>3600*8){
            cValue=0;
          }
          let airIcon = this.airIconCreate(sType, cValue); //根据等级确定站点点位图标颜色
          let airMarker = L.marker([latitude, longitude], {icon: airIcon});//.addTo(this.map)

          // airMarker.on('click', function(e) {
          //   _this.childMothed(stationInfo.equipId);
          // })
         
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
            _this.childMothed(stationInfo.equipId);
          })
          this.zhiguanLayerGroup.addLayer(zhigMarker);
        }
        this.hideShowStationZhig(0);
        if(this.loadNum == 1){
          var localhref = window.location.href;
          var localarr = localhref.split('?');
          if(localarr.length > 1){
            let equipId2 = localarr[1].replace(/[^\d.]/g,"");
            _this.childMothed(equipId2);
          }
        }
        this.loadNum ++;
       
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
        var iconT = "zi";
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
          border-left: 0px;
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
          border-left: 0px;
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
          border-left: 0px;
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
          border-left: 0px;
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
          border-left: 0px;
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
          border-left: 0px;
          padding: 5px;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.45)
      }
  }
  .enterprise-map-wrap{
    width: 100%;
    float: left;
    height: 100%;
    border-left: 1px solid #dce2e8;
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
