import calender from './calender';

/* istanbul ignore next */
calender.install = function(Vue) {
  Vue.component(calender.name, calender);
};

export default calender;
