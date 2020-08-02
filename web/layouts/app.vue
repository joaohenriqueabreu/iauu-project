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
    ...mapState({ alert: (state) => state.app.alert })
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
  position: relative;
  min-height: 10vh;
  padding: 10px 0;
  background: transparent;
  z-index: $above;
}

main {
  position: relative;
  padding: 0 20px;
  padding-bottom: 8 * $space;

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
