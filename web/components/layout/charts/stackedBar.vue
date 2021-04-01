<script>
import { Bar } from 'vue-chartjs';
import _ from 'lodash';

export default {
  extends: Bar,
  props: {
    name: { type: String, default: '' },
    dataLine: { type: Array, default: null },
    dataBar: { type: Array, default: null },
    labels: { type: Array, default: null },
    options: { type: Object, default: null },
    useSameAxis: { type: Boolean, default: false }
  },
  computed: {
    chartData() {
      return {
        labels: _.map(this.dataBar, 'label'),
        datasets: [{
          type: 'bar',
          label: 'bar',
          yAxisID: 'bar',
          borderColor: 'rgba(255, 153, 10, 1)', //this.$config.colors.brandLayer,
          borderWidth: 2,
          backgroundColor: 'rgba(255, 153, 10, 0.15)',
          legend: { display: false, },
          title: { display: false, },
          data: _.map(this.dataBar, 'value')
        }, {
          type: 'line',
          label: 'line',
          yAxisID: this.useSameAxis ? 'bar' : 'line',
          borderColor: this.$config.colors.brandLayer,
          lineTension: 0,
          legend: { display: false, },
          title: { display: false, },
          data: _.map(this.dataLine, 'value')
        },]
      }
    },
    chartOptions() {
      return {
        ...this.options,
        responsive: true,
        maintainAspectRatio: false, // fit chart to wrapper
        tooltips: {
          enabled: false
        },
        scales: { yAxes: this.axis }
      }
    },
    lineAxis() {
      return {
        id: 'line',
        type: 'linear',
        position: 'left',
        scalePositionLeft: true
      };
    },
    barAxis() {
      return {
        id: 'bar',
        type: 'linear',
        position: 'right',
        scalePositionLeft: false
      };
    },
    axis() {
      if (this.useSameAxis) {
        return [this.barAxis];
      }

      return [this.barAxis, this.lineAxis];
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>

<style lang="scss"></style>
