<template>
  <div>
    <div v-if="!$empty(openProposals)" class="vertical">
      <h6 class="mb-4">Propostas Enviadas</h6>
      <div
        v-for="(presentation, index) in openProposals"
        :key="index"
        @click="open(presentation.id)"
      >
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr />
    </div>
    <div v-if="!$empty(rejectedProposals)" class="vertical">
      <h6 class="mb-4">Propostas Recusadas</h6>
      <div
        v-for="(presentation, index) in rejectedProposals"
        :key="index"
        @click="open(presentation.id)"
      >
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr />
    </div>
    <div v-if="presentations.length === 0" class="mb-4">
      Nenhuma proposta enviada
      <nuxt-link to="/search">Encontre um artista para seu evento e envie uma proposta</nuxt-link>
    </div>
    <!-- Data loaded from state -->
    <proposal-summary v-if="!$empty(presentationState)" ref="proposal" :read-only="false" @cancelled="cancelledProposal">
    </proposal-summary>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import PresentationInfo from '@/components/presentation/info'
import ProposalSummary from '@/components/presentation/contractor/proposalSummary'
export default {
  components: {
    ProposalSummary,
    PresentationInfo
  },
  async asyncData({ store, app }) {
    store.dispatch('presentation/resetPresentation')
    await store.dispatch('presentation/loadProposals')
  },
  computed: {
    ...mapState({ presentations: (state) => state.presentation.presentations }),
    ...mapState({ presentationState: (state) => state.presentation.presentation }),
    ...mapGetters('presentation', ['openProposals', 'rejectedProposals'])
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation', 'resetPresentation', 'loadProposals']),
    async open(id) {
      await this.loadPresentation(id)
      this.$refs.proposal.openModal()
    },
    async cancelledProposal() {
      this.resetPresentation()
      await this.loadProposals()
    }
  }
}
</script>

<style lang="scss" scoped></style>
