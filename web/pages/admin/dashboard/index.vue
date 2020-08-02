<template>
  <div>
    <div class="horizontal middle d-flex justify-content-end m-4">
      <h4 class="mr-4">Status do sistema:</h4>
      <div class="stat-status" :class="status"></div>
    </div>
    <div class="row mb-4" v-if="!$empty(usersStats)">
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
export default {
  async asyncData({ store }) {    
    await store.dispatch('admin/loadUsersStats')
    await store.dispatch('admin/loadPresentationsStats')

    let status = 'active'
    try {
      await store.dispatch('admin/status')
    } catch (error) {
      console.log(error)
      status = 'error'
    }

    return {
      status
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
      return contractors[0].count
    },
    artistsCount() {
      const artists = _.filter(this.usersStats.roles, (role) => role._id === 'artist')
      return artists[0].count
    },
    dailySignups() {
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
  .stat-status {
    &.active {
      background: $green;
    }

    &.error {
      background: $error;
    }

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