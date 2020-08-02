<template>
  <div>
    <label :for="name">{{ label }}</label>
    <div class="form-input">
      <input
        v-mask="maskHelper"
        type="tel"
        :value="value"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="emitMasked"
        @keyup.enter="$emit('enter', value)"
      />
      <font-awesome v-if="iconHelper" :icon="iconHelper"></font-awesome>
    </div>
  </div>
</template>

<script>
import Input from '@/components/form/input'
const MASKS = {
  phone: ['(##) ####-####', '(##) #####-####'],
  document: ['###.###.###-##', '##.###.###/####-##'],
  agency: ['###', '###-#', '###-##'],
  bankAccount: ['###-#', '####-#', '#####-#', '######-#'],
  creditCard: ['#### #### #### ####'],
  cvc: ['###'],
  cardExpiry: ['##/##', '##/####']
}
export default {
  extends: Input,
  props: {
    mask: { type: String, default: '' }
  },
  computed: {
    type() {
      return 'email'
    },
    maskHelper() {
      return MASKS[this.mask]
    }
  },
  methods: {
    emitMasked(event) {
      const val = event.target.value
      // vue-the-mask triggers a first event on init cleaning up entry
      if (!this.$utils.empty(val) && val !== '(') {
        this.$emit('input', val)
      }
    }
  }
}
</script>
