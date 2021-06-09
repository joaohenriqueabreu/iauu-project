<template>
  <div class="proposal-container">
    <modal ref="modal">
      <template v-slot:header>
        <div class="horizontal d-flex justify-content-between">
          <div v-if="!$empty(proposal.artist)" class="horizontal middle">
            <avatar class="mr-3" v-if="!$empty(proposal.artist.photo)" :src="proposal.artist.photo" :username="proposal.artist.name">
            </avatar>
            <div class="vertical middle">
              <h6>Voce enviou uma proposta para {{ proposal.artist.name }}</h6>
            </div>
          </div>
          <div class="d-flex align-items-end">
            <span class="identifier">Proposta</span>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="mx-4 mb-4 vertical center middle">
          <h3 class="cap mb-4">{{ proposal.title }}</h3>
        </div>
        <div class="horizontal mb-4" v-if="!$empty(proposal.notes)">
          <icon icon="edit"></icon><p>{{ proposal.notes }}</p>
        </div>
        <div v-if="!proposal.has_custom_product" class="horizontal text-center mb-5">
          <h3 class="boxed shadow p-5 mr-5"><icon icon="dollar-sign"></icon>{{ proposal.current_price | twoDecimals }}</h3>
          <h3 class="boxed shadow p-5"><icon icon="clock"></icon>{{ proposal.duration }} {{ 'hora' | pluralize(proposal.duration) }}</h3>
        </div>
        <div class="boxed p-4 mb-4">
          <div v-if="!$empty(proposal.address)" class="mb-4">
            <presentation-address :presentation="proposal"></presentation-address>
          </div>
          <div v-if="proposal.has_selected_timeslot">
            <h6><icon icon="calendar-alt"></icon> O evento foi confirmado para {{ proposal.selected_timeslot.start_dt | date }}</h6>
          </div>
        </div>
        <div v-if="!proposal.has_selected_timeslot" class="boxed p-4 mb-4">
          <proposal-timeslots :proposal="proposal"></proposal-timeslots>
        </div>
        <div v-if="proposal.has_counter_offer">
          <reply-counter-offer :proposal="proposal" @replied="counterOfferReplied"></reply-counter-offer>
        </div>
        <div class="boxed mb-4">
          <presentation-product ref="product" :presentation="proposal"></presentation-product>
        </div>
        <div class="attachments mb-4">
          <attachment v-for="(file, index) in proposal.files" :key="index" :file="file">
          </attachment>
        </div>
      </template>
      <!-- <template v-slot:external>
        <chat v-if="!$empty(proposal)" :proposal="proposal"></chat>
      </template> -->
      <template v-slot:footer>
        <div class="vertical middle center text-center">
          <div v-if="hasPendingAction" class="error mb-4">
            <div v-if="proposal.has_custom_product && !proposal.has_counter_offer">
              Aguardando orçamento do artista.
            </div>
            <div v-else-if="proposal.has_counter_offer && !proposal.has_accepted_counter_offer">
              Revise e responda o orçamento enviado pelo artist.
            </div>
            <div v-else-if="!proposal.has_selected_timeslot">
              Aguardando escolha de data da apresentção pelo artista.
            </div>
            <div v-else-if="isProposalPast">
              Data da apresentação expirada. Não é possível aceitar a proposta neste momento.
            </div>
          </div>
          <div class="horizontal center middle full-height">
            <div v-if="!isProposalPast">
              <h5 class="clickable brand-hover" @click="$refs.cancelProposal.show()">Retirar proposta</h5>
            </div>
            <confirm-dialog yes-no ref="cancelProposal" message="Deseja cancelar esta proposta?" @confirmed="cancel"></confirm-dialog>
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
import ProposalTimeslots        from '@/components/proposal/timeslots';
import PresentationDate         from '@/components/presentation/date';
import PresentationProduct      from '@/components/presentation/product';
import ReplyCounterOffer        from '@/components/proposal/replyCounterOffer';
// import Chat                     from '@/components/layout/chat';

export default {
  components: {
    PickTimeslot,
    ProposalTimeslots,
    PresentationAddress,
    PresentationDate,
    PresentationProduct,
    ReplyCounterOffer,
    // Chat
  },
  computed: {
    ...mapState({ proposal: (state) => state.proposal.proposal }),
    hasAcceptedCounterOffer() {
      return !this.$empty(this.proposal.counter_offer) && this.proposal.counter_offer.status === 'accepted';
    },
    hasSelectedTimeslot() {
      return !this.$empty(this.proposal.selected_timeslot);
    },
    hasPendingAction() {
      return (this.proposal.has_custom_product && !this.proposal.has_counter_offer) ||
        (this.proposal.has_counter_offer && !this.proposal.has_accepted_counter_offer) ||
        (!this.proposal.has_selected_timeslot) ||
        (this.isProposalPast);
    },
    isProposalPast() {
      // Do not allow accepting proposals in the past
      return this.proposal.has_selected_timeslot && 
        this.moment(this.proposal.selected_timeslot.start_dt).isBefore(this.moment());
    },
    isCustomProduct() {
      return this.proposal.is_custom_product;
    }
  },
  methods: {
    ...mapActions('proposal', [
      'acceptProposal',
      'rejectProposal',
      'selectTimeslot',
      'sendCounterOffer',
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
    async cancel() {
      await this.rejectProposal(this.proposal.id);
      this.$emit('rejected', this.proposal.id);
    },
    async counterOfferReplied() {
      this.$refs.modal.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.boxed {
  background: $layer3;
  &.main {
    .col {
      background: transparent;
      // border:     2px solid $layer5;
    }
  }
}
</style>
