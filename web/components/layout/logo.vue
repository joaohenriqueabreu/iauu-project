<template>
  <img class="logo" :src="logoURL" :style="`height: ${height}px; width: ${width}px`"/>
</template>
<script>
export default {
  props: {
    height: { type: Number, default: 180 },
    width: { type: Number, default: 240 }
  },
  computed: {
    logoURL() { return this.$images('logo.png') }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  animation: 1s appear;
  margin: auto;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
