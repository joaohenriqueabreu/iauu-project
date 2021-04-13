<template>
  <div>
    <div class="vertical">
      <h6 class="mb-4">Próximas apresentações</h6>
      <nuxt-link v-for="(presentation, index) in presentations" :key="index" :to="`/artist/presentations/${presentation.id}`" target="_blank">
        <presentation-info :presentation="presentation"></presentation-info>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PresentationInfo from '@/components/presentation/info';
export default {
  components: {
    PresentationInfo
  },
  async asyncData({ store, app }) {
    store.dispatch('presentation/resetPresentation')
    await store.dispatch('presentation/loadPresentations')
  },
  computed: {
    ...mapState({ presentations: (state) => state.presentation.presentations }),
    ...mapState({ presentationState: (state) => state.presentation.presentation })
  }
}
</script>

<style lang="scss" scoped></style>
