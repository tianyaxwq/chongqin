<template>
  <div class="homePage scrollStyle">
    <header class="rcs-content-head">
      <a href id="goNewpage" style="display:none"></a>
      <div class="page-loge-bg"></div>
      <!-- <button @click="qiehuan">切换</button> -->
      <nav class="rcs-content-nav">
        <ul class="nav-router-list clearfix">
          <li
            v-for="(v,i) in menuData"
            :key="i"
            :class="navNameOne==v.url?'active':''"
            @click="menulistClick(v,i)">
            <i class="iconfont" :class="v.img"></i>
            <span>{{v.name}}</span>
          </li>
        </ul>
      </nav>
      <div @click="getAlarmList" class="bjBox">
        <img src="../../assets/images/index/homeBj.png" alt width="15px" />
        <el-badge :value="totalAlarmNum" class="item">
          <span>报警</span>
        </el-badge>
      </div>
      <div class="page-user-info" @mouseenter="showmenuBox=true" @mouseleave="showmenuBox=false">
        <div class="user-info-wrap">
          <div class="head-portrait-wrap">
            <img src="../../assets/images/userIcon.png" />
          </div>
          <div class="user-base-info" @click="false">
            <span class="user-name">{{userName}}</span>
          </div>
          <transition name="el-zoom-in-top">
            <div class="closeBox transition-box" v-show="showmenuBox">
              <p @click="openEntrance">返回主页</p>
              <p @click="signOut">退出登录</p>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <section>
      <div class="navBox" v-if="$store.state.levMenudata.length != 0">
        <div class="oneLevnav">
          <aside class="base-nav-box" :class="{sp:!isNavOpen}">
            <el-scrollbar style="height: 100%">
              <div class="nav-head" @click="isNavOpen=!isNavOpen">
                <img
                  src="../../assets/images/index/menuShouSuo.png"
                  :class="isNavOpen ? '' : 'flip'"
                />
              </div>
              <div class="base-nav-body">
                <el-menu
                  router
                  :collapse="!isNavOpen"
                  @select="selectDefaultMenu"
                  @open="openMenu"
                  @close="closeMenu"
                  :default-openeds="defaultOpened"
                >
                  <el-submenu
                    v-for="(item,i) in $store.state.levMenudata"
                    :index="item.permissionId"
                    :key="i + 'm'"
                  >
                    <template slot="title">
                      <!-- <i :class="item.img"></i> -->
                      <img :src="'./static/images/' + item.img" alt />
                      <span slot="title">{{item.name}}</span>
                    </template>                             
                    <el-menu-item-group>
                      <span slot="title">{{item.name}}</span>
                    </el-menu-item-group>
                    <el-menu-item
                      :class="activeIndex == v.url && i == 0 && j == 0 ? 'is-active' : ''"
                      :index="v.url"
                      v-for="(v, j) in item.children"
                      :key="j+'i'"
                    >
                      <span></span>
                      &nbsp;{{v.name}}
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
              </div>
            </el-scrollbar>
          </aside>
          <div class="openTree" @click="openTree" v-show="opentreeshow">
            <i></i>
            <p>站点选择</p>
          </div>
        </div>
      </div>
      <div class="rightContent_box" :class="`${$store.state.levMenudata.length == 0?'fillFull':''} ${!isNavOpen ? 'smallWidth' : ''} `">
        <div class="curAddre" v-if="tabNavone[0].name != 'GIS一张图'">
          <i class="icon-shouye iconfont"></i> 当前位置：
          <span
            v-for="(item,key) in tabNavone"
            style="cursor: pointer;"
            :key="key"
            @click="routerLink(item, key)"
          >
            {{item.name}}
            <i v-if="key != tabNavone.length-1" class="el-icon-arrow-right"></i>
          </span>
          <div v-if="stationName != '' && showCheckbox && !this.$route.meta.noStationcode">
            【
            <span>{{stationName}}</span>】
          </div>
          <div v-if="stationName != '' && !showCheckbox && !this.$route.meta.noStationcode">
            【
            <span :title="stationNames">{{stationName}}</span>
            <span v-if="stationNum>1">...</span>】
          </div>
        </div>
        <div class="rightBody" :class="tabNavone[0].name != 'GIS一张图'?'':'fullHeight'">
          <div class="treeBox" v-show="detailTree">
            <div class="treebody">
              <div class="treeTool clearfix">
                <el-input
                  placeholder="请输入站点名称关键字"
                  suffix-icon="el-icon-search"
                  clearable
                  v-model="filter"
                ></el-input>
                <!-- <span>
                  <i class="iconfont icon-shaixuan"></i>
                </span>-->
              </div>
              <ul class="clearfix treenav">
                <li
                  v-for="(item,key) in treeNav"
                  :key="key"
                  :class="treeNavindex==key?'current':''"
                  @click="treeNavclick(item,key)"
                >{{item.name}}</li>
              </ul>
              <div
                style="width:100%;height:calc(100% - 62px)"
                class="treescroll"
                v-show="showCheckbox"
              >
                <el-scrollbar style="height:100%;">
                  <div class="tree_content singleTree" style="padding:12px;width:400px">
                    <el-tree
                      :data="treeData"
                      :indent="23"
                      node-key="nodeId"
                      ref="tree"
                      @node-click="treeNodeclick"
                      :default-expanded-keys="defaultId"
                      :filter-node-method="filterNode"
                      highlight-current
                      accordion
                      :class="treeData.length==1?'noBr':''"
                      :props="defaultProps"
                    >
                      <span class="custom-tree-node" slot-scope="{node,data}">
                        <span>
                          <!-- <i
                            class="iconCode"
                            :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'offlinestation'"
                          ></i>-->
                          <i
                            class="iconCode"
                            :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'station'"
                          ></i>
                          {{ node.label }}
                          <!-- <span v-show="data.enabled === 0">(不建)</span> -->
                          <!-- <i v-show="data.enabled == 1 && data.structureType == 3" class="exam"></i> -->
                          <i
                            v-show="data.monitorStatus == 1 && data.structureType == 3"
                            class="camera"
                          ></i>
                        </span>
                      </span>
                    </el-tree>
                  </div>
                </el-scrollbar>
              </div>
              <div
                style="width:100%;height:calc(100% - 62px)"
                class="treescroll"
                v-show="!showCheckbox"
              >
                <el-scrollbar style="height:100%">
                  <div class="tree_content" style="padding:12px;width:400px">
                    <el-tree
                      :data="treeData"
                      :indent="23"
                      node-key="nodeId"
                      ref="checkedTree"
                      @check="treeCheckchange"
                      :default-expanded-keys="defaultId"
                      default-expand-all
                      :filter-node-method="filterNode"
                      highlight-current
                      accordion
                      show-checkbox
                      :check-strictly="checkStrictly"
                      :class="treeData.length==1?'noBr':''"
                      :props="defaultProps"
                    >
                      <span class="custom-tree-node" slot-scope="{node,data}">
                        <span>
                          <!-- <i
                            class="iconCode"
                            :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'offlinestation'"
                          ></i>-->
                          <i
                            class="iconCode"
                            :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'station'"
                          ></i>
                          {{ node.label }}
                          <!-- <span v-show="data.enabled === 0">(不建)</span> -->
                          <!-- <i v-show="data.enabled == 1 && data.structureType == 3" class="exam"></i> -->
                          <i
                            v-show="data.monitorStatus == 1 && data.structureType == 3"
                            class="camera"
                          ></i>
                        </span>
                      </span>
                    </el-tree>
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <div class="closeBtn" @click="closeTree">
              <i></i>
            </div>
          </div>
          <div class="briefBox" v-show="allStatus == 'statusA'">
            <div style="height:100%">
              <el-scrollbar style="height:100%">
                <div class="inputbox" @click="openMidtree">
                  <input type="text" />
                  <i class="iconfont icon-sousuo"></i>
                </div>
                <p>当前站点</p>
                <div class="ulbox" v-show="!this.$route.meta.strictly">
                  <i class="iconfont icon-lefticon" @click="stationLeft"></i>
                  <i class="iconfont icon-righticon" @click="stationRight"></i>
                  <div class="gdbox">
                    <ul class="clearfix" v-bind:style="{left: -staionPos + 'px' }">
                      <li
                        v-for="(item,key) in this.$store.state.stationInfo"
                        :key="key"
                      >{{item.nodeName}}</li>
                    </ul>
                  </div>
                  <div>{{stationCode+1}}/{{this.$store.state.stationInfo.length}}</div>
                </div>
                <div class="ulbox" v-show="this.$route.meta.strictly">
                  <i class="iconfont icon-lefticon" @click="stationLeft"></i>
                  <i class="iconfont icon-righticon" @click="stationRight"></i>
                  <div class="gdbox">
                    <ul class="clearfix" v-bind:style="{left: -staionPos + 'px' }">
                      <li
                        v-for="(item,key) in this.$store.state.strictlyinfo"
                        :key="key"
                      >{{item.nodeName}}</li>
                    </ul>
                  </div>
                  <div>{{stationCode+1}}/{{this.$store.state.strictlyinfo.length}}</div>
                </div>
              </el-scrollbar>
            </div>
            <div class="closeBtn" @click="openMidtree">
              <i></i>
            </div>
          </div>
          <div
            class="mainbox"
            :class="{'fullFull':allStatus=='statusB','midFull':allStatus=='statusA'}"
          >
            <router-view />
          </div>
        </div>
      </div>
    </section>
    <!-- <el-dialog width="970px" :visible.sync="showBjDialog" title="报警提醒" custom-class="yjDialog">
      <div class="taskpage" style="height:500px">
        <div class="task_nav">
          <ul>
            <li v-for="(item,key) in nav_a" :key="key">
              <div class="div" :class="BjnavIndex == key?'active':''" @click="BjnavClick(key)">
                <span></span>
                <p>{{item.name}}( {{item.number}} )</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="task_body">
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="BjnavIndex == 0">
            <p class="tit_p">异常报警</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box ycbj"></div>
                  <div class="content-box">
                    <div class="tit">
                      杨窖水闸
                      <span>( 负责人 : 张三山 )</span>
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>远程维护</li>
                          <li>生成任务</li>
                          <li>故障处理</li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="8">
                        <div class="hiddenDiv">报警描述：零部件故障</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="hiddenDiv">开始时间：2019-11-07 10:10:10</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="hiddenDiv">结束时间：2019-11-07 10:10:10</div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="BjnavIndex == 1">
            <p class="tit_p">应急报警</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box yjbj"></div>
                  <div class="content-box">
                    <div class="tit">
                      【
                      <span class="code">严重</span>】突发故障事件
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>生成任务 >></li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="10">
                        <div class="hiddenDiv">事件描述：氮氧分析温度过高度过高</div>
                      </el-col>
                      <el-col :span="10">
                        <div class="hiddenDiv">上报时间：2019-11-07 10:10:10</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="hiddenDiv">上报人：张三山</div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>-->
    <!-- <el-dialog width="970px" :visible.sync="showYjDialog" title="预警提醒" custom-class="yjDialog">
      <div class="taskpage" style="height:500px">
        <div class="task_nav">
          <ul>
            <li v-for="(item,key) in nav_b" :key="key">
              <div class="div" :class="YjnavIndex == key?'active':''" @click="YjnavClick(key)">
                <span></span>
                <p>{{item.name}}( {{item.number}} )</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="task_body">
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="YjnavIndex == 0">
            <p class="tit_p">计划提醒</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box jhtx"></div>
                  <div class="content-box">
                    <div class="tit">
                      杨窖水闸
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>远程维护>></li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="10">
                        <div class="hiddenDiv">上传巡检时间：2019-11-07 10:20:00</div>
                      </el-col>
                      <el-col :span="14">
                        <div class="hiddenDiv">今天仍差巡检次数：2次</div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="YjnavIndex == 1">
            <p class="tit_p">任务提醒</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box rwtx"></div>
                  <div class="content-box">
                    <div class="tit">
                      杨窖水闸
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>审核>></li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="8">
                        <div class="hiddenDiv">到期时间：2020-6-23 10:10:10</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="hiddenDiv">任务内容：站点巡检</div>
                      </el-col>

                      <el-col :span="8">
                        <div class="hiddenDiv">当前状态 ： 待审核</div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="YjnavIndex == 2">
            <p class="tit_p">故障处理提醒</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box gzcltx"></div>
                  <div class="content-box">
                    <div class="tit">
                      杨窖水闸
                      <i>new</i>
                    </div>
                    <el-row>
                      <el-col :span="6">
                        <div class="hiddenDiv">持续时长：1小时30分钟</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="hiddenDiv">站点：杨窖水闸</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="hiddenDiv">责任人：张三水</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="hiddenDiv">当前状态 ： 待审核</div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="YjnavIndex == 3">
            <p class="tit_p">车辆保险提醒</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box clbxtx"></div>
                  <div class="content-box">
                    <div class="tit">
                      粤X478F7
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>编辑>></li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="10">
                        <div class="hiddenDiv">保险到期时间：2020-6-23</div>
                      </el-col>
                      <el-col :span="14">
                        <div class="hiddenDiv">
                          状态 ：
                          <span style="color:red">年检已过期285天</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="YjnavIndex == 4">
            <p class="tit_p">车辆年限提醒</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box clnxtx"></div>
                  <div class="content-box">
                    <div class="tit">
                      粤X478F7
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>编辑>></li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="10">
                        <div class="hiddenDiv">年检到期时间：2020-6-23</div>
                      </el-col>
                      <el-col :span="14">
                        <div class="hiddenDiv">
                          状态 ：
                          <span style="color:red">年检已过期285天</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
          <div class="currency-mode-wrap" style="margin:0px;height:100%" v-if="YjnavIndex == 5">
            <p class="tit_p">备品备件提醒</p>
            <ul class="table-content">
              <el-scrollbar style="height: 100%">
                <li class="clearfix" v-for="(v,i) in tableData" :key="i">
                  <div class="img-box bpbjtx"></div>
                  <div class="content-box">
                    <div class="tit">
                      氨氮分析仪
                      <i>new</i>
                      <div class="btnGroup">
                        <ul>
                          <li>录入更换记录>></li>
                        </ul>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="8">
                        <div class="hiddenDiv">上传更换时间：2018-6-23</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="hiddenDiv">已用时长：42天</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="hiddenDiv">建议用时：60天</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="hiddenDiv">站点：梅西湖水站</div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </el-scrollbar>
            </ul>
            <div class="table-pagination-wrap">
              <el-pagination
                @size-change="paginationSizeChange"
                @current-change="paginationChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                popper-class="select-pagination-option"
                background
                :small="true"
                :page-sizes="pageList"
                layout="total, sizes, slot,->,prev, pager, next, jumper"
                :total="total"
              >
                <template v-slot:default>
                  <span class="el-pagination__current">当前第{{ currentPage }}/{{totalPageNumber}}页</span>
                </template>
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>-->
    <el-dialog width="970px" :visible.sync="bjxiShow" title="报警信息" custom-class="yjDialog">
      <div class="table-wrap" style="height: 580px">
        <el-table
          :data="bjxiTableData"
          border
          height="100%"
          style="width: 100%"
          v-loading="bjxiloading"
          element-loading-text="拼命加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)">
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="dataEquipName" width="160" label="断面名称">
            <template slot-scope="scope">
              <span>{{scope.row.dataEquipName == "null" || !scope.row.dataEquipName ? "--" : scope.row.dataEquipName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stationTypeName" width="100" label="站点类型">
            <template slot-scope="scope">
              <span>{{scope.row.stationTypeName == "null" || !scope.row.stationTypeName ? "--" : scope.row.stationTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警时间" width="160">
            <template slot-scope="scope">
              <span>{{scope.row.eventTime == "null" || !scope.row.eventTime ? "--" : scope.row.eventTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警指标" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.projectName == "null" || !scope.row.projectName ? "--" : scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警类型" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.alarmTypeName == "null" || !scope.row.alarmTypeName ? "--" : scope.row.alarmTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmTypeName" label="当前水质" width="100">
            <template slot-scope="scope">
              <!-- 水质等级从0开始 -->
              <span v-if="scope.row.waterQualityGrade == 'null' || !scope.row.waterQualityGrade">--</span>
              <span v-else class="target-level" :class="'colorValue' + scope.row.waterQualityGrade">
                {{scope.row.waterQualityGrade == "0" ? 'Ⅰ' : scope.row.waterQualityGrade == "1" ? 'Ⅱ' : scope.row.waterQualityGrade == "2" ? 'Ⅲ' : scope.row.waterQualityGrade == "3" ? 'Ⅳ' : scope.row.waterQualityGrade == "4" ? 'Ⅴ' : scope.row.waterQualityGrade == "5" ? '劣Ⅴ' : ''}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="报警信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.eventDesc == "null" || !scope.row.eventDesc ? "--" : scope.row.eventDesc}}</span>
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
          layout="total,sizes,->,prev, pager, next, jumper"
          :total="totalRecords">
          <span class="el-pagination__current">当前第{{currentPage}}/{{totalPage}}页</span>
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import getInfo from "../../axios/main";
var treedataone = [];
var treedatatwo = [];
export default {
  name: "HelloWorld",
  data() {
    return {
      currentPage: 1, //分页组件当前页
      pageSize: 15, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [15, 25, 35], //设置每页多少条
      bjxiloading: false,
      bjxiTableData: [],
      bjxiShow: false,
      activeIndex: "",
      isNavOpen: true,
      defaultOpened: [],
      qie: false,
      navNameOne: "",
      navNameTwo: "",
      navNameThree: "",
      realNetData: {},
      nav_a: [
        {
          name: "异常报警",
          number: 4
        },
        {
          name: "应急报警",
          number: 4
        }
      ],
      nav_b: [
        {
          name: "计划提醒",
          number: 4
        },
        {
          name: "任务提醒",
          number: 4
        },
        {
          name: "故障处理提醒",
          number: 4
        },
        {
          name: "车辆保险提醒",
          number: 4
        },
        {
          name: "车辆年险提醒",
          number: 4
        },
        {
          name: "备品备件提醒",
          number: 4
        }
      ],
      tableData: [{}, {}, {}, {}],
      YjnavIndex: 0,
      BjnavIndex: 0,
      showYjDialog: false, //预警提醒弹框控制
      showBjDialog: false, //报警提醒弹框控制
      opentreeshow: false,
      filter: "",
      haveTree: true,
      detailTree: true,
      staionPos: 0,
      stationCode: 0,
      radio: 0,
      showCheckbox: false,
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      treeConfig: {
        showCheckbox: true
      },
      treeData: [],
      navTitle: "",
      userName: "",
      userZw: "系统管理员",
      showmenuBox: false,
      menushow: false,
      // menuIndex: 0, //1级菜单选中状态控制
      // levmenuIndex: 0, //2级菜单选中状态控制
      menuCode: 0,
      treeNavindex: 0,
      //childMenu: "", //子路由选中状态控制
      tabNavone: [],
      menuData: [
        {
          url: "/gismap",
          name: "GIS一张图",
          img: "icon-GISyizhangtu",
          children: []
        },
        {
          url: "/dataCollection",
          name: "监测监控",
          img: "icon-jiancejiankong",
          children: [
            {
              url: "/dataCollection/dataAggre",
              name: "实时数据",
              index: "1",
              img: "jcjk_huizong_icon.png",
              permissionId: "sssj1",
              children: [
                {
                  url: "/dataCollection/dataAggre/currentData",
                  name: "实时数据"
                },
                {
                  url: "/dataCollection/dataAggre/flowCurrent",
                  name: "流量计"
                }
              ]
            },
            {
              url: "/dataCollection/dataAggre",
              name: "历史数据",
              index: "2",
              img: "jcjk_fenxi_icon.png",
              permissionId: "lssj2",
              children: [
                {
                  url: "/dataCollection/dataAggre/historyData",
                  name: "历史数据"
                },
                 {
                  url: "/dataCollection/dataAggre/flowHisData",
                  name: "流量计"
                }
              ]
            },
            {
              url: "/dataCollection/alarm",
              name: "报警管控",
              index: "3",
              img: "f_shujubaobiao_icon.png",
              permissionId: "bjgk3",
              children: [
                {
                  url: "/dataCollection/alarm/realTimeAlarm",
                  name: "实时报警"
                },
                {
                  url: "/dataCollection/alarm/alarmAnalysis",
                  name: "报警分析"
                },
                {
                  url: "/dataCollection/alarm/historicalAlarm",
                  name: "历史报警"
                },
                // {
                //   url: "/dataCollection/alarm/alarmHandle",
                //   name: "报警处理"
                // }
              ]
            },
            {
              url: "/dataCollection/dataAggre",
              name: "数据录入",
              index: "4",
              img: "jc_shlr_icon.png",
              permissionId: "shlr4",
              children: [
                {
                  url: "/dataCollection/dataAggre/manualDataEntry",
                  name: "国控手工点数据录入"
                }
              ]
            }
          ]
        },
        {
          url: "/waterPollution",
          name: "水污染防治",
          img: "icon-shuizhiyuce",
          children: [
            {
              name: "台账管理",
              index: "1",
              url: "/waterPollution/accountManagement",
              img: "s_taizhangguanli_icon.png",
              permissionId: "swrTz1",
              children: [
                {
                  url:
                    "/waterPollution/accountManagement/keyPollutionDischarge",
                  name: "重点排污单位基本信息"
                },
                {
                  url: "/waterPollution/accountManagement/sewageTreatmentPlant",
                  name: "污水处理厂基本信息"
                },
                {
                  url:
                    "/waterPollution/accountManagement/agricultureAreaSource",
                  name: "农业面源基本信息"
                },
                {
                  url: "/waterPollution/accountManagement/shipTerminal",
                  name: "船舶码头基本信息"
                },
                {
                  url: "/waterPollution/accountManagement/pollutantPond",
                  name: "纳污塘坑基本信息"
                },
                {
                  url: "/waterPollution/accountManagement/riverLake",
                  name: "河湖长基本信息"
                },
                {
                  url: "/waterPollution/accountManagement/drinkingWaterSource",
                  name: "饮用水源地基本信息"
                },
                {
                  url: "/waterPollution/accountManagement/governProject",
                  name: "治理工程基本信息"
                }
              ]
            },
            {
              name: "重点行业整治",
              permissionId: "swrZd2",
              url: "/waterPollution/IndRegul",
              img: "s_zhongdianhangye_icon.png",
              index: "2",
              children: [
                {
                  url: "/waterPollution/IndRegul/indusManage",
                  name: "行业管理"
                },
                {
                  url: "/waterPollution/IndRegul/techManage",
                  name: "生产技术方案管理"
                },
                {
                  url: "/waterPollution/IndRegul/enterInfoManage",
                  name: "企业信息管理"
                }
              ]
            },
            {
              name: "船舶码头污染管理",
              url: "/waterPollution/shipManage",
              permissionId: "swrCb3",
              img: "s_wuranfangzhi_ico.png",
              index: "3",
              children: [
                {
                  url: "/waterPollution/shipManage/shipManage",
                  name: "船舶管理"
                },
                {
                  url: "/waterPollution/shipManage/garbageManage",
                  name: "垃圾管理"
                },
                {
                  url: "/waterPollution/shipManage/emergency",
                  name: "应急管理"
                }
              ]
            },
            {
              name: "农业农村污染管理",
              url: "/waterPollution/preventManage",
              permissionId: "swrNc4",
              img: "s_nongyenongcun_icon.png",
              index: "4",
              children: [
                {
                  url: "/waterPollution/preventManage/farmManage",
                  name: "养殖场信息"
                },
                {
                  url: "/waterPollution/preventManage/thousTon",
                  name: "千吨万人"
                }
              ]
            },
            {
              name: "纳污坑塘专项管理",
              url: "/waterPollution/pondManage",
              permissionId: "swrNw5",
              index: "5",
              img: "s_nawukangtang_icon.png",
              children: [
                {
                  url: "/waterPollution/pondManage/mesFill",
                  name: "纳污坑塘信息填报"
                },
                {
                  url: "/waterPollution/pondManage/historyMes",
                  name: "历史填报信息"
                },
                {
                  url: "/waterPollution/pondManage/mesAudit",
                  name: "信息审核"
                },
                {
                  url: "/waterPollution/pondManage/sendMes",
                  name: "发布信息"
                }
              ]
            },
            {
              name: "河湖长信息管理",
              url: "/waterPollution/riverManage",
              permissionId: "swrHh6",
              img: "s_hehuchangxin_icon.png",
              index: "6",
              children: [
                {
                  url: "/waterPollution/riverManage/gridManage",
                  name: "网格管理"
                },
                {
                  url: "/waterPollution/riverManage/eventManage",
                  name: "事件管理"
                },
                {
                  url: "/waterPollution/riverManage/rivermanageMessage",
                  name: "河湖长基本信息"
                },
                {
                  url: "/waterPollution/riverManage/lakMes",
                  name: "湖泊基本信息"
                },
                {
                  url: "/waterPollution/riverManage/riverMes",
                  name: "河流基本信息"
                }
              ]
            },
            {
              name: "工程管理",
              url: "",
              img: "syd_jibenxinx_icon.png",
              permissionId: "swrGc7",
              index: "7",
              children: [
                {
                  url: "/waterPollution/governProjectManager",
                  name: "工程管理"
                }
              ]
            }
          ]
        },
        {
          url: "/drinkingWater",
          name: "饮用水源地管理",
          img: "icon-dashuju",
          children: [
            {
              name: "基本信息管理",
              url: "",
              permissionId: "jbxx1",
              index: "1",
              img: "syd_jibenxinx_icon.png",
              children: [
                {
                  url: "/drinkingWater/baseMesManage",
                  name: "基本信息管理"
                }
              ]
            },
            {
              name: "手工监测数据填报",
              permissionId: "sgsj2",
              index: "2",
              url: "",
              img: "syd_shougongjiance_icon.png",
              children: [
                {
                  url: "/drinkingWater/monitorDataFill",
                  name: "手工监测数据填报"
                }
              ]
            },
            {
              name: "饮用水源统计报告",
              url: "",
              permissionId: "yysy3",
              index: "3",
              img: "syd_yinyongshuiyuan_icon.png",
              children: [
                {
                  url: "/drinkingWater/waterStatisReport",
                  name: "饮用水源统计报告"
                }
              ]
            },
            {
              name: "水质监测",
              url: "",
              img: "syd_shuizhijiance_icon.png",
              permissionId: "szjc4",
              index: "4",
              children: [
                {
                  url: "/drinkingWater/waterMonitor",
                  name: "水质监测"
                }
              ]
            },
            {
              name: "饮用水源地图服务",
              url: "",
              img: "syd_ditufuwu_icon.png",
              permissionId: "dtfw4",
              index: "5",
              children: [
                {
                  url: "/drinkingWater/waterMapServe",
                  name: "饮用水源地图服务"
                }
              ]
            }
          ]
        },
        {
          url: "/colligateApplication",
          name: "统计分析",
          img: "icon-zonghefenxi",
          children: [
            {
              url: "/colligateApplication/calendar",
              name: "水质日历分布",
              img: "f_shuizhifenbu_icon.png",
              permissionId: "szrlfb3",
              index: "1",
              children: [
                {
                  url: "/colligateApplication/calendar/yearCalendar",
                  name: "站点水质年历图"
                },
                {
                  url: "/colligateApplication/calendar/monthCalendar",
                  name: "站点水质月历图"
                },
                {
                  url: "/colligateApplication/calendar/dayCalendar",
                  name: "站点水质日历图"
                }
              ]
            },
            {
              url: "/colligateApplication/datacanvas",
              name: "数据图表",
              img: "f_shujutubiao_icon.png",
              permissionId: "sjtb1",
              index: "2",
              children: [
                {
                  url: "/colligateApplication/datacanvas/singletrendChange",
                  name: "断面单参数趋势变化"
                },
                {
                  url: "/colligateApplication/datacanvas/multtrendChange",
                  name: "断面多参数趋势变化"
                },
                {
                  url: "/colligateApplication/datacanvas/multiSection",
                  name: "多断面单参数趋势变化"
                }
                // {
                //   url: "/colligateApplication/datacanvas/trendAnalysis",
                //   name: "同比环比趋势分析"
                // }
              ]
            },
            {
              name: "数据报表",
              img: "f_shujubaobiao_icon.png",
              url: "/colligateApplication/datatable",
              permissionId: "sjbb2",
              index: "3",
              children: [
                {
                  url: "/colligateApplication/datatable/dataReportAnalysis",
                  name: "数据对比分析"
                },
                {
                  url: "/colligateApplication/datatable/waterqualityStatistics",
                  name: "断面时段水质统计"
                },
                {
                  url: "/colligateApplication/datatable/singleStationReport",
                  name: "自动站单站报表"
                },
                {
                  url: "/colligateApplication/datatable/multiStationReport",
                  name: "自动站多站报表"
                },
                // {
                //   url: "/dataCollection/statusAnal/waterQuality",
                //   name: "水质分析报表"
                // },
                // {
                //   url: "/dataCollection/statusAnal/stationOnline",
                //   name: "站点在线率报表"
                // },
                {
                  url: "/dataCollection/statusAnal/automaticMonitoring",
                  name: "水质自动监测报表"
                }
              ]
            },
            {
              url: "/colligateApplication/newPage",
              name: "预警分析",
              img: "f_shuizhifenbu_icon.png",
              permissionId: "xym4",
              index: "4",
              children: [
                {
                  url: "/colligateApplication/datatable/newPage",
                  name: "预警分析"
                }
              ]
            }
          ]
        },
        {
          url: "/reportManage",
          name: "报告管理",
          img: "icon-jihuaguanli",
          children: [
            {
              name: "站点监测报告",
              url: "",
              img: "b_zhandianjiance_icon.png",
              permissionId: "zdjc1",
              index: "1",
              children: [
                {
                  url: "/reportManage/siteMonitoring",
                  name: "站点监测报告"
                }
              ]
            },
            {
              name: "事件超标报告",
              url: "",
              img: "b_shijianchaobiao_icon.png",
              permissionId: "cbbg2",
              index: "2",
              children: [
                {
                  url: "/reportManage/exceedingStandard",
                  name: "事件超标报告"
                }
              ]
            },
            {
              name: "区域分析报告",
              url: "",
              img: "b_quyufenxi_icon.png",
              permissionId: "fxbg3",
              index: "3",
              children: [
                {
                  url: "/reportManage/regionalAnalysis",
                  name: "区域分析报告"
                }
              ]
            }
          ]
        },
        {
          url: "",
          name: "水环境大屏",
          img: "icon-dapingzhanshi1"
        }
      ], //所有导航数据
      // levMenudata: [], //二级导航数据
      thrMenudata: [], //三级导航数据
      treeNav: [{ name: "类型" }, { name: "级别" }, { name: "区域" }], //树结构菜单导航
      screenType: "type",
      defaultId: [3],
      clearTime: "",
      checkStrictly: false,
      allStatus: "",
      pagePath: "",
      totalAlarmNum: "" //报警数量
    };
  },
  provide() {
    return {
      globelDelet: this.globelDelet,
      home: this
    };
  },
  created() {
    // this.toolObj.setCookie("userName", "雄安管理员");
    // this.toolObj.setCookie("appCode", "xioangan_app"); //系统编号
    // this.toolObj.setCookie("roleId", "2c9212e66f69103d016fb29cefc60000");
    // this.toolObj.setCookie("platformId", "");
    //需干掉
    // if(res.data.content.info.role){
    //   this.toolObj.setCookie("roleId", res.data.content.info.role.roleId);
    // }
    // this.toolObj.setCookie("admin", 1); //是否是管理员 1是0否
    this.getRoute(this.$route);
    this.systemSet();
    this.getsessionInfo();
    this.searchTreeData();
    this.alarmsNum();
  },
  mounted() {
    // setTimeout(() => {
    //   this.realDataNetStateLv();
    // }, 2500);
  },
  methods: {
    // 报警弹窗表格数据
    getAlarmList() {
      this.alarmsNum();
      this.bjxiShow = true;
      this.bjxiloading = true;
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmEventData", {
          params: {
            startTime: new Date(
              new Date().getTime() - 3600 * 1000 * 24 * 2
            ).format("yyyy-MM-dd hh:mm:ss"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            sortBy: "eventTime",
            order: "desc",
            pageNumber: this.currentPage - 1,
            pageSize: this.pageSize,
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          this.bjxiloading = false;
          if (res.data.code == 0) {
            this.bjxiTableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
          } else {
            this.bjxiTableData = [];
          }
        });
    },
    // 获取报警数量
    alarmsNum() {
      this.$http
        .get("/Statistics-Service/alarmEvnet/alarmEventCount", {
          params: {
            startTime: new Date(
              new Date().getTime() - 3600 * 1000 * 24 * 2
            ).format("yyyy-MM-dd hh:mm:ss"),
            endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
            appId: "E9F262C16F814392AD5FDE5D217391BE"
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.totalAlarmNum = res.data.content.count;
          } else {
            this.totalAlarmNum = 0;
          }
        });
    },
    paginationChange(val) {
      //分页页码改变时执行
      this.currentPage = val;
      this.getAlarmList();
    },
    //分页pageSize改变时执行
    paginationSizeChange(val) {
      this.pageSize = val;
      this.getAlarmList();
    },
    qiehuan() {
      this.qie = !this.qie;
      this.$nextTick(() => {
        let themeLink = document.querySelector('link[name="theme"]');
        if (this.qie) {
          themeLink.setAttribute("href", "./static/css/css2.css");
        } else {
          themeLink.setAttribute("href", "./static/css/css1.css");
        }
      });
    },
    //设置用户名，获取菜单等设置信息
    systemSet() {
      this.userName = this.toolObj.getCookie("userName");
      //获取菜单 需改边 checked去嗲
      // this.$http
      //   .get("/AuthorityManagement/roles/permissions/menus", {
      //     params: {
      //       roleId: this.toolObj.getCookie("roleId")
      //     }
      //   })
      //   .then(res => {
      //     this.menuData = res.data.content.dataList;
      //     this.$store.commit("setMenudata", this.menuData);
      //   });
    },
    // 返回主页
    openEntrance() {
      let { origin, hostname } = window.location;
      let path = origin + "/Intelligent/#/home";
      if (hostname === "localhost") {
        path = "http://116.131.7.1:21300/Intelligent/#/home";
      } else {
        path = origin + "/Intelligent/#/home";
      }
      location.href = path;
    },
    //退出登录
    signOut() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.logoutClick();
        })
        .catch(() => {});
    },
    logoutClick() {
      this.$http
        .get("/IdentityManagement/auth/logout", {
          params: {
            token: this.toolObj.getCookie("token")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.toolObj.removeCookie("token");
            this.toolObj.removeCookie("userName");
            this.toolObj.removeCookie("userAccount");
            this.toolObj.removeCookie("userId");
            this.toolObj.removeCookie("roleId");
            this.toolObj.removeCookie("platform");
            this.toolObj.removeCookie("imgurl");
            // this.$router.push("/login");
            // location.href = res.data.content;
            let url = window.location.host;
            if (url.indexOf('localhost') == -1) {
              location.href = "http://" + url + "/Intelligent/#/"
            } else {
              location.href = "http://116.131.7.1:21300/Intelligent/#/"
            }
          }
        });
    },
    //预警弹框
    YjnavClick(key) {
      this.YjnavIndex = key;
    },
    //报警弹框
    BjnavClick(key) {
      this.BjnavIndex = key;
    },
    //获取实时联网统计
    realDataNetStateLv() {
      this.loading = true;
      this.$http
        .get("/Receiving/realDataNetStateLv", {
          params: {
            mn: this.toolObj.getCookie("equipIds")
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.realNetData = res.data.content.info;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    globelDelet(url, id, callback) {
      this.$confirm("是否将选中的数据删除？", "消息提示", {
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
            .delete(url, {
              params: {
                ids: id
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
                if (callback) {
                  callback();
                }
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  duration: 1500
                });
              }
            });
        })
        .catch(function() {});
    },
    //获取session数据
    getsessionInfo() {
      // if (sessionStorage.getItem("treeNavindex")) {
      //   this.treeNavindex = JSON.parse(sessionStorage.getItem("treeNavindex"));
      // }
      if (this.$route.meta.haveTree == "have") {
        if (sessionStorage.getItem("allStatus")) {
          this.allStatus = sessionStorage.getItem("allStatus");
        }
        if (sessionStorage.getItem("detailTree") == "false") {
          this.detailTree = false;
        } else if (sessionStorage.getItem("detailTree") == "true") {
          this.detailTree = true;
        }
        if (sessionStorage.getItem("opentreeshow") == "false") {
          this.opentreeshow = false;
        } else if (sessionStorage.getItem("opentreeshow") == "true") {
          this.opentreeshow = true;
        }
      } else if (this.$route.meta.haveTree == "haveHidden") {
        if (sessionStorage.getItem("allStatusA")) {
          this.allStatus = sessionStorage.getItem("allStatusA");
        }
        if (sessionStorage.getItem("detailTreeA") == "false") {
          this.detailTree = false;
        } else if (sessionStorage.getItem("detailTreeA") == "true") {
          this.detailTree = true;
        }
        if (sessionStorage.getItem("opentreeshowA") == "false") {
          this.opentreeshow = false;
        } else if (sessionStorage.getItem("opentreeshowA") == "true") {
          this.opentreeshow = true;
        }
      }
      if (sessionStorage.getItem("showCheckbox") == "false") {
        this.showCheckbox = false;
      } else if (sessionStorage.getItem("showCheckbox") == "true") {
        this.showCheckbox = true;
      }
    },
    //树节点筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    //树结构导航点击
    treeNavclick(item, key) {
      this.treeNavindex = key;
      // sessionStorage.setItem("treeNavindex", key);
      if (item.name == "区域") {
        this.filter = "";
        this.screenType = "area";
        this.searchTreeData();
      } else if (item.name == "流域") {
        this.filter = "";
        this.screenType = "basinn";
        this.searchTreeData();
      } else if (item.name == "类型") {
        this.screenType = "type";
        this.searchTreeData();
      } else if (item.name == "级别") {
        this.screenType = "control";
        this.searchTreeData();
      }
    },
    //站点左切换
    stationLeft() {
      if (this.stationCode == 0) {
        return false;
      }
      this.stationCode--;
      this.staionPos = this.stationCode * 34;
    },
    //站点右切换
    stationRight() {
      if (this.stationCode > this.$store.state.stationInfo.length - 2) {
        return false;
      }
      this.stationCode++;
      this.staionPos = this.stationCode * 34;
    },
    //关闭树
    closeTree() {
      //  this.detailTree = false;
      //  this.allStatus='statusC';
      this.detailTree = false;
      this.$store.commit("setDetailTree", "false");

      if (this.haveTree == "have") {
        this.allStatus = "statusA";
        sessionStorage.setItem("allStatus", "statusA");
        sessionStorage.setItem("detailTree", false);
      } else if (this.haveTree == "haveHidden") {
        this.allStatus = "statusB";
        sessionStorage.setItem("allStatusA", "statusB");
        this.opentreeshow = true;
        sessionStorage.setItem("opentreeshowA", true);
        sessionStorage.setItem("detailTreeA", false);
      } else {
        this.allStatus = "statusB";
        sessionStorage.setItem("allStatusA", "statusB");
        sessionStorage.setItem("detailTree", false);
      }
    },
    //开启树
    openTree() {
      this.detailTree = true;
      this.$store.commit("setDetailTree", "true");

      this.allStatus = "statusC";
      this.opentreeshow = false;
      sessionStorage.setItem("detailTreeA", true);
      sessionStorage.setItem("allStatusA", "statusC");
      sessionStorage.setItem("opentreeshowA", false);
    },
    openMidtree() {
      this.detailTree = true;
      this.$store.commit("setDetailTree", "true");
      this.allStatus = "statusC";
      sessionStorage.setItem("detailTree", true);
      sessionStorage.setItem("allStatus", "statusC");
      this.staionPos = 0;
      this.stationCode = 0;
    },
    //树单选
    treeNodeclick(data) {
      if (data.structureType == "3") {
        this.$store.commit("setStationinfo", data);
        this.$store.commit("setStrictlyinfo", data);
        this.$store.commit("setisChange", "false");
      }
    },
    //树多选
    treeCheckchange(node) {
      let temporaryArr = [];
      let treeArr = this.$refs.checkedTree.getCheckedKeys();
      treeArr.map(el => {
        if (el.indexOf("WQ") > -1) {
          temporaryArr.push(el);
        }
      });
      if (temporaryArr.length == 1 && temporaryArr.indexOf("WQ08") > -1) {
        this.$store.commit("setStationTypeName", true);
      } else {
        this.$store.commit("setStationTypeName", false);
      }
      if (this.$route.meta.strictly) {
        if (node.structureType == "3" && this.$route.meta.stationDisable) {
          this.$refs.checkedTree.setCheckedNodes([]);
          var nodes = this.$store.state.strictlyinfo;
          this.$refs.checkedTree.setCheckedNodes(nodes);
          return false;
        }
        this.$refs.checkedTree.setCheckedNodes([]);
        this.$refs.checkedTree.setCheckedNodes([node]);
        var nodes = this.$refs.checkedTree.getCheckedNodes();
        var data = [];
        for (let i in nodes) {
          data.push(nodes[i]);
        }
        this.$store.commit("setStrictlyinfo", data);
        //  this.$store.commit("setisChange", "false");
      } else {
        var nodes = this.$refs.checkedTree.getCheckedNodes();
        var data = [];
        for (let i in nodes) {
          if (nodes[i].structureType == "3") {
            data.push(nodes[i]);
          }
        }
        this.$store.commit("setisChange", "false");
        this.$store.commit("setStationinfo", data);
      }
    },
    // 侧边栏导航展开
    openMenu(index) {
      event.stopPropagation();
    },
    // 侧边栏导航关闭
    closeMenu(index) {
      event.stopPropagation();
    },
    // 导航变化
    selectDefaultMenu(index, indexPath) {
      this.activeIndex = "";
    },
    routerLink(item, index) {
      let { path, name } = item;
      let navList = this.$store.state.levMenudata;
      let newPath = this.$route.path;
      switch (index) {
        case 0:
          this.$router.push(navList[0].children[0].url);
          // this.activeIndex = this.$route.path;
          break;
        case 1:
          navList.map((el, index) => {
            if (name == navList[index].name) {
              this.$router.push(navList[index].children[0].url);
              // this.activeIndex = this.$route.path;
            }
          });
          // if (newPath !== path) {
          //   this.$router.push(path);
          // }
          break;
        case 2:
          for (let i = 0; i < navList.length; i++) {
            if (name === navList[i].name) {
              let sPath = navList[i].children[0].url;
              if (newPath !== sPath) {
                this.$router.push(sPath);
              }
              break;
            }
          }
          break;
      }
    },
    //一级导航点击
    menulistClick(item, key) {
      if (item.name == "水环境大屏") {
        var element = document.getElementById("goNewpage");
        element.href = "http://116.131.7.1:21300/waterMonitor/#/waterEnvir";
        element.target = "_blank";
        element.click();
        return false;
      }
      if (
        item.name == "GIS一张图" ||
        item.name == "知识库" ||
        item.name == "监测计划"
      ) {
        this.$store.commit("setLevMenudata", []);
        this.$router.push(item.url);
        return false;
      }
      // this.$store.commit("setLevMenudata", item.children);
      item.children.map(el => {
        this.defaultOpened.push(el.permissionId);
      });
      if (item.children[0].children && item.children[0].children.length > 0) {
        this.$router.push(item.children[0].children[0].url);
        this.activeIndex = item.children[0].children[0].url;
        // this.$store.commit("setLevMenudata", this.menuData[0].children);
      } else {
        this.$router.push(item.children[0].url);
      }
    },
    //二级导航点击
    goRouter(item, key) {
      //   this.$store.commit("setLevmenuIndex", key);
      if (item.children && item.children.length > 0) {
        this.$router.push(item.children[0].url);
        //   this.$store.commit("setChildMenu", item.children[0].url);
      } else {
        this.$router.push(item.url);
      }
      //this.$router.push(item.path);
    },
    //三级导航点击
    goChildrouter(item) {
      // this.$store.commit("setChildMenu", item.url);
      // this.$store.commit("setLevmenuIndex", this.menuCode);
      this.$router.push(item.url);
      this.menushow = false;
    },
    mouseLeave(event) {
      //谷歌浏览器下点击事件会触发鼠标移出事件bug解决
      if (event.relatedTarget != null) {
        this.menushow = false;
        clearTimeout(this.clearTime);
      }
    },
    //鼠标经过2级菜单时更换3级菜单数据
    levmenuHover(item, key) {
      this.clearTime = setTimeout(() => {
        if (item.children && item.children.length > 0) {
          this.menushow = true;
          this.menuCode = key;
          this.thrMenudata = item;
        }
      }, 200);
    },
    menuOut() {
      clearTimeout(this.clearTime);
    },
    //获取当前路由
    getRoute(params) {
      if (this.$route.meta.haveTree == "not") {
        this.haveTree = "not";
        this.allStatus = "statusB";
        this.opentreeshow = false;
        this.detailTree = false;
      } else if (this.$route.meta.haveTree == "have") {
        this.haveTree = "have";
        this.detailTree = true;
        this.$store.commit("setDetailTree", "true");
        this.allStatus = "statusC";
        sessionStorage.setItem("detailTree", true);
        sessionStorage.setItem("allStatus", "statusC");
        this.opentreeshow = false;
      } else if (this.$route.meta.haveTree == "haveHidden") {
        this.haveTree = "haveHidden";
        this.allStatus = "statusB";
        this.opentreeshow = true;
      }
      if (params.name == "企业详情") {
        var list = params.matched;
        for (let i in list) {
          if (i > 0 && list[i].name != "企业详情") {
            this.tabNavone.push({
              name: list[i].name,
              path: list[i].path
            });
          }
        }

        this.tabNavone.push({
          name: "运维单位管理",
          path: "/operaAndmaint/baseInfo/operationCompany"
        });
        this.tabNavone.push({ name: params.query.name, path: "" });
      } else if (params.name == "任务管理(副本)") {
        var list = params.matched;
        for (let i in list) {
          if (i > 0 && list[i].name != "任务管理(副本)") {
            this.tabNavone.push({
              name: list[i].name,
              path: list[i].path
            });
          }
        }
      } else if (params.meta.tapCode) {
        var list = params.matched;
        for (let i in list) {
          if (
            i > 0 &&
            list[i].name != "任务管理(副本)" &&
            i != list.length - 1
          ) {
            this.tabNavone.push({
              name: list[i].name,
              path: list[i].path
            });
          }
        }
      } else {
        var list = params.matched;
        for (let i = 0; i < list.length; i++) {
          if (i > 0) {
            this.tabNavone.push({
              name: list[i].name,
              path: list[i].path
            });
          }
        }
      }

      if (params.matched[1]) {
        this.navNameOne = params.matched[1].path;
      }
      if (params.matched[2]) {
        this.navNameTwo = params.matched[2].path;
      }
      if (params.matched[3]) {
        this.navNameThree = params.matched[3].path;
      }
    },
    //设置树的状态
    setTreestatus() {
      //判断页面树为单选还是多选
      if (this.$route.meta.singleSelect) {
        this.showCheckbox = true;
        this.filter = "";
        sessionStorage.setItem("showCheckbox", true);
        this.defaultId = [];
        this.staionPos = 0;
        this.stationCode = 0;
        this.$nextTick(() => {
          if (this.$refs.tree && this.$store.state.stationInfo.length > 0) {
            //单选树默认选择vuex存储的第一个数据
            this.$refs.tree.setCurrentKey(
              this.$store.state.stationInfo[0].nodeId
            );
            this.defaultId.push(this.$store.state.stationInfo[0].nodeId);
            this.$store.commit(
              "setStationinfo",
              this.$store.state.stationInfo[0]
            );
            this.$store.commit("setisChange", "false");
          } else {
            //根据树数据状态,默认选中第三级或者第二级数据
            if (this.treeData[0].children[0].children[0]) {
              this.$store.commit(
                "setStationinfo",
                this.treeData[0].children[0].children[0]
              );
              this.$store.commit("setisChange", "false");
            } else {
              this.$store.commit(
                "setStationinfo",
                this.treeData[0].children[0]
              );
              this.$store.commit("setisChange", "false");
            }
          }
        });
      } else {
        let temporaryArr = [];
        let treeArr = this.$refs.checkedTree.getCheckedKeys();
        treeArr.map(el => {
          if (el.indexOf("WQ") > -1) {
            temporaryArr.push(el);
          }
        });
        if (temporaryArr.length == 1 && temporaryArr.indexOf("WQ08") > -1) {
          this.$store.commit("setStationTypeName", true);
        } else {
          this.$store.commit("setStationTypeName", false);
        }
        this.showCheckbox = false;
        sessionStorage.setItem("showCheckbox", false);
        if (this.$route.meta.strictly) {
          this.checkStrictly = true;
        } else {
          this.checkStrictly = false;
        }
        this.filter = "";
        this.defaultId = [];
        this.staionPos = 0;
        this.stationCode = 0;
        this.$nextTick(() => {
          if (this.$refs.checkedTree) {
            let checkArr = [];

            if (this.$route.query.code == 1) {
              checkArr = this.$store.state.stationInfo;
            } else {
              checkArr = this.treeData;
            }
            let arr = [];
            let station = "";

            if (this.$route.meta.strictly) {
              if (
                this.$store.state.strictlyinfo.length > 0 &&
                this.$store.state.strictlyinfo[0].nodeType == "station" &&
                !this.$route.meta.stationDisable
              ) {
                arr.push(this.$store.state.strictlyinfo[0].nodeId);
                this.defaultId = arr;

                this.$refs.checkedTree.setCheckedKeys(arr);
                let checkedNode = this.$refs.checkedTree.getCheckedNodes();
                let setNode = [];
                setNode.push(checkedNode[0]);
                this.$store.commit("setStrictlyinfo", setNode);
              } else {
                arr.push(checkArr[0].nodeId);
                this.defaultId = arr;
                this.$refs.checkedTree.setCheckedKeys(arr);
                let checkedNode = this.$refs.checkedTree.getCheckedNodes();
                let setNode = [];
                setNode.push(checkedNode[0]);
                this.$store.commit("setStrictlyinfo", setNode);
              }

              this.$store.commit("setisChange", "false");
            } else {
              // for (let i in checkArr) {
              //   arr.push(checkArr[i].nodeId);
              // }
              arr.push(checkArr[0].nodeId);
              this.defaultId = arr;
              this.$refs.checkedTree.setCheckedKeys(arr);
              let checkedNode = this.$refs.checkedTree.getCheckedNodes();
              let setNode = [];
              for (let i in checkedNode) {
                if (checkedNode[i].structureType == "3") {
                  setNode.push(checkedNode[i]);
                }
              }
              this.$store.commit("setStationinfo", setNode);
              this.$store.commit("setisChange", "false");
            }
          }
        });
      }
    },
    //获取树结构
    searchTreeData() {
      /* 基本信息请求 */
      this.$http
        .get("/basicData/station/queryTree", {
          params: {
            keyName: "",
            typeCode: "WQ", //查询水质值  MM空气站点
            isUsedString: "",
            isMonitoring: "",
            basinnOrAreaOrCustom: this.screenType,
            groupName: "",
            groupStations: "",
            userId: this.toolObj.getCookie("userId")
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 0 && dataJson.content.dataList != null) {
            this.treeData = dataJson.content.dataList;
            this.setTreestatus();
          } else {
            this.treeData = [];
          }
        })
        .catch(error => {});
    }
  },
  computed: {
    totalPage() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.totalRecords / this.pageSize);
      return number === 0 ? 1 : number;
    },
    stationNames: {
      get: function() {
        let str = "";
        let arr = this.$store.state.stationInfo;
        for (let i = 0; i < arr.length; i++) {
          str += arr[i].nodeName + ",";
        }
        str = str.substring(0, str.length - 1);
        return str;
      }
    },
    stationName: {
      get: function() {
        if (this.$store.state.stationInfo.length > 0) {
          return this.$store.state.stationInfo[0].nodeName;
        } else {
          return "";
        }
      }
    },
    stationNum: {
      get: function() {
        return this.$store.state.stationInfo.length;
      }
    },
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "监测计划") {
        this.$store.commit("setshowMoniReportlist", true);
      } else {
        this.$store.commit("setshowMoniReportlist", false);
      }
      this.tabNavone = [];
      this.getRoute(to);
      for (let i = 0; i < this.menuData.length; i++) {
        // if(this.menuData[i].name == "GIS一张图" || this.menuData[i].name == "知识库"){
        //     this.$store.commit("setLevMenudata", []);
        //     break
        // };
        if (this.menuData[i].url == this.navNameOne) {
          this.$store.commit("setLevMenudata", this.menuData[i].children);
          this.$store.commit("setNavTitle", this.menuData[i].name);
        }
      }
      //路由切换时控制树结构的按钮显示隐藏
      this.detailTree = false;
      if (this.$route.meta.haveTree == "not") {
        this.haveTree = "not";
        this.allStatus = "statusB";
        this.opentreeshow = false;
      } else if (this.$route.meta.haveTree == "have") {
        this.haveTree = "have";
        this.allStatus = "statusA";
        this.opentreeshow = false;
        if (sessionStorage.getItem("allStatus")) {
          this.allStatus = sessionStorage.getItem("allStatus");
        }
        if (sessionStorage.getItem("detailTree") == "false") {
          this.detailTree = false;
        } else if (sessionStorage.getItem("detailTree") == "true") {
          this.detailTree = true;
        }
        if (sessionStorage.getItem("opentreeshow") == "false") {
          this.opentreeshow = false;
        } else if (sessionStorage.getItem("opentreeshow") == "true") {
          this.opentreeshow = true;
        }
      } else if (this.$route.meta.haveTree == "haveHidden") {
        this.haveTree = "haveHidden";
        this.allStatus = "statusB";
        this.opentreeshow = true;
        if (sessionStorage.getItem("allStatusA")) {
          this.allStatus = sessionStorage.getItem("allStatusA");
        }
        if (sessionStorage.getItem("detailTreeA") == "false") {
          this.detailTree = false;
        } else if (sessionStorage.getItem("detailTreeA") == "true") {
          this.detailTree = true;
        }
        if (sessionStorage.getItem("opentreeshowA") == "false") {
          this.opentreeshow = false;
        } else if (sessionStorage.getItem("opentreeshowA") == "true") {
          this.opentreeshow = true;
        }
      }
      this.setTreestatus();
    },
    filter(val) {
      this.$refs.tree.filter(val);
      this.$refs.checkedTree.filter(val);
    },
    stationInfo: function(newValue, oldValue) {
      if (this.$store.state.isChange == "true") {
        this.filter = newValue[0].nodeName;
      }
    }
  }
};
</script>
<style scoped lang="less">
.taskpage {
  height: 100%;
  background: #eff3f5;
  .task_nav {
    float: left;
    height: 100%;
    width: 198px;
    border: 1px solid #d9e6f7;
    background: #fff;
    .tp {
      height: 46px;
      line-height: 46px;
      padding-left: 40px;
      color: #1a1a1a;
      position: relative;
      i {
        color: #166bce;
        position: absolute;
        left: 18px;
        top: 15px;
        font-size: 16px;
        line-height: 16px;
      }
    }
    ul {
      li {
        color: #666;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        position: relative;

        .div {
          span {
            position: absolute;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            border: 1px solid #666;
            left: 40px;
            top: 13px;
            &::before {
              content: "";
              position: absolute;
              width: 3px;
              height: 3px;
              border: 1px solid #666;
              left: 1px;
              top: 1px;
              border-radius: 50%;
            }
          }
          p {
            padding-left: 55px;
          }
        }
        .active {
          color: #fff;
          line-height: 31px;
          position: absolute;
          left: -5px;
          top: 0px;
          width: 201px;
          height: 35px;
          background: url("../../assets/images/nav/y_di_link_bg.png") no-repeat
            0px center;
          background-size: 201px 35px;
          span {
            border-color: #fff;
            left: 45px;
            &::before {
              border-color: #fff;
            }
          }
          p {
            padding-left: 60px;
          }
        }
      }
    }
  }
  .task_body {
    float: right;
    width: calc(100% - 204px);
    height: 100%;
    background: #fff;
  }
}
.currency-mode-wrap {
  border: 1px solid #d9e6f7;

  .tit_p {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-bottom: 1px solid #d9e6f7;
    padding-left: 16px;
    &:before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 10px;
      background: #166bce;
      margin: 0 6px 1px 0;
    }
  }
  .table-content {
    height: calc(100% - 78px);
    padding: 0px 9px;
    li {
      border-bottom: 1px solid #d9e6f7;
      padding: 15px 0px;
      position: relative;
      cursor: pointer;
      > div {
        float: left;
      }
      .img-box {
        width: 19px;
        height: 19px;
        position: absolute;
        left: 10px;
        top: 17px;
      }
      .ycbj {
        background: url("../../assets/images/nav/yichangbaojin_icon.png")
          no-repeat;
      }
      .yjbj {
        background: url("../../assets/images/nav/yingjibaojin_icon.png")
          no-repeat;
      }
      .rwtx {
        background: url("../../assets/images/nav/renwutixing_icon.png")
          no-repeat;
      }
      .gzcltx {
        background: url("../../assets/images/nav/guzhangchuli_icon.png")
          no-repeat;
      }
      .clbxtx {
        background: url("../../assets/images/nav/chelianglianxian_icon.png")
          no-repeat;
      }
      .jhtx {
        background: url("../../assets/images/nav/jihuatixing_icon.png")
          no-repeat;
      }
      .clnxtx {
        background: url("../../assets/images/nav/celiangcexian_icon.png")
          no-repeat;
      }
      .bpbjtx {
        background: url("../../assets/images/nav/beipinbeijian_icon.png")
          no-repeat;
      }
      .content-box {
        width: 100%;
        height: 45px;
        padding-left: 37px;
        .hiddenDiv {
          height: 20px;
          padding-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tit {
          height: 30px;
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          > .code {
            color: #ff3333;
            font-size: 16px;
          }
          > span {
            font-size: 13px;
          }
          > i {
            font-size: 12px;
            background: #ff8e2f;
            color: #fff;
            padding: 0px 2px;
            display: inline-block;
            height: 14px;
            line-height: 14px;
            border-radius: 2px;
            font-style: normal;
          }
          .btnGroup {
            height: 20px;
            float: right;
            li {
              float: left;
              font-size: 12px;
              color: #166bce;
              padding: 0px;
              margin: 0px;
              padding: 0 16px;
              font-weight: 400;
              border: 0px;
              border-right: 1px solid #dce9fa;
              &:last-child {
                border: 0px;
              }
            }
          }
        }
        .control-btn {
          display: inline-block;
          padding: 0 10px;
          cursor: pointer;
          height: 15px;
          width: 80px;
          line-height: 12px;
          .iconfont {
            font-size: 16px;
          }
          .icon {
            display: inline-block;
            width: 13px;
            height: 13px;
            position: relative;
            top: 1px;
            &.bz {
              background: url("../../assets/images/checkedBtn/btn02.png");
              &.act {
                background: url("../../assets/images/checkedBtn/btn01.png");
              }
            }
            &.gz {
              background: url("../../assets/images/checkedBtn/xing02.png");
              &.act {
                background: url("../../assets/images/checkedBtn/xing01.png");
              }
            }
          }
        }

        div {
          vertical-align: top;
        }
      }
    }
    .current {
      border: 1px solid #d9e6f7;
    }
    li + li {
      margin-top: 8px;
    }
  }
  .table-pagination-wrap {
    margin-top: 5px;
    padding: 0 16px;
    border: 0px;
    > div {
      padding: 0;
    }
  }
}
.homePage {
  height: 100%;
  .rcs-content-head {
    height: 66px;
    width: 100%;
    background: url("../../assets/images/header_bg.png") no-repeat;
    background-size: 100% 100%;
    .badgeBox {
      width: 70px;
      float: left;
      height: 66px;
      line-height: 66px;
      > span {
        font-size: 16px;
        color: #fff;
        position: relative;
        margin-right: 12px;
        vertical-align: middle;
        cursor: pointer;
        &:first-child {
          vertical-align: -5px;
        }
        > i {
          position: absolute;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
          border-radius: 50%;
          background: #ff8e2f;
          color: #fff;
          font-size: 12px;
          font-style: normal;
          top: -5px;
          right: -5px;
        }
      }
    }
    .page-loge-bg {
      width: 355px;
      height: 100%;
      float: left;
      margin-left: 11px;
      background: url("../../assets/images/logo.png") center center no-repeat;
    }
    .rcs-content-nav {
      width: calc(100% - 600px);
      height: 100%;
      float: left;
      text-align: center;
      .nav-router-list {
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        li {
          width: 125px;
          height: 66px;
          display: inline-block;
          cursor: pointer;
          position: relative;
          /*&:after{*/
          /*content: '';*/
          /*display: inline-block;*/
          /*position: absolute;*/
          /*bottom: 0;*/
          /*height: 5px;*/
          /*left: 50%;*/
          /*width: 0;*/
          /*background-color: #fff;*/
          /*transition: all linear .2s;*/
          /*}*/
          i {
            display: block;
            text-align: center;
            font-size: 26px;
            color: #fff;
            margin-top: 8px;
            transition: all 0.1s;
          }
          span {
            display: block;
            height: 20px;
            line-height: 20px;
            font-size: 13px;
            color: #fff;
            margin-top: 2px;
            font-weight: bold;
            text-align: center;
            transition: all 0.1s;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &:hover {
            i {
              transform: translateY(-2px);
            }
            span {
              transform: translateY(2px);
            }
          }
          &.active {
            background: url("../../assets/images/bg_nav_Select.png") no-repeat
              center center;
            background-size: 100% 100%;
            &:hover {
              i {
                transform: translateY(0);
              }
              span {
                transform: translateY(0);
              }
            }
            /*&:after{*/
            /*width: 100%;*/
            /*left: 0;*/
            /*}*/
          }
        }
      }
    }
    .bjBox {
      float: left;
      height: 100%;
      line-height: 66px;
      cursor: pointer;
      /deep/ .el-badge {
        span {
          font-size: 12px;
          color: #fff;
        }
        .el-badge__content.is-fixed {
          top: 20px;
          height: 14px;
          padding: 0 3px;
          line-height: 14px;
          background-color: #f4274e;
        }
      }
    }
    .page-user-info {
      width: auto;
      height: 100%;
      float: right;
      .message-reminding {
        float: left;
        color: #fff;
        font-size: 12px;
        line-height: 24px;
        margin-top: 22px;
        position: relative;
        cursor: pointer;
        i {
          font-size: 20px;
          display: inline-block;
          vertical-align: top;
        }
      }
      .message-reminding:hover {
        opacity: 0.8;
      }
      .user-info-wrap {
        float: left;
        margin-left: -20px;
        margin-top: 16px;
        padding-right: 20px;
        position: relative;
        /*background: url("../assets/images/index/small-triangle-icon.png") no-repeat right center;*/
        cursor: pointer;
        .head-portrait-wrap {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #fff;
          float: left;
          margin-right: 9px;
          background: #6a7682;
          overflow: hidden;
          img {
            min-width: 100%;
            min-height: 100%;
          }
        }
        .user-base-info {
          float: left;
          line-height: 16px;
          padding-top: 2px;
          span.user-name {
            display: block;
            color: #fff;
            font-size: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          span.user-position {
            font-size: 12px;
            color: #b0daf7;
          }
        }
        .closeBox {
          position: absolute;
          width: 135px;
          top: 51px;
          z-index: 1200;
          border: 1px solid #166bce;
          box-shadow: 0px 0px 5px #166bce;
          right: 0;
          text-align: center;
          background: #fff;
          p {
            text-align: center;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            color: #166bce;
            &:hover {
              background: #dce9f8;
            }
          }
        }
      }
    }
  }
  section {
    height: calc(100% - 68px);
    position: relative;
    background: #eaeef4;
    .navBox {
      box-sizing: border-box;
      // width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      background-color: #fff;
      .oneLevnav {
        position: relative;
        box-sizing: border-box;
        height: 100%;
        .base-nav-box {
          float: left;
          display: inline-block;
          height: 100%;
          width: 198px;
          box-shadow: 1px 0px 0px rgba(220, 233, 250, 1);
          // border-right: 1px solid #c6d1de;
          transition: width 0.2s;
          background: #fff;
          &.sp {
            width: 51px;
          }
          .nav-head {
            height: 38px;
            line-height: 38px;
            text-align: center;
            cursor: pointer;
            border-bottom: 1px solid #e7ecf0;
            > img {
              margin-top: -3px;
            }
            .flip {
              transform: rotate(180deg);
            }
          }
          .base-nav-body {
            height: calc(100% - 30px);
          }
        }
        .openTree {
          width: 30px;
          height: 83px;
          color: #fff;
          background: url("../../assets/images/openTree.png") no-repeat center
            center;
          background-size: 100% 100%;
          position: absolute;
          right: 0px;
          top: 50%;
          cursor: pointer;
          transform: translateY(-41.5px);
          &:hover {
            background: url("../../assets/images/hover_openTree.png") no-repeat
              center center;
            background-size: 100% 100%;
          }
          p {
            width: 13px;
            height: 83px;
            font-size: 12px;
            position: absolute;
            right: 5px;
            top: 5px;
          }
          i {
            width: 3px;
            height: 8px;
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-4px);
            background: url("../../assets/images/righticon.png") center center
              no-repeat;
          }
        }
      }
    }
    .smallWidth {
      width: calc(100% - 53px) !important;
      left: 53px !important;
    }
    .rightContent_box {
      height: 100%;
      width: calc(100% - 200px);
      position: absolute;
      left: 200px;
      top: 0px;
      .rightBody {
        height: calc(100% - 30px);
        position: relative;
        padding: 6px;
      }
      .fullHeight {
        height: 100% !important;
      }
      .curAddre {
        height: 30px;
        line-height: 30px;
        color: #666666;
        font-size: 13px;
        padding-left: 17px;
        border-bottom: 1px solid #dfe3f2;
        border-left: 1px solid #dfe3f2;
        margin-left: 6px;
        background: #fff;
        i {
          font-size: 14px;
        }
        span:last-child {
          color: #1a1a1a;
        }
        > div {
          display: inline-block;
          color: #1a1a1a;
        }
      }
      .treeBox {
        width: 204px;
        height: calc(100% - 12px);
        border: 1px solid #dce9fa;
        position: absolute;
        left: 6px;
        top: 6px;
        background: #ebf1f7;
        .closeBtn {
          width: 11px;
          height: 68px;
          // background: url("../../assets/images/shuClose.png") center center
          //   no-repeat;
          background: url("../../assets/images/index/but_Fold.png") no-repeat;
          opacity: 0.8;
          transform: rotate(180deg);
          position: absolute;
          top: 50%;
          right: -12px;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
        .treebody {
          background: #fff;
          width: 100%;
          height: calc(100% - 3px);
          .treeTool {
            border-bottom: 1px solid #dfe3f2;
            height: 34px;
            padding: 3px;
            /deep/.el-input_suffix {
              margin-right: 200px;
            }
            > span {
              display: inline-block;
              height: 25px;
              width: 28px;
              text-align: center;
              line-height: 28px;
              color: #7b8fa4;
              cursor: pointer;
              font-weight: 700;
              vertical-align: -2px;
            }
          }
          .treenav {
            display: flex;
            li {
              flex: 1;
              // float: left;
              height: 28px;
              // width: 50%;
              line-height: 28px;
              text-align: center;
              cursor: pointer;
              color: #666;
              background: #ebf1f7;
              border-right: 1px solid #dce9fa;
              border-bottom: 1px solid #dce9fa;
              &:last-child {
                border-right: 0px;
              }
            }
            .current {
              color: #166bce;
              background: #fff;
              border-bottom: 0px;
              font-weight: 700;
            }
          }
          .tree_content {
            height: calc(100% - 52px);
          }
        }
      }
      .briefBox {
        width: 63px;
        height: calc(100% - 12px);
        border: 1px solid #dce9fa;
        position: absolute;
        left: 6px;
        top: 6px;
        background: #fff;

        padding: 4px;
        .inputbox {
          position: relative;
          margin-bottom: 15px;
          cursor: pointer;
          input {
            width: 50px;
            height: 25px;
            border-radius: 25px;
            border: 1px solid #c6d1de;
            outline: none;
          }
          i {
            font-size: 16px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-8px, -8px);
            color: #c6d1de;
          }
        }
        > p {
          height: 28px;
          font-size: 13px;
          color: #666666;
        }
        .ulbox {
          height: 248px;
          text-align: center;
          margin-bottom: 15px;
          position: relative;
          > i {
            font-size: 12px;
            color: #166bce;
            cursor: pointer;
            position: absolute;
            top: 90px;
          }
          .icon-lefticon {
            left: 0px;
          }
          .icon-righticon {
            right: 0px;
          }
          .gdbox {
            display: inline-block;
            width: 34px;
            height: 205px;
            position: relative;
            overflow: hidden;
            ul {
              height: 205px;
              position: absolute;
              left: 0px;
              top: 0px;
              width: 10000px;
              transition: all 0.5s;
              li {
                width: 34px;
                padding: 2px 10px;
                padding-top: 5px;
                height: 205px;
                font-size: 13px;
                background: url("../../assets/images/jiao_j.png") center center
                  no-repeat;
                color: #fff;
                float: left;
                text-align: center;
                writing-mode: vertical-lr;
              }
            }
          }
        }
        .stationdetail {
          font-size: 12px;
          color: #666;
          text-align: center;
          padding: 10px 0px;
          position: relative;
          > span {
            position: absolute;
            width: 6px;
            height: 6px;
            top: 0px;
          }
          &:after,
          &:before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            bottom: 0px;
          }
          &:after {
            background: url("../../assets/images/jiao_f.png") center center
              no-repeat;
            right: 0px;
          }
          &:before {
            background: url("../../assets/images/jiao_h.png") center center
              no-repeat;
            left: 0px;
          }
          .tl {
            background: url("../../assets/images/jiao_e.png") center center
              no-repeat;
            left: 0px;
          }
          .tr {
            background: url("../../assets/images/jiao_g.png") center center
              no-repeat;
            right: 0px;
          }
          li {
            margin-bottom: 10px;
            &:last-child {
              margin: 0px;
            }
            p {
              height: 20px;
            }
          }
        }
        .closeBtn {
          width: 11px;
          height: 68px;
          background: url("../../assets/images/index/but_Fold_1.png") no-repeat;
          // background: url("../../assets/images/shuClose.png") center center
          //   no-repeat;
          position: absolute;
          top: 50%;
          transform: rotate(180deg);
          right: -12px;
          opacity: 0.8;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
      }
      .mainbox {
        height: calc(100% - 12px);
        width: calc(100% - 222px);
        position: absolute;
        background: #fff;
        left: 222px;
        top: 6px;
        transition: all 0.3s;
      }
    }
    .fillFull {
      width: 100%;
      left: 0px;
    }
    .fullFull {
      width: calc(100% - 12px) !important;
      left: 6px !important;
    }
    .midFull {
      width: calc(100% - 83px) !important;
      left: 80px !important;
    }
  }
}
</style>
