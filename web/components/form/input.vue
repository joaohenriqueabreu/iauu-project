<template>
  <div>
    <label v-if="!$empty(label)" :for="name" :class="labelClass">{{ label }}</label>
    <h6 v-else class="mb-2"><slot></slot></h6>
    <div class="form-input">
      <input
        :value="value"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="transparent ? 'transparent' : ''"
        :min="min" 
        @input="afterInput"
        @blur="afterBlur"
        @keyup.enter.prevent="afterEnter"
      />
      <icon v-if="!noIcon && !$empty(iconHelper)" :icon="iconHelper"></icon>
    </div>
  </div>
</template>

<script>
import VueFilters from 'vue2-filters';

export default {
  filters: {
    getFilter(value, type) {
      if (type === 'numeric') { return VueFilters.Number(value); }
      return value;
    }
  },
  props: {
    default:      { type: [String, Number, Boolean], default: null },
    model:        { type: Object, default: () => {} },
    prop:         { type: String, default: '' },
    name:         { type: String, default: '' },
    label:        { type: String, default: '' },
    labelClass:   { type: String, default: '' },
    placeholder:  { type: String, default: '' },
    disabled:     { type: Boolean, default: false },
    icon:         { type: String, default: null },
    noIcon:       { type: Boolean, default: false },
    value:        { type: [String, Number, Boolean], default: null },
    required:     { type: Boolean, default: false },
    transparent:  { type: Boolean, default: false },
  },
  computed: {
    type() {
      return 'text';
    },
    iconHelper() {
      // return !this.$empty(this.icon) ? this.icon : null;
      return this.icon;
    },
    min() {
      // used for date form inputs
      return '';
    }
  },
  methods: {
    afterInput(event) {
      this.$emit('input', event.target.value);
    },
    afterBlur(value) {
      this.$emit('blur', value);
    },
    afterEnter(value) {
      this.$emit('enter', value);
    }
  }
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

    &::placeholder {
      transition: $transition;
    }

    &.transparent {
      background-color: transparent;

      &::placeholder {
        transition: $transition;
        color: $white;
        opacity: 0.7;
      }
    }

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
      transition: $transition;
      // background-color: $layer5;
      // background-color: $brandLayer;
      &::placeholder {
        transition: $transition;
        color: $brandLayer;
      }
    }
  }

  div.error {
    position: absolute;
    bottom: -30px;
  }
}
</style>
