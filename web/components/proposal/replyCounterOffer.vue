<template>
  <div>
    <div
      v-if="!proposal.has_accepted_counter_offer && !proposal.has_rejected_counter_offer"
      class="mb-4 mx-4 vertical middle center">
      <h6 class="mb-4">{{proposal.artist.name}} enviou um orçamento <u class="clickable brand-hover" @click="$refs.counter.open()">ver mais informações</u></h6>
      <h5 class="mb-4">
        {{ proposal.counter_offer.price | currency }} para
        {{ proposal.counter_offer.duration }} horas de apresentação
      </h5>
      <div class="horizontal middle center">
        <form-button class="mr-4" @action="replyCounterOffer(true)">Aceitar</form-button>
        <h5 class="clickable brand-hover" @click="replyCounterOffer(false)">Recusar</h5>
      </div>
    </div>
    <div v-if="proposal.has_rejected_counter_offer" class="mb-4 mx-4 text-center">
      <h5>Orçamento de {{ lastCounterOfferRejected.price | currency }} para
        {{ lastCounterOfferRejected.duration }} horas de apresentação <span class="color-error"><h5>reprovado.</h5></span>
      </h5>
      <small>Entre em contato com o artista para negociar novos termos da apresentação.</small>
    </div>
    <div v-if="proposal.has_accepted_counter_offer" class="mb-4 mx-4 text-center">
      <h5>Orçamento de {{ proposal.counter_offer.price | currency }} para
        {{ proposal.counter_offer.duration }} horas de apresentação <span class="color-success"><h5>aprovado!</h5></span>
      </h5>
    </div>
    <modal small ref="counter">
      <template v-slot:header>
        Negociar proposta
      </template>
      <template v-slot:main>
        <div class="p-5">
          <h4 class="mb-4 text-center">
            Orçamento de {{ proposal.counter_offer.price | currency }} para
            {{ proposal.counter_offer.duration }} horas de apresentação
          </h4>
          <p v-if="!$empty(proposal.counter_offer.notes)" class="mb-4">
            {{ proposal.counter_offer.notes }}
          </p>
          <rejected-offers v-if="proposal.has_rejected_counter_offers" :proposal="proposal"></rejected-offers>
        </div>
      </template>
      <template v-slot:footer>
        <div class="horizontal middle center">
          <form-button class="mr-4" @action="replyCounterOffer(true)">Aceitar</form-button>
          <h5 class="clickable brand-hover" @click="replyCounterOffer(false)">Recusar</h5>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import RejectedOffers from '@/components/proposal/rejectedOffers';
export default {
  props: {
    proposal: {}
  },
  components: {
    RejectedOffers
  },
  computed: {
    lastCounterOfferRejected() {
      if (! this.proposal.has_rejected_counter_offer) { return {}; }
      return this.proposal.rejected_counter_offers[this.proposal.rejected_counter_offers.length - 1];
    }
  },
  methods: {
    ...mapActions('proposal', ['acceptCounterOffer', 'rejectCounterOffer']),
    async replyCounterOffer(accepted) {
      if (accepted) {
        await this.acceptCounterOffer(this.proposal.id)
        this.$toast.success('Orçamento aprovado! Obrigado o artista irá confirmar a apresentação em breve');
      } else {
        await this.rejectCounterOffer(this.proposal.id)
        this.$toast.info('Orçamento reprovado. Entre em contato com o artista ou aguarde novo orçamento');
      }

      // Close modal if was replying from it
      this.$refs.counter.close();

      this.$emit('replied');
    }
  }
}
</script>

<style lang="scss" scoped>
</style>