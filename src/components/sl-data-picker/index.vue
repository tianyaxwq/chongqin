<template>
  <!--  自定义开始结束时间 -->
  <div class="sl-data-picker">
    <div class="data-picker-wrap">
      <el-date-picker
        v-model="satrtDate"
        :type="type"
        :format="format"
        :disabled="disabled"
        :editable="editable"
        :value-format="valueFormat"
        :placeholder="startPlaceholder"
        :picker-options="sPickerOptions"
        @change="satrtDateChange"
      ></el-date-picker>
    </div>
    <span class="range">{{ rangeSeparator }}</span>
    <div class="data-picker-wrap">
      <el-date-picker
        v-model="endDate"
        :type="type"
        :format="format"
        :disabled="disabled"
        :editable="editable"
        :value-format="valueFormat"
        :placeholder="endPlaceholder"
        :picker-options="ePickerOptions"
        @change="endDateChange"
      ></el-date-picker>
    </div>
  </div>
</template>

<script>
//import引入的组件需要注入到对象中才能使用
export default {
  name: "sl-date-picker",
  components: {},
  props: {
    //日历类型
    type: {
      type: String,
      default: "date"
    },
    //默认值
    value: {
      type: Array,
      required: true
    },
    //选择范围时的分隔符
    rangeSeparator: {
      type: String,
      default: "~"
    },
    //范围选择时开始日期的占位内容
    startPlaceholder: {
      type: String,
      default: "开始日期"
    },
    //范围选择时结束日期的占位内容
    endPlaceholder: {
      type: String,
      default: "结束日期"
    },
    //显示在输入框中的格式
    format: {
      type: String
    },
    //可选，绑定值的格式。不指定则绑定值为 Date 对象
    valueFormat: {
      type: String
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    //是否文本框可输入
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    //这里存放数据
    return {
      satrtDate: "",
      endDate: "",
      sPickerOptions: {},
      ePickerOptions: {}
    };
  },
  //监听属性 类似于data概念
  computed: {
    dataValue() {
      let dateArr = [];
      return dateArr;
    }
  },
  //监控data中的数据变化
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.initPicker();
      }
    }
  },
  //方法集合
  methods: {
    //默认值赋值判断
    initPicker() {
      if (this.value && this.value.length > 0) {
        this.satrtDate = this.value[0];
        this.endDate = this.value[1];
      } else {
        // let start = new Date(this.value[0]).getTime();
        // let end = new Date(this.value[1]).getTime();
        // if (end > start) {
        //   this.satrtDate = this.value[0];
        //   this.endDate = this.value[1];
        // } else {
        //   this.$message.error("默认值开始时间不能大于结束时间！");
        // }
      }
    },
    //开始时间禁用日期函数
    sDisabledDate(time) {
      if (this.endDate) {
        return time.getTime() > new Date(this.endDate).getTime();
      } else {
        return false;
      }
    },
    //结束时间禁用日期函数
    eDisabledDate(time) {
      if (this.satrtDate) {
        return time.getTime() < new Date(this.satrtDate).getTime();
      } else {
        return false;
      }
    },
    //开始时间改变时触发
    satrtDateChange(val) {
      let value = [this.satrtDate, this.endDate];
      this.emitValue();
      this.$emit("change", value);
    },
    //结束时间改变时触发
    endDateChange() {
      let value = [this.satrtDate, this.endDate];
      this.emitValue();
      this.$emit("change", value);
    },
    //将日期数据返回给父组件
    emitValue() {
      let value = [this.satrtDate, this.endDate];
      this.$emit("input", value);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.value.length === 2) {
      this.initPicker();
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.sPickerOptions.disabledDate = this.sDisabledDate;
    this.ePickerOptions.disabledDate = this.eDisabledDate;
  }
};
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
.sl-data-picker {
  width: 100%;
  display: inline-block;
  vertical-align: middle;
  .data-picker-wrap {
    display: inline-block;
    vertical-align: top;
    width: calc(49% - 24px);
  }
  .range {
    display: inline-block;
    vertical-align: top;
    margin: 0 4px;
    width: 24px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
}
</style>