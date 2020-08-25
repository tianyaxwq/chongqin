import yfQuarter from './quarter';

/* istanbul ignore next */
yfQuarter.install = function(Vue) {
    Vue.component(yfQuarter.name, yfQuarter);
};

export default yfQuarter;