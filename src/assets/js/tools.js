let toolObj = {
    GetQueryString: function(name) {   
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");   
        var r = window.location.search.substr(1).match(reg);   
        if (r != null)        return decodeURIComponent(r[2]);   
        return null;
    },
    //cookie设置

    setCookie: function(key, value, t) {   
        var cookie_key = key;   
        var oDate, times;   
        if (!t) {
            oDate = new Date(0x7fffffff * 1e3);
        } else {       
            oDate = new Date();       
            times = +new Date();       
            oDate.setSeconds(times + Number(t));   
        }   
        document.cookie = cookie_key + '=' + value + ';expires=' + oDate.toGMTString() + ';path=/';
    },

    getCookie: function(key) {   
        var cookie_key = key;   
        var arr1 = document.cookie.split('; ');   
        for (var i = 0; i < arr1.length; i++) {        var arr2 = arr1[i].split('=');        if (arr2[0] == cookie_key) {            return decodeURI(arr2[1]);        }    }
    },

    removeCookie: function(key) {   
        var cookie_key = key;   
        document.cookie = cookie_key + '= ;expires=-1; path=/';
    },
    parseFormData(obj, pObj) {
        for (let i in obj) {
            if (obj[i] != null && !this.isArray(obj[i])) {
                pObj.append(i, obj[i])
            }
        };

    },
    isArray(o) {

        return Object.prototype.toString.call(o) == '[object Array]';

    }
}

export default toolObj;