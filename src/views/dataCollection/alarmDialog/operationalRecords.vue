<template>
    <!-- 报警管理弹窗=》操作记录 -->
    <div class="operational-records-wrap">
      <el-table
        :data="tableData"
        height="100%"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="操作时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="personnel"
          label="操作人员">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
        </el-table-column>
        <el-table-column
          prop="describe"
          label="描述">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
        name: "operationalRecords",
        data(){
          return {
            tableData:[{
              date:'2019-08-10 12:40:12',
              personnel:'王磊',
              operation:'三级审核确定',
              describe:'数据已确认',
            }]
          }
        }
    }
</script>

<style scoped lang="less">
.operational-records-wrap{
  height: 100%;
}
</style>
