<template>
  <div>
    <v-modal :name="name" :adaptive="true" :click-to-close="true" height="auto">
    <!-- TODO This is breaking artist profile page, not showing scrollbar - investigate -->
    <!-- @before-open="disableBodyScroll"
    @before-close="enableBodyScroll" -->
      <div class="modal-content" :class="[modalHeight, noPad ? 'no-pad' : '']">
        <header v-show="!hideHeader" :class="headerCustomHeight">
          <div class="close" @click="close">
            <icon icon="times"></icon>
          </div>
          <slot name="header"></slot>
        </header>
        <scrollbar>
          <main :class="height">
            <slot name="main"></slot>
          </main>
        </scrollbar>
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
    // Or provide heights as params
    small: { type: Boolean, default: false },

    headerHeight: { type: String, default: null },
    hideHeader: { type: Boolean, default: false },
    noPad: { type: Boolean, default: false }
  },
  computed: {
    name: () => v4(),
    headerCustomHeight() {
      if (!this.$empty(this.headerHeight)) { return this.headerHeight }
      return this.modalHeight;
    },
    modalHeight() {
      if (this.small) { return 'small'; }
      if (this.tiny) { return 'tiny'; }

      return this.height;
    }
  },
  methods: {
    open() {
      this.$modal.show(this.name)
    },
    close() {
      this.$modal.hide(this.name)
    },
    // disableBodyScroll() {
    //   document.getElementsByTagName('body')[0].classList.add('disable-scroll')
    // },
    // enableBodyScroll() {
    //   document.getElementsByTagName('body')[0].classList.remove('disable-scroll')
    // }
  }
}
</script>

<style lang="scss">
/*Overriding modal css*/
.vm--overlay {
  background: rgba(0, 0, 0, 0.95);
  z-index: auto;
}

.vm--modal {
  border-radius: $edges;
  overflow: inherit;
  background: $layer2;
  z-index: auto;
}

.vm--container {
  z-index: $moveToTop !important;
}
</style>

<style lang="scss" scoped>
.modal-content {
  z-index: $thridLayer;
  background: $layer2;
  position: relative;


  padding: 2 * $space;
  &.no-pad {
    padding: 0;
  }

  &.tiny {
    height: 50vh;
  }
  &.small {
    height: 70vh;
  }
  &.regular {
    height: 95vh;
  }

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
      z-index: $above;
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

    margin-bottom: 10vh;
  }

  footer {
    @extend .vertical, .middle;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: $above;
    background: $layer2;
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
