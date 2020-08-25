<template>
  <div class="taskpage">
        <div class="task_nav">
              <p class="tp"><i class="iconfont icon-renwuguanli"></i>监测管理</p>
              <ul>
                <li v-for="(item,key) in nav_a" :key="key" >
                    <div class="div"  :class="navName == item.name?'active':''" @click="navClick(item)">
                          <span></span>
                           <p>{{item.name}}</p>
                    </div>
                   
                </li>
              </ul>
               <p class="tp" v-if="nav_b.length>0"><i class="iconfont icon-renwuguanli"></i>统计分析</p>
              <ul>
                <li v-for="(item,key) in nav_b" :key="key" >
                    <div class="div"  :class="navName == item.name?'active':''" @click="navClick(item)">
                          <span></span>
                           <p>{{item.name}}</p>
                    </div>
                   
                </li>
              </ul>
        </div>
        <div class="task_body">
               <router-view/>
        </div>
  </div>
</template>

<script>
export default {
  name: 'taskmanage',
  data(){
      return{
          navName:'制定计划',
          nav_a:[
            {
            name:'制定计划',
            path: '/monitorPlan/waterFuncMonitor/buildPlan',
          },{
            name:'数据录入',
            path: '/monitorPlan/waterFuncMonitor/dataEntry',
          },{
            name:'数据查看',
            path: '/monitorPlan/waterFuncMonitor/dataCons',
          },{
            name:'待审核数据',
            path: '/monitorPlan/waterFuncMonitor/dataToaudit',
          }],
          nav_b:[{
            name:'单站多因子趋势分析',
             path: '/monitorPlan/waterFuncMonitor/trendFxA',
          },{
            name:'多站单因子趋势分析',
             path: '/monitorPlan/waterFuncMonitor/trendFxB',
          },],
      }
  },
  created(){
    
     this.$http.get("/fileXA/accoutMenu/getPermission",{
       params:{
         accout:this.toolObj.getCookie('userAccount')
       }
     }).then(res=>{
      
       if(res.data == 1){
          this.nav_a=[
            {
            name:'制定计划',
            path: '/monitorPlan/waterFuncMonitor/buildPlan',
          },{
            name:'全部数据',
            path: '/monitorPlan/waterFuncMonitor/dataALL',
          },{
            name:'待审核数据',
            path: '/monitorPlan/waterFuncMonitor/dataToaudit',
          }];
          this.navName='制定计划';
           this.$router.push('/monitorPlan/waterFuncMonitor/buildPlan');
       }else if(res.data == 2){
         this.nav_a=[
           {
            name:'制定计划',
            path: '/monitorPlan/waterFuncMonitor/buildPlan',
          },
          
            {
            name:'数据查看',
            path: '/monitorPlan/waterFuncMonitor/dataCons',
          },];
           this.$router.push('/monitorPlan/waterFuncMonitor/buildPlan');
            this.navName='制定计划';
       }else if(res.data == 3){
         this.nav_b=[]
         this.nav_a=[
           {
            name:'数据录入',
            path: `/monitorPlan/waterFuncMonitor/dataEntry/${0}`,
          },
            {
            name:'数据查看',
            path: '/monitorPlan/waterFuncMonitor/dataCons',
          },];
           this.$router.push(`/monitorPlan/waterFuncMonitor/dataEntry/${0}`);
            this.navName='数据录入';
       }
     })
  },
  methods:{
    navClick(item){
      this.navName=item.name;
     
      this.$router.push(item.path);
    }
  }
}
</script>

<style scoped lang="less">
.taskpage{
  height: 100%;
  background: #eff3f5;
  .task_nav{
    float: left;
    height: 100%;
    width: 198px;
    border: 1px solid #d9e6f7;
    background: #fff;
    .tp{
      height: 46px;
      line-height: 46px;
      padding-left: 40px;
      color: #1a1a1a;
      position: relative;
      i{
        color: #166bce;
        position: absolute;
        left: 18px;
        top: 15px;
        font-size: 16px;
        line-height: 16px;
      }
    }
    ul{
      li{
          color: #666;
          height: 35px;
          line-height: 35px;
          cursor: pointer;
          position: relative;

          .div{
            span{
              position: absolute;
              width: 9px;
              height: 9px;
              border-radius: 50%;
              border: 1px solid #666;
              left: 40px;
              top: 13px;
              &::before{
                content: '';
                position: absolute;
                width: 3px;
                height: 3px;
                border: 1px solid #666;
                left: 1px;
                top: 1px;
                border-radius: 50%;
              }
            }
            p{
                 padding-left: 55px;
            }
           
          }
          .active{
            color: #fff;
            line-height: 31px;
            position: absolute;
            left: -5px;
            top: 0px;
            width: 201px;
            height: 35px;
            background: url("../../../assets/images/nav/y_di_link_bg.png") no-repeat 0px center;
            background-size: 201px 35px;
            span{
              border-color: #fff;
              left: 45px;
              &::before{
                 border-color: #fff;
              }
            }
            p{
                 padding-left: 60px;
            }
          }
      }
      
    }
  }
  .task_body{
    float: right;
    width: calc(100% - 204px);
    height: 100%;
    
  }
}
</style>
