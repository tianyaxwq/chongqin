<template>
    <div class="equipment-quality-control scrollSpecial">
        <el-scrollbar class="equipment-details-scrollbar">
          <div class="equipment-details-wrap">
            <div class="select-site-wrap">
              <span class="label-name"><i></i> 监测仪器：</span>
              <div class="layoutBox" style="width: 224px;">
                <el-select
                  v-model="value"
                  popper-class="select-common-option"
                  placeholder="请选择"
                  @change="selectSite">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="toggle-wrap">
                <button
                  class="prev-btn"
                  :class="{disabled:number === 0}"
                  @click="prevToggle"
                >
                  <i class="el-icon-arrow-left"></i>
                </button>
                <button
                  class="next-btn"
                  :class="{disabled:number === (options.length-1)}"
                  @click="nextToggle"
                >
                  <i class="el-icon-arrow-right"></i>
                </button>
              </div>
            </div>
            <div class="equipment-information">
              <ul class="equipment-information-list clear">
                <li>
                  <span>温度：-- </span>
                  <span>湿度：-- </span>
                </li>
                <li>
                  <span>系统运行状态：-- </span>
                  <span>系统采水泵状态：-- </span>
                </li>
                <li>
                  <span>系统运行状态：-- </span>
                  <span> 系统控制阀状态：-- </span>
                </li>
                <li>
                  <span>温度：-- </span>
                  <span>系统运行状态：-- </span>
                </li>
                <li>
                  <span>系统采水泵状态：-- </span>
                  <span>系统运行状态：-- </span>
                </li>
                <li>
                  <span>系统控制阀状态：-- </span>
                  <!--<span>当前状态：无 </span>-->
                </li>
                <li></li>
                <li></li>
              </ul>
            </div>
            <div class="remote-control-wrap">
              <h4 class="remote-control-title">
                <i class="remote-control-icon"></i> 远程控制
                <!-- <button class="remote-more-btn" type="button"> 更多 <i class="iconfont icon-huadong"></i> </button> -->
              </h4>
              <div class="remote-control-content">
                <el-button @click="operate(0)">设备重启</el-button>
                <el-button @click="operate(1)">零点检查</el-button>
                <el-button @click="operate(2)">精度检查</el-button>
                <el-button @click="operate(3)">零点校准</el-button>
                <el-button @click="operate(4)">跨度校准</el-button>
              </div>
            </div>
          </div>
        </el-scrollbar>
    </div>
</template>

<script>
    export default {
        name: "qualityControl",
        data(){
          return {
            value: '',
            number: 0,
            options: [
            //   {
            //   value: '1',
            //   label: 'YX-CODCr-Ⅱ'
            // }, {
            //   value: '2',
            //   label: 'YO-NOX-Ⅰ'
            // }, {
            //   value: '3',
            //   label: 'YXO-CMDCr-Ⅱ'
            // }, {
            //   value: '4',
            //   label: 'OXX-KAS-COS'
            // }
            ]
          }
        },
        methods:{
            selectSite(val){
              var _this = this;
              this.options.forEach((item,index)=>{
                if(item.value === val){
                  _this.number = index;
                }
              })
            },
            operate(code){
              this.$message('暂无选择设备');
            },
            prevToggle(){
                if(this.number !== 0){
                  this.number--;
                  this.value = this.options[this.number].value;
                }
            },
            nextToggle(){
              if(this.number !== this.options.length-1){
                this.number++;
                this.value = this.options[this.number].value;
              }
            }
        }
    }
</script>

<style scoped lang="less">
  .equipment-quality-control{
    .equipment-details-scrollbar{
      height: 466px;
    }
    .equipment-details-wrap{
      padding: 6px 8px;
    }
    .select-site-wrap{
      height: 31px;
      line-height: 30px;
      padding-left: 12px;
      .label-name{
        font-weight: 600;
        i{
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 3px;
          width: 7px;
          height: 7px;
          background: #166bce;
          margin-right: 4px;
        }
      }
      .toggle-wrap{
        float: right;
        button{
          cursor: pointer;
          display: inline-block;
          height: 30px;
          line-height: 28px;
          width: 30px;
          border: 1px solid #c6d1de;
          background: #ebeff4;
          text-align: center;
          color: #c6d1de;
        }
        button:hover{
          color: #166bce;
          border: 1px solid #166bce;
        }
        button.disabled{
          cursor: not-allowed;
        }
        button.disabled:hover{
          color: #c6d1de;
          border: 1px solid #c6d1de;
        }
      }
    }
    .equipment-information-list{
      border: 1px solid #c6d1de;
      border-bottom: none;
      margin-top: 7px;
      li{
        line-height: 28px;
        height: 28px;
        padding-left: 12px;
        border-bottom: 1px solid #c6d1de;
      }
      li span{
        display: block;
        width: 50%;
        float: left;
      }
      li span:before{
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 7px;
        height: 7px;
        background: #c7d8ee;
        margin-right: 4px;
      }
    }
    .remote-control-wrap{
      border: 1px solid #d5e6f8;
      background: #e7f0f9;
      margin-top: 8px;
      .remote-control-title{
        line-height: 34px;
        border-bottom: 1px solid #d5e6f8;
        padding-left: 13px;
        i.remote-control-icon{
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 3px;
          width: 16px;
          height: 16px;
          background: url("../../assets/images/index/icon_Title_Prefix.png") no-repeat center center;
        }
        .remote-more-btn{
          float: right;
          color: #166bce;
          line-height: 24px;
          cursor: pointer;
          margin-right: 14px;
          border: 1px solid #e7f0f9;
          padding: 0 6px;
          margin-top: 3px;
          i{
            font-size: 12px;
          }
        }
        .remote-more-btn:hover{
          border: 1px solid #166bce;
        }
      }
      .remote-control-content{
        padding: 8px 13px;
      }
      .default-btn{
        width: auto;
        margin-right: 6px;
      }
    }
  }
</style>
