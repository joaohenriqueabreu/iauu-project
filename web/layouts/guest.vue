<template>
  <div :class="theme" class="page">
    <header>
      <landing-nav ref="nav"></landing-nav>
    </header>
    <main>
      <nuxt />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LandingNav from '@/components/menu/landing'
export default {
  components: {
    'landing-nav': LandingNav
  },
  computed: {
    ...mapState({ theme: (state) => state.layout.theme })
  }
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  width: 100vw;
  z-index: $moveToTop;
  height: 10vh;
  background: transparent;
}

main {
  min-height: 100vh;
  // overflow:   scroll;
  padding-top: 10vh;
}
</style>
