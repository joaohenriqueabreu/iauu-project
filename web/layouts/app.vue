<template>
  <div class="content">
    <client-only>
      <aside :class="minimized ? 'mini' : 'full'">
        <side-menu @minimize="minimize"></side-menu>
      </aside>
        <div class="app">
          <header class="d-flex justify-content-end">
            <top-menu></top-menu>
          </header>
          <main>
            <alert></alert>
            <nuxt />
          </main>
        </div>
      <feedback v-if="showFeedback"></feedback>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TopMenu from '@/components/menu/top'
import SideMenu from '@/components/menu/side'

export default {
  components: {
    'side-menu': SideMenu,
    'top-menu': TopMenu
  },
  data() {
    return {
      minimized: false
    }
  },
  computed: {
    ...mapState({ theme: (state) => state.layout.theme }),
    ...mapState({ alert: (state) => state.app.alert }),
    showFeedback() {
      return process.env.BETA_MODE
    }
  },
  methods: {
    minimize(value) {
      this.minimized = value
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  @include desktop {
    display: flex;
    flex-direction: row;
  }

  .app {
    width: 100%;
    header {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      z-index: $above;
      height: 10vh;
      background: transparent;
      padding-right: 1vw;
    }

    main {
      position: relative;  
      margin: 10vh 2vw 20vh 2vw;
      z-index: $base;
      transition: $transition;
      max-height: 90vw;
    }
  }

  aside {
    background: $layer1;
    position: relative;
    z-index: $secondLayer;
    transition: $transition;    

    @include desktop {
      &.mini { width: 7vw; }
      &.full { width: 15vw; }

      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    @include mobile {
      position: fixed;
      bottom: 0;

      display: flex;
      flex-direction: row;
      width: 100vw;
      height: 10vh;
    }
  }
}
</style>
