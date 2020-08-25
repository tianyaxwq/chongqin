<template>
    <div class="data-statistics">
      <ul class="statistics-list clear">
        <li v-for="(item,index) in statisticsList" :key="index" @click="goToPage(item.url)">
          <i class="iconfont" :class="item.icon"></i>
          <p class="name">{{ item.name }}</p>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "dataStatistics",
        data(){
          return {
            statisticsList:[{
              icon:'icon-shujuyouxiaoxingbaobiao',
              name:'月质控报表',
              url:'/qualityControl/zkstatics/singlemonthStatis'
            },
            // {
            //   icon:'icon-shujuyouxiaoxingbaobiao',
            //   name:'故障数据报表',
            //   url:''
            // },
            {
              icon:'icon-shujuyouxiaoxingbaobiao',
              name:'数据有效性报表',
              url:'/qualityControl/zkstatics/dataAnalysis'
            },{
              icon:'icon-shujuyouxiaoxingbaobiao',
              name:'质控报表',
              url:'/qualityControl/zkstatics/examAnalysis'
            }]
          }
        },
        methods:{
          goToPage(url){
              this.$router.push({path:url,query:{
                code:1
              }})
          }
        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
.data-statistics {
  height: 466px;
  padding: 8px;
  .statistics-list{
    padding: 20px 0 20px 20px;
    &>li{
      float: left;
      text-align: center;
      border: 1px solid #c2d7f0;
      width: calc(25% - 20px);
      margin-right: 20px;
      padding: 10px 0;
      background: #eef1f8;
      cursor: pointer;
      &>.iconfont{
        font-size: 40px;
        color: #166bce;
      }
    }
    &>li:hover{
      border: 1px solid #166bce;
    }
  }
}
</style>
