<template>
  <div>
    <div class="menu-items">
      <nuxt-link to="/search">
        <h5>Procurar artistas</h5>
      </nuxt-link>
      <nuxt-link to="/contractor/proposals">
        <h5>Propostas</h5>
      </nuxt-link>
      <nuxt-link to="/contractor/presentations">
        <h5>Apresentações</h5>
      </nuxt-link>
      <nuxt-link to="/referral">
        <h5>Renda passiva</h5>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import UserMenu from '@/components/menu/top/user'
export default {
  extends: UserMenu
}
</script>

<style lang="scss" scoped>
</style>
