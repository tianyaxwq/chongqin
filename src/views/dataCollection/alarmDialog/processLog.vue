<template>
    <!-- 报警管理弹窗=》流程日志 -->
  <div class="process-log">
    <el-table
      :data="tableData"
      height="100%"
      border
      style="width: 100%">
      <el-table-column
        prop="date"
        label="监测时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="log"
        :show-overflow-tooltip="true"
        label="日志内容">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "processLog",
        data(){
          return {
            tableData:[{
              date:'2019-08-10 12:40:12',
              log:'爱上大硕大的阿斯加德拉克丝街道了十大时间段爱丽丝的骄傲栏时间段啊大手大脚阿里斯顿'
            }]
          }
        },
    }
</script>

<style scoped>
.process-log{
  height: 100%;
}
</style>
