//页面接口请求参数 配置
import config_P from '../js/params';
//协议模块请求参数配置
// 1、查询参数
let GetData_P = function(select_name) {
    return {
        "assembleSql": {
            "select": select_name,
        }
    }
};

//3、查询列表数据参数
let GetPageData_P = function(pageName, pageNumber, pageSize, c_arr, isPagi) {
    let c_params = new Object;
    //获取当前页面参数配置详情
    for (let key in config_P) {
        if (pageName == key) {
            c_params = JSON.parse(JSON.stringify(config_P[pageName]))
        }
    };
    if (isPagi) {
        c_params.pageObject.pageNumber = pageNumber;
        c_params.pageObject.pageSize = pageSize;
    }
    c_params.queryCondition.content = c_arr;
    return c_params;
}
let setWaterLev = function(n) {
    if (n == 1) {
        return 'Ⅰ类'
    } else if (n == 2) {
        return 'Ⅱ类'
    } else if (n == 3) {
        return 'Ⅲ类'
    } else if (n == 4) {
        return 'Ⅳ类'
    } else if (n == 5) {
        return 'Ⅴ类'
    } else if (n == 6) {
        return '劣Ⅴ类'
    } else {
        return '-'
    }
};

let contrast = function(onneself, target) {
    Number(onneself)
    Number(target)
    let colorStr = '#FF0000'
    if (onneself > target) {
        return colorStr
    } else {
        return ''
    }
}
//3、查询列表数据参数
// let GetPageData_P = function (pageName,pageNumber,pageSize,c_arr) {
//   let c_params=new Object;
//   //获取当前页面参数配置详情
//   for(let key in  config_P){
//     if(pageName == key){
//       c_params = JSON.parse(JSON.stringify(config_P[pageName]))
//     }
//   };
//   //获取默认的查询参数配置
//   let query =c_params.queryCondition.property;
//   let newquery=[];
//   let newcontent=[];
//   //根据传进来的参数是否为空,创建新的参数数组.为空直接过滤;
//   for(let i in c_arr){
//       if(c_arr[i] != ''){
//         newquery.push(query[i]);
//         newcontent.push(c_arr[i]);
//       }
//   };
//   //设置页码,当前页数参数
//   c_params.pageObject.pageNumber=pageNumber;
//   c_params.pageObject.pageSize=pageSize;
//   c_params.queryCondition.property=newquery;
//   c_params.queryCondition.content=newcontent;
//   //通过新的参数参数数组长度判断查询条件数组
//   if(newquery.length == 0){
//     //当参数全部为空时
//     let obj = new Object();
//     obj={
//       "assembleSql":c_params.assembleSql,
//       "pageObject":c_params.pageObject
//     };
//     return obj
//   }else if(newquery.length == 1){
//     c_params.assembleCondition=['0'];
//     return c_params
//   }
//   else if(newquery.length == 2){
//     c_params.assembleCondition=["0 and 1"];
//     return c_params
//   }
//   else if(newquery.length == 3){
//     c_params.assembleCondition=["0 and 1","_0 and 2"];
//     return c_params
//   }      
// }
export default {
    GetData_P,
    GetPageData_P,
    setWaterLev,
    contrast
}