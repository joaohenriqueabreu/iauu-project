<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: {
    data: { type: Object, default: null },
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
    // let roundedDoughnutScript = document.createElement('script')
    // roundedDoughnutScript.setAttribute('src', require(''))
    // document.head.appendChild(recaptchaScript)

    this.renderChart(this.data, this.chartOptions)
  }
}
</script>

<style lang="scss"></style>
