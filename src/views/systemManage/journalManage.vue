<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
           <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入"></el-input>
          </div>&emsp;&emsp;
          <span>时间选择 : </span>&nbsp;
          <div class="layoutBox" style="width:242px">
            <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>&emsp;&emsp;
           <el-button><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button type="delet"><i class="iconfont icon-daochu"></i>导出</el-button>
          
    </div>
    <div class="currency-mode-wrap">
        
          <el-table border :data="tableData">
                  <el-table-column
                      type="selection"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      type="index"
                      label="序号"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      prop="mn"
                      label="登录名"
                      width="280">
                  </el-table-column>
                  <el-table-column
                      prop="stationname"
                       width="280"
                      label="用户名">
                  </el-table-column>
                   <el-table-column
                    width="280"
                      label="操作时间">
                  </el-table-column>
                   <el-table-column
                      label="操作内容">
                  </el-table-column>
          </el-table>
    </div>
   
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      value:'',
      dateRange:[],
      tableData:[{}]
    };
  },
  created() {
    this.$store.commit("setShowlefttree", false);
  },
  mounted(){
     
  },
  methods: {
   
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;

}

</style>
