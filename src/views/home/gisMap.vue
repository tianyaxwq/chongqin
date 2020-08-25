<template>
  <div class="monitoring">
    <div class="monitoring-map-toolbar">
      <ul class="toolbar-list">
        <li>
          <el-dropdown trigger="click" @command="setSiteNameFun">
            <span class="el-dropdown-link">
              {{ setSiteName }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="显示站点名称">显示站点名称</el-dropdown-item>
              <el-dropdown-item command="隐藏站点名称">隐藏站点名称</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown trigger="click" @command="setMapPatternFun">
            <span class="el-dropdown-link">
              {{ setMapPattern }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="常规">常规</el-dropdown-item>
              <el-dropdown-item command="直观">直观</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="wrType">
          <el-dropdown trigger="click" :hide-on-click="false">
            <span class="el-dropdown-link">
              {{ pollutionType }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="pollutionTypeList" @change="pollutionTypeFun">
                <el-dropdown-item>
                  <el-checkbox label="boat">
                    <img src="../../assets/images/index/cbmt.png" alt />
                    船舶码头({{pollutionTypeCount.cbNum || 0}})
                  </el-checkbox>
                  <el-checkbox label="enterprise">
                    <img src="../../assets/images/index/qy.png" alt />
                    企业({{pollutionTypeCount.qyNum || 0}})
                  </el-checkbox>
                  <el-checkbox label="farm">
                    <img src="../../assets/images/index/yzc.png" alt />
                    养殖场({{pollutionTypeCount.yzcNum || 0}})
                  </el-checkbox>
                  <el-checkbox label="qianRenWd">
                    <img src="../../assets/images/index/qdwr.png" alt />
                    千吨万人({{pollutionTypeCount.qdwrNum || 0}})
                  </el-checkbox>
                  <el-checkbox label="waterPool">
                    <img src="../../assets/images/index/nwkt.png" alt />
                    纳污坑塘({{pollutionTypeCount.nwktNum || 0}})
                  </el-checkbox>
                  <el-checkbox label="governProject">
                    <img src="../../assets/images/index/gc.png" alt />
                    工程({{pollutionTypeCount.gcNum || 0}})
                  </el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- <li>
          <el-checkbox v-model="qualityGrade" @change="checkWaterGrade">区域水质等级</el-checkbox>
        </li>
        <li>
          <el-checkbox v-model="qualityGrade2" disabled @change="checkWaterGrade">河流水质等级</el-checkbox>
        </li>
        <li>
          <el-checkbox v-model="analysis" @change="checkAnalysis">水质分析</el-checkbox>
        </li>-->
        <!-- <li>
            <div class="gailan" @click="goTo"> 区域水环境概览</div>
        </li>-->
        <!-- <li>
          <div class="gailan" @click="goTo">溯源分析</div>
        </li>-->
        <!-- <li>
          <button class="water-quality-btn"
                  :class="{active:waterQuality}"
                  @click = "waterQualityPrediction"
                  type="button">
            <i class="iconfont icon-shishishuizhi"></i> 水质预测
          </button>
        </li>-->
      </ul>
      <div class="auto-refresh-box">
        <span>距自动刷新还剩：</span>
        <span class="auto-refresh-time">{{leaveTime}}s</span>
      </div>
    </div>
    <div class="monitoring-map-box">
      <!-- 地图 -->
      <div class="monitoring-map-content" :class="{'toggle-panel':togglePanel}">
        <div id="monitoring-map">
          <mapComp
            mapType="2"
            v-bind:mapInfo="mapInfo"
            v-on:childMethod="openSiteDetailsDialog"
            @pollutionTypeOpen="pollutionTypeOpen"
            v-bind:siteName="setSiteName"
            v-bind:mapPattern="setMapPattern"
            v-bind:qualityGrade="qualityGrade"
            ref="cmap"
          ></mapComp>
        </div>
        <!-- 水质预测时间栏 -->
        <div class="water-quality-prediction-time" v-if="waterQuality">
          <div class="prediction-play-fun">
            <span class="time-line"></span>
            <button
              class="play-prediction"
              :class="{active:playActive}"
              @click="playPredictionRecord"
            >
              <i class="play-icon"></i>
            </button>
          </div>
          <div class="prediction-time-wrap">
            <span class="time-line"></span>
            <span id="prediction-time-line" class="prediction-time-line"></span>
            <ul class="prediction-time-list">
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">08/30(周四)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">08/31(周五)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">09/01(周六)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">09/02(周日)</p>
              </li>
              <li>
                <span class="time-item">
                  <span>04</span>
                </span>
                <span class="time-item">
                  <span>08</span>
                </span>
                <span class="time-item">
                  <span>12</span>
                </span>
                <span class="time-item">
                  <span>16</span>
                </span>
                <span class="time-item">
                  <span>20</span>
                </span>
                <p class="date-text">09/03(周一)</p>
              </li>
            </ul>
          </div>
          <div class="prediction-ater-quality">
            <ul>
              <li>
                <span class="quality-grade-line gradeA"></span>
                <p class="quality-grade-name">Ⅰ~Ⅱ类</p>
              </li>
              <li>
                <span class="quality-grade-line gradeB"></span>
                <p class="quality-grade-name">Ⅲ类</p>
              </li>
              <li>
                <span class="quality-grade-line gradeC"></span>
                <p class="quality-grade-name">Ⅳ类</p>
              </li>
              <li>
                <span class="quality-grade-line gradeD"></span>
                <p class="quality-grade-name">Ⅴ类</p>
              </li>
              <li>
                <span class="quality-grade-line gradeE"></span>
                <p class="quality-grade-name">劣Ⅴ类</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 地图工具栏(new) -->
      <div class="map-comp-toolbar" :class="{'toggle-panel':togglePanel}">
        <ul class="normal-toolbar clear">
          <li>
            <i class="iconfont icon-zhuashou"></i>
            <span class="name">平移</span>
          </li>
          <li @click="meatureTool('LineString')">
            <i class="iconfont icon-ceju1"></i>
            <span class="name">测距</span>
          </li>
          <li @click="meatureTool('Polygon')">
            <i class="iconfont icon-mianji"></i>
            <span class="name">面积</span>
          </li>
          <li @click="resetMeatureTool()">
            <i class="iconfont icon-qingchu"></i>
            <span class="name">清除</span>
          </li>
        </ul>
        <!-- <div class="zoom-in-toolbar">
          <div class="zoom-box">
            <div class="zoom-item" title="定位">
              <i class="location-icon"></i>
            </div>
          </div>
          <div class="zoom-box">
            <div class="zoom-item" title="放大" @click="setMapZoom('in')">
              <i class="el-icon-plus"></i>
            </div>
            <div class="zoom-item" title="缩小" @click="setMapZoom('out')">
              <i class="el-icon-minus"></i>
            </div>
          </div>
        </div>-->
        <div class="map-type-toolbar">
          <div class="type-label" @mouseover="overShowMap" @mouseout="outHideMap">
            <i class="type-icon" :class="mapTypeActive.icon"></i>
            <span>{{ mapTypeActive.name }}</span>
          </div>
          <el-collapse-transition>
            <div
              v-if="mapToggle"
              @mouseover="overShowMap"
              @mouseout="outHideMap"
              class="map-type-panel"
            >
              <el-radio-group v-model="mapType" @change="toggleMapType">
                <div class="group-item" v-for="(item,index) in mapTypeList" :key="index">
                  <el-radio :label="item.value">
                    <i class="type-icon" :class="item.icon"></i>
                    <span>{{ item.name }}</span>
                  </el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-collapse-transition>
        </div>
      </div>

      <!-- 站点类型 -->
      <div
        class="situation-statistics"
        :class="{'toggle-panel':togglePanel}"
        v-if="panelName != '污染类型'"
      >
        <span class="statistics-icon" v-if="!statistics" @click="statistics=true"></span>
        <div class="statistics-panel" :class="{hide:!statistics, 'levelBody': panelName == '站点级别'}">
          <a class="minimize-btn" title="最小化" @click="statistics=false">
            <i class="el-icon-minus"></i>
          </a>
          <div class="panel-header">
            <i class="title-icon"></i>
            <span>{{panelName == "站点类型" ? "站点类型" : "站点级别"}}</span>
          </div>
          <div class="panel-body">
            <el-checkbox-group
              v-model="checkList"
              @change="changeStationType"
              v-if="panelName == '站点类型'"
            >
              <el-checkbox :label="item.label" v-for="(item,key) in checkBoxList" :key="key">
                 <i class="icon" :class="item.icon"></i>
                {{item.name}}
                ({{item.stationLength}})
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group
              v-if="panelName == '站点级别'"
              @change="changeLevel"
              v-model="checkLevelList"
            >
              <el-checkbox :label="item.label" v-for="(item,key) in siteLevelList" :key="key" >
                <i class="icon" :class="item.icon"></i>
                {{item.name}}
                ({{item.stationLength}})
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <!-- 侧边数据面板 -->
      <div id="monitoring-info-panel" class="scrollSpecial" :class="{'toggle-panel':togglePanel}">
        <button type="button" class="panel-toggle-btn" @click="setTogglePanel"></button>

        <div class="monitoring-header-wrap">
          <ul class="header-function-list">
            <li
              :title="item.name"
              :class="[item.cls]"
              :key="index"
              @click="openFunctionDialog(index)"
              v-for="(item,index) in functionList"
            >
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="site-list-wrap">
          <ul class="panelUl">
            <li v-for="(item, index) in panelList" :key="index" @click="handleClick(item)">
              <span :class="item.isCheck ? 'activePanel' : ''">{{item.name}}</span>
            </li>
          </ul>
          <div class="siteSearchName">
            <el-input
              :placeholder="panelName != '污染类型' ? '请输入站点名称关键字' : '请输入污染类型名称关键字'"
              clearable
              v-model="keyWords"
              @change="panelName == '站点类型' ? loadStationPoint() : panelName == '污染类型' ? getPollutionTypeData(pollutionTypeList) : stationCotolLevel()"
            >
              <template slot="append">
                <img src="../../assets/images/index/siteIcon.png" alt />
              </template>
            </el-input>
          </div>
          <!-- <div class="site-type-group">
            <button
              type="button"
              class="type-river-btn"
              :class="{active:index === siteTypeGroupIndex}"
              v-for="item,index in siteTypeGroup"
              @click="selectSiteType(item, index)"
            >{{ item.name }}</button>
          </div>-->
          <div
            class="site-list-box"
            v-loading="siteLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="loading-type-a"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <!--<div v-if="siteLoading" class="loading-wrap"></div>-->
            <div v-if="noDataState" class="no-data-wrap small bannalNo">
              <p>暂无数据</p>
            </div>
            <el-scrollbar style="height: 100%">
              <div class="site-list-content" v-if="panelName != '污染类型'">
                <div class="dataDisplay" v-for="(item, index) in siteList" :key="index">
                  <div class="details" @click="openSiteDetailsDialog(item)">
                    <ul class="headUl">
                      <li>
                        <img src="../../assets/images/companyDetail/location.png" alt />
                        <span :title="item.stationName">{{item.stationName}}</span>
                        <!-- <i>在线</i> -->
                      </li>
                      <li>
                        <img src="../../assets/images/companyDetail/clock.png" alt />
                        <span>{{ item.wRealData && item.wRealData.wq_tp ? item.wRealData.spt : '--' }}</span>
                      </li>
                    </ul>
                    <ul class="footUl">
                      <li>主要污染指标：{{item.wRealData && item.wRealData.primary_pollutant ? item.wRealData.primary_pollutant :'--'}}</li>
                      <li>所属区域：{{item.areaName || '--'}}</li>
                      <li
                        v-if="panelName == '站点类型'"
                      >站点类型：{{item.stationType == "WQ00" ? '地表水水质站' : item.stationType == "WQ01" ? '地下水水质站' : item.stationType == "WQ05" ? '预警站' : item.stationType == "WQ08" ? '手工站' : item.stationType == "WQ09" ? '溯源站' : item.stationType == "WQ10" ? '固定站' : item.stationType == "WQ11" ? '浮船站' : '--'}}</li>
                      <li
                        v-if="panelName == '站点级别'"
                      >站点级别：{{item.controlorLevel == "1" ? '国控' : item.controlorLevel == "3" ? '省控' : item.controlorLevel == "4" ? '区控' : '--'}}</li>
                      <li>
                        水质类别：
                        <span
                          class="target-level"
                          :class="'colorValue' + item.wRealData.wq_tp"
                          v-if="item.wRealData && item.wRealData.wq_tp"
                        >{{ item.wRealData.wq_tp == "0" ? 'Ⅰ' : item.wRealData.wq_tp == "1" ? 'Ⅱ' : item.wRealData.wq_tp == "2" ? 'Ⅲ' : item.wRealData.wq_tp == "3" ? 'Ⅳ' : item.wRealData.wq_tp == "4" ? 'Ⅴ' : item.wRealData.wq_tp == "5" ? '劣Ⅴ' : '' }}</span>
                        <span v-else>--</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="site-list-content" v-if="panelName == '污染类型'">
                <div v-for="(item, index) in wrPanelList" :key="index">
                  <div
                    class="dataDisplay"
                    v-for="(subset, subsetIndex) in item.dataList"
                    :key="subsetIndex"
                  >
                    <!--  -->
                    <div class="details" @click="pollutionTypeOpen(item, subset)">
                      <ul class="headUl">
                        <li class="wrmodel">
                          <img src="../../assets/images/companyDetail/location.png" alt />
                          <span
                            :title="subset.boatName"
                            v-if="item.type == '船舶码头'"
                          >{{subset.boatName ? subset.boatName : '--'}}</span>
                          <span
                            :title="subset.enterpriseName"
                            v-if="item.type == '企业'"
                          >{{subset.enterpriseName ? subset.enterpriseName : '--'}}</span>
                          <span
                            :title="subset.farmName"
                            v-if="item.type == '养殖场'"
                          >{{subset.farmName ? subset.farmName : '--'}}</span>
                          <span
                            :title="subset.WINM"
                            v-if="item.type == '千吨万人'"
                          >{{subset.WINM ? subset.WINM : '--'}}</span>
                          <span
                            :title="subset.proLoca"
                            v-if="item.type == '纳污坑塘'"
                          >{{subset.proLoca ? subset.proLoca : '--'}}</span>
                          <span
                            :title="subset.projectName"
                            v-if="item.type == '工程地'"
                          >{{subset.projectName ? subset.projectName : '--'}}</span>
                          <img
                            v-if="item.type == '船舶码头'"
                            src="../../assets/images/index/cbmtFlag.png"
                            alt
                          />
                          <img
                            v-if="item.type == '企业'"
                            src="../../assets/images/index/qyFlag.png"
                            alt
                          />
                          <img
                            v-if="item.type == '养殖场'"
                            src="../../assets/images/index/yzcFlag.png"
                            alt
                          />
                          <img
                            v-if="item.type == '千吨万人'"
                            src="../../assets/images/index/qdwrFlag.png"
                            alt
                          />
                          <img
                            v-if="item.type == '纳污坑塘'"
                            src="../../assets/images/index/nwktFlag.png"
                            alt
                          />
                          <img
                            v-if="item.type == '工程地'"
                            src="../../assets/images/index/gcFlag.png"
                            alt
                          />
                        </li>
                        <li>
                          <!-- <img src="../../assets/images/companyDetail/clock.png" alt />
                          <span>{{ item.wRealData && item.wRealData.wq_tp ? item.wRealData.spt : '--' }}</span>-->
                        </li>
                      </ul>
                      <ul class="footUl" v-if="item.type == '船舶码头'">
                        <li>船舶类型：{{subset.boatTypeId || '--'}}</li>
                        <li>所属区域：{{subset.areaName || '--'}}</li>
                        <li>IMO编号：{{subset.imo || '--'}}</li>
                        <li>MMSI：{{subset.mmsi || '--'}}</li>
                      </ul>
                      <ul class="footUl" v-if="item.type == '企业'">
                        <li>所属行业：{{subset.enterpriseType || '--'}}</li>
                        <li>所属区域：{{subset.areaName || '--'}}</li>
                        <li>企业编号：{{subset.enterpriseCode || '--'}}</li>
                        <li>企业状态：{{subset.state ? (subset.state == '0' ? '正常营业' : '关停') : '--'}}</li>
                      </ul>
                      <ul class="footUl" v-if="item.type == '养殖场'">
                        <li>养殖场编码：{{subset.farmCode || '--'}}</li>
                        <li>所属区域：{{subset.areaName || '--'}}</li>
                        <li>污染物种类：{{subset.pollutionTypes || '--'}}</li>
                        <li>养殖场面积：{{subset.area || '--'}}</li>
                      </ul>
                      <ul class="footUl" v-if="item.type == '千吨万人'">
                        <li>水源类型：{{subset.WSTYP || '--'}}</li>
                        <li>所属区域：{{subset.CITY || '--'}}</li>
                        <li>地址：{{subset.POSITION || '--'}}</li>
                        <li>检测频率：{{subset.TF || '--'}}</li>
                      </ul>
                      <ul class="footUl" v-if="item.type == '纳污坑塘'">
                        <li>坑塘类型：{{subset.styp ? (subset.styp == 0 ? "水坑" : '干坑') : '--'}}</li>
                        <li>所属区域：{{subset.dist || '--'}}</li>
                        <li>废水性质：{{subset.pww ? (subset.pww == 0 ? '工业废水' : subset.pww == 1 ? '生活污水' : subset.pww == 2 ? '养殖废水' : subset.pww == 3 ? '混合废水' : subset.pww == 4 ? '其他' : '') : '--'}}</li>
                        <li>所属河流：{{subset.riverName || '--'}}</li>
                      </ul>
                      <ul class="footUl" v-if="item.type == '工程地'">
                        <li>施工单位：{{subset.constructCompany || '--'}}</li>
                        <li>建设单位：{{subset.buildCompany || '--'}}</li>
                        <li>建设地点：{{subset.address || '--'}}</li>
                        <li>投资规模：{{subset.investScale || '--'}}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <!-- 地图图例 -->
      <span class="map-legend-min" v-if="mapLegendMin" @click="maximizationToggle"></span>
      <div
        id="map-legend"
        class="map-legend"
        v-if="legendShow"
        :class="{'min-map-legend':mapLegendMin}"
      >
        <div class="legend-wrap">
          <ul class="legend-list">
            <li :key="index" v-for="(item,index) in legendList">
              <i class="sl-icon" :class="item.icon"></i>
              <span>{{ item.name }}</span>
              <span>({{ item.value }})</span>
            </li>
          </ul>
          <div class="legend-site-state"></div>
        </div>
        <!-- <button
          v-if="!mapLegendMin"
          class="legend-toggle-btn"
          :class="{active:legendToggle}"
          @click="toggleLegendHeight"
        >
          <span>{{ toggleVal }}</span>
          <i class="iconfont icon-xiatui"></i>
        </button>-->
        <span class="legend-close-btn" title="最小化" @click="minimizeToggle">
          <i class="el-icon-minus"></i>
        </span>
      </div>

      <!-- 地图工具栏 -->
      <!-- <ul class="map-toolbar-box" :class="{'toggle-toolbar-box':togglePanel}">
        <li>
          <button type="button" class="toolbar-btn" title="放大" @click="setMapZoom('in')"><i class="iconfont icon-zoom-in"></i></button>
        </li>
        <li>
          <button type="button" class="toolbar-btn" title="缩小" @click="setMapZoom('out')"><i class="iconfont icon-zoom-out"></i></button>
        </li>
        <li>
          <button type="button" class="toolbar-btn" title="测距" @click="meatureTool('polyline')"><i class="iconfont icon-ceju1"> </i></button>
        </li>
        <li>
          <button type="button" class="toolbar-btn" title="侧面积" @click="meatureTool('polygon')"><i class="iconfont icon-notification"></i></button>
        </li>
        <li>
          <button type="button" class="toolbar-btn" title="清除" @click="resetMeatureTool()"><i class="iconfont icon-qingchu"></i></button>
        </li>
        <li>
          <button type="button" class="toolbar-btn toolbar-toggle" title="图层"><i class="iconfont icon-layer"></i></button>
          <div class="toolbar-btn-list">
            <span class="toolbar-btn" title="简易图" @click="changeBaseLayer('vec')">矢量图</span>
            <span class="toolbar-btn" title="地形图" @click="changeBaseLayer('ter')">地形图</span>
            <span class="toolbar-btn" title="影像图" @click="changeBaseLayer('img')">影像图</span>
          </div>
        </li>
      </ul>-->

      <!-- 自定义快捷菜单 -->
      <div class="shortcut-menu-wrap" v-if="false">
        <div class="menu-btn-wrap">
          <a
            class="custom-btn"
            @click.stop="menuListPanelToggle"
            :class="{active:menuListToggle}"
            href="javascript:;"
          >
            <i class="iconfont icon-zidingyikuaijiecaidan"></i>
            <span>自定义快捷菜单</span>
          </a>
          <a
            class="toggle-btn"
            @click.stop="menuExhibitionToggle"
            href="javascript:;"
            :class="{active:menuPanelToggle}"
          >
            <i class="el-icon-caret-bottom"></i>
          </a>
        </div>
        <el-collapse-transition>
          <div class="menu-list" v-if="menuListToggle" @click.stop>
            <el-scrollbar style="height: 100%">
              <div class="add-menu">
                <div class="menu-title">
                  <span class="name">可添加菜单</span>
                  <span class="toggle-btn" @click="toggleAddMenu" :class="{active:addMenu.toggle}">
                    <i class="el-icon-arrow-up"></i>
                  </span>
                </div>
                <el-collapse-transition>
                  <ul class="menu-operation" v-if="addMenu.toggle">
                    <li v-for="(item,index) in addMenu.list" :key="index">
                      <span class="list-item">{{ item.name }}</span>
                      <span class="operation-btn" @click="addShortcutMenu(item,index)">
                        <i class="el-icon-circle-plus-outline"></i>
                      </span>
                    </li>
                  </ul>
                </el-collapse-transition>
              </div>
              <div class="added-menu">
                <div class="menu-title">
                  <span class="name">已添加菜单</span>
                  <span
                    class="toggle-btn"
                    @click="toggleAddedMenu"
                    :class="{active:addedMenu.toggle}"
                  >
                    <i class="el-icon-arrow-up"></i>
                  </span>
                </div>
                <el-collapse-transition>
                  <ul class="menu-operation" v-if="addedMenu.toggle">
                    <li v-for="(item,index) in addedMenu.list" :key="index">
                      <span class="list-item">{{ item.name }}</span>
                      <span class="operation-btn" @click="removeShortcutMenu(item,index)">
                        <i class="el-icon-remove-outline"></i>
                      </span>
                    </li>
                  </ul>
                </el-collapse-transition>
              </div>
            </el-scrollbar>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div
            class="menu-panel"
            @click.stop
            v-if="menuPanelToggle"
            :class="{smallPanel: addedMenu.list.length <= 3}"
          >
            <el-scrollbar style="height: 100%">
              <ul class="menu-item-list clear">
                <li v-for="(item,index) in addedMenu.list" :key="index">
                  <i class="item-icon" :style="{backgroundImage: 'url('+ item.icon +')'}"></i>
                  <span class="item-name">{{ item.name }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-collapse-transition>
      </div>
    </div>

    <!-- 实时监控弹窗-->
    <el-dialog width="442px" :visible.sync="showDialog">
      <div slot="title" class="title">
        <p class="el-dialog-title">实时监控</p>
        <p class="el-dialog-subtitle">
          {{ getrealtime() }}
          <span class="search-data-btn" @click="viewRealTimeData">查看实时数据</span>
        </p>
      </div>
      <div
        class="real-time-monitoring"
        v-loading="realTimeLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <!--<div v-if="realTimeLoading" class="loading-wrap"></div>-->
        <div v-if="realTimeNoDataState" class="no-data-wrap small">
          <p>暂无数据</p>
        </div>
        <div id="real-time-monitoring-chart"></div>
        <ul class="monitoring-chart-legend">
          <li :key="index" v-for="(item,index) in realTimeLegend">
            <i class="legend-icon" :class="item.icon"></i>
            <span class="legend-name">{{ item.name }}</span>
            <span class="legend-number">{{ item.value }}</span>
            <span class="legend-proportion">{{ item.percent }}</span>
          </li>
        </ul>
      </div>
    </el-dialog>

    <!-- 年度目标考核现状 -->
    <el-dialog width="442px" :visible.sync="assessment">
      <div slot="title" class="title">
        <p class="el-dialog-title">年度目标考核现状</p>
        <p class="el-dialog-subtitle">{{getrealtime()}}</p>
      </div>
      <div
        class="real-time-monitoring"
        v-loading="assessmentLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="loading-type-a"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <!--<div v-if="assessmentLoading" class="loading-wrap"></div>-->
        <div v-if="assessmentNoDataState" class="no-data-wrap small">
          <p>暂无数据</p>
        </div>
        <div id="target-assessment"></div>
        <ul class="monitoring-chart-legend target-assessment-legend">
          <li :key="index" v-for="(item,index) in targetAssessment">
            <i class="legend-icon" :class="item.icon"></i>
            <span class="legend-name">{{ item.name }}</span>
            <span class="legend-number">{{ item.value }}</span>
            <span class="legend-proportion">{{ Math.retain(item.percent)}}%</span>
          </li>
        </ul>
      </div>
    </el-dialog>

    <!-- 水质排名 -->
    <el-dialog width="442px" :visible.sync="waterQualityRanking">
      <div slot="title" class="title">
        <p class="el-dialog-title">水质排名</p>
        <p class="el-dialog-subtitle">{{getrealtime()}}</p>
      </div>
      <waterRanking ref="crank" :equipIds="equipIds" :datas="siteList" v-if="waterQualityRanking"></waterRanking>
    </el-dialog>

    <!-- 水质污染趋势分析 -->
    <el-dialog width="700px" :visible.sync="waterTrendAnalysis">
      <div slot="title" class="title">
        <p class="el-dialog-title">水质污染趋势分析</p>
        <p class="el-dialog-subtitle">{{getrealtime()}}</p>
      </div>
      <trend-analysis ref="cwaterTrendAnalysis"></trend-analysis>
    </el-dialog>

    <!-- 实时数据 -->
    <el-dialog width="700px" :visible.sync="realTimeDia">
      <div slot="title" class="title">
        <p class="el-dialog-title">实时数据</p>
        <p class="el-dialog-subtitle">{{getrealtime()}}</p>
      </div>
      <real-time ref="realTimewindow" :equipIds="equipIds" :datas="siteList" v-if="realTimeDia"></real-time>
    </el-dialog>

    <!-- 水质公报 -->
    <el-dialog width="900px" title="水质公报" :visible.sync="qualityBulletin">
      <water-quality-bulletin ref="qualityBulletinwindow" :equipIds="equipIds"></water-quality-bulletin>
    </el-dialog>

    <!-- 站点详情弹窗 -->
    <el-dialog width="780px" :visible.sync="siteDetailsToggle">
      <div slot="title" class="title">
        <span class="detailTitle">{{siteDetailsToggleTitle}}</span>
        <!-- <i v-if="siteInfo.state === 'overproof'" class="iconfont icon-baojing"></i>
        <span class="site-title-name">{{siteInfo.siteName}}</span>
        <span v-if="siteInfo.state === 'overproof'" class="give-alarm-text">(COD超标报警)</span>
        <div class="site-extra-function">
          <button
            class="site-fun-btn"
            v-if="siteInfo.state === 'offLine' || siteInfo.state === 'overproof'"
          >
            去处理
            <i class="iconfont icon-cebianlanzhankai"></i>
          </button>
          <button class="site-fun-btn" v-if="siteInfo.state === 'overproof'">
            去溯源
            <i class="iconfont icon-cebianlanzhankai"></i>
          </button>
        </div>-->
      </div>
      <site-details v-if="siteDetailsToggle" ref="csiteDetails" @showwindtitle="onshowwindtitle"></site-details>
    </el-dialog>

    <el-dialog width="780px" :visible.sync="wrDetailsToggle">
      <div slot="title" class="title">
        <span class="detailTitle">{{bigObj.type == '工程地' ? '工程' : bigObj.type}}详情</span>
      </div>
      <div class="detailStyle">
        <div class="packageDiv">
          <div class="bigTitle">
            <span>基本信息</span>
          </div>
          <div class="bigCont">
            <div class="name">
              <img v-if="bigObj.type == '船舶码头'" src="../../assets/images/index/cbxq.png" alt />
              <img v-if="bigObj.type == '企业'" src="../../assets/images/index/qyxq.png" alt />
              <img v-if="bigObj.type == '养殖场'" src="../../assets/images/index/yzcxq.png" alt />
              <img v-if="bigObj.type == '千吨万人'" src="../../assets/images/index/qdwrxq.png" alt />
              <img v-if="bigObj.type == '纳污坑塘'" src="../../assets/images/index/nwktxq.png" alt />
              <img v-if="bigObj.type == '工程地'" src="../../assets/images/index/gcxq.png" alt />
              <span>{{childObj.boatName || childObj.enterpriseName || childObj.farmName || childObj.WINM || childObj.proLoca || childObj.projectName || '--'}}</span>
            </div>
            <img v-if="bigObj.type == '船舶码头'" src="../../assets/images/index/cbImg.png" alt />
            <img v-if="bigObj.type == '企业'" src="../../assets/images/index/qyImg.png" alt />
            <img v-if="bigObj.type == '养殖场'" src="../../assets/images/index/yzcImg.png" alt />
            <img v-if="bigObj.type == '千吨万人'" src="../../assets/images/index/qdwrImg.png" alt />
            <img v-if="bigObj.type == '纳污坑塘'" src="../../assets/images/index/nwktImg.png" alt />
            <img v-if="bigObj.type == '工程地'" src="../../assets/images/index/gcImg.png" alt />
            <ul v-if="bigObj.type == '船舶码头'">
              <li>呼号：{{childObj.boatImoCode || '--'}}</li>
              <li>IMO编号：{{childObj.imo || '--'}}</li>
              <li>所属区域：{{childObj.areaName || '--'}}</li>
              <li>MMSI：{{childObj.mmsi || '--'}}</li>
              <li>类型：{{childObj.boatTypeId || '--'}}</li>
              <li>船棋：{{childObj.boatFlag || '--'}}</li>
              <li>建造时间：{{new Date(childObj.createTime).format('yyyy-MM-dd') || '--'}}</li>
              <li>DWT：{{childObj.dwt || '--'}}</li>
              <li>吃水：{{childObj.draft || '--'}}</li>
              <li>船籍港：{{childObj.portId || '--'}}</li>
              <li>船速：{{childObj.speed || '--'}}</li>
              <li>船龄：{{childObj.age || '--'}}</li>
              <li>长宽型深：{{childObj.dept || '--'}}</li>
              <li>主机功率：{{childObj.power || '--'}}</li>
              <li>船东：{{childObj.userName || '--'}}</li>
              <li>运营商：{{childObj.operator || '--'}}</li>
            </ul>
            <ul class="oneForTwo" v-if="bigObj.type == '企业'">
              <li>企业编号：{{childObj.enterpriseCode || '--'}}</li>
              <li>所属区域：{{childObj.areaName || '--'}}</li>
              <li>联系人：{{childObj.leaderName || '--'}}</li>
              <li>所属行业：{{childObj.enterpriseType || '--'}}</li>
              <li>联系电话：{{childObj.tel || '--'}}</li>
              <li>上年实际产量：{{childObj.num || '--'}}</li>
              <li>企业状态：{{childObj.state ? (childObj.state == '0' ? '正常营业' : '关停') : '--'}}</li>
              <li>技术改造设施：{{childObj.draft || '--'}}</li>
              <li>经度：{{childObj.longitude || '--'}}</li>
              <li>纬度：{{childObj.latitude || '--'}}</li>
              <li>地址：{{childObj.location || '--'}}</li>
            </ul>
            <ul class="oneForTwo" v-if="bigObj.type == '养殖场'">
              <li>养殖场编号：{{childObj.farmCode || '--'}}</li>
              <li>行政区划：{{childObj.areaName || '--'}}</li>
              <li>养殖小区名称：{{childObj.village || '--'}}</li>
              <li>面积：{{childObj.area || '--'}}</li>
              <li>负责人：{{childObj.userName || '--'}}</li>
              <li>联系电话：{{childObj.tel || '--'}}</li>
              <li>污染物种类：{{childObj.pollutionTypes || '--'}}</li>
              <li>受纳水体：{{childObj.receivingWater || '--'}}</li>
              <li>地址：{{childObj.farmLoca || '--'}}</li>
            </ul>
            <ul class="oneForTwo" v-if="bigObj.type == '千吨万人'">
              <li>行政区域：{{childObj.CITY || '--'}}</li>
              <li>水源水质监测频率：{{childObj.TF || '--'}}</li>
              <li>水源类型：{{childObj.WSTYP || '--'}}</li>
              <li>未划定原因：{{childObj.RSN || '--'}}</li>
              <li>地址：{{childObj.POSITION || '--'}}</li>
            </ul>
            <ul class="oneForTwo" v-if="bigObj.type == '纳污坑塘'">
              <li>纳污坑塘编号：{{childObj.poolCode || '--'}}</li>
              <li>所属区域：{{childObj.dist || '--'}}</li>
              <li>经度：{{childObj.longitude || '--'}}</li>
              <li>纬度：{{childObj.latitude || '--'}}</li>
              <li>坑塘类型：{{childObj.styp ? (childObj.styp == 0 ? "水坑" : '干坑') : '--'}}</li>
              <li>酸碱性：{{childObj.abp ? (childObj.abp == 0 ? '酸性' : '碱性') : '--'}}</li>
              <li>所属河流：{{childObj.riverName || '--'}}</li>
              <li>废水性质：{{childObj.pww ? (childObj.pww == 0 ? '工业废水' : childObj.pww == 1 ? '生活污水' : childObj.pww == 2 ? '养殖废水' : childObj.pww == 3 ? '混合废水' : childObj.pww == 4 ? '其他' : '') : '--'}}</li>
              <li>是否仍在纳污：{{childObj.cap ? (childObj.cap == 1 ? '是' : '否') : '--'}}</li>
              <li>是否涉重金属：{{childObj.hm ? (childObj.hm == 1 ? '是' : '否') : '--'}}</li>
              <li>是否有恶臭：{{childObj.stink ? (childObj.stink == 1 ? '是' : '否') : '--'}}</li>
              <li>责任人：{{childObj.investigationUserName || '--'}}</li>
            </ul>
            <ul class="oneForTwo" v-if="bigObj.type == '工程地'">
              <li>建设单位：{{childObj.buildCompany || '--'}}</li>
              <li>施工单位：{{childObj.constructCompany || '--'}}</li>
              <li>设计单位：{{childObj.designCompany || '--'}}</li>
              <li>建设地点：{{childObj.address || '--'}}</li>
              <li>处理工艺：{{childObj.technology || '--'}}</li>
              <li>投资规模：{{childObj.investScale || '--'}}</li>
              <li>建设内容：{{childObj.content || '--'}}</li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import slDialog from '@/components/currency/dialog'
import waterRanking from "@/views/home/waterRanking";
import trendAnalysis from "@/views/home/trendAnalysis";
import siteDetails from "@/views/home/siteDetails";
import realTime from "@/views/home/realTime";
import waterQualityBulletin from "@/views/home/waterQualityBulletin";

import mapComp from "@/views/home/map_yuli";
// import {formatDate} from '../../dateformat.js'
let functionList = [
  // {
  //   //数据面板功能列表
  //   name: "实时监控",
  //   cls: "real-time-monitoring",
  //   dialog: "realTimeDia"
  // },
  {
    name: "实时数据",
    cls: "real-time-data",
    dialog: "realTimeDia"
  },
  {
    name: "水质排名",
    cls: "water-quality-ranking",
    dialog: "waterRankingDia"
  },
  {
    name: "趋势分析",
    cls: "trend-analysis",
    dialog: "trendAnalysisDia"
  }
  // {
  //   name: "年度考核",
  //   cls: "assessment-status",
  //   dialog: "assessmentStatusDia"
  // }
  // {
  //   name: "水质公报",
  //   cls: "water-quality-bulletin",
  //   dialog: "waterQualityDia"
  // }
];
let siteTypeList = [
  {
    //站点类型数据列表
    name: "全部",
    number: "3",
    type: "all"
  },
  {
    name: "正常",
    number: "3",
    type: "normal"
  },
  {
    name: "数据异常",
    number: "0",
    type: "dataAnomaly"
  },
  {
    name: "联网异常",
    number: "0",
    type: "networkAnomaly"
  },
  {
    name: "视频掉线",
    number: "0",
    type: "videoDropOut"
  }
];
let siteTypeGroup = [
  {
    name: "按河流",
    type: "river"
  },
  {
    name: "按区域",
    type: "area"
  }
];
let realTimeLegend = [
  /*{
     name:'正常',
     value: 96,
     percent:'68.2%',
     icon:'normal'
  },{
    name:'超标',
    value: 26,
    percent:'10.4%',
    icon:'overproof'
  },{
    name:'异常',
    value: 41,
    percent:'16.7%',
    icon:'abnormal'
  },{
    name:'断线',
    value: 13,
    percent:'8.7%',
    icon:'disconnection'
  }*/
];
let targetAssessment = [
  /*{
    name:'提升',
    value: 96,
    percent:'68.2',
    icon:'normal'
  },{
    name:'持平',
    value: 26,
    percent:'10.4',
    icon:'disconnection'
  },{
    name:'下降',
    value: 41,
    percent:'16.7',
    icon:'overproof'
  }*/
];
export default {
  name: "gisMap",
  data() {
    return {
      panelName: "站点级别",
      panelList: [
        {
          name: "站点级别",
          isCheck: true
        },
        {
          name: "站点类型",
          isCheck: false
        },
        {
          name: "污染类型",
          isCheck: false
        }
      ],
      pollutionTypeCount: {},
      wrPanelList: [],
      keyWords: "",
      stationTypes: "WQ05", //站点类型
      syncMask: true,
      assessmentLoading: true,
      assessmentNoDataState: false,
      // monitoringLoading:true,
      siteLoading: true,
      noDataState: false,
      leaveTime: 300,
      setSiteName: "隐藏站点名称", //站点名称设置
      setMapPattern: "常规", //地图直观与常规模式设置,
      pollutionType: "污染类型",
      pollutionTypeList: [],
      qualityGrade: false, //区域水质等级选中与未选中
      qualityGrade2: false, //区域水质等级选中与未选中
      analysis: false,
      waterQuality: false, //水质预测启动与关闭
      legendToggle: false, //地图图例收起与展示数据
      legendShow: true, //地图图例显示与隐藏
      toggleVal: "展开", //地图图例收起与展示按钮名称
      togglePanel: false, //数据面板展开与收起
      classPollution: "中度污染", //优、良、轻度、中度、重度
      classPollutionIcon: "moderate", //excellent、good、milder、moderate、severe
      majorPollutants: "氨氮、总磷、溶解氧", //主要污染指标
      updateTime: "2018-06-06 14:00:00",
      functionList, //数据面板功能列表
      siteTypeList, //站点类型数据列表
      siteTypeIndex: 0,
      siteTypeValue: "all",
      siteTypeGroup, //河流、区域按钮数据
      siteTypeGroupIndex: 0, //河流、区域按钮选中下标值
      siteTypeGroupValue: "river",
      siteList: [], //站点列表
      showDialog: false, //实时监控弹窗
      realTimeLoading: true, //实时监控loading
      realTimeNoDataState: false, //实时监控无数据状态
      realTimeLegend, //实时监控chart图例
      assessment: false, //年度目标考核现状弹窗
      targetAssessment, //年度目标考核现状chart图例
      waterQualityRanking: false, //水质排名弹窗打开与关闭绑定数据
      waterTrendAnalysis: false, //水质污染趋势分析弹窗打开与关闭绑定数据
      realTimeDia: false, //实时数据弹窗打开与关闭绑定数据
      qualityBulletin: false, //水质公报弹窗打开与关闭绑定数据
      siteDetailsToggle: false, //站点详情弹窗打开与关闭绑定数据
      siteDetailsToggleTitle: "",
      wrDetailsToggle: false, // 污染类型详情
      bigObj: {},
      childObj: {},
      siteInfo: {}, //用来储存点击站点信息
      showRegional: false, //显示区水质图表详情
      setTimer: null, //延时器
      weatherTimer: null, //天气延时器
      playActive: false,
      predictionTimer: null,
      predictionBfb: 0,
      equipIds: [],
      mapInfo: [], //站点数据地图展示传入 map.vue中
      legendList: [
        {
          name: "地表水区控制监测断面",
          value: 6,
          icon: "legend-icon1"
        },
        {
          name: "地表水镇级制监测断面",
          value: 10,
          icon: "legend-icon2"
        },
        {
          name: "区级饮用水源地断面",
          value: 5,
          icon: "legend-icon3"
        },
        {
          name: "地表水信息公开断面",
          value: 5,
          icon: "legend-icon4"
        },
        {
          name: "地表水出入境断面",
          value: 5,
          icon: "legend-icon5"
        },
        {
          name: "地表水自动监测站",
          value: 7,
          icon: "legend-icon6"
        },
        {
          name: "地表水三年行动计划监测断面",
          value: 7,
          icon: "legend-icon7"
        }
      ],
      mapLegendMin: false,
      mapType: 3, //地图类型
      mapTypeList: [
        {
          icon: "vectorgraph-icon",
          name: "矢量图",
          value: 1
        },
        // {
        //   icon: "topographic-icon",
        //   name: "地形图",
        //   value: 2
        // },
        {
          icon: "image-map-icon",
          name: "影像图",
          value: 3
        }
      ],
      mapTypeActive: {
        name: "影像图",
        icon: "image-map-icon"
      },
      mapToggle: false,
      mapTypeTimer: null,
      statistics: true, //控制本月运营情况统计面板显示与隐藏
      menuListToggle: false, //控制快捷菜单面板的显示与隐藏
      menuPanelToggle: false, //控制快捷菜单展示面板显示与隐藏
      addMenu: {
        toggle: true,
        list: [
          {
            //可添加自定义菜单数据
            name: "故障审核",
            icon: "./static/images/shortcutMenu/gzsh-icon.png",
            url: ""
          },
          {
            name: "设备管理",
            icon: "./static/images/shortcutMenu/sbgl-icon.png",
            url: ""
          },
          {
            name: "人员管理",
            icon: "./static/images/shortcutMenu/rygl-icon.png",
            url: ""
          }
        ]
      },
      addedMenu: {
        toggle: true,
        list: [
          {
            name: "历史巡检",
            icon: "./static/images/shortcutMenu/lsxj-icon.png",
            url: ""
          },
          {
            name: "历史故障",
            icon: "./static/images/shortcutMenu/lsgz-icon.png",
            url: ""
          },
          {
            name: "人员考核",
            icon: "./static/images/shortcutMenu/rykh-icon.png",
            url: ""
          }
        ]
      },
      siteTreeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      checkBoxList: [
        // {name: "地表水水质站", label: "WQ00"},
        // {name: "地下水水质站", label: "WQ01"},
        {name: "预警站", label: "WQ05", icon: "icon6"},
        {name: "手工站", label: "WQ08", icon: "icon1"},
        {name: "溯源站", label: "WQ09", icon: "icon8" },
        {name: "固定站", label: "WQ10", icon: "icon9"},
        {name: "浮船站", label: "WQ11", icon: "icon10"},
        // { name: "国控站", label: "WQ03", icon: "icon11" },
        // { name: "省控站", label: "WQ04", icon: "icon13" },
        // { name: "加密站", label: "WQ08", icon: "icon1" },
        // { name: "噪声站", label: "ZS02", icon: "icon2" },
        //  { name: "空气站", label: "MM01", icon: "icon3" },
        // { name: "排污口", label: "WQ07", icon: "icon4" },
        // { name: "地下水质站", label: "WQ01", icon: "icon5" },
        // { name: "预警站", label: "WQ05", icon: "icon6" },
        // { name: "水质监测", label: "WQ06", icon: "icon7" },
        // { name: "溯源站", label: "WQ09", icon: "icon8" },
        // { name: "固定站", label: "WQ10", icon: "icon9" }
        // { name: "码头", label: "MT01", icon: "icon11" },
        //{ name: "水闸", label: "SZ01", icon: "icon12" },
        // { name: "入淀口", label: "WQ13", icon: "icon13" }
      ],
      siteLevelList: [
        { name: "国控", label: "1", icon: "iconGK" },
        { name: "省控", label: "3", icon: "iconSK" },
        { name: "区控", label: "4", icon: "iconQK" }
      ],
      checkList: ["WQ05"],
      checkLevelList: ["1"],
      stationLevelTypes: "1",
    };
  },
  created() {
    this.$store.commit("setLevMenudata", []);
    this.searchTreeData();
    this.searchLevelNum();
    this.getPollutionTypeCount();
    // 静态初始站点数据 之后你们从后台请求
    //  this.mapInfo = [{lng:121.471, lat:30.917, "name":"浦南运河","aqi":213,"category":1, grade:1,wqlindex:12},
    // {lng:121.571, lat:30.9347, "name":"钱桥","aqi":43,"category":1, grade:1,wqlindex:1.22}
    // ]
  },
  methods: {
    // 右侧面板切换
    handleClick(obj) {
      this.panelName = obj.name;
      this.keyWords = "";
      this.panelList.map(el => {
        if (el.name == obj.name) {
          el.isCheck = true;
        } else {
          el.isCheck = false;
        }
      });
      if (this.panelName == "站点类型") {
        this.loadStationPoint();
      } else if (this.panelName == "污染类型") {
        this.getPollutionTypeData(this.pollutionTypeList);
      } else {
        this.stationCotolLevel();
      }
    },
    // 站点级别门面板数据
    stationCotolLevel() {
      this.siteLoading = true;
      this.$http
        .get("/dataHandle/yunliBase/getXhWaterDataByCL", {
          params: {
            controlLevels: this.stationLevelTypes,
            key: this.keyWords
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            const stations = dataJson.content.dataList;
            this.siteList = stations;
            this.mapInfo = stations;
            this.siteLoading = false;
          }
        })
        .catch(error => {});
    },
    // 获取站点级别对应数量
    searchLevelNum () {
      this.$http
        .get("/basicData/station/queryStationConLNum", {
          params: {
            classType: "WQ"
          }
        })
        .then(response => {
          let list = response.data.content.info;
          this.siteLevelList.map(el => {
            for (let i in list) {
              if (el.label == i) {
                el.stationLength = list[i];
              }
            }
          });
        })
        .catch(error => {});
    },
    //获取站点数量
    searchTreeData() {
      /* 基本信息请求 */
      this.$http
        .get("/basicData/station/stationTypeNum", {
          params: {
            classType: "WQ"
          }
        })
        .then(response => {
          let list = response.data.content.info;
          this.checkBoxList.map(el => {
            for (let i in list) {
              if (el.label == i) {
                el.stationLength = list[i];
              }
            }
          });
        })
        .catch(error => {});
    },
    changeLevel (val) {
      if(val && val.length > 0) {
        let list = val.join(',');
        this.stationLevelTypes = list;
        this.stationCotolLevel()
      }
    },
    changeStationType(values) {
      if (values) {
        values = values.join(",");
        this.stationTypes = values;
        //this.changeSiteType();
        this.loadStationPoint();
        //this.packStatonTypeListVP();
      } else {
      }
    },
    goTo() {
      this.$router.push("/tranceSource");
    },
    //展开与收起设置快捷菜单面板
    menuListPanelToggle() {
      if (this.menuListToggle) {
        this.menuListToggle = false;
      } else {
        this.menuListToggle = true;
      }
      this.menuPanelToggle = false;
    },
    //展开与收起快捷菜单展示面板
    menuExhibitionToggle() {
      if (this.menuPanelToggle) {
        this.menuPanelToggle = false;
      } else {
        this.menuPanelToggle = true;
      }
      this.menuListToggle = false;
    },
    /* 可添加菜单展开与收起 */
    toggleAddMenu() {
      if (this.addMenu.toggle) {
        this.addMenu.toggle = false;
      } else {
        this.addMenu.toggle = true;
      }
    },
    /* 已添加菜单展开与收起 */
    toggleAddedMenu() {
      if (this.addedMenu.toggle) {
        this.addedMenu.toggle = false;
      } else {
        this.addedMenu.toggle = true;
      }
    },
    //添加快捷菜单
    addShortcutMenu(item, index) {
      let arr = this.addMenu.list.splice(index, 1);
      this.addedMenu.list.unshift(arr[0]);
    },
    //删除快捷菜单
    removeShortcutMenu(item, index) {
      let arr = this.addedMenu.list.splice(index, 1);
      this.addMenu.list.unshift(arr[0]);
    },
    //切换地图类型改变事件
    toggleMapType(val) {
      for (let i = 0; i < this.mapTypeList.length; i++) {
        if (val === this.mapTypeList[i].value) {
          this.mapTypeActive.name = this.mapTypeList[i].name;
          this.mapTypeActive.icon = this.mapTypeList[i].icon;
          break;
        }
      }
      this.$refs.cmap.switchBaseLayer(val);
    },
    overShowMap() {
      clearTimeout(this.mapTypeTimer);
      this.mapToggle = true;
    },
    outHideMap() {
      this.mapTypeTimer = setTimeout(() => {
        this.mapToggle = false;
      }, 300);
    },
    gotrance() {
      this.$router.push("/tranceSource");
    },
    setMapZoom(type) {
      this.$refs.cmap.setMapZoom(type);
    },
    meatureTool(type) {
      this.$refs.cmap.meatureTool(type);
    },
    resetMeatureTool() {
      this.$refs.cmap.resetMeatureTool();
    },
    changeBaseLayer(type) {
      this.$refs.cmap.changeBaseLayer(type);
    },
    viewRealTimeData() {
      //查看实时数据
      this.showDialog = false;
      this.realTimeDia = true;
      this.$nextTick(() => {
        this.$refs.realTimewindow.searchcolumn();
      });
    },
    checkWaterGrade(val) {
      if (val) {
        this.allAreaStatus();
      }
    },
    checkAnalysis(val) {
      this.$refs.cmap.loadImageKSOv(val);
      themeLink.setAttribute("href", path);
    },
    playPredictionRecord() {
      let line = document.getElementById("prediction-time-line");
      let _this = this;
      if (this.predictionBfb === 100) {
        this.predictionBfb = 0;
      }
      if (this.playActive) {
        this.playActive = false;
        clearInterval(this.predictionTimer);
      } else {
        this.playActive = true;
        this.predictionTimer = setInterval(function() {
          _this.predictionBfb += 3.33;
          if (_this.predictionBfb >= 100) {
            _this.predictionBfb = 100;
            _this.playActive = false;
            clearInterval(_this.predictionTimer);
          }

          line.style.width = _this.predictionBfb + "%";
        }, 500);
      }
    },
    onshowwindtitle(val) {
      this.siteInfo = {
        siteName: val.name
      };
    },
    waterQualityPrediction() {
      if (this.waterQuality) {
        //关闭水质预测
        this.waterQuality = false;
        this.togglePanel = false; //关闭侧栏面板
        this.legendShow = true; //隐藏地图图例
      } else {
        //开启水质预测
        this.waterQuality = true;
        this.togglePanel = true; //打开侧栏面板
        this.legendShow = false; //显示地图图例
      }
    },
    // 污染类型详情
    pollutionTypeOpen(obj, childObj) {
      this.wrDetailsToggle = true;
      this.bigObj = obj;
      this.childObj = childObj;
    },
    // 站点详情
    openSiteDetailsDialog(data) {
      this.siteDetailsToggle = true;
      this.siteDetailsToggleTitle = data.stationName;
      this.$store.commit("setSiteMn", data);

      this.$store.commit("setStationinfo", [
        {
          nodeId: data.stationMn,
          nodeName: data.name
        }
      ]);
    },
    setSiteNameFun(command) {
      this.setSiteName = command;
    },
    setMapPatternFun(command) {
      this.setMapPattern = command;
    },
    // 污染类型点击
    pollutionTypeFun(val) {
      this.panelName = "污染类型";
      this.panelList.map(el => {
        if (el.name == this.panelName) {
          el.isCheck = true;
        } else {
          el.isCheck = false;
        }
      });
      this.getPollutionTypeData(val);
      this.$refs.cmap.getPollutionTypeData(val);
    },
    // 获取污染类型面板数据
    getPollutionTypeData(val) {
      this.siteLoading = true;
      if (val.length == 0) {
        val = ["boat"];
        this.pollutionTypeList = ["boat"];
      }
      this.$http
        .get("/waterEnvXA/event/pollutionType", {
          params: {
            boat: val.indexOf("boat") > -1 ? "boat" : "",
            enterprise: val.indexOf("enterprise") > -1 ? "enterprise" : "",
            farm: val.indexOf("farm") > -1 ? "farm" : "",
            governProject:
              val.indexOf("governProject") > -1 ? "governProject" : "",
            qianRenWd: val.indexOf("qianRenWd") > -1 ? "qianRenWd" : "",
            waterPool: val.indexOf("waterPool") > -1 ? "waterPool" : "",
            keyword: this.keyWords
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.siteLoading = false;
            let arr = [];
            this.wrPanelList = res.data.content;
            if (res.data.content.length == 0) {
              this.noDataState = true;
            }
            this.wrPanelList.map((el, index) => {
              el.dataList.map(ell => {
                arr.push(ell);
              });
              if (arr.length > 0) {
                this.noDataState = false;
              } else {
                this.noDataState = true;
              }
            });
          }
        });
    },
    // 获取污染物数量
    getPollutionTypeCount() {
      this.$http.get("/waterEnvXA/event/pollutionTypeCount").then(res => {
        if (res.data.code == 0) {
          // this.pollutionTypeCount = res.data.content
          res.data.content.map(el => {
            if (el.type == "船舶码头") {
              this.pollutionTypeCount.cbNum = el.number;
            }
            if (el.type == "企业") {
              this.pollutionTypeCount.qyNum = el.number;
            }
            if (el.type == "养殖场") {
              this.pollutionTypeCount.yzcNum = el.number;
            }
            if (el.type == "千吨万人") {
              this.pollutionTypeCount.qdwrNum = el.number;
            }
            if (el.type == "纳污坑塘") {
              this.pollutionTypeCount.nwktNum = el.number;
            }
            if (el.type == "工程地") {
              this.pollutionTypeCount.gcNum = el.number;
            }
          });
        }
      });
    },
    openFunctionDialog(index) {
      // this.$store.commit('setWarningOpen', false);

      switch (index) {
        // case 0:
        //   this.showDialog = true;
        //   this.$nextTick(() => {
        //     this.realTimeAnnularChart();
        //   });
        //   break;

        case 0:
          this.realTimeDia = true;
          this.$nextTick(() => {
            this.$refs.realTimewindow.getTabelHeadData();
          });
          break;
        case 1:
          this.waterQualityRanking = true;
          this.$nextTick(() => {
            this.$refs.crank.seachData();
          });
          break;
        case 2:
          this.waterTrendAnalysis = true;
          this.$nextTick(() => {
            // this.$refs.cwaterTrendAnalysis.createTrendAnalysis();
          });
          break;
        case 3:
          this.assessment = true;
          this.$nextTick(() => {
            this.targetAssessmentChart();
          });
          break;
          // case 5:
          //   this.$router.push({
          //     path: "/colligateApplication/datatable/waterQualityBulletin",
          //     query: {
          //       code: 1
          //     }
          //   });
          // this.qualityBulletin = true;
          // this.$nextTick(()=> {
          //   this.$refs.qualityBulletinwindow.searchcolumn();
          // });
          break;
      }
    },
    toggleLegendHeight() {
      let mapLegend = document.getElementById("map-legend");
      if (this.legendToggle) {
        this.legendToggle = false;
        this.toggleVal = "展开";
        mapLegend.style.height = "105px";
      } else {
        this.legendToggle = true;
        this.toggleVal = "收起";
        mapLegend.style.height = "226px";
      }
    },
    //图例最小化
    minimizeToggle() {
      this.mapLegendMin = true;
    },
    //图例最大化
    maximizationToggle() {
      this.mapLegendMin = false;
    },
    openSearchBox() {
      let search = document.getElementById("search-site-wrap");
      search.style.width = "415px";
    },
    closeSearchBox() {
      let search = document.getElementById("search-site-wrap");
      let input = search.getElementsByTagName("input")[0];
      input.value = "";
      search.style.width = "34px";
    },
    screenSiteType(item, index) {
      //站点类型全部、正常、数据异常、联网异常站点类型选择
      this.siteTypeIndex = index;
      this.siteTypeValue = item.type;
      this.changeSiteType();
    },
    selectSiteType(item, index) {
      //河流、区域按钮选中函数
      this.siteTypeGroupIndex = index;
      this.siteTypeGroupValue = item.type;
    },
    loadSiteHeight(item) {
      //首次加载高度
      let number = item.multiStatisVOs.length;
      if (item.toggle) {
        return "height:" + number * 93 + "px";
      }
    },
    siteToggle(item, event) {
      //子站点列表展示与收起
      let number = item.multiStatisVOs.length;
      let $btn = event.currentTarget;
      let $li = $btn.parentNode.parentNode;
      let $list = $li.getElementsByClassName("site-secondary-list")[0];
      if (item.toggle) {
        item.toggle = false;
        $list.style.height = "0px";
      } else {
        item.toggle = true;
        $list.style.height = number * 93 + "px";
      }
    },
    pagerefresh() {
      var count = 300;
      var _this = this;
      setInterval(function() {
        count--;
        _this.leaveTime = count;
        if (count == 0) {
          count = 300;
          // _this.waterQualityChart();
          // _this.changeSiteType();
          // _this.loadStationPoint();
          // _this.areaEvaluation();
          //_this.allAreaStatus();
        }
      }, 1000);
    },
    secondaryClass(item) {
      //站点类型className判断
      if (item.siteType === "auto") {
        switch (item.state) {
          case "onLine":
            return "auto-site-on-line";
          // break;
          case "offLine":
            return "auto-site-off-line";
          // break;
          case "overproof":
            return "auto-site-overproof";
          // break;
        }
      } else {
        return "manual-site";
      }
    },
    // waterQualityChart(id){//数据面板头部饼图实列化
    //   let qualityChart = this.$echarts.init(document.getElementById('water-quality-chart'));
    //   let qualityChart2= this.$echarts.init(document.getElementById('regional-water-chart'));
    //   this.$http.get('/waterenvapi/station/realStatisPieChart',{
    //     params:{
    //       queryType:'station',
    //       // startTime:formatDate(new Date(),'yyyy-MM-dd 00:00:00'),
    //       // endTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),
    //       startTime:new Date().format('yyyy-MM-dd 00:00:00'),
    //       endTime:new Date().format('yyyy-MM-dd hh:mm:ss'),
    //       statisType:'minute',
    //       areaIds:'7E15A844CCB34CCEB42AEE5ED38F5DFC'
    //     }
    //   }).then((response)=>{
    //     let dataJson = response.data;
    //     if(dataJson.code === 200) {
    //       var list = dataJson.content.dataList;
    //       var sdata=[
    //         {value:0, name:'优',selected:true},
    //         {value:0, name:'良好'},
    //         {value:0, name:'轻度污染'},
    //         {value:0, name:'中度污染'},
    //         {value:0, name:'重度污染'}
    //       ]
    //       var total=0;
    //       for(var i=0;i<list.length;i++){
    //         var idata=list[i];
    //         if(idata.name=='Ⅰ~Ⅱ类'){
    //           sdata[0]={value:idata.value, name:'优'}
    //         }else if(idata.name=='Ⅲ类'){
    //           sdata[1]={value:idata.value, name:'良好'}
    //         }else if(idata.name=='Ⅳ类'){
    //           sdata[2]={value:idata.value, name:'轻度污染'}
    //         }else if(idata.name=='Ⅴ类'){
    //           sdata[3]={value:idata.value, name:'中度污染'}
    //         }else if(idata.name=='劣Ⅴ类'){
    //           sdata[4]={value:idata.value, name:'重度污染'}
    //         }
    //         total=total+parseInt(idata.value);
    //       }
    //
    //       for(var i=0;i<list.length;i++){
    //         var idata=list[i];
    //         if(idata.name=='Ⅰ~Ⅱ类'){
    //           this.yierlei=((parseFloat(idata.value)/total)*100).toFixed(2);
    //         }else if(idata.name=='Ⅲ类'){
    //           this.sanlei=((parseFloat(idata.value)/total)*100).toFixed(2);
    //         }else if(idata.name=='Ⅳ类'){
    //           this.silei=((parseFloat(idata.value)/total)*100).toFixed(2);
    //         }else if(idata.name=='Ⅴ类'){
    //           this.wulei=((parseFloat(idata.value)/total)*100).toFixed(2);
    //         }else if(idata.name=='劣Ⅴ类'){
    //           this.liewulei=((parseFloat(idata.value)/total)*100).toFixed(2);
    //         }
    //       }
    //
    //
    //       let option = {
    //         color:['#00a1e4','#24c768','#e5ce10','#ff7e00','#ff0000'],
    //         tooltip : {
    //           show:false
    //         },
    //         series : [
    //           {
    //             name: '访问来源',
    //             type: 'pie',
    //             radius : '70%',
    //             center: ['50%', '50%'],
    //             data:sdata,
    //             selectedMode: 'single',
    //             labelLine:{
    //               show:false
    //             },
    //             label:{
    //               show: false
    //             },
    //             hoverOffset: 6,
    //             selectedOffset:6
    //           }
    //         ]
    //       };
    //       qualityChart.setOption(option);
    //       qualityChart2.setOption(option);
    //     }
    //   }).catch((error)=>{
    //
    //   });
    // },
    createAnnularChart(chartData) {
      let realTime = this.$echarts.init(document.getElementById(chartData.id));
      let option = {
        color: chartData.color,
        title: {
          text: chartData.total,
          textStyle: {
            fontSize: 24
          },
          subtext: chartData.name,
          subtextStyle: {
            fontSize: 15,
            color: "#1a1a1a"
          },
          itemGap: 2,
          x: "center",
          y: "36%"
        },
        tooltip: {
          show: false
        },
        series: [
          {
            name: chartData.name,
            type: "pie",
            center: ["50%", "50%"],
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: chartData.data
          }
        ]
      };
      realTime.setOption(option);
      realTime.on("mouseover", function(params) {
        let title = params.value;
        let subtitle = params.name;
        let index = params.dataIndex;
        realTime.setOption({
          title: {
            text: title,
            subtext: subtitle
          }
        });
        realTime.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: index
        });
      });
    },
    realTimeAnnularChart: function() {
      this.realTimeLoading = true;
      this.realTimeNoDataState = false;
      this.$http
        .get("/Statistics-Service/GISMap/realTimeMonitoring", {
          params: {
            // mn: this.equipIds.join(",")
            types: "WQ08"
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            let list = dataJson.content.dataList;
            let total = 0;
            for (let i = 0; i < list.length; i++) {
              total = total + parseInt(list[i].value);
            }
            let realTimeData = {
              id: "real-time-monitoring-chart",
              color: ["#24c768", "#ff0000", "#9000ff", "#bdc7d3"],
              data: list,
              total: total,
              name: "断面数"
            };
            if (list.length === 0) {
              this.realTimeNoDataState = true;
            }
            this.createAnnularChart(realTimeData);
            var realarr = [
              {
                name: "正常",
                value: list[0].value,
                percent:
                  ((parseInt(list[0].value) / total) * 100).toFixed(1) + "%",
                icon: "normal"
              },
              {
                name: "超标",
                value: list[1].value,
                percent:
                  ((parseInt(list[1].value) / total) * 100).toFixed(1) + "%",
                icon: "overproof"
              },
              {
                name: "异常",
                value: list[2].value,
                percent:
                  ((parseInt(list[2].value) / total) * 100).toFixed(1) + "%",
                icon: "abnormal"
              },
              {
                name: "断线",
                value: list[3].value,
                percent:
                  ((parseInt(list[3].value) / total) * 100).toFixed(1) + "%",
                icon: "disconnection"
              }
            ];
            this.realTimeLegend = realarr;
          }
          this.realTimeLoading = false;
        })
        .catch(error => {
          this.realTimeLoading = false;
          this.realTimeNoDataState = true;
        });
    },
    targetAssessmentChart() {
      this.assessmentLoading = true;
      this.assessmentNoDataState = false;
      this.$http
        .get("/waterenvapi/realdatas/stationDetail", {
          params: {
            queryType: "station",
            // startTime:formatDate(new Date(),'yyyy-01-01 00:00:00'),
            // endTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),
            startTime: new Date().format("yyyy-MM-dd 00:00:00"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            statisType: "minute"
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 200) {
            var stations = dataJson.content.dataList;
            if (stations.length === 0) {
              this.assessmentNoDataState = true;
            } else {
              this.assessmentNoDataState = false;
            }
            var up = 0;
            var down = 0;
            var balance = 0;
            //this.equipIds=[];
            for (var i = 0; i < stations.length; i++) {
              var station = stations[i];
              var level = parseInt(station.waterQualityLevel);
              var target = parseInt(station.targetQualityLevel);
              if (level > target) {
                down++;
              } else if (level < target) {
                up++;
              } else {
                balance++;
              }
            }
            var arr = [];
            arr.push({ value: up, name: "提升" });
            arr.push({ value: down, name: "下降" });
            arr.push({ value: balance, name: "持平" });
            var tarr = [
              {
                name: "提升",
                value: up,
                percent: (up / stations.length) * 100,
                icon: "normal"
              },
              {
                name: "持平",
                value: balance,
                percent: (balance / stations.length) * 100,
                icon: "disconnection"
              },
              {
                name: "下降",
                value: down,
                percent: (down / stations.length) * 100,
                icon: "overproof"
              }
            ];
            this.targetAssessment = tarr;
            let realTimeData = {
              id: "target-assessment",
              color: ["#24c768", "#ff0000", "#bdc7d3"],
              data: arr,
              total: stations.length,
              name: "断面数"
            };
            this.createAnnularChart(realTimeData);
          }
          this.assessmentLoading = false;
        })
        .catch(error => {
          this.assessmentLoading = false;
          this.assessmentNoDataState = true;
        });
    },
    setTogglePanel() {
      if (this.togglePanel) {
        this.togglePanel = false;
      } else {
        this.togglePanel = true;
      }
    },
    changeSiteType() {
      this.siteLoading = true;
      let stationTypes = this.stationTypes;
      //切换站点类型（river/area）
      this.$http
        .get("/SiteManagement/station/holeStatis", {
          params: {
            queryType: this.siteTypeGroupValue,
            type: stationTypes,
            userId: this.toolObj.getCookie("userId"),
            // startTime:formatDate(new Date(),'yyyy-MM-dd 00:00:00'),
            // endTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),
            startTime: new Date().format("yyyy-MM-dd 00:00:00"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            statisType: "minute",
            statusType: this.siteTypeValue
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            this.siteList = dataJson.content.dataList;
          }
          this.siteLoading = false;
        })
        .catch(error => {
          this.siteLoading = false;
          this.noDataState = true;
        });
    },
    //加载点位
    loadStationPoint() {
      this.siteLoading = true;
      let stationTypes = this.stationTypes;
      if (!stationTypes) {
        this.$message("必须选中一个站点类型!");
        return;
      }
      this.$http
        .get("/dataHandle/yunliBase/getXhWaterData", {
          params: {
            types: stationTypes,
            key: this.keyWords
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0) {
            var stations = dataJson.content.dataList;
            this.siteList = stations;
            this.mapInfo = stations;
            this.siteLoading = false;
          }
        })
        .catch(error => {});
    },
    //统计站点状态查询 面板状态统计
    packStatonTypeListVP() {
      let stationTypes = this.stationTypes;
      this.$http
        .get("/SiteManagement/station//packStatonTypeListVP", {
          params: {
            userId: this.toolObj.getCookie("userId"),
            type: stationTypes
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 200) {
            //var stations = dataJson.content.dataList;
            this.siteTypeList = dataJson.content.dataList;
          }
        })
        .catch(error => {});
    },
    areaEvaluation() {
      //区域整体评价
      this.$http
        .get("/waterenvapi/station/realStatisInfo", {
          params: {
            queryType: "area",
            // startTime:formatDate(new Date(),'yyyy-MM-dd 00:00:00'),
            // endTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),
            startTime: new Date().format("yyyy-MM-dd 00:00:00"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            statisType: "minute",
            areaIds: "7E15A844CCB34CCEB42AEE5ED38F5DFC"
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 200) {
            var station = dataJson.content.dataList[0];
            this.classPollution = station.evaluation; //优、良、轻度、中度、重度
            this.classPollutionIcon = this.getClassPollution(
              station.evaluation
            ); //excellent、good、milder、moderate、severe
            this.majorPollutants = station.primaryPollutant; //主要污染指标
            this.updateTime = station.time;
          }
        })
        .catch(error => {});
    },
    getRgb16(waterQualityLevel) {
      var level = parseInt(waterQualityLevel);
      if (level == 1) {
        return "#00A1E4";
      } else if (level == 2) {
        return "#00A1E4";
      } else if (level == 3) {
        return "#24C768";
      } else if (level == 4) {
        return "#E5CE10";
      } else if (level == 5) {
        return "#FF7E00";
      } else if (level == 6) {
        return "#FF0000";
      } else {
        return "";
      }
    },
    allAreaStatus() {
      //各区域状态
      this.$http
        .get("/waterenvapi/realdatas/allAreaStatus", {
          params: {
            queryType: "area",
            statisType: "minute",
            pareaIds: "7E15A844CCB34CCEB42AEE5ED38F5DFC"
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 200) {
            var list = dataJson.content.dataList;
            var str = "";
            for (var i = 0; i < list.length; i++) {
              var info = list[i];
              str =
                str +
                '"' +
                info.area +
                '":"' +
                this.getRgb16(info.waterQualityLevel) +
                '",';
            }
            str = "{" + str.substring(0, str.length - 1) + "}";
            this.$refs.cmap.quZColorObj = JSON.parse(str);
          }
        })
        .catch(error => {});
    },
    controlLevel(level) {
      var levelName = "非控";
      if (level == 0) {
        levelName = "国控";
      } else if (level == 1) {
        levelName = "省控";
      } else if (level == 2) {
        levelName = "市控";
      } else if (level == 3) {
        levelName = "区控";
      } else if (level == 4) {
        levelName = "非控";
      }
      return levelName;
    },
    convertDateFromString(dateString) {
      if (dateString) {
        var date = new Date(dateString.replace(/-/, "/"));
        return date;
      }
    },
    getClassPollution(eva, state) {
      //excellent、good、milder、moderate、severe

      if (state == undefined || state == "0") {
        return "";
        // return "lixian";
      }
      var pollution = "good";
      if (eva == "优") {
        pollution = "excellent";
      } else if (eva == "良好") {
        pollution = "good";
      } else if (eva == "轻度污染") {
        pollution = "milder";
      } else if (eva == "中度污染") {
        pollution = "moderate";
      } else if (eva == "重度污染") {
        pollution = "severe";
      } else {
        pollution = "";
      }
      return pollution;
    },
    getEvaluateText(eva) {
      var rtn = "优";
      if (eva == "Ⅰ~Ⅱ类") {
        rtn = "优";
      } else if (eva == "Ⅲ类") {
        rtn = "良好";
      } else if (eva == "Ⅳ类") {
        rtn = "轻度污染";
      } else if (eva == "Ⅴ类") {
        rtn = "中度污染";
      } else if (eva == "劣Ⅴ类") {
        rtn = "重度污染";
      }
      return rtn;
    },
    waterQualityLevel(eve, time, level) {
      var cls = this.getClassPollution(eve, time);
      if (cls == "lixian") {
        return "-";
      }
      if (level <= 1) {
        return "Ⅰ类";
      } else if (level <= 2) {
        return "Ⅱ类";
      } else if (level <= 3) {
        return "Ⅲ类";
      } else if (level <= 4) {
        return "Ⅳ类";
      } else if (level <= 5) {
        return "Ⅴ类";
      } else if (level <= 6) {
        return "劣Ⅴ类";
      } else {
        return "-";
      }
    },
    setWaterQualityLevel(eve, time, type) {
      var cls = this.getClassPollution(eve, time);
      if (cls == "lixian") {
        return "";
      }
      let level = parseFloat(type);
      if (level === 1) {
        return "typeA";
      } else if (level === 2) {
        return "typeA";
      } else if (level === 3) {
        return "typeB";
      } else if (level === 4) {
        return "typeC";
      } else if (level === 5) {
        return "typeD";
      } else if (level === 6) {
        return "typeE";
      } else {
        return "";
      }
    },
    siteType(type) {
      return "auto";
    },
    siteStatus(status) {
      //onLine在线，offLine离线，overproof超标
      if (status == 1) {
        return "onLine";
      } else {
        return "offLine";
      }
    },
    getrealtime() {
      // return '数据更新时间：'+formatDate(new Date(),'yyyy-MM-dd hh:00');
      return "数据更新时间：" + new Date().format("yyyy-MM-dd hh:00");
    }
  },
  mounted() {
    // this.waterQualityChart();
    //this.realTimeAnnularChart();
    // this.changeSiteType();
    this.stationCotolLevel();
    // this.packStatonTypeListVP();
    //  this.areaEvaluation();
    //this.targetAssessmentChart();
    //this.allAreaStatus();
    this.pagerefresh();
    document.addEventListener("click", () => {
      this.menuListToggle = false;
      this.menuPanelToggle = false;
    });
  },
  watch: {
    siteTypeGroupValue: function() {
      //this.changeSiteType();
    },
    siteList: function(val) {
      if (val && val.length === 0) {
        this.noDataState = true;
      } else {
        this.noDataState = false;
        // 动态取当前面板列表数据的站点  20-08-07 by wangch
        this.equipIds = val.map(e => e.stationCode) || []
      }
    },
    realTimeLegend: function(val) {
      if (val.length === 0) {
        this.realTimeNoDataState = true;
      } else {
        this.realTimeNoDataState = false;
      }
    }
  },
  components: {
    // slDialog,
    waterRanking,
    trendAnalysis,
    siteDetails,
    mapComp,
    realTime,
    waterQualityBulletin
  }
};
</script>

<style scoped lang="less">
.detailStyle {
  padding: 12px;
  .packageDiv {
    border: 1px solid #e7ecf2;
  }
  .bigTitle {
    padding: 10px 0 10px 10px;
    border-bottom: 1px solid #e7ecf2;
    > span {
      color: #333333;
      font-size: 13px;
      border-left: 3px solid #166bce;
      padding-left: 10px;
    }
  }
  .bigCont {
    padding: 15px 0 10px 20px;
    color: #333;
    position: relative;
    > img {
      position: absolute;
      right: 10px;
      top: 15px;
    }
    .name {
      font-size: 14px;
      img {
        margin-right: 8px;
      }
    }
    ul {
      overflow: hidden;
      margin-top: 15px;
      li {
        float: left;
        width: 30%;
        margin-bottom: 10px;
      }
    }
    .oneForTwo {
      li {
        width: 40%;
      }
    }
  }
}
.detailTitle {
  color: #333;
}
.scrollSpecial {
  width: 395px !important;
}
.gailan {
  color: #166bce;
  cursor: pointer;
}
.monitoring {
  height: 100%;
  .monitoring-map-toolbar {
    height: 31px;
    border-top: 1px solid #e2e6e8;
    background: #fff;
    position: relative;
    z-index: 999;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
    .toolbar-list {
      float: left;
      line-height: 28px;
      li {
        float: left;
        padding: 0 30px;
        position: relative;
        cursor: pointer;
        .water-quality-btn {
          border: none;
          background: none;
          cursor: pointer;
          outline: none;
          color: #555;
          i {
            color: #707b86;
            font-size: 14px;
          }
        }
        .water-quality-btn:hover {
          color: #3283e1;
          i {
            color: #3283e1;
          }
        }
        .water-quality-btn.active {
          color: #166bce;
          i {
            color: #166bce;
          }
        }
      }
      li:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        width: 1px;
        height: 10px;
        background: #abb5c3;
        position: absolute;
        right: 0;
        top: 10px;
      }
    }
    .auto-refresh-box {
      float: right;
      line-height: 30px;
      margin-right: 6px;
      span {
        color: #999999;
      }
      .auto-refresh-time {
        display: inline-block;
        vertical-align: top;
        width: 44px;
        height: 22px;
        color: #fff;
        text-align: center;
        background: #24c768;
        line-height: 22px;
        margin-top: 4px;
      }
    }
  }
  .monitoring-map-box {
    height: calc(100% - 31px);
    background: #eee;
    position: relative;
    overflow: hidden;
    width: 100%;
    .monitoring-map-content {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transition: right 0.2s;
    }
    .monitoring-map-content.toggle-panel {
      right: 0;
    }
    #monitoring-map {
      height: 100%;
      width: 100%;
      //  background: url("../../assets/images/index/map-bg.png") no-repeat;
      //   background-size:  100% 100%;
    }
    #monitoring-info-panel {
      width: 478px;
      height: 100%;
      top: 0;
      right: 0;
      border-left: 2px solid #166bce;
      background: #e7f0f9;
      position: absolute;
      transition: right 0.2s;
      z-index: 999;
      .panel-toggle-btn {
        border: none;
        outline: none;
        width: 11px;
        height: 68px;
        background: url("../../assets/images/index/but_Fold.png") no-repeat;
        opacity: 0.8;
        position: absolute;
        top: 50%;
        margin-top: -34px;
        left: -12px;
        cursor: pointer;
      }
      .panel-toggle-btn:hover {
        opacity: 1;
      }
      .regional-water-quality {
        position: absolute;
        width: 304px;
        height: 154px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        top: 6px;
        left: -312px;
        #regional-water-chart {
          width: 152px;
          height: 154px;
          float: left;
        }
        .regional-water-legend {
          width: 50%;
          height: 100%;
          float: left;
          padding-top: 14px;
          li {
            font-size: 12px;
            line-height: 24px;
            .legend-name {
              display: inline-block;
              vertical-align: middle;
              width: 68px;
            }
            i {
              display: inline-block;
              vertical-align: middle;
              width: 7px;
              height: 7px;
              background: #ccc;
              margin-right: 7px;
              margin-bottom: 3px;
            }
            .legend-icon-A {
              background: #00a1e4;
            }
            .legend-icon-B {
              background: #24c768;
            }
            .legend-icon-C {
              background: #e5ce10;
            }
            .legend-icon-D {
              background: #ff7e00;
            }
            .legend-icon-E {
              background: #ff0000;
            }
          }
        }
      }

      /* 天气面板详情 */
      .weather-details-panel {
        width: 238px;
        height: 248px;
        background: #ccc;
        position: absolute;
        top: 6px;
        left: -246px;
        border-radius: 3px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        .weather-info-wrap {
          height: 144px;
          padding-top: 16px;
          padding-left: 20px;
          border-bottom: 1px solid #295477;
          color: #fff;

          .temperature {
            font-size: 24px;
          }
          .company {
            font-size: 14px;
          }
          p {
            line-height: 24px;
            font-size: 14px;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
          }
        }
        .weather-info-list {
          border-top: 1px solid #5e97ba;
          text-align: center;
          li {
            padding-top: 4px;
            width: 32%;
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
            color: #fff;
            cursor: pointer;
            p:first-child {
              line-height: 22px;
            }
            .weather-icon {
              height: 44px;
              line-height: 44px;
              text-align: center;
              i {
                display: inline-block;
                vertical-align: middle;
                margin-bottom: 3px;
                width: 34px;
                height: 34px;
              }
            }
          }
          li:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }
      .weather-details-panel.qingtian {
        background: url("../../assets/images/weather/tiqing-bg.png") no-repeat;
        background-size: 100% 100%;
      }
      .monitoring-header-wrap {
        height: 128px;
        background: url("../../assets/images/index/cebianlan_bg.png") no-repeat;
        background-size: 100% 100%;
        .water-quality-survey {
          padding: 16px 8px 0;
          #water-quality-chart {
            width: 84px;
            height: 84px;
            float: left;
          }
          .quality-survey-info {
            float: left;
            color: #fff;
            width: 240px;
            line-height: 26px;
            padding-left: 6px;
            .quality-text {
              font-size: 16px;
              font-weight: 600;
            }
            .quality-color {
              display: inline-block;
              vertical-align: middle;
              margin-bottom: 3px;
              width: 10px;
              height: 10px;
              border: 1px solid #fff;
              border-radius: 50%;
              background: darkcyan;
            }
            .quality-color.excellent {
              background: #00a1e4;
            }
            .quality-color.good {
              background: #24c768;
            }
            .quality-color.milder {
              background: #e5ce10;
            }
            .quality-color.moderate {
              background: #ff7e00;
            }
            .quality-color.severe {
              background: #ff0000;
            }
          }
          .weather-wrap {
            float: right;
            width: 74px;
            height: 74px;
            i {
              display: inline-block;
              vertical-align: top;
              width: 100%;
              height: 100%;
            }
          }
        }
        .header-function-list {
          display: flex;
          li {
            height: 125px;
            flex: 1;
            text-align: center;
            background-repeat: no-repeat;
            background-position: 40px center;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            > span {
              position: absolute;
              bottom: 25px;
              font-size: 13px;
              color: #ffffff;
              display: inline-block;
              width: 100%;
              font-weight: bold;
              left: 0;
            }
          }
          li:hover {
            background-position: -52px center;
          }
          li.active {
            background-position: -52px center;
          }
          .real-time-monitoring {
            background-image: url("../../assets/images/index/fun-list-icon1.png");
          }
          .assessment-status {
            background-image: url("../../assets/images/index/fun-list-icon2.png");
          }
          .water-quality-ranking {
            background-image: url("../../assets/images/index/fun-list-icon3.png");
          }
          .trend-analysis {
            background-image: url("../../assets/images/index/fun-list-icon4.png");
          }
          .real-time-data {
            background-image: url("../../assets/images/index/fun-list-icon5.png");
          }
          .water-quality-bulletin {
            background-image: url("../../assets/images/index/fun-list-icon6.png");
          }
        }
      }
      .site-type-select {
        height: 34px;
        border-bottom: 1px solid #c7d8ee;
        position: relative;
        .site-type-list {
          height: 34px;
          padding-top: 3px;
          li {
            float: left;
            padding: 0 9px;
            height: 31px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #c7d8ee;
            border-bottom: none;
            margin-left: 4px;
            cursor: pointer;
            font-size: 12px;
            i {
              font-size: 14px;
              color: #7b8fa4;
            }
          }
          li:last-child {
            float: right;
          }
          li:hover {
            color: #166bce;
            i {
              color: #166bce;
            }
          }
          li.active {
            color: #166bce;
            background: #fff;
          }
        }
        .search-site-wrap {
          position: absolute;
          height: 31px;
          background: #e7f0f9;
          border: 1px solid #c7d8ee;
          top: 3px;
          right: 5px;
          overflow: hidden;
          width: 34px;
          transition: all 0.2s;
          div {
            width: 415px;
            height: 30px;
            float: right;
            input {
              width: calc(100% - 36px);
              height: 30px;
              line-height: 28px;
              border: none;
              outline: none;
              padding: 0 5px;
            }
            button {
              width: 32px;
              height: 30px;
              cursor: pointer;
              vertical-align: top;
              border: none;
              outline: none;
              opacity: 0.8;
              background: url("../../assets/images/index/search-icon.png")
                no-repeat center center;
            }
            button:hover {
              opacity: 1;
            }
            .close-btn {
              position: absolute;
              top: 8px;
              right: 44px;
              cursor: pointer;
              border-radius: 50%;
              width: 14px;
              height: 14px;
              line-height: 14px;
              font-size: 13px;
              text-align: center;
            }
            .close-btn:hover {
              background: #eee;
              color: #166bce;
            }
          }
        }
      }
      .site-list-wrap {
        height: calc(100% - 68px);
        position: relative;
        .panelUl {
          display: flex;
          li {
            flex: 1;
            text-align: center;
            font-size: 14px;
            color: #333;
            padding: 8px 0;
            background-color: #fff;
            cursor: pointer;
            &:first-child,
            &:nth-of-type(2) {
              border-right: 1px solid #e4e7ed;
            }
            .activePanel {
              color: #2d87d8;
              padding: 6px 15px;
              border-bottom: 2px solid #2d87d8;
            }
          }
        }
        .siteSearchName {
          /deep/ .el-input__inner {
            border: 1px solid #c7d1df;
            height: 35px;
            line-height: 35px;
          }
          /deep/ .el-input-group__append {
            background: #2e86ef;
          }
        }
        .site-type-group {
          height: 30px;
          line-height: 30px;
          border: 1px solid #c7d8ee;
          margin: 8px;
          button {
            width: 50%;
            height: 100%;
            border: none;
            background: none;
            outline: none;
            float: left;
            cursor: pointer;
          }
          button:hover {
            color: #166bce;
          }
          button.active {
            background: #166bce;
            color: #fff;
            position: relative;
            outline: none;
          }
          button.active::after {
            content: "";
            position: absolute;
            width: 10px;
            height: 10px;
            background: #166bce;
            transform: rotate(45deg);
            left: 50%;
            margin-left: -5px;
            bottom: -5px;
            /*z-index: -1;*/
          }
        }
        .site-list-box {
          height: 100%;
          background: #fff;
          .site-list-content {
            padding: 10px 15px 120px 20px;
            .site-first-list {
              .site-details {
                height: 66px;
                box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
                position: relative;
                padding: 8px;
                background: #fff;
                z-index: 3;
                .toggle-btn {
                  position: absolute;
                  width: 18px;
                  height: 18px;
                  border: 1px solid #c7d8ee;
                  top: 12px;
                  right: 12px;
                  background: #e7f0f9;
                  outline: none;
                  cursor: pointer;
                  overflow: hidden;
                  i {
                    display: inline-block;
                    vertical-align: top;
                    font-size: 12px;
                    line-height: 16px;
                    transform: rotate(-90deg);
                    color: #89a1c1;
                    transition: all 0.2s;
                  }
                }
                .toggle-btn:hover {
                  background: #d8e5f2;
                }
                .site-info-wrap {
                  display: inline-block;
                  vertical-align: top;
                  .site-name-text {
                    font-size: 16px;
                    font-weight: 600;
                  }
                  .site-info-section {
                    color: #666;
                    p {
                      line-height: 28px;
                    }
                  }
                }
              }
              .site-details:hover {
                background: #e7eff5;
              }
              i.iconfont {
                color: #166bce;
                font-size: 22px;
              }
              .site-secondary-list {
                height: 0;
                overflow: hidden;
                transition: all 0.2s;
                li {
                  padding: 8px;
                  border-bottom: 1px solid #c7d8ee;
                  position: relative;
                  cursor: pointer;
                  overflow: hidden;
                  /*background: #f5f9fc;*/
                  .secondary-info-wrap {
                    display: inline-block;
                    vertical-align: top;
                    padding-left: 4px;
                    width: calc(100% - 22px);
                    font-size: 0;
                    position: relative;
                    p {
                      font-size: 13px;
                      color: #666;
                      line-height: 24px;
                    }
                    .secondary-col,
                    .secondary-col-c {
                      width: 50%;
                      display: inline-block;
                      vertical-align: top;
                    }
                    .secondary-col-c {
                      padding-left: 10px;
                      .water-quality-level {
                        font-size: 14px;
                        color: #1a1a1a;
                      }
                    }
                    .site-name-text {
                      font-size: 14px;
                      font-weight: 600;
                      color: #1a1a1a;
                    }
                  }
                  .map-location-btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: none;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    opacity: 0.8;
                  }
                  .map-location-btn:hover {
                    opacity: 1;
                  }
                }
                li:before,
                li:after {
                  content: "";
                  position: absolute;
                  height: 100%;
                  width: 100%;
                  z-index: -1;
                  left: 0;
                  transition: all 0.2s;
                }
                li:before {
                  top: 0;
                  background: #f5f9fc;
                }
                li:after {
                  top: 100%;
                  background: #e7eff5;
                }
                li:hover:before {
                  top: -100%;
                }
                li:hover:after {
                  top: 0;
                }
                li:last-child {
                  border-bottom: none;
                }
              }
            }
            .site-first-list > li {
              border: 1px solid #becee3;
              margin-bottom: 8px;
              cursor: pointer;
            }
            .site-first-list > li:last-child {
              margin-bottom: 0;
            }
            .site-first-list > li.active {
              .site-details {
                .toggle-btn {
                  i.icon-cebianlanshouqi {
                    transform: rotate(90deg);
                  }
                }
              }
            }
            .dataDisplay {
              cursor: pointer;
              border-bottom: 1px solid #dee6f2;
              margin-bottom: 10px;
              .details {
                .headUl {
                  display: flex;
                  justify-content: space-between;
                  > li:first-child {
                    display: flex;
                    align-items: center;
                    img {
                      vertical-align: baseline;
                    }
                    span {
                      cursor: pointer;
                      max-width: 120px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      padding: 0 5px;
                      font-size: 16px;
                      display: inline-block;
                      font-weight: bold;
                      font-family: Source Han Sans SC;
                    }
                    i {
                      padding: 0 7px;
                      font-size: 12px;
                      font-style: normal;
                      background: rgba(233, 245, 229, 1);
                      border: 1px solid rgba(34, 186, 27, 1);
                      border-radius: 3px;
                      color: #22ba1b;
                    }
                  }
                  > li:last-child {
                    color: #999999;
                    width: 160px;
                  }
                  .wrmodel {
                    span {
                      max-width: max-content !important;
                    }
                  }
                }
                .footUl {
                  padding-left: 20px;
                  overflow: hidden;
                  li {
                    float: left;
                    font-size: 14px;
                    color: #434343;
                  }
                  li:nth-of-type(1),
                  li:nth-of-type(3) {
                    width: 60%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  li:first-child,
                  li:nth-of-type(2) {
                    padding: 10px 0;
                  }
                  li:nth-of-type(2),
                  li:nth-of-type(4) {
                    width: 40%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  li:last-child {
                    padding-bottom: 10px;
                  }
                }
              }
            }
          }
          .no-data-wrap {
            top: 70px;
          }
        }
      }
    }

    #monitoring-info-panel.toggle-panel {
      right: -395px;
      .panel-toggle-btn {
        background: url("../../assets/images/index/but_Fold_1.png") no-repeat;
      }
    }
    .map-legend {
      position: absolute;
      width: 360px;
      height: 105px;
      border: 1px solid #8b9bac;
      bottom: 8px;
      left: 8px;
      background: rgba(255, 255, 255, 0.86);
      transition: all 0.2s;
      z-index: 999;
      .legend-wrap {
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .legend-list {
        position: absolute;
        bottom: 103px;
        left: 0;
        border-bottom: 1px solid #cad4de;
        height: 126px;
        padding: 16px 8px 10px 8px;
        & > li {
          width: 50%;
          float: left;
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 4px;
          & > i {
            height: 20px;
            vertical-align: top;
            width: 20px;
          }
          .legend-icon1 {
            background: url("../../assets/images/index/legend-icon1.png")
              no-repeat center center;
          }
          .legend-icon2 {
            background: url("../../assets/images/index/legend-icon2.png")
              no-repeat center center;
          }
          .legend-icon3 {
            background: url("../../assets/images/index/legend-icon3.png")
              no-repeat center center;
          }
          .legend-icon4 {
            background: url("../../assets/images/index/legend-icon4.png")
              no-repeat center center;
          }
          .legend-icon5 {
            background: url("../../assets/images/index/legend-icon5.png")
              no-repeat center center;
          }
          .legend-icon6 {
            background: url("../../assets/images/index/legend-icon6.png")
              no-repeat center center;
          }
          .legend-icon7 {
            background: url("../../assets/images/index/legend-icon7.png")
              no-repeat center center;
          }
        }
        & > li:last-child {
          width: 100%;
        }
      }
      .legend-site-state {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 105px;
        width: 100%;
        background: url("../../assets/images/index/Legend_map.png") no-repeat
          center center;
      }
      .legend-toggle-btn {
        position: absolute;
        width: 62px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #166bce;
        left: 50%;
        margin-left: -31px;
        border: none;
        background: none;
        top: -10px;
        cursor: pointer;
        outline: none;
        i {
          font-size: 13px;
          transform: rotate(180deg);
          display: inline-block;
          transition: all 0.2s;
        }
      }
      .legend-toggle-btn:hover {
        color: #065dc2;
      }
      .legend-toggle-btn.active {
        i {
          transform: rotate(0deg);
        }
      }
      .legend-close-btn {
        position: absolute;
        top: 0;
        right: 0;
        line-height: 12px;
        padding: 0 2px;
        cursor: pointer;
        border-left: 1px solid #8b9bac;
        border-bottom: 1px solid #8b9bac;
      }
      .legend-close-btn:hover {
        i {
          color: #166bce;
        }
      }
    }
    // .map-legend:before {
      // content: "";
      // position: absolute;
      // width: 67px;
      // height: 11px;
      // background: url("../../assets/images/index/Legend-togger.png") no-repeat;
      // left: 50%;
      // margin-left: -33px;
      // top: -11px;
    // }
    .min-map-legend.map-legend {
      width: 0 !important;
      height: 0 !important;
    }
    .min-map-legend.map-legend:before {
      display: none;
    }
    .map-legend-min {
      position: absolute;
      left: 8px;
      bottom: 8px;
      width: 24px;
      height: 62px;
      cursor: pointer;
      background: url("../../assets/images/index/min_legend.png") no-repeat;
      z-index: 999;
    }
    .map-toolbar-box {
      position: absolute;
      bottom: 16px;
      right: 442px;
      transition: right 0.2s;
      z-index: 999;
      display: none;
      & > li {
        position: relative;
        .toolbar-btn-list {
          position: absolute;
          top: 0;
          right: 0;
          white-space: nowrap;
          height: 36px;
          line-height: 38px;
          border-radius: 4px;
          background: rgba(8, 35, 66, 0.42);
          font-size: 0;
          width: 0;
          transition: width 0.3s;
          overflow: hidden;
          .toolbar-btn {
            cursor: pointer;
            color: #f1f1f1;
            display: inline-block;
            vertical-align: top;
            padding: 0 11px 0 10px;
            position: relative;
            font-size: 12px;

            &:hover {
              color: #fff;
            }
            &:first-child {
              margin-left: 10px;
            }
            &:last-child {
              margin-right: 10px;
            }
          }
          .toolbar-btn:last-child:before {
            display: none;
          }
          .toolbar-btn:before {
            content: "";
            width: 1px;
            height: 18px;
            background: #fff;
            position: absolute;
            top: 9px;
            right: 0;
          }
        }
      }
      & > li > .toolbar-btn {
        width: 36px;
        height: 36px;
        line-height: 38px;
        text-align: center;
        display: block;
        background: rgba(8, 35, 66, 0.42);
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.14);
        border-radius: 4px;
        margin-top: 10px;
        color: #fff;
        border: none;
        .iconfont {
          font-size: 20px;
        }
      }
      & > li:hover > .toolbar-btn {
        background: rgba(8, 35, 66, 0.52);
      }
      & > li:hover > .toolbar-btn-list {
        background: rgba(8, 35, 66, 0.52);
        width: 191px;
      }
      & > li:hover > .toolbar-toggle {
        opacity: 0;
      }
      .toolbar-toggle {
        transition: all 0.3s;
      }
      /*&>li:active>.toolbar-btn{*/
      /*background: rgba(8, 35, 66, 0.62);*/
      /*}*/
    }
    .toggle-toolbar-box {
      right: 16px;
    }
  }
  /* 水质预测时间栏 */
  .water-quality-prediction-time {
    position: absolute;
    width: 100%;
    height: 52px;
    bottom: 0;
    left: 0;
    .prediction-play-fun {
      width: 52px;
      height: 100%;
      background: rgba(0, 0, 0, 0.52);
      float: left;
      .play-prediction {
        width: 100%;
        height: 48px;
        i {
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 20px;
          background: url("../../assets/images/index/icon_play.png") no-repeat;
        }
      }
      .play-prediction.active {
        i {
          background: url("../../assets/images/index/icon_suspend.png")
            no-repeat;
        }
      }
    }
    .prediction-time-wrap {
      float: left;
      width: calc(100% - 298px);
      height: 100%;
      background: rgba(0, 0, 0, 0.52);
      position: relative;
      .prediction-time-list {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        li {
          width: 20%;
          height: 100%;
          float: left;
          border-left: 1px solid #d1d1d0;
          .time-item {
            display: block;
            float: left;
            padding-top: 6px;
            position: relative;
            color: #cccccc;
            width: calc(100% / 6);
            text-align: right;
            font-size: 12px;
            span {
              margin-right: -6px;
            }
          }
          .time-item:after {
            content: "";
            position: absolute;
            width: 1px;
            height: 6px;
            background: #ccc;
            top: 0;
            right: 0;
          }
          .date-text {
            text-align: center;
            color: #fff;
            padding-top: 26px;
          }
        }
      }
    }
    .prediction-ater-quality {
      width: 246px;
      height: 100%;
      float: left;
      background: rgba(0, 0, 0, 0.42);
      li {
        width: 20%;
        float: left;
        height: 52px;
        color: #fff;
        text-align: center;
        font-size: 12px;
        .quality-grade-line {
          display: block;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
        }
        .quality-grade-line.gradeA {
          background: #00a1e4;
        }
        .quality-grade-line.gradeB {
          background: #24c768;
        }
        .quality-grade-line.gradeC {
          background: #e5ce10;
        }
        .quality-grade-line.gradeD {
          background: #ff7e00;
        }
        .quality-grade-line.gradeE {
          background: #ff0000;
        }
        .quality-grade-name {
          padding-top: 16px;
        }
      }
    }
    .prediction-play-fun > .time-line,
    .prediction-time-wrap > .time-line {
      display: block;
      height: 6px;
      background: rgba(255, 255, 255, 0.4);
    }

    .prediction-play-fun > .time-line {
      background: #3ace7e;
    }
    .prediction-time-wrap .prediction-time-line {
      display: block;
      height: 6px;
      background: url("../../assets/images/index/prediction-time-line.png")
        repeat-y;
      background-size: 100% 1px;
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      transition: all 0.3s;
    }
  }
}
/* 污染等级标签样式 excellent、good、milder、moderate、severe*/
.pollution-icon {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 3px;
}
.pollution-icon.excellent {
  width: 34px;
  height: 24px;
  background: url("../../assets/images/index/Grade_01.png") no-repeat;
}
.pollution-icon.good {
  width: 34px;
  height: 24px;
  background: url("../../assets/images/index/Grade_02.png") no-repeat;
}
.pollution-icon.lixian {
  width: 34px;
  height: 24px;
  background: url("../../assets/images/index/Grade_08.png") no-repeat;
}
.pollution-icon.milder {
  width: 56px;
  height: 24px;
  background: url("../../assets/images/index/Grade_03.png") no-repeat;
}
.pollution-icon.moderate {
  width: 56px;
  height: 24px;
  background: url("../../assets/images/index/Grade_04.png") no-repeat;
}
.pollution-icon.severe {
  width: 56px;
  height: 24px;
  background: url("../../assets/images/index/Grade_05.png") no-repeat;
}
/* 站点类型图标 */
.secondary-icon {
  display: inline-block;
  vertical-align: middle;
  margin-top: 2px;
  width: 18px;
  height: 17px;
}
.secondary-icon.auto-site-on-line {
  background: url("../../assets/images/index/Automatic_station_01.png")
    no-repeat;
}
.secondary-icon.auto-site-off-line {
  background: url("../../assets/images/index/Automatic_station_03.png")
    no-repeat;
}
.secondary-icon.auto-site-overproof {
  background: url("../../assets/images/index/Automatic_station_02.png")
    no-repeat;
}
.secondary-icon.manual-site {
  background: url("../../assets/images/index/Manual_station.png") no-repeat;
}
/* 水质等级图标 */
.water-quality-icon {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.water-quality-icon.excellent {
  background: url("../../assets/images/index/Water_quality_category_01.png")
    no-repeat;
}
.water-quality-icon.good {
  background: url("../../assets/images/index/Water_quality_category_02.png")
    no-repeat;
}
.water-quality-icon.milder {
  background: url("../../assets/images/index/Water_quality_category_03.png")
    no-repeat;
}
.water-quality-icon.moderate {
  background: url("../../assets/images/index/Water_quality_category_04.png")
    no-repeat;
}
.water-quality-icon.severe {
  background: url("../../assets/images/index/Water_quality_category_05.png")
    no-repeat;
}

/*实时监控样式*/
.real-time-monitoring {
  height: 190px;
  position: relative;
}
#real-time-monitoring-chart,
#target-assessment {
  float: left;
  width: 188px;
  height: 190px;
}

.monitoring-chart-legend {
  width: 235px;
  float: left;
  padding-top: 26px;
  li {
    border: 1px solid #d6e3f2;
    height: 30px;
    line-height: 28px;
    border-radius: 15px;
    background: #e3edf8;
    padding: 0 12px;
    margin-bottom: 6px;
    .legend-icon {
      display: inline-block;
      vertical-align: middle;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid blue;
      background: #fff;
      margin-bottom: 3px;
      margin-right: 10px;
    }
    .legend-icon.normal {
      border-color: #24c768;
    }
    .legend-icon.overproof {
      border-color: #ff0000;
    }
    .legend-icon.abnormal {
      border-color: #9207ff;
    }
    .legend-icon.disconnection {
      border-color: #bec8d4;
    }
    .legend-name {
      display: inline-block;
      vertical-align: top;
      width: 62px;
    }
    .legend-number {
      display: inline-block;
      vertical-align: top;
      width: 44px;
    }
  }
}
.monitoring-chart-legend.target-assessment-legend {
  padding-top: 32px;
  li {
    margin-bottom: 16px;
  }
}
/* 站点详情头部样式 */
.site-data-header {
  line-height: 32px;
  position: relative;
  display: inline-block;
  padding-left: 30px;
  i.icon-baojing {
    font-size: 16px;
    color: #ff0f0f;
    animation: fabell 1.2s infinite;
    position: absolute;
    left: 10px;
  }
  .site-title-name {
    font-size: 16px;
    font-weight: 700;
    color: #505e66;
  }
  .give-alarm-text {
    color: #999;
  }
  .site-extra-function {
    display: inline-block;
    vertical-align: top;
    margin-left: 16px;
    button {
      height: 32px;
      border: 1px solid #fff;
      padding: 0 10px;
      color: #166bce;
      cursor: pointer;
      i {
        font-size: 13px;
      }
    }
    button:hover {
      border: 1px solid #b7d7f7;
      background: #e6f1fc;
    }
  }
}
@keyframes fabell {
  0% {
    margin-left: 0;
  }
  5% {
    margin-left: 1px;
  }
  8% {
    margin-left: -1px;
  }
  10% {
    margin-left: 1px;
  }
  13% {
    margin-left: -1px;
  }
  15% {
    margin-left: 1px;
  }
  18% {
    margin-left: -1px;
  }
  20% {
    margin-left: 1px;
  }
  23% {
    margin-left: -1px;
  }
  25% {
    margin-left: 1px;
  }
  28% {
    margin-left: -1px;
  }
  30% {
    margin-left: 1px;
  }
  33% {
    margin-left: -1px;
  }
  35% {
    margin-left: 1px;
  }
  40% {
    margin-left: 0;
  }
  45% {
    margin-left: 0;
  }
  50% {
    margin-left: 0;
  }
  60% {
    margin-left: 0;
  }
  70% {
    margin-left: 0;
  }
  80% {
    margin-left: 0;
  }
  90% {
    margin-left: 0;
  }
  100% {
    margin-left: 0;
  }
}
/* 弹窗显示与隐藏动画 */
.regional-enter,
.regional-leave-to,
.weather-enter,
.weather-leave-to {
  opacity: 0;
  transform: translate(0, 20px);
}
.regional-enter-active,
.regional-leave-active,
.weather-enter-active,
.weather-leave-active {
  transition: all 0.3s;
}
.regional-enter-to,
.regional-leave,
.weather-enter-to,
.weather-leave {
  opacity: 1;
  transform: translate(0, 0);
}
.el-dialog-title {
  line-height: 24px;
  font-size: 16px;
  color: #505e66;
  padding-top: 10px;
}
.el-dialog-subtitle {
  color: #505e66;
  font-size: 13px;
  line-height: 24px;
  padding-bottom: 10px;
  font-weight: 100;
}
.search-data-btn {
  display: inline-block;
  margin-left: 14px;
  text-decoration: underline;
  color: #1875d0;
  cursor: pointer;
}
.search-data-btn:hover {
  color: #1061b1;
}

/* 地图工具栏 */
.map-comp-toolbar {
  position: absolute;
  z-index: 999;
  top: 16px;
  right: 410px;
  transition: all 0.3s;
  .normal-toolbar {
    background: #ffffff;
    border-radius: 3px;
    padding: 0;
    box-shadow: 0 2px 7px #cdcdc9;
    float: left;
    margin-right: 10px;
    & > li {
      float: left;
      padding: 10px 16px;
      cursor: pointer;
      position: relative;
      & > i {
        margin-right: 4px;
        color: #849c9f;
      }
      &:after {
        content: "";
        width: 1px;
        height: 14px;
        background: #cacaca;
        position: absolute;
        top: 13px;
        right: 0;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
      &:hover {
        color: #166bce;
        i {
          color: #166bce;
        }
      }
    }
  }
  .map-type-toolbar {
    float: left;
    position: relative;
    .type-label {
      background: #fff;
      box-shadow: 0 2px 7px #cdcdc9;
      border-radius: 3px;
      height: 39px;
      line-height: 39px;
      padding: 0 13px;
      cursor: pointer;
    }
    .map-type-panel {
      position: absolute;
      right: 0;
      top: calc(100% + 2px);
    }
    .el-radio-group {
      background: #fff;
      box-shadow: 0 2px 7px #cdcdc9;
      border-radius: 3px;
      padding: 10px 14px;
      .group-item {
        padding: 6px 0;
      }
    }
    .type-icon {
      display: inline-block;
      vertical-align: middle;
      width: 22px;
      height: 22px;
    }
    .vectorgraph-icon {
      background: url("../../assets/images/index/shiliangtu_icon.png") no-repeat;
    }
    .topographic-icon {
      background: url("../../assets/images/index/dixingtu_icon.png") no-repeat;
    }
    .image-map-icon {
      background: url("../../assets/images/index/yingxiangtu_icon.png")
        no-repeat;
    }
  }
  .zoom-in-toolbar {
    position: absolute;
    right: 0;
    top: 52px;
  }
  .zoom-box {
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 7px #cdcdc9;
    padding: 0 5px;
    margin-bottom: 12px;
    cursor: pointer;
    .zoom-item {
      font-size: 20px;
      color: #646464;
      border-bottom: 1px solid #dfdfdf;
      line-height: 36px;
      padding: 0 2px;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        color: #0091ff;
        .location-icon {
          opacity: 1;
        }
      }
    }
    .location-icon {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 2px;
      width: 20px;
      height: 21px;
      background: url("../../assets/images/index/pointPosition.png") no-repeat
        center center;
      opacity: 0.7;
    }
  }
}
.toggle-panel.map-comp-toolbar {
  right: 16px;
}

/* 本月运行情况统计 */
.situation-statistics {
  position: absolute;
  bottom: 16px;
  right: 410px;
  z-index: 999;
  transition: all 0.3s;
  .statistics-panel {
    position: absolute;
    right: 0;
    bottom: 0;
    background: #fff;
    width: 560px;
    height: 160px;
    border: 1px solid #8b9bac;
    transition: 0.3s;
    overflow: hidden;
    .minimize-btn {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      &:hover {
        background: #eee;
      }
      &:active {
        background: #ccc;
      }
    }
    .panel-header {
      height: 30px;
      line-height: 30px;
      padding-left: 16px;
      border-bottom: 1px solid #dce9fa;
      .title-icon {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 18px;
        font-size: 12px;
        background: url("../../assets/images/index/benyue_icon.png") no-repeat;
      }
    }
    .panel-body {
      height: calc(100% - 30px);
      padding-left: 30px;
      .situation-list {
        & > li {
          float: left;
          width: 33.3%;
          padding: 12px 0 0 16px;
          .name {
            color: #999999;
          }
          .number {
            padding: 10px 0;
            & > i {
              display: inline-block;
              vertical-align: middle;
              margin-bottom: 3px;
              width: 23px;
              height: 23px;
              margin-right: 4px;
            }
            & > span {
              font-size: 16px;
              font-weight: 700;
            }
            .fault-icon {
              background: url("../../assets/images/index/fashengguzhang_icon.png")
                no-repeat;
            }
            .consumable-parts-icon {
              background: url("../../assets/images/index/xiaohaopeijian_icon.png")
                no-repeat;
            }
            .inspection-icon {
              background: url("../../assets/images/index/xunjian_icon.png")
                no-repeat;
            }
          }
          .situation-text {
            color: #666666;
            font-size: 12px;
            line-height: 28px;
            &:before {
              content: "";
              display: inline-block;
              vertical-align: middle;
              margin-bottom: 3px;
              width: 6px;
              height: 6px;
              background: #c7d8ee;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
  .levelBody {
    height: 105px;
    width: 500px;
    bottom: -8px;
    // /deep/ .el-checkbox-group {
    //   margin-top: 15px;
    //   .el-checkbox__inner {
    //     display: none;
    //   }
    // }
  }
  .statistics-panel.hide {
    width: 0;
    height: 0;
  }
  .statistics-icon {
    position: absolute;
    cursor: pointer;
    right: -4px;
    bottom: -6px;
    width: 47px;
    height: 49px;
    background: url("../../assets/images/index/tongji_nor_btn.png") no-repeat;
    &:hover {
      background: url("../../assets/images/index/tongji_hover_btn.png")
        no-repeat;
    }
    &:active {
      background: url("../../assets/images/index/tongji_link_btn.png") no-repeat;
    }
  }
}
.toggle-panel.situation-statistics {
  right: 16px;
}

/* 自定义快捷菜单 */
.shortcut-menu-wrap {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 999;
  .menu-btn-wrap {
    background: #ffffff;
    border-radius: 3px;
    box-shadow: 0 2px 7px #cdcdc9;
    padding: 5px 10px;
    & > a {
      display: inline-block;
      vertical-align: top;
      color: #333333;
      height: 25px;
      line-height: 25px;
      border: 1px solid #bfc7ca;
      padding: 0 8px;
      border-radius: 3px;
      margin-right: 2px;
      /* Safari 5.1 - 6.0 */
      background: -webkit-repeating-linear-gradient(
        #fff,
        #fff 50%,
        #ededed 50%,
        #ededed 100%
      );
      /* Opera 11.1 - 12.0 */
      background: -o-repeating-linear-gradient(
        #fff,
        #fff 50%,
        #ededed 50%,
        #ededed 100%
      );
      /* Firefox 3.6 - 15 */
      background: -moz-repeating-linear-gradient(
        #fff,
        #fff 50%,
        #ededed 50%,
        #ededed 100%
      );
      /* 标准的语法 */
      background: repeating-linear-gradient(
        #fff,
        #fff 50%,
        #ededed 50%,
        #ededed 100%
      );
      i {
        transition: all 0.3s;
      }
    }
    & > a:last-child {
      margin-right: 0;
    }
    & > .toggle-btn {
      padding: 0 6px;
    }
    & > a:hover {
      color: #166bce;
      border: 1px solid #166bce;
    }
    & > a.active {
      color: #166bce;
      border: 1px solid #166bce;
      /* Safari 5.1 - 6.0 */
      background: -webkit-repeating-linear-gradient(
        #fff,
        #fff 50%,
        #dfe6ed 50%,
        #dfe6ed 100%
      );
      /* Opera 11.1 - 12.0 */
      background: -o-repeating-linear-gradient(
        #fff,
        #fff 50%,
        #dfe6ed 50%,
        #dfe6ed 100%
      );
      /* Firefox 3.6 - 15 */
      background: -moz-repeating-linear-gradient(
        #fff,
        #fff 50%,
        #dfe6ed 50%,
        #dfe6ed 100%
      );
      /* 标准的语法 */
      background: repeating-linear-gradient(
        #fff,
        #fff 50%,
        #dfe6ed 50%,
        #dfe6ed 100%
      );
    }
    & > a.active.toggle-btn {
      i {
        transform: rotate(-180deg);
      }
    }
  }

  /* 快捷菜单设置面板样式 */
  .menu-list {
    position: absolute;
    top: 42px;
    left: 0;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 7px #cdcdc9;
    /*padding: 12px 15px;*/
    height: 260px;
    .add-menu {
      padding: 12px 15px 0;
    }
    .added-menu {
      padding: 0 15px 6px;
    }
    .menu-title {
      line-height: 26px;
      width: 230px;
      .name {
        width: 206px;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 3px;
          width: 13px;
          height: 13px;
          background: url("../../assets/images/list-icon.png") no-repeat;
          margin-right: 6px;
        }
      }
      .toggle-btn {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 18px;
        height: 18px;
        border: 1px solid #e8e8e8;
        text-align: center;
        line-height: 18px;
        cursor: pointer;
        & > i {
          vertical-align: top;
          margin-top: 2px;
          transition: all 0.3s;
          transform: rotate(180deg);
        }
        &:hover {
          color: #166bce;
          background: #e0eaf5;
        }
      }
      .toggle-btn.active {
        & > i {
          transform: rotate(0deg);
        }
      }
    }
    .menu-operation {
      width: 230px;
      padding-left: 20px;
      padding-bottom: 4px;
      .list-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 174px;
      }
      .operation-btn {
        cursor: pointer;
        & > i {
          font-size: 16px;
          color: #4f93e1;
        }
        &:hover {
          i {
            color: #166bce;
          }
        }
      }
      & > li {
        line-height: 28px;
      }
      & > li:before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #b4c2d6;
        margin-right: 8px;
      }
    }
  }

  /* 快捷菜单展示面板样式 */
  .menu-panel {
    position: absolute;
    top: 42px;
    left: 0;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 7px #cdcdc9;
    z-index: 999;
    height: 200px;
    width: 300px;
    .menu-item-list {
      padding: 16px 16px 0;
      & > li {
        float: left;
        width: 33.3%;
        text-align: center;
        color: #666666;
        margin-bottom: 10px;
        cursor: pointer;
        .item-icon {
          display: block;
          margin: 0 auto;
          width: 42px;
          height: 42px;
          opacity: 0.7;
          transition: all 0.3s;
        }
        .item-name {
          line-height: 36px;
        }
      }
      & > li:hover {
        color: #166bce;
        .item-icon {
          opacity: 1;
        }
      }
    }
  }
  .smallPanel.menu-panel {
    height: 104px;
  }
}
.water-quality {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.typeA {
  background: url("../../assets/images/water_quality_01.png") no-repeat;
  background-size: 100% 100%;
}
.typeB {
  background: url("../../assets/images/water_quality_02.png") no-repeat;
  background-size: 100% 100%;
}
.typeC {
  background: url("../../assets/images/water_quality_03.png") no-repeat;
  background-size: 100% 100%;
}
.typeD {
  background: url("../../assets/images/water_quality_04.png") no-repeat;
  background-size: 100% 100%;
}
.typeE {
  background: url("../../assets/images/water_quality_05.png") no-repeat;
  background-size: 100% 100%;
}
</style>
