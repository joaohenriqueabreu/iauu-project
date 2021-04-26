<template>
  <div>
    <div class="vertical">
      <h6 class="mb-4">Últimas propostas</h6>
      <div v-for="(proposal, id) in proposals" :key="id" @click="open(id)">
        <!-- Proposal summary can be represented as presentation -->
        <proposal-info :presentation="proposal"></proposal-info>
      </div>
    </div>
    <!-- Data loaded from state -->
    <proposal-details v-if="!$empty(proposal)" ref="proposal" :read-only="false">
    </proposal-details>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProposalInfo             from '@/components/proposal/info';
import ProposalDetails          from '@/components/proposal/artist/details';
export default {
  components: {
    ProposalDetails,
    ProposalInfo
  },
  async mounted() {
    // Not sure why, but this is not working on ayncData(after getting artist and contractor from microservices)
    await this.loadProposals();
  },
  computed: {
    ...mapState({ proposals: (state) => state.proposal.proposals }),
    ...mapState({ proposal:  (state) => state.proposal.proposal })
  },
  methods: {
    ...mapActions('proposal', ['loadProposals']),
    ...mapActions('proposal', ['loadProposal']),
    async open(id) {
      await this.loadProposal(id);
      this.$refs.proposal.openModal();
    }
  }
}
</script>

<style lang="scss" scoped></style>
