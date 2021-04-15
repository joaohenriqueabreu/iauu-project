<template>
  <div>
    <transition name="slide-fade" mode="out-in">
      <div v-if="$empty(payment)" class="vertical center middle mb-5" key="no-barcode">
        <div class="mb-5">
          <h6>Clique no botão abaixo para gerar o boleto do pagamento.</h6>
        </div>
        <form-button @action="initiatePayment">Gerar Boleto</form-button>
      </div>
      <div v-else class="full-height vertical middle center mb-5" key="barcode">
        <div class="mb-4">
          <p>Também enviamos o boleto para seu email. <b>Vence em {{ payment.due_at | date }}</b></p>
        </div>
        <a :href="payment.charge_url" target="_blank">
          <img :src="$images('boleto-minuature.png')" class="mini" width="150" height="200">
        </a>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PaymentMethod from '@/components/billing/paymentMethod';
export default {
  extends: PaymentMethod,
  props: {
    billing: { type: Object },
    instalment: { type: Object }
  },
  data() {
    return {
      successMessage: 'Boleto gerado com sucesso. Clique na imagem abaixo para visualizar o documento.'
    }
  },
  computed: {
    ...mapState({ payment: (state) => state.billing.payment }),
    paymentMethodPayload() {
      return { type: 'boleto' }
    },
  },
  methods: {
    ...mapActions('billing', ['chargePayment'])
  }
}
</script>

<style lang="scss" scoped>
  .min {
    max-height: 100%;
    max-width: 50%;
    object-fit: contain;
  }
</style>