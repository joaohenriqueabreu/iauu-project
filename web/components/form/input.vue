<template>
  <div>
    <label :for="name">{{ label }}</label>
    <div class="form-input">
      <input
        :value="value"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur', value)"
        @keyup.enter.prevent="$emit('enter', value)"
      />
      <font-awesome v-if="iconHelper" :icon="iconHelper"></font-awesome>
    </div>
  </div>
</template>

<script>
import VueFilters from 'vue2-filters'

export default {
  filters: {
    getFilter(value, type) {
      if (type === 'numeric') {
        return VueFilters.Number(value)
      }

      return value
    }
  },
  props: {
    default: { type: [String, Number, Boolean], default: null },
    model: { type: Object, default: () => {} },
    prop: { type: String, default: '' },
    name: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: null },
    value: { type: [String, Number, Boolean], default: null },
    required: { type: Boolean, default: false }
  },
  computed: {
    type() {
      return 'text'
    },
    iconHelper() {
      return !this.$utils.empty(this.icon) ? this.icon : 'search'
    }
  },
}
</script>

<style lang="scss">
.form-input {
  position: relative;
  width: 100%;

  [data-icon] {
    position: absolute;
    opacity: 0.5;
    bottom: 50%;
    right: 0;
  }

  label {
    font-weight: $bold;
    margin-bottom: 2 * $space;
    margin-right: 2 * $space;
    color: $brand;
    text-transform: capitalize;
  }

  input,
  textarea,
  select {
    transition: $transition;
    width: 100%;
    border: none;
    border-radius: $edges;
    outline-color: transparent;
    font-size: $regular;
    resize: none;
    background-color: $layer1;
    color: $brand;
    font-weight: $bold;
    box-shadow: $lightShadow;
    margin-bottom: 2 * $space;
    padding: 2 * $space 5 * $space 2 * $space 2 * $space;
    cursor: pointer;

    &:focus,
    &:active {
      border-top-color: transparent;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;

      border: none;
      outline: none;

      transition: $transition;
      // background: $layer5;
      background: $brandLayer;
      color: $layer1;
    }
    &:hover {
      // background-color: $layer5;
      background-color: $brandLayer;
    }
  }

  div.error {
    position: absolute;
    bottom: -30px;
  }
}
</style>
