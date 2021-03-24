<template>
  <div>
    <div v-if="!$empty(invoice)">
      <div class="row mb-5">
        <div class="col-6">
          <h3 class="mb-3">Total</h3>
          <h1>{{ invoice.total_amount | currency }}</h1>
        </div>
        <div class="col-6">
          <h3 class="mb-3">Pago</h3>
          <h1>{{ invoice.total_paid | currency }}</h1>
        </div>
      </div>
      <div>
        <h4 class="mb-4">Pagamentos</h4>
        <table>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Pago</th>
            <th>Data Vencimento</th>
            <th>Data Pagamento</th>
          </tr>
          <tr v-for="(payment, index) in invoice.payments" :key="index">
            <td>{{ paymentId(payment) }}</td>
            <td>{{ paymentStatus(payment) }}</td>
            <td>{{ payment.amount | currency }}</td>
            <td>{{ payment.paid_amount | currency }}</td>
            <td>{{ payment.due_dt | date }}</td>
            <td>{{ payment.paid_dt | date }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-else class="">
      <div>
        <h3>Total contratado</h3>
        <h1>{{ presentation.price | currency }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
/** @requires presentation state to be loaded */
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    ...mapState({ invoice: (state) => state.presentation.invoice }),    
  },
  methods: {
    paymentId(payment) {
      return payment.id.substr(0, 4);
    },
    paymentStatus(payment) {
      return payment.status;
    }
  }
}
</script>

<style>

</style>