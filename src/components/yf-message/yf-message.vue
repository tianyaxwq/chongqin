<template>
  <transition name="yf-message-fade">
    <div
      :class="[
        'yf-message',
        type ? `yf-message--${ type }` : ''
      ]"
      v-if="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert">
      <div class="yf-message-inner">
        <i :class="['iconfont',typeClass]"></i>
        <slot>
          <p class="yf-message__content">{{ message }}</p>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>

  export default {
    name: 'yf-message',
    data() {
      return {
        visible: false,
        message: '',
        time: 2000,
        type: 'info',
        timer: null,
      }
    },
    computed: {
      typeClass() {
        if (this.type == 'info') {
          return 'icon-tixing-a'
        } else if (this.type == 'success') {
          return 'icon-chenggong-a'
        } else {
          return 'icon-shibai-a'
        }
      }
    },

    watch: {},

    methods: {
      close() {
        this.visible = false;
        setTimeout(() => {
          this.destroyElement();
        }, 500)
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.time > 0) {
          this.timer = setTimeout(() => {
            this.close();
          }, this.time);
        }
      },
      keydown(e) {
        if (e.keyCode === 27) { // esc关闭消息
          this.close();
        }
      },
      destroyElement() {
        if (this.$el && this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el);
        }
      },
    },
    mounted() {
      this.startTimer();
      document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keydown);
    }
  }
</script>
<style scoped lang="less">
  .yf-message {
    width: 266px;
    height: 48px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    margin-left: -133px;
    top: 16px;
    background-color: #fff;
    .yf-message-inner {
      width: 100%;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
    }
    p {
      font-size: 13px;
      color: #1a1a1a;
    }
    &.yf-message--info {
      box-shadow: 0 0 2px rgba(208, 152, 31, 0.14);
      .yf-message-inner {
        box-shadow: 0 3px 8px rgba(208, 152, 31, 0.26);
      }
    }
    &.yf-message--success {
      box-shadow: 0 0 2px rgba(30, 207, 27, 0.14);
      .yf-message-inner {
        box-shadow: 0 3px 8px rgba(30, 207, 27, 0.26);
      }
    }
    &.yf-message--warning {
      box-shadow: 0 0 2px rgba(206, 22, 22, 0.14);
      .yf-message-inner {
        box-shadow: 0 3px 8px rgba(206, 22, 22, 0.26);
      }
    }
    .iconfont {
      font-size: 16px;
      margin-right: 8px;
      position: relative;
      top: 1px;
    }
    .icon-tixing-a {
      color: #cf961b;
    }
    .icon-chenggong-a {
      color: #22d01e;
    }
    .icon-shibai-a {
      color: #ce1616;
    }

  }

  .yf-message-fade-enter, .yf-message-fade-leave-to {
    top: -26px;
    opacity: 0;
  }

  .yf-message-fade-enter-active {
    transition: all .5s;
  }

  .yf-message-fade-leave-active {
    transition: all .3s;
  }
</style>
