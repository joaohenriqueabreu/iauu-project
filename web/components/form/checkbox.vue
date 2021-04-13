<template>
  <div class="horizontal middle">
    <input ref="checkbox" type="checkbox" :checked="checked" class="clickable mr-2" @change="$emit('change', $event.target.checked)"/>
    <span @click="click">
      <icon v-if="checked" icon="check"></icon>
    </span>
    <slot></slot>
  </div>
</template>

<script>
import FormInput from './input'
export default {
  extends: FormInput,
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: { type: Boolean, default: false }
  },
  methods: {
    click() {
      this.$refs.checkbox.click()
    }
  }
}
</script>

<style lang="scss" scoped>
input[type='checkbox'] {
  display: none;

  + span {
    @extend .vertical, .middle, .center;
    padding: $space;
    margin-right: 2 * $space;
    cursor: pointer;
    width: 2 * $space;
    height: 2 * $space;
    background: $layer1;
    box-shadow: $shadow;
    transition: $transition;
    &:hover {
      transition: $transition;
      background: $layer5;
    }
    [data-icon] {
      transition: $transition;
      margin: 0;
    }
  }
}
</style>
