<template>
<el-popover
  placement="bottom-start"
  width="230"
  popper-class='downtree_popper'
  v-model="visible">
  <div class="downTree scrollStyle">
    <el-scrollbar style="height:100%">
      <el-tree :data="treeData"
        :indent="23"
        node-key="id"
        ref="tree"
        @node-click='nodeClick'
        @check='checkedClick'
        :current-node-key='treeConfig.defaultId'
        :default-checked-keys="[treeConfig.defaultId]"
        :default-expanded-keys='[treeConfig.defaultId]'
        highlight-current
        accordion
        :show-checkbox='treeConfig.showCheckbox'
        :class="treeData.length==1?'noBr':''"
        :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span> <i class="iconfont" :class="data.children?'icon-wenjianjiaa':'icon-wenjiana'" style="font-size:15px;"></i> {{ node.label }}</span>
          </span>
      </el-tree>
    </el-scrollbar>
       
  </div>
  <div slot="reference" class="yf-downtree" >
        <input type="text"  placeholder="请选择" readonly class="yf-downtree-input" v-model='treeText' :title="treeText" :class="visible?'b_blue':''">
         <span class="yf-downtree-icon">
          <i class="el-icon-caret-bottom" :class="visible?'i_blue':''"></i>
        </span>
  </div>
</el-popover>

</template>

<script>
export default {
  name: "yfDropdowntree",
  props: {
    treeConfig: {
       type: Object,
       default: {
         showCheckbox:false,//是否多选
         defaultId:'',
         defaultText:'',
       },
    },
    treeData:{
      type:Array,
      default:[],
    },
    
  },
  // model:{
  //   prop:'treeText',
  //   event:'setText'
  // },
  data() {
    return {
      visible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      treeText: ""
    };
  },
  methods: {
    nodeClick(data) {
      if(!this.treeConfig.showCheckbox && !data.children){
          this.treeText=data.label;
          this.visible=false;
          this.$emit('setText',data.label);
          this.$emit('checkedNode',data);
      };
      
    },
    checkedClick(data) {
      this.treeText='';
      let treeNode=this.$refs.tree.getCheckedNodes();
      for(let i in treeNode){
        if(!treeNode[i].children){
          this.treeText+=treeNode[i].label+',';
         
        }
      }
      this.treeText=this.treeText.substring(0,this.treeText.length-1);
      this.$emit('checkedNode',data)
    }
  },

  created() {
  //  this.treeText=this.treeConfig.defaultText;
  },
  mounted(){
     
     let node =this.$refs.tree.getCurrentNode()
     this.treeText=node.label;
  }
};
</script>
<style scoped lang="less">
.downTree{
  height: 200px;
}
.yf-downtree{
  display: inline-block;
  position: relative;
  width: 100%;
  .yf-downtree-input{
    height: 30px;
    width: calc(100% - 8px);
    border: 1px solid #c6d1de;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 8px;
    color: #1a1a1a;
    overflow:hidden;
    cursor: pointer;
    text-overflow:ellipsis;
    white-space:nowrap;
    &:hover {
      border-color: #166bce;
    }
    &:focus{
      border-color: #166bce !important;
     
    }
   
  }
  .b_blue {
    border-color: #166bce;
  }
  .i_blue{
    color: #166bce;
    transform: rotate(-180deg);
  }
  input::-webkit-input-placeholder {
    color: #c4c4cc;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #c4c4cc;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #c4c4cc;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #c4c4cc;
  }
  .yf-downtree-icon{
    position: absolute;
    height: 30px;
    line-height: 30px;
    right: 0px;
    top: 1px;
    color: #c0c4cc;
    text-align: center;
    i{
      display: inline-block;
      width:25px;
      font-size: 14px;
      transition: transform 0.5s;
    }
  }
}
</style>
