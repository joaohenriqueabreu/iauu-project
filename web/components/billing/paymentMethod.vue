<script>
export default {
  methods: {
    async initiatePayment() {
      let payload = {
        billingId:      this.billing.id,
        paymentMethod:  this.paymentMethodPayload
      }

      if (!this.$empty(this.instalment)) {
          payload = {...payload, ...{ instalmentId: this.instalment.id }};
      }

      console.log(payload);

      try {
          await this.chargePayment(payload);
          this.$toast.success(this.successMessage || 'Pagamento iniciado com sucesso. Acompanhe o status na página de faturamento.');
      } catch (error) {
          this.$sentry.captureException(error);
          console.log(error);
          this.$toast.error(this.errorMessage || 'Tivemos um problema ao iniciar o pagamento. Entre em contato com nossa equipe imediatamente.');
      }
    }
  }
}
</script>