<template>
  <div>
    <label :for="name">{{ label }}</label>
    <div class="form-input">
      <v-selectize v-if="allowInput" :name="name" :settings="settings">
        <option v-for="(option, index) in selectizeOptions" :key="index" :value="option.value"
          >{{ option.display }}
        </option>
      </v-selectize>
      <select v-else required>
        <option disabled selected hidden value="" class="placeholder">{{ placeholder }}</option>
        <option v-for="(option, index) in selectizeOptions" :key="index" :value="option.value"
          >{{ option.display }}
        </option>
      </select>
      <font-awesome :icon="iconHelper"></font-awesome>
    </div>
  </div>
</template>

<script>
import VueSelectize from 'vue2-selectize'
import Input from '@/components/form/input'
export default {
  components: {
    'v-selectize': VueSelectize
  },
  extends: Input,
  props: {
    allowInput: { type: Boolean, default: true },
    options: { type: Array, default: () => [] },
    name: { type: String, default: '' },
    label: { type: String, default: '' },
    autoOpen: { type: Boolean, default: false },
    hideSelected: { type: Boolean, default: false }
  },
  computed: {
    iconHelper() {
      return !this.$utils.empty(this.icon) ? this.icon : 'arrow-down'
    },
    settings() {
      const self = this
      return {
        openOnFocus: self.autoOpen,
        hideSelected: self.hideSelected,
        placeholder: self.placeholder,
        onChange(value) {
          if (!self.$utils.empty(value)) {
            self.$emit('selected', value)
          }
        }
      }
    },
    selectizeOptions() {
      return this.$collection.map(this.options, (option) => {
        return { value: option, display: option }
      })
    }
  },
  methods: {}
}
</script>

<style lang="scss">
// Selectize overwrites
.selectize-control {
  .selectize-input {
    background: $layer1;
    border: none;
    border-radius: $edges;
    box-shadow: $shadow;
    transition: $transition;
    &.items.not-full.has-options::after {
      display: none;
    }

    &:hover {
      background: $layer3;
    }

    &.focus.input-active {
      transition: $transition;
      background: $layer3;
      input {
        color: $brand;
        font-weight: $bold;
      }
    }
    input {
      width: 100%;
    }
  }
  .selectize-dropdown {
    transition: $transition;
    background: $layer1;
    color: $brand;

    .option.active {
      color: $brand;
      background: $layer2;
    }
  }
}
</style>

<style lang="scss" scoped>
select {
  padding-right: 0;
  -webkit-appearance: none;

  &:invalid {
    color: gray;
  }

  &::after {
    content: none;
    background: $layer1;
    color: $layer1;
  }

  &::-ms-expand {
    display: none;
  }
}
</style>
