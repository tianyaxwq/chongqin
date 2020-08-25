<template>
    <div class="no-box" v-if="dataStatus != 'success'">
        <div class="noData" v-if="dataStatus == 'no'">暂无数据</div>
        <div class="noData tableNo" v-if="dataStatus == 'tableNo'"><i class="iconfont icon-ku"></i>暂无数据</div>
        <div class="noData no-network" v-if="dataStatus == 504">网络连接超时</div>
        <div class="noData no-content" v-if="dataStatus == 401">无权限查看</div>
        <div class="noData no-page" v-if="dataStatus == 404">请求错误</div>
        <div class="noData no-network" v-if="dataStatus == 500">服务未启动</div>
        <div class="addDataBox" v-if="dataStatus == 'addNoData'" @click="clickData"><p>点击添加数据</p><p>或使用添加按钮添加数据！</p></div>
        <div class="loading" v-if="dataStatus == 'loading'"></div>
    </div>
</template>
<style scoped lang="less">
  /*无数据提示*/
  .no-box{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .noData{
    background: url("images/noData.png") center center no-repeat;
    height: 224px;
    width: 309px;
    padding-top: 240px;
    color: #666;
    font-size: 16px;
    text-align: center;
      &.tableNo{
          background: none;
          padding: 0;
          height: auto;
          width: auto;
          position: static;
          margin: 0;
          font-size: 14px;

          .iconfont{
              font-size: 18px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
              margin-top: -2px;
          }
      }
      &.no-content{
          background: url("images/no-content.png") center center no-repeat;
      }
      &.no-network{
          background: url("images/no-network.png") center center no-repeat;
      }
      &.no-page{
          background: url("images/no-page.png") center center no-repeat;
      }
    &.mar_100{
      margin: 100px auto;
    }
    position: absolute;
    top: 50%;
    left: 50%;
     margin-left: -154px;
      margin-top: -112px;
  }
  .addDataBox{
      background: url("images/tianjiashuju_pic.png") center center no-repeat;
      width: 160px;
      height: 160px;
      padding-top: 120px;
      text-align: center;
      color: #738de2;
      cursor: pointer;
      &.mar_100{
          margin: 100px auto;
      }
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -154px;
      margin-top: -112px;
  }
  .loading{
      height: 100%;
      width: 100%;
      background: url("images/loading1.gif") no-repeat center center;
  }
</style>
<script type="text/ecmascript-6">
    export default {
        name:'yfDatastatus',
        props: {
            dataStatus: {
                type: [String, Number],
                default: 'no'
            }
        },
        data(){
            return {}
        },
        methods: {
            clickData(){
                if ( "dataClick" ){
                    this.$emit("dataClick");
                }
            }
        },
        watch: {
            dataStatus(val,old){
                this.dataStatus = val;
            }
        }
    }
</script>
