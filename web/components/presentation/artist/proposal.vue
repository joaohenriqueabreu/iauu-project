<template>
  <div class="presentation-container">
    <modal ref="modal">
      <template v-slot:header>
        <div class="horizontal d-flex justify-content-between">
          <div class="horizontal middle" v-if="!$empty(presentation.contractor) && !$empty(presentation.contractor.user)">
            <avatar v-if="!$empty(presentation.contractor.user.photo)" :src="presentation.contractor.user.photo" :username="presentation.contractor.name"></avatar>
            <div class="vertical middle">
              <h5>{{ presentation.contractor.user.name }}</h5>
              <h6>Enviou-lhe uma proposta</h6>
            </div>
          </div>
          <div class="d-flex align-items-end">
            <span class="identifier">Proposta</span>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="mb-4">
          <pick-timeslot :default="presentation.timeslot" :timeslots="presentation.proposal.timeslots" @selected="selectedTimeslot">
          </pick-timeslot>
        </div>
        <div class="mx-4 mb-4 vertical center middle">
          <h3 class="mb-4">{{ presentation.proposal.title }}</h3>
          <span>{{ presentation.proposal.description }}</span>
        </div>
        <div class="boxed mb-4">
          <presentation-address :presentation="presentation"></presentation-address>
        </div>
        <div v-if="isCustomProduct">
          <counter-offer ref="counter" :presentation="presentation" @send="dispatchCounterOffer"></counter-offer>
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
        <div v-if="isCustomProduct && !hasCounterOffer" class="error mb-2">
          {{ presentation.contractor.user.name }} solicitou um produto personalizado. Envie um orçamento para depois confirmar a apresentação.
        </div>
        <div v-if="hasCounterOffer && !hasAcceptedCounterOffer" class="error mb-2">
          O contratante deve aceitar o orçamento para poder confirmar a apresentação
        </div>
        <div class="error mb-2" v-if="!hasSelectedTimeslot">
          Selecione uma opção de data para evento
        </div>
        <div class="horizontal center middle full-height">
          <div class="mr-5" v-if="(!isCustomProduct || hasAcceptedCounterOffer) && hasSelectedTimeslot">
            <form-button @action="accept">Aceitar</form-button>
          </div>
          <div>
            <h5 @click="reject">Recusar</h5>
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
    hasSelectedTimeslot() {
      return !this.$empty(this.presentation.timeslot)
    },
    isCustomProduct() {
      return this.presentation.proposal.product.custom || this.presentation.proposal.product.name === 'custom'
    },
  },
  methods: {
    ...mapActions('presentation', ['acceptProposal', 'rejectProposal', 'selectTimeslot', 'sendCounterOffer']),
    openModal() {
      return this.$refs.modal.open()
    },
    closeModal() {
      return this.$refs.modal.close()
    },
    async selectedTimeslot(timeslot) {
      await this.selectTimeslot({ id: this.presentation.id, timeslot })
      this.$toast.success('Data da apresentação selecionada')
    },
    async accept() {
      await this.acceptProposal(this.presentation.id)
      this.$emit('accepted', this.presentation.id)
    },
    async reject() {
      await this.rejectProposal(this.presentation.id)
      this.$emit('rejected', this.presentation.id)
    },
    async dispatchCounterOffer(counterOffer) {
      await this.sendCounterOffer(counterOffer)
      this.$toast.success(`Orçamento enviado para ${this.presentation.contractor.user.name}`)
      this.$refs.modal.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
