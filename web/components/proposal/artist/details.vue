// proposal should be pre-loaded from state
<template>
  <div class="proposal-container">
    <modal ref="modal">
      <template v-slot:header>
        <div class="horizontal d-flex justify-content-between">
          <div v-if="!$empty(proposal.contractor)" class="horizontal middle">
            <avatar v-if="!$empty(proposal.contractor.photo)" :src="proposal.contractor.photo" :username="proposal.contractor.name">
            </avatar>
            <div class="vertical middle">
              <h5>{{ proposal.contractor.name }}</h5>
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
          <pick-timeslot :default="proposal.selected_timeslot" :timeslots="proposal.timeslots" @selected="selectedTimeslot">
          </pick-timeslot>
        </div>
        <div class="mx-4 mb-4 vertical center middle">
          <h3 class="mb-4">{{ proposal.title }}</h3>
          <span>{{ proposal.description }}</span>
        </div>
        <div class="boxed mb-4" v-if="!$empty(proposal.address)">
          <presentation-address :presentation="proposal"></presentation-address>
        </div>
        <div v-if="isCustomProduct">
          <counter-offer ref="counter" :proposal="proposal" @send="dispatchCounterOffer">
          </counter-offer>
        </div>
        <div class="boxed">
          <presentation-product ref="product" :presentation="proposal"></presentation-product>
        </div>
        <div class="attachments">
          <attachment v-for="(file, index) in proposal.files" :key="index" :file="file">
          </attachment>
        </div>
      </template>
      <!-- <template v-slot:external>
        <chat v-if="!$empty(proposal)" :proposal="proposal"></chat>
      </template> -->
      <template v-slot:footer>
        <div class="error mb-2">
          <div v-if="isCustomProduct && !hasCounterOffer">
            {{ proposal.contractor.name }} solicitou um produto personalizado. Envie um
            orçamento para depois confirmar a apresentação.
          </div>
          <div v-if="hasCounterOffer && !hasAcceptedCounterOffer">
            O contratante deve aceitar o orçamento para poder confirmar a apresentação
          </div>
          <div v-if="!hasSelectedTimeslot">
            Selecione uma opção de data para o evento
          </div>
          <div v-if="hasSelectedTimeslot && isPresentationPast">
            Data da apresentação expirada. Não é possível aceitar a proposta neste momento.
          </div>
        </div>
        <div class="horizontal center middle full-height">
          <div v-if="(!isCustomProduct || hasAcceptedCounterOffer) && hasSelectedTimeslot && ! isPresentationPast" class="mr-5">
            <form-button @action="accept">Aceitar</form-button>
          </div>
          <div v-if="!isPresentationPast">
            <h5 class="clickable" @click="reject">Recusar</h5>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PresentationAddress      from '@/components/presentation/address';
import PickTimeslot             from '@/components/presentation/timeslot';
import PresentationDate         from '@/components/presentation/date';
import PresentationProduct      from '@/components/presentation/product';
import PresentationPrice        from '@/components/presentation/price';
import CounterOffer             from '@/components/presentation/counterOffer';
import PresentationFeedback     from '@/components/presentation/feedback';
// import Chat                     from '@/components/layout/chat';

export default {
  components: {
    PickTimeslot,
    PresentationAddress,
    PresentationDate,
    PresentationProduct,
    PresentationPrice,
    CounterOffer,
    PresentationFeedback,
    // Chat
  },
  async mounted() {
    if (this.proposal.timeslots.length === 1) {
      await this.selectTimeslot({
        id:       this.proposal.id,
        timeslot: this.proposal.timeslots[0],
      })
    }
  },
  computed: {
    ...mapState({ proposal: (state) => state.proposal.proposal }),
    hasCounterOffer() {
      return (
        !this.$empty(this.proposal.counter_offer) &&
        this.proposal.counter_offer.status !== 'void'
      )
    },
    hasAcceptedCounterOffer() {
      return (
        !this.$empty(this.proposal.counter_offer) &&
        this.proposal.counter_offer.status === 'accepted'
      )
    },
    hasSelectedTimeslot() {
      return !this.$empty(this.proposal.timeslot)
    },
    isPresentationPast() {
      // Do not allow accepting proposals in the past
      return this.hasSelectedTimeslot && this.moment(this.proposal.timeslot.start_dt).isBefore(this.moment())
    },
    isCustomProduct() {
      return (
        this.proposal.product.custom ||
        this.proposal.product.name === 'custom'
      )
    }
  },
  methods: {
    ...mapActions('proposal', [
      'acceptProposal',
      'rejectProposal',
      'selectTimeslot',
      'sendCounterOffer'
    ]),
    openModal() {
      return this.$refs.modal.open();
    },
    closeModal() {
      return this.$refs.modal.close();
    },
    async selectedTimeslot(timeslot) {
      await this.selectTimeslot({ id: this.proposal.id, timeslot });
      this.$toast.success('Data da apresentação selecionada');
    },
    async accept() {
      await this.acceptProposal(this.proposal.id);
      this.$emit('accepted', this.proposal.id);
    },
    async reject() {
      await this.rejectProposal(this.proposal.id);
      this.$emit('rejected', this.proposal.id);
    },
    async dispatchCounterOffer(counterOffer) {
      await this.sendCounterOffer(counterOffer);
      this.$toast.success(`Orçamento enviado para ${this.proposal.contractor.name}`);
      this.$refs.modal.close();
    }
  }
}
</script>

<style lang="scss" scoped></style>
