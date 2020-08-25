<script>
  import TabBar from './tab-bar';
  import { addResizeListener, removeResizeListener } from '../../../assets/js/resize-event.js';

  function noop() {}
  const firstUpperCase = str => {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  };

  export default {
    name: 'TabNav',

    components: {
      TabBar
    },

    inject: ['rootTabs'],

    props: {
      panes: Array,
      currentName: String,
      editable: Boolean,
      onTabClick: {
        type: Function,
        default: noop
      },
      onTabRemove: {
        type: Function,
        default: noop
      },
      type: String,
      stretch: Boolean
    },

    data() {
      return {
        scrollable: false,
        navOffset: 0,
        isFocus: false,
        focusable: true
      };
    },

    computed: {
      navStyle() {
        const dir = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'X' : 'Y';
        return {
          transform: `translate${dir}(-${this.navOffset}px)`
        };
      },
      sizeName() {
        return ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
      }
    },

    methods: {
      scrollPrev() {
        const containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
        const currentOffset = this.navOffset;

        if (!currentOffset) return;

        let newOffset = currentOffset > containerSize
          ? currentOffset - containerSize
          : 0;

        this.navOffset = newOffset;
      },
      scrollNext() {
        const navSize = this.$refs.nav[`offset${firstUpperCase(this.sizeName)}`];
        const containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
        const currentOffset = this.navOffset;

        if (navSize - currentOffset <= containerSize) return;

        let newOffset = navSize - currentOffset > containerSize * 2
          ? currentOffset + containerSize
          : (navSize - containerSize);

        this.navOffset = newOffset;
      },
      scrollToActiveTab() {
        if (!this.scrollable) return;
        const nav = this.$refs.nav;
        const activeTab = this.$el.querySelector('.is-active');
        if (!activeTab) return;
        const navScroll = this.$refs.navScroll;
        const activeTabBounding = activeTab.getBoundingClientRect();
        const navScrollBounding = navScroll.getBoundingClientRect();
        const maxOffset = nav.offsetWidth - navScrollBounding.width;
        const currentOffset = this.navOffset;
        let newOffset = currentOffset;

        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
        }

        newOffset = Math.max(newOffset, 0);
        this.navOffset = Math.min(newOffset, maxOffset);
      },
      update() {
        if (!this.$refs.nav) return;
        const sizeName = this.sizeName;
        const navSize = this.$refs.nav[`offset${firstUpperCase(sizeName)}`];
        const containerSize = this.$refs.navScroll[`offset${firstUpperCase(sizeName)}`];
        const currentOffset = this.navOffset;

        if (containerSize < navSize) {
          const currentOffset = this.navOffset;
          this.scrollable = this.scrollable || {};
          this.scrollable.prev = currentOffset;
          this.scrollable.next = currentOffset + containerSize < navSize;
          if (navSize - currentOffset < containerSize) {
            this.navOffset = navSize - containerSize;
          }
        } else {
          this.scrollable = false;
          if (currentOffset > 0) {
            this.navOffset = 0;
          }
        }
      },
      changeTab(e) {
        const keyCode = e.keyCode;
        let nextIndex;
        let currentIndex, tabList;
        if ([37, 38, 39, 40].indexOf(keyCode) !== -1) { // 左右上下键更换tab
          tabList = e.currentTarget.querySelectorAll('[role=tab]');
          currentIndex = Array.prototype.indexOf.call(tabList, e.target);
        } else {
          return;
        }
        if (keyCode === 37 || keyCode === 38) { // left
          if (currentIndex === 0) { // first
            nextIndex = tabList.length - 1;
          } else {
            nextIndex = currentIndex - 1;
          }
        } else { // right
          if (currentIndex < tabList.length - 1) { // not last
            nextIndex = currentIndex + 1;
          } else {
            nextIndex = 0;
          }
        }
        tabList[nextIndex].focus(); // 改变焦点元素
        tabList[nextIndex].click(); // 选中下一个tab
        this.setFocus();
      },
      setFocus() {
        if (this.focusable) {
          this.isFocus = true;
        }
      },
      removeFocus() {
        this.isFocus = false;
      },
      visibilityChangeHandler() {
        const visibility = document.visibilityState;
        if (visibility === 'hidden') {
          this.focusable = false;
        } else if (visibility === 'visible') {
          setTimeout(() => {
            this.focusable = true;
          }, 50);
        }
      },
      windowBlurHandler() {
        this.focusable = false;
      },
      windowFocusHandler() {
        setTimeout(() => {
          this.focusable = true;
        }, 50);
      }
    },

    updated() {
      this.update();
    },

    render(h) {
      const {
        type,
        panes,
        editable,
        stretch,
        onTabClick,
        onTabRemove,
        navStyle,
        scrollable,
        scrollNext,
        scrollPrev,
        changeTab,
        setFocus,
        removeFocus
      } = this;
      const scrollBtn = scrollable
        ? [
        <span class={['el-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled']} on-click={scrollPrev}><i class="el-icon-arrow-left"></i></span>,
    <span class={['el-tabs__nav-next', scrollable.next ? '' : 'is-disabled']} on-click={scrollNext}><i class="el-icon-arrow-right"></i></span>
    ] : null;

      const tabs = this._l(panes, (pane, index) => {
        let tabName = pane.name || pane.index || index;
        const closable = pane.isClosable || editable;

        pane.index = `${index}`;

        const btnClose = closable
          ? <span class="el-icon-close" on-click={(ev) => { onTabRemove(pane, ev); }}></span>
      : null;

        const tabLabelContent = pane.$slots.label || pane.label;
        const tabindex = pane.active ? 0 : -1;
        return (
          <div
      class={{
          'el-tabs__item': true,
            [`is-${ this.rootTabs.tabPosition }`]: true,
            'is-active': pane.active,
            'is-disabled': pane.disabled,
            'is-closable': closable,
            'is-focus': this.isFocus
        }}
        id={`tab-${tabName}`}
        key={`tab-${tabName}`}
        aria-controls={`pane-${tabName}`}
        role="tab"
        aria-selected={ pane.active }
        ref="tabs"
        tabindex={tabindex}
        refInFor
        on-focus={ ()=> { setFocus(); }}
        on-blur ={ ()=> { removeFocus(); }}
        on-click={(ev) => { removeFocus(); onTabClick(pane, tabName, ev); }}
        on-keydown={(ev) => { if (closable && (ev.keyCode === 46 || ev.keyCode === 8)) { onTabRemove(pane, ev);} }}
      >
        {tabLabelContent}
        {btnClose}
      </div>
      );
      });
      return (
        <div class={['el-tabs__nav-wrap', scrollable ? 'is-scrollable' : '', `is-${ this.rootTabs.tabPosition }`]}>
      {scrollBtn}
    <div class={['el-tabs__nav-scroll']} ref="navScroll">
        <div
    class={['el-tabs__nav', `is-${ this.rootTabs.tabPosition }`, stretch && ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'is-stretch' : '']}
      ref="nav"
      style={navStyle}
      role="tablist"
      on-keydown={ changeTab }
        >
        {!type || type === 'border-card'? <tab-bar tabs={panes} type={type}></tab-bar> : null}
      {tabs}
    </div>
      </div>
      </div>
    );
    },

    mounted() {
      addResizeListener(this.$el, this.update);
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
      window.addEventListener('blur', this.windowBlurHandler);
      window.addEventListener('focus', this.windowFocusHandler);
    },

    beforeDestroy() {
      if (this.$el && this.update) removeResizeListener(this.$el, this.update);
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      window.removeEventListener('blur', this.windowBlurHandler);
      window.removeEventListener('focus', this.windowFocusHandler);
    }
  };
</script>
<style  lang="less">
 /* .el-tabs__item.is-active:after{el-tabs__active-bar

  }*/
  .el-tabs__header{
    height: 30px;
  }
  .el-tabs__nav-wrap{
    margin-top: 2px;
    overflow: visible;
  }
  .el-tabs__nav-scroll{
    overflow: visible;
  }
 .el-tabs__nav-wrap::after{
   background: #c6d1de;
   height: 1px;
 }
  .el-tabs__active-bar{
    background: #166bce;
    display: none;
  }
 .el-tabs__item.is-active{
   color: #166bce;
 }
 .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
   color: #fff;
   background: #166bce;
   position: relative;
   &:hover{
     color: #fff !important;
   }
   &:after{
    border-top: 6px solid #166bce;
   }
 }
 .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover,
 .el-tabs__item:hover{
   color: #166bce;
 }
 .el-tabs--top .el-tabs__item.is-top:nth-child(2){
   padding-left: 20px;
 }
 .el-tabs--top .el-tabs__item.is-top:last-child{
   padding-right: 20px;
 }
 .el-tabs--card>.el-tabs__header .el-tabs__active-bar{
   display: inline;
 }
 .el-tabs--border-card>.el-tabs__header .el-tabs__item{
   border-right-color: #d6e3f2;
   border-bottom-color: #d6e3f2;
   background-color: #fff;
   color: #1a1a1a;
   margin: -1px 0 0;
   position: relative;
    &:after{
     content: '';
     width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #fff;
     position: absolute;
     left: 50%;
     transition: all 0.5s;
     transform: translateX(-5px);
     bottom: -7px;
   }
 }
  .el-tabs__active-bar.is-border-card{
    bottom: auto;
    top: 0;
  }
 .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
   border-left-color: transparent;
   border-bottom-color: transparent;
 }
 .el-tabs--border-card{
   border: 1px solid #d6e3f2;
   box-shadow: none;
 }
  .el-tabs--border-card>.el-tabs__header{
    border-bottom: 1px solid #d6e3f2;
  }
 .el-tabs--card>.el-tabs__header{
   border-bottom: none;
 }
 .el-tabs--card>.el-tabs__header .el-tabs__item{
   border-color: #c6d1de;
   border-top: 1px solid #c6d1de;
 }
 .el-tabs--card>.el-tabs__header .el-tabs__item.is-active,
 .el-tabs--card > .el-tabs__header .el-tabs__item.is-active:first-child{
   border-color: #166bce;
 }
 .el-tabs--card > .el-tabs__header .el-tabs__item.is-active:last-child{
   border-color: #166bce;
 }
 .el-tabs--card>.el-tabs__header .el-tabs__item.is-active+.el-tabs__item{
   border-left: 1px solid #166bce;
 }
 .el-tabs--card>.el-tabs__header .el-tabs__item:first-child{
   border-left: 1px solid #c6d1de;
 }
 .el-tabs--card .el-tabs__item.is-top:last-child{
   border-right: 1px solid #c6d1de;
 }
 .el-tabs--card>.el-tabs__header .el-tabs__nav{
   border: none;
   border-radius: 0;
 }
 .el-tabs--card .el-tabs__item.is-active{
   background: #166bce;
   color: #fff;
 }
</style>
