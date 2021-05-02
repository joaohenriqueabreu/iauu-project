<template>
  <div>
    <div v-if="!readOnly">
      <div v-if="counterOffer.status === 'void'" class="mb-5 text-center">
        <h4 class="brand-hover clickable" @click="openModal"><u>Enviar orçamento para o organizador do evento</u></h4>
      </div>
      <div v-else class="vertical middle center offer m-4" :class="counterOffer.status">
        <h5 v-if="!proposal.has_accepted_counter_offer" class="mb-3">
          Orçamento enviado <u>{{ counterOfferStatusText }}</u>
        </h5>
        <div v-else class="mb-3">
          <h5 class="mb-2 horizontal center">{{ proposal.contractor.name }} <span class="color-success mx-2"><h5>aprovou</h5></span> o orçamento!</h5>
          <small>Clique em <u>aceitar</u> para confirmar a realização da apresentação</small>
        </div>      
        <div class="horizontal">
          <h5 class="mr-2">{{ counterOffer.price | currency }} para {{ counterOffer.duration | longTime }} de apresentação </h5>
          <h5 v-if="!proposal.has_accepted_counter_offer" class="mx-2 clickable brand-hover" @click="openModal">
            <icon icon="edit"></icon>
          </h5>
        </div>
      </div>
      <modal ref="modal" tiny footer-height="small">
        <template v-slot:header>
          <h6>Orçamento de apresentação</h6>
        </template>
        <template v-slot:main>
          <div class="vertical middle center full-width mb-4">
            <h6>Envie o valor e duração (em horas) de sua apresentação para avaliação pelo contratante</h6>
            <div class="row full-width">
              <div class="col">
                <form-money ref="price" v-model="$v.counterOffer.price.$model" class="mt-4 mb-1"></form-money>
              </div>
              <div class="col">
                <form-numeric mask="time" v-model="$v.counterOffer.duration.$model" icon="clock" class="mt-4 mb-1"></form-numeric>
              </div>
            </div>          
            <div v-if="$v.counterOffer.price.$error" class="error mb-3">Favor entrar com um valor válido</div>
            <div v-if="$v.counterOffer.duration.$error" class="error mb-3">Favor entrar com um valor válido</div>
            <div class="row full-width mt-4">
              <div class="col">
                <form-textarea v-model="counterOffer.notes">Qualquer informação útil sobre a negociação</form-textarea>
              </div>
            </div>
          </div>
          <rejected-offers v-if="proposal.has_rejected_counter_offers" :proposal="proposal"></rejected-offers>
        </template>
        <template v-slot:footer>
          <div v-if="$v.$invalid" class="error">Complete a contra proposta para enviá-la ao organizador do evento</div>
          <div class="vertical center middle full-height">
            <form-button v-if="!$v.$invalid" @action="send" class="mb-4">Enviar</form-button>
            <h6 class="clickable" @click="cancel">Cancelar</h6>
          </div>
        </template>
      </modal>
    </div>
    <div v-else>
      <div class="mb-4 horizontal middle">
        Orcamento <h6 v-if="proposal.has_accepted_counter_offer" class="color-success mx-2">aprovado</h6>
        <h6 v-else class=" mx-2">em analise</h6>
        de <h6 class="mx-2">{{ proposal.counter_offer.price | currency }}</h6> para <h6 class="mx-2">{{ proposal.counter_offer.duration }}</h6> horas de apresentacao.
      </div>              
      <rejected-offers v-if="proposal.has_rejected_counter_offers" :proposal="proposal"></rejected-offers>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { required, minValue, numeric } from 'vuelidate/lib/validators';
import RejectedOffers from '@/components/proposal/rejectedOffers';
export default {
  components: {
    RejectedOffers
  },
  validations: {
    counterOffer: {
      price:    { required, numeric, minValue: minValue(1) },
      duration: { required, numeric, minValue: minValue(1) }
    }
  },
  props: {
    proposal: { type: Object, default: () => {} },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      counterOffer: {
        price:    0,
        duration: 0,
        notes:    '',
        status:   'void'
      }
    }
  },
  computed: {
    hasAcceptedCounterOffer() {
      return this.counterOffer.status === 'accepted';
    },
    counterOfferStatusText() {
      if (this.counterOffer.status === 'pending') {
        return 'Aguardando resposta do organizador do evento';
      }

      if (this.counterOffer.status === 'accepted') {
        return 'Orçamento aceito pelo organizador do evento!';
      }

      if (this.counterOffer.status === 'rejected') {
        return 'Orçamento rejeitado, cancele a proposta ou envie um novo orçamento';
      }

      return '';
    }
  },
  mounted() {
    if (!this.$empty(this.proposal.counter_offer)) {
      this.counterOffer = this.$object.clone(this.proposal.counter_offer);
    }
  },
  methods: {
    ...mapActions('proposal', ['sendCounterOffer']),
    openModal() {
      this.$refs.modal.open();
    },
    async send() {
      await this.sendCounterOffer(this.counterOffer);
      this.$toast.success(`Orçamento enviado para ${this.proposal.contractor.name}`);
      this.$emit('sent', this.counterOffer);
    },
    cancel() {
      this.$refs.modal.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.offer {
  padding: 2 * $space;
  &.accepted {
    color:          $white;
    border-radius:  $edges;
  }
}
</style>
