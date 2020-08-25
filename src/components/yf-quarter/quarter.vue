<template>
<el-popover
  placement="bottom-start"
  width="230"
  @show='showQuarter'
  popper-class='quarter_popper'
  v-model="visible">
  <div class="quarterSelect">
        <div class="quarter_head">
            <i class="left el-icon-d-arrow-left" @click="left"></i>
            <p>{{year}}年</p>
            <i class="right el-icon-d-arrow-right" @click="right"></i>
        </div>
        <div class="quarter_body">
              <ul>
                <li v-for="(item,key) in quarterArr" :key="key"   :class="quarterIndex == key && yearBf==year?'on':''" @click='quarterClick(item,key)'>{{item.name}}</li>
              </ul>
        </div>
  </div>
  <div slot="reference" class="yf-quarter">
        <input type="text"  placeholder="请选择季度" readonly class="yf-quarter-input" v-model='quarterText' >
        <span class="yf-quarter-icon">
          <i class="el-icon-date"></i>
        </span>
  </div>
</el-popover>

</template>

<script>
export default {
  name: "yfQuarter",
  props: {},
  data() {
    return {
      visible: false,
      quarterIndex: -1,
      year: "",
      yearBf: "",
      quarterArr: [
        {
          name: "第一季度",
          id: "1"
        },
        {
          name: "第二季度",
          id: "2"
        },
        {
          name: "第三季度",
          id: "3"
        },
        {
          name: "第四季度",
          id: "4"
        }
      ],
      quarterText: ""
    };
  },
  methods: {
    setYear(dateNow) {
      var today = dateNow;
      var yy = today.getFullYear();
      this.year = yy;
    },
    left() {
      this.year = parseFloat(this.year) - 1;
    },
    right() {
      this.year = parseFloat(this.year) + 1;
    },
    //季度选择
    quarterClick(item, key) {
      this.quarterIndex = key;
      this.yearBf = this.year;
      this.quarterText = this.year + "年" + item.name;
      this.$emit('getQuar',{
        year:this.year,
        quarter:item.id
      })
      this.visible = false;
    },
    showQuarter() {
      if (this.quarterText != "") {
        var quarterArr = this.quarterText.split("年");
        this.year = quarterArr[0];
        this.yearBf = this.year;
        if (quarterArr[1] == "第一季度") {
          this.quarterIndex = 0;
        } else if (quarterArr[1] == "第二季度") {
          this.quarterIndex = 1;
        } else if (quarterArr[1] == "第三季度") {
          this.quarterIndex = 2;
        } else if (quarterArr[1] == "第四季度") {
          this.quarterIndex = 3;
        }
      }

     
    }
  },

  created() {
    this.setYear(new Date());
  }
};
</script>
<style scoped lang="less">
.yf-quarter {
  display: inline-block;
  position: relative;
  .yf-quarter-input {
    height: 30px;
    border: 1px solid #c6d1de;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 10px;
    padding-right: 30px;
    color: #1a1a1a;
    &:hover {
      border-color: #166bce;
    }
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
  .yf-quarter-icon {
    position: absolute;
    height: 30px;
    line-height: 30px;
    right: 5px;
    top: 1px;
    color: #c0c4cc;
    text-align: center;
    i {
      display: inline-block;
      width: 25px;
    }
  }
  .b_blue {
    border-color: #166bce;
  }
}
.quarterSelect {
  text-align: center;
  .quarter_head {
    height: 30px;
    line-height: 30px;
    border-bottom: solid 1px #ebeef5;
    padding-bottom: 5px;
    position: relative;
    i {
      font-size: 12px;
      color: #303133;
      position: absolute;
      top: 9px;
      cursor: pointer;
      &:hover {
        color: #166bce;
      }
    }
    .left {
      left: 0px;
    }
    .right {
      right: 0px;
    }
  }
  .quarter_body {
    li {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        color: #166bce;
      }
    }
    .on {
      color: #166bce;
    }
  }
}
</style>
