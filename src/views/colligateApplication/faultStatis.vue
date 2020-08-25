<template>
   <div class="scopePage cancelPadding">
    <div class="toolbox">
          <span>时间选择 : </span>
          <div class="layoutBox" style="width:242px">
            <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>&emsp;&emsp;
          <el-button><i class="iconfont icon-sousuo"></i>查询</el-button>
          <el-button type="delet"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <div class="table">
          <el-table border :data="tableData">
                <el-table-column type='index' label='序号' width='45'></el-table-column>
                <el-table-column  label='省份' prop='area' width='200'></el-table-column>
                <el-table-column label='流域' prop='area'>
                            <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                <el-table-column  label='断面名称' prop='area'>
                           <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                <el-table-column  label='电源故障数(个)' prop='area'>
                           <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                <el-table-column  label='仪器故障数(个)' prop='area'>
                           <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                <el-table-column  label='仪器通信故障数(个)' prop='area'>
                             <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                <el-table-column  label='仪器离线数(个)' prop='area'>
                             <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                <el-table-column  label='取水故障数(个)' prop='area'>
                            <template>
                                <div>
                                    <p v-for="item in 5" class="cellp"> {{item}}</p>
                                </div>
                            </template>
                </el-table-column>
                 <el-table-column  label='详情' prop='area'>
                    <template>
                                <div>
                                    <p v-for="item in 5" class="cellp" style="cursor: pointer;" @click="lookDetail">查阅明细</p>
                                </div>
                    </template>
                 </el-table-column>
          </el-table>
    </div>
    <el-dialog :visible.sync="visiDialog"  width="810px" title="故障明细" :before-close="closess">
      <div class="dialogcontent">
        <div class="table">
           <el-table border :eldata="tableData" height="240">
                  <el-table-column
                      type="index"
                      label=""
                      width="40">
                  </el-table-column>
                  <el-table-column
                      prop="stationname"
                      label="监测时间">
                  </el-table-column>
                  <el-table-column
                      prop="date"
                      label="监测因子">
                  </el-table-column>
                  <el-table-column
                      prop="logtime"
                      label="监测值(标识)">
                  </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
export default {
  name: "",
  data() {
    return {
      dateRange: "",
      select: {
        url: "", //请求下拉框数据的链接
        value: [1, 2, 3, 4, 5],
        optionData: [
          { value: 1, label: "水温" },
          { value: 2, label: "溶解氧" },
          { value: 3, label: "高锰酸盐" },
          { value: 4, label: "氨氮" },
          { value: 5, label: "总磷" }
        ],
        selectName: "label",
        selectId: "value",
        params: {},
        selectWidth: 200,
        //clearable:true,//是否添加清空按钮
        //disabled:true,//是否禁用下拉框
        multiple: true //是否开启多选
      },
      tableData: [{ area: "11" }],
      tableHead: [],
      monitorFactor: [1, 2, 3, 4, 5],
      visiDialog: false
    };
  },
  created() {
    this.$store.commit("setShowlefttree", false);
    this.search();
  },
  methods: {
    selectChange(arr) {
      this.monitorFactor = arr;
    },
    //查询
    search() {
      this.tableHead = [];
      for (let i in this.monitorFactor) {
        for (let j in this.select.optionData) {
          if (this.monitorFactor[i] == this.select.optionData[j].value) {
            this.tableHead.push({
              name: this.select.optionData[j].label
            });
          }
        }
      }
    },
    closess(done) {
      done();
    },
    //查阅详情
    lookDetail(){
      this.visiDialog=true;
    }
  }
};
</script>

<style scoped lang="less">
</style>
