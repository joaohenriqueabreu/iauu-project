<template>
  <div class="content">
    <client-only>
      <aside :class="minimized ? 'mini' : 'full'">
        <side-menu @minimize="minimize"></side-menu>
      </aside>
      <div class="vertical">
        <header class="d-flex justify-content-end">
          <top-menu></top-menu>
        </header>
        <main :class="minimized ? 'shorter' : 'full'">
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
      minimized: true
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
header {
  position: fixed;
  width: 100vw;
  z-index: $above;
  height: 10vh;
  background: transparent;
}

main {
  position: relative;  
  padding-top: 10vh;
  padding-left: 2vw;
  padding-right: 1vw;
  padding-bottom: 20vh;

  @include desktop {
    &.full {
      margin-left: 15vw;
    }

    &.shorter {
      margin-left: 7vw;
    }
  }
}

aside {
  background: $layer1;
  position: fixed;
  left: 0;
  z-index: $moveToTop;
  @include desktop {
    .mini {
      width: 7vw;
    }

    .full {
      width: 15vw;
    }

    display: flex;
    flex-direction: column;
    stop: 0;
    height: 100vh;
  }

  @include mobile {
    display: flex;
    flex-direction: row;
    bottom: 0;
    width: 100vw;
    height: 10vh;
  }
}
</style>
