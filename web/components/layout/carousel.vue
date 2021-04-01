<template>
  <!-- <vue-carousel :per-page-custom="[[0, 1],[768, 2],[1024, 3]]" :per-page="slidesPerPage" :navigation-enabled="navigate" :pagination-enabled="paginate"> -->
  <vue-carousel :per-page="slidesPerPage" :navigation-enabled="navigate" :pagination-enabled="paginate">
    <slot></slot>
    <slide class="empty">
      <div></div>
    </slide>
  </vue-carousel>
</template>

<script>
import { Carousel } from 'vue-carousel';
export default {
  components: {
    'vue-carousel': Carousel
  },
  props: {
    pages: 0,
    slidesPerPage: { type: Number },
    navigate: false,
    paginate: true,
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

<style lang="scss" scoped>
.empty {
  background: none !important;
  color: none !important;
  width: 0 !important;
}
</style>