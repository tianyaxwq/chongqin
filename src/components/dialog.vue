<template>
  <transition name="dialog">
    <div v-show="visible" class="sl-dialog" :class="{'dialog-mask':mask}" :style="[setMaskStyle,{zIndex:zIndex}]">
        <div class="sl-dialog-frame" :style="setStyle">
          <div class = "sl-dialog-content">
              <button class="sl-close-btn" @click="closeDialog()"> ╳ </button>
              <div class="sl-dialog-header"><!--@mousedown="moveDialogBox"-->
                <slot name="header">
                  <h4 class="sl-dialog-title">
                    {{ title }}
                  </h4>
                  <p v-if="subtitle" class="el-dialog-subtitle">
                    {{ subtitle }}
                  </p>
                </slot>
              </div>
              <div class="sl-dialog-section">
                <slot></slot>
              </div>
              <slot name="footer">

              </slot>
          </div>
        </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "sl-dialog",
        // props:['mask','area','visible'],
        props:{
          mask:{
            type:Boolean,
            default:false
          },
          area:{
            type:Array,
            default:[180,400]
          },
          visible:{
            type:Boolean,
            default:false
          },
          title:{
            type: String,
            default:'标题'
          },
          subtitle:{
            type: [String,Boolean],
            default:false
          }
        },
        data(){
            return {
              width:'auto',
              height:'auto',
              zIndex:999
            }
        },
        methods:{
          closeDialog(){
            this.$emit('closeDialog');
          },
          dialogMask(){//是否显示遮罩
          //this.mask=false;
            if(this.mask){
              let width = document.documentElement.clientWidth;
              let height = document.documentElement.clientHeight;
              let dialogMask = document.getElementsByClassName('sl-dialog')[0];
              dialogMask.style.width = width + 'px';
              dialogMask.style.height = height + 'px';
              dialogMask.style.margin = 0;
            }
          },
          // moveDialogBox(event){
          //   let dialog = '';
          //   if(this.mask){
          //     dialog = event.currentTarget.parentNode.parentNode;
          //   }else{
          //     dialog = event.currentTarget.parentNode.parentNode.parentNode;
          //   }
          //   // event.currentTarget.addEventListener("mousemove",this.mouseMoveEvent,false);
          //   let disx = event.pageX - dialog.offsetLeft;
          //   let disy = event.pageY - dialog.offsetTop;
          //
          //   document.onmousemove = function (e){
          //     dialog.style.marginLeft = 0;
          //     dialog.style.marginTop = 0;
          //     dialog.style.left = e.pageX - disx+'px';
          //     dialog.style.top = e.pageY - disy+'px';
          //   };
          //   document.onmouseup = function(){
          //     document.onmousemove = document.onmouseup = null;
          //   };
          // },
          // stopMoveDialogBox(event){
          //   let dialog = '';
          //   if(this.mask){
          //     dialog = event.currentTarget.parentNode.parentNode;
          //   }else{
          //     dialog = event.currentTarget.parentNode.parentNode.parentNode;
          //   }
          //   event.currentTarget.removeEventListener("mousemove",this.mouseMoveEvent,false);
          // },
          // mouseMoveEvent(event){
          //   console.log(event.currentTarget);
          // }
        },
        computed:{
          setMaskStyle(){//计算有蒙板时宽高
            let style = {};
            if(!this.mask){
              style.width = this.area[0] + 'px';
              style.marginLeft =  -(parseFloat(this.area[0])/2) + 'px';
              if(this.area.length >= 2){
                style.height = this.area[1] + 'px';
                //style.marginTop =  -(parseFloat(this.area[1])/2) + 'px';
              }else{
                style.height = 'auto';
              }
            }
            return style;
          },
          setStyle(){
            let style = {};
            if(this.mask){
              style.width = this.area[0] + 'px';
              style.marginLeft =  -(parseFloat(this.area[0])/2) + 'px';
              if(this.area.length >= 2){
                style.height = this.area[1] + 'px';
                //style.marginTop =  -(parseFloat(this.area[1])/2) + 'px';
              }else{
                style.height = 'auto';
              }
            }
            return style;
          }
        },
        watch:{
          visible(val){
            this.zIndex++;
            if(localStorage.getItem("dialogZIndex")){
              let dialogZIndex = parseInt(localStorage.getItem("dialogZIndex"))+1;
              localStorage.setItem("dialogZIndex",dialogZIndex);
              this.zIndex = dialogZIndex;
            }else{
              localStorage.setItem("dialogZIndex",999);
            }
          }
        },
        created(){
          var _this = this;
          window.onresize = function(){
            _this.dialogMask();
          }

        },
        mounted(){
          this.dialogMask();
          // this.dialogArea();
        },
    }

</script>

<style scoped lang="less">
.sl-dialog{
  z-index: 999;
  position: fixed;
  top: 10%;
  left: 50%;
}
.sl-dialog.dialog-mask{
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: rgba(0,0,0,0.5);
  .sl-dialog-frame{
      position: relative;
      height: 180px;
      width: 400px;
      top: 10vh;
      left: 50%;
      margin-left: -200px;
  }
}
.sl-dialog-frame{
  width: 100%;
  height: 100%;
  background: #dbeff8;
  box-shadow: 0 4px 5px rgba(0,0,0,0.26);
  padding: 4px;
  transition: all 0.2s;
}
.sl-dialog-content{
  height: 100%;
  width: 100%;
  position: relative;
  background: #fff;
  box-shadow: 0 2px 3px rgba(0,0,0,0.14);
}
.sl-close-btn{
  position: absolute;
  font-size: 12px;
  top: 0;
  right: 0;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
  z-index: 99;
}
.sl-close-btn:hover{
  background: #f8b1b1;
  color: #fff;
}
.sl-dialog-header{
  text-align: center;
  padding: 6px 0;
/*  cursor: move;*/
  user-select: none;
  .sl-dialog-title{
    line-height: 24px;
    font-size: 16px;
    color: #505e66;
  }
  .el-dialog-subtitle{
    color: #505e66;
    font-size: 13px;
    line-height: 24px;
  }
}
.sl-dialog-section{
  min-height: 80px;
  border-top: 1px solid #d6e3f2;
}

/* 弹窗显示与隐藏动画 */
.dialog-enter,
.dialog-leave-to{
  opacity: 0;
  .sl-dialog-frame{
    transform: translate(0, -20px);
  }
}
.dialog-enter-active,.dialog-leave-active{
  transition: all 0.2s;
}
.dialog-enter-to,.dialog-leave{
  opacity: 1;
  .sl-dialog-frame{
    transform: translate(0, 0);
  }
}
</style>
