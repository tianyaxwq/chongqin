<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
           <span>关键字 : </span>
           <div class="layoutBox" style="width:220px">
             <el-input placeholder="请输入"></el-input>
          </div>&emsp;&emsp;
           <el-button><i class="iconfont icon-sousuo"></i>查询</el-button>
           <el-button>新增</el-button>
           <el-button type="delet">批量删除</el-button>
    </div>
    <div class="currency-mode-wrap">
        
          <el-table border :data="tableData">
                  <el-table-column
                      prop="mn"
                      label="监测项目名称">
                  </el-table-column>
                  <el-table-column
                      prop="stationname"
                      label="编码">
                  </el-table-column>
                  <el-table-column
                      prop="status"
                      label="单位">
                  </el-table-column>
                  <el-table-column
                      prop="time"
                      label="日质控">
                        <el-table-column
                            prop="time"
                            label="24小时跨度">
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="24小时漂移">
                        </el-table-column>
                  </el-table-column>
                  <el-table-column
                      prop="logtime"
                      label="周质控">
                  </el-table-column>
                  <el-table-column
                      prop="logtime"
                      label="月质控">
                        <el-table-column
                            prop="time"
                            label="多点线性核查">
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="集成干预核查">
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="实际水样比对">
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="加标回收率">
                        </el-table-column>
                  </el-table-column>
                   <el-table-column
                      prop="logtime"
                      label="备注">
                  </el-table-column>
                   <el-table-column
                      label="操作"
                      width="200">
                      <el-button type="secondBtn">修改</el-button>
                      <el-button type="secondBtn">删除</el-button>
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
