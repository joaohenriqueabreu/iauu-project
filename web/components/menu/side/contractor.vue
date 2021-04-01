<template>
  <div>
    <div class="side-menu-items">
      <nuxt-link to="/search">
        <icon icon="search"></icon>
        <span v-show="!minimized">Pesquisar</span>
      </nuxt-link>
      <nuxt-link to="/contractor/presentations" :class="{ routed: routed('presentations') }">
        <icon icon="music"></icon>
        <span v-show="!minimized">Apresentações</span>
      </nuxt-link>
      <nuxt-link to="/contractor/proposals" :class="{ routed: routed('proposals') }">
        <icon icon="search-dollar"></icon>
        <span v-show="!minimized">Propostas</span>
      </nuxt-link>
      <nuxt-link to="/user/account" :class="{ routed: routed('profile') }">
        <icon icon="user"></icon>
        <span v-show="!minimized">Perfil</span>
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
