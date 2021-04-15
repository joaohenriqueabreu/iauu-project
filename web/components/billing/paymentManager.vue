<template>
  <div>
    <div class="payment-info mb-5">
      <div v-if="$empty(instalment)">
        <h4 class="mb-3">Total a pagar</h4>
        <h3>{{ amountToPay | currency }}</h3>
      </div>
      <div v-else>
        <h4 class="mb-2">Total a pagar para parcela #{{ instalment.num }}</h4>
        <h6 class="mb-2" v-if="!$empty(instalment.name)">{{ instalment.name }}</h6>
        <h6 :class="instalment.is_delayed ? 'error' : ''">Vence em {{ instalment.due_at | date }}</h6>
        <h3>{{ instalment.amount | currency }}</h3>
      </div>
    </div>
    <div v-if="!hasRequestedPaymentMethod" class="row payment-methods mb-5">
      <div class="col-4">
        <h3 :class="isCCMethod ? 'selected' : ''" @click="changePaymentMethod('cc')">
          <icon icon="credit-card"></icon>
          <span class="hide-mobile">Cartão</span>
        </h3>
      </div>
      <div class="col-4">
        <h3 :class="isBoletoMethod ? 'selected' : ''" @click="changePaymentMethod('boleto')">
          <icon icon="barcode"></icon>
          <span class="hide-mobile">Boleto</span>
        </h3>
      </div>
      <div class="col-4">
        <h3 :class="isPixMethod ? 'selected' : ''" @click="changePaymentMethod('pix')">
          <icon icon="qrcode"></icon>
          <span class="hide-mobile">Pix</span>
        </h3>
      </div>
    </div>
    <div class="full-height">
      <fade-transition mode="out-in">
        <component :is="paymentMethodForm" @initiated="hasRequestedPaymentMethod=true" :billing="billing" :instalment="instalment"></component>
      </fade-transition>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CCPaymentForm from '@/components/billing/ccPayment';
import BoletoPaymentForm from '@/components/billing/boletoPayment';
import PixPaymentForm from '@/components/billing/pixPayment';

export default {
  props: {
    amountToPay:  { type: Number, default: 0 },
    billing:      { type: Object, default: null },
    instalment:   { type: Object, default: null },
  },
  data() {
    return {
      selectedPaymentMethod: 'pix',
      hasRequestedPaymentMethod: false,

      COMPONENT_PAYMENT_METHOD_MAP: {
        'cc':     CCPaymentForm,
        'boleto': BoletoPaymentForm,
        'pix':    PixPaymentForm,
      }
    }
  },
  computed: {
    isCCMethod()        { return this.selectedPaymentMethod === 'cc'; },
    isBoletoMethod()    { return this.selectedPaymentMethod === 'boleto'; },
    isPixMethod()       { return this.selectedPaymentMethod === 'pix'; },
    paymentMethodForm() { return this.COMPONENT_PAYMENT_METHOD_MAP[this.selectedPaymentMethod]; }
  },
  methods: {
    ...mapActions('billing', ['resetPayment']),
    changePaymentMethod(method) { 
      this.selectedPaymentMethod = method; 
    }
  },
  watch: {
    selectedPaymentMethod() {
      this.resetPayment();
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-info {
  background:     $layer4;
  border-radius:  $edges;
  padding: 2 *    $space;
  h3 {
    text-align:   right;
  }
}

.payment-methods {
  h3 {
    @extend .horizontal, .center, .middle;
    min-width:      100px;
    cursor:         pointer;
    transition:     $transition;
    width:          100%;
    height:         100%;
    border-radius:  $rounded;
    border:         2px solid $white;
    padding:        $space;

    span {
      font-size: $large;
    }
    
    &:hover, &.selected {
      transition:   $transition;
      border-color: $brandLayer;
      background:   $brandLayer;
    }
  }
}
</style>