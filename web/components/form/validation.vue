<template>
  <div>
    <div v-if="error" class="error">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// Internalizing validation didn't work out very well. Also we lose the power to prevent submit (having to use ref from external component)

// import { required, numeric, minValue, maxValue, minLength, maxLength, alphaNum, helpers } from 'vuelidate/lib/validators'

// const minTime = function (value) {
//   return this.$date.convertTimeToNumber(value) >= this.$config.minDurationInMinutes
// }

// const strongPassword = function (passwordValue) {
//   return (
//     /[a-z]/.test(passwordValue) && // checks for a-z
//     /[0-9]/.test(passwordValue) && // checks for 0-9
//     /\W|_/.test(passwordValue) && // checks for special char
//     passwordValue.length >= this.$config.auth.minPasswordLen
//   );
// }

// const same = (as) => (value) => value === as;

// // Visa, Mastercard, Diners, Amex, etc...
// const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})? | (?:5[1-5][0-9]{2} | 222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12} | 3[47][0-9]{13} | 3(?:0[0-5]|[68][0-9])[0-9]{11} | 6(?:011|5[0-9]{2})[0-9]{12} | (?:2131|1800|35\d{3})\d{11})$/;
// const cardExpiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
// const cardCVCRegex = /^[0-9]{3,4}$/;
// const bankAccountRegex = /^\d+-\d{1}$/;

export default {
  props: {
    // value: null,
    // required: { type: Boolean, default: false },
    // email: { type: Boolean, default: false },
    // numeric: { type: Boolean, default: false },
    // password: { type: Boolean, default: false },
    // alpha: { type: Boolean, default: false },
    // bank: { type: Boolean, default: false },
    // cardNumber: { type: Boolean, default: false },
    // cardExpiry: { type: Boolean, default: false },
    // cardCVC: { type: Boolean, default: false },
    // min: { type: Number, default: undefined },
    // max: { type: Number, default: undefined },
    // minLength: { type: Number, default: undefined },
    // maxLength: { type: Number, default: undefined },
    // minTime: { type: Number, default: undefined },
    // sameAs: null, // any

    error: { type: Boolean, default: false },
  },
  // validations() {
  //   const rules = { value: {}};
  //   if (this.required) { rules.value = {...required }; }
  //   if (this.email) { rules.value = {...email }; }
  //   if (this.numeric) { rules.value = {...numeric }; }
  //   if (this.password) { rules.value = {...strongPassword }; }
  //   if (this.min != null) { rules.value = {...minValue(this.min) }; }
  //   if (this.max != null) { rules.value = {...maxValue(this.max) }; }
  //   if (this.minLength != null) { rules.value = {...minLength(this.minLength) }; }
  //   if (this.maxLength != null) { rules.value = {...maxLength(this.maxLength) }; }
  //   if (this.minTime) { rules.value = {...minTime }; }
  //   if (this.alpha) { rules.value = {...alphaNum }; }
  //   if (this.bank) { rules.value = {...helpers.regex('bankAccountNumber', bankAccountRegex) }; }
  //   if (this.cardNumber) { rules.value = {...helpers.regex('cardNumber', cardNumberRegex) }; }
  //   if (this.cardExpiry) { rules.value = {...helpers.regex('cardExpiry', cardExpiryRegex) }; }
  //   if (this.cardCVC) { rules.value = {...helpers.regex('cardCVC', cardCVCRegex) }; }
  //   if (this.sameAs != null) { rules.value = {...same(this.sameAs) }; }

  //   return rules;
  // },
  // methods: {
  //   hasError() { return this.$v.value.$error; }
  // } 
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
