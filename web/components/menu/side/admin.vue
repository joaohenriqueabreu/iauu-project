<template>
  <div>
    <div class="side-menu-items">
      <nuxt-link to="/admin/dashboard" :class="{ routed: routed('dashboard') }">
        <icon icon="chart-line"></icon>
        <span v-show="!minimized">Agenda</span>
      </nuxt-link>
      <nuxt-link to="/admin/users" :class="{ routed: routed('users') }">
        <icon icon="user-friends"></icon>
        <span v-show="!minimized">Usuários</span>
      </nuxt-link>
      <nuxt-link to="/admin/presentations" :class="{ routed: routed('presentations') }">
        <icon icon="music"></icon>
        <span v-show="!minimized">Apresentações</span>
      </nuxt-link>
      <nuxt-link to="/admin/billings" :class="{ routed: routed('billings') }">
        <icon icon="dollar-sign"></icon>
        <span v-show="!minimized">Pagamentos</span>
      </nuxt-link>
      <nuxt-link to="/admin/referrals" :class="{ routed: routed('referrals') }">
        <icon icon="bullhorn"></icon>
        <span v-show="!minimized">Renda Passiva</span>
      </nuxt-link>
      <nuxt-link to="/admin/reports" :class="{ routed: routed('reports') }">
        <icon icon="list"></icon>
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
