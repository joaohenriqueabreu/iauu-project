<template>
  <div>
    <div class="mb-2 d-flex flex-row flex-wrap justify-content-between">
      <h4 class="mb-4">Relatórios</h4>
      <div class="horizontal middle desktop-only">
        <h6 class="mr-4 hide-mobile">Período:</h6>
        <div class="horizontal middle desktop-only">
          <form-date v-model="start" class="mr-3"></form-date>
          <form-date v-model="end" class="mr-4"></form-date>
          <form-button @action="refreshStatistics">Buscar</form-button>
        </div>
      </div>
    </div>
    <hr class="mb-4">
    <div class="row">
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-4">Visitas</h6>
          <div class="d-flex justify-content-end align-items-end">
            <h4 class="mr-4">{{ statistics.visits.count }}</h4>
            <h6 :class="statistics.visits.diff > 0 ? 'positive' : 'negative'">
              <font-awesome :icon="statistics.visits.diff > 0 ? 'angle-up' : 'angle-down'" class="mr-0"></font-awesome>
              {{ statistics.visits.diff }}%
            </h6>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-4">Propostas Recebidas</h6>
          <div class="d-flex justify-content-end align-items-end">
            <h4 class="mr-4">{{ statistics.proposals.count }}</h4>
            <h6 :class="statistics.proposals.diff > 0 ? 'positive' : 'negative'">
              <font-awesome :icon="statistics.proposals.diff > 0 ? 'angle-up' : 'angle-down'" class="mr-0"></font-awesome>
              {{ statistics.proposals.diff }}%
            </h6>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-4">Apresentações Fechadas</h6>
          <div class="d-flex justify-content-end align-items-end">
            <h4 class="mr-4">{{ statistics.presentations.count }}</h4>
            <h6 :class="statistics.presentations.diff > 0 ? 'positive' : 'negative'">
              <font-awesome :icon="statistics.presentations.diff > 0 ? 'angle-up' : 'angle-down'" class="mr-0"></font-awesome>
              {{ statistics.presentations.diff }}%
            </h6>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-2">Previsão de faturamento</h6>
          <small class="mb-4">Contabilizando propostas recebidas</small>
          <div class="d-flex justify-content-end align-items-end">
            <h4 class="mr-4">{{ statistics.income.prevision.value | currency }}</h4>
            <h6 :class="statistics.income.prevision.diff > 0 ? 'positive' : 'negative'">
              <font-awesome :icon="statistics.income.prevision.diff > 0 ? 'angle-up' : 'angle-down'" class="mr-0"></font-awesome>
              {{ statistics.income.prevision.diff }}%
            </h6>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-2">Faturamento real</h6>
          <small class="mb-4">Contabilizando somente propostas fechadas</small>
          <div class="d-flex justify-content-end align-items-end">
            <h4 class="mr-4">{{ statistics.income.actual.value | currency }}</h4>
            <h6 :class="statistics.income.actual.diff > 0 ? 'positive' : 'negative'">
              <font-awesome :icon="statistics.income.actual.diff > 0 ? 'angle-up' : 'angle-down'" class="mr-0"></font-awesome>
              {{ statistics.income.actual.diff }}%
            </h6>
          </div>
        </div>
      </div>
    </div>
    <div>
      <line-chart :data="statistics.visits.data" name="Número de visitas" class="chart-wrapper"></line-chart>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  async asyncData({ store }) {
    await store.dispatch('artist/calculateStatistics');
  },
  data() {
    return {
      start: '',
      end: '',
      inputFormat: 'YYYY-MM-DD'
    }
  },
  async mounted() {
    await this.refreshStatistics();
    // Format for display
    this.start = this.moment().startOf('year').format(this.inputFormat);
    this.end = this.moment().format(this.inputFormat);
  },
  computed: {
    ...mapState({ statistics: (state) => state.artist.statistics }),
    reportDateRange() {
      return { start: this.moment(this.start).toISOString(), end: this.moment(this.end).toISOString() };
    }
  },
  methods: {
    ...mapActions('artist', ['calculateStatistics']),
    async refreshStatistics() {
      await this.calculateStatistics(this.reportDateRange);
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-box {
  background: $layer4;
  box-shadow: $shadow;
  padding: 2 * $space;
  margin-bottom: 4 * $space;
}

.positive {
  color: $green;
}

.negative {
  color: $error;
}

.chart-wrapper {
  height: 300px;
  width: 50%;
}
</style>