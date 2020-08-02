<template>
  <div>
    <div class="vertical">
      <h6 class="mb-4">Próximas apresentações</h6>
      <div v-for="(presentation, index) in presentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
    </div>
    <!-- Data loaded from state -->
    <presentation-details v-if="!$empty(presentationState)" ref="presentation" :read-only="false">
    </presentation-details>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PresentationInfo from '@/components/presentation/info'
import PresentationDetails from '@/components/presentation/artist/presentation'
export default {
  components: {
    PresentationDetails,
    PresentationInfo
  },
  async asyncData({ store, app }) {
    store.dispatch('presentation/resetPresentation')
    await store.dispatch('presentation/loadPresentations')
  },
  computed: {
    ...mapState({ presentations: (state) => state.presentation.presentations }),
    ...mapState({ presentationState: (state) => state.presentation.presentation })
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation']),
    async open(id) {
      await this.loadPresentation(id)
      this.$refs.presentation.openModal()
    }
  }
}
</script>

<style lang="scss" scoped></style>
