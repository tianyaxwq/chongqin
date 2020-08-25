<template>
  <!-- 站点详情=》实时参数 -->
  <div class="real-time-param">
    <el-table :data="tableData" height="100%" border style="width: 100%">
      <el-table-column prop="factorCode" label="仪器" width="120"></el-table-column>
      <el-table-column prop="name" label="参数" width="120"></el-table-column>
      <!-- <el-table-column
        prop="unit"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
      </el-table-column>-->
      <el-table-column prop="codeName" label="当前值" width="160"></el-table-column>
      <el-table-column prop="normalRange" label="正常范围"></el-table-column>
      <el-table-column prop="dataTime" label="上传时间" width="160"></el-table-column>
      <!-- <el-table-column
        prop="modificationRecord"
        label="修改记录">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
export default {
  name: "realTimeParam",
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.searchcolumn();
  },
  computed: {
    siteMn: {
      get: function() {
        return this.$store.state.siteMn.stationMn;
      }
    }
  },
  methods: {
    searchcolumn() {
      this.$http
        .get("/Receiving/queryEquipmentParamsInfo", {
          params: {
            mn: this.siteMn
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            this.tableData = dataJson.content.dataList;
            //this.dataSearch();
          }
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped lang="less">
.real-time-param {
  height: 466px;
  padding: 7px;
}
</style>
