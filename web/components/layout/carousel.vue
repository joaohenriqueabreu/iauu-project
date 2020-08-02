<template>
  <vue-carousel :perPageCustom="[[0, 1], [768, 2], [1024, 3]]" :navigationEnabled="navigate">
    <slot></slot>
  </vue-carousel>
</template>

<script>
import { Carousel } from 'vue-carousel'
export default {
  components: {
    'vue-carousel': Carousel
  },
  props: {
    pages: 0,
    navigate: false
  }
}
</script>

<!-- VueCarousel overrides -->
<style lang="scss">
.VueCarousel-pagination {
  height: 2vh;
  .VueCarousel-dot-container {
    margin-top: 0 !important;
  }
}
</style>