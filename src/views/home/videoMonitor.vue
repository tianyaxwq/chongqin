<template>
  <div class="video-monitor"
  >
    <div class="video-panel-wrap">
      <div class="video-content"
           v-loading="videoLoading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.4)"
      >
        <object pluginspage="http://www.macromedia.com/go/getflashplayer"
                  <embed allowscriptaccess="always" allowfullscreen="true" quality="high" bgcolor="#FFF" wmode="transparent" src="https://open.ys7.com/sdk/js/1.3/ckplayer/ckplayer.swf" flashvars="f=rtmp://rtmp.open.ys7.com/openlive/71cc61f54e394cc494d3a071f31948f3&amp;c=0&amp;p=1&amp;i=https://open.ys7.com/sdk/js/1.3/demo.html&amp;lv=1&amp;loaded=loadHandler" width="100%" height="100%" name="myPlayerflashId" id="myPlayerflashId" align="middle" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></object>

      </div>

      <div class="video-info">
        <span class="video-name">奉贤站1#视频监控</span>
        <span class="video-state"><i class="normal-state"></i> 正常</span>
      </div>
    </div>
    <div class="video-menu">
      <div class="passage-and-history">
        <el-select v-model="value" popper-class="select-common-option" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="noticonsecondBtn" class="default-btn plain">历史视频</el-button>
      </div>
      <div class="base-control-fun">
         <h5><i></i> 控制</h5>
        <button class="cease-current-fun" type="button"><i class="cease-current-icon"></i> <span>停止当前</span></button>
        <button class="cease-all-fun" type="button"><i class="cease-all-icon"></i> <span>停止全部</span></button>
        <button class="snap-fun" type="button"><i class="snap-icon"></i> <span>本地抓拍</span></button>
        <button class="videotape-fun" type="button"><i class="videotape-icon"></i> <span>本地录像</span></button>
      </div>
      <div class="cloud-control-fun">
        <h5><i></i> 云台控制</h5>
        <div class="video-control" style="margin-top: 18px;">
          <button title="向上" class="top-control" @mousedown="ptzstart(0)" @mouseup="ptzstop(0)"><i></i></button>
          <button title="向右上" class="top-right-control" @mousedown="ptzstart(6)" @mouseup="ptzstop(6)"><i></i></button>
          <button title="向右" class="right-control" @mousedown="ptzstart(3)" @mouseup="ptzstop(3)"><i></i></button>
          <button title="向右下" class="right-bottom-control" @mousedown="ptzstart(7)" @mouseup="ptzstop(7)"><i></i></button>
          <button title="向下" class="bottom-control" @click="ptzstart(1)" @mouseup="ptzstop(1)"><i></i></button>
          <button title="向左下" class="bottom-left-control" @mousedown="ptzstart(5)" @mouseup="ptzstop(5)"><i></i></button>
          <button title="向左" class="left-control" @mousedown="ptzstart(2)" @mouseup="ptzstop(2)"><i></i></button>
          <button title="向左上" class="left-top-control" @mousedown="ptzstart(4)" @mouseup="ptzstop(4)"><i></i></button>
          <button title="返回" class="center-control"  @mouseup="ptzstop(0)"></button>
        </div>
        <div style="text-align: center; padding-top: 40px;">
          <el-button type="noticonsecondBtn" @click="exitFullScreen" style="margin: 0;">退出全屏</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "video-monitor",
        data(){
            return {
              videoLoading:true,
              options: [{
                value: '1',
                label: '通道一'
              }, {
                value: '2',
                label: '通道二'
              }, {
                value: '3',
                label: '通道三'
              }, {
                value: '4',
                label: '通道四'
              }, {
                value: '5',
                label: '通道五'
              }],
              value: '1',
              accessToken:''
            }
        },
        methods:{
          getaccessToken(){
            this.$http.get('/waterenvapi/video/accessToken',{

            }).then((response)=>{
                let dataJson = response.data;
                if(dataJson.code === 200){
                 this.accessToken = dataJson.content.info;
                 this.videoLoading = false;
                }
              }).catch((error)=>{
              this.videoLoading = false;
            });
          },
          ptzstart(direction){
            this.$http.get('/waterenvapi/video/ptzstart',{
              params:{
                accessToken: this.accessToken,
                direction:direction,
                speed:1
              }
            }).then((response)=>{

            }).catch((error)=>{

            });         
          },
          ptzstop(direction){
            this.$http.get('/waterenvapi/video/ptzstop',{
              params:{
                  accessToken: this.accessToken,
                  direction:direction,
                  speed:1
                }
              }).then((response)=>{

              }).catch((error)=>{

              });
          },
          //退出全屏
          exitFullScreen(){
            this.$emit('exitFullScreen',false);
          }
        },
        mounted(){
          this.getaccessToken();
        }
    }
</script>

<style  lang="less">
.video-monitor{
  height: 466px;
  padding: 8px;
  .video-panel-wrap{
    height: 100%;
    width: 524px;
    border: 3px solid #616e7e;
    background: #1a1a1a;
    float: left;
    position: relative;
    .video-content{
      height: calc(100% - 36px);
    }
    .video-info{
      height: 36px;
      line-height: 36px;
      background: #727f90;
      position: absolute;
      bottom: -3px;
      left: -3px;
      width: calc(100% + 6px);
      padding: 0 14px;
      .video-name{
        color: #fff;
      }
      .video-state{
        color: #fff;
        float: right;
        i{
          display: inline-block;
          vertical-align: middle;
          width: 14px;
          height: 14px;
          margin-bottom: 3px;
          border-radius: 50%;
        }
      }
      .normal-state{
        background: #24c768;
      }
      .drop-line-state{
        background: #ff0000;
      }
    }
  }
  .video-menu{
    height: 100%;
    float: left;
    width: calc(100% - 524px);
    padding-left: 8px;
  }
  .passage-and-history{
    margin-bottom: 4px;
    .el-select{
      width: 108px;
      vertical-align: top;
    }
    .default-btn{
      width: 108px;
      margin-left: 3px;
    }
  }
  .base-control-fun{
    margin-bottom: 4px;

    h5{
      font-size: 14px;
      color: #166bce;
      line-height: 26px;
      i{
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 8px;
        height: 8px;
        background: #166bce;
      }
    }
    button{
      border: 1px solid #c6d1de;
      height: 30px;
      line-height: 30px;
      width: 108px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background: transparent;
      outline: none;
      &>*{
        position: relative;
        z-index: 1;
      }
      i{
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        margin-bottom: 3px;
      }
    }
    button:before,button:after{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      transition: all 0.2s;
      z-index: 0;
    }
    button:before{
      background: #f2f6fa;
      top: 0;
      left: 0;
    }
    button:after{
      background: #e6edf4;
      top: 100%;
      left: 0;
    }
    button:hover:before{
      top: -100%;
    }
    button:hover:after{
      top: 0;
    }
    .cease-current-fun{
      margin-bottom: 8px;
      border-radius: 0 0 6px 0;
    }
    .cease-all-fun{
      margin-bottom: 8px;
      margin-left: 3px;
      border-radius: 0 0 0 6px;
    }
    .snap-fun{
      border-radius: 0 6px 0 0;
    }
    .videotape-fun{
      margin-left: 3px;
      border-radius: 6px 0 0 0;
    }
  }
  .cloud-control-fun{
    h5{
      font-size: 14px;
      color: #166bce;
      line-height: 26px;
      i{
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 8px;
        height: 8px;
        background: #166bce;
      }
    }
    .video-control{
      height: 184px;
      width: 184px;
      margin: 4px auto 0;
      background: url("../../assets/images/index/cloud-control-icon.png") no-repeat center center;
      position: relative;
      button{
        width: 22px;
        height: 14px;
        cursor: pointer;
        position: absolute;
        padding:0;
        margin: 0;
        background: none;
        border: none;
        outline: none;
        i{
          display: block;
          border: 10px solid #b1c0d1;
          border-top-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          margin-top: -10px;
        }
      }
      button:hover{
        i{
          border-bottom-color: #166bce;
        }
      }
      .top-control{
        left: 82px;
        top: 18px;
      }
      .top-right-control{
        left: 130px;
        top: 34px;
        transform: rotate(45deg);
      }
      .right-control{
        left: 152px;
        top: 83px;
        transform: rotate(90deg);
      }
      .right-bottom-control{
        left: 133px;
        top: 134px;
        transform: rotate(135deg);
      }
      .bottom-control{
        left: 81px;
        top: 156px;
        transform: rotate(180deg);
      }
      .bottom-left-control{
        left: 32px;
        top: 132px;
        transform: rotate(225deg);
      }
      .left-control{
        left: 15px;
        top: 85px;
        transform: rotate(-90deg);
      }
      .left-top-control{
        left: 37px;
        top: 39px;
        transform: rotate(-45deg);
      }
      .center-control{
        width: 32px;
        height: 32px;
        left: 50%;
        top: 50%;
        margin-left: -16px;
        margin-top: -16px;
        background: url("../../assets/images/index/center-control.png") no-repeat center center;
      }
      .center-control:hover{
        background: url("../../assets/images/index/center-control-active.png") no-repeat center center;
      }
    }
  }
}
.cease-current-icon{
  background: url("../../assets/images/index/cease-current-icon.png") no-repeat center center;
}
.cease-all-icon{
  background: url("../../assets/images/index/cease-all-icon.png") no-repeat center center;
}
.snap-icon{
  background: url("../../assets/images/index/snap-icon.png") no-repeat center center;
}
.videotape-icon{
  background: url("../../assets/images/index/videotape-icon.png") no-repeat center center;
}
.default-btn.plain{
  margin-right: 0;
}
</style>
