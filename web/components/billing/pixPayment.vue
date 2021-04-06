<template>
  <div>
    <transition name="slide-fade" mode="out-in">
    <div v-if="$empty(payment)" class="vertical center middle mb-5" key="no-code">
      <div class="mb-5">
        <h6>Clique no botão abaixo para gerar um QR pagável do Pix.</h6>
      </div>
      <form-button @action="initiatePayment">Gerar QR Code</form-button>
    </div>
    <div v-else class="full-height vertical middle center mb-5" key="code">
      <div class="mb-4">
        <p>Também enviamos o código para seu email. <b>Validade {{ payment.due_date | date }}</b></p>
      </div>
      <vue-qrcode :value="payment.payment_code"></vue-qrcode>
    </div>
    </transition>
  </div>
</template>

<script>
import PaymentMethod from '@/components/billing/paymentMethod';
import { mapState, mapActions } from 'vuex';
import VueQrcode from 'vue-qrcode';

export default {
  extends: PaymentMethod,
  components: {
    VueQrcode
  },
  props: {
    billing:    { type: Object },
    instalment: { type: Object }
  },
  data() {
    return {
      successMessage: 'QR code gerado com sucesso. Utilize o app do seu banco e camera para realizar o pagamento'
    }
  },
  computed: {
    ...mapState({ payment: (state) => state.billing.payment }),
    paymentMethodPayload() {
      return { type: 'pix' };
    }
  },
  methods: {
    ...mapActions('billing', ['chargePayment'])
  }
}
</script>

<style lang="scss" scoped>

</style>