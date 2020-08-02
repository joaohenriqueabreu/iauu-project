<template>
  <div class="horizontal middle">
    <input ref="checkbox" type="checkbox" v-bind:checked="checked" v-on:change="$emit('change', $event.target.checked)" class="clickable mr-2">
    <span @click="click">
      <font-awesome v-if="checked" icon="check"></font-awesome>
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
input[type="checkbox"] {
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