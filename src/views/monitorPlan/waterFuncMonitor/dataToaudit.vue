<template>
  <div class="pageContent">
    <div class="treeBox" v-show="treeStatus">
      <div class="treebody">
        <div class="treeTool clearfix">
          <el-input placeholder="关键字" suffix-icon="el-icon-search" v-model="filter"></el-input>
        </div>
        <div
          style="width:100%;height:calc(100% - 34px)"
          class="treescroll"
          v-loading="treeLoading"
          element-loading-text="加载中"
          element-loading-spinner="loading-type-a"
          element-loading-background="rgba(255, 255, 255, 1)"
        >
          <el-scrollbar style="height:100%">
            <div class="tree_content" style="padding:12px;width:450px">
              <el-tree
                :data="treeData"
                :indent="23"
                node-key="id"
                ref="tree"
                @check="treeCheckchange"
                :default-expanded-keys="defaultId"
                default-expand-all
                :filter-node-method="filterNode"
                highlight-current
                accordion
                show-checkbox
                :class="treeData.length==1?'noBr':''"
                :props="defaultProps"
              >
                <span class="custom-tree-node" slot-scope="{node,data}">
                  <span>
                    <i
                      class="iconCode"
                      :class="data.structureType == '0'?'sf':data.structureType == '1'?'sf':data.structureType == '2'?'city':data.networking===1?'station':'offlinestation'"
                    ></i>
                    {{ node.label }}
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
    <div class="briefBox" v-show="!treeStatus">
      <div style="height:100%">
        <el-scrollbar style="height:100%">
          <div class="inputbox" @click="openMidtree">
            <input type="text" />
            <i class="iconfont icon-sousuo"></i>
          </div>
          <p>当前站点</p>
          <div class="ulbox">
            <i class="iconfont icon-lefticon" @click="stationLeft"></i>
            <i class="iconfont icon-righticon" @click="stationRight"></i>
            <div class="gdbox">
              <ul class="clearfix" v-bind:style="{left: -staionPos + 'px' }">
                <li v-for="(item,key) in brieStationList" :key="key">{{item.label}}</li>
              </ul>
            </div>
            <div>{{stationCode+1}}/{{brieStationList.length}}</div>
          </div>
          <div class="stationdetail">
            <span class="tl"></span>
            <span class="tr"></span>
            <ul>
              <li>
                <p>站点总数</p>
                <p>111</p>
              </li>
              <li>
                <p>在线数</p>
                <p style="color:#36c25e">111</p>
              </li>
              <li>
                <p>停运数</p>
                <p style="color:#ff3333">0</p>
              </li>
              <li>
                <p>离线数</p>
                <p>0</p>
              </li>
            </ul>
          </div>
        </el-scrollbar>
      </div>
      <div class="closeBtn" @click="openMidtree">
        <i></i>
      </div>
    </div>
    <div class="secondary-page-section secondary-page-mode" :class="treeStatus?'':'larScreen'">
      <div class="secondary-toolbar">
        <span>关键字 :</span>
        <div class="layoutBox">
          <el-input placeholder="请输入" v-model="searchModel" size="small" style="width:220px"></el-input>
        </div>&emsp;&emsp;
        <el-button @click="searchData">
          <i class="iconfont icon-sousuo"></i>查询
        </el-button>
        
        <el-button @click="audit" v-if="showAuditBtn">审核</el-button>
      
        <el-button type="delet" @click="allDelet">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
       
       
        <el-button type="delet" @click="exportReport">
          <i class="iconfont icon-daochu"></i>导出
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
            <el-table-column type="index" label="序号" width="50" align="center" fixed></el-table-column>
            
            <el-table-column
              label="监测单位"
              width="220"
              show-overflow-tooltip
              align="center"
              fixed
              prop="monitorUnit"
            ></el-table-column>
            
            <el-table-column
              fixed
              label="一级水功能区名称 "
              width="180"
              align="center"
              prop="primaryWaterFunctionArea"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="二级水功能区名称 "
              width="180"
              align="center"
              fixed
              prop="secondaryWaterFunctionArea"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="监测断面名称" width="180" align="center" prop="monitorStationName" fixed></el-table-column>
              <el-table-column label="水质等级" width="130" align="center" fixed>
              <template slot-scope="scope">
                <span v-if=" parseInt(scope.row.waterLevel) === 0 ">
                  <i class="category-icon categoryA"></i> Ⅰ类
                </span>
                <span v-if=" parseInt(scope.row.waterLevel) === 1 ">
                  <i class="category-icon categoryA"></i> Ⅱ类
                </span>
                <span v-if=" parseInt(scope.row.waterLevel) === 2 ">
                  <i class="category-icon categoryB"></i> Ⅲ类
                </span>
                <span v-if=" parseInt(scope.row.waterLevel) === 3 ">
                  <i class="category-icon categoryC"></i> Ⅳ类
                </span>
                <span v-if=" parseInt(scope.row.waterLevel) === 4 ">
                  <i class="category-icon categoryD"></i> Ⅴ类
                </span>
                <span v-if=" parseInt(scope.row.waterLevel) === 5 ">
                  <i class="category-icon categoryE"></i> 劣Ⅴ
                </span>
              </template>
            </el-table-column>
            <el-table-column label="文件资料" width="100" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="secondBtn">查看</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="重要水功能区索引码"
              width="180"
              align="center"
              prop="waterFunctionAreaCode"
            ></el-table-column>
             <el-table-column label="状态" width="100" align="center" prop="status" fixed>
                <template slot-scope="scope">
                  <div>
                      <span v-if="scope.row.status == 0">待提交</span>
                      <span v-if="scope.row.status == 1">已提交</span>
                      <span v-if="scope.row.status == 2">已审核</span>
                      <span v-if="scope.row.status == 3">驳回</span>
                  </div>
                </template>
             </el-table-column>
            <el-table-column label="断面编码" width="180" align="center" prop="monitorStationCode"></el-table-column>
           
            <el-table-column label="采样时间" width="180" align="center" prop="receiveTime"></el-table-column>
           
            <el-table-column
              align="center"
              :label="item.factorName"
              v-for="(item,key) in factorList"
              :key="key"
            >
              <el-table-column
                width="130"
                align="center"
                :label="item.factorUnit"
                :prop="item.code"
              ></el-table-column>
            </el-table-column>
            <el-table-column align="center" label="全因子评价">
              <el-table-column
                width="130"
                show-overflow-tooltip
                align="center"
                label="水功能区水质类别"
                prop="limitOverstandardProjectandtimes"
              ></el-table-column>
              <el-table-column
                width="120"
                show-overflow-tooltip
                align="center"
                label="达标评价结论"
                prop="allFactorWaterQualityCategory"
              ></el-table-column>
              <el-table-column
                width="200"
                show-overflow-tooltip
                align="center"
                label="主要超标项目及其超标倍数"
                prop="allFactorOverstandardProjectandtimes"
              ></el-table-column>
            </el-table-column>
            <el-table-column align="center" label="水功能区限值纳污红线主要控制项目达标评价">
              <el-table-column
                width="130"
                show-overflow-tooltip
                align="center"
                label="水功能区水质类别"
                prop="limitFactorWaterQualityCategory"
              ></el-table-column>
              <el-table-column
                width="120"
                show-overflow-tooltip
                align="center"
                label="达标评价结论"
                prop="limitEvaluation_conclusion"
              ></el-table-column>
              <el-table-column
                width="200"
                show-overflow-tooltip
                align="center"
                label="主要超标项目及其超标倍数"
                prop="limitOverstandardProjectandtimes"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <div>
                 
                  <el-button type="secondBtn" @click="revise(scope.row)" v-if="showAuditBtn || scope.row.status == 0 || scope.row.status == 3">编辑</el-button>
                  <el-button type="secondBtn" @click="delet(scope.row.id)"  v-if="showAuditBtn ||scope.row.status == 0 || scope.row.status == 3">删除</el-button>
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
    <el-dialog :visible.sync="visiDialog" width="1000px" :title="vTitle" :before-close="closess">
      <div class="dialogcontent noScrollX" style="height:550px">
        <el-scrollbar style="height:100%">
          <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="150px">
            <ul>
              <li class="liblock">
                <p class="lihead">基本信息</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="监测断面名称:" prop="monitorStationName">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.monitorStationName"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="断面编码:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.monitorStationCode"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="一级水功能区名称:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.primaryWaterFunctionArea"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="二级水功能区名称:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.secondaryWaterFunctionArea"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="监测单位:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.monitorUnit"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="重要水功能区索引码 :">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.waterFunctionAreaCode"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="采样时间:">
                        <el-date-picker
                          v-model="formData.receiveTime"
                          type="date"
                          style="width:280px"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="参考目标:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.targetLevel"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.remark"
                          type="textarea"
                          :rows="3"
                          style="width:748px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">监测因子</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="水温:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.temp"
                          style="width:100px"
                          type="number"
                        ></el-input>(℃)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="PH:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.ph"
                          style="width:100px"
                          type="number"
                        ></el-input>(无量纲)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="溶解氧:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.do_"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="氨氮:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.an"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="总磷:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tp"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="总氮:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.tn"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="高锰酸盐指数:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.permanganate"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="化学需氧量:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cod"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="5日生化需氧量:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.bod5"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="铜:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cu"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="锌:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.zn"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="氟化物:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.flu"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="硒:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.se"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="砷:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.as_"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="汞:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.hg"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="镉:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cd"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="六价铬:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cr"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="铅:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.pb"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="氰化物:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.cyanide"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="挥发酚:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.volatilePhenol"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="石油类:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.petroleum"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="阴离子表面活性剂:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.sdbs"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="粪大肠菌群:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.fecalColiform"
                          style="width:100px"
                          type="number"
                        ></el-input>(个/l)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="硫化物:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.sulfide"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="硫酸盐:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.sulfate"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="氯化物:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.chloride"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="硝酸盐:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.nitrate"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="铁:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.fe"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="锰:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.mn"
                          style="width:100px"
                          type="number"
                        ></el-input>(mg/L)
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">全因子评价</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="水功能区水质类别:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.allFactorWaterQualityCategory"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="主要超标项目及其超标倍数:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.allFactorOverstandardProjectandtimes"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="达标评价结论:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.allFactorEvaluation_conclusion"
                          type="textarea"
                          :rows="3"
                          style="width:748px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
              <li class="liblock">
                <p class="lihead">水功能区限值纳污红线主要控制项目达标评价</p>
                <div class="libody clear">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="水功能区水质类别:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.limitFactorWaterQualityCategory"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="主要超标项目及其超标倍数:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.limitOverstandardProjectandtimes"
                          style="width:280px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="达标评价结论:">
                        <el-input
                          placeholder="请输入"
                          v-model="formData.limitEvaluation_conclusion"
                          type="textarea"
                          :rows="3"
                          style="width:748px"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
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
    <el-dialog :visible.sync="visiDialogA" width="920px" title="数据审核" :before-close="closessAudit">
      <div class="dialogcontent noScrollX">
        <el-scrollbar style="height:100%">
          <el-form :model="formDataAudit" :rules="rulesAudit" ref="ruleFormA">
            <ul>
              <li class="liblock">
                <p class="lihead">审核信息</p>
                <div class="libody clear">
                  <div class="formDiv">
                    <span class="rCode">审核意见：</span>
                    <div class="layoutBox">
                      <el-form-item prop="name">
                        <el-radio v-model="formDataAudit.radio" :label="1">同意</el-radio>
                        <el-radio v-model="formDataAudit.radio" :label="0">驳回</el-radio>
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
        <el-button @click="submitAudit('ruleFormA')">提交</el-button>
        <el-button type="noticonsecondBtn" @click="cancelAudit('ruleFormA')">取消</el-button>
      </div>
    </el-dialog>
   
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "",

  data() {
    return {
      exportLoading:false,
      visiDialogReport: false,
      fileList: [],
      visiDialogA: false,
      formDataAudit: { radio: 1, remark: "" },
      rulesAudit: {},
      treeLoading: false,
      brieStationList: [],
      staionPos: 0,
      stationCode: 0,
      treeStatus: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultId: [1],
      filter: "",
      treeData: [
        {
          id: "1",
          label: "雄安新区",
          structureType: "0",
          children: [
            {
              id: "2",
              label: "唐河河北保定缓冲区",
              structureType: "1",
              children: [
                {
                  id: "5",
                  label: "北青",
                  structureType: "2"
                }
              ]
            },
            {
              id: "3",
              label: "白洋淀河北湿地保护区",
              structureType: "1",
              children: [
                {
                  id: "14",
                  label: "安新桥",
                  structureType: "2"
                },
                {
                  id: "6",
                  label: "采莆台",
                  structureType: "2"
                },
                {
                  id: "7",
                  label: "大张庄",
                  structureType: "2"
                },
                {
                  id: "8",
                  label: "端村",
                  structureType: "2"
                },
                {
                  id: "9",
                  label: "留通",
                  structureType: "2"
                },
                {
                  id: "10",
                  label: "圈头",
                  structureType: "2"
                },
                {
                  id: "11",
                  label: "同口",
                  structureType: "2"
                },
                {
                  id: "12",
                  label: "王家寨",
                  structureType: "2"
                },
                {
                  id: "13",
                  label: "枣林庄",
                  structureType: "2"
                }
              ]
            },
            {
              id: "4",
              label: "大清河河北保定、廊坊开发利用区",
              structureType: "1",
              children: [
                {
                  id: "15",
                  label: "张青口",
                  structureType: "2"
                }
              ]
            }
          ]
        }
      ],
      name: "",
      vTitle: "重要水功能区监测数据新增",
      visiDialog: false,
      tableData: [],
      optionData: [],
      value: "",
      searchModel: "",
      currentPage: 1, //分页组件当前页
      pageSize: 25, //分页每页多少条数据
      totalRecords: 0, //总条数
      pageList: [25, 35, 55], //设置每页多少条
      formData: {
        id: null,
        monitorStationName: "", //监测断面名称
        monitorStationCode: "", //监测断面编码
        primaryWaterFunctionArea: "", //一级水功能区
        secondaryWaterFunctionArea: "", //二级水功能区
        monitorUnit: "", //监测单位
        waterFunctionAreaCode: "", //水功能区索引码
        receiveTime: null, //采样时间
        targetLevel: "", //参考目标
        remark: "", //备注
        limitEvaluation_conclusion: "", //水功能区限制评价结论
        limitOverstandardProjectandtimes: "", //水功能区超标项目及倍数
        limitFactorWaterQualityCategory: "", //水功能区水质类别
        allFactorWaterQualityCategory: "", //全因子水质类别
        allFactorOverstandardProjectandtimes: "", //全因子超标项目及倍数
        allFactorEvaluation_conclusion: "", //全因子评价结论
        an: null, //氨氮
        as_: null, //砷
        bod5: null, //五日生化需氧量
        cd: null, //镉
        chloride: null, //氯化物
        cod: null, //化学需氧量
        cr: null, //六价铬
        cu: null, //铜
        cyanide: null, //氰化物
        do_: null, //溶解氧
        fe: null, //铁
        fecalColiform: null, //粪大肠菌群
        flu: null, //氟化物
        hg: null, //汞
        mn: null, //锰
        nitrate: null, //硝酸盐
        pb: null, //铅
        permanganate: null, //高锰酸盐指数
        petroleum: null, //石油类
        ph: null, //PH
        sdbs: null, //阴离子表面活性剂
        se: null, //硒
        sulfate: null, //硫酸盐
        sulfide: null, //硫化物
        temp: null, //水温
        tn: null, //总氮
        tp: null, //总磷
        volatilePhenol: null, //挥发酚
        zn: null //锌
      },
      rules: {
        monitorStationName: [
          { required: true, message: "请输入断面名称", trigger: "blur" }
        ]
      },
      factorList: [
        { factorName: "水温", factorUnit: "(℃)", code: "temp" },
        { factorName: "pH", factorUnit: "(无量纲)", code: "ph" },
        { factorName: "溶解氧", factorUnit: "(mg/L)", code: "do_" },
        {
          factorName: "高锰酸盐指数",
          factorUnit: "(mg/L)",
          code: "permanganate"
        },
        { factorName: "化学需氧量", factorUnit: "(mg/L)", code: "cod" },
        { factorName: "5日生化需氧量", factorUnit: "(mg/L)", code: "bod5" },
        { factorName: "总磷", factorUnit: "(mg/L)", code: "tp" },
        { factorName: "总氮", factorUnit: "(mg/L)", code: "tn" },
        { factorName: "氨氮", factorUnit: "(mg/L)", code: "an" },
        { factorName: "砷", factorUnit: "(mg/L)", code: "as_" },
        { factorName: "镉", factorUnit: "(mg/L)", code: "cd" },
        { factorName: "氯化物", factorUnit: "(mg/L)", code: "chloride" },
        { factorName: "六价铬", factorUnit: "(mg/L)", code: "cr" },
        { factorName: "铜", factorUnit: "(mg/L)", code: "cu" },
        { factorName: "氰化物", factorUnit: "(mg/L)", code: "cyanide" },
        { factorName: "铁", factorUnit: "(mg/L)", code: "fe" },
        {
          factorName: "粪大肠菌群",
          factorUnit: "(个/L)",
          code: "fecalColiform"
        },
        { factorName: "氟化物", factorUnit: "(mg/L)", code: "flu" },
        { factorName: "汞", factorUnit: "(mg/L)", code: "hg" },
        { factorName: "锰", factorUnit: "(mg/L)", code: "mn" },
        { factorName: "硝酸盐", factorUnit: "(mg/L)", code: "nitrate" },
        { factorName: "铅", factorUnit: "(mg/L)", code: "pb" },
        { factorName: "石油类", factorUnit: "(mg/L)", code: "petroleum" },
        { factorName: "阴离子表面活性剂", factorUnit: "(mg/L)", code: "sdbs" },
        { factorName: "硒", factorUnit: "(mg/L)", code: "se" },
        { factorName: "硫酸盐", factorUnit: "(mg/L)", code: "sulfate" },
        { factorName: "硫化物", factorUnit: "(mg/L)", code: "sulfide" },
        { factorName: "挥发酚", factorUnit: "(mg/L)", code: "volatilePhenol" },
        { factorName: "锌", factorUnit: "(mg/L)", code: "zn" }
      ],
      loading: true,
      ids: "",
      showAuditBtn: false,
      isEditor: false, //判断是新增还是修改状态
      formD: null,
      tList:'',
    };
  },
  inject: ["globelDelet"],
  created() {
    this.searchData();
    // this.searchTreedata();
    this.$nextTick(() => {
      this.$refs.tree.setCheckedKeys(["1"]);
      this.defaultId.push("1");
      this.brieStationList = this.$refs.tree.getCheckedNodes();
    });
  },
  methods: {
    uploadFile(file) {
      this.formD.append("file", file.file);
    },
    audit(id) {
       let bool =true;
        for(let i=0;i<this.tList.length;i++){
          if(this.tList[i].status == 0 || this.tList[i].status == 2){
            bool=false;
            break
            
          }
        }
        if(!bool){
          this.$message({
                    message: '待提交或已审核数据无法进行审核',
                    type: "warning",
                    duration: 2000
            });
          return false
        }
      this.visiDialogA = true;
    },
    //导出
    exportReport(){
      window.open("/fileXA/export/exportFuntion?keyword="+this.searchModel+"")
      
    },
    //提交数据
    subData(){
         let bool =true;
        for(let i=0;i<this.tList.length;i++){
          if(this.tList[i].status == 1 || this.tList[i].status == 2){
            bool=false;
            break
            
          }
        }
        if(!bool){
          this.$message({
                    message: '已提交或已审核数据无法再次提交',
                    type: "warning",
                    duration: 2000
            });
          return false
        }
        let data={
          ids:this.ids
        }
        this.$http.post('/fileXA/waterFunction/submit',qs.stringify(data)).then(res=>{
            this.searchData();
                  this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000
            });
        })
    },
    //导入
    importReport(){
       this.visiDialogReport = true;
    },
    //导入提交
    submitReport(formName) {
      this.exportLoading=true;
      let excelHeader = [
        { fieldName: "monitorUnit", fieldType: "String" },
        { fieldName: "primaryWaterFunctionArea", fieldType: "String" },
        { fieldName: "secondaryWaterFunctionArea", fieldType: "String" },
        { fieldName: "waterFunctionAreaCode", fieldType: "String" },
        { fieldName: "monitorStationCode", fieldType: "String" },
        { fieldName: "monitorStationName", fieldType: "String" },
        {
          fieldName: "receiveTime",
          fieldType: "Date",
          dateFormmater: "yyyy-MM-dd"
        },
        { fieldType: "String", fieldName: "temp" },
        { fieldType: "String", fieldName: "ph" },
        { fieldType: "String", fieldName: "do_" },
        { fieldType: "String", fieldName: "permanganate" },
        { fieldType: "String", fieldName: "cod" },
        { fieldType: "String", fieldName: "bod5" },
        { fieldType: "String", fieldName: "tp" },
        { fieldType: "String", fieldName: "tn" },
        { fieldType: "String", fieldName: "an" },
        { fieldType: "String", fieldName: "as_" },
        { fieldType: "String", fieldName: "cd" },
        { fieldType: "String", fieldName: "chloride" },
        { fieldType: "String", fieldName: "cr" },
        { fieldType: "String", fieldName: "cu" },
        { fieldType: "String", fieldName: "cyanide" },
        { fieldType: "String", fieldName: "fe" },
        { fieldType: "String", fieldName: "fecalColiform" },
        { fieldType: "String", fieldName: "flu" },
        { fieldType: "String", fieldName: "hg" },
        { fieldType: "String", fieldName: "mn" },
        { fieldType: "String", fieldName: "nitrate" },
        { fieldType: "String", fieldName: "pb" },
        { fieldType: "String", fieldName: "petroleum" },
        { fieldType: "String", fieldName: "sdbs" },
        { fieldType: "String", fieldName: "se" },
        { fieldType: "String", fieldName: "sulfate" },
        { fieldType: "String", fieldName: "sulfide" },
        { fieldType: "String", fieldName: "volatilePhenol" },
        { fieldType: "String", fieldName: "zn" },
        { fieldType: "String", fieldName: "limitOverstandardProjectandtimes" },
        { fieldType: "String", fieldName: "allFactorWaterQualityCategory" },
        {
          fieldType: "String",
          fieldName: "allFactorOverstandardProjectandtimes"
        },
        { fieldType: "String", fieldName: "limitFactorWaterQualityCategory" },
        { fieldType: "String", fieldName: "limitEvaluation_conclusion" },
        { fieldType: "String", fieldName: "limitOverstandardProjectandtimes" }
      ];
    
      this.formD = new FormData();
      this.$refs.upload.submit();
      // for(let i=0;i<excelHeader.length;i++){
      //     this.formD.append("excelImportBo["+i+"].fieldName",excelHeader[i].fieldName);
      //     this.formD.append("excelImportBo["+i+"].fieldType",excelHeader[i].fieldType);
      //     if(excelHeader[i].fieldType == 'Date'){
      //        this.formD.append("excelImportBo["+i+"].dateFormmater",excelHeader[i].dateFormmater);
      //     }
      // }
      this.formD.append("excelImportBo", JSON.stringify(excelHeader));
      this.formD.append("flag", "waterFunction");
       this.$http
              .post("/fileXA/excel/import", this.formD)
              .then(res=>{
                  this.visiDialogReport = false;
                  this.fileList=[];
                   this.exportLoading=false;
                  this.searchData()
              })
    },
    //取消导入
    cancelReport(formName) {
      this.visiDialogReport = false;
    },
    //审核提交
    submitAudit(formName) {
       
        let data={
          ids:this.ids,
          flag:this.formDataAudit.radio
        }
        this.$http.post('/fileXA/waterFunction/audit',qs.stringify(data)).then(res=>{
                  this.searchData();
                  this.visiDialogA = false;
                  this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000
            });
        })
      
    },
    //取消审核
    cancelAudit(formName) {
      this.visiDialogA = false;
    },
    treeCheckchange() {
      this.brieStationList = this.$refs.tree.getCheckedNodes();
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
      if (this.stationCode > this.brieStationList.length - 2) {
        return false;
      }
      this.stationCode++;
      this.staionPos = this.stationCode * 34;
    },
    openMidtree() {
      this.treeStatus = true;
    },
    closeTree() {
      this.treeStatus = false;
    },
    //查询站点树数据
    searchTreedata() {
      this.treeLoading = true;
      this.$http
        .get("/waterEnvXA/station/oriTree", {
          params: {
            structureType: "river"
          }
        })
        .then(res => {
          this.treeLoading = false;
          this.treeData = res.data.content.dataList;
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([
              this.treeData[0].children[0].children[0].id
            ]);
            this.defaultId.push(this.treeData[0].children[0].children[0].id);

            this.brieStationList = this.$refs.tree.getCheckedNodes();
          });
        });
    },
    tableChange(val, index) {
      this.tList=val;
      this.ids = "";
      let arr = val;
      for (let i in arr) {
        this.ids += arr[i].id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    searchData() {
      this.loading = true;
      this.$http
        .get("/fileXA/waterFunction", {
          params: {
            key: this.searchModel,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            status:1,
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.tableData = res.data.content.dataList;
            this.totalRecords = res.data.content.totalRecords;
            if (res.data.content.flag == 0) {
              this.showAuditBtn = true;
            } else {
              this.showAuditBtn = false;
            }
          }
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
            this.$http.put("/fileXA/waterFunction", this.formData).then(res => {
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
            this.$http
              .post("/fileXA/waterFunction", this.formData)
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
    //关闭弹框
    closessAudit(done) {
      done();
    },
    //修改
    revise(row) {
      this.isEditor = true;
      this.visiDialog = true;
      this.formData.id = row.id;
      this.formData.monitorStationName = row.monitorStationName; //监测断面名称
      this.formData.monitorStationCode = row.monitorStationCode; //监测断面编码
      this.formData.primaryWaterFunctionArea = row.primaryWaterFunctionArea; //一级水功能区
      this.formData.secondaryWaterFunctionArea = row.secondaryWaterFunctionArea; //二级水功能区
      this.formData.monitorUnit = row.monitorUnit; //监测单位
      this.formData.waterFunctionAreaCode = row.waterFunctionAreaCode; //水功能区索引码
      this.formData.receiveTime = row.receiveTime; //采样时间
      this.formData.targetLevel = row.targetLevel; //参考目标
      this.formData.remark = row.remark; //备注
      this.formData.limitEvaluation_conclusion = row.limitEvaluation_conclusion; //水功能区限制评价结论
      this.formData.limitOverstandardProjectandtimes =
        row.limitOverstandardProjectandtimes; //水功能区超标项目及倍数
      this.formData.limitFactorWaterQualityCategory =
        row.limitFactorWaterQualityCategory; //水功能区水质类别
      this.formData.allFactorWaterQualityCategory =
        row.allFactorWaterQualityCategory; //全因子水质类别
      this.formData.allFactorOverstandardProjectandtimes =
        row.allFactorOverstandardProjectandtimes; //全因子超标项目及倍数
      this.formData.allFactorEvaluation_conclusion =
        row.allFactorEvaluation_conclusion; //全因子评价结论
      this.formData.an = row.an; //氨氮
      this.formData.as_ = row.as_; //砷
      this.formData.bod5 = row.bod5; //五日生化需氧量
      this.formData.cd = row.cd; //镉
      this.formData.chloride = row.chloride; //氯化物
      this.formData.cod = row.cod; //化学需氧量
      this.formData.cr = row.cr; //六价铬
      this.formData.cu = row.cu; //铜
      this.formData.cyanide = row.cyanide; //氰化物
      this.formData.do_ = row.do_; //溶解氧
      this.formData.fe = row.fe; //铁
      this.formData.fecalColiform = row.fecalColiform; //粪大肠菌群
      this.formData.flu = row.flu; //氟化物
      this.formData.hg = row.hg; //汞
      this.formData.mn = row.mn; //锰
      this.formData.nitrate = row.nitrate; //硝酸盐
      this.formData.pb = row.pb; //铅
      this.formData.permanganate = row.permanganate; //高锰酸盐指数
      this.formData.petroleum = row.petroleum; //石油类
      this.formData.ph = row.ph; //PH
      this.formData.sdbs = row.sdbs; //阴离子表面活性剂
      this.formData.se = row.se; //硒
      this.formData.sulfate = row.sulfate; //硫酸盐
      this.formData.sulfide = row.sulfide; //硫化物
      this.formData.temp = row.temp; //水温
      this.formData.tn = row.tn; //总氮
      this.formData.tp = row.tp; //总磷
      this.formData.volatilePhenol = row.volatilePhenol; //挥发酚
      this.formData.zn = row.zn; //锌
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData.id = null;
      this.formData.monitorStationName = ""; //监测断面名称
      this.formData.monitorStationCode = ""; //监测断面编码
      this.formData.primaryWaterFunctionArea = ""; //一级水功能区
      this.formData.secondaryWaterFunctionArea = ""; //二级水功能区
      this.formData.monitorUnit = ""; //监测单位
      this.formData.waterFunctionAreaCode = ""; //水功能区索引码
      this.formData.receiveTime = null; //采样时间
      this.formData.targetLevel = ""; //参考目标
      this.formData.remark = ""; //备注
      this.formData.limitEvaluation_conclusion = ""; //水功能区限制评价结论
      this.formData.limitOverstandardProjectandtimes = ""; //水功能区超标项目及倍数
      this.formData.limitFactorWaterQualityCategory = ""; //水功能区水质类别
      this.formData.allFactorWaterQualityCategory = ""; //全因子水质类别
      this.formData.allFactorOverstandardProjectandtimes = ""; //全因子超标项目及倍数
      this.formData.allFactorEvaluation_conclusion = ""; //全因子评价结论
      this.formData.an = null; //氨氮
      this.formData.as_ = null; //砷
      this.formData.bod5 = null; //五日生化需氧量
      this.formData.cd = null; //镉
      this.formData.chloride = null; //氯化物
      this.formData.cod = null; //化学需氧量
      this.formData.cr = null; //六价铬
      this.formData.cu = null; //铜
      this.formData.cyanide = null; //氰化物
      this.formData.do_ = null; //溶解氧
      this.formData.fe = null; //铁
      this.formData.fecalColiform = null; //粪大肠菌群
      this.formData.flu = null; //氟化物
      this.formData.hg = null; //汞
      this.formData.mn = null; //锰
      this.formData.nitrate = null; //硝酸盐
      this.formData.pb = null; //铅
      this.formData.permanganate = null; //高锰酸盐指数
      this.formData.petroleum = null; //石油类
      this.formData.ph = null; //PH
      this.formData.sdbs = null; //阴离子表面活性剂
      this.formData.se = null; //硒
      this.formData.sulfate = null; //硫酸盐
      this.formData.sulfide = null; //硫化物
      this.formData.temp = null; //水温
      this.formData.tn = null; //总氮
      this.formData.tp = null; //总磷
      this.formData.volatilePhenol = null; //挥发酚
      this.formData.zn = null; //锌
    },
    //删除
    delet(id) {
      this.globelDelet("/fileXA/waterFunction", id, this.searchData);
    },
    //批量删除
    allDelet() {
      this.globelDelet("/fileXA/waterFunction", this.ids, this.searchData);
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
.pageContent {
  position: relative;
  background: #eff3f5;
  .treeBox {
    width: 204px;
    height: 100%;
    border: 1px solid #dce9fa;
    position: absolute;
    left: 0px;
    top: 0px;
    background: #ebf1f7;
    .closeBtn {
      width: 6px;
      height: 44px;
      background: url("../../../assets/images/shuClose.png") center center
        no-repeat;
      position: absolute;
      top: 50%;
      transform: translateY(-3px);
      right: -6px;
      cursor: pointer;
      &:hover {
        background: url("../../../assets/images/hover_shuClose.png") center center
          no-repeat;
      }
      i {
        width: 3px;
        height: 8px;
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translateY(-4px);
        background: url("../../../assets/images/righticon.png") center center
          no-repeat;
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
        li {
          float: left;
          height: 28px;
          width: 49.99%;
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
    height: 100%;
    border: 1px solid #dce9fa;
    position: absolute;
    left: 0px;
    top: 0px;
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
            writing-mode: vertical-lr;
            background: url("../../../assets/images/jiao_j.png") center center
              no-repeat;
            color: #fff;
            float: left;
            text-align: center;
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
        background: url("../../../assets/images/jiao_f.png") center center
          no-repeat;
        right: 0px;
      }
      &:before {
        background: url("../../../assets/images/jiao_h.png") center center
          no-repeat;
        left: 0px;
      }
      .tl {
        background: url("../../../assets/images/jiao_e.png") center center
          no-repeat;
        left: 0px;
      }
      .tr {
        background: url("../../../assets/images/jiao_g.png") center center
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
      width: 6px;
      height: 44px;
      background: url("../../../assets/images/shuClose.png") center center
        no-repeat;
      position: absolute;
      top: 50%;
      transform: translateY(-3px);
      right: -6px;
      cursor: pointer;
      &:hover {
        background: url("../../../assets/images/hover_shuClose.png") center center
          no-repeat;
      }
      i {
        width: 3px;
        height: 8px;
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translateY(-4px);
        background: url("../../../assets/images/righticon.png") center center
          no-repeat;
      }
    }
  }
  .secondary-page-section {
    height: 100%;
    //  border: 1px solid #dce9fa;
    width: calc(100% - 210px);
    position: absolute;
    background: #fff;
    left: 210px;
    top: 0px;
    transition: all 0.3s;
  }
  .larScreen {
    width: calc(100% - 70px);
    left: 70px;
  }
}
</style>
