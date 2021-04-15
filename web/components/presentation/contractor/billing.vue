<template>
  <div>
    <div v-if="presentation.is_proposal || !$empty(billing)">
      <div class="row mb-5">
        <div class="col-12 col-md-6 mb-4 mb-md-0">
          <div class="total">
            <h4 class="mb-3">Total</h4>
            <h4 class="text-right">{{ billing.total_amount | currency }}</h4>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <overlay edges v-if="billing.has_amount_due">
            <template v-slot:default>
              <div class="total">
                <h4>Pago</h4>
                <small class="mb-2">Valores pagos ou em processamento</small>
                <h4 class="text-right mb-2">{{ billing.total_paid | currency }}</h4>
                <progress-bar :complete="billing.total_paid / billing.total_amount * 100"></progress-bar>
              </div>
            </template>
            <template v-slot:hover>
              <div class="full-fill horizontal middle center" @click="openPaymentModal(billing.amount_due)">
                <h4>Pagar {{ billing.amount_due | currency }}</h4>
              </div>
            </template>
          </overlay>
          <div class="total" v-else>
            <h4>Pago</h4>
            <small class="mb-2">Valores pagos ou em processamento</small>
            <h4 class="text-right mb-3">{{ billing.total_paid | currency }}</h4>
            <progress-bar :complete="billing.total_paid / billing.total_amount * 100"></progress-bar>
          </div>
        </div>
      </div>
      <div class="mb-5" v-if="billing.has_amount_to_allocate">
        <hr>
        <h4 class="mb-3 text-center">Escolher forma de pagamento</h4>
        <form-button no-shadow class="half-width mb-4" @action="openPaymentModal(billing.amount_due)">Pagar saldo em aberto <u class="ml-2">{{ billing.amount_due | currency }}</u></form-button>
        <hr>
      </div>
      <div class="mb-5">
        <div class="mb-4">
          <h4>Parcelas</h4>
          <small>Clique em uma parcela em aberto para realizar o pagamento.</small>
        </div>
        <instalments-table :billing="billing" v-if="!$empty(billing.instalments)" @selected="openPayInstalmentModal"></instalments-table>
        <div v-else>
          <h6>Nenhuma parcela cadastrada.</h6>
          <small>Caso tenha negociado uma forma de pagamento da apresentação, entre em contato com o artista e peça para que ele cadastre as parcelas em seu painel, ou entre em contato com a nossa equipe de relacionamento.</small>
        </div>
      </div>
      <div class="mb-5">
        <h4 class="mb-4">Pagamentos</h4>
        <payments-table :billing="billing" v-if="!$empty(billing.payments)"></payments-table>
        <div v-else>
          <h6 class="mb-3">Nenhum pagamento realizado</h6>
          <h6 v-if="canPay" class="brand-hover clickable" @click="openPaymentModal">
            <u>Pagar apresentação</u>
          </h6>
        </div>
      </div>
    </div>
    <div v-else class="vertical middle center">
      <div class="text-center">
        <h3 class="mb-2">Total contratado</h3>
        <h6 class="mb-4">Aguardando confirmação da proposta</h6>
        <h1>{{ presentation.price | currency }}</h1>
      </div>
    </div>
    <modal ref="payment" small>
      <template v-slot:header><h4>Pagar apresentação</h4></template>
      <template v-slot:main>
        <payment-manager :billing="billing" :instalment="selectedInstalment" :amount-to-pay="amountToPay"></payment-manager>
      </template>
      <template v-slot:footer>
        <div class="horizontal middle center">
          <nuxt-link to="/terms" target="_blank" class="text-center">
            Em caso de dúvidas, clique aqui para revisar nossa política de pagamentos, privacidade de dados, taxas e fluxo de pagamentos.
          </nuxt-link>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
/** @requires presentation state to be loaded */
import { mapState, mapActions } from 'vuex';
import PaymentManager           from '@/components/billing/paymentManager';
import InstalmentsTable         from '@/components/billing/instalmentsTable';
import PaymentsTable            from '@/components/billing/paymentsTable';

export default {
  components: {
    PaymentManager,
    InstalmentsTable,
    PaymentsTable
  },
  data() {
    return {
      amountToPay:        0,
      selectedInstalment: null
    }
  },
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    ...mapState({ billing: (state) => state.billing.billing }),
    canPay() {
      return this.presentation.is_completed || (this.presentation.is_contracted && !this.presentation.is_past);
    }
  },
  async created() {
    await this.loadPresentationBilling(this.$route.params.id);
  }, 
  methods: {
    ...mapActions('billing', ['loadPresentationBilling']),
    openPayInstalmentModal(instalment) {
      this.selectedInstalment = instalment;
      this.$refs.payment.open();
    },
    closeInstalmentModal() {
      this.selectedInstalment = null;
      this.$refs.instalment.close();
    },
    openPaymentModal(amountToPay) {
      this.selectedInstalment = null;
      this.amountToPay        = amountToPay;
      this.$refs.payment.open();
    },
  }
}
</script>

<style lang="scss" scoped>
.failed {
  color: $error;
  font-weight: $bold;
}
.total {
  transition: $transition;
  border-radius: $edges;
  padding: 2 * $space;
  background: $layer5;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h1 {
    text-align: right;
  }
}
</style>