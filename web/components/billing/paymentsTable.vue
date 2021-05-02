<template>
  <div>
    <table class="table" v-if="!$empty(billing.payments)">
      <thead>
        <tr>
          <th>Id</th>
          <th>Parcela</th>
          <th>Status</th>
          <th>Valor</th>
          <th>Pago</th>
          <th>Data Vencimento</th>
          <th>Data Pagamento</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, index) in billing.payments" :key="index" @click="openPaymentInfoModal(payment)">
          <td>{{ payment.display_id }}</td>
          <td>{{ ! $empty(payment.instalment) ? payment.instalment.num : '-' }}</td>
          <td :class="payment.is_failed ? 'failed' : ''">{{ payment.status | translate('billing.payment.status') }}</td>
          <td>{{ payment.amount | currency }}</td>
          <td>{{ payment.paid_amount | currency }}</td>
          <td>{{ payment.due_dt | date }}</td>
          <td v-if="!$empty(payment.paid_dt)">{{ payment.paid_dt | date }}</td>
          <td v-else>-</td>
        </tr>
      </tbody>
    </table>
    <modal ref="paymentInfo">
      <template v-slot:main>
        <payment-info :payment="selectedPayment"></payment-info>
      </template>
    </modal>
  </div>
</template>

<script>
import PaymentInfo from '@/components/billing/paymentInfo';
export default {
  components: {
    PaymentInfo
  },
  props: {
    billing: {}
  },
  data() {
    return {
      selectedPayment: { type: Object, default: () => {}}
    }
  },
  methods: {
    openPaymentInfoModal(payment) {
      this.selectedPayment = payment;
      this.$refs.paymentInfo.open();
    }
  }
}
</script>

<style>

</style>