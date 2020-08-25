//组件全局引入
import Vue from 'vue';
import yfDatastatusComponent from './yf-dataStatus/index.js'
import yfTapComponent from './yf-tap/index.js'
import yfTappane from './yf-tap/src/tab-pane.vue'
//import yfTreeComponent from './yf-tree/index.js'
import yfDropdowntreeComponent from './yf-dropdowntree/index.js'
import yfQuarterComponent from './yf-quarter/index.js'
import yfmessageComponent from './yf-message/index.js'
import yfmessageboxComponent from './yf-messageBox/index.js'
import calender from './calender/index.js'
// import slDataPicker from './sl-data-picker/index.vue'
Vue.prototype.$yfMessage = yfmessageComponent.install;
Vue.prototype.$yfConfirm = yfmessageboxComponent.install;
var components = [,
  yfDatastatusComponent,
  yfDropdowntreeComponent,
  yfQuarterComponent,
  yfTapComponent,
  calender,
  // slDataPicker
];
var  componentConfig = {
  install: function(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component);
    });
    // console.log(Vue)
     Vue.component(yfTappane.name, yfTappane);
    
  },

};

export default componentConfig;
