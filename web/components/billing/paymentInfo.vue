<template>
  <div v-if="!$empty(payment)">
    <div class="mb-5">
      <h5>Detalhes do pagamento {{ payment.id }}</h5>
    </div>
    <timeline
      class="mb-5"
      :steps="PAYMENT_STATUS.length" 
      :completed="completedPaymentStatus" 
      :current="paymentStatusIndex" 
      :icons="paymentStatusIcons"
      :labels="paymentStatusLabels">
    </timeline>
    <div class="boxed mb-4">
      <div class="d-flex justify-content-between mb-3">
        <h4>Total</h4>
        <h4>{{ payment.amount | currency }}</h4>
      </div>
      <div class="d-flex justify-content-between">
        <h4>Pago</h4>
        <h4>{{ payment.paid_amount | currency }}</h4>
      </div>
    </div>
    <div class="boxed mb-4" v-if="!$empty(payment.notes) || !$empty(payment.failed_reason)">
      <h4 class="mb-4">Observações</h4>
      <p v-if="payment.is_failed">
        Pagamento recusado. <span v-if="!$empty(payment.failed_reason)">Motivo: {{ payment.failed_reason }}</span>
      </p>
      <p>{{ payment.notes }}</p>
    </div>
    <div class="mb-4 vertical middle center">
      <div v-if="payment.is_pending">
        <component :is="paymentMethodComponent" :payment="payment"></component>
      </div>
      <div v-else>
        <h4>Pagamento realizado. Obrigado!</h4>
      </div>
    </div>
    <div class="boxed mb-4">
      <div class="d-flex justify-content-between mb-3">
        <h4>Meio de pagamento</h4>
        <h4>
          <icon :icon="paymentMethodIcon"></icon>
          {{ payment.method.type | translate('billing.payment.method') }}
        </h4>
      </div>
      <hr class="light">
      <div class="d-flex justify-content-between mb-3">
        <h4>Status</h4>
        <h4>{{ payment.status | translate('billing.payment.status') }}</h4>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <h4>Parcela</h4>
        <h4>{{ !$empty(payment.instalment) ? payment.instalment.num : '-' }}</h4>
      </div>
      <hr class="light">
      <div class="d-flex justify-content-between mb-3">
        <h4>Criado em</h4>
        <h4>{{ payment.create_dt | date }}</h4>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <h4>Data Vencimento</h4>
        <h4>{{ payment.due_dt | date }}</h4>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <h4>Última atualização</h4>
        <h4>{{ payment.update_dt | date }}</h4>
      </div>
      <div class="d-flex justify-content-between">
        <h4>Data Pagamento</h4>
        <h4>{{ payment.paid_dt | date }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import PixQRCode      from '@/components/billing/pixQRCode';
import BoletoBarcode  from '@/components/billing/pixQRCode';
import CardProtected  from '@/components/billing/pixQRCode';

export default {
  props: {
    payment: { type: Object, default: () => {}}
  },
  data() {
    return {
      PAYMENT_STATUS: ['started', 'pending', 'completed'],
      PAYMENT_METHOD_ICON_MAP: {
        pix:    'qrcode',
        boleto: 'barcode',
        cc:     'credit-card'
      },
    }
  },
  computed: {
    completedPaymentStatus() {
      return this.$array.range(this.paymentStatusIndex);
    },
    paymentStatusIndex() {
      return this.$array.indexOf(this.PAYMENT_STATUS, this.payment.status);
    },
    paymentStatusIcons() {
      return [this.paymentMethodIcon, 'clock', this.paymentStatusIcon];
    },
    paymentStatusIcon() {
      return this.payment.is_failed ? 'times' : 'check';
    },
    paymentStatusLabels() {
      return ['Iniciado', 'Aguardando pagamento', 'Falha', 'Aprovado', 'Concluído'];
    },
    paymentMethodIcon() {
      return this.PAYMENT_METHOD_ICON_MAP[this.payment.method.type];
    },
    paymentMethodComponent() {
      if (this.payment.pay_with_pix)    { return PixQRCode; }
      if (this.payment.pay_with_boleto) { return BoletoBarcode; }
      if (this.payment.pay_with_cc)     { return CardProtected; }
      return null;
    }
  }
}
</script>

<style lang="scss" scoped>
.boxed {
  background: $layer4;
  border-radius: $edges;
  padding: 2 * $space;
}
</style>