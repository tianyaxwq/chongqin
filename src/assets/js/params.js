let config_P = {
  //协议管理页面
  agreeMange: {
    "assembleCondition": ["0 and 1", "_0 and 2"],
    "assembleSql": {
      "order": [
        "protocol.numbers,desc"
      ],
      "select": "protocol.protocolId,protocol.protocolType.protocolTypeId,id,protocol.name,protocol.code,protocol.numbers,protocol.protocolType.name,publishedDate,url"
    },
    "queryCondition": {
      "property": ["protocol.name", "protocol.protocolType.name", "publishedDate"],
      "operator": ["=", "=", "between"],
      "content": ["", "", ""]
    },
  },
  //指令管理页面
  instManage: {
    "assembleCondition": ["0 and 1", "_0 and 2"],
    "assembleSql": {
      "order": [
        "numbers,asc"
      ],
      "select": "instructionsId,instructionsType.instructionsTypeId,name,code,instructionsType.name,contenttemplate,numbers"
    },
    "queryCondition": {
      "property": ["name", "instructionsType.name", "code"],
      "operator": ["=", "=", "like"],
      "content": ["", "", ""]
    },
    "pageObject": {
      "pageNumber": 'pageSize',
      "pageSize": 'pageSize'
    }
  },
  //流域管理
  queryParamDto: {
    "assembleCondition": [
      "0"
    ],
    "assembleSql": {
      "order": [
        "basinnCode,asc"
      ]
    },
    "queryCondition": {
      "property": ["basinnName"],
      "operator": ["like"],
      "content": ["%"]
    },
    "pageObject": {
      "pageNumber": 1,
      "pageSize": 10
    }
  },
  //站点类别
  stationClassify: {
    "assembleCondition": [
      "0"
    ],
    "assembleSql": {
      "order": [
        "stationClassifyTime,desc"
      ]
    },
    "queryCondition": {
      "property": ["stationClassifyName"],
      "operator": ["like"],
      "content": ["%"]
    },
    "pageObject": {
      "pageNumber": 1,
      "pageSize": 10
    }
  },
  //站点分类
  stationType: {
    "assembleCondition": [
      "0"
    ],
    "assembleSql": {
      "order": [
        "lastUpdateTime,desc"
      ]
    },
    "queryCondition": {
      "property": ["stationTypeName"],
      "operator": ["like"],
      "content": ["%"]
    },
    "pageObject": {
      "pageNumber": 1,
      "pageSize": 10
    }
  },
  //区域管理
  area: {
    "assembleCondition": [
      "0"
    ],
    "assembleSql": {
      "order": [
        "sort,asc"
      ]
    },
    "queryCondition": {
      "property": ["areaLevel.areaLevelCode"],
      "operator": ["="],
      "content": ["1"]
    },
    // "pageObject": {
    //   "pageNumber": 1,
    //   "pageSize": 10
    // }
  },
  //因子管理
  factor: {
    "assembleCondition": [
      "0"
    ],
    "assembleSql": {
      "order": [
        "sortIndex,asc"
      ]
    },
    "queryCondition": {
      "property": ["projectName"],
      "operator": ["like"],
      "content": ["%"]
    },
    "pageObject": {
      "pageNumber": 1,
      "pageSize": 10
    }
  }




}
export default config_P;
