<template>
  <div class="trafficpage secondary-page-mode">
    <div class="secondary-toolbar">
      <span>关键字 :</span>
      <div class="layoutBox" style="width:220px">
        <el-input placeholder="请输入"></el-input>
      </div>&emsp;&emsp;
      <el-button>
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
      <el-button>新增</el-button>
      <el-button type="delet">批量删除</el-button>
    </div>
    <div class="currency-mode-wrap">
      <el-table border :data="tableData">
        <!-- <el-table-column
                      type="index"
                      label="序号"
                      width="50">
        </el-table-column>-->
        <el-table-column prop="mn" label="水质类别">
          <template slot-scope="scope">
            <span>{{toWQLString(scope.row.mn)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stationname" label="质控项目"></el-table-column>
        <el-table-column prop="status" label="是否开启"></el-table-column>
        <el-table-column prop="time" label="是否影响数据有效性"></el-table-column>
        <el-table-column prop="logtime" label="执行频率"></el-table-column>
        <el-table-column prop="logtime" label="时间限制"></el-table-column>
        <el-table-column prop="logtime" label="现影响因子"></el-table-column>
        <el-table-column prop="logtime" label="现影响点位"></el-table-column>
        <el-table-column prop="logtime" label="备注"></el-table-column>
        <el-table-column label="操作" width="200">
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
      value: "",
      tableData: [{}]
    };
  },
  created() {
    this.$store.commit("setShowlefttree", false);
  },
  mounted() {},
  methods: {
    toWQLString(wql) {
      if (wql == "0") {
        return "Ⅰ类";
      } else if (wql == "1") {
        return "Ⅱ类";
      } else if (wql == "2") {
        return "Ⅲ类";
      } else if (wql == "3") {
        return "Ⅳ类";
      } else if (wql == "4") {
        return "Ⅴ类";
      } else if (wql == "5") {
        return "劣Ⅴ类";
      } else {
        return "";
      }
    }
  }
};
</script>

<style scoped lang="less">
.dialogcontent {
  padding: 5px;
  padding-bottom: 25px;
}
.wrap_head {
  height: 45px;
  border: 1px solid #d6e3f2;
  border-bottom: 0px;
}
</style>
