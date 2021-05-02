<template>
  <div v-if="!$empty(proposal)" class="position-relative">
    <div class="top-right">
      <h6>Enviada em {{ proposal.create_dt | date }}</h6>
    </div>
    <div>
      <h3 class="mb-4">{{ proposal.title }}</h3>
      <p class="mb-4">{{ proposal.notes }}</p>
      <div class="mb-4 horizontal middle">
        <h6 class="mr-2"><icon icon="calendar-alt"></icon> Datas sugeridas</h6>
        <proposal-timeslots read-only :proposal="proposal"></proposal-timeslots>
      </div>
      <div class="mb-4">
        <presentation-address :presentation="proposal"></presentation-address>
      </div>
      <div>
        <presentation-product :presentation="proposal"></presentation-product>
      </div>
      <div v-if="proposal.has_custom_product" class="boxed border">
        <h5 class="mb-3">Proposta negociada</h5>        
        <counter-offer read-only :proposal="proposal"></counter-offer>
      </div>      
    </div>
    <div class="my-5 half-width vertical middle center">
      <h5><icon icon="signature"></icon></h5>
      <hr class="light thick">
      <h6>{{ proposal.contractor.name }}</h6>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProposalTimeslots        from '@/components/proposal/timeslots';
import PresentationAddress      from '@/components/presentation/address';
import CounterOffer             from '@/components/proposal/counterOffer';
import PresentationProduct      from '@/components/presentation/product';
export default {
  components: {
    ProposalTimeslots,
    PresentationAddress,
    CounterOffer,
    PresentationProduct,
  },
  async mounted() {
    await this.loadProposal(this.presentation.proposal_id);
  },
  computed: {
    ...mapState({ presentation: state => state.presentation.presentation }),
    ...mapState({ proposal: state => state.proposal.proposal }),
  },
  methods: {
    ...mapActions('proposal', ['loadProposal'])
  }
}
</script>

<style>

</style>