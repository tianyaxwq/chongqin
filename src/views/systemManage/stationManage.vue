<template>
  <div class="historypage tapStyle secondary-page-mode" style="margin-top:0px">
     <div class="currency-mode-wrap" style="height: 100%;margin-top:0px">
          <yf-tabs type="border-card" >
            <yf-tab-pane label="站点信息">
              <el-scrollbar style="height:100%">
                  <div class="baseinfo">
                    <el-form :model="stationFormData" :rules="stationFormRules" ref="stationForm">
                        <ul>
                           <li>
                              <span class="layoutspan"><i>*</i>站点名称 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="stationName">
                                    <el-input v-model="stationFormData.stationName"></el-input>
                                </el-form-item>
                              </div>
                              <span class="layoutspan"><i>*</i>站点编号 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="stationCode">
                                    <el-input v-model="stationFormData.stationCode"></el-input>
                                </el-form-item>
                              </div>
                              <span class="layoutspan">密码 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-input v-model="stationFormData.stationPassworld"></el-input>
                              </div>
                          </li>
                           <li>
                             <span class="layoutspan"><i>*</i>所属省份 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="provinceId">
                                    <el-select v-model="stationFormData.provinceId"  placeholder="请选择" @change="provinceChange">
                                          <el-option
                                            v-for="item in provinceData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                          </el-option>
                                    </el-select>
                                </el-form-item>
                              </div>
                             
                              <span class="layoutspan"><i>*</i>所属城市 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="areaId">
                                  <el-select v-model="stationFormData.areaId"  placeholder="请选择" @focus="areaFocus">
                                        <el-option
                                          v-for="item in areaData"
                                          :key="item.id"
                                          :label="item.name"
                                          :value="item.id">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                              <span class="layoutspan">当地管理单位 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-input v-model="stationFormData.localManagementUnits"></el-input>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan"><i>*</i>所属流域 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="basinId">
                                   <el-select v-model="stationFormData.basinId"  placeholder="请选择">
                                        <el-option
                                          v-for="item in basinData"
                                          :key="item.basinnId"
                                          :label="item.basinnName"
                                          :value="item.basinnId">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                                
                              </div>
                               <span class="layoutspan"><i>*</i>所属河流 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="stationRiver">
                                  <el-input v-model="stationFormData.stationRiver"></el-input>
                                </el-form-item>
                              </div>
                             <span class="layoutspan">站点分类 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-select v-model="stationFormData.stationType"  placeholder="请选择">
                                        <el-option
                                          v-for="item in stationTypeData"
                                          :key="item.stationTypeId"
                                          :label="item.stationTypeName"
                                          :value="item.stationTypeId">
                                        </el-option>
                                  </el-select>
                              </div>
                             
                              <!-- <span class="layoutspan">所属包件 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-select v-model="formData.siteCategory"  placeholder="请选择" @change="selectChange">
                                        <el-option
                                          v-for="item in optionData"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                  </el-select>
                              </div> -->
                          </li>
                          <li>
                             <span class="layoutspan"><i>*</i>地表水类别 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="surfaceWaterTypes">
                                  <el-select v-model="stationFormData.surfaceWaterTypes"  placeholder="请选择">
                                        <el-option
                                          v-for="item in surfaceWaterData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                              <span class="layoutspan"><i>*</i>水质目标级别 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="targetLevel">
                                  <el-select v-model="stationFormData.targetLevel"  placeholder="请选择">
                                        <el-option
                                          v-for="item in targetLevelData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                              <span class="layoutspan">站点类型 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-select v-model="stationFormData.stationClassify"  placeholder="请选择">
                                        <el-option
                                          v-for="item in stationClassData"
                                          :key="item.stationClassifyId"
                                          :label="item.stationClassifyName"
                                          :value="item.stationClassifyId">
                                        </el-option>
                                  </el-select>
                              </div>
                          </li>
                          <li>  
                             <span class="layoutspan"><i>*</i>经度-纬度 : </span>&nbsp;
                              <div class="layoutBox" style="width:75px">
                                <el-form-item  prop="longitude">
                                  <el-input v-model="stationFormData.longitude"></el-input>
                                </el-form-item>
                              </div>
                              -
                               <div class="layoutBox" style="width:75px">
                                  <el-form-item  prop="latitude">
                                     <el-input v-model="stationFormData.latitude"></el-input>
                                  </el-form-item>
                              </div>
                              <span class="sousuo" @click="dialogVisibleMap =true"><i class="el-icon-location-outline" style="font-size: 16px;color:#C0C4CC"></i></span>

                             
                             
                              <span class="layoutspan"><i>*</i>排序 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                <el-form-item  prop="sort">
                                 <el-input v-model="stationFormData.sort" type="number"></el-input>
                                </el-form-item>
                              </div>
                              <span class="layoutspan">上下游省份 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-input v-model="stationFormData.stationProvincesUpDown"></el-input>
                                 
                              </div>
                          </li>
                          <li>  
                              <span class="layoutspan">是否验收 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                     <el-radio v-model="stationFormData.enabled" label="1">是</el-radio>
                                      <el-radio v-model="stationFormData.enabled" label="0">否</el-radio>
                              </div>
                               <span class="layoutspan">验收时间 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-date-picker
                                    v-model="stationFormData.enabledTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                                  </el-date-picker>
                              </div>
                               <span class="layoutspan">考核城市 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-select v-model="stationFormData.city"  placeholder="请选择"  @focus="areaFocus">
                                        <el-option
                                          v-for="item in areaData"
                                          :key="item.id"
                                          :label="item.name"
                                          :value="item.id">
                                        </el-option>
                                  </el-select>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan">站点属性 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                     <el-input v-model="stationFormData.stationProperty"></el-input>
                              </div>
                               <span class="layoutspan">站点功能 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-select v-model="stationFormData.stationFunction"  placeholder="请选择">
                                        <el-option
                                          v-for="item in stationFunData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
                                  </el-select>
                              </div>
                               <span class="layoutspan">运维单位 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                  <el-select v-model="stationFormData.operCompanyCode"  placeholder="请选择">
                                        <el-option
                                          v-for="item in operCompanyData"
                                          :key="item.operCompanyId"
                                          :label="item.operCompanyName"
                                          :value="item.operCompanyId">
                                        </el-option>
                                  </el-select>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan"><i>*</i>数据发送频率 : </span>&nbsp;
                              <div class="layoutBox"  style="width:100px;margin-right:6px">
                                   <el-form-item  prop="freNumber">
                                     <el-input v-model="stationFormData.freNumber" placeholder="请输入" type="number"></el-input>
                                   </el-form-item>
                              </div>
                              <div class="layoutBox" style="width:90px">
                                 <el-form-item  prop="freUnit">
                                  <el-select v-model="stationFormData.freUnit"  placeholder="请选择">
                                        <el-option
                                          v-for="item in frequencyOption"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                              <span class="layoutspan"><i>*</i>关联因子 : </span>&nbsp;
                              <div class="layoutBox" style="width:200px">
                                 <el-form-item  prop="projectCodesArr">
                                  <el-select v-model="stationFormData.projectCodesArr"  placeholder="请选择"  multiple collapse-tags @change="factorChange">
                                        <el-option
                                          v-for="item in factorData"
                                          :key="item.projectCode"
                                          :label="item.projectName"
                                          :value="item.projectCode">
                                        </el-option>
                                  </el-select>
                                </el-form-item>
                              </div>
                          </li>
                          <li>
                              <span class="layoutspan">站点地址 : </span>&nbsp;
                              <div class="layoutBox" style="width:863px">
                                     <el-input v-model="stationFormData.stationAddress"></el-input>
                              </div>
                          </li>
                           <li>
                              <span class="layoutspan">站点简介 : </span>&nbsp;
                              <div class="layoutBox" style="width:863px">
                                    <el-input v-model="stationFormData.stationBriefInfo" type="textarea" :rows="6"></el-input> 
                              </div>
                          </li>
                           <li>
                              <span class="layoutspan">历史文化介绍:
                                <br>(周边环境) </span>&nbsp;
                              <div class="layoutBox" style="width:863px">
                                    <el-input v-model="stationFormData.peripheralHistory" type="textarea" :rows="6"></el-input>
                              </div>
                          </li>
                        </ul>  
                    </el-form>
                  </div> 
                  <div>
                        
                  </div>
                  <div class="btn" style="text-align: center">
                        <el-button @click="submitSites('stationForm')" type="noticon">保存</el-button>
                       
                  </div>
              </el-scrollbar>
            </yf-tab-pane>
            <yf-tab-pane label="仪器参数">
                  <div class="secondary-toolbar">
                        <el-button @click="addParams"><i class="iconfont icon-tianjia1"></i>新增</el-button>
                        <el-button type='delet' @click="exportedForm"><i class="iconfont icon-daochu"></i>导出</el-button>
                         <el-button type="delet" @click="allparamsDelet"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
                        因水质评价统计，将统一设置检出限计算：CODmn 0.5(mg/L)、氨氮 0.05(mg/L)、TP 0.01(mg/L)、TN 0.1(mg/L)
                  </div>
                  <div class="tablebox">
                        <el-table
                          tooltip-effect="light"
                          :data="tableData"
                          border
                         ref="table"
                          style="width: 100%;" 
                          v-loading="loading"
                          element-loading-text="加载中"
                          element-loading-spinner="loading-type-a"
                          element-loading-background="rgba(255, 255, 255, 1)"
                           @selection-change="tableChange">
                          <el-table-column
                              type="selection"
                              width="50">
                          </el-table-column>
                          <el-table-column
                            type="index"
                            label="序号"
                            :index="indexMethod"
                            width="50">
                          </el-table-column>
                          <el-table-column
                            prop="PROJECT_NAME"
                            show-overflow-tooltip
                            label="监测项目">              
                          </el-table-column>
                           <el-table-column
                            prop="EQUIPMENT_NAME"
                            show-overflow-tooltip
                            label="分析仪器">              
                          </el-table-column>
                           <el-table-column
                            prop="MANUFACTOR"
                            show-overflow-tooltip
                            label="仪器厂家">              
                          </el-table-column>
                           <el-table-column
                            prop="ANALY_METHONS"
                            show-overflow-tooltip
                            label="分析方法">              
                          </el-table-column>
                           <el-table-column
                            prop="REAGENT"
                            show-overflow-tooltip
                            label="试剂">              
                          </el-table-column>
                           <el-table-column
                            prop="DETECTION_LIMIT"
                            show-overflow-tooltip
                            width="66"
                            label="检出限">              
                          </el-table-column>
                           <el-table-column
                            prop="UPPER_LIMIT"
                            show-overflow-tooltip
                             width="134"
                            label="标准上限">              
                          </el-table-column>
                          <el-table-column
                            prop="LOWER_LIMIT"
                            show-overflow-tooltip
                             width="134"
                            label="标准下限">              
                          </el-table-column>
                           <el-table-column
                            prop="PROJECT_UNIT"
                            show-overflow-tooltip
                             width="79"
                            label="单位">              
                          </el-table-column>
                           <el-table-column
                            prop="MANUFACTURE_CODE"
                            show-overflow-tooltip
                             width="120"
                            label="出厂编号">              
                          </el-table-column>
                           <el-table-column
                            prop="CREATE_TIME"
                            show-overflow-tooltip
                             width="180"
                            label="安装时间">   
                             <template slot-scope="scope">
                               <div>
                                  {{new Date(scope.row.CREATE_TIME).format('yyyy-MM-dd hh:mm:ss')}}
                               </div>
                             </template>           
                          </el-table-column>
                           <el-table-column
                            prop="ISENABLE"
                            show-overflow-tooltip
                             width="75"
                            label="是否启用">   
                              <template slot-scope="scope">
                                <div> 
                                    <i style="color:#36C25E;font-size:20px;" class="iconfont icon-chenggongzhuangtai" v-if="scope.row.ISENABLE == '是' "></i>
                                    <i style="color:#FF3333;font-size:20px;" class="iconfont icon-meiyouchenggongdezhuangtai" v-if="scope.row.ISENABLE != '是' "></i>
                                </div>
                              </template>           
                          </el-table-column>
                           <el-table-column
                            prop="name"
                             width="180"
                            label="操作">  
                            <template slot-scope="scope">
                               <div>
                                   <el-button type="secondBtn"  @click="editorParams(scope.row)">编辑</el-button> 
                                   <el-button type="secondBtn"  @click="paramsDelet(scope.row.EQUIPMENT_ID)">删除</el-button>   
                               </div>
                             </template>   
                                  
                          </el-table-column>
                        </el-table>
                       
                        <div class="paginationBox">
                          <el-pagination
                            @size-change="paginationSizeChange"
                            @current-change="paginationChange"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            background
                            :small = "true"
                            popper-class = "select-common-option"
                            :page-sizes = "pageList"
                            layout="total,sizes,slot,->,prev, pager, next, jumper"
                            :total="total">
                            <span class="el-pagination__current">当前第{{currentPage}}/{{totalPageNumber}}页</span>
                          </el-pagination>
                        </div>
                  </div>
            </yf-tab-pane>
             <yf-tab-pane label="站点图片">
                  <div class="uploadBtnBox">
                      <el-button @click="upload('out')"><i class="iconfont icon-shangchuan1"></i>上传外景图片</el-button><el-button @click="upload('inside')" ><i class="iconfont icon-shangchuan1"></i>上传内景图片</el-button><el-button @click="upload('build')"><i class="iconfont icon-shangchuan1"></i>上传建设图片</el-button>
                      <span>图片适合比例16：9，最小宽高 400 * 255，建议大小1MB以下；二维码站点介绍图片优先展示八方位外景图</span>
                  </div>
                  <div class="stationManage" style="height:calc(100% - 70px)">
                    <el-scrollbar style="height:100%">
                      <ul class="uploadImg">
                         <li>
                           <!-- <p>八方位-外景图片</p>
                           <div class="uploadBox">
                                <el-upload
                                  ref="outUpload"
                                  :file-list="outfileList"
                                  :on-change="outfileChange"
                                  action="https://jsonplaceholder.typicode.com/posts/"
                                  list-type="picture-card"
                                  :auto-upload="false"
                                  :on-preview="handlePictureCardPreview"
                                  :http-request="uploadFile"
                                  :on-remove="handleRemove">
                                  <i class="el-icon-plus"></i>
                                </el-upload>
                           </div> -->
                              <p>八方位-外景图片</p>
                              <el-image 
                                v-for="(item,key) in outfileListPre"
                                :key="key"
                                style="width: 180px; height: 180px"
                                :src="item.url" 
                                :preview-src-list="outfileListPre">
                                 
                              </el-image>
                         </li>
                         <li>
                           <!-- <p>八方位-内景图片</p>
                           <div class="uploadBox">
                                <el-upload
                                  action="https://jsonplaceholder.typicode.com/posts/"
                                  list-type="picture-card"
                                  :file-list="insidefileList"
                                   :on-change="insidefileChange"
                                  :auto-upload="false"
                                  :http-request="uploadFile"
                                  :on-preview="handlePictureCardPreview"
                                  :on-remove="handleRemove">
                                  <i class="el-icon-plus"></i>
                                </el-upload>
                           </div> -->
                              <p>八方位-内景图片</p>
                              <el-image 
                                v-for="(item,key) in insidefileListPre"
                                :key="key"
                                style="width: 200px; height: 200px"
                                :src="item.url" 
                                :preview-src-list="insidefileListPre">
                              </el-image>
                         </li>
                         <li>
                           <!-- <p>建设图片</p>
                           <div class="uploadBox">
                                <el-upload
                                  action="https://jsonplaceholder.typicode.com/posts/"
                                  list-type="picture-card"
                                   :on-change="buildfileChange"
                                  :file-list="buildfileList"
                                  :auto-upload="false"
                                  :on-preview="handlePictureCardPreview"
                                  :on-remove="handleRemove"
                                  >
                                  <i class="el-icon-plus"></i>
                                </el-upload>
                           </div> -->
                            <p>八方位-建设图片</p>
                              <el-image 
                                v-for="(item,key) in buildfileListPre"
                                :key="key"
                                style="width: 200px; height: 200px"
                                :src="item.url" 
                                :preview-src-list="buildfileListPre">
                              </el-image>
                         </li>
                       </ul>
                    </el-scrollbar>
                      
                  </div>
            </yf-tab-pane>
          </yf-tabs>
     </div>
      <el-dialog :visible.sync="visiDialog"  width="635px" title="仪器参数" :before-close="closess">
       <div class="dialogcontent">
             <div class="dialog-layout">
                <el-form :model="paramsForamData" :rules="paramsFormRules" ref="paramsForm">
                    <ul  class="formul">
                      <li>
                          <div style="margin-right:42px">
                                <span class="layoutspan">参数名称 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                  <el-form-item  prop="projectCode">
                                      <el-select v-model="paramsForamData.projectCode" placeholder="请选择参数名称" filterable allow-create default-first-option @change="selectChange">
                                        <el-option
                                          v-for="item in factorData"
                                          :key="item.projectCode"
                                          :label="item.projectName"
                                          :value="item.projectCode">
                                        </el-option>
                                      </el-select>
                                  </el-form-item>
                                </div>
                          </div>
                         
                      </li>
                      <li>
                         <div>
                                <span class="layoutspan">厂家 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                  <el-form-item  prop="manufactor">
                                    <el-input  v-model="paramsForamData.manufactor" placeholder="请输入厂家"></el-input>
                                  </el-form-item>
                                </div>
                          </div>
                      </li>
                      <li>
                          <div  style="margin-right:42px">
                                <span class="layoutspan">仪器型号 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                  <el-form-item  prop="equipmentModel">
                                    <el-input  v-model="paramsForamData.equipmentModel"  placeholder="请输入仪器型号"></el-input>
                                   </el-form-item>
                                </div>
                          </div>
                         
                      </li>
                      <li>
                        
                          <div style="margin-right:42px">
                                <span class="layoutspan">仪器设备 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                    <el-input  v-model="paramsForamData.equipmentName" :placeholder="equipPlaceholder"></el-input>
                                </div>
                          </div>
                         
                      </li>
                      <li>
                         <div>
                                <span class="layoutspan">分析方法 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                    <el-input  v-model="paramsForamData.analyticalMethods" placeholder="请输入分析方法"></el-input>
                                </div>
                          </div>
                      </li>
                     
                       <li>
                          <div  style="margin-right:42px">
                                <span class="layoutspan">仪器量程 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                    <el-input  v-model="paramsForamData.equipmentOrange"  placeholder="请输入仪器量程"></el-input>
                                </div>
                          </div>
                         
                      </li>
                      <li>
                          <div  style="margin-right:42px">
                                <span class="layoutspan">检出限 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                    <el-input  v-model="paramsForamData.detectionLimit" placeholder="请输入检出限"></el-input>
                                </div>
                          </div>
                         
                      </li>
                      <li>
                         <div>
                                <span class="layoutspan">标准上下限 : </span>&nbsp;
                                <div class="layoutBox" style="width:214px">
                                    <el-input  v-model="paramsForamData.upperLimit"  placeholder="请输入标准上限"></el-input>
                                </div>-
                                <div class="layoutBox" style="width:214px">
                                    <el-input  v-model="paramsForamData.lowerLimit"  placeholder="请输入标准下限"></el-input>
                                </div>
                          </div>
                      </li>
                      <li>  
                          <div  style="margin-right:42px">
                                <span class="layoutspan">出厂编号 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                    <el-input  v-model="paramsForamData.manufactureCode" placeholder="请输入出厂编号"></el-input>
                                </div>
                          </div>
                          
                      </li>
                      <li>
                         <div>
                                <span class="layoutspan">安装时间 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                      <el-date-picker
                                        v-model="paramsForamData.createTime"
                                        type="datetime"
                                        clear-icon="clearIcon"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="请选择安装时间">
                                      </el-date-picker>
                                </div>
                          </div>
                      </li>
                      <li>
                           <div  style="margin-right:42px">
                                <span class="layoutspan">是否开启 : </span>&nbsp;
                                <div class="layoutBox" style="width:200px;height:30px;line-height:30px">
                                    <el-switch
                                      width="180px"
                                      v-model="paramsForamData.isenable"
                                      active-text="否"
                                      inactive-text="是"
                                      active-value="1"
                                      inactive-value="0">
                                    </el-switch>
                                </div>
                          </div>
                         
                      </li>
                      <li>
                         <span class="layoutspan">试剂 : </span>&nbsp;
                                <div class="layoutBox" style="width:436px">
                                   <el-input  v-model="paramsForamData.reagent"></el-input>
                                </div>
                      </li>
                    </ul>
                </el-form>
             </div>
       </div>
       <div slot="footer" class="dialog-footer">
          <el-button type="noticon" @click="saveParamsForm('paramsForm')">保 存</el-button>
          <el-button type="noticonsecondBtn" @click="cancelParams('paramsForm')">关 闭</el-button>
       </div>
      </el-dialog>
      <el-dialog :visible.sync="visiDialogImg"  width="1000px" :title="vTitle">
                 <div style="height:400px">
                      <p>点击添加图片:</p>
                      <el-upload
                          ref="outUpload"
                          :file-list="fileList"
                          :on-change="fileChange"
                          action="/"
                          list-type="picture-card"
                          :auto-upload="false"
                          :on-preview="handlePictureCardPreview"
                          :http-request="uploadFile"
                          :on-remove="handleRemove">
                          <i class="el-icon-plus"></i>
                      </el-upload>
                 </div>
                 <div slot="footer" class="dialog-footer">
                    <el-button type="noticon" @click="uploadImg">上 传</el-button>
                    <el-button type="noticonsecondBtn" >取 消</el-button>
                 </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog :visible.sync="dialogVisibleMap" width="1000px" title="地图">
          <div style="height:500px;position:relative">
             <div style="position:absolute;top:12px;left:12px;z-index:9999">
                <el-input v-model="lng" style="width:100px"></el-input>
                 <el-input  v-model="lat" style="width:100px"></el-input>
             </div>
             <map-Comp @getLntLat="getLntLat"></map-Comp>
          </div>
          <div slot="footer" class="dialog-footer">
                    <el-button type="noticon" @click="saveLngLat">确 定</el-button>
                    <el-button type="noticonsecondBtn" @click="dialogVisibleMap = false">取 消</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import mapComp from './map';
import {exportTableData} from '../../assets/js/tableExport'

export default {
  name: "",

  data() {
    return {
      lng:'',//经度
      lat:'',//纬度
      dialogVisibleMap:false,
      frequencyOption:[{
        name:'S',
      },{
        name:'M',
      },{
        name:'H',
      }],
      loading:true,
      dialogImageUrl: "",
      dialogVisible: false,
      visiDialog: false,
      treeConfig: {
        showCheckbox: false,
        defaultId: 6
      },
      treedata: [],
      outfileListPre:[],
      insidefileListPre:[],
      buildfileListPre:[],
      fileList: [],//外景图片
      file:[],//外景图片数据
      insidefileList: [],//外景图片
      insidefile:[],//外景图片数据
      buildfileList: [],//外景图片
      buildfile:[],//外景图片数据
      visiDialogImg:false,
      imgType:'',//文件类型
      vTitle:'',
      tableData: [],//仪器参数表格
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
        operCompanyCode:'',//运维单位
        operCompanyName:'',
        stationAddress: "", //站点地址
        stationBriefInfo: "", //站点简介
        peripheralHistory: "", //周边历史文化
        stationId:'',//站点ID
        freUnit:'',//数据发送频率单位
        freNumber:'',
        dataFrequency:'',
        projectCodes:'',//关联因子
        projectCodesArr:[],
        appCode:this.toolObj.getCookie("appCode")
      }, //站点表单数据
      
      stationFormRules: {
        stationName: [
          { required: true, message: "请输入站点名称", trigger: "blur" }
        ],
        freNumber: [
          { required: true, message: "请输入频率", trigger: "blur" }
        ],
        stationCode: [
          { required: true, message: "请输入站点编号", trigger: "blur" }
        ],
        provinceId: [
          { required: true, message: "请选择所属省份", trigger: "change" }
        ],
        projectCodesArr: [
          { required: true, message: "请选择关联因子", trigger: "change" }
        ],
        areaId: [
          { required: true, message: "请选择所属城市", trigger: "change" }
        ],
        basinId: [
          { required: true, message: "请选择所属流域", trigger: "change" }
        ],
        stationRiver: [
          { required: true, message: "请输入所属河流", trigger: "blur" }
        ],
        surfaceWaterTypes: [
          { required: true, message: "请选择地表水类型", trigger: "change" }
        ],
        freUnit:[ { required: true, message: "请选择单位", trigger: "change" }],
        targetLevel: [
          { required: true, message: "请选择水质目标等级", trigger: "change" }
        ],
        longitude: [{ required: true, message: "请输入经度", trigger: "blur" }],
        latitude: [{ required: true, message: "请输入纬度", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }]
      }, //站点表单验证
      paramsForamData:{
        projectCode:'',//因子参数Code
        manufactor:'',//厂家名称
        equipmentModel:'',//仪器型号
        equipmentName:'',//仪器设备
        analyticalMethods:'',//分析方法
        equipmentOrange:'',//仪器量程
        detectionLimit:'',//检出限
        upperLimit:'',//上限值
	      lowerLimit:'',//下限值
        manufactureCode:'',//出厂编号
        createTime:'',//安装时间
        isenable:'0',//是否启用
        reagent:'',//试剂
        id:'',//仪器参数Id
      },//仪器参数表单数据
      paramsFormRules:{
         projectCode: [
          { required: true, message: "请选择参数名称", trigger: "change" }
        ],
        manufactor: [
          { required: true, message: "请输入厂家名称", trigger: "blur" }
        ],
        equipmentModel: [
          { required: true, message: "请输入仪器型号", trigger: "blur" }
        ],
      },
      provinceData: [], //省份下拉框数据
      areaData: [], //所属城市下拉框数据
      basinData: [], //所属流域下拉框数据
      stationTypeData: [], //站点分类下拉框数据
      surfaceWaterData: [], //地表水下拉框数据
      targetLevelData: [], //水质目标等级下拉框
      stationClassData: [], //站点类型下拉框数据
      stationFunData: [], //站点功能下拉框数据
      operCompanyData:[],//运维单位下拉框数据
      factorData:[],//因子数组
      equipPlaceholder:"请输入设备仪器信息",
      stationMn:'',//站点的MN号
      paramsId:'',//仪器参数Id
      currentPage: 1, //分页组件当前页
      pageSize: 10, //分页每页多少条数据
      total: 0, //总条数
      pageList: [10, 20, 30], //设置每页多少条
      fieldList:["PROJECT_NAME","EQUIPMENT_NAME","MANUFACTOR","ANALY_METHONS","REAGENT","DETECTION_LIMIT","UPPER_LIMIT","LOWER_LIMIT","PROJECT_UNIT","MANUFACTURE_CODE","CREATE_TIME","ISENABLE"],
    };
  },
  created() {
    this.init();
    this.editorInit();
   
  },
  inject: ["globelDelet"],
  methods: {
    //获取地图经纬度
    getLntLat(n){
      this.lng=n.lng.toFixed(2);
      this.lat=n.lat.toFixed(2);
    },
    //保存地图获取的经纬度
    saveLngLat(){
      this.stationFormData.longitude= this.lng; // 经度
      this.stationFormData.latitude= this.lat;// 纬度
      this.dialogVisibleMap=false;
    },
    //仪器参数删除
    paramsDelet(id){
      this.globelDelet("/SiteManagement/equipment/delete",id,this.getParams);
    },
    //仪器参数批量删除
    allparamsDelet(){
      this.globelDelet("/SiteManagement/equipment/delete",this.paramsId,this.getParams);
       
    },
    //仪器参数导出
    exportedForm(){
        
      let {table} = this.$refs;
      let tableBox = table.$el;
      let header = tableBox.querySelector('.el-table__header');
      let title = '仪器参数';
      let params = {
        stationCodes:this.stationMn,
        pattern:'yyyy-MM-dd HH:mm:ss',
        headerProp:this.fieldList.join(','),
      
      };
     
      exportTableData(header,title,'','1',"/SiteManagement/exports/equipmentExcel",params);
    },
    tableChange(val){
      this.paramsId = "";
      let arr = val;
    
      for (let i in arr) {
        this.paramsId += arr[i].EQUIPMENT_ID + ",";
      }
      this.paramsId = this.paramsId.substring(
        0,
        this.paramsId.length - 1
      );
    
    },
    init() {
      //获取省份下拉框数据
      this.$http.get("/SiteManagement/area/provinceInfo").then(res => {
        if (res.data.code == 0) {
          this.provinceData = res.data.content.dataList;
        }
      });
      //获取流域下拉框数据
      let params = {
        flag: 0
      };
      this.$http.post("/SiteManagement/basinn/query").then(res => {
        if (res.data.code == 0) {
          this.basinData = res.data.content.dataList;
        }
      });
      //获取地表水类型下拉框数据
      this.$http
        .get("/SiteManagement/station/querySurfaceWaterTypes")
        .then(res => {
          if (res.data.code == 0) {
            this.surfaceWaterData = res.data.content.dataList;
          }
        });
      //获取站点分类下拉框数据
      this.$http.post("/SiteManagement/stationType/query").then(res => {
        if (res.data.code == 0) {
          this.stationTypeData = res.data.content.dataList;
        }
      });
       //获取站点类别下拉框数据
      this.$http.post("/SiteManagement/stationClassify/queryAll").then(res => {
        if (res.data.code == 0) {
          this.stationClassData = res.data.content.dataList;
        }
      });
      //获取水质目标等级下拉框数据
      this.$http.get("/SiteManagement/station/queryTargetLevel").then(res => {
        if (res.data.code == 0) {
          this.targetLevelData = res.data.content.dataList;
        }
      });
      //获取站点功能下拉框数据
      this.$http.get("/SiteManagement/station/queryFunction").then(res => {
        if (res.data.code == 0) {
          this.stationFunData = res.data.content.dataList;
        }
      });
      //获取运维单位下拉框数据
      this.$http.get("/SiteManagement/operCompany/queryAll").then(res => {
        if (res.data.code == 0) {
          this.operCompanyData = res.data.content.dataList;
        }
      });
      //获取仪器参数因子数据
      this.$http.post("/SiteManagement/index/query").then(res => {
        if (res.data.code == 0) {
          this.factorData = res.data.content.dataList;
          this.factorData.unshift({
            projectName:'全部',
            projectCode:'all'
          })
        }
      });
    },
    //省份下拉选改变时获取对应省份下城市
    provinceChange() {
      this.$http
        .get("/SiteManagement/area/areaInfo", {
          params: {
            name: this.stationFormData.provinceId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.areaData = res.data.content.dataList;
            this.stationFormData.city = "";
            this.stationFormData.areaId = "";
          }
        });
    },
    //城市地区下拉选获取焦点时判断是否有省份被选中
    areaFocus() {
      this.$refs["stationForm"].validateField("provinceId", () => {});
    },
    //页面处于编辑状态时初始化输入框下拉框赋值
    editorInit() {
      this.loading=false;
      if (this.$route.query.code == 1) {
       
        //先根据省份获取城市下拉框数据
        this.$http
          .get("/SiteManagement/area/areaInfo", {
            params: {
              name: this.$store.state.stationMessage.provinceId.areaId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.areaData = res.data.content.dataList;
              this.stationMn=this.$store.state.stationMessage.stationMn;
              this.getImages();
              this.getParams();
              //初始化表单数据
              this.stationFormData = {
                stationId:this.$store.state.stationMessage.stationId,
                stationName: this.$store.state.stationMessage.stationName, // 站点名称
                stationCode: this.$store.state.stationMessage.stationMn, // 站点编码
                stationPassworld: this.$store.state.stationMessage.stationPassworld, //密码
                provinceId:'',//所属省份
                areaId:'',//所属城市
                localManagementUnits: this.$store.state.stationMessage.localMangermnetUnits, //当地管理单位
                basinId:'',//所属流域
                stationRiver: this.$store.state.stationMessage.stationRiver, //所属河流
                stationType:'',//站点分类
                surfaceWaterTypes: this.$store.state.stationMessage.suifaceWaterTypes, //地表水类型
                targetLevel: this.$store.state.stationMessage.targerWaterQuality, //水质目标级别
                stationClassify: "", //站点类别
                longitude: this.$store.state.stationMessage.longitude, // 经度
                latitude: this.$store.state.stationMessage.latitude, // 纬度
                sort: this.$store.state.stationMessage.sort, //排序
                stationProvincesUpDown: this.$store.state.stationMessage.stationProvincesUpDown, //上下游省份
                enabled: this.$store.state.stationMessage.enabled+'', //是否验收1是0否
                enabledTime: new Date(this.$store.state.stationMessage.enableTime).format('yyyy-MM-dd hh:mm:ss'), //验收时间
                city:'',//考核城市
                operCompanyCode:this.$store.state.stationMessage.operCompanyId,//运维单位
                stationProperty: this.$store.state.stationMessage.stationProperty, //站点属性
                stationFunction: this.$store.state.stationMessage.stationFunction, //站点功能
                stationAddress: this.$store.state.stationMessage.stationAddress, //站点地址
                stationBriefInfo: this.$store.state.stationMessage.stationBriefInfo, //站点简介
                peripheralHistory: this.$store.state.stationMessage.peripheralHistory,//周边历史文化
                dataFrequency:'',
                freUnit:'',//数据发送频率单位
                freNumber:'',
                projectCodesArr:[],
              };
              if(this.$store.state.stationMessage.dataFrequency){
                let str=this.$store.state.stationMessage.dataFrequency;
                this.stationFormData.freNumber=str.substr(0,1);
                this.stationFormData.freUnit=str.substr(str.length-1,1);
              }
             
              if (this.$store.state.stationMessage.provinceId) {
                this.stationFormData.provinceId = this.$store.state.stationMessage.provinceId.areaId; //所属省份
              }
              if (this.$store.state.stationMessage.area) {
                this.stationFormData.areaId = this.$store.state.stationMessage.area.areaId; //所属城市
              }
              if (this.$store.state.stationMessage.basinn) {
                this.stationFormData.basinId = this.$store.state.stationMessage.basinn.basinnId; //所属流域
              }
              if (this.$store.state.stationMessage.stationType) {
                this.stationFormData.stationType = this.$store.state.stationMessage.stationType.stationTypeId; //站点分类
              }
             
              if (this.$store.state.stationMessage.cityId) {
                this.stationFormData.city = this.$store.state.stationMessage.cityId.areaId; //考核城市
              }
              if (this.$store.state.stationMessage.stationClassify) {
                this.stationFormData.stationClassify = this.$store.state.stationMessage.stationClassify.stationClassifyId; //考核城市
              }
              if(this.$store.state.stationMessage.projects && this.$store.state.stationMessage.projects.length>0){
                let fArr = this.$store.state.stationMessage.projects;
                this.stationFormData.projectCodesArr=[]
                for(let i in fArr){
                   this.stationFormData.projectCodesArr.push(fArr[i].projectCode)
                }
              
                if(fArr.length == this.factorData.length-1){
                    this.stationFormData.projectCodesArr.unshift('all')
                }
              }
            }
           
          });
      }
    },
    selectChange(val){
     
      for(let i in this.factorData){
        if(this.factorData[i].projectCode == val){
            this.equipPlaceholder= this.factorData[i].projectName +"水质自动分析仪+仪器型号"
        }
      }
        
    },
    //仪器参数保存
    saveParamsForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
           
             if(this.stationMn == ""){
                this.$message({
                  message:'请先新增站点再进行操作',
                  type: 'warning',
                  duration:1500,
                });
             }else{
                  let params={};
                  params.projectCode=this.paramsForamData.projectCode;
                  params.manufactor=this.paramsForamData.manufactor;
                  params.equipmentModel=this.paramsForamData.equipmentModel;
                  params.equipmentName=this.paramsForamData.equipmentName;
                  params.analyticalMethods=this.paramsForamData.analyticalMethods;
                  params.equipmentOrange=this.paramsForamData.equipmentOrange;
                  params.detectionLimit=this.paramsForamData.detectionLimit;
                  params.upperLimit=this.paramsForamData.upperLimit;
                  params.lowerLimit=this.paramsForamData.lowerLimit;
                  params.manufactureCode=this.paramsForamData.manufactureCode;
                  params.createTime=this.paramsForamData.createTime;
                  params.isenable=this.paramsForamData.isenable;
                  params.reagent=this.paramsForamData.reagent;
                  params.id=this.paramsForamData.id
                  params.stationMn=this.stationMn;
                  this.$http.post("/SiteManagement/equipment/addOrEdit",params).then(res=>{
                         if(res.data.code == 0){
                                this.$message({
                                  message:res.data.message,
                                  type: 'success',
                                  duration:1500,
                                });
                                this.visiDialog=false;
                               
                                this.cancelParams(formName);
                                this.getParams();
                         }
                  })
             }
          } else {
           
            return false;
          }
        });
    },
    //仪器参数编辑
    editorParams(obj){
      this.visiDialog=true;
       this. paramsForamData={
        projectCode:obj.PROJECT_CODE,//因子参数Code
        manufactor:obj.MANUFACTOR,//厂家名称
        equipmentModel:obj.EQUIPMENT_MODEL,//仪器型号
        equipmentName:obj.EQUIPMENT_NAME,//仪器设备
        analyticalMethods:obj.ANALY_METHONS,//分析方法
        equipmentOrange:obj.EQUIPMENT_ORANGE,//仪器量程
        detectionLimit:obj.DETECTION_LIMIT,//检出限
        upperLimit:obj.UPPER_LIMIT,//上限值
	      lowerLimit:obj.LOWER_LIMIT,//下限值
        manufactureCode:obj.MANUFACTURE_CODE,//出厂编号
        createTime:new Date(obj.CREATE_TIME).format('yyyy-MM-dd hh:mm:ss'),//安装时间
        isenable:obj.ISENABLE,//是否启用
        reagent:obj.REAGENT,//试剂
        id:obj.ID,//仪器参数Id
      }
    },
    factorChange(v){
       let arr=[];
      
       if(v == 'all'){
         
         for(let i=0;i<this.factorData.length;i++){
          
            arr.push(this.factorData[i].projectCode)
         }
         this.stationFormData.projectCodesArr=arr
       }
      
    },
    //仪器参数新增弹框
    addParams(){
        this.visiDialog=true;
         this.paramsForamData.id='';
    },
    //取消保存参数
    cancelParams(formName){
      this.visiDialog=false;
      this.resetForm(formName);
   
        this.paramsForamData.projectCode='';//因子参数Code
        this.paramsForamData.manufactor='';//厂家名称
        this.paramsForamData.equipmentModel='';//仪器型号
        this.paramsForamData.equipmentName='';//仪器设备
        this.paramsForamData.analyticalMethods='';//分析方法
        this.paramsForamData.equipmentOrange='';//仪器量程
        this.paramsForamData.detectionLimit='';//检出限
        this.paramsForamData.upperLimit='';//上限值
	      this.paramsForamData.lowerLimit='';//下限值
        this.paramsForamData.manufactureCode='';//出厂编号
        this.paramsForamData.createTime='';//安装时间
        this.paramsForamData.isenable='0';//是否启用
        this.paramsForamData.reagent='';//试剂
        
     
    },
    //表单重置
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    bl(activeName, oldActiveName) {
      // console.log(activeName)
      //  if(activeName == 1 || activeName == 2){
      //    return false;
      //  }
    },
    uploadFile(files) {
      
      
    },
    upload(name) {
      this.visiDialogImg=true;
      this.imgType=name;
      
      //外景图片上传
     
      if(name == 'out'){
        this.vTitle='外景图片上传';
       
      }else if(name == 'inside'){
         this.vTitle='内景图片上传';
      }else if(name == 'build'){
         this.vTitle='建设图片上传';
       
      }
     
    },//打开图片上传弹框
    uploadImg(){
      let formData = new FormData();
      formData.append('mn',this.stationMn);
      for(let i in this.file){
        formData.append('files',this.file[i].raw)
      }
      formData.append('type',this.imgType);
      let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
      };
      this.$http.post("/SiteManagement/station/addImage", formData, config).then(res=>{
        this.file=[];
        this.fileList=[]
          this.visiDialogImg=false;
          this.getImages();
      })
    },//确定上传图片
    //获取页面图片信息
    getImages(){
        this.$http
            .get("/SiteManagement/station/queryImage", {
              params:{
                mn:this.stationMn
              }
            })
            .then(res=>{
                let list = res.data.content.dataList;
                this.outfileListPre=[];
                this.insidefileListPre=[];
                this.buildfileListPre=[];
                for(let i =0;i<list.length;i++){
                 
                  if(list[i].type == 'OUT_IMAGE'){
                     
                     for(let j=0;j< list[i].path.length;j++){
                        this.outfileListPre.push({
                          name:list[i].type,
                          url:'http://120.77.41.22:61007/SiteManagement-Service/image/'+list[i].path[j]
                        })
                     }
                  }else if(list[i].type == 'INSIDE_IMAGE'){
                     for(let j=0;j< list[i].path.length;j++){
                        this.insidefileListPre.push({
                          name:list[i].type,
                          url:'http://120.77.41.22:61007/SiteManagement-Service/image/'+list[i].path[j]
                        })
                     }
                  }else if(list[i].type == 'BUILD_IMAGE'){
                     for(let j=0;j< list[i].path.length;j++){
                        this.buildfileListPre.push({
                          name:list[i].type,
                          url:'http://120.77.41.22:61007/SiteManagement-Service/image/'+list[i].path[j]
                        })
                     }
                  }
                };
            })
    },
    //获取当前站点仪器参数
    getParams(){
      this.loading=true;
        this.$http.get("/SiteManagement/equipment/queryInstrumentParameters",{
          params:{
            stationCodes:this.stationMn,
            pageNumber:this.currentPage,
            pageSize:this.pageSize,
          }
        }).then(res=>{
           if(res.data.code == 0){
               this.tableData=res.data.content.dataList;
               this.total=res.data.content.totalRecords;
               this.loading=false;
           }
        })
    },
    //外景图片上传组件改变
    fileChange(file, fileList){
      this.file = fileList;
    },
    //内景图片上传组件改变
    insidefileChange(file, fileList){
      this.insidefile = fileList;
    },
    //建设图片上传组件改变
    buildfileChange(file, fileList){
      this.buildfile = fileList;
    },

    handleRemove(file, fileList) {
     
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    indexMethod(index) {
      return index + 1;
    },
    search(callback) {},
    closess(done) {
      done();
    },
    //保存站点信息
    submitSites(formName) {
     this.stationFormData.projectCodes=this.stationFormData.projectCodesArr.join(',')
        
        
       
      this.$refs[formName].validate(valid => {
        if (valid) {
         
          for(let i in this.operCompanyData){
            if(this.operCompanyData[i].operCompanyId == this.stationFormData.operCompanyCode){
                this.stationFormData.operCompanyName=this.operCompanyData[i].operCompanyName
            }
          };
          this.stationFormData.dataFrequency=this.stationFormData.freNumber+this.stationFormData.freUnit;
          let  str = this.stationFormData.projectCodesArr;
         if(str.indexOf('all') >0){
            str.splice(str.indexOf('all'),1);
         }
          this.stationFormData.projectCodes=str.join(',');
          this.$http.post("/SiteManagement/station/editOrAdd", this.stationFormData).then(res => {
               this.$message({
                  message:res.data.message,
                  type: 'success',
                  duration:1500,
                });
               this.stationMn=res.data.content.info[0].stationMn;
               this.stationFormData.stationId=res.data.content.info[0].stationId;
          });
          
        } else {
          return false;  
        }
      });
    },
    //新增站点
    additionalSites() {},
    checkedNode(val) {}
  },
  computed: {
    stationInfo: {
      get: function() {
        return this.$store.state.stationInfo;
      }
    },
    totalPageNumber() {
      //计算总页数
      let number = 0;
      number = Math.ceil(this.total / this.pageSize);
      return number;
    }
  },

  watch: {
    stationInfo: function(newValue, oldValue) {
      // if(newValue[0].label != oldValue[0].label){
      //    console.log(newValue[0].label)
      // }
      // console.log(newValue[0].label);
    }
  },
  components:{
    mapComp
  }
};
</script>

<style scoped lang="less">
.historypage {
  height: 100%;
}

.edui-editor {
  background: #fff;
}
.baseinfo {
  padding: 12px;
  width: 1020px;
  margin: 0 auto;
  li {
    margin-bottom: 20px;
    .layoutspan {
      width: 120px;
      i {
        color: red;
        margin-right: 4px;
      }
    }
    .sousuo {
      cursor: pointer;
      display: inline-block;
      width: 34px;
      height: 30px;
      vertical-align: -2px;
      line-height: 30px;
      text-align: center;
    }
  }
}
.stationManage {
  .uploadImg {
    li {
      padding-left: 20px;
      margin-bottom: 12px;
      p {
        height: 32px;
        font-size: 16px;
        position: relative;
        &:before {
          content: "";
          width: 3px;
          height: 10px;
          background: #166bce;
          position: absolute;
          left: -10px;
          top: 5px;
        }
      }
    }
  }
}
.uploadBtnBox {
  margin-bottom: 32px;
  padding: 8px 0px 0px 8px;
  > span {
    color: rgba(153, 153, 153, 1);
  }
}
.layoutspan{
  width: 80px;
}
</style>
