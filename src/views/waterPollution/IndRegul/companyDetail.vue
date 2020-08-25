<template>
  <div class="pageContent">
    <el-scrollbar style="height: 100%">
      <div class="headStyle">
        <h1 class="title">{{enterpriseName}}</h1>
        <div class="containsContent">
          <span v-for="(item, index) in listItem" :key="index">
            <!-- <img src="../../../assets/images/companyDetail/headeImg.png" alt />i -->
            <i class="el-icon-collection-tag" :class="'colorImg' + index"></i>
            {{item.name}}
          </span>
        </div>
      </div>
      <div class="singleModule" v-for="(list, listIndex) in listItem" :key="listIndex">
        <div class="concrete">
          <img src="../../../assets/images/companyDetail/pfbz.png" alt v-if="list.name == '排放标准'" />
          <img src="../../../assets/images/companyDetail/fspk.png" alt v-if="list.name == '废水排口'" />
          <img src="../../../assets/images/companyDetail/zlkz.png" alt v-if="list.name == '总量控制'" />
          <img src="../../../assets/images/companyDetail/jcsj.png" alt v-if="list.name == '监测数据'" />
          <img src="../../../assets/images/companyDetail/xzcf.png" alt v-if="list.name == '行政处罚'" />
          <span class="smallTitle">{{list.name}}</span>
          <div v-if="list.name == '排污许可证'" class="licence">
            <span class="certificateNum">
              <img src="../../../assets/images/companyDetail/certificateNum.png" alt /> 证书编号：234231029431
            </span>
            <a
              href="https://xin.baidu.com/company_detail_29694157100646"
            >https://xin.baidu.com/company_detail_29694157100646</a>
          </div>
          <div class="formModule">
            <div class="secondary-toolbar" v-if="list.name != '排污许可证'">
              <span v-if="list.name == '排放标准'">关键字 :</span>
              <div class="layoutBox" style="width:220px" v-if="list.name == '排放标准'">
                <el-input placeholder="请输入" v-model="searchStand"></el-input>
              </div>
              <el-button v-if="list.name == '排放标准'" @click="searchStandData();">
                <i class="iconfont icon-sousuo"></i> 查询
              </el-button>
              <span v-if="list.name == '废水排口'">关键字 :</span>
              <div class="layoutBox" style="width:220px" v-if="list.name == '废水排口'">
                <el-input placeholder="请输入" v-model="searchSite"></el-input>
              </div>
              <el-button v-if="list.name == '废水排口'" @click="searchSiteData();">
                <i class="iconfont icon-sousuo"></i> 查询
              </el-button>
            </div>
            <div class="el_table_box" v-if="list.name == '排放标准'">
              <el-table
                border
                :data="standTableData"
                style="height: auto"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column
                  label="废水排口编码"
                  show-overflow-tooltip
                  align="center"
                  prop="siteCode"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.siteCode ? scope.row.siteCode: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="废水排口名称"
                  show-overflow-tooltip
                  align="center"
                  prop="siteName"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.siteName ? scope.row.siteName: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="污染编号"
                  show-overflow-tooltip
                  align="center"
                  prop="polluteCode"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.polluteCode ? scope.row.polluteCode: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="污染名称"
                  show-overflow-tooltip
                  align="center"
                  prop="polluteName"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.polluteName ? scope.row.polluteName: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="标准类型" show-overflow-tooltip align="center" prop="standType">
                  <template slot-scope="scope">
                    <span>{{scope.row.standType ? scope.row.standType: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="执行标准" show-overflow-tooltip align="center" prop="exeStand">
                  <template slot-scope="scope">
                    <span>{{scope.row.exeStand ? scope.row.exeStand: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="标准值上限"
                  show-overflow-tooltip
                  align="center"
                  prop="upperValue"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.upperValue ? scope.row.upperValue: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="标准值下限"
                  show-overflow-tooltip
                  align="center"
                  prop="lowerValue"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.lowerValue ? scope.row.lowerValue: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="标准值单位" show-overflow-tooltip align="center" prop="unit">
                  <template slot-scope="scope">
                    <span>{{scope.row.unit ? scope.row.unit: '--'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="el_table_box" v-if="list.name == '废水排口'">
              <el-table
                border
                :data="siteTableData"
                style="height: auto"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column label="排口名称" show-overflow-tooltip align="center" prop="name">
                  <template slot-scope="scope">
                    <span>{{scope.row.name ? scope.row.name: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="排口编号" show-overflow-tooltip align="center" prop="code">
                  <template slot-scope="scope">
                    <span>{{scope.row.code ? scope.row.code: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="排放口位置" show-overflow-tooltip align="center" prop="position">
                  <template slot-scope="scope">
                    <span>{{scope.row.position ? scope.row.position: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="经度" show-overflow-tooltip align="center" prop="longitude">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.longitude || scope.row.longitude == 0"
                    >{{scope.row.longitude}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="纬度" show-overflow-tooltip align="center" prop="latitude">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.latitude || scope.row.latitude == 0"
                    >{{scope.row.latitude}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="在线监测设备"
                  show-overflow-tooltip
                  align="center"
                  prop="isMonitor"
                >
                  <template slot-scope="scope">
                    <div>
                      <span
                        style="color:#36C25E;font-size:14px;"
                        v-if="scope.row.isMonitor == 'y'"
                      >是</span>
                      <span
                        style="color:#FF3333;font-size:14px;"
                        v-if="scope.row.isMonitor == 'n'"
                      >否</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="标志牌安装形式"
                  show-overflow-tooltip
                  align="center"
                  prop="signFix"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.signFix ? scope.row.signFix: '--'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否进水口"
                  show-overflow-tooltip
                  align="center"
                  prop="longitude"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.longitude ? scope.row.longitude: '--'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="el_table_box" v-if="list.name == '总量控制'">
              <el-table
                :data="tableData"
                border
                style="height: auto"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" fixed width="50"></el-table-column>
                <el-table-column prop="areaName" width="116" fixed label="时间"></el-table-column>
                <el-table-column label="氨氮">
                  <el-table-column label="mg/L">
                    <template
                      slot-scope="scope"
                    >{{scope.row.nh3n != 'null' ? scope.row.nh3n : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="TP">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">{{scope.row.tp != 'null' ? scope.row.tp : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="TN">
                  <el-table-column label="mg/L">
                    <template slot-scope="scope">{{scope.row.tn != 'null' ? scope.row.tn : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="CODmn">
                  <el-table-column width="120" label="mg/L">
                    <template
                      slot-scope="scope"
                    >{{scope.row.codmn != 'null' ? scope.row.codmn : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="CODcr">
                  <el-table-column width="120" label="mg/L">
                    <template
                      slot-scope="scope"
                    >{{scope.row.codcr != 'null' ? scope.row.codcr : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="浊度">
                  <el-table-column label="NTU">
                    <template
                      slot-scope="scope"
                    >{{scope.row.turb != 'null' ? scope.row.turb : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="有机物">
                  <el-table-column label="mg/L">
                    <template
                      slot-scope="scope"
                    >{{scope.row.turb != 'null' ? scope.row.turb : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="pH">
                  <el-table-column label="无量纲">
                    <template
                      slot-scope="scope"
                    >{{scope.row.turb != 'null' ? scope.row.turb : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="电导率">
                  <el-table-column label="μS/cm">
                    <template
                      slot-scope="scope"
                    >{{scope.row.cond != 'null' ? scope.row.cond : '--'}}</template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="水中油">
                  <el-table-column label="mg/L">
                    <template
                      slot-scope="scope"
                    >{{scope.row.cond != 'null' ? scope.row.cond : '--'}}</template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <div class="el_table_box" v-if="list.name == '监测数据'">
              <el-table
                border
                :data="tableData"
                style="height: auto"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column
                  label="监测项目"
                  show-overflow-tooltip
                  align="center"
                  prop="enterpriseName"
                ></el-table-column>
                <el-table-column label="监测时间" show-overflow-tooltip align="center" prop="areaName"></el-table-column>
                <el-table-column label="监测值" show-overflow-tooltip align="center" prop="longitude"></el-table-column>
                <el-table-column label="标准限值" show-overflow-tooltip align="center" prop="latitude"></el-table-column>
                <el-table-column label="监测类型" show-overflow-tooltip align="center" prop="areaName"></el-table-column>
              </el-table>
            </div>
            <div class="el_table_box" v-if="list.name == '行政处罚'">
              <el-table
                border
                :data="tableData"
                style="height: auto"
                element-loading-text="加载中"
                element-loading-spinner="loading-type-a"
                element-loading-background="rgba(255, 255, 255, 1)"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column
                  label="处罚单位"
                  show-overflow-tooltip
                  align="center"
                  prop="enterpriseName"
                ></el-table-column>
                <el-table-column
                  label="处罚决定时间"
                  show-overflow-tooltip
                  align="center"
                  prop="areaName"
                ></el-table-column>
                <el-table-column label="处罚依据" show-overflow-tooltip align="center" prop="longitude"></el-table-column>
                <el-table-column label="处罚措施" show-overflow-tooltip align="center" prop="latitude"></el-table-column>
                <el-table-column
                  label="违法行为类型"
                  show-overflow-tooltip
                  align="center"
                  prop="areaName"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      yearData: "",
      searchModel: "",
      loading: true,
      tableData: [],
      id: this.$route.query.id,
      listItem: [
        // {
        //   name: "排污许可证"
        // },
        {
          name: "排放标准"
        },
        {
          name: "废水排口"
        },
        {
          name: "总量控制"
        },
        {
          name: "监测数据"
        },
        {
          name: "行政处罚"
        }
      ],
      basicInfo: [
        {
          title: "单位名称：",
          name: "容城县田林填充材料有限公司"
        },
        {
          title: "注册地址：",
          name: "容城县辛庄村"
        },
        {
          title: "统一社会信用代码：",
          name: "91130629575548245H"
        },
        {
          title: "生产经营场所地址：",
          name: "容城县辛庄村"
        },
        {
          title: "行业类别：",
          name: "纺织业"
        },
        {
          title: "有效期至：",
          name: "自20xx年xx月xx日至20xx年xx月xx日止"
        },
        {
          title: "发证机关：",
          name: "容城县生态环境局"
        },
        {
          title: "法定代表人：",
          name: "赵会田"
        },
        {
          title: "发证日期：",
          name: "20xx年xx月xx日"
        }
      ],
      enterpriseId: "",
      enterpriseName: "",
      searchSite: "",
      searchStand: "",
      siteTableData: [],
      standTableData: []
    };
  },
  created() {
    var enterpriseName = this.$route.query.enterpriseName;
    var enterpriseId = this.$route.query.enterpriseId;
    this.enterpriseName = enterpriseName;
    this.enterpriseId = enterpriseId;
    this.getSiteData();
    this.getStandData();
  },
  methods: {
    searchStandData() {
      this.getStandData();
    },
    searchSiteData() {
      this.getSiteData();
    },
    getSiteData() {
      this.$http
        .get("/waterEnvXA/waterSite", {
          params: { enterpriseId: this.enterpriseId, keyword: this.searchSite }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.siteTableData = res.data.content.dataList;
          }
        });
    },
    getStandData() {
      this.$http
        .get("/waterEnvXA/standard", {
          params: { enterpriseId: this.enterpriseId, keyword: this.searchStand }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.standTableData = res.data.content.dataList;
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.headStyle {
  .title {
    font-size: 24px;
    font-weight: normal;
    color: #0078e6;
    padding: 10px;
  }
  .containsContent {
    padding: 10px 0;
    margin-left: 10px;
    > span {
      padding-right: 15px;
      > i {
        font-size: 8px;
        &.colorImg0 {
          color: #ed390a;
        }
        &.colorImg1 {
          color: #00e1af;
        }
        &.colorImg2 {
          color: #a3bc56;
        }
        &.colorImg4 {
          color: #27f5f5;
        }
      }
    }
  }
}
.singleModule {
  margin-bottom: 10px;
  height: 100%;
  border: 1px solid #dce9fa;
  padding: 5px;
  .concrete {
    > img {
      padding-right: 5px;
    }
    .smallTitle {
      color: #1a1a1a;
      font-size: 14px;
      font-weight: bold;
    }
    .licence {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .certificateNum {
        > img {
          padding-right: 10px;
        }
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
      }
      > a {
        color: #0078e6;
        font-size: 14px;
      }
    }
    .essentialInfo {
      display: flex;
      justify-content: space-between;
      padding-left: 75px;
      padding-right: 35px;
      .introduce {
        > span {
          > i {
            font-style: normal;
            color: #666666;
          }
          padding: 9px 0;
          font-size: 14px;
          color: #242425;
          width: 330px;
          display: block;
          float: left;
        }
      }
    }
    .formModule {
      padding-top: 10px;
      height: 100%;
      .secondary-toolbar {
        float: right;
        border: none;
      }
    }
  }
}
</style>