<template>
  <div class="text-center">
    <div class="mb-4">
      <p>Também enviamos o código para seu email. <b :class="payment.is_overdue ? 'error': ''">Vence em {{ payment.due_dt | date }}</b></p>
    </div>
    <vue-qrcode :value="payment.payment_code"></vue-qrcode>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode';
export default {
  components: {
    VueQrcode
  },
  props: {
    payment: {}
  }
}
</script>

<style>

</style>