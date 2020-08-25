import Vue from 'vue'
import YfMessageBox from './yf-messagebox'

const messageBox = Vue.extend(YfMessageBox);

let instance, currentMsg;

const showMessage = (message, title, dataC) => {
  if (dataC) {
    if (dataC.successText)
      var successText = dataC.successText;
    if (dataC.cancelText)
      var cancelText = dataC.cancelText;
  }

  instance = new messageBox({
    data: {
      message:message?message:'点击删除将永久删除该数据, 是否继续？',
      title:title?title:'警告',
      successText:successText?successText:'删除',
      cancelText:cancelText?cancelText:'取消'
    }
  }).$mount();
  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true
  })
};

const defaultCallback = (action) => {
  if (action === 'confirm') {
    currentMsg.resolve('confirm');
  }
  currentMsg.reject('cancle');
};

YfMessageBox.install = (message, title, dataC) => {
  messageBox.prototype.callback = defaultCallback;
  let pro = new Promise((resolve, reject) => {
    currentMsg = {
      resolve,
      reject
    };
    showMessage(message, title, dataC);
  });
  return pro;
};

export default YfMessageBox;
