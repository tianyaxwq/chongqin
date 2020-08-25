import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);

function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        switch (error.response.status) {
            // 返回401，清除token信息并跳转到登录页面
            case 401:
                localStorage.removeItem('token');
                window.location.href = "http://116.131.7.1:21300/Intelligent/#/";
        }
        // 返回接口返回的错误信息
        return Promise.reject(error.response.data);
    }
});
function callAsyncMethod(callback) {
    callback()
};
const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })],
    state: {
        stationTypeName: false,
        showleftTree: true, //控制页面最左边树结构盒子显示隐藏
        stationInfo: [],
        count: 0,
        menudata: [],
        menuIndex: 0, //主页面一级导航选中状态
        navTitle: '', //主页面左上角导航小标题
        levmenuIndex: 0, //主页面二级导航选中状态
        levMenudata: [], // 主页面二级导航数据
        childMenu: '', //三级导航选中状态
        isChange: '',
        siteMn: '', //站点Mn号
        stationMessage: {},
        detailTree: '',
        strictlyinfo: [],
        showMoniReportlist: true,
        monitordataInfo: null,
    },
    getters: {

    },
    mutations: {
        setStationTypeName(state, val) {
            // 存入站点类型
            state.stationTypeName = val;
        },
        setStrictlyinfo(state, obj) {
            //判断传进来的参数是数组还是对象
            if (typeof obj && isNaN(obj.length)) {
                state.strictlyinfo = [];
                state.strictlyinfo.push(obj);
            } else {
                state.strictlyinfo = obj;
            };
            sessionStorage.setItem('strictlyinfo', JSON.stringify(state.strictlyinfo))
        },
        setMonitordataInfo(state, val) {
            state.monitordataInfo = val;
        },
        setshowMoniReportlist(state, val) {
            state.showMoniReportlist = val;
        },
        setMenudata(state, val) {
            state.menudata = val;
        },
        setDetailTree(state, val) {
            state.detailTree = val;
        },
        setStationMessage(state, val) {
            state.stationMessage = val;
        },
        setSiteMn(state, val) {
            state.siteMn = val;
        },
        setisChange(state, val) {
            state.isChange = val;
        },
        //设置公共树结构显示隐藏
        setShowlefttree(state, val) {
            state.showleftTree = val;
        },
        setMenuIndex(state, val) {
            state.menuIndex = val;
        },
        setNavTitle(state, val) {
            state.navTitle = val;
        },
        setLevmenuIndex(state, val) {
            state.levmenuIndex = val;
        },
        setLevMenudata(state, val) {
            state.levMenudata = val;
        },
        setChildMenu(state, val) {
            state.childMenu = val;
        },
        setStationinfo(state, obj) {
            //判断传进来的参数是数组还是对象
            if (typeof obj && isNaN(obj.length)) {
                state.stationInfo = [];
                state.stationInfo.push(obj);
            } else {
                state.stationInfo = obj;
            };
            sessionStorage.setItem('stationInfo', JSON.stringify(state.stationInfo))
        }
    },
    actions: {

    },
    modules: {

    }
});

export default store