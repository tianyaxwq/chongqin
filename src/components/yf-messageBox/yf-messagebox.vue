<template>
  <transition name="msgbox-fade">
    <div class="yf-message-box__wrapper" v-show="visible">
      <div class="yf-message-mask" @click.stop="close"></div>
      <div class="yf-message-box">
        <button class="message_lose-btn" @click="close"><i class="iconfont icon-guanbi1"></i></button>
        <div class="yf-message_content">
          <i class="iconfont icon-tixing-b"></i>
          <span class="yf-message_title">{{title}}</span>
          <span class="yf-message_message">{{message}}</span>
          <div class="yf-message_btns">
            <button type="button" class="yf-message_cancel" @click="cancelClick">{{cancelText}}</button>
            <button type="button" class="yf-message_success" @click="successClick">{{successText}}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'yf-message-box',
    data() {
      return {
        visible: false,
        title: '是否删除该数据？',
        message: '',
        cancelText: '取消',
        successText: '删除',
        cancel:null,
        success:null
      }
    },
    methods: {
      close() {
        if (!this.visible) {
          return false;
        }
        this.visible = false;
        setTimeout(()=>{
          this.$el.parentNode.removeChild(this.$el);
        },500)
      },
      cancelClick(){
        this.callback && this.callback();
        this.close();
      },
      successClick(){
        this.callback && this.callback('confirm');
        this.close();
      },
      keydown(e) {
        if (e.keyCode === 27) { // esc关闭消息
          this.close();
        }
      },
    },
    created(){
      document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy(){
      document.removeEventListener('keydown', this.keydown);
    }
  }
</script>
<style scoped lang="less">
  .yf-message-box__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    &:after {
      content: "";
      display: inline-block;
      height: 100%;
      width: 0;
      vertical-align: middle;
    }
    .yf-message-mask {
      position: fixed;
      z-index: 3001;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .5;
      background: #000;
    }
    .yf-message-box {
      display: inline-block;
      width: 328px;
      height: 300px;
      vertical-align: middle;
      background-color: #fff;
      font-size: 18px;
      text-align: left;
      overflow: hidden;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      overflow: inherit;
      position: relative;
      border-radius: 0;
      border: 2px solid #dbeff8;
      box-shadow: 0 0 10px rgba(3, 49, 102, .2);
      z-index: 3002;
      .message_lose-btn {
        display: inline-block;
        width: 26px;
        height: 26px;
        line-height: 28px;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        outline: none;
        cursor: pointer;
        background: #ECF4FC;
        &:hover {
          background: #f8b1b1;
          > i.iconfont {
            color: #fff;
          }
        }
        > i.iconfont {
          font-size: 12px;
          color: #1a1a1a;
        }
      }
      .yf-message_content {
        margin-top: 38px;
        text-align: center;
        > i.iconfont {
          color: #FF720D;
          font-size: 55px;
        }
        > span {
          display: block;
        }
        .yf-message_title {
          margin-top: 18px;
          font-size: 18px;
          color: #FF720D;
        }
        .yf-message_message {
          margin-top: 14px;
          font-size: 14px;
          color: #666666;
        }
        .yf-message_btns {
          text-align: center;
          margin-top: 47px;
          button {
            display: inline-block;
            width: 86px;
            height: 30px;
            line-height: 31px;
            text-align: center;
            border: none;
            outline: none;
            cursor: pointer;
            background: inherit;
          }
          button + button {
            margin-left: 20px;
          }
          .yf-message_cancel {
            color: #166bce;
            border: 1px solid #166bce;
            &:hover {
              background: #166bce;
              color: #fff;
            }
          }
          .yf-message_success {
            color: #fff;
            background: -webkit-linear-gradient(left, #009cff, #0b61ff); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(right, #009cff, #0b61ff); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right, #009cff, #0b61ff); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right, #009cff, #0b61ff); /* 标准的语法 */
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#009cff', endColorstr='#0b61ff', GradientType=0); /* ie兼容 */
            &:hover {
              background: -webkit-linear-gradient(left, #0fa2ff, #196aff); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(right, #0fa2ff, #196aff); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(right, #0fa2ff, #196aff); /* Firefox 3.6 - 15 */
              background: linear-gradient(to right, #0fa2ff, #196aff); /* 标准的语法 */
              filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0fa2ff', endColorstr='#196aff', GradientType=0); /* ie兼容 */
            }
            &:active {
              background: -webkit-linear-gradient(left, #0093f0, #0a5bf0); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(right, #0093f0, #0a5bf0); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(right, #0093f0, #0a5bf0); /* Firefox 3.6 - 15 */
              background: linear-gradient(to right, #0093f0, #0a5bf0); /* 标准的语法 */
              filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0093f0', endColorstr='#0a5bf0', GradientType=0); /* ie兼容 */
            }
          }
        }
      }
    }
  }
</style>
