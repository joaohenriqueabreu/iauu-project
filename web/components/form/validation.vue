<template>
  <div>
    <div v-if="active" class="error">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
  font-size: $small;
  font-weight: $bold;
  letter-spacing: 0.1em;
}
</style>
