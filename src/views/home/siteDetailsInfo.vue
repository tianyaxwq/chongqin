<template>
  <div class="site-details-info">
    <ul class="site-link-list">
      <li
        :class="{active: index === selectIndex}"
        :key="index"
        v-for="(item,index) in siteDetailsList"
        @click="tabToggle(item,index)"
      >{{ item.name }}</li>
    </ul>
    <ul>
      <li v-if="selectIndex === 0">
        <div class="site-info-wrap base-content">
          <el-scrollbar style="height: 100%;">
            <table class="normal-table">
              <tr>
                <th>断面名称</th>
                <td>{{stationFormData.stationName}}</td>
                <th>断面编号</th>
                <td>{{stationFormData.stationCode}}</td>
                <th>密码</th>
                <td>{{stationFormData.stationPassworld}}</td>
              </tr>
              <tr>
                <th>所属区域</th>
                <td>{{stationFormData.provinceId}}</td>
                <th>所属河流</th>
                <td>{{stationFormData.stationRiver}}</td>
                <th>当地管理单位</th>
                <td>-</td>
              </tr>
              <tr>
                <th>站点分类</th>
                <td>{{stationFormData.stationType}}</td>
                <th>站点类别</th>
                <td>{{stationFormData.stationClassify}}</td>
                <th>所属包件</th>
                <td>-</td>
              </tr>
              <tr>
                <th>地表水类型</th>
                <td>{{stationFormData.surfaceWaterTypes}}</td>
                <th>水质目标级别</th>
                <td>{{stationFormData.targetLevel}}</td>
                <th>承建省市</th>
                <td>-</td>
              </tr>
              <tr>
                <th>经度、纬度</th>
                <td>{{stationFormData.longitude}}-{{stationFormData.latitude}}</td>
                <th>排序</th>
                <td>{{stationFormData.sort}}</td>
                <th>上下游省份</th>
                <td>{{stationFormData.stationProvincesUpDown}}</td>
              </tr>
              <tr>
                <th>是否验收</th>
                <td>{{stationFormData.enabled}}</td>
                <th>验收时间</th>
                <td>{{stationFormData.enabledTime}}</td>
                <th>考核城市</th>
                <td>{{stationFormData.city}}</td>
              </tr>
              <tr>
                <th>断面属性</th>
                <td>{{stationFormData.stationProperty}}</td>
                <th>断面功能</th>
                <td>{{stationFormData.stationFunction}}</td>
                <th>运营单位</th>
                <td>{{stationFormData.operCompanyCode}}</td>
              </tr>
              <tr>
                <th>站点地址</th>
                <td colspan="5">{{stationFormData.stationAddress}}</td>
              </tr>
              <tr>
                <th>站点简介</th>
                <td colspan="5">{{stationFormData.stationBriefInfo}}</td>
              </tr>
              <tr>
                <th>历史文化介绍（周边环境）</th>
                <td colspan="5">{{stationFormData.peripheralHistory}}</td>
              </tr>
            </table>
          </el-scrollbar>
        </div>
      </li>
      <li v-if="selectIndex === 1">
        <div class="instrument-param">
          <el-table
            tooltip-effect="light"
            :data="paramsTableData"
            border
            style="width: 100%;"
            height="467px"
          
          >
            <el-table-column type="index" :index="indexMethod" width="50"></el-table-column>
            <el-table-column prop="PROJECT_NAME" show-overflow-tooltip label="监测项目"></el-table-column>
            <el-table-column prop="EQUIPMENT_NAME" show-overflow-tooltip label="分析仪器"></el-table-column>
            <el-table-column prop="MANUFACTOR" show-overflow-tooltip label="仪器厂家"></el-table-column>
            <el-table-column prop="ANALY_METHONS" show-overflow-tooltip label="分析方法"></el-table-column>
            <el-table-column prop="REAGENT" show-overflow-tooltip label="试剂"></el-table-column>
            <el-table-column prop="DETECTION_LIMIT" show-overflow-tooltip width="66" label="检出限"></el-table-column>
            <el-table-column prop="UPPER_LIMIT" show-overflow-tooltip width="134" label="标准上限"></el-table-column>
            <el-table-column prop="LOWER_LIMIT" show-overflow-tooltip width="134" label="标准下限"></el-table-column>
            <el-table-column prop="PROJECT_UNIT" show-overflow-tooltip width="79" label="单位"></el-table-column>
            <el-table-column prop="MANUFACTURE_CODE" show-overflow-tooltip width="120" label="出厂编号"></el-table-column>
            <el-table-column prop="CREATE_TIME" show-overflow-tooltip width="180" label="安装时间">
              <template slot-scope="scope">
                <div>{{new Date(scope.row.CREATE_TIME).format('yyyy-MM-dd hh:mm:ss')}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="ISENABLE" show-overflow-tooltip width="75" label="是否启用">
              <template slot-scope="scope">
                <div>
                  <i
                    style="color:#36C25E;font-size:20px;"
                    class="iconfont icon-chenggongzhuangtai"
                    v-if="scope.row.ISENABLE == '是'"
                  ></i>
                  <i
                    style="color:#FF3333;font-size:20px;"
                    class="iconfont icon-meiyouchenggongdezhuangtai"
                    v-if="scope.row.ISENABLE == '否'"
                  ></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </li>
      <!-- <li v-if="selectIndex === 2">
        <div class="site-image clear">
          <div class="big-image">
            <img :src="siteImage.img" :alt="siteImage.name" :title="siteImage.name" />
          </div>
          <div class="small-image-wrap base-content">
            <el-scrollbar style="height: 100%">
              <ul>
                <li
                  v-for="(item,index) in siteImage.list"
                  :class="{active: siteImage.active === index}"
                  @click="toggleImage(item,index)"
                  :key="index"
                >
                  <img :src="item.img" :alt="item.time" :title="item.time" />
                  <p>{{ item.time }}</p>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </li>-->
    </ul>
  </div>
</template>

<script>
export default {
  name: "siteDetailsInfo",
  data() {
    return {
      selectIndex: 0,
      siteDetailsList: [
        {
          name: "站点信息",
          src: "siteInfo"
        },
        {
          name: "仪器参数",
          src: "instrumentParam"
        }
        // {
        //   name: "站点图片",
        //   src: "siteImage"
        // }
      ],
      siteImage: {
        img: "./static/images/siteImage/site-image.png",
        active: 0,
        name: "2019-05-04 10:00",
        list: [
          {
            img: "./static/images/siteImage/site-image.png",
            time: "2019-05-04 10:00"
          },
          {
            img: "./static/images/siteImage/site-image.png",
            time: "2019-05-04 11:00"
          },
          {
            img: "./static/images/siteImage/site-image.png",
            time: "2019-05-04 12:00"
          },
          {
            img: "./static/images/siteImage/site-image.png",
            time: "2019-05-04 13:00"
          },
          {
            img: "./static/images/siteImage/site-image.png",
            time: "2019-05-04 14:00"
          }
        ]
      },
      stationFormData: {
        stationName: "", // 站点名称
        stationCode: "", // 站点编码
        stationPassworld: "", //密码
        provinceId: "", //所属省份
        areaId: "", //所属城市
        localManagementUnits: "", //当地管理单位
        basinId: "", //所属流域
        stationRiver: "", //所属河流
        stationType: "", //站点分类
        surfaceWaterTypes: "", //地表水类型
        targetLevel: "", //水质目标级别
        stationClassify: "", //站点类别
        longitude: "", // 经度
        latitude: "", // 纬度
        sort: "", //排序
        stationProvincesUpDown: "", //上下游省份
        enabled: "", //是否验收1是0否
        enabledTime: "", //验收时间
        city: "", //考核城市
        stationProperty: "", //站点属性
        stationFunction: "", //站点功能
        operCompanyCode: "", //运维单位
        stationAddress: "", //站点地址
        stationBriefInfo: "", //站点简介
        peripheralHistory: "" //周边历史文化
      },
      paramsTableData:[],
    };
  },
  created() {
    this.stationDetail(this.siteMn);
  },
  methods: {
    //tab页切换
    tabToggle(item, index) {
      this.selectIndex = index;
    },
    //图片选择事件
    toggleImage(item, index) {
      this.siteImage.img = item.img;
      this.siteImage.active = index;
      this.siteImage.name = item.time;
    },
    //查看站点详情
    stationDetail(mn) {
      this.visiDialog = true;
      this.$http
        .get("/SiteManagement/station/stationInfoByMn", {
          params: {
            mn: mn
          }
        })
        .then(res => {
          let obj = res.data.content.info;
          this.stationFormData.stationName = obj.stationName;
          this.stationFormData.stationCode = obj.stationMn;
          this.stationFormData.stationPassworld = obj.stationPassworld;
          if (obj.provinceId) {
            this.stationFormData.provinceId = obj.provinceId.areaName;
          }
          if (obj.area) {
            this.stationFormData.areaId = obj.area.areaName;
          }
          this.stationFormData.localManagementUnits = obj.localMangermnetUnits;
          if (obj.basinn) {
            this.stationFormData.basinId = obj.basinn.basinnName;
          }
          this.stationFormData.stationRiver = obj.stationRiver;
          if (obj.stationtype) {
            this.stationFormData.stationType = obj.stationtype.stationTypeName;
          }
          this.stationFormData.surfaceWaterTypes = obj.suifaceWaterTypes;
          this.stationFormData.targetLevel = obj.targerWaterQuality;
          if (obj.stationClassify) {
            this.stationFormData.stationClassify =
              obj.stationClassify.stationClassifyName;
          }
          this.stationFormData.longitude = obj.longitude;
          this.stationFormData.latitude = obj.latitude;
          this.stationFormData.sort = obj.sort;
          this.stationFormData.stationProvincesUpDown =
            obj.stationProvincesUpDown;
          if (obj.enabled == 1) {
            this.stationFormData.enabled = "是";
          } else {
            this.stationFormData.enabled = "否";
          }
          this.stationFormData.enabledTime = obj.enableTime;
          if (obj.cityId) {
            this.stationFormData.city = obj.cityId.areaName;
          }
          this.stationFormData.stationProperty = obj.stationProperty;
          this.stationFormData.stationFunction = obj.stationFunction;
          this.stationFormData.operCompanyCode = obj.operCompanyName;
          this.stationFormData.stationAddress = obj.stationAddress;
          this.stationFormData.stationBriefInfo = obj.stationBriefInfo;
          this.stationFormData.peripheralHistory = obj.peripheralHistory;
          this.$http
            .get("/SiteManagement/equipment/queryInstrumentParameters", {
              params: {
                stationCodes: this.siteMn,
                pageNumber:1,
                pageSize:15
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.paramsTableData = res.data.content.dataList;
               
              }
            });
        });
    }
  },
  computed: {
    siteMn: {
      get: function() {
        return this.$store.state.siteMn.stationMn;
      }
    }
  }
};
</script>

<style scoped lang="less">
.site-details-info {
}
.site-link-list {
  height: 32px;
  line-height: 30px;
  border-bottom: 1px solid #d6e3f2;
  li {
    width: calc(100% / 6);
    float: left;
    text-align: center;
    border-right: 1px solid #d6e3f2;
    position: relative;
    cursor: pointer;
  }
  /*li:first-child{
    border-left: none;
  }*/
  li:hover {
    background: #eaeff4;
  }
  li.active {
    color: #166bce;
    border-bottom: 1px solid #fff;
  }
  li.active:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: #166bce;
  }
}
.site-info-wrap {
  height: 466px;
  padding: 8px;
}
.normal-table {
  th,
  td {
    height: auto;
    padding: 6px 8px;
  }
  th {
    width: 80px;
  }
  td {
    width: calc(33.3% - 82px);
    line-height: 22px;
  }
}
.instrument-param {
  height: 466px;
}
.site-image {
  height: 466px;
  padding: 16px;
  .big-image {
    border: 3px solid #d6e3f2;
    width: calc(100% - 188px);
    height: 100%;
    float: left;
    & > img {
      height: 100%;
      width: 100%;
    }
  }
  .small-image-wrap {
    float: right;
    width: 178px;
    border: 1px solid #d6e3f2;
    height: 100%;
    ul {
      padding: 8px;
      & > li {
        height: 100px;
        border: 2px solid #cbdef2;
        position: relative;
        margin-bottom: 8px;
        cursor: pointer;
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          border-color: #11a4fb;
        }
        & > p {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding-left: 8px;
          font-size: 12px;
          color: #fff;
        }
        & > img {
          width: 100%;
          height: 100%;
        }
      }
      & > li.active {
        border-color: #11a4fb;
        &:before {
          content: "";
          position: absolute;
          top: 50%;
          margin-left: -5px;
          left: -12px;
          border: 8px solid transparent;
          border-right-color: #11a4fb;
        }
      }
    }
  }
}
</style>
