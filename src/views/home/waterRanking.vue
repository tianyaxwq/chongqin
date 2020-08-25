<template>
  <div
    class="water-ranking-content"
    v-loading="waterLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="loading-type-a"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <!--<div v-if="waterLoading" class="loading-wrap"></div>-->
    <div v-if="waterNoDataState" class="no-data-wrap small no-data-table">
      <p>暂无数据</p>
    </div>
    <el-scrollbar style="height:100%">
      <div class="water-ranking-table">
        <el-table :data="tableData" empty-text=" " style="width: 100%">
          <el-table-column type="index" label="排名" width="56"></el-table-column>
          <el-table-column prop="stnm" label="断面名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="wqg" label="水质等级">
            <template slot-scope="scope">
              <span v-if="scope.row.wqg == 'null' || !scope.row.wqg">--</span>
              <span v-else>
                <i
                  class="target-level"
                  :class="'colorValue' + scope.row.wqg"
                >{{ transformationText(scope.row.wqg) }}</i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="water-ranking-paging">
        <el-pagination
          @size-change="paginationSizeChange"
          @current-change="paginationChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          background
          :small="true"
          popper-class="select-common-option"
          :page-sizes="pageList"
          layout="->,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div> -->
    </el-scrollbar>
  </div>
</template>

<script>
// import {formatDate} from '../../dateformat.js'
export default {
  name: "waterRanking",
  props: ["equipIds", "datas"],
  watch: {
    tableData(val) {
      if (val.length === 0) {
        this.waterNoDataState = true;
      } else {
        this.waterNoDataState = false;
      }
    }
  },
  data() {
    return {
      waterLoading: false,
      waterNoDataState: false,
      total: 62, //分页总条数
      pageSize: 10, //分页每页多少条数据
      pageList: [10, 15, 20], //设置每页多少条
      tableData: [],
      currentPage: 1
    };
  },
  computed: {
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  },
  methods: {
    paginationChange(val) {
      //分页页码改变时执行
      this.seachData();
    },
    paginationSizeChange(val) {
      //分页pageSize改变时执行
      this.pageSize = val;
    },
    frountpage(list) {
      //前端分页方法
      var start = (this.currentPage - 1) * this.pageSize;
      var end = this.pageSize * this.currentPage;
      var rtn = [];
      var len = end;
      if (end > list.length) {
        len = list.length;
      }
      for (var i = start; i < len; i++) {
        rtn.push(list[i]);
      }
      this.tableData = rtn;
    },
    seachData() {
      // 直接使用上级传入数据 20-08-07 by wangch
      this.tableData = [];
      if (this.datas && this.datas.length) {
        for (let item of this.datas) {
          if (item.wRealData) {
            item.wRealData.wqg = item.wRealData.wq_tp;
            this.tableData.push(item.wRealData);
          }
        }
        return false
      }

      this.waterLoading = true;
      this.waterNoDataState = false;
      var date = new Date();
      this.$http
        .get("/dataHandle/waterBigScreen/waterQuStationSort")
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var list = dataJson.content.dataList;
            var listData = [];
            list.forEach(element => {
              if ("999999" != element.waterQuality) {
                listData.push(element);
              }
            });
            this.tableData = listData
            this.total = listData.length;
            // this.frountpage(listData);
            // this.$emit("setDatas", list);
          }
          this.waterLoading = false;
        })
        .catch(error => {
          console.info(error);
          this.waterLoading = false;
          this.waterNoDataState = true;
        });
    },
    rankingFormatter(cellValue) {
      let cls = "";
      switch (cellValue) {
        case 1:
          cls = "ranking-first";
          break;
        case 2:
          cls = "rank-second";
          break;
        case 3:
          cls = "rank-third";
          break;
        default:
          cls = "rank-other";
      }
      return cls;
    },
    transformation(cellValue) {
      let cls = "";
      switch (cellValue) {
        case "0":
          cls = "excellent";
          break;
        case "1":
          cls = "excellent";
          break;
        case "2":
          cls = "good";
          break;
        case "3":
          cls = "milder";
          break;
        case "4":
          cls = "moderate";
          break;
        case "5":
          cls = "severe";
          break;
      }
      return cls;
    },
    transformationText(cellValue) {
      let cls = "";
      switch (cellValue) {
        case "0":
          cls = "Ⅰ";
          break;
        case "1":
          cls = "Ⅱ";
          break;
        case "2":
          cls = "Ⅲ";
          break;
        case "3":
          cls = "Ⅳ";
          break;
        case "4":
          cls = "Ⅴ";
          break;
        case "5":
          cls = "劣Ⅴ";
          break;
      }
      return cls;
    }
  },
};
</script>

<style lang="less">
.water-ranking-content {
  height: 100%;
  position: relative;
  .water-ranking-table {
    margin: 0 8px;
    height: 330px;
  }
  .el-table::before {
    background: none;
  }
  .el-table .el-table__row:last-child td {
    border-bottom: none;
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid #c7d8ee;
  }
  .el-table td {
    border-bottom: 1px solid #e1ebf9;
  }
  .el-table td,
  .el-table th {
    padding: 3px 0;
    font-size: 13px;
    color: #1a1a1a;
  }
  .el-table .caret-wrapper {
    height: 23px;
    vertical-align: top;
  }
  .el-table .sort-caret.ascending {
    top: 0;
  }
  .el-table .sort-caret.descending {
    bottom: 0;
  }
  .ranking-number {
    display: inline-block;
    vertical-align: middle;
    width: 18px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    background: #cadaeb;
    font-size: 12px;
  }
  .ranking-number.ranking-first,
  .ranking-number.rank-second,
  .ranking-number.rank-third {
    width: 18px;
    height: 22px;
    line-height: 18px;
    color: #fff;
    vertical-align: top;
  }
  .ranking-number.ranking-first {
    background: url("../../assets/images/index/ranking_first_bg.png") center
      center;
  }
  .ranking-number.rank-second {
    background: url("../../assets/images/index/ranking_Second_bg.png") center
      center;
  }
  .ranking-number.rank-third {
    background: url("../../assets/images/index/ranking_Third_bg.png") center
      center;
  }
  .water-ranking-paging {
    margin: 0 8px;
    border-top: 1px solid #e1ebf9;
    height: 56px;
    padding-top: 14px;
  }
  .el-pager li,
  .el-pagination--small .el-pager li:last-child {
    border: 1px solid #d6e3f2;
    height: 24px;
    line-height: 24px;
    min-width: 24px;
    font-weight: normal;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    border-color: #166bce;
    background-color: #166bce;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    border-radius: 0;
    border: 1px solid #d6e3f2;
    height: 24px;
    line-height: 24px;
    min-width: 24px;
  }
  .el-pagination__editor.el-input {
    width: 32px;
    font-size: 12px;
  }
  .el-pagination__editor.el-input,
  .el-input__inner {
    border-radius: 0;
    border-color: #d6e3f2;
  }
  .el-input__inner:focus {
    border-color: #166bce;
  }
}
</style>
