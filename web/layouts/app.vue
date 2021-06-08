<template>
  <div class="content">
    <client-only>
      <aside :class="minimized ? 'mini' : 'full'">
        <side-menu @minimize="minimize"></side-menu>
      </aside>
      <div class="app">
        <header class="d-flex justify-content-end">
          <top-menu :scroll-height="scrollHeight"></top-menu>
        </header>
        <scrollbar @ps-scroll-y="handleScroll">
          <main>
            <alert></alert>
            <nuxt />
          </main>
        </scrollbar>
      </div>
      <feedback v-if="showFeedback"></feedback>
    </client-only>
    <portal-target name="modal" multiple></portal-target>
    <portal-target name="chat" class="chat-position"></portal-target>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TopMenu from '@/components/menu/top';
import SideMenu from '@/components/menu/side';

export default {
  components: {
    'side-menu': SideMenu,
    'top-menu': TopMenu
  },
  data() {
    return {
      minimized: false,
      scrollHeight: 0
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
    },
    handleScroll(evt) {
      // TODO maybe better to move this to store
      this.scrollHeight = evt.target.scrollTop;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  @include desktop {
    display:          flex;
    flex-direction:   row;
  }

  .app {
    width:            100%;
    position:         relative;
    header {
      position:       fixed;
      top:            0;
      right:          0;
      width:          100%;
      z-index:        $above;
      height:         10vh;
      background:     transparent;
      padding-right:  1vw;
    }

    main {
      @include desktop() {
        position:       relative;  
        margin:         10vh 2vw 20vh 2vw;
        z-index:        $base;
        transition:     $transition;
        max-height:     90vw;
        width:          85vw;
      }      
    }
  }

  aside {
    background:       $layer1;
    position:         relative;
    z-index:          $secondLayer;
    transition:       $transition;    

    @include desktop {
      &.mini {
        width:        7vw; 
      }
      &.full { 
        width:        15vw; 
      }

      display:        flex;
      flex-direction: column;
      height:         100vh;
    }

    @include mobile {
      position:       fixed;
      bottom:         0;

      display:        flex;
      flex-direction: row;
      width:          100vw;
      height:         10vh;
    }
  }
}

.chat-position {
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: $moveToTop;
}

// .modal-portal {
//   @extend .vertical, .center, .middle;
//   position: absolute;
//   top: 50%;
// }
</style>
