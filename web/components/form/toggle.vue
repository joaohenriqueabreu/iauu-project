<template>
  <div class="horizontal middle">
    <h6 class="mr-2"><slot name="before"></slot></h6>
    <h6 class="mr-2"><slot name="off"></slot></h6>
    <toggle-button :value="value" @change="change"></toggle-button>
    <h6 class="ml-2"><slot name="on"></slot></h6>
    <h6 class="mr-2"><slot name="after"></slot></h6>
  </div>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'
export default {
  components: {
    ToggleButton
  },
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
