<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入" v-model="searchModel"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table
            border
            :data="tableData"
            height="100%"
            row-key="id"
            tooltip-effect="light"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="任务名称" show-overflow-tooltip prop="taskName" align="center"></el-table-column>
            <el-table-column label="所属计划" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.plan">{{scope.row.plan.planName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="任务指派" show-overflow-tooltip prop="pre" align="center"></el-table-column>
            <el-table-column label="完成日期" show-overflow-tooltip prop="thDate" align="center"></el-table-column>
            <el-table-column label="填报频率" show-overflow-tooltip prop="tbFrequency" align="center"></el-table-column>
            <el-table-column label="任务内容" show-overflow-tooltip prop="remark" align="center"></el-table-column>
            <el-table-column label="状态" width="80" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.state == 0">待办</span>
                  <span v-if="scope.row.state == 1">已审核</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="appear(scope.row)">上报</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination-wrap">
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
            :total="totalRecords"
          >
            <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      fileList: [],
      radio: "1",
      radio1: "1",
      visiDialogAss: false,
      value1: "",
      name: "",
      vTitle: "计划新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      totalRecords: 1000, //总条数
      pageList: [10, 15, 20], //设置每页多少条
      formData: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "", trigger: "blur" }]
      },
      loading: true,
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    searchData() {
      this.loading = true;
      this.$http
        .get("/planTaskCheck/task", {
          params: {
            key: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            taskType: 1
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    //上报
    appear(row) {
      this.$confirm("是否将选中的任务上报？", "消息提示", {
        type: "warning",
        center: true,
        cancelButtonClass: "noticonsecondBtn",
        confirmButtonClass: "",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          this.$http
            .get("/planTaskCheck/task/reportSuperior", {
              params: {
                id: row.id
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.searchData();
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000
                });
              }
            });
        })
        .catch();
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.searchData();
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
