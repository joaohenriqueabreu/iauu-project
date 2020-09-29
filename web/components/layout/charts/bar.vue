<script>
import { Bar } from 'vue-chartjs';
import _ from 'lodash';

export default {
  extends: Bar,
  props: {
    name: { type: String, default: '' },
    data: { type: Array, default: null },
    labels: { type: Array, default: null },
    options: { type: Object, default: null }
  },
  computed: {
    chartData() {
      return {
        labels: _.map(this.data, 'label'),
        datasets: [{
          label: this.name,
          borderColor: this.$config.colors.brandLayer,
          backgroundColor: 'rgba(255, 153, 10, 0.15)',
          lineTension: 0,
          legend: { display: false, },
          title: { display: false, },
          data: _.map(this.data, 'value')
        }]
      }
    },
    chartOptions() {
      return {
        ...this.options,
        responsive: true,
        maintainAspectRatio: false, // fit chart to wrapper
        tooltips: {
          enabled: false
        }
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>

<style lang="scss"></style>
