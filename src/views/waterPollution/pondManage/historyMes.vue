<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input
            placeholder="请输入问题地点"
            v-model="searchModel"
            clearable
            style="width:220px"
            size="small"
          ></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
        <el-button type="delet" @click="exportExcel">
          <i class="iconfont icon-daochu"></i>导出
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table
            border
            ref="table"
            :data="tableData"
            height="100%"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
            @selection-change="tableChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="行政区划" show-overflow-tooltip align="center" prop="dist">
              <template slot-scope="scope">
                <span>{{scope.row.dist ? scope.row.dist : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="坑塘类型" show-overflow-tooltip align="center" prop="styp">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.styp == 0">水坑</span>
                  <span v-if="scope.row.styp == 1">干坑</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="问题地点" show-overflow-tooltip align="center" prop="proLoca">
              <template slot-scope="scope">
                <span>{{scope.row.proLoca ? scope.row.proLoca : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="估算面积（㎡）" show-overflow-tooltip align="center" prop="area">
              <template slot-scope="scope">
                <span>{{scope.row.area ? scope.row.area : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="估算体积（m³）" show-overflow-tooltip align="center" prop="vol">
              <template slot-scope="scope">
                <span>{{scope.row.vol ? scope.row.vol : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="酸碱性" show-overflow-tooltip align="center" prop="abp">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.abp == 0">酸性</span>
                  <span v-if="scope.row.abp == 1">碱性</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="其它特征污染物" show-overflow-tooltip align="center" prop="ocp">
              <template slot-scope="scope">
                <span>{{scope.row.ocp ? scope.row.ocp : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否通过验收" show-overflow-tooltip align="center" prop="acpt">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.styp == 0">否</span>
                  <span v-if="scope.row.styp == 1">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.poolId)">删除</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="1290px" :title="vTitle" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px">
            <ul>
              <li class="liblock">
                <p class="lihead">纳污坑塘基本信息</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="编号：">
                        <el-input placeholder="请输入" v-model="formData.poolCode" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="地市：">
                        <el-input placeholder="请输入" v-model="formData.city" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="县区：">
                        <el-input placeholder="请输入" v-model="formData.dist" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="乡镇：">
                        <el-input placeholder="请输入" v-model="formData.town" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="村：">
                        <el-input placeholder="请输入" v-model="formData.vil" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="所在村庄具体方位：">
                        <el-input placeholder="请输入" v-model="formData.proLoca" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="中心经度：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.longitude"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="中心纬度：">
                        <el-input placeholder="请输入" v-model="formData.latitude" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="估算面积（㎡）：">
                        <el-input placeholder="请输入" v-model="formData.area" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="估算体积（m³）：">
                        <el-input placeholder="请输入" v-model="formData.vol" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="坑塘周边污染情况：">
                        <el-input placeholder="请输入" v-model="formData.psp" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否仍在纳污：">
                        <el-radio v-model="formData.cap" :label="1">是</el-radio>
                        <el-radio v-model="formData.cap" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="废水性质：">
                        <el-select v-model="formData.pww" placeholder="请选择" style="width:255px">
                          <el-option
                            v-for="item in watertypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="酸碱性：">
                        <el-radio v-model="formData.abp" :label="1">碱性</el-radio>
                        <el-radio v-model="formData.abp" :label="0">酸性</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否涉重金属：">
                        <el-radio v-model="formData.hm" :label="1">是</el-radio>
                        <el-radio v-model="formData.hm" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="坑塘类型：">
                        <el-radio v-model="formData.styp" :label="1">干坑</el-radio>
                        <el-radio v-model="formData.styp" :label="0">水坑</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="所属河流：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.riverName"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="是否有恶臭：">
                        <el-radio v-model="formData.stink" :label="1">是</el-radio>
                        <el-radio v-model="formData.stink" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="化学需氧量：">
                        <el-input placeholder="请输入" v-model="formData.cod" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="氨氮：">
                        <el-input placeholder="请输入" v-model="formData.nh3n" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="其他特征污染物：">
                        <el-input placeholder="请输入" v-model="formData.ocp" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="来源：">
                        <el-input placeholder="请输入" v-model="formData.source" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="治理进展：">
                        <el-select v-model="formData.status" placeholder="请选择" style="width:255px">
                          <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="问题地点：">
                        <el-input placeholder="请输入" v-model="formData.proLoca" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="提交人：">
                        <el-input placeholder="请输入" v-model="formData.userName" style="width:255px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="上报时间：">
                        <el-date-picker
                          v-model="formData.uploadTime"
                          type="date"
                          placeholder="选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否涉油等有机物：">
                        <el-radio v-model="formData.om" :label="1">是</el-radio>
                        <el-radio v-model="formData.om" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="坑塘是否已通过验收：">
                        <el-radio v-model="formData.acpt" :label="1">是</el-radio>
                        <el-radio v-model="formData.acpt" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="坑塘底泥及周边土壤是否受到污染,采取治理措施：">
                        <el-radio v-model="formData.ots" :label="1">是</el-radio>
                        <el-radio v-model="formData.ots" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="坑塘周边地下水是否受到污染,采取措施：">
                        <el-radio v-model="formData.wts" :label="1">是</el-radio>
                        <el-radio v-model="formData.wts" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="采取主要治理措施和方法：">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.method"
                          :rows="3"
                          type="textarea"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">调查人员信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span>责任人：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.investigationUserName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>联系电话：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tel"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>工作单位：</span>
                    <div class="layoutBox">
                      <el-form-item style="margin-left:0px;">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.unit"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>职务：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.job"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead" style="margin-bottom:12px;">
                  过程监管&emsp;&emsp;&emsp;
                  <el-button @click="addProcess">
                    <i class="iconfont icon-tianjia1"></i>新增过程
                  </el-button>
                </p>
                <div
                  class="libody clear"
                  v-for="(item,key) in formData.process"
                  :key="key"
                  style="margin-top:12px"
                >
                  <div class="formDiv">
                    <span>过程名称：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="item.processName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>过程负责人：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="item.userName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- <div class="formDiv">
                    <span class="rCode">过程状态：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.name"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>-->
                  <div class="formDiv">
                    <span>上报时间：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-date-picker
                          v-model="item.receiveTime"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" style="text-align:right">
                    <el-button type="delet" @click="deletProcess(key)">
                      <i class="iconfont icon-shanchu"></i>删除
                    </el-button>
                  </div>
                </div>
              </li>
            </ul>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer">
        <el-button @click="submit('ruleForm')">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exportTableData } from "../../../assets/js/tableExport";
export default {
  name: "",

  data() {
    return {
      value1: "",
      name: "",
      vTitle: "纳污坑塘新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      stype: "",
      pondData: [
        { value: "1", label: "干坑" },
        { value: "0", label: "水坑" }
      ],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      statusOption: [
        { label: "未完成", value: 0 },
        { label: "已完成", value: 1 }
      ],
      watertypeOption: [
        { label: "工业废水", value: 0 },
        { label: "生活污水", value: 1 },
        { label: "养殖废水", value: 2 },
        { label: "混合废水", value: 3 },
        { label: "其他", value: 4 }
      ],
      formData: {
        city: "",
        dist: "",
        town: "",
        vil: "",
        longitude: "",
        latitude: "",
        area: "",
        vol: "",
        psp: "",
        cap: "",
        pww: "",
        abp: "",
        hm: "",
        om: "",
        stink: "",
        cod: "",
        nh3n: "",
        ocp: "",
        ots: "",
        wts: "",
        method: "",
        acpt: "",
        styp: "",
        dpsp: "",
        poolId: "", //纳污坑塘Id
        poolCode: "", //编号
        status: "", //状态
        proLoca: "", //问题地点
        riverName: "", //所属河流
        areaName: "", //行政区划
        source: "", //来源
        userName: "", //提交人
        uploadTime: "", //上报时间
        investigationUserName: "", //责任人
        tel: "", //联系电话
        unit: "", //工作单位
        job: "", //职务
        process: [{ processName: "", userName: "", receiveTime: "" }]
      },
      rules: {
        name: [{ required: true, message: "请输入养殖场名称", trigger: "blur" }]
      },
      loading: true,
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
  },
  methods: {
    exportExcel() {
      let { table } = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector(".el-table__header");
      let title = "历史填报信息";
      let fieldList = [
        "dist",
        "styp",
        "proLoca",
        "area",
        "vol",
        "abp",
        "ocp",
        "acpt"
      ];
      let params = {
        headerProp: fieldList.join(","),
        keyword: this.searchModel,
        pattern: "yyyy-MM-dd"
      };
      exportTableData(
        header,
        title,
        "",
        "1",
        "/waterEnvXA/exports/poolHistoryExcel",
        params
      );
    },
    //新增过程
    addProcess() {
      this.formData.process.push({
        processName: "",
        userName: "",
        receiveTime: ""
      });
    },
    //删除过程
    deletProcess(key) {
      this.formData.process.splice(key, 1);
    },
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].poolId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    //查询数据
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/pool", {
          params: {
            keyword: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            areaId: "",
            verifyState: ""
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    paginationSizeChange(n) {
      this.pageSize = n;
      this.searchData();
    },
    paginationChange(n) {
      this.currentPage = n;
      this.searchData();
    },
    //提交
    submit(formName) {
      for (let i = 0; i < this.formData.process.length; i++) {
        if (this.formData.process[i].receiveTime != "") {
          this.formData.process[i].receiveTime = new Date(
            this.formData.process[i].receiveTime
          ).format("yyyy-MM-dd 00:00:00");
        }
      }
      if (this.formData.uploadTime != "") {
        this.formData.uploadTime = new Date(this.formData.uploadTime).format(
          "yyyy-MM-dd 00:00:00"
        );
      }
      this.$http.put("/waterEnvXA/pool", this.formData).then(res => {
        if (res.data.code == 0) {
          this.resetForm(formName);
          this.visiDialog = false;
          this.searchData();
          this.$message({
            message: res.data.message,
            type: "success",
            duration: 1000
          });
        }
      });
    },
    //取消
    cancel(formName) {
      this.visiDialog = false;
      this.resetForm(formName);
    },
    //关闭弹框
    closess(done) {
      done();
      this.resetForm("ruleForm");
    },
    //修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.city = row.city; //地市
      this.formData.dist = row.dist; //县区
      this.formData.town = row.town; //乡镇
      this.formData.vil = row.vil; //村
      this.formData.longitude = row.longitude; //中心经度
      this.formData.latitude = row.latitude; //中心纬度
      this.formData.area = row.area; //估算面积
      this.formData.vol = row.vol; //估算体积
      this.formData.psp = row.psp; //坑塘周边污染情况
      this.formData.cap = row.cap; //是否仍在纳污
      this.formData.pww = row.pww; //废水性质
      this.formData.abp = row.abp; //酸碱性
      this.formData.hm = row.hm; //是否涉重金属
      this.formData.om = row.om; //是否涉废油等有机物
      this.formData.stink = row.stink; //是否有恶臭
      this.formData.cod = row.cod; //化学需氧量
      this.formData.nh3n = row.nh3n; //氨氮
      this.formData.ocp = row.ocp; //其他特征污染物
      this.formData.ots = row.ots; //坑塘底泥及周边土壤是否受到污染,采取治理措施
      this.formData.wts = row.wts; //坑塘周边地下水是否受到污染,采取措施
      this.formData.method = row.method; //采取主要治理措施和方法
      this.formData.acpt = row.acpt; //坑塘是否已通过验收
      this.formData.styp = row.styp; //坑塘类型
      this.formData.dpsp = row.dpsp; //干坑周边污染情况
      this.formData.poolId = row.poolId; //纳污坑塘Id
      this.formData.poolCode = row.poolCode; //编号
      this.formData.status = row.status; //状态
      this.formData.proLoca = row.proLoca; //问题地点
      this.formData.riverName = row.riverName; //所属河流
      this.formData.areaName = row.areaName; //行政区划
      this.formData.source = row.source; //来源
      this.formData.userName = row.userName; //提交人
      this.formData.uploadTime = row.uploadTime; //上报时间
      this.formData.investigationUserName = row.investigationUserName; //责任人
      this.formData.tel = row.tel; //联系电话
      this.formData.unit = row.unit; //工作单位
      this.formData.job = row.job; //职务
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/pool", id, this.searchData);
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/pool", this.ids, this.searchData);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
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

<style>
.el-form-item__content {
  margin-left: 0px !important;
}
</style>
