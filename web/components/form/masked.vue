<template>
  <div>
    <label v-if="!$empty(label)" :for="name">{{ label }}</label>
    <h6 v-else class="mb-2"><slot></slot></h6>
    <div class="form-input">
      <input
        v-mask="maskHelper"
        type="text"
        :value="value"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="emitMasked"
        @focus="$emit('focus', value)"
        @blur="$emit('blur', value)"
        @keyup.enter="$emit('enter', value)"
      />
      <icon v-if="iconHelper" :icon="iconHelper"></icon>
    </div>
  </div>
</template>

<script>
import Input from '@/components/form/input';

const MASKS = {
  phone: ['(##) ####-####', '(##) #####-####'],
  document: ['###.###.###-##', '##.###.###/####-##'],
  // agency: ['###', '###-#', '###-##'],
  // bankAccount: ['###-#', '####-#', '#####-#', '######-#', '#######-#', '########-#', '#########-#', '##########-#'],
  creditCard: ['#### #### #### ####'],
  cvc: ['###'],
  expiryDate: ['##/##', '##/####']
}
export default {
  extends: Input,
  props: {
    mask: { type: String, default: '' },
  },
  computed: {
    type() {
      return 'email';
    },
    maskHelper() {
      return MASKS[this.mask];
    },
    raw() {
      return this.value.replace(/[^a-zA-Z0-9 ]/g, '');
    }
  },
  methods: {
    emitMasked(event) {
      const val = event.target.value;

      // vue-the-mask triggers a first event on init cleaning up entry
      if (!this.$utils.empty(val) && val !== '(') {
        this.$emit('input', val);
      }
    }
  }
}
</script>
