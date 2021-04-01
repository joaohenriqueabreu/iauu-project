<template>
  <div>
    <div v-if="!$empty(unpaidPresentations)" class="vertical mb-4">
      <h6 class="mb-4">Pagamentos pendentes</h6>
      <overlay v-for="(presentation, index) in unpaidPresentations" :key="index">
        <template v-slot:default>
          <nuxt-link :to="`presentations/${presentation.id}`" target="_blank">
            <presentation-info :presentation="presentation"></presentation-info>
          </nuxt-link>
        </template>
        <template v-slot:hover>
          <nuxt-link :to="`presentations/${presentation.id}`" target="_blank">
            <div class="full-width" @click="pay(presentation.id)"><h1>Pagar</h1></div>
          </nuxt-link>
        </template>
      </overlay>
      <hr />
    </div>
    <div v-if="!$empty(openPresentations)" class="vertical mb-4">
      <h6 class="mb-4">Próximas apresentações contratadas</h6>
      <div v-for="(presentation, index) in openPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr />
    </div>
    <div v-if="!$empty(pendingConfirmPresentations)" class="vertical mb-4">
      <h6 class="mb-4">Apresentações realizadas (aguardando confirmação)</h6>
      <div v-for="(presentation, index) in pendingConfirmPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr />
    </div>
    <div v-if="!$empty(completedPresentations)" class="vertical mb-4">
      <h6 class="mb-4">Apresentações concluídas</h6>
      <div v-for="(presentation, index) in completedPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
      <hr />
    </div>
    <div v-if="!$empty(cancelledPresentations)" class="vertical mb-4">
      <h6 class="mb-4">Apresentações canceladas</h6>
      <div v-for="(presentation, index) in cancelledPresentations" :key="index" @click="open(presentation.id)">
        <presentation-info :presentation="presentation"></presentation-info>
      </div>
    </div>
    <div v-if="presentations.length === 0" class="mb-4">
      Nenhuma apresentação confirmada
      <nuxt-link to="/search">Encontre um artista para seu evento e envie uma proposta</nuxt-link>
    </div>
    <presentation-summary v-if="!$empty(presentation)" ref="presentation" :read-only="false" @confirmed="handleConfirmedPresentaion">
    </presentation-summary>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PresentationInfo from '@/components/presentation/info';
import PresentationSummary from '@/components/presentation/contractor/presentationSummary';
export default {
  components: {
    PresentationSummary,
    PresentationInfo
  },
  async asyncData({ store, app }) {
    store.dispatch('presentation/resetPresentation');
    await store.dispatch('presentation/loadPresentations');
  },
  computed: {
    ...mapGetters('presentation', [
      'unpaidPresentations',
      'openPresentations',
      'pendingConfirmPresentations',
      'completedPresentations',
      'cancelledPresentations'
    ]),
    ...mapState({ presentations: (state) => state.presentation.presentations }),
    ...mapState({ presentation: (state) => state.presentation.presentation })
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation', 'loadPresentations']),
    async open(id) {
      const route = this.$router.resolve({path: `/contractor/presentations/${id}`});
      window.open(route.href, '_blank');
    },
    async handleConfirmedPresentaion() {
      await this.loadPresentations();
    },
  }
}
</script>

<style lang="scss" scoped></style>
