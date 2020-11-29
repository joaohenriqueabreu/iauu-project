<template>
  <div>
    <div class="horizontal middle d-flex justify-content-end m-4">
      <h4 class="mr-4">Status do sistema:</h4>
      <div class="stat-status mr-5" :class="status"></div>
      <h4 class="mr-4">Ping:</h4>
      <h4>{{ pingTime }}ms</h4>
    </div>
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
    </div>
    <div class="row">
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  async asyncData({ store }) {
    // await store.dispatch('admin/calculateUsersStatistics');
    // await store.dispatch('admin/calculatePresentationsStatistics');

    let status = 'good'
    let pingTime = 0
    try {
      const start = this.moment();
      await store.dispatch('admin/status');
      const end = this.moment();
      pingTime = end.diff(start);
      if (pingTime > 1000) { status = 'warning'; }
    } catch (error) {
      console.log(error);
      status = 'error';
    }

    return {
      status,
      pingTime
    }
  },
  data() {
    return {
      start: '',
      end: '',
      inputFormat: 'YYYY-MM-DD'
    }
  },
  async mounted() {
    await this.calculateUsersStatistics();
    await this.calculatePresentationsStatistics();

    // Format for display
    this.start = this.moment().startOf('year').format(this.inputFormat);
    this.end = this.moment().format(this.inputFormat);
  },
  computed: {
    ...mapState({ statistics: (state) => state.admin.statistics }),
    reportDateRange() {
      return { start: this.moment(this.start).toISOString(), end: this.moment(this.end).toISOString() };
    }
  },
  methods: {
    ...mapActions('admin', ['calculateUsersStatistics', 'calculatePresentationsStatistics']),
    async refreshStatistics() {
      await this.calculateUsersStatistics(this.reportDateRange);
      await this.calculatePresentationsStatistics(this.reportDateRange);
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
  height: 400px;
  width: 100%;
  box-shadow: $shadow;
  overflow: hidden;
}
</style>