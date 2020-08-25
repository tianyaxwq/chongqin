import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "登录",
      meta: {
        keepAlive: false
      },
      component: resolve => require(["@/views/login/login"], resolve)
    },
    {
      path: "/",
      name: "首页",
      meta: {
        keepAlive: false
      },
      redirect: "/home",
    },
    {
      path: "/home",
      name: "首页",
      redirect: "/gismap",
      component: resolve => require(["@/views/home/home"], resolve),
      children: [
        {
          path: "/gismap",
          name: "GIS一张图",
          meta: {
            noStationcode: true,
            haveTree: "not"
          },
          component: resolve => require(["@/views/home/gisMap"], resolve),
          children: []
        },
        {
          path: "/tranceSource",
          name: "溯源分析",
          meta: {
            noStationcode: true,
            haveTree: "not"
          },
          component: resolve => require(["@/views/home/tranceSource"], resolve),
          children: []
        },
        //系统管理
        {
          path: "/systemManage",
          name: "系统管理",
          component: resolve =>
            require(["@/views/systemManage/index"], resolve),
          children: [
            {
              path: "/systemManage/baseMes",
              name: "基础信息",
              component: resolve =>
                require(["@/views/systemManage/index"], resolve),
              children: [
                {
                  path: "/systemManage/baseMes/areaManage",
                  name: "行政区划",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/areaManageNew"], resolve)
                },
                {
                  path: "/systemManage/baseMes/stationList",
                  name: "测站信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/stationListNew"], resolve)
                }
              ]
            },
            {
              path: "/systemManage/dictionary",
              name: "数据字典",
              component: resolve =>
                require(["@/views/systemManage/index"], resolve),
              children: [
                {
                  path: "/systemManage/dictionary/waterManege",
                  name: "流域管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/waterManege"], resolve)
                },
                {
                  path: "/systemManage/dictionary/areaMange",
                  name: "区域管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/areaManage"], resolve)
                },
                {
                  path: "/systemManage/dictionary/stationType",
                  name: "站点类别",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/stationType"], resolve)
                },
                {
                  path: "/systemManage/dictionary/stationClass",
                  name: "站点分类",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/stationClass"], resolve)
                },
                {
                  path: "/systemManage/dictionary/factorManage",
                  name: "因子管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/factorManage"], resolve)
                }
              ]
            },
            {
              path: "/systemManage/sysSet",
              name: "系统设置",
              component: resolve =>
                require(["@/views/systemManage/index"], resolve),
              children: [
                {
                  path: "/systemManage/sysSet/userManage",
                  name: "用户管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/userManage"], resolve)
                },
                {
                  path: "/systemManage/sysSet/platformManage",
                  name: "平台管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/platformManage"], resolve)
                },
                {
                  path: "/systemManage/sysSet/roleManage",
                  name: "角色管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/roleManage"], resolve)
                },
                {
                  path: "/systemManage/sysSet/menuManage",
                  name: "功能菜单管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/menuManage"], resolve)
                },
                {
                  path: "/systemManage/sysSet/journalManage",
                  name: "日志管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/journalManage"], resolve)
                }
              ]
            },
            {
              path: "/systemManage/mesManage",
              name: "基础信息管理",
              component: resolve =>
                require(["@/views/systemManage/index"], resolve),
              children: [
                {
                  path: "/systemManage/mesManage/stationManage",
                  name: "测站新增",
                  meta: {
                    noStationcode: true,
                    singleSelect: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/stationManage"], resolve)
                },
                {
                  path: "/systemManage/mesManage/stationList",
                  name: "测站信息管理",
                  meta: {
                    noStationcode: true,
                    singleSelect: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/stationList"], resolve)
                },
                {
                  path: "/systemManage/mesManage/messageSet",
                  name: "监测项目信息设置",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/messageSet"], resolve)
                },
                {
                  path: "/systemManage/mesManage/waterEvaluate",
                  name: "水质类别评价标准",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/waterEvaluate"], resolve)
                },
                {
                  path: "/systemManage/mesManage/agreeManage",
                  name: "协议管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/agreeManage"], resolve)
                },
                {
                  path: "/systemManage/mesManage/instrucManage",
                  name: "指令管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/instrucManage"], resolve)
                },
                {
                  path: "/systemManage/mesManage/processManage",
                  name: "流程管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/systemManage/processManage"], resolve)
                },
                {
                  path: "/systemManage/mesManage/dischargeWaterSite",
                  name: "废水排口管理",
                  meta: {
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/systemManage/dischargeWaterSite"
                    ], resolve)
                }
              ]
            }
          ]
        },
        //数据采集
        {
          path: "/dataCollection",
          name: "监测监控",
          component: resolve => require(["@/views/dataCollection/index"], resolve),
          children: [
            {
              // path: '/dataCollection/dataAggre',
              // name: '数据汇总',
              // component: resolve => require(['@/views/dataCollection/index'], resolve),
              path: "/dataCollection/dataAggre/index",
              redirect: "/dataCollection/dataAggre/currentData",
              name: "实时数据",
              component: resolve =>
                require(["@/views/dataCollection/index"], resolve),
              children: [
                {
                  path: "/dataCollection/dataAggre/currentData",
                  name: "实时数据",
                  meta: {
                    singleSelect: false,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/currentData"], resolve)
                },
                {
                  path: "/dataCollection/dataAggre/flowCurrent",
                  name: "流量计",
                  meta: {
                    singleSelect: false,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/flowCurrent"], resolve)
                }
              ]
            },
            {
              path: "/dataCollection/dataAggre/historyData",
              name: "历史数据",
              redirect: "/dataCollection/dataAggre/historyData",
              component: resolve =>
                require(["@/views/dataCollection/index"], resolve),
              children: [
                {
                  path: "/dataCollection/dataAggre/historyData",
                  name: "历史数据",
                  meta: {
                    singleSelect: true,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/historyData"], resolve)
                },
                {
                  path: "/dataCollection/dataAggre/flowHisData",
                  name: "流量计",
                  meta: {
                    singleSelect: true,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/flowHisData"], resolve)
                }
              ]
            },
            {
              path: "/dataCollection/alarm",
              name: "报警管控",
              component: resolve => require(["@/views/dataCollection/index"], resolve),
              children: [
                {
                  path: "/dataCollection/alarm/realTimeAlarm",
                  name: "实时报警",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/realTimeAlarm"], resolve)
                },
                {
                  path: "/dataCollection/alarm/alarmAnalysis",
                  name: "报警分析",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/alarmAnalysis"], resolve)
                },
                {
                  path: "/dataCollection/alarm/historicalAlarm",
                  name: "历史报警",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/historicalAlarm"], resolve)
                },
                {
                  path: "/dataCollection/alarm/alarmHandle",
                  name: "报警处理",
                  meta: {
                    haveTree: "not",
                    noStationcode: true,
                    singleSelect: true
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/alarmHandle"], resolve)
                }
              ]
            },
            {
              path: "/dataCollection/dataAggre/manualDataEntry",
              name: "数据录入",
              component: resolve => require(["@/views/dataCollection/manualDataEntry"], resolve),
              children: [
                {
                  path: "/dataCollection/dataAggre/manualDataEntry",
                  name: "国控手工点数据录入",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/dataCollection/manualDataEntry"], resolve)
                }
              ]
            }
            // {
            //     path: '/dataCollection/statusAnal',
            //     name: '统计分析',
            //     component: resolve => require(['@/views/dataCollection/index'], resolve),
            //     children: [
            //         {
            //             path: '/dataCollection/statusAnal/waterQuality',
            //             name: '水质量',
            //             meta: {
            //                 keepAlive: false,
            //                 noStationcode: true,
            //                 haveTree: 'not',
            //             },
            //             component: resolve => require(['@/views/dataCollection/waterQuality'], resolve),
            //         },

            //         {
            //             path: '/dataCollection/statusAnal/stationOnline',
            //             name: '站点在线率',
            //             meta: {
            //                 keepAlive: false,
            //                 noStationcode: true,
            //                 haveTree: 'not',

            //             },
            //             component: resolve => require(['@/views/dataCollection/stationOnline'], resolve),
            //         }
            //     ]
            // }
          ]
        },
        // 报告管理
        {
          path: "/reportManage",
          name: "报告管理",
          component: resolve =>
            require(["@/views/reportManage/index"], resolve),
          children: [
            {
              path: "/reportManage/siteMonitoring",
              name: "站点监测报告",
              component: resolve =>
                require(["@/views/reportManage/siteMonitoring"], resolve),
              children: [
                {
                  path: "/reportManage/siteMonitoring",
                  name: "站点监测报告",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require(["@/views/reportManage/siteMonitoring"], resolve)
                }
              ]
            },
            {
              path: "/reportManage/siteAssessment",
              name: "站点考核报告",
              component: resolve =>
                require(["@/views/reportManage/siteAssessment"], resolve),
              children: [
                {
                  path: "/reportManage/siteAssessment",
                  name: "站点考核报告",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require(["@/views/reportManage/siteAssessment"], resolve)
                }
              ]
            },
            {
              path: "/reportManage/exceedingStandard",
              name: "事件超标报告",
              component: resolve =>
                require(["@/views/reportManage/exceedingStandard"], resolve),
              children: [
                {
                  path: "/reportManage/exceedingStandard",
                  name: "事件超标报告",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require(["@/views/reportManage/exceedingStandard"], resolve)
                }
              ]
            },
            {
              path: "/reportManage/regionalAnalysis",
              name: "区域分析报告",
              component: resolve =>
                require(["@/views/reportManage/regionalAnalysis"], resolve),
              children: [
                {
                  path: "/reportManage/regionalAnalysis",
                  name: "区域分析报告",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/reportManage/regionalAnalysis"], resolve)
                }
              ]
            }
          ]
        },
        // 统计分析
        {
          path: "/colligateApplication",
          name: "统计分析",
          component: resolve =>
            require(["@/views/colligateApplication/index"], resolve),
          children: [
            {
              path: "/colligateApplication/calendar",
              name: "水质日历分布",
              component: resolve =>
                require(["@/views/colligateApplication/index"], resolve),
              children: [
                {
                  path: "/colligateApplication/calendar/yearCalendar",
                  name: "站点水质年历图",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/yearCalendar"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/calendar/monthCalendar",
                  name: "站点水质月历图",
                  meta: {
                    haveTree: "have",
                    singleSelect: false
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/monthCalendar"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/calendar/dayCalendar",
                  name: "站点水质日历图",
                  meta: {
                    haveTree: "have",
                    singleSelect: false
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/dayCalendar"
                    ], resolve)
                }
              ]
            },
            {
              path: "/colligateApplication/datacanvas",
              name: "数据图表",
              component: resolve =>
                require(["@/views/colligateApplication/index"], resolve),
              children: [
                {
                  path: "/colligateApplication/datacanvas/multtrendChange",
                  name: "断面多参数趋势变化",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/multtrendChange"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/datacanvas/multiSection",
                  name: "多断面单参数趋势变化",
                  meta: {
                    haveTree: "have",
                    singleSelect: false
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/multiSection"
                    ], resolve)
                },
                // {
                //     path: '/colligateApplication/datacanvas/paramBlockdiagram',
                //     name: '断面单参数区块图',
                //     meta: {
                //         haveTree: 'have',
                //         singleSelect: true,
                //     },
                //     component: resolve => require(['@/views/colligateApplication/paramBlockdiagram'], resolve),
                // },
                // {
                //     path: '/colligateApplication/datacanvas/paramScatterplot',
                //     name: '断面单参数散点图',
                //     meta: {
                //         haveTree: 'have',
                //         singleSelect: true,
                //     },
                //     component: resolve => require(['@/views/colligateApplication/paramScatterplot'], resolve),
                // },

                {
                  path: "/colligateApplication/datacanvas/singletrendChange",
                  name: "断面单参数趋势变化",
                  meta: {
                    haveTree: "have",
                    singleSelect: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/singletrendChange"
                    ], resolve)
                }
                // {
                //     path: '/colligateApplication/datacanvas/trendAnalysis',
                //     name: '同比环比趋势分析',
                //     meta: {
                //         haveTree: 'have',
                //         singleSelect: true,
                //     },
                //     component: resolve => require(['@/views/colligateApplication/trendAnalysis'], resolve),
                // },
              ]
            },
            {
              path: "/colligateApplication/datatable",
              name: "数据报表",
              component: resolve =>
                require(["@/views/colligateApplication/index"], resolve),
              children: [
                //     {
                //     path: '/colligateApplication/datatable/scopeStatistics',
                //     name: '水质评价范围统计',
                //     meta: {
                //         haveTree: 'not',
                //     },
                //     component: resolve => require(['@/views/colligateApplication/scopeStatistics'], resolve),
                // }, {
                //     path: '/colligateApplication/datatable/faultStatis',
                //     name: '故障情况统计',
                //     meta: {
                //         haveTree: 'not',
                //     },
                //     component: resolve => require(['@/views/colligateApplication/faultStatis'], resolve),
                // },
                {
                  path:
                    "/colligateApplication/datatable/waterqualityStatistics",
                  name: "断面时段水质统计",
                  meta: {
                    singleSelect: true,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterqualityStatistics"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/datatable/singleStationReport",
                  name: "自动站单站报表",
                  meta: {
                    singleSelect: true,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/singleStationReport"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/datatable/multiStationReport",
                  name: "自动站多站报表",
                  meta: {
                    singleSelect: false,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/multiStationReport"
                    ], resolve)
                },
                {
                  path:
                    "/colligateApplication/datatable/multiStationPresentation",
                  name: "自动站多站报告",
                  meta: {
                    singleSelect: true,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/multiStationPresentation"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/datatable/waterQualityBulletin",
                  name: "地表水水质公报",
                  meta: {
                    singleSelect: false,
                    noStationcode: true,
                    haveTree: "have",
                    strictly: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterQualityBulletin"
                    ], resolve)
                },
                // {
                //     path: '/dataCollection/statusAnal/waterQuality',
                //     name: '水质分析报表',
                //     meta: {
                //         keepAlive: false,
                //         noStationcode: true,
                //         haveTree: 'not',
                //     },
                //     component: resolve => require(['@/views/dataCollection/waterQuality'], resolve),
                // },
                // {
                //     path: '/dataCollection/statusAnal/stationOnline',
                //     name: '站点在线率报表',
                //     meta: {
                //         singleSelect: true,
                //         haveTree: 'have',
                //     },
                //     component: resolve => require(['@/views/dataCollection/stationOnline'], resolve),
                // },
                {
                  path: "/dataCollection/statusAnal/automaticMonitoring",
                  name: "水质自动监测报表",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/dataCollection/automaticMonitoring"
                    ], resolve)
                },
                {
                  path: "/colligateApplication/datatable/dataReportAnalysis",
                  name: "数据对比分析",
                  meta: {
                    singleSelect: false,
                    haveTree: "have"
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/dataReportAnalysis"
                    ], resolve)
                }
              ]
            },
            {
              path: "/colligateApplication/datatable",
              name: "预警分析",
              component: resolve =>
                require(["@/views/colligateApplication/index"], resolve),
              children: [
                {
                  path: "/colligateApplication/datatable/newPage",
                  name: "预警分析",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/colligateApplication/newPage"], resolve)
                }
              ]
            },
            {
              path: "/colligateApplication/analysisReport",
              name: "综合分析报表",
              component: resolve =>
                require(["@/views/colligateApplication/index"], resolve),
              children: [
                {
                  path:
                    "/colligateApplication/analysisReport/waterQualityEvaluation",
                  name: "水质评价",
                  meta: {
                    singleSelect: false,
                    noStationcode: true,
                    haveTree: "have",
                    strictly: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterQualityEvaluation"
                    ], resolve)
                },
                {
                  path:
                    "/colligateApplication/analysisReport/waterQualityEvaluationD",
                  name: "站点水质评价",
                  meta: {
                    singleSelect: false,
                    haveTree: "have",
                    strictly: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterQualityEvaluationD"
                    ], resolve)
                },
                {
                  path:
                    "/colligateApplication/analysisReport/waterQualityEvaluationA",
                  name: "区域水质评价",
                  meta: {
                    singleSelect: false,
                    haveTree: "have",
                    strictly: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterQualityEvaluationA"
                    ], resolve)
                },
                {
                  path:
                    "/colligateApplication/analysisReport/waterQualityEvaluationC",
                  name: "流域水质评价",
                  meta: {
                    singleSelect: false,
                    haveTree: "have",
                    strictly: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterQualityEvaluationC"
                    ], resolve)
                },
                {
                  path:
                    "/colligateApplication/analysisReport/waterContrastAnalysis",
                  name: "水质现状对比分析",
                  meta: {
                    singleSelect: false,
                    noStationcode: true,
                    haveTree: "have",
                    strictly: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/waterContrastAnalysis"
                    ], resolve)
                },
                {
                  path:
                    "/colligateApplication/analysisReport/comparisonAnalysisRates",
                  name: "两率对比分析",
                  meta: {
                    singleSelect: false,
                    noStationcode: true,
                    haveTree: "have",
                    strictly: true,
                    stationDisable: true
                  },
                  component: resolve =>
                    require([
                      "@/views/colligateApplication/comparisonAnalysisRates"
                    ], resolve)
                }
              ]
            }
            // {
            //     path: '/colligateApplication/archivesManage',
            //     name: '档案管理',
            //     component: resolve => require(['@/views/colligateApplication/index'], resolve),
            //     children: [{
            //         path: '/colligateApplication/archivesManage/stationArchives',
            //         name: '一站一档',
            //         meta: {
            //             singleSelect: true,
            //             haveTree: 'have',
            //         },
            //         component: resolve => require(['@/views/colligateApplication/stationArchives'], resolve),
            //     }, {
            //         path: '/colligateApplication/archivesManage/personArchives',
            //         name: '一员一档',
            //         meta: {
            //             noStationcode: true,
            //             singleSelect: true,
            //             haveTree: 'have',
            //         },
            //         component: resolve => require(['@/views/colligateApplication/personArchives'], resolve),
            //     },]
            // }
          ]
        },
        //水污染防治管理
        {
          path: "/waterPollution",
          name: "水污染防治",
          meta: {
            keepAlive: false
          },
          component: resolve =>
            require(["@/views/waterPollution/index"], resolve),
          children: [
            {
              path: "/waterPollution/accountManagement",
              name: "台账管理",
              component: resolve =>
                require([
                  "@/views/waterPollution/accountManagement/index"
                ], resolve),
              children: [
                {
                  path:
                    "/waterPollution/accountManagement/keyPollutionDischarge",
                  name: "重点排污单位基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/keyPollutionDischarge"
                    ], resolve)
                },
                {
                  path:
                    "/waterPollution/accountManagement/sewageTreatmentPlant",
                  name: "污水处理厂基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/sewageTreatmentPlant"
                    ], resolve)
                },
                {
                  path:
                    "/waterPollution/accountManagement/agricultureAreaSource",
                  name: "农业面源基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/agricultureAreaSource"
                    ], resolve)
                },
                {
                  path: "/waterPollution/accountManagement/shipTerminal",
                  name: "船舶码头基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/shipTerminal"
                    ], resolve)
                },
                {
                  path: "/waterPollution/accountManagement/pollutantPond",
                  name: "纳污塘坑基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/pollutantPond"
                    ], resolve)
                },
                {
                  path: "/waterPollution/accountManagement/riverLake",
                  name: "河湖长基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/riverLake"
                    ], resolve)
                },
                {
                  path: "/waterPollution/accountManagement/drinkingWaterSource",
                  name: "饮用水源地基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/drinkingWaterSource"
                    ], resolve)
                },
                {
                  path: "/waterPollution/accountManagement/governProject",
                  name: "治理工程基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/accountManagement/governProject"
                    ], resolve)
                },
                {
                  path: "/waterPollution/IndRegul/companyDetail",
                  name: "重点排污企业详情",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/IndRegul/companyDetail"
                    ], resolve)
                }
              ]
            },
            {
              path: "/waterPollution/IndRegul",
              name: "重点行业整治",
              component: resolve =>
                require(["@/views/waterPollution/IndRegul/index"], resolve),
              children: [
                {
                  path: "/waterPollution/IndRegul/indusManage",
                  name: "行业管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/IndRegul/indusManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/IndRegul/techManage",
                  name: "生产技术方案管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/IndRegul/techManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/IndRegul/enterInfoManage",
                  name: "企业信息管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/IndRegul/enterInfoManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/IndRegul/enterInfo",
                  name: "编辑企业信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/IndRegul/enterInfo"
                    ], resolve)
                }
              ]
            },
            {
              path: "/waterPollution/preventManage",
              name: "农业农村污染防治管理",
              component: resolve =>
                require([
                  "@/views/waterPollution/preventManage/index"
                ], resolve),
              children: [
                {
                  path: "/waterPollution/preventManage/farmManage",
                  name: "养殖场信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/preventManage/farmManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/preventManage/thousTon",
                  name: "千吨万人",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/preventManage/thousTon"
                    ], resolve)
                }
              ]
            },
            {
              path: "/waterPollution/shipManage",
              name: "船舶码头污染管理",
              component: resolve =>
                require(["@/views/waterPollution/shipManage/index"], resolve),
              children: [
                {
                  path: "/waterPollution/shipManage/shipManage",
                  name: "船舶管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/shipManage/shipManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/shipManage/garbageManage",
                  name: "垃圾管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/shipManage/garbageManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/shipManage/emergency",
                  name: "应急管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/shipManage/emergency"
                    ], resolve)
                }
              ]
            },
            {
              path: "/waterPollution/pondManage",
              name: "纳污坑塘专项管理",
              component: resolve =>
                require(["@/views/waterPollution/pondManage/index"], resolve),
              children: [
                {
                  path: "/waterPollution/pondManage/urgentManage",
                  name: "应急管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/pondManage/urgentManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/pondManage/mesFill",
                  name: "纳污坑塘信息填报",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/pondManage/mesFill"
                    ], resolve)
                },
                {
                  path: "/waterPollution/pondManage/historyMes",
                  name: "历史填报信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/pondManage/historyMes"
                    ], resolve)
                },
                {
                  path: "/waterPollution/pondManage/mesAudit",
                  name: "信息审核",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/pondManage/mesAudit"
                    ], resolve)
                },
                {
                  path: "/waterPollution/pondManage/sendMes",
                  name: "发布信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/pondManage/sendMes"
                    ], resolve)
                },
                {
                  path: "/waterPollution/pondManage/dataManage",
                  name: "数据管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/pondManage/dataManage"
                    ], resolve)
                }
              ]
            },
            {
              path: "/waterPollution/riverManage",
              name: "河湖长信息管理",
              component: resolve =>
                require(["@/views/waterPollution/riverManage/index"], resolve),
              children: [
                {
                  path: "/waterPollution/riverManage/gridManage",
                  name: "网格管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/riverManage/gridManage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/riverManage/eventManage",
                  name: "事件管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/riverManage/eventManage"
                    ], resolve)
                },
                // {
                //     path: '/waterPollution/riverManage/taskManage',
                //     name: '任务管理',
                //     meta: {
                //         keepAlive: false,
                //         noStationcode: true,
                //         haveTree: 'not',
                //     },
                //     component: resolve => require(['@/views/waterPollution/riverManage/taskManage'], resolve),
                // },
                {
                  path: "/waterPollution/riverManage/rivermanageMessage",
                  name: "河湖长基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/riverManage/rivermanageMessage"
                    ], resolve)
                },
                {
                  path: "/waterPollution/riverManage/riverMes",
                  name: "河流基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/riverManage/riverMes"
                    ], resolve)
                },
                {
                  path: "/waterPollution/riverManage/lakMes",
                  name: "湖泊基本信息",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/riverManage/lakMes"
                    ], resolve)
                }
              ]
            },
            {
              path: "/waterPollution/governProjectManager",
              name: "工程管理",
              component: resolve =>
                require([
                  "@/views/waterPollution/governProjectManager"
                ], resolve),
              children: [
                {
                  path: "/waterPollution/governProjectManager",
                  name: "工程管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/waterPollution/governProjectManager"
                    ], resolve)
                }
              ]
            }
          ]
        },
        //饮用水源管理
        {
          path: "/drinkingWater",
          name: "饮用水源管理",
          meta: {
            keepAlive: false
          },
          component: resolve =>
            require(["@/views/drinkingWater/index"], resolve),
          children: [
            {
              path: "/drinkingWater/baseMesManage",
              name: "基本信息管理",
              component: resolve =>
                require(["@/views/drinkingWater/baseMesManage"], resolve),
              children: [
                {
                  path: "/drinkingWater/baseMesManage",
                  name: "基本信息管理",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/drinkingWater/baseMesManage"], resolve)
                }
              ]
            },
            {
              path: "/drinkingWater/monitorDataFill",
              name: "手工监测数据填报",
              component: resolve =>
                require(["@/views/drinkingWater/monitorDataFill"], resolve),
              children: [
                {
                  path: "/drinkingWater/monitorDataFill",
                  name: "手工监测数据填报",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/drinkingWater/monitorDataFill"], resolve)
                }
              ]
            },
            {
              path: "/drinkingWater/waterStatisReport",
              name: "饮用水源统计报告",
              component: resolve =>
                require(["@/views/drinkingWater/waterStatisReport"], resolve),
              children: [
                {
                  path: "/drinkingWater/waterStatisReport",
                  name: "饮用水源统计报告",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require([
                      "@/views/drinkingWater/waterStatisReport"
                    ], resolve)
                }
              ]
            },
            {
              path: "/drinkingWater/waterMonitor",
              name: "水质监测",
              component: resolve =>
                require(["@/views/drinkingWater/waterMonitor"], resolve),
              children: [
                {
                  path: "/drinkingWater/waterMonitor",
                  name: "水质监测",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/drinkingWater/waterMonitor"], resolve)
                }
              ]
            },
            {
              path: "/drinkingWater/waterMapServe",
              name: "饮用水源地图服务",
              component: resolve =>
                require(["@/views/drinkingWater/waterMapServe"], resolve),
              children: [
                {
                  path: "/drinkingWater/waterMapServe",
                  name: "饮用水源地图服务",
                  meta: {
                    keepAlive: false,
                    noStationcode: true,
                    haveTree: "not"
                  },
                  component: resolve =>
                    require(["@/views/drinkingWater/waterMapServe"], resolve)
                }
              ]
            }
          ]
        }
        // 任务计划
        // {
        //     path: '/planExami',
        //     name: '任务计划',
        //     meta: {
        //         keepAlive: false
        //     },
        //     component: resolve => require(['@/views/planExami/index'], resolve),
        //     children: [{
        //         path: '/planExami/assessManage',
        //         name: '考核管理',
        //         meta: {
        //             keepAlive: false
        //         },
        //         component: resolve => require(['@/views/planExami/assessManage/index'], resolve),
        //         children: [
        //             {
        //                 path: '/planExami/assessManage/assessManage',
        //                 name: '指标管理',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/assessManage/assessManage'], resolve),
        //             },
        //             {
        //                 path: '/planExami/assessManage/planAssess',
        //                 name: '计划考核',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/assessManage/planAssess'], resolve),
        //             },
        //             {
        //                 path: '/planExami/assessManage/taskAssess',
        //                 name: '任务考核',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/assessManage/taskAssess'], resolve),
        //             },
        //         ]
        //     },
        //     {
        //         path: '/planExami/targetManage',
        //         name: '目标管理',
        //         meta: {
        //             keepAlive: false
        //         },
        //         component: resolve => require(['@/views/planExami/targetManage/index'], resolve),
        //         children: [{
        //             path: '/planExami/targetManage/targetSet',
        //             name: '目标设置',
        //             meta: {
        //                 keepAlive: false,
        //                 noStationcode: true,
        //                 haveTree: 'not',
        //             },
        //             component: resolve => require(['@/views/planExami/targetManage/targetSet'], resolve),
        //         },

        //         ]
        //     },
        //     {
        //         path: '/planExami/taskManage',
        //         name: '任务管理',
        //         meta: {
        //             keepAlive: false
        //         },
        //         component: resolve => require(['@/views/planExami/processManage/index'], resolve),
        //         children: [

        //             {
        //                 path: '/planExami/taskManage/buildTask',
        //                 name: '新建任务',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/processManage/buildTask'], resolve),
        //             },
        //             {
        //                 path: '/planExami/taskManage/taskAppear',
        //                 name: '任务上报',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/processManage/taskAppear'], resolve),
        //             },
        //             {
        //                 path: '/planExami/taskManage/taskAudit',
        //                 name: '任务审核',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/processManage/taskAudit'], resolve),
        //             },
        //             {
        //                 path: '/planExami/taskManage/taskFill',
        //                 name: '任务填报',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/processManage/taskFill'], resolve),
        //             },

        //             {
        //                 path: '/planExami/taskManage/taskpresFunction',
        //                 name: '任务督办',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/planExami/processManage/taskpresFunction'], resolve),
        //             },
        //         ]
        //     },
        //     {
        //         path: '/planExami/processManage',
        //         name: '计划管理',
        //         meta: {
        //             keepAlive: false
        //         },
        //         component: resolve => require(['@/views/planExami/processManage/index'], resolve),
        //         children: [{
        //             path: '/planExami/processManage/buildPlan',
        //             name: '新建计划',
        //             meta: {
        //                 keepAlive: false,
        //                 noStationcode: true,
        //                 haveTree: 'not',
        //             },
        //             component: resolve => require(['@/views/planExami/processManage/buildPlan'], resolve),
        //         },
        //         {
        //             path: '/planExami/processManage/planAppear',
        //             name: '计划上报',
        //             meta: {
        //                 keepAlive: false,
        //                 noStationcode: true,
        //                 haveTree: 'not',
        //             },
        //             component: resolve => require(['@/views/planExami/processManage/planAppear'], resolve),
        //         },
        //         {
        //             path: '/planExami/processManage/planAudit',
        //             name: '计划审核',
        //             meta: {
        //                 keepAlive: false,
        //                 noStationcode: true,
        //                 haveTree: 'not',
        //             },
        //             component: resolve => require(['@/views/planExami/processManage/planAudit'], resolve),
        //         },

        //         {
        //             path: '/planExami/processManage/planFill',
        //             name: '计划填报',
        //             meta: {
        //                 keepAlive: false,
        //                 noStationcode: true,
        //                 haveTree: 'not',
        //             },
        //             component: resolve => require(['@/views/planExami/processManage/planFill'], resolve),
        //         },
        //         {
        //             path: '/planExami/processManage/planpresFunction',
        //             name: '计划督办',
        //             meta: {
        //                 keepAlive: false,
        //                 noStationcode: true,
        //                 haveTree: 'not',
        //             },
        //             component: resolve => require(['@/views/planExami/processManage/planpresFunction'], resolve),
        //         },

        //         ]
        //     },
        //     ]
        // },
        //监测计划
        // {
        //     path: '/monitorPlan',
        //     name: '监测计划',
        //     meta: {
        //         keepAlive: false,
        //         noStationcode: true,
        //         haveTree: 'not',
        //     },

        //     component: resolve => require(['@/views/monitorPlan/index'], resolve),
        //     children: [{
        //         path: '/monitorPlan/waterFuncMonitor',
        //         name: '重要水功能区监测',

        //         meta: {
        //             keepAlive: false,
        //             noStationcode: true,
        //             haveTree: 'not',
        //         },
        //         component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/indexpage'], resolve),
        //         children: [{
        //                 path: '/monitorPlan/waterFuncMonitor/buildPlan',
        //                 name: '制定计划',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/buildPlan'], resolve),
        //             }, {
        //                 path: '/monitorPlan/waterFuncMonitor/dataEntry/:id',
        //                 name: '数据录入',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/dataEntry'], resolve),
        //             }, {
        //                 path: '/monitorPlan/waterFuncMonitor/dataCons',
        //                 name: '数据查看',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/dataCons'], resolve),
        //             }, {
        //                 path: '/monitorPlan/waterFuncMonitor/dataAll',
        //                 name: '全部数据',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/dataAll'], resolve),
        //             }, {
        //                 path: '/monitorPlan/waterFuncMonitor/dataToaudit',
        //                 name: '待审核数据',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/dataToaudit'], resolve),
        //             },
        //             {
        //                 path: '/monitorPlan/waterFuncMonitor/trendFxA',
        //                 name: '单站多因子趋势分析',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/trendFxA'], resolve),
        //             },
        //             {
        //                 path: '/monitorPlan/waterFuncMonitor/trendFxB',
        //                 name: '多站单因子趋势分析',
        //                 meta: {
        //                     keepAlive: false,
        //                     noStationcode: true,
        //                     haveTree: 'not',
        //                 },
        //                 component: resolve => require(['@/views/monitorPlan/waterFuncMonitor/trendFxB'], resolve),
        //             }
        //         ]
        //     }, {
        //         path: '/monitorPlan/bydWaterMonitor',
        //         name: '白洋淀流域水质监测',
        //         meta: {
        //             keepAlive: false,
        //             noStationcode: true,
        //             haveTree: 'not',
        //         },
        //         component: resolve => require(['@/views/monitorPlan/bydWaterMonitor'], resolve),
        //     }, {
        //         path: '/monitorPlan/voiceEnvMonitor',
        //         name: '声环境质量监测',
        //         meta: {
        //             keepAlive: false,
        //             noStationcode: true,
        //             haveTree: 'not',
        //         },
        //         component: resolve => require(['@/views/monitorPlan/voiceEnvMonitor'], resolve),
        //     }, {
        //         path: '/monitorPlan/countryWasteWater',
        //         name: '农村生活污水处理设施出水水质',
        //         meta: {
        //             keepAlive: false,
        //             noStationcode: true,
        //             haveTree: 'not',
        //         },
        //         component: resolve => require(['@/views/monitorPlan/countryWasteWater'], resolve),
        //     }, {
        //         path: '/monitorPlan/thousTonWaterarea',
        //         name: '万人千吨水源地',
        //         meta: {
        //             keepAlive: false,
        //             noStationcode: true,
        //             haveTree: 'not',
        //         },
        //         component: resolve => require(['@/views/monitorPlan/thousTonWaterarea'], resolve),
        //     }]
        // },
      ]
    }
  ]
});
