<template>
  <div>
    <div class="menu-items">
      <nuxt-link to="/search">
        <h6>Procurar artistas</h6>
      </nuxt-link>
      <nuxt-link to="/contractor/presentations">
        <h6>Apresentações</h6>
      </nuxt-link>
      <nuxt-link to="/referral">
        <h6>Renda passiva</h6>
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
