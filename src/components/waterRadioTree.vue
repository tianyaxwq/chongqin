<template>
  <!-- 水质分析对象 -->
  <div class="water-tadio-tree">
    <h4 class="title">
      <i class="mode-title-icon"></i> 水质分析对象
    </h4>
    <div class="search-toolbar-wrap" :class="{cover:coverCls}">
      <button class="screen-btn" type="button"
              :class="{active: screenType === 'area'}"
              @click="screenTypeSearch('area')"
      >区域</button>
      <button class="screen-btn"  type="button"
              :class="{active: screenType === 'river'}"
              @click="screenTypeSearch('river')"
      >河流</button>
      <button class="screen-btn" type="button"
              :class="{active: screenType === 'station'}"
              @click="screenTypeSearch('station')"
      >监测断面</button>
      <div class="search-wrap" :class="{active:searchOpen}">
        <div class="search-box">
          <input v-model="searchInput" type="text" placeholder="请输入站点关键字"/>
          <button class="search-btn" type="button"
                  @click="searchOpenBox"
          >
            <i class="iconfont icon-sousuo"></i>
          </button>
          <span class="close-search" @click="closeSearchBox">╳</span>
        </div>
      </div>
    </div>
    <div class="site-tree-wrap">
      <el-scrollbar class="site-tree-content">
        <div class="site-tree-box">
          <el-tree
            :data="treeData"
            :indent="23"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="[defaultId]"
            ref="radioTree"
            :class="treeData.length==1?'noBr':''"
            :check-strictly = 'false'
            :check-on-click-node = "true"
            :filter-node-method="filterNode"
            @node-click = "treeNodeClick"
            @check = "treeNodeCheck"
            @check-change = 'siteCheckChange'
          >
            <span class="custom-tree-node" slot-scope="{node,data}">
              <span> <i class="iconfont" :class="data.children?'icon-wenjianjiaa':'icon-wenjiana'" style="font-size:15px;"></i> {{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "waterRadioTree",
  watch: {
    searchInput(val) {
      this.$refs.radioTree.filter(val);
    }
  },
  data() {
    return {
      coverCls: false,
      screenType: "area",
      searchOpen: false,
      searchInput: "",
      treeData: [],
      defaultId: ""
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    screenTypeSearch(type) {
      this.screenType = type;
      this.searchData();
    },
    searchOpenBox() {
      if (this.searchOpen) {
      } else {
        this.searchOpen = true;
        this.coverCls = true;
      }
    },
    closeSearchBox() {
      this.searchOpen = false;
      this.searchInput = "";
      this.coverCls = false;
    },
    treeNodeClick(data, node, event) {
      //节点被点击时的回调
      this.$refs.radioTree.setCheckedKeys([]);
      this.$refs.radioTree.setCheckedKeys([data.id]);
    },
    treeNodeCheck(data, node) {
      //当复选框被点击的时候触发
      this.$refs.radioTree.setCheckedKeys([]);
      this.$refs.radioTree.setCheckedKeys([data.id]);
      this.$emit("getCheckedNodes", data);
    },
    getfirstChild(node) {
      if (node.structureType == "area") {
        var list = node.children;

        aa: for (var i = 0; i < list.length; i++) {
          var cnode = list[i];
          if (cnode.structureType == "station") {
            return cnode;
            break;
          } else {
            var clist = cnode.children;
            for (var j = 0; j < clist.length; j++) {
              return clist[j];
              break aa;
            }
          }
        }
      }
    },
    selectSingleNode() {
      //默认选中第一个节点
      var selnode = [];
      var checknode = [];
      var nodes = this.treeData;
      for (var i = 0; i < nodes.length; i++) {
        var cnode = this.getfirstChild(nodes[i]);
        selnode.push({
          id: cnode.id,
          label: cnode.label,
          isLeaf: cnode.isLeaf,
          structureType: cnode.structureType
        });
        checknode.push(cnode.id);
      }
      this.$refs.radioTree.setCheckedKeys(checknode);
      this.$emit("getCheckedNodes", selnode[0]);
    },
    //选中根节点
    selectRootNode() {
      this.$emit("getCheckedNodes", this.treeData[0]);
    },
    searchData() {
      /* 基本信息请求 */
      this.$http
        .get("/waterenvapi/basic/stationTree", {
          params: {
            structureType: this.screenType
          }
        })
        .then(response => {
          let dataJson = response.data;
          if (dataJson.code === 200) {
            this.treeData = dataJson.content.dataList;
            this.defaultId = dataJson.content.dataList[0].id;
            this.$emit("getCheckedNodes", dataJson.content.dataList[0]);
          }
        })
        .catch(error => {});
    },
    siteCheckChange(data, checked, node) {
      // this.siteCheckNodes = this.$refs.radioTree.getCheckedNodes();
      // this.$emit('getCheckedNodes',this.siteCheckNodes);
    }
  },
  created() {
    this.searchData();
  }
};
</script>

<style scoped lang="less">
button {
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
}
.water-tadio-tree {
  height: 100%;
  border-right: 1px solid #d9e6f7;
  .title {
    line-height: 32px;
    padding-left: 8px;
    font-size: 13px;
  }
  .monitoring-factor-list {
    padding: 4px;
    li {
      float: left;
      width: calc(50% - 8px);
      margin: 4px;
      height: 26px;
      line-height: 24px;
      border: 1px solid #c6d1de;
      text-align: center;
      cursor: pointer;
    }
    li.active {
      color: #166bce;
      border-color: #166bce;
    }
  }
  .search-toolbar-wrap {
    border-top: 1px solid #d9e6f7;
    border-bottom: 1px solid #d9e6f7;
    height: 30px;
    line-height: 28px;
    background: #e7f0f9;
    position: relative;
    z-index: 0;
    .block-icon {
      width: 8px;
      height: 8px;
      background: #166bce;
      margin-left: 8px;
    }
    .modular-title {
      color: #166bce;
    }
    .screen-btn {
      width: 66px;
      height: 100%;
      border-left: 1px solid #d9e6f7;
      font-size: 12px;
      float: left;
    }
    .screen-btn:hover {
      color: #166bce;
    }
    .screen-btn:first-child {
      border-left: none;
    }
    .screen-btn.active {
      background: #166bce;
      color: #fff;
      position: relative;
    }
    .screen-btn.active:after {
      content: "";
      position: absolute;
      border: 8px solid #166bce;
      top: 12px;
      left: 50%;
      margin-left: -8px;
      transform: rotate(45deg);
      z-index: -1;
    }
    .search-wrap {
      position: absolute;
      height: 100%;
      top: 0;
      right: 0;
      width: 30px;
      overflow: hidden;
      border-left: 1px solid #d9e6f7;
      transition: all 0.2s;
    }
    .search-wrap.active {
      background: #ffffff;
      width: 100%;
      .search-btn {
        background: #166bce;
        i {
          color: #fff;
        }
      }
      .search-btn:hover {
        background: #065dc2;
      }
    }
    .search-box {
      width: 232px;
      height: 28px;
      position: relative;
      float: right;
      input {
        height: 28px;
        width: 172px;
        border: none;
        background: none;
        font-size: 12px;
        outline: none;
        padding-left: 8px;
        float: left;
      }
      .search-btn {
        width: 30px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        i {
          font-size: 14px;
        }
      }
      .close-search {
        position: absolute;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        top: 7px;
        right: 40px;
        border-radius: 50%;
        cursor: pointer;
      }
      .close-search:hover {
        background: #ddd;
      }
    }
  }
  .search-toolbar-wrap.cover {
    .screen-btn.active:after {
      top: 6px;
    }
  }
  .site-tree-wrap {
    height: calc(100% - 62px);
    padding-top: 10px;
    .site-tree-content {
      height: 100%;
    }
  }
  .site-tree-box {
    padding: 10px;
    width:calc(100% - 17px)
  }
}
</style>
