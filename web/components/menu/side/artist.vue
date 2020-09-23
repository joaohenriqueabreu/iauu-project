<template>
  <div>
    <div class="side-menu-items">
      <nuxt-link to="/artist/schedule">
        <font-awesome icon="calendar-alt"></font-awesome>
        <span v-show="!minimized">Agenda</span>
      </nuxt-link>
      <nuxt-link to="/artist/presentations" :class="{ routed: routed('presentations') }">
        <font-awesome icon="music"></font-awesome>
        <span v-show="!minimized">Apresentações</span>
      </nuxt-link>
      <nuxt-link to="/artist/proposals" :class="{ routed: routed('proposals') }">
        <font-awesome icon="search-dollar"></font-awesome>
        <span v-show="!minimized">Propostas</span>
      </nuxt-link>
      <nuxt-link to="/artist/profile" :class="{ routed: routed('account') }">
        <font-awesome icon="guitar"></font-awesome>
        <span v-show="!minimized">Banda</span>
      </nuxt-link>
      <nuxt-link to="/artist/reports" :class="{ routed: routed('reports') }">
        <font-awesome icon="chart-line"></font-awesome>
        <span v-show="!minimized">Relatórios</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import UserMenu from './user'
export default {
  extends: UserMenu
}
</script>
