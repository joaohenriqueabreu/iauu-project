<template>
  <div>
    <v-modal
      :name="name"
      :adaptive="true"
      :click-to-close="true"
      height="auto"
      @before-open="disableBodyScroll"
      @before-close="enableBodyScroll"
    >
      <div class="modal-content" :class="height">
        <header v-show="!hideHeader" :class="height">
          <div class="close" @click="close">
            <font-awesome icon="times"></font-awesome>
          </div>
          <slot name="header"></slot>
        </header>
        <perfect-scrollbar>
          <main :class="height">
            <slot name="main"></slot>
          </main>
        </perfect-scrollbar>
        <footer :class="height">
          <slot name="footer"></slot>
        </footer>
      </div>
      <aside>
        <slot name="external"></slot>
      </aside>
    </v-modal>
  </div>
</template>

<script>
import { v4 } from 'uuid'
export default {
  props: {
    height: { type: String, default: 'regular' },
    hideHeader: { type: Boolean, default: false }
  },
  computed: {
    name: () => v4()
  },
  methods: {
    open() {
      this.$modal.show(this.name)
    },
    close() {
      this.$modal.hide(this.name)
    },
    disableBodyScroll() {
      document.getElementsByTagName('body')[0].classList.add('disable-scroll')
    },
    enableBodyScroll() {
      document.getElementsByTagName('body')[0].classList.remove('disable-scroll')
    }
  }
}
</script>

<style lang="scss">
/*Overriding modal css*/
.vm--overlay {
  background: rgba(0, 0, 0, 0.95);
}

.vm--modal {
  border-radius: $edges;
  overflow: inherit;
  background: $layer2;
}
</style>

<style lang="scss" scoped>
.modal-content {
  z-index: $above;
  background: $layer2;
  padding: 2 * $space;

  // &.tiny {
  //   height: 50vh;
  // }
  // &.small {
  //   height: 70vh;
  // }
  // &.regular {
  //   height: 95vh;
  // }

  header {
    // @extend .vertical, .middle, .center;
    width: 100%;
    &.tiny {
      height: 5vh;
    }
    &.small {
      height: 7vh;
    }
    &.regular {
      height: 10vh;
    }

    position: relative;
    .close {
      text-align: center;
      position: absolute;
      cursor: pointer;
      top: -10px;
      right: -10px;
      padding: 5px;
      border-radius: $rounded;
      background: $layer4;
      box-shadow: $shadow;
      width: 30px;
      height: 30px;
      opacity: 1; // overwrite from some other style
      padding-left: 9px;
    }
  }

  main {
    position: relative;

    &.tiny {
      height: 30vh;
    }
    &.small {
      height: 50vh;
    }
    &.regular {
      height: 75vh;
    }
  }

  footer {
    position: relative;
    &.tiny {
      height: 5vh;
    }
    &.small {
      height: 7vh;
    }
    &.regular {
      height: 10vh;
    }
    padding: 0 4 * $space;
    z-index: auto;
  }

  aside {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  [data-icon] {
    transition: $transition;
    color: $brand;
    font-size: $huge;
    cursor: pointer;
    z-index: $moveToTop;
    &:hover {
      transition: $transition;
      color: $layer3;
    }
  }
}
</style>
