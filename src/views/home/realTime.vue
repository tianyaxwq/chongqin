<template>
  <!-- 实时数据 -->
  <div class="real-time-page">
    <!-- <div v-if="siteLoading" class="loading-wrap"></div>
      <div v-if="noDataState" class="no-data-wrap small">
        <p>暂无数据</p>
    </div>-->
    <div class="water-ranking-table"
      v-loading="siteLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="loading-type-a"
      element-loading-background="rgba(255, 255, 255, 1)">
      <el-table :data="tableData" border height="100%" style="width: 100%">
        <el-table-column
          prop="stnm"
          label="监测点"
          fixed
          :show-overflow-tooltip="true"
          width="112"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.stnm == "null" || !scope.row.stnm
                ? "--"
                : scope.row.stnm
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="spt"
          label="更新时间"
          width="160"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.spt == "null" || !scope.row.spt ? "--" : scope.row.spt
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="index"
          v-for="(item, index) in headcolumn"
          :prop="item.code"
          :width="setWidth(item.projectName)"
          :show-overflow-tooltip="true"
          :label="item.projectName"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row[item.code] == "null" || !scope.row[item.code]
                ? "--"
                : scope.row[item.code]
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "realTime",
  props: ["equipIds", "datas"],
  data() {
    return {
      siteLoading: true,
      tableData: [],
      headcolumn: [
        // { code: "wt", projectName: "水温（℃）" },
        // { code: "ph", projectName: "pH（无量纲）" },
        // { code: "dox", projectName: "溶解氧（mg/L）" },
        // { code: "cond", projectName: "电导率（μS/cm）" },
        // { code: "codmn", projectName: "CODmn（mg/L）" },
        // { code: "nh3n", projectName: "氨氮（mg/L）" },
        // { code: "tp", projectName: "TP（mg/L）" },
        // { code: "tn", projectName: "TN（mg/L）" },
        // { code: 'turb', projectName: "浊度（NTU）"},
        // { code: 'codcr', projectName: "CODcr（mg/L）"}
      ]
    };
  },
  methods: {
    setWidth(str) {
      if (str) {
        let num = str.length;
        return num * 14 + 20 > 104 ? num * 14 + 20 : 104;
      }
    },
    setStateClass(state) {
      let cls = "";
      switch (state) {
        case "normal":
          cls = "normal-icon";
          break;
        case "offline":
          cls = "offline-icon";
          break;
        case "over":
          cls = "over-icon";
          break;
      }
      return cls;
    },
    setStateText(state) {
      let text = "";
      switch (state) {
        case "normal":
          text = "正常";
          break;
        case "offline":
          text = "离线";
          break;
        case "over":
          text = "报警";
          break;
      }
      return text;
    },
    getpropertys(item) {
      return "projects." + item.projectCode + ".value";
    },
    // 获取表头数据
    getTabelHeadData() {
      this.$http
        .get("/dataHandle/yunliBase/queryStationMontFactors", {
          params: {
            mns: this.equipIds.join(",")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.headcolumn = [];
            res.data.content.dataList.map((el, index) => {
              this.headcolumn.push({
                code: el.cd,
                projectName: el.monitoring_factor_dw ? el.monitoring_factor_nm + "（" + el.monitoring_factor_dw + "）" : el.monitoring_factor_nm
              });
            });
            this.siteLoading = false
            this.searchcolumn();
          } else {
            this.siteLoading = false
            this.headcolumn = [];
          }
        })
        .catch(error => {
          this.siteLoading = false
          this.headcolumn = [];
        });
    },
    searchcolumn() {
      // 直接使用上级传入数据 20-08-07 by wangch
      this.tableData = [];
      if (this.datas && this.datas.length) {
        for (let item of this.datas) {
          if (item.wRealData) {
            this.tableData.push(item.wRealData);
          }
        }
        return false
      }

      this.$http
        .get("/dataHandle/yunliBase/getXhWaterData", {
          params: {
            types: "WQ03"
          }
        })
        .then(res => {
          this.tableData = [];
          let dataJson = res.data;
          if (dataJson.code === 0) {
            dataJson.content.dataList.map(el => {
              if (el.wRealData) {
                this.tableData.push(el.wRealData);
              }
            });
          }
        });
    },
    dataSearch() {
      this.$http
        .get("/waterenvapi/realdatas/map", {
          params: {
            equipIds: this.equipIds.toString()
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            this.tableData = dataJson.content.dataList;
            this.total = dataJson.content.total;
          }
        })
        .catch(error => {
          console.info(error);
        });
    }
  }
};
</script>

<style scoped lang="less">
.water-ranking-table {
  height: 322px;
  padding: 8px;
}
.water-ranking-span {
  .sl-icon {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .normal-icon {
    background: #23c467;
  }
  .offline-icon {
    background: #a4afb4;
  }
  .over-icon {
    background: #ff0000;
  }
}
</style>
