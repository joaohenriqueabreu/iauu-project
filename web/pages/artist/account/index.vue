<template>
  <div>
    <div class="d-flex justify-content-between mb-5">
      <h4>Minha conta</h4>
      <form-button @action="openWithdrawModal">Solicitar saque</form-button>
    </div>
    <h6 class="mb-3">Pagamentos</h6>
    <div class="d-flex align-content-space-between full-width mb-5">
      <div v-for="(stat, statName) in stats" :key="statName" class="stat">
        <h5>{{ $dictionary.payment.label[statName] }}</h5>
        <hr />
        <h4 class="text-right">
          {{ stat | currency }}
        </h4>
      </div>
    </div>
    <table class="payments-container text-center">
      <tr>
        <th></th>
        <th>Status</th>
        <th>Apresentação</th>
        <th>Valor (R$)</th>
        <th>Data</th>
      </tr>
      <tr v-for="(payment, index) in payments" :key="index" class="payment">
        <td>
          <font-awesome
            v-if="payment.status === 'closed'"
            icon="receipt"
            class="clickable"
          ></font-awesome>
        </td>
        <td class="status" :class="payment.status">
          {{ $dictionary.payment.label[payment.status] }}
        </td>
        <td @click="openPresentationModal(payment.presentation_id)">
          # {{ payment.presentation_id }}
        </td>
        <td class="text-right">{{ payment.amount | currency }}</td>
        <td class="text-right">{{ payment.create_dt | date }}</td>
      </tr>
    </table>

    <withdraw-request ref="withdrawRequest" :available="stats.active"></withdraw-request>
    <modal ref="presentationModal">
      <template v-slot:main>
        <presentation read-only></presentation>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import WidthdrawRequest from '@/components/payment/withdrawRequest'
import Presentation from '@/components/presentation/artist/presentation'
export default {
  components: {
    'withdraw-request': WidthdrawRequest,
    presentation: Presentation
  },
  async asyncData({ store }) {
    await store.dispatch('payment/loadPayments')
  },
  computed: {
    ...mapState({ payments: (state) => state.payment.payments }),
    ...mapState({ stats: (state) => state.payment.stats })
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation']),
    openWithdrawModal() {
      this.$refs.withdrawRequest.openModal()
    },
    async openPresentationModal(id) {
      await this.loadPresentation(id)
      this.$refs.presentationModal.open()
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  border-top: 5px solid $layer1;
  &.light {
    border-top: 2px solid $brand;
    opacity: 0.05;
  }
}
.stat {
  transition: $transition;
  width: 100%;
  background: $layer3;
  box-shadow: $shadow;
  margin-right: 2 * $space;
  padding: 2 * $space;
}

.payments-container {
  @extend .full-width;
  tr {
    transition: $transition;
    border-bottom: 2px solid $layer3;
    td {
      padding: 2 * $space;
    }

    .status {
      font-weight: $bold;
      &.closed {
        color: $layer2;
      }

      &.pending {
        color: red;
      }

      &.closed {
        color: $layer5;
      }
    }

    &:hover {
      transition: $transition;
      background: $layer3;
    }
  }
}
</style>
