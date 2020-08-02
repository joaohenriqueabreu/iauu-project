<template>
  <div class="horizontal middle">
    <h6><slot></slot></h6>
    <span class="mr-2"></span>
    <toggle-button :value="value" @change="change"></toggle-button>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false }
  },
  methods: {
    change(target) {
      this.$emit('input', target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-switch-core {
  box-shadow: $lightShadow;
}
</style>
