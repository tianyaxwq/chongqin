import Vue from 'vue'
import Message from './yf-message'

const messageBox = Vue.extend(Message);

Message.install = function (options, type) {
  if (options === undefined || options === null) {
    options = {
      message: ''
    }
  } else if (typeof options === 'string' || typeof options === 'number') {
    options = {
      message: options
    };
    if (type != undefined && options != null) {
      options.type = type;
    }
  }
  let instance = new messageBox({
    data: options
  }).$mount();
  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true
  })
};
Message.install.success = function (options, time) {
  options = {
    type: 'success',
    message: options
  };
  if (time) {
    options.time = time;
  }
  let instance = new messageBox({
    data: options
  }).$mount();
  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true
  })
};
Message.install.warning = function (options, time) {
  options = {
    type: 'warning',
    message: options
  };
  if (time) {
    options.time = time;
  }
  let instance = new messageBox({
    data: options
  }).$mount();
  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true
  })
};
Message.install.info = function (options, time) {
  options = {
    type: 'warning',
    message: options
  };
  if (time) {
    options.time = time;
  }
  let instance = new messageBox({
    data: options
  }).$mount();
  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true
  })
};
export default Message
