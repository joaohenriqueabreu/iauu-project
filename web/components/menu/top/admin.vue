<template>
  <div>
    <div class="menu-items">
      <nuxt-link to="/admin/dashboard">
        <h5>Dashboard</h5>
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
