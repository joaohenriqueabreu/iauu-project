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
          <div class="total">
            <h4>Pago</h4>
            <small class="mb-2">Valores pagos ou em processamento</small>
            <h4 class="text-right mb-3">{{ billing.total_paid | currency }}</h4>
            <progress-bar :complete="billing.total_paid / billing.total_amount * 100"></progress-bar>
          </div>
        </div>
      </div>
      <div class="mb-5">
        <h4 class="mb-4">Formas de pagamento <icon icon="plus" class="clickable brand-hover" @click="openCreateInstalmentModal"></icon></h4>
        <instalments-table :billing="billing" v-if="!$empty(billing.instalments)" @selected="openEditInstalmentModal"></instalments-table>
        <div v-else>
          <div class="mb-2">
            <small>Nenhuma forma de pagamento cadastrada. Neste caso, o pagamento devera ser realizado a vista. Caso tenha negociado uma forma de pagamento com o artista, por favor cadastre aqui as parcelas.</small>
          </div>
          <h6 class="brand-hover clickable" @click="openCreateInstalmentModal">
            <u>Cadastrar Forma de Pagamento</u>
          </h6>
        </div>
      </div>
      <div class="mb-5">
        <h4 class="mb-4">Pagamentos</h4>
        <payments-table :billing="billing" v-if="!$empty(billing.payments)"></payments-table>
        <div v-else>
          <h6 class="mb-3">Nenhum pagamento realizado</h6>
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
    <modal ref="instalments" small>
      <template v-slot:main>
        <instalment-manager :billing="billing" :instalment="selectedInstalment" @saved="closeInstalmentsModal"></instalment-manager>
      </template>
    </modal>
  </div>
</template>

<script>
/** @requires presentation state to be loaded */
import { mapState, mapActions } from 'vuex';
import InstalmentManager  from '@/components/billing/instalmentManager';
import PaymentManager     from '@/components/billing/paymentManager';
import InstalmentsTable   from '@/components/billing/instalmentsTable';
import PaymentsTable      from '@/components/billing/paymentsTable';

export default {
  components: {
    PaymentManager,
    InstalmentManager,
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
  },
  async created() {
    await this.loadPresentationBilling(this.$route.params.id);
  }, 
  methods: {
    ...mapActions('billing', ['loadPresentationBilling']),
    openCreateInstalmentModal() {
      this.selectedInstalment = null;
      this.$refs.instalments.open();
    },
    openEditInstalmentModal(instalment) {
      this.selectedInstalment = instalment;
      this.$refs.instalments.open();
    },
    closeInstalmentsModal() {
      this.$refs.instalments.close();
    },
    openPaymentModal(amountToPay) {
      this.amountToPay = amountToPay;
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