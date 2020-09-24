<script>
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    // data: { type: Object, default: null },
    options: { type: Object, default: null }
  },
  computed: {
    chartOptions() {
      return {
        ...this.options,
        responsive: true,
        cornerRadius: 20,
        tooltips: {
          enabled: false
        }
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>

<style lang="scss"></style>
