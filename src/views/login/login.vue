<template>
  <div style="height:100%;width:100%">
        <div class="content-box">
                <div class="login-head">
                        <span></span>
                        <div class="logo">

                        </div>
                        <!-- <div class="mes">
                                [奉贤区]晴转多云 27℃~31℃ AQI : 36 
                        </div> -->
                </div>
                <div class="login-body">
                        <div class="loginBg">
                        
                        </div>  
                        <div class="body-content">
                            <div class="textBox">

                            </div>
                            <div class="loginMesBox">
                                <div class="loginIcon">
                                        <span></span>欢迎登陆 ! 
                                </div>
                                <div class="loginInput">
                                    <ul>
                                        <li>
                                                <i class="iconfont icon-lianxiren"></i>
                                                <input type="text" placeholder="账号" v-model="userName" @focus="inputfocus(0)" @keyup.enter="login">
                                                <p class="tsp" v-if="isuser">{{userTs}}</p>
                                        </li>
                                        <li style="margin-bottom:36px;">
                                                 <i  class="iconfont icon-mima1"></i>
                                                <input type="password"  placeholder="密码" v-model="password" @focus="inputfocus(1)"  @keyup.enter="login">
                                                 <p class="tsp" v-if="ispassword">{{passwordTs}}</p>
                                                 <p class="checkp">
                                                     <el-checkbox v-model="passwordChecked" @change="passwordChange">记住密码</el-checkbox>
                                                 </p>
                                        </li>
                                        <li>
                                                <span @click="login">登录</span>
                                        </li>
                                    </ul>
                                </div>
                            </div> 
                        </div>
                </div>
                <div class="login-foot">
                        技术支持 : 宇星科技发展（深圳）有限公司  
                </div>
        </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      userTs: "",
      userName: "",
      passwordChecked: false,
      isuser: false,
      passwordTs: "",
      ispassword: false,
      password: "",
      date_nyr: "",
      week: "",
      isfirst: false
    };
  },
  created() {
    if (localStorage.getItem("isChecked") == "true") {
      this.passwordChecked = true;
      this.userName = localStorage.getItem("userName");
      this.password = localStorage.getItem("password");
    }
  },
  methods: {
    passwordChange(val) {
      if(val){
         localStorage.setItem("isChecked", val);
        localStorage.setItem("userName", this.userName);
        localStorage.setItem("password", this.password);
      }else{
         localStorage.setItem("isChecked", val);
        localStorage.removeItem("userName", this.userName);
        localStorage.removeItem("password", this.password);
      }
     
    },
    inputfocus(n) {
      if (n == 0) {
        this.isuser = false;
      } else {
        this.ispassword = false;
      }
    },
    login() {
      if (this.userName.length < 1 || this.userName.length > 20) {
        this.isuser = true;
        this.userName = "";
        this.userTs = "账号字符长度1~20位";
        return false;
      } else {
        this.isuser = false;
      }

      if (this.password.length < 6 || this.password.length > 20) {
        this.ispassword = true;
        this.password = "";
        this.passwordTs = "密码字符长度6~20位";
        return false;
      } else {
        this.ispassword = false;
      }
      if (this.passwordChecked) {
        localStorage.setItem("userName", this.userName);
        localStorage.setItem("password", this.password);
      } else {
        localStorage.setItem("userName", "");
        localStorage.setItem("password", "");
      }
      var sendObj = {};
      sendObj["account"] = this.userName;
      sendObj["password"] = this.password;
      
      this.$http
        .post("/IdentityManagement/auth/login", qs.stringify(sendObj), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.toolObj.setCookie("token", res.data.content.token);
            this.toolObj.setCookie("userName", res.data.content.info.userName);
            this.toolObj.setCookie("userAccount",res.data.content.info.userAccount);
            this.toolObj.setCookie("userId", res.data.content.info.userId);
            this.toolObj.setCookie("appCode", res.data.content.info.appCode); //系统编号
            this.toolObj.setCookie("roleId", res.data.content.info.roleId);
            this.toolObj.setCookie("admin", res.data.content.info.admin); //是否是管理员 1是0否
            this.toolObj.setCookie("platformId", res.data.content.info.plId || ""); //平台id
            this.toolObj.setCookie("platform", "");
            if(res.data.content.platform){
              this.toolObj.setCookie("platform", JSON.stringify(res.data.content.platform));
            }

            this.$router.push("./home");
            
          } else {
            this.isuser = true;
            this.userTs = res.data.message;
          }
        });
    },
    inputBlur(n) {
      if (n == 0) {
        if (this.user.length < 1 || this.user.length > 20) {
          this.isuser = true;
          this.user = "";
        } else {
          this.isuser = false;
        }
      } else if (n == 1) {
        if (this.password.length < 6 || this.password.length > 20) {
          this.ispassword = true;
          this.password = "";
        } else {
          this.ispassword = false;
        }
      }
    },
  },
  watch: {
    userName(newValue, oldValue) {
      if (this.userName == "") {
        this.password = "";
      }
    }
  }
};
</script>

<style scoped lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.content-box {
  height: 100%;
  .login-head {
    height: 69px;
    position: relative;
    > span {
      width: 100%;
      height: 3px;
      background: url("../../assets/images/login/color_segmentation.png") no-repeat;
      background-size: 100% 100%;
      z-index: 999;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
    .logo {
      width: 404px;
      height: 46px;
      position: absolute;
      left: 60px;
      top: 13px;
      background: url("../../assets/images/login/logo.png");
    }
    .mes {
      width: 270px;
      height: 69px;
      line-height: 69px;
      position: absolute;
      right: 60px;
      top: 0px;
    }
  }
  .login-body {
    height: calc(100% - 105px);
    width: 100%;
    position: relative;
    overflow: hidden;
    .loginBg {
      height: 100%;
      width: 2920px;
      background: url("../../assets/images/login/loginBg.png") no-repeat center center;
      background-size: 2920px 100%;
      position: absolute;
      left: 0px;
      top: 0px;

      animation: move 120s linear infinite;
      -webkit-animation: move 120s linear infinite; /* Safari 和 Chrome */
    }
    .body-content {
      position: relative;
      width: 1200px;
      margin: 0 auto;
      height: 100%;
    }
    .textBox {
      font-size: 48px;
      color: #fff;
      position: absolute;
      left: 0px;
      top: 250px;
      width: 458px;
      height: 129px;
      background: url("../../assets/images/login/wenzi.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .loginMesBox {
      width: 413px;
      height: 357px;
      background: url("../../assets/images/login/inputBg.png") no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      right: 0px;
      top: 50%;
      padding: 37px 60px;
      transform: translateY(-230px);
      .loginIcon {
        height: 68px;
        line-height: 68px;
        font-size: 24px;
        color: #166bce;
        padding-left: 90px;
        position: relative;
        span {
          display: inline-block;
          width: 68px;
          height: 68px;
          position: absolute;
          left: 0px;
          top: 0px;
          background: url("../../assets/images/login/toux.png") no-repeat center
            center;
          background-size: 100% 100%;
        }
      }
      .loginInput {
        margin-top: 21px;
        li {
          margin-bottom: 20px;
          position: relative;
          input {
            width: 100%;
            height: 38px;
            border-radius: 4px;
            border: 1px solid #c3d3da;
            cursor: pointer;
            padding-left: 32px;
            color: #323c40;
            box-shadow: 2px 2px 2px #9fbacb inset;
          }
          .iconfont {
            font-size: 16px;
            color: #8099a1;
            position: absolute;
            left: 11px;
            top: 50%;
            transform: translateY(-8px);
          }
          &:hover {
            input {
              border-color: #038aeb;
            }
            .iconfont {
              color: #038aeb;
            }
          }
          > span {
            width: 100%;
            display: inline-block;
            text-align: center;
            height: 38px;
            line-height: 38px;
            color: #fff;
            font-size: 16px;
            border-radius: 4px;
            background: -webkit-linear-gradient(
              left,
              #009cff,
              #0b61ff
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              right,
              #009cff,
              #0b61ff
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right, #009cff, #0b61ff);
            /* Firefox 3.6 - 15 */
            background: linear-gradient(to right, #009cff, #0b61ff);
            /* 标准的语法 */
            color: #fff;
            cursor: pointer;
            &:hover {
              background: -webkit-linear-gradient(
                left,
                #0fa2ff,
                #196aff
              ); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(
                right,
                #0fa2ff,
                #196aff
              ); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(
                right,
                #0fa2ff,
                #196aff
              ); /* Firefox 3.6 - 15 */
              background: linear-gradient(
                to right,
                #0fa2ff,
                #196aff
              ); /* 标准的语法 */
            }
            &:active {
              background: -webkit-linear-gradient(left, #0093f0, #0a5bf0);
              /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(right, #0093f0, #0a5bf0);
              /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(right, #0093f0, #0a5bf0);
              /* Firefox 3.6 - 15 */
              background: linear-gradient(
                to right,
                #0093f0,
                #0a5bf0
              ); /* 标准的语法 */
            }
          }
          .tsp {
            color: #ff0000;
            position: absolute;
            left: 35px;
            bottom: -17px;
          }
          .checkp {
            position: absolute;
            left: 2px;
            bottom: -33px;
            .el-checkbox {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .login-foot {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    position: fixed;
    left: 0px;
    bottom: 0px;
  }
}
@keyframes move {
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(-800px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>