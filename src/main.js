// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import htmlToPdf from './htmlToPdf';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.less';
import './assets/css/component.less';
import 'babel-polyfill';
import './assets/js/common' //引入通用方法
import axios from 'axios';
import './assets/css/iconFont/iconfont.css' //引入字体图标样式
import Compontents from '@/components'
import slDatePicker from './components/sl-data-picker'
import store from './vuex/store'; //引入store.js
import echarts from 'echarts';
import paramsObj from './assets/js/paramsConfig.js' //请求参数配置函数引入
Vue.prototype.paramsObj = paramsObj;
import toolObj from './assets/js/tools';
Vue.prototype.toolObj = toolObj
Vue.use(htmlToPdf)
Vue.use(Compontents)
Vue.use(ElementUI)
Vue.use(slDatePicker)
Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$echarts = echarts;
Vue.config.silent = true
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App,
    },
    template: '<App/>'
});
const whiteList = [] // 免登录白名单

router.beforeEach((to, from, next) => {
    if (toolObj.getCookie('token') && toolObj.getCookie('token') != '') { // determine if there has token
        /* has token*/

        if (to.path === '/home') {
            next({ path: '/home' })
        }
        next()
    } else {

        /* has no token*/
        window.location.href = "http://116.131.7.1:21300/Intelligent/#/";
        // if (to.path === '/login') { //这就是跳出循环的关键
        //     next()
        // } else {
        //     next('/login')
        // }

    }
})