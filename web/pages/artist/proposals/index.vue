<template>
  <div>
    <div class="vertical">
      <h6 class="mb-4">Últimas propostas</h6>
      <div
        v-for="(presentation, index) in presentations"
        :key="index"
        @click="open(presentation.id)"
      >
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
    </div>
    <!-- Data loaded from state -->
    <proposal-details v-if="!$empty(presentationState)" ref="proposal" :read-only="false">
    </proposal-details>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PresentationInfo from '@/components/presentation/info'
import ProposalDetails from '@/components/presentation/artist/proposal'
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
    ...mapState({ presentationState: (state) => state.presentation.presentation })
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation']),
    async open(id) {
      await this.loadPresentation(id)
      this.$refs.proposal.openModal()
    }
  }
}
</script>

<style lang="scss" scoped></style>
