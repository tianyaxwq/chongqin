<template>
  <div class="pageContent">
    <div class="secondary-page-section">
      <mapComp v-bind:mapInfo="mapInfo" ref="cmap"></mapComp>
    </div>
    <div class="bottom-img">
      <el-checkbox v-model="checked1">
        <img width="14" src="../../../static/img/ncsyd.png" alt /> 农村饮用水源地
      </el-checkbox>
      <el-checkbox v-model="checked2">
        <img width="14" src="../../../static/img/cssyd.png" alt /> 城市饮用水源地
      </el-checkbox>
    </div>
  </div>
</template>

<script>
import mapComp from "./map_yuli";
export default {
  name: "",
  components: { mapComp },
  data() {
    return {
      checked1: true,
      checked2: true,
      mapInfo: []
    };
  },
  mounted() {
    this.mapInfo = [
      {
        level: "II",
        lat: 38.884542,
        lng: 115.818781,
        name: "三台镇王公堤地下水型",
        icon: "ncsyd"
      },
      {
        level: "I",
        lat: 38.86815,
        lng: 115.985417,
        name: "昝岗镇昝王庄地下水型",
        icon: "ncsyd"
      },
      {
        level: "III",
        lat: 39.00815,
        lng: 115.985417,
        name: "昝岗镇李林庄地下水型",
        icon: "cssyd"
      },
      {
        level: "IV",
        lat: 39.00815,
        name: "昝岗镇梁神堂地下水型",
        lng: 115.915417,
        icon: "cssyd"
      },
      {
        level: "V",
        lat: 38.90815,
        lng: 115.985417,
        name: "昝岗镇段岗地下水型",
        icon: "ncsyd"
      },
      {
        level: "劣V",
        lat: 39.00815,
        lng: 115.865417,
        name: "昝岗镇袁庄地下水型",
        icon: "ncsyd"
      },
      {
        level: "II",
        lat: 38.884566,
        lng: 115.819541,
        name: "北沙口乡大庄地下水型",
        icon: "ncsyd"
      },
      {
        level: "I",
        lat: 38.86874,
        lng: 115.999617,
        name: "昝岗镇邢岗地下水型",
        icon: "ncsyd"
      },
      {
        level: "III",
        lat: 39.00615,
        lng: 115.939547,
        name: "昝岗镇西河岗地下水型",
        icon: "cssyd"
      },
      {
        level: "IV",
        lat: 39.00824,
        name: "朱各庄镇东王槐地下水型",
        lng: 115.915326,
        icon: "cssyd"
      },
      {
        level: "V",
        lat: 38.90801,
        lng: 115.915717,
        name: "晾马台镇辛庄地下水型",
        icon: "ncsyd"
      },
      {
        level: "劣V",
        lat: 39.00756,
        lng: 115.954417,
        name: "北沙口乡小庄地下水型",
        icon: "ncsyd"
      }
    ];
  }
};
</script>

<style lang="less" scoped>
.secondary-page-section {
  height: 100%;
}
.bottom-img {
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px rgba(64, 76, 95, 0.21);
  position: absolute;
  bottom: 15px;
  right: 20px;
  z-index: 20;
}
</style>
