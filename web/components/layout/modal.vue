<template>
  <div>
    <portal to="modal">
      <v-modal :name="name" :adaptive="true" :click-to-close="true" height="auto">            
        <!-- Portal is used to render component code outside its definition (modal is rendered outside app div so it can take 100% width) -->
          <div class="modal-content" :class="[modalHeight, noPad ? 'no-pad' : '']">
            <header>
              <div class="close" @click="close">
                <icon icon="times"></icon>
              </div>
              <div v-show="!hideHeader" :class="headerCustomHeight">
                <slot name="header"></slot>
              </div>
            </header>
            <scrollbar>
              <main :class="height">
                <div v-if="hideHeader" class="mb-4">&nbsp;</div>
                <slot name="main"></slot>
              </main>
              <div v-show="!hideFooter" class="compensate-footer">&nbsp;</div>
            </scrollbar>
            <footer v-show="!hideFooter">
              <div :class="footerCustomHeight">
                <slot name="footer"></slot>
              </div>
            </footer>
          </div>
          <aside>
            <slot name="external"></slot>
          </aside>
        </v-modal>
    </portal>
  </div>
</template>

<script>
import { v4 } from 'uuid';

export default {
  props: {
    height:       { type: String, default: 'regular' },
    headerHeight: { type: String, default: null },
    footerHeight: { type: String, default: null },
    noPad:        { type: Boolean, default: false },

    // Or provide heights as params
    single:       { type: Boolean, default: false },
    tiny:         { type: Boolean, default: false },
    small:        { type: Boolean, default: false },
    regular:      { type: Boolean, default: true },
  },
  computed: {
    name: () => v4(),
    headerCustomHeight() {
      if (!this.$empty(this.headerHeight)) { return this.headerHeight }
      return this.modalHeight;
    },
    footerCustomHeight() {
      if (!this.$empty(this.footerHeight)) { return this.footerHeight }
      return this.modalHeight;
    },
    modalHeight() {
      if (this.single)  { return 'single'; }
      if (this.small)   { return 'small'; }
      if (this.tiny)    { return 'tiny'; }
      if (this.regular) { return 'regular'; }

      return this.height;
    },
    hideHeader() {
      return this.$slots.header == null;
    },
    hideFooter() {
      return this.$slots.footer == null;
    }
  },
  methods: {
    open()  { this.$modal.show(this.name); },
    close() { this.$modal.hide(this.name); },
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
  // background: rgba(0, 0, 0, 0.95);
  background: $layer5;
  opacity:    0.8;
  z-index:    auto;
}

.vm--modal {
  border-radius:  $edges;
  overflow:       inherit;
  background:     $layer2;
  z-index:    auto;
}

.vm--container {
  z-index: $moveToTop !important;
}
</style>

<style lang="scss" scoped>
.modal-content {
  z-index:    $moveToTop;
  background: $layer2;
  position:   relative;


  padding: 2 * $space;
  &.no-pad {
    padding: 0;
  }

  &.single  { height: 20vh; }
  &.tiny    { height: 50vh; }
  &.small   { height: 70vh; }
  &.regular { height: 85vh; }

  header {
    // @extend .vertical, .middle, .center;
    .tiny, .single  { height: 5vh; }
    .small          { height: 7vh; }
    .regular        { height: 10vh; }

    width:      100%;
    min-height: 2vh;

    position: relative;
    z-index:  $base;
    .close {
      text-align:     center;
      color:          $layer5;
      position:       absolute;
      cursor:         pointer;
      top:            -10px;
      right:          -15px;
      padding:        5px;
      // border-radius:  $rounded;
      // background:     $layer4;
      // box-shadow:     $shadow;
      // width:          30px;
      // height:         30px;
      // opacity:        1; // overwrite from some other style
      padding-left:   9px;
      z-index:        $moveToTop;
      [data-icon] {
        cursor:       pointer;
        position:     relative;
        &:hover { 
          transition: $transition;
          cursor:     pointer;
          color:      $brandLayer; 
        }
      }
      
    }
  }

  .ps { height: 100%; }

  main {
    position: relative;
    z-index:  $base;

    // .tiny     { height: 30vh; }
    // .small    { height: 50vh; }
    // .regular  { height: 75vh; }

    margin-bottom: 10vh;
    max-width: 100%;
    height: 100%;
  }

  footer {
    @extend     .vertical, .middle;
    position:   absolute;
    bottom:     0;
    left:       0;
    z-index:    $above;
    background: $layer2;
    width:      100%;
    width:      100%;
    min-height: 2vh;

    .tiny, .single  { height: 7vh; }
    .small          { height: 7vh; }
    .regular        { height: 10vh; }

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

  .compensate-footer {
    min-height: 15vh;
  }

}
</style>
