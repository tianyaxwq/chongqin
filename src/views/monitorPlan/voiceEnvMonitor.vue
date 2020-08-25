<template>
  <div style="height:100%" class="tapStyle">
    <yf-tabs type="border-card" :value="tabActive">
      <yf-tab-pane name="a1" label="区域">
        <voiceReg></voiceReg>
      </yf-tab-pane>
      <yf-tab-pane name="a2" label="道路">
         <voiceRoad></voiceRoad>
      </yf-tab-pane>
      <yf-tab-pane name="a3" label="功能区">
         <voiceFunc></voiceFunc>
      </yf-tab-pane>
    </yf-tabs>
   
  </div>
</template>

<script>
import voiceReg from './voiceType/voiceReg'
import voiceRoad from './voiceType/voiceRoad'
import voiceFunc from './voiceType/voiceFunc'
export default {
  name: "",
  components:{
    voiceReg,
    voiceRoad,
    voiceFunc
  },
  data() {
    return {
     
      tabActive: "a1",
     
    };
  },
  methods: {
   
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
