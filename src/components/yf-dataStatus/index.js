import yfDatastatus from './yf-dataStatus';

/* istanbul ignore next */
yfDatastatus.install = function(Vue) {
    Vue.component(yfDatastatus.name, yfDatastatus);
};

export default yfDatastatus;