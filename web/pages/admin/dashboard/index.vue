<template>
  <div>
    <div class="horizontal middle d-flex justify-content-end m-4">
      <h4 class="mr-4">Status do sistema:</h4>
      <div class="stat-status mr-5" :class="status"></div>
      <h4 class="mr-4">Ping:</h4>
      <h4>{{ pingTime }}ms</h4>
    </div>
    <div v-if="!$empty(usersStats)" class="row mb-4">
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-4">Usuários</h6>
          <div class="d-flex justify-content-end">
            <h4>{{ allUsersCount }}</h4>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-4">Artistas</h6>
          <div class="d-flex justify-content-end">
            <h4>{{ artistsCount }}</h4>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="stat-box">
          <h6 class="mb-4">Organizadores de eventos</h6>
          <div class="d-flex justify-content-end">
            <h4>{{ contractorsCount }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <line-chart :chart-data="dailySignups" class="chart-wrapper"></line-chart>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  async asyncData({ store }) {
    await store.dispatch('admin/loadUsersStats')
    await store.dispatch('admin/loadPresentationsStats')

    let status = 'good'
    let pingTime = 0
    try {
      const start = moment()
      await store.dispatch('admin/status')
      const end = moment()
      pingTime = end.diff(start)
      if (pingTime > 1000) { status = 'warning' }
    } catch (error) {
      console.log(error)
      status = 'error'
    }

    return {
      status,
      pingTime
    }
  },
  mounted() {
    // new Chart
  },
  computed: {
    ...mapGetters('admin', ['usersStats']),
    allUsersCount() {
      return this.usersStats.all[0].count
    },
    contractorsCount() {
      const contractors = _.filter(this.usersStats.roles, (role) => role._id === 'contractor')
      return contractors.length > 0 ? contractors[0].count : 0
    },
    artistsCount() {
      const artists = _.filter(this.usersStats.roles, (role) => role._id === 'artist')
      return artists.length > 0 ? artists[0].count : 0
    },
    dailySignups() {
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-status {
  &.good { background: $green; }
  &.warning { background: $warning; }
  &.error { background: $error; }

  width: 20px;
  height: 20px;
  border-radius: $rounded;
  box-shadow: $shadow;
}

.stat-box {
  background: $layer4;
  box-shadow: $shadow;
  padding: 2 * $space;
}

.chart-wrapper {
  max-height: 20vh;
  max-width: 80vw;
}
</style>
