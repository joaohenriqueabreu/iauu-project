<template>
  <nav :class="theme" class="navbar d-flex justify-content-between">
    <div>
      <nuxt-link to="/">
        <logo :height="50" :width="50"></logo>
      </nuxt-link>
    </div>
    <div class="full-height">
      <top-menu class="full-height"></top-menu>
    </div>
  </nav>
</template>

<script>
import TopMenu from '@/components/menu/top'
export default {
  components: {
    'top-menu': TopMenu
  },
  data() {
    return {
      theme: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  @extend .full-height, .horizontal, .middle;
}
// nav {
//   transition: $transition;
//   background: $layer1;

//   .transparent {
//     transition: $transition;
//     background: transparent;
//   }
// }
</style>
