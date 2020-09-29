<template>
  <div>
     <GChart
        :settings="{ packages: ['geochart'], mapsApiKey: mapsKey }"
        type="GeoChart"
        :data="chartData"
        :options="chartOptions" />
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts';
import _ from 'lodash';

export default {
  components: {
    GChart
  },
  props: {
    data: { type: Array, default: null },
  },
  computed: {
    mapsKey() {
      return process.env.googleMapsApiKey;
    },
    chartData() {
      return [
        ["State", "Count"],
        ..._.map(this.data, (item) => {
          console.log(item);
          return [item._id.state, item.value];
        })
      ];
    },
    chartOptions() {
      return {
        region: 'BR',
        resolution: 'provinces',
        backgroundColor: 'transparent',
        datalessRegionColor: this.$config.colors.layer5,
        keepAspectRatio: false,
        colorAxis: {
            colors: ['#ffffff', this.$config.colors.brandLayer]
        }
        // displayMode: 'markers',
        // colorAxis: {colors: ['green', 'blue']}
      };
    }
  }
}
</script>

<style>

</style>