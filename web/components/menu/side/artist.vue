<template>
  <div>
    <div class="side-menu-items">
      <nuxt-link to="/artist/schedule" :class="{ routed: routed('schedule') }">
        <icon icon="calendar-alt"></icon>
        <span v-show="!minimized">Agenda</span>
      </nuxt-link>
      <nuxt-link to="/artist/presentations" :class="{ routed: routed('presentations') }">
        <icon icon="music"></icon>
        <span v-show="!minimized">Apresentações</span>
      </nuxt-link>
      <nuxt-link to="/artist/proposals" :class="{ routed: routed('proposals') }">
        <icon icon="search-dollar"></icon>
        <span v-show="!minimized">Propostas</span>
      </nuxt-link>
      <nuxt-link to="/artist/profile" :class="{ routed: routed('profile') }">
        <icon icon="guitar"></icon>
        <span v-show="!minimized">Banda</span>
      </nuxt-link>
      <!-- <nuxt-link to="/artist/reports" :class="{ routed: routed('reports') }">
        <icon icon="chart-line"></icon>
        <span v-show="!minimized">Relatórios</span>
      </nuxt-link> -->
    </div>
  </div>
</template>

<script>
import UserMenu from './user'
export default {
  extends: UserMenu
}
</script>
