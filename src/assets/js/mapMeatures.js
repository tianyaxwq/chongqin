/**
 * 测量工具类 基于leaflet turf
 * cys
 * 
 */




export const Meatures = function(map,_vue){
    L.drawLocal.draw.handlers.polyline.tooltip.start ="点击开始绘制";
    L.drawLocal.draw.handlers.polyline.tooltip.cont = "点击继续绘制";
    L.drawLocal.draw.handlers.polyline.tooltip.end = "点击最后点结束绘制";

    L.drawLocal.draw.handlers.polygon.tooltip.start ="点击开始绘制";
    L.drawLocal.draw.handlers.polygon.tooltip.cont = "点击继续绘制";
    L.drawLocal.draw.handlers.polygon.tooltip.end = "点击最开始点结束绘制";

    L.drawLocal.draw.handlers.marker.tooltip.start ="点击地图放置一个点";

    L.drawLocal.draw.handlers.circle.tooltip.start ="点击并且拖动绘制";


    var drawControl,editableLayers,geo,coordinate,typeM,layer_;
    editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    drawing();
   // drawController(false,true,false);
      //添加draw的控件
      function drawController(toolbar, polyline, polygon, circle, rectangle, circlemarker, marker) {
        editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);
        var options = {
            position: 'topleft',
            draw: {
                toolbar: toolbar,
                polyline: polyline,
                polygon: polygon,
                circle: circle,
                rectangle: rectangle,
                circlemarker: circlemarker,
                marker: marker,
                remove: {},
            }
        };
      //  drawControl = new L.Control.Draw(options);
      //  map.addControl(drawControl);
        new L.Draw.Polyline(map, {}).enable();

     //   handleMapEvent(drawControl.getContainer(), map);
    }

    /**
     * 初始绘制点线面函数
     */
    var drawControllerInit = function (type){
        typeM = type;
        if(drawControl){
            drawControl.disable();
        }
        if(layer_){
            layer_.remove();
        }
        switch (type) {
            case "polyline":
                drawControl = new L.Draw.Polyline(map, {
                    icon:L.icon({iconUrl : './static/img/dian_ding.png', iconSize : [12, 15]})
                });
                drawControl.enable();
           //     drawing();
                break;
            case "polygon":
                drawControl =   new L.Draw.Polygon(map, {
                    icon:L.icon({iconUrl : './static/img/dian_ding.png', iconSize : [12, 15]})
                });
                drawControl.enable();
            //    drawing();
                break;
             case "point":
                drawControl = new L.Draw.Marker(map, {
                    icon:L.icon({iconUrl : './static/img/dian_ding.png', iconSize : [12, 15]})
                });
                drawControl.enable();
             //   drawing();
                break;
            case "circle":
                drawControl = new L.Draw.Circle(map, {});
                drawControl.enable();
             //   drawing();
                break;
        
            default:
                break;
        }
    }


    /**
     * 绘制完成回调函数
     */
    function drawing(){
        map.on(L.Draw.Event.CREATED, function (e) {
            var type = e.layerType,
                layer = e.layer;
            geo = layer.toGeoJSON();
            coordinate = geo.geometry.coordinates;
            editableLayers.addLayer(layer);
            layer_ = layer;
         //   console.log(layer)
         //   console.log(geo)
            switch (typeM) {
                case "polyline":
                     var length = turf.length(geo, {units: 'kilometers'});
                     length = length.toFixed(2);
                     if(_vue){
                        _vue.$message(length +"千米")
                     }
                   //  console.log(length +"千米");
                    break;
                case "polygon":
                    var area = turf.area(geo) / 1000000;
                    area = area.toFixed(2);
                    if(_vue){
                        _vue.$message(area +"平方千米")
                     }
                   //  console.log(area)
                     break;
                case "point":
                    if(_vue){
                        _vue.$message(coordinate[0] +" "+ coordinate[1])
                    }
                  //  console.log(coordinate)
                    break;
                case "circle":
                  //  console.log(geo)
                  //采用turf绘制 圆 再返回geojson
                    var center = [coordinate[0], coordinate[1]];
                    var radius = layer.getRadius() / 1000;
                  //  console.log(radius)
                  //  console.log(layer.getBounds())
                    var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
                    var circle = turf.circle(center, radius, options);
             //       console.log(circle)
                    geo = circle;
                    break;
            
                default:
                    break;
            }
        });
    }
   

    var clearLayers = function(){
        editableLayers.clearLayers();
        geo = null;
      //  console.log(drawControl);
        if(drawControl){
         //   console.log("disable");
            drawControl.disable();
        }
    }

    var returnLayerG =function (){
        return geo;
    }

    var meature ={
        "drawController":drawControllerInit,
        clearLayers:clearLayers,
        getLayerDrawed:returnLayerG //绘制的几何geojson

    }
    return meature;
}