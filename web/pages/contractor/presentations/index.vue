<template>
  <div>
    <div class="vertical mb-4" v-if="!$empty(openPresentations)">
      <h6 class="mb-4">Próximas apresentações contratadas</h6>
      <div v-for="(presentation, index) in openPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr>
    </div>
    <div class="vertical mb-4" v-if="!$empty(pendingConfirmPresentations)">
      <h6 class="mb-4">Apresentações realizadas (aguardando confirmação)</h6>
      <div v-for="(presentation, index) in pendingConfirmPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr>
    </div>
    <div class="vertical mb-4" v-if="!$empty(completedPresentations)">
      <h6 class="mb-4">Apresentações concluídas</h6>
      <div v-for="(presentation, index) in completedPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr>
    </div>
    <div class="vertical mb-4" v-if="!$empty(cancelledPresentations)">
      <h6 class="mb-4">Apresentações canceladas</h6>
      <div v-for="(presentation, index) in cancelledPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
    </div>
    <div v-if="presentations.length === 0" class="mb-4">
      Nenhuma apresentação confirmada <nuxt-link to="search">Encontre um artista para seu evento e envie uma proposta</nuxt-link>
    </div>
    <!-- Data loaded from state -->
    <presentation-details v-if="!$empty(presentationState)" ref="presentation" :read-only="false" @confirmed="handleConfirmedPresentaion">
    </presentation-details>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import PresentationInfo from '@/components/presentation/info'
import PresentationDetails from '@/components/presentation/contractor/presentation'
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
    ...mapGetters('presentation', ['openPresentations', 'pendingConfirmPresentations', 'completedPresentations', 'cancelledPresentations']),
    ...mapState({ presentations: (state) => state.presentation.presentations }),
    ...mapState({ presentationState: (state) => state.presentation.presentation })
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation', 'loadPresentations']),
    async open(id) {
      await this.loadPresentation(id)
      this.$refs.presentation.openModal()
    },
    async handleConfirmedPresentaion() {
      await this.loadPresentations()
    }
  }
}
</script>

<style lang="scss" scoped></style>
