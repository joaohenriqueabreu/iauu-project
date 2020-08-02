<!-- TODO Try to reuse artist and contractor as much as possible -->
<template>
  <div class="presentation-container">
    <modal ref="modal">
      <template v-slot:header>
        <div class="horizontal d-flex justify-content-between">
          <div class="horizontal middle" v-if="!$empty(presentation.artist) && !$empty(presentation.artist.user)">
            <avatar v-if="!$empty(presentation.artist.user.photo)" :src="presentation.artist.user.photo" :username="presentation.artist.name"></avatar>
            <div class="vertical middle">
              <h6>Proposta enviada para</h6>
              <h5>{{ presentation.artist.user.name }}</h5>
            </div>
          </div>
          <div class="d-flex align-items-end">
            <span class="identifier">Proposta</span>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <h6 class="mb-2">Datas oferecidas para o artista</h6>
        <small v-if="$empty(presentation.timeslot)">Aguardando resposta do artista</small>
        <div class="my-4 horizontal center middle">
          <div v-for="(timeslot, index) in presentation.proposal.timeslots" :key="index" class="mr-4 vertical">
            <h6 :class="hasSelectedTimeslot(timeslot) ? 'selected' : ''" class="timeslot">{{ timeslot.start_dt | datetime }}</h6>
            <small v-if="hasSelectedTimeslot(timeslot)" class="timeslot selected">Escolhida pelo artista</small>
          </div>
        </div>
        <div class="mx-4 mb-4 vertical center middle">
          <h3 class="mb-4">{{ presentation.proposal.title }}</h3>
          <span>{{ presentation.proposal.description }}</span>
        </div>
        <div class="boxed mb-4">
          <presentation-address :presentation="presentation"></presentation-address>
        </div>
        <div v-if="hasCounterOffer && !hasAcceptedCounterOffer && !hasRejectedCounterOffer" class="mb-4 mx-4 vertical middle center">
          <h6 class="mb-4">O artista te enviou um orçamento para sua apresentação</h6>
          <h5 class="mb-4">{{ presentation.proposal.counterOffer.price | currency }} para {{ presentation.proposal.counterOffer.duration }} horas de apresentação</h5>
          <div class="horizontal middle center">
            <form-button @action="replyCounterOffer(true)" class="mr-4">Aceitar</form-button>
            <h6 class="clickable" @click="replyCounterOffer(false)">Recusar</h6>
          </div>
        </div>
        <div v-if="hasRejectedCounterOffer" class="mb-4 mx-4 vertical middle center">
          <h6 class="mb-2">Orçamento enviado <u>reprovado</u></h6>
          <h5 class="mb-4">{{ presentation.proposal.counterOffer.price | currency }} para {{ presentation.proposal.counterOffer.duration }} horas de apresentação</h5>
        </div>
        <div v-if="hasAcceptedCounterOffer" class="mb-4 mx-4 accepted-counter-offer">
          <h6>Orçamento aprovado</h6>
          <h5 class="mb-4">{{ presentation.proposal.counterOffer.price | currency }} para {{ presentation.proposal.counterOffer.duration }} horas de apresentação</h5>
        </div>
        <div class="boxed">
          <presentation-product ref="product" :presentation="presentation"></presentation-product>
        </div>
        <div class="attachments">
          <attachment v-for="(file, index) in presentation.files" :key="index" :file="file">
          </attachment>
        </div>
      </template>
      <template v-slot:external>
        <chat v-if="!$empty(presentation)" :presentation="presentation"></chat>
      </template>
      <template v-slot:footer>
        <div class="horizontal middle center mb-2" v-if="hasCounterOffer && !hasAcceptedCounterOffer">
          Aguardando definição de orçamento
        </div>
        <div class="horizontal center middle full-height">
          <div>
            <h5 class="clickable" @click="cancel">Cancelar</h5>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BasePresentation from '../base'

export default {
  extends: BasePresentation,
  async mounted() {
    if (this.presentation.proposal.timeslots.length === 1) {
      await this.selectTimeslot({ id: this.presentation.id, timeslot: this.presentation.proposal.timeslots[0] })
    }
  },
  computed: {
    hasCounterOffer() {
      return !this.$empty(this.presentation.proposal.counterOffer) && 
        this.presentation.proposal.counterOffer.status !== 'void'
    },
    hasAcceptedCounterOffer() {
      return !this.$empty(this.presentation.proposal.counterOffer) && 
        this.presentation.proposal.counterOffer.status === 'accepted'
    },
    hasRejectedCounterOffer() {
      return !this.$empty(this.presentation.proposal.counterOffer) && 
        this.presentation.proposal.counterOffer.status === 'rejected'
    },
  },
  methods: {
    ...mapActions('presentation', ['acceptProposal', 'rejectProposal', 'selectTimeslot', 'acceptCounterOffer', 'rejectCounterOffer']),
    openModal() {
      return this.$refs.modal.open()
    },
    closeModal() {
      return this.$refs.modal.close()
    },
    hasSelectedTimeslot(timeslot) {
      if (this.$empty(this.presentation.timeslot)) {
        return false
      }

      return this.moment(timeslot.start_dt).isSame(this.presentation.timeslot.start_dt)
    },
    async cancel() {
      await this.rejectProposal(this.presentation.id)
      this.closeModal()
      this.$toast.info('Proposta cancelada')
      this.$emit('cancelled', this.presentation.id)
    },
    async replyCounterOffer(accepted) {
      if (accepted) {
        await this.acceptCounterOffer(this.presentation.id)
        this.$toast.success('Orçamento aprovado! Obrigado o artista irá confirmar a apresentação em breve')
      } else {
        await this.rejectCounterOffer(this.presentation.id)
        this.$toast.info('Orçamento reprovado. Entre em contato com o artista ou aguarde novo orçamento')
      }

      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.timeslot {
  color: $layer5;
  &.selected {
    color: $brandLayer;
  }
}

.accepted-counter-offer {
  color: $layer1;
  background: $brandLayer;
  border-radius: $edges;
  padding: 2 * $space;
}
</style>
