<template>
  <div>
    <div class="vertical" v-if="!$empty(openProposals)">
      <h6 class="mb-4">Propostas Enviadas</h6>
      <div v-for="(presentation, index) in openProposals" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr>
    </div>
    <div class="vertical" v-if="!$empty(rejectedProposals)">
      <h6 class="mb-4">Propostas Recusadas</h6>
      <div v-for="(presentation, index) in rejectedProposals" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr>
    </div>
    <div v-if="presentations.length === 0" class="mb-4">
      Nenhuma proposta enviada <nuxt-link to="search">Encontre um artista para seu evento e envie uma proposta</nuxt-link>
    </div>
    <!-- Data loaded from state -->
    <proposal-details v-if="!$empty(presentationState)" ref="proposal" @cancelled="cancelledProposal" :read-only="false">
    </proposal-details>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import PresentationInfo from '@/components/presentation/info'
import ProposalDetails from '@/components/presentation/contractor/proposal'
export default {
  components: {
    ProposalDetails,
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
