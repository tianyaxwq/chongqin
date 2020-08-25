<template>
    <div class="operations-maintenance">
      <el-table
        :data="tableData"
        height="100%"
        border
        style="width: 100%">
        <el-table-column
          prop="company"
          label="运维单位"
          :show-overflow-tooltip = 'true'
          width="180">
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="personnel"
          label="运维人员">
        </el-table-column>
        <el-table-column
          prop="contactNumber"
          label="联系电话">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
        name: "operationsMaintenance",
        data(){
          return {
            tableData:[{
              company:'宇星科技发展（深圳）有限公司',
              role:'运维人员',
              personnel:'张三',
              contactNumber:'13354721420'
            }]
          }
        }
    }
</script>

<style scoped lang="less">
.operations-maintenance{
  height: 100%;
}
</style>
