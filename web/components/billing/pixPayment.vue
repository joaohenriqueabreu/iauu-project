<template>
  <div>
    <div v-if="$empty(payment)" class="vertical center middle mb-5">
      <div class="mb-5">Somethind</div>
      <form-button @action="requestQRCode">Gerar QR Code</form-button>
    </div>
    <div v-else class="full-height vertical middle center">
      <vue-qrcode :value="payment.payment_code"></vue-qrcode>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import VueQrcode from 'vue-qrcode';
export default {
  components: {
    VueQrcode
  },
  props: {
    billing: { type: Object },
    instalment: { type: Object }
  },
  computed: {
    ...mapState({ payment: (state) => state.billing.payment }),
  },
  methods: {
    ...mapActions('billing', ['chargePayment']),
    async requestQRCode() {
      const payload = {
        billingId: this.billing.id,
        paymentMethod: { type: 'pix' },
      }

      if (!this.$empty(this.instalment)) {
        payload = {...payload, ...{instalmentId: this.instalment.id }};
      }

      try {
        await this.chargePayment(payload);
        this.$toast.success('Código do Pix gerado com sucesso');
      } catch (error) {
        this.$sentry.captureException(error);
        console.log(error);
        this.$toast.error('Tivemos um problema ao gerar o código do pix.');
      }
    }
  }
}
</script>

<style>

</style>