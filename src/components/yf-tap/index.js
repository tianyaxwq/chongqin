import yfTab from './src/yf-tap';

/* istanbul ignore next */
yfTab.install = function(Vue) {
    Vue.component(yfTab.name, yfTab);
};

export default yfTab;