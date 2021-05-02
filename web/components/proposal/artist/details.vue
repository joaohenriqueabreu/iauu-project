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
          <h3 class="cap mb-4">{{ proposal.title }}</h3>
          <p>{{ proposal.notes }}</p>
        </div>
        <div class="boxed main mb-4" v-if="!proposal.has_custom_product">
          <div class="row">
            <div class="col horizontal middle center">
              <icon icon="dollar-sign"></icon><h2>{{ proposal.current_price | twoDecimals }}</h2>
            </div>
            <div class="col horizontal middle center">
              <icon icon="clock"></icon><h2>{{ proposal.duration }}</h2>
            </div>
          </div>
        </div>
        <div class="boxed mb-4" v-if="!$empty(proposal.address)">
          <presentation-address :presentation="proposal"></presentation-address>
        </div>
        <div v-if="proposal.has_custom_product">
          <counter-offer ref="counter" :proposal="proposal" @sent="counterOfferSent"></counter-offer>
        </div>
        <div class="boxed mb-4">
          <presentation-product ref="product" :presentation="proposal"></presentation-product>
        </div>
        <div class="attachments mb-4">
          <attachment v-for="(file, index) in proposal.files" :key="index" :file="file">
          </attachment>
        </div>
        <div class="boxed horizontal" v-if="!$empty(proposal.notes)">
          <icon icon="edit"></icon><p>{{ proposal.notes }}</p>
        </div>
        <div class="spacer"></div>
      </template>
      <!-- <template v-slot:external>
        <chat v-if="!$empty(proposal)" :proposal="proposal"></chat>
      </template> -->
      <template v-slot:footer>
        <div class="vertical middle center full-height">
          <div class="vertical middle center full-height error mb-2">
            <div v-if="proposal.has_custom_product && !proposal.has_counter_offer">
              {{ proposal.contractor.name }} solicitou um produto personalizado. Envie um
              orçamento para depois confirmar a apresentação.
            </div>
            <div v-if="proposal.has_counter_offer && !proposal.has_accepted_counter_offer">
              O contratante deve aceitar o orçamento para poder confirmar a apresentação
            </div>
            <div v-if="!proposal.has_selected_timeslot">
              Selecione uma opção de data para o evento
            </div>
            <div v-if="isProposalPast">
              Data da apresentação expirada. Não é possível aceitar a proposta neste momento.
            </div>
          </div>
          <div class="horizontal center middle full-height">
            <div v-if="(!proposal.has_custom_product || proposal.has_accepted_counter_offer) && proposal.has_selected_timeslot && ! isProposalPast" class="mr-5">
              <form-button @action="accept">Aceitar</form-button>
            </div>
            <div v-if="!isProposalPast">
              <h5 class="clickable" @click="reject">Recusar</h5>
            </div>
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
import CounterOffer             from '@/components/proposal/counterOffer';
// import Chat                     from '@/components/layout/chat';

export default {
  components: {
    PickTimeslot,
    PresentationAddress,
    PresentationDate,
    PresentationProduct,
    PresentationPrice,
    CounterOffer,
    // Chat
  },
  async mounted() {
    if (this.proposal.timeslots == null) { return; }

    if (this.proposal.timeslots.length === 1) {
      await this.selectTimeslot({
        id:       this.proposal.id,
        timeslot: this.proposal.timeslots[0],
      })
    }
  },
  computed: {
    ...mapState({ proposal: (state) => state.proposal.proposal }),
    hasAcceptedCounterOffer() {
      return !this.$empty(this.proposal.counter_offer) && this.proposal.counter_offer.status === 'accepted';
    },
    hasSelectedTimeslot() {
      return !this.$empty(this.proposal.selected_timeslot);
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
      this.$toast.success('Parabens!! Sua apresentação foi confirmada com sucesso!');
      this.$router.push('/artist/presentations');
    },
    async reject() {
      await this.rejectProposal(this.proposal.id);
      this.$emit('rejected', this.proposal.id);
    },
    async counterOfferSent(counterOffer) {
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
      border:     2px solid $layer5;
    }
  }  
}

.spacer {
  padding-bottom: 10vh;
}
</style>
