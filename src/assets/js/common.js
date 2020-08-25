/* 时间格式化 format(yyyy-MM-dd hh:mm:ss)*/
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //月
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分钟
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
//最多保留两位小数（去除小数中最后的0）
Math.retain = function (num) {
  var n = parseFloat(num) + '';
  var o = n.indexOf('.');
  if (o !== -1) {
    var m = n.substring(o + 1);
    if (m.length > 2) {
      return parseFloat(n.substring(0, (o + 4))).toFixed(2);
    } else {
      return num;
    }
  } else {
    return num;
  }
}


