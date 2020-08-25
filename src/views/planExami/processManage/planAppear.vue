<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox" style="width:220px">
          <el-input placeholder="请输入" v-model="searchModel"></el-input>
        </div>&emsp;&emsp;
        <el-button>
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
            <el-table-column label="计划名称" show-overflow-tooltip prop="planName" align="center"></el-table-column>
            <el-table-column label="年份" show-overflow-tooltip prop="thYear" align="center"></el-table-column>
            <el-table-column
              label="包含行业"
              show-overflow-tooltip
              prop="industrys"
              :formatter="indusFormat"
              align="center"
            ></el-table-column>
            <el-table-column
              label="包含区域"
              show-overflow-tooltip
              align="center"
              prop="areas"
              :formatter="areaFormat"
            ></el-table-column>
            <el-table-column label="完成日期" show-overflow-tooltip prop="thDate" align="center"></el-table-column>
            <el-table-column label="是否需要审核" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.isAudit == 0">否</span>
                  <span v-if="scope.row.isAudit == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="是否需要填报" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.isTb== 0">否</span>
                  <span v-if="scope.row.isTb == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.state == 0">未审核</span>
                  <span v-if="scope.row.state == 1">已审核</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="appear(scope.row.id)">上报</el-button>
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
      name: "",
      vTitle: "计划新增",
      visiDialog: false,
      tableData: [
        { name: "2019年工作计划", id: "0", pre: "--", year: "2019年" }
      ],
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
  created() {
    this.init();
  },
  methods: {
    indusFormat(row) {
      if (row.industrys && row.industrys.length > 0) {
        let str = "";
        for (let i = 0; i < row.industrys.length; i++) {
          str += row.industrys[i].industryName + ",";
        }
        str = str.slice(0, str.length - 1);
        return str;
      } else {
        return "-";
      }
    },
    areaFormat(row) {
      if (row.areas && row.areas.length > 0) {
        let str = "";
        for (let i = 0; i < row.areas.length; i++) {
          str += row.areas[i].areaName + ",";
        }
        str = str.slice(0, str.length - 1);
        return str;
      } else {
        return "-";
      }
    },
    // 初始数据
    init() {
      this.searchData();
    },
    // 查询列表数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/planTaskCheck/plan", {
          params: {
            key: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            planType: 1
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    //上报
    appear(id) {
      this.$confirm("是否将选中的计划上报？", "消息提示", {
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
            .get("/planTaskCheck/plan/reportSuperior", {
              params: {
                id: id
              }
            })
            .then(res => {
              this.searchData()
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 1000
              });
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
    },
    //取消
    cancel(formName) {
      this.visiDialog = false;
      this.resetForm(formName);
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
