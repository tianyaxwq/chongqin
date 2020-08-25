<template>
  <div class="pageContent">
    <div class="secondary-page-section secondary-page-mode">
      <div class="secondary-toolbar">
        <span>行政区划 :</span>
        <div class="layoutBox">
          <treeselect
            :normalizer="normalizer"
            style="margin-bottom:-12px;border-radius: 0px;width:180px;height:30px;"
            :disable-branch-nodes="true"
            placeholder="请选择"
            v-model="areaId"
            :multiple="false"
            :options="areaOptions"
          />
        </div>&emsp;&emsp;
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input placeholder="请输入饮用水源地名称" v-model="searchModel" style="width:220px" size="small"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        <el-button @click="visiDialog =true">
          <i class="iconfont icon-tianjia1"></i>新增
        </el-button>
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
      </div>
      <div class="currency-mode-wrap">
        <div class="el_table_box">
          <el-table
            border
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
            <el-table-column
              label="饮用水源地名称"
              show-overflow-tooltip
              align="center"
              prop="orilocationName"
            >
              <template slot-scope="scope">
                <span>{{scope.row.orilocationName ? scope.row.orilocationName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="150" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.orilocationType == 0">地表水</span>
                  <span v-else-if="scope.row.orilocationType == 1">地下水</span>
                  <span v-else>--</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="所在地" show-overflow-tooltip align="center" prop="dist">
              <template slot-scope="scope">
                <span>{{scope.row.dist ? scope.row.dist : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="保护区等级" width="150" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.level == 1">一级</span>
                  <span v-else-if="scope.row.level == 2">二级</span>
                  <span v-else>--</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="控制级别" width="150" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.controlLevel == 0">国控</span>
                  <span v-else-if="scope.row.controlLevel == 1">省控</span>
                  <span v-else-if="scope.row.controlLevel == 2">市控</span>
                  <span v-else-if="scope.row.controlLevel == 3">区县控</span>
                  <span v-else-if="scope.row.controlLevel == 4">乡镇控</span>
                  <span v-else-if="scope.row.controlLevel == 5">村控</span>
                  <span v-else>--</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="水质等级" width="150" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <!-- 水质等级从0开始 -->
                <span v-if="!scope.row.waterLevel">--</span>
                <span
                  class="target-level"
                  :class="'colorValue' + scope.row.waterLevel"
                  v-else
                >{{scope.row.waterLevel == "0" ? 'Ⅰ' : scope.row.waterLevel == "1" ? 'Ⅱ' : scope.row.waterLevel == "2" ? 'Ⅲ' : scope.row.waterLevel == "3" ? 'Ⅳ' : scope.row.waterLevel == "4" ? 'Ⅴ' : scope.row.waterLevel == "5" ? '劣Ⅴ' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn" @click="revise(scope.row)">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.orilocationId)">删除</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="920px" title="饮用水源地信息新增" :before-close="closess">
      <div class="dialogcontent noScrollX">
        <el-scrollbar>
          <el-form :model="formData" :rules="rules" style="height: 600px;" ref="ruleForm">
            <ul>
              <li class="liblock">
                <p class="lihead">饮用水源地基本信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">水源地名称：</span>
                    <div class="layoutBox">
                      <el-form-item prop="orilocationName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.orilocationName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">水源地编码：</span>
                    <div class="layoutBox">
                      <el-form-item prop="orilocationCode">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.orilocationCode"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>水源地类型：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.orilocationType"
                          placeholder="请选择"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in oriType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>省份：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.pr"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>地市：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.city" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>区县：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.dist" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>乡镇：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.town"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>负责人：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.userName" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>负责人：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.userName" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>联系方式：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.tel" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>区域：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.areaName"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>保护区等级：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select v-model="formData.level" placeholder="请选择" style="width:255px">
                          <el-option
                            v-for="item in levData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>本月达标情况：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.standard" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">经度：</span>
                    <div class="layoutBox">
                      <el-form-item prop="longtitude">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.longtitude"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span class="rCode">纬度：</span>
                    <div class="layoutBox">
                      <el-form-item prop="latitude">
                        <el-input placeholder="请输入" v-model="formData.latitude" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>面积：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.area" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>控制级别：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.controlLevel"
                          placeholder="请选择"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in conLevel"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>水质等级：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select
                          v-model="formData.waterLevel"
                          placeholder="请选择"
                          style="width:255px"
                        >
                          <el-option
                            v-for="item in wLevel"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>供水量：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-select v-model="formData.provide" placeholder="请选择" style="width:255px">
                          <el-option
                            v-for="item in conLevel"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>调查周期：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-date-picker
                          v-model="formData.period"
                          type="date"
                          placeholder="选择日期"
                          style="width:255px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>日供水量：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.dws" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>水系代码：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.sysCd" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>一级水系名称：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.flwsNm"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>二级水系名称：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.slwsNm" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>三级水系名称：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.tlwsNm" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>供水服务对象：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.clnt"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>服务范围：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.ss" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>供水服务人口：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.sp" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>保护区划定情况：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.del"
                          size="small"
                          style="width:255px"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>保护区划定文号：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.drn" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>是否有对应供水单位：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-radio v-model="formData.cwsu" :label="1">是</el-radio>
                        <el-radio v-model="formData.cwsu" :label="0">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>是否千吨万人水源：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-radio v-model="formData.wctot" :label="1">是</el-radio>
                        <el-radio v-model="formData.wctot" :label="0">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>是否上传附件：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-radio v-model="formData.att" :label="1">是</el-radio>
                        <el-radio v-model="formData.att" :label="0">否</el-radio>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv">
                    <span>对应供水工程：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input placeholder="请输入" v-model="formData.pnm" style="width:255px"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="formDiv" style="width: 100%">
                    <span style="width: 160px;vertical-align: top;">没有对应供水工程原因：</span>
                    <div class="layoutBox">
                      <el-form-item>
                        <el-input
                          placeholder="请输入"
                          v-model="formData.pnRsn"
                          style="width:600px"
                          type="textarea"
                          :rows="2"
                        ></el-input>
                      </el-form-item>
                    </div>
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
import qs from "qs";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "",
  components: { Treeselect },
  data() {
    const validateLongitude = (rule, value, callback) => {
      if (value == null || value == "") {
        callback(new Error("经度不能为空"));
      }
      if (value != null && value != "") {
        setTimeout(() => {
          var patrn = /^[\-\+]?(0?\d{1,2}\.\d{1,8}|1[0-7]?\d{1}\.\d{1,12}|180\.0{1,12})$/;
          if (patrn.exec(value) == null || value == "") {
            callback(new Error("经度格式有误"));
          } else {
            callback();
          }
        }, 1000);
      } else {
        callback();
      }
    };

    const validateLatitude = (rule, value, callback) => {
      if (value == null || value == "") {
        callback(new Error("维度不能为空"));
      }
      if (value != null && value != "") {
        setTimeout(() => {
          var patrn = /^[\-\+]?([0-8]?\d{1}\.\d{1,12}|90\.0{1,12})$/;
          if (patrn.exec(value) == null || value == "") {
            callback(new Error("维度格式有误"));
          } else {
            callback();
          }
        }, 1000);
      } else {
        callback();
      }
    };

    return {
      value1: "",
      name: "",
      vTitle: "新增",
      visiDialog: false,
      tableData: [{}],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      levData: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 }
      ],
      oriType: [
        { label: "地表水", value: 0 },
        { label: "地下水", value: 1 }
      ],

      conLevel: [
        { label: "国控", value: 0 },
        { label: "省控", value: 1 },
        { label: "市控", value: 2 },
        { label: "区县控", value: 3 },
        { label: "乡镇控", value: 4 },
        { label: "村控", value: 5 }
      ],
      wLevel: [
        { label: "Ⅰ类", value: 0 },
        { label: "Ⅱ类", value: 1 },
        { label: "Ⅲ类", value: 2 },
        { label: "Ⅳ类", value: 3 },
        { label: "Ⅴ类", value: 4 },
        { label: "劣Ⅴ类", value: 5 }
      ],
      formData: {
        orilocationId: "",
        orilocationName: "", //水源地名称
        orilocationCode: "", //水源地编码
        orilocationType: 1, //水源地类型
        pr: "", //省份
        city: "", //地市
        dist: "", //区县
        town: "", //乡镇
        userName: "", //负责人
        tel: "", //联系方式
        areaName: "", //区域
        level: 1, //保护区等级
        standard: "", //本月达标情况
        longtitude: "", //经度
        latitude: "", //纬度
        area: "", //面积
        controlLevel: 0, //控制级别(0 国控 1 省控 2 市控 3 区县控 4 乡镇控 5 村控)
        waterLevel: 1, //水质等级(1 一类 2 二类 3 三类 4 四类 5 五类 6 劣五类)
        provide: 0, //供水量(0 国控 1 省控 2 市控 3 区县控 4 乡镇控 5 村控)
        period: null, //调查周期
        dws: "", //日供水量
        sysCd: "", //水系代码
        flwsNm: "", //一级水系名称
        slwsNm: "", //二级水系名称
        tlwsNm: "", //三级水系名称
        clnt: "", //供水服务对象
        ss: "", //服务范围
        sp: "", //供水服务人口
        del: "", //保护区划定情况
        drn: "", //保护区划定文号
        cwsu: 0, //是否有对应供水单位
        wctot: 0, //是否千吨万人水源
        att: 0, //是否上传附件
        pnm: "", //对应供水工程
        pnRsn: "" //没有对应供水工程原因
      },
      areaId: null,
      areaOptions: [],
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.ad_CD,
          label: node.ad_NM
        };
      },
      rules: {
        orilocationName: [
          { required: true, message: "请输入饮用水源名称", trigger: "blur" }
        ],
        orilocationCode: [
          { required: true, message: "请输入饮用水源编码", trigger: "blur" }
        ],
        longtitude: [{ required: true, validator: validateLongitude }],
        latitude: [{ required: true, validator: validateLatitude }]
      },
      loading: true,
      ids: "",
      isEditor: false //判断是新增还是修改状态
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
    this.getAreaTree();
  },
  methods: {
    tableChange(val, index) {
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].orilocationId + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    getAreaTree() {
      this.$http.get("/dataHandle/yunliBase/getAreaTree", {}).then(res => {
        this.areaOptions = res.data.content.dataList;
      });
    },
    searchData() {
      this.loading = true;
      this.$http
        .get("/waterEnvXA/OriLocation", {
          params: {
            keyword: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            areaId: this.areaId
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.content.dataList;
          this.totalRecords = res.data.content.totalRecords;
        });
    },
    paginationSizeChange(v) {
      this.pageSize = v;
      this.searchData();
    },
    paginationChange(v) {
      this.currentPage = v;
      this.searchData();
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditor) {
            if (this.formData.period != null) {
              this.formData.period = new Date(this.formData.period).format(
                "yyyy-MM-dd 00:00:00"
              );
            }
            this.$http
              .put(
                "/waterEnvXA/OriLocation",
                qs.stringify(this.formData, { skipNulls: true })
              )
              .then(res => {
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
          } else {
            if (this.formData.period != null) {
              this.formData.period = new Date(this.formData.period).format(
                "yyyy-MM-dd 00:00:00"
              );
            }
            this.$http
              .post(
                "/waterEnvXA/OriLocation",
                qs.stringify(this.formData, { skipNulls: true })
              )
              .then(res => {
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
          }
        } else {
          return false;
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

      this.formData.orilocationId = row.orilocationId;
      this.formData.orilocationName = row.orilocationName; //水源地名称
      this.formData.orilocationCode = row.orilocationCode; //水源地编码
      this.formData.orilocationType = row.orilocationType; //水源地类型
      this.formData.pr = row.pr; //省份
      this.formData.city = row.city; //地市
      this.formData.dist = row.dist; //区县
      this.formData.town = row.town; //乡镇
      this.formData.userName = row.userName; //负责人
      this.formData.tel = row.tel; //联系方式
      this.formData.areaName = row.areaName; //区域
      this.formData.level = row.level; //保护区等级
      this.formData.standard = row.standard; //本月达标情况
      this.formData.longtitude = row.longtitude; //经度
      this.formData.latitude = row.latitude; //纬度
      this.formData.area = row.area; //面积
      this.formData.controlLevel = row.controlLevel; //控制级别(0 国控 1 省控 2 市控 3 区县控 4 乡镇控 5 村控)
      this.formData.waterLevel = row.waterLevel; //水质等级(1 一类 2 二类 3 三类 4 四类 5 五类 6 劣五类)
      this.formData.provide = row.provide; //供水量(0 国控 1 省控 2 市控 3 区县控 4 乡镇控 5 村控)
      this.formData.period = row.period; //调查周期
      this.formData.dws = row.dws; //日供水量
      this.formData.sysCd = row.sysCd; //水系代码
      this.formData.flwsNm = row.flwsNm; //一级水系名称
      this.formData.slwsNm = row.slwsNm; //二级水系名称
      this.formData.tlwsNm = row.tlwsNm; //三级水系名称
      this.formData.clnt = row.clnt; //供水服务对象
      this.formData.ss = row.ss; //服务范围
      this.formData.sp = row.sp; //供水服务人口
      this.formData.del = row.del; //保护区划定情况
      this.formData.drn = row.drn; //保护区划定文号
      this.formData.cwsu = row.cwsu; //是否有对应供水单位
      this.formData.wctot = row.wctot; //是否千吨万人水源
      this.formData.att = row.att; //是否上传附件
      this.formData.pnm = row.pnm; //对应供水工程
      this.formData.pnRsn = row.pnRsn; //没有对应供水工程原因
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.orilocationId = "";
      this.formData.orilocationName = ""; //水源地名称
      this.formData.orilocationCode = ""; //水源地编码
      this.formData.orilocationType = 1; //水源地类型
      this.formData.pr = ""; //省份
      this.formData.city = ""; //地市
      this.formData.dist = ""; //区县
      this.formData.town = ""; //乡镇
      this.formData.userName = ""; //负责人
      this.formData.tel = ""; //联系方式
      this.formData.areaName = ""; //区域
      this.formData.level = 1; //保护区等级
      this.formData.standard = ""; //本月达标情况
      this.formData.longtitude = ""; //经度
      this.formData.latitude = ""; //纬度
      this.formData.area = ""; //面积
      this.formData.controlLevel = 0; //控制级别(0 国控 1 省控 2 市控 3 区县控 4 乡镇控 5 村控)
      this.formData.waterLevel = 1; //水质等级(1 一类 2 二类 3 三类 4 四类 5 五类 6 劣五类)
      this.formData.provide = 0; //供水量(0 国控 1 省控 2 市控 3 区县控 4 乡镇控 5 村控)
      this.formData.period = null; //调查周期
      this.formData.dws = ""; //日供水量
      this.formData.sysCd = ""; //水系代码
      this.formData.flwsNm = ""; //一级水系名称
      this.formData.slwsNm = ""; //二级水系名称
      this.formData.tlwsNm = ""; //三级水系名称
      this.formData.clnt = ""; //供水服务对象
      this.formData.ss = ""; //服务范围
      this.formData.sp = ""; //供水服务人口
      this.formData.del = ""; //保护区划定情况
      this.formData.drn = ""; //保护区划定文号
      this.formData.cwsu = 0; //是否有对应供水单位
      this.formData.wctot = 0; //是否千吨万人水源
      this.formData.att = 0; //是否上传附件
      this.formData.pnm = ""; //对应供水工程
      this.formData.pnRsn = ""; //没有对应供水工程原因
    },
    //批量删除
    allDelet() {
      if (this.ids && this.ids.length) {
        this.globelDelet("/waterEnvXA/OriLocation", this.ids, this.searchData);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //删除
    delet(id) {
      this.globelDelet("/waterEnvXA/OriLocation", id, this.searchData);
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
</style>
