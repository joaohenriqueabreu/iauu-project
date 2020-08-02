<template>
  <div>
    <div class="menu-items">
      <nuxt-link to="/artist/schedule">
        <h6>Agenda</h6>
      </nuxt-link>
      <nuxt-link to="/artist/incorporate">
        <h6>Venda mais shows</h6>
      </nuxt-link>
      <nuxt-link to="/artist/products">
        <h6>Formatos de apresentação</h6>
      </nuxt-link>
      <nuxt-link to="/artist/profile">
        <h6>Perfil</h6>
      </nuxt-link>
      <nuxt-link to="/logout">
        <h6>Sair</h6>
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
