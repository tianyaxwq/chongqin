<template>
  <div class="ueEditor">
        <script :id="this.config.id" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'ue',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      ueid:{
        type: String
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.config.id, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    watch:{
        defaultMsg(newvalue,oldvalue){
            this.editor.setContent(newvalue)
        }
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style scoped lang='less'>
.ueEditor{
  border: 1px solid #c6d1de;
  border-radius: 2px;
}

</style>
