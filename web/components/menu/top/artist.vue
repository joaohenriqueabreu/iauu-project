<template>
  <div>
    <div class="menu-items">
      <nuxt-link to="/artist/schedule">
        <h5>Agenda</h5>
      </nuxt-link>
      <nuxt-link to="/artist/incorporate">
        <h5>Venda mais shows</h5>
      </nuxt-link>
      <nuxt-link to="/artist/products">
        <h5>Formatos de apresentação</h5>
      </nuxt-link>
      <nuxt-link to="/referral">
        <h5>Renda passiva</h5>
      </nuxt-link>
      <nuxt-link to="/artist/profile">
        <h5>Gerenciar banda</h5>
      </nuxt-link>
      <nuxt-link to="/artist/reports">
        <h5>Relatórios</h5>
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
