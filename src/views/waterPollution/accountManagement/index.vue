<template>
  <div style="height:100%">
    <!-- <ul>
      <li>
        <img
          src="../../../assets/images/ledger/keyPollutionDischarge.png"
          @click="jumpPage('/waterPollution/accountManagement/keyPollutionDischarge')"
        />
      </li>
      <li>
        <img
          src="../../../assets/images/ledger/sewageTreatmentPlant.png"
          @click="jumpPage('/waterPollution/accountManagement/sewageTreatmentPlant')"
        />
      </li>
      <li>
        <img
          src="../../../assets/images/ledger/agriculturalNonPointSource.png"
          @click="jumpPage('/waterPollution/accountManagement/agricultureAreaSource')"
        />
      </li>
      <li>
        <img
          src="../../../assets/images/ledger/shipTerminal.png"
          @click="jumpPage('/waterPollution/accountManagement/shipTerminal')"
        />
      </li>
    </ul>
    <ul>
      <li>
        <img
          src="../../../assets/images/ledger/pollutionResistanceSugar.png"
          @click="jumpPage('/waterPollution/accountManagement/pollutantPond')"
        />
      </li>
      <li>
        <img
          src="../../../assets/images/ledger/riverLake.png"
          @click="jumpPage('/waterPollution/accountManagement/riverLake')"
        />
      </li>
      <li>
        <img
          src="../../../assets/images/ledger/treatmentEngineering.png"
          @click="jumpPage('/waterPollution/accountManagement/governProject')"
        />
      </li>
      <li>
        <img
          src="../../../assets/images/ledger/drinkingWaterSource.png"
          @click="jumpPage('/waterPollution/accountManagement/drinkingWaterSource')"
        />
      </li>
    </ul> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "",
  methods: {
    // 跳转页面
    // jumpPage(url) {
    //   this.$router.push({
    //     path: url
    //   });
    // }
  }
};
</script>

<style scoped lang="less">
// .indexIcon {
//   width: 100%;
//   height: 100%;
//   ul {
//     padding-top: 80px;
//     display: flex;
//     justify-content: center;
//     li {
//       padding: 50px;
//       img {
//         cursor: pointer;
//       }
//     }
//     &:last-child {
//       padding-top: 0px;
//     }
//   }
// }
</style>
