<template>
  <div class="alarmHandlepage clearfix secondary-page-mode">
    <div class="secondary-toolbar">
      <span>断面名称：</span>&nbsp;
      <div class="layoutBox" style="width:220px">
        <el-input placeholder="请输入断面名称" clearable v-model="stnmName" size="small"></el-input>
      </div>&emsp;&emsp;
      <span>报警类型：</span>&nbsp;
      <div class="layoutBox">
        <el-select v-model="value" placeholder="请选择" size="small" style="width:200px">
          <el-option
            v-for="item in optionData"
            :key="item.alarmTypeId"
            :label="item.alarmTypeName"
            :value="item.alarmTypeId"
          ></el-option>
        </el-select>
      </div>&emsp;&emsp;
      <el-button @click="getData">
        <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </div>
    <div class="currency-mode-wrap">
      <el-table
        :data="tableData"
        height="100%"
        border
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="alarmTypeName" width="160" label="报警标题">
          <template slot-scope="scope">
            <span @click="openDetail(scope.row)" style="display:block;cursor:pointer;color:#66b1ff">{{scope.row.alarmTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="aTitle" width="120" label="起始时间"></el-table-column>
        <el-table-column prop="aTitle" width="120" label="截至时间"></el-table-column>
        <el-table-column prop="aTitle" width="120" label="报警类型"></el-table-column>
        <el-table-column prop="aTitle" width="100" label="负责人"></el-table-column>
        <el-table-column prop="aTitle" label="事件内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="aTitle" width="100" label="报警级别"></el-table-column>
        <el-table-column prop="status" label="办理状态" width="120">
          <template slot-scope="scope">
            <el-button :type="scope.row.status === '1' ? 'success' : 'primary'" size="mini" round style="margin:0;padding: 0 10px;height:21px;font-size:12px;">{{scope.row.status === '1' ? '已办理' : '办理中'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否启动预案" width="140">
          <template slot-scope="scope">
            <el-button :type="scope.row.status === '1' ? 'success' : 'danger'" size="mini" round style="margin:0;padding: 0 18px;height:21px;font-size:12px;;">{{scope.row.status === '1' ? '是' : '否'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationBox">
      <el-pagination
        @size-change="paginationSizeChange"
        @current-change="paginationChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        background
        :small="true"
        popper-class="select-common-option"
        :page-sizes="pageList"
        layout="total,sizes,slot,->,prev, pager, next, jumper"
        :total="totalRecords">
        <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
      </el-pagination>
    </div>
    <!-- 处理详情 -->
    <transition name="el-fade-in">
      <div class="handle-detail-wrap" v-if="showDetail">
        <div class="tabbar">
          <span :class="{active: item.value === curTab}" v-for="item of tabOptions" :key="item.value">{{item.label}}</span>
        </div>
        <div class="boxer">
          <alarm-handle-detail type="1" @close="showDetail = false" @refresh="showDetail = false;getData();"></alarm-handle-detail>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import alarmHandleDetail from './alarmHandleDetail'
export default {
  name: "alarmHandle",
  components: { alarmHandleDetail },
  data() {
    return {
      dataStatus: "no",
      loading: false,
      loadingTwo: false,
      loadingThree: false,
      stnmName: "",
      value: "",
      optionData: [],
      tableData: [],
      numTableData: [],
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [10, 15, 25], //设置每页多少条
      curTab: '1',
      tabOptions: [
        { label: '处理流程', value: '1' },
        { label: '任务流转', value: '2' },
        { label: '流程记录', value: '3' },
        { label: '流程图', value: '4' }
      ],
      showDetail: false,
      curAlarmInfo: {}
    }
  },
  methods: {
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
      this.getData();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // 获取下拉条件查询
    getAlarmType() {
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmType", {
          params: {
            dataStatus: 1
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.optionData = res.data.content.dataList;
          }
        });
    },
    // 获取表格数据
    getData() {
      this.loading = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmEventData", {
          params: {
            startTime: new Date(
              new Date().getTime() - 3600 * 1000 * 24 * 2
            ).format("yyyy-MM-dd hh:mm:ss"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            sortBy: "eventTime",
            order: "desc",
            alarmTypeId: this.value,
            keyword: this.stnmName,
            pageNumber: this.currentPage - 1,
            pageSize: this.pageSize,
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
          } else {
            this.tableData = [];
          }
        });
    },
    openDetail(row) {
      this.curAlarmInfo = row
      this.showDetail = true
    },
    closeDetail() {
      this.curAlarmInfo = {}
      this.showDetail = false
      this.getData()
    }
  },
  computed: {
    totalPage() {
      let number = 0
      number = Math.ceil(this.totalRecords / this.pageSize)
      return number === 0 ? 1 : number
    }
  },
  mounted() {
    this.getAlarmType()
    this.getData()
  }
};
</script>

<style lang="less" scoped>
.alarmHandlepage {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  .oneLevel {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #ffef36;
  }
  .twoLevel {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #f71515;
  }
  .secondary-toolbar {
    position: relative;
    .alarmLevel {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #666;
      font-size: 13px;
      > li {
        display: inline-block;
        > i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #ffef36;
        }
        &:last-child {
          > i {
            background-color: #f71515;
          }
        }
      }
    }
  }
  .currency-mode-wrap {
    height: calc(100% - 90px);
    background: #eaeef4;
    .paginationBox {
      background: #fff;
    }
    .alarmsNum {
      margin-top: 10px;
      display: flex;
      height: 312px;
      .title {
        padding: 10px 0;
        font-weight: bold;
        font-size: 14px;
        color: #1a1a1a;
        border-bottom: 1px solid #dce9fa;
        > img {
          margin: 0 5px 0 15px;
        }
      }
      > div {
        flex: 1;
        background-color: #fff;
      }
      .chart-wrap {
        position: relative;
        margin-right: 10px;
      }
    }
  }
}
.handle-detail-wrap {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  .tabbar {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 14px 10px 0;
    background: #F5F7FA;
    color: #333333;
    span {
      height: 36px;
      padding: 0 10px 14px;
      margin: 0 10px;
      text-align: center;
      font-size: 16px;
      border-bottom: 1px solid #F5F7FA;
      cursor: pointer;
      user-select: none;
      &.active {
        color: #0F80E8;
        border-bottom-color: #0F80E8;
      }
    }
  }
  .boxer {
    height: calc(100% - 50px);
    padding: 40px 20px 0;
    overflow-y: auto;
  }
}
</style>