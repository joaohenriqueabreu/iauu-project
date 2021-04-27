<template>
  <div>
    <transition name="slide-fade" mode="out-in">
      <div v-if="$empty(payment)" key="no-card">
        <div class="mb-4">
          <h6 class="mb-3">Digite os dados do cartão.</h6>
        </div>
        <div class="card mb-4">
          <div class="card-icon">
            <transition name="slide-fade" mode="out-in">
              <icon :icon="displayIcon" :key="displayIcon[1]"></icon>
            </transition>
          </div>
          <div class="mt-4">
            <form-masked mask="creditCard" v-model="$v.card.number.$model" placeholder="Número do cartão (XXXX XXXX XXXX XXXX)" icon="credit-card"></form-masked>
            <form-validation class="ml-2" :active="$v.card.number.$error">Por favor entre com um número de cartão válido</form-validation>
          </div>
          <div class="row mb-4">
            <div class="col-6">
              <form-input v-model="$v.card.name.$model" placeholder="Nome conforme escrito no cartão" icon="user"></form-input>
            </div>
            <div class="col-3">
              <form-masked mask="expiryDate" v-model="$v.card.expiry.$model" icon="calendar-alt" placeholder="Data de Expiração (XX/XX)"></form-masked>
            </div>
            <div class="col-3">
              <form-masked mask="cvc" v-model="$v.card.cvc.$model" placeholder="CVC (XXX)" icon="lock" @focus="isTypingCVC=true" @blur="isTypingCVC=false"></form-masked>
            </div>
            <div class="col-12">
              <form-validation :error="$v.card.name.$error" class="mb-2">Por favor entre com o nome conforme escrito no cartão</form-validation>
              <form-validation :error="$v.card.expiry.$error" class="mb-2">Por favor entre com um data de expiração válida (verifique se seu cartão não está vencido ou com expiração próxima)</form-validation>
              <form-validation :error="$v.card.cvc.$error">Por favor entre com um CVC válido <br>(Número de 3 digitos localizado na parte traseira do cartão)</form-validation>
            </div>
          </div>
          <div>
            <!-- TODO this operation might take more than btn duration, include longer handling -->
            <form-button class="half-width" @action="chargeCard" :disabled="$v.card.$invalid">Pagar</form-button>
          </div>
        </div>
      </div>
      <div v-else key="card" class="vertical middle center">
        <h6>Solicitação de pagamento enviado a operadora do cartão.</h6>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment';
import PaymentMethod from '@/components/billing/paymentMethod';
import { mapState, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import pagarme from 'pagarme';

const raw = (value) => value.replace(/[^a-zA-Z0-9]/ig, '');

const visaRegex       = /^4[0-9]{12}(?:[0-9]{3})?$/;
const masterCardRegex = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;;
const amexRegex       = /^3[47][0-9]{13}$/;

// const cardNumberValidator = (value) => /^(?:4[0-9]{12}(?:[0-9]{3})? | (?:5[1-5][0-9]{2} | 222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12} | 3[47][0-9]{13} | 3(?:0[0-5]|[68][0-9])[0-9]{11} | 6(?:011|5[0-9]{2})[0-9]{12} | (?:2131|1800|35\d{3})\d{11})$/.test(raw(value));
const cardNumberValidator = (value) => /^[1-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/.test(value);
const cardExpiryValidator = (value) => /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(value);
const cardCVCValidator    = (value) => /^[0-9]{3,4}$/.test(value);

// At least 3 months away from expiry
const isExpiryCloseOrPast = (value) => {
  console.log(moment(value, 'MM/YYYY').diff(moment(), 'months'));
  return moment(value, 'MM/YYYY').diff(moment(), 'months') > 3;
};

export default {
  extends: PaymentMethod,
  props: {
    billing: { type: Object },
    instalment: { type: Object }
  },
  data() {
    return {
      card: {
        number: '',
        name:   '',
        expiry: '',
        cvc:    '',
      },
      isTypingCVC: false,
      apiClient: {},
      cardHash: '',
    }
  },
  mounted() {
    console.log(this.cardHash);
  },
  validations: {
    card: {
      number: { required, cardNumberValidator },
      name:   { required },
      expiry: { required, cardExpiryValidator, isExpiryCloseOrPast },
      cvc:    { required, cardCVCValidator },
    }
  },
  computed: {
    ...mapState({ payment: (state) => state.billing.payment }),
    paymentMethodPayload() {
      return {
        type: 'cc',
        hash: this.cardHash
      }
    },
    isVisa()        { return visaRegex.test(raw(this.card.number)) },
    isMasterCard()  { return masterCardRegex.test(raw(this.card.number)); },
    isAmex()        { return amexRegex.test(raw(this.card.number)); },
    displayIcon()   {
      if (this.isTypingCVC) { return ['fas', 'credit-card']; }
      if (this.isVisa) { return ['fab', 'cc-visa']; }
      if (this.isMasterCard) { return ['fab', 'cc-mastercard']; }
      if (this.isAmex) { return ['fab', 'cc-amex']; }
      
      return ['far', 'credit-card'];
    }
  },
  methods: {
    ...mapActions('billing', ['chargePayment']),    
    async chargeCard() {
      await this.connectPagarmeAPI();
      await this.getCardHash();
      await this.initiatePayment();
      this.resetCardHash();
    },
    async connectPagarmeAPI() {
      // TODO could abstract this
      try {
        this.apiClient = await pagarme.client.connect({ api_key: this.$config.paymentAPIPublicKey });
      } catch (error) {
        this.$sentry.captureException(error);
        this.$toast.error('Tivemos um problema ao conectar com o provedor de pagamentos, por favor tente novamente em alguns minutos.');
      }
      
    },
    async getCardHash() {
      try {
        this.cardHash = await this.apiClient.security.encrypt({
          card_number:          raw(this.card.number),
          card_holder_name:     this.card.name,
          card_expiration_date: moment(this.card.expiry).format('MMYY'),
          card_cvv:             this.card.cvc
        });
      } catch (error) {
        this.$sentry.captureException(error);
        this.$toast.error('Problema reportado pelo provedor com os dados do cartão. Favor verificar');
        this.$toast.error(error);
      }
    },
    resetCardHash() {
      this.cardHash = '';
    }
  }
}
</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    padding: 5 * $space;
    background: $layer3;
    border: 1px solid $layer5;
    border-radius: $edges;

    .card-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      transition: $transition;
      [data-icon] {
        transition: $transition;
        font-size: 36px;
      }
    }
  }
</style>