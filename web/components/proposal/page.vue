<template>
  <div>
    <div v-if="!$empty(unreadProposals)" class="vertical mb-5">
      <h6 class="horizontal middle mb-4">Propostas não lidas <span class="badge circle brand">{{ unreadProposals.length }}</span></h6>
      <div v-for="(proposal, index) in unreadProposals" :key="index" @click="open(proposal)">
        <proposal-info :presentation="proposal"></proposal-info>
      </div>      
    </div>
    <div v-if="!$empty(otherProposals)" class="vertical">            
      <h6 class="mb-4">Outras propostas</h6>
      <div v-for="(proposal, index) in otherProposals" :key="index" @click="open(proposal)">
        <proposal-info :presentation="proposal"></proposal-info>
      </div>      
    </div>
    <div v-if="$empty(unreadProposals) && $empty(otherProposals)">
      <h6>Nenhuma proposta recebida</h6>
    </div>
    <proposal-details ref="proposal" :read-only="false"></proposal-details>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
export default {
  async mounted() {
    await this.loadProposals();
  },
  computed: {
    ...mapGetters('proposal', ['unreadProposals', 'otherProposals']),
    ...mapState({proposal:  (state) => state.proposal.proposal})
  },
  methods: {
    ...mapActions('proposal', ['loadProposals', 'loadProposal', 'markProposalRead']),
    async open(proposal) {
      await this.loadProposal(proposal.id);
      if (! proposal.is_read) { await this.markProposalRead(); }
      
      this.$refs.proposal.openModal();
    }
  }
}
</script>

<style lang="scss" scoped></style>
