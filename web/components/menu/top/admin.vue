<template>
  <div>
    <div class="menu-items">
      <nuxt-link to="/admin/dashboard">
        <h6>Dashboard</h6>
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
