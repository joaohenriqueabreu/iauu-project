<template>
  <div>
    <div v-if="presentation.is_proposal || !$empty(billing)">
      <div class="row mb-5">
        <div class="col-12 mb-4">
          <div class="total">
            <h4 class="mb-3">Total</h4>
            <h1 class="text-right">{{ billing.total_amount | currency }}</h1>
          </div>
        </div>
        <div class="col">
          <div class="total">
            <h4 class="mb-2">Iniciado</h4>
            <small>Pagamento com cartão, ou boleto emito, ou código Pix gerado ainda válidos</small>
            <h4 class="text-right">{{ billing.total_paid | currency }}</h4>
          </div>
        </div>
        <div class="col">
          <div class="total">
            <h4 class="mb-3">Pago</h4>
            <h4 class="text-right">{{ billing.total_paid | currency }}</h4>
          </div>
        </div>
        <div class="col">
          <overlay edges>
            <template v-slot:default>
              <div class="total">
                <h4>Pendente</h4>
                <small class="mb-4">Clique para pagar o saldo em aberto</small>
                <h4 class="text-right">{{ billing.amount_due | currency }}</h4>
              </div>
            </template>
            <template v-slot:hover>
              <div class="full-fill horizontal middle center" @click="openPaymentModal(billing.amount_due)">
                <h4>Pagar {{ billing.amount_due | currency }}</h4>
              </div>
            </template>
          </overlay>
        </div>
      </div>
      <div class="mb-5 boxed">
        <h4 class="mb-4">Parcelas</h4>
        <table class="table" v-if="!$empty(billing.instalments)">
          <thead>
            <tr>
              <th>#</th>
              <th>Valor</th>
              <th>Pago</th>
              <th>Data de Vencimento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(instalment, index) in billing.instalments" :key="index">
              <td>{{ instalment.num }}</td>
              <td>{{ instalment.amount }}</td>
              <td>{{ instalment.due_dt | date }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h6>Nenhuma parcela cadastrada.</h6>
          <small>Caso tenha negociado uma forma de pagamento da apresentação, entre em contato com o artista e peça para que ele cadastre as parcelas em seu painel, ou entre em contato com a nossa equipe de relacionamento.</small>
        </div>
      </div>
      <div class="mb-5">
        <h4 class="mb-4">Pagamentos</h4>
        <table class="table" v-if="!$empty(billing.payments)">
          <thead>
            <tr>
              <th>Id</th>
              <th>Parcela</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Pago</th>
              <th>Data Pagamento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in billing.payments" :key="index" @click="openPaymentInfoModal(payment)">
              <td>{{ paymentId(payment) }}</td>
              <td>{{ payment.status | translate('billing.payment.status') }}</td>
              <td>{{ payment.amount | currency }}</td>
              <td>{{ payment.paid_amount | currency }}</td>
              <td>{{ payment.due_dt | date }}</td>
              <td>{{ payment.paid_dt | date }}</td>
            </tr>
          </tbody>
        </table>
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
        <payment-form :billing="billing" :amount-to-pay="amountToPay"></payment-form>
      </template>
      <template v-slot:footer>
        <div class="horizontal middle center">
          <nuxt-link to="/terms" target="_blank" class="text-center">
            Em caso de dúvidas, clique aqui para revisar nossa política de pagamentos, privacidade de dados, taxas e fluxo de pagamentos.
          </nuxt-link>
        </div>
      </template>
    </modal>
    <modal ref="paymentInfo">
      <template v-slot:header v-if="selectedPayment"><h4>Detalhes do pagamento {{ paymentId(selectedPayment) }}</h4></template>
      <template v-slot:main>
        <paymen-info :payment="selectedPayment"></paymen-info>
      </template>
    </modal>
  </div>
</template>

<script>
/** @requires presentation state to be loaded */
import { mapState, mapActions } from 'vuex';
import PaymentForm from '@/components/billing/payment';
export default {
  components: {
    PaymentForm
  },
  data() {
    return {
      amountToPay: { type: Number, default: 0 },
      selectedPayment: { type: Object, default: () => {}}
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
    paymentId(payment) {
      return payment.id.substr(0, 4);
    },
    openPaymentModal(amountToPay) {
      this.amountToPay = amountToPay;
      this.$refs.payment.open();
    },
    openPaymentInfoModal(payment) {
      this.selectedPayment = payment;
      this.$refs.paymentInfo.open();
    }
  }
}
</script>

<style lang="scss" scoped>
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