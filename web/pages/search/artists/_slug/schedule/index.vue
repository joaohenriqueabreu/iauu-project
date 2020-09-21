<template>
  <div>
    <main class="container">
      <h4 class="mb-2">Agenda do {{ artist.name }}</h4>
      <div class="d-flex justify-content-between">
        <div>
          <p>Consulte a disponibilidade do artista para o seu evento.</p>
        </div>
        <div class="vertical">
          <h6 class="mb-2">Compartilhe!</h6>
          <share></share>
        </div>
      </div>
      <hr class="mb-4">
      <calendar ref="calendar" :timeslots="timeslots" @selected="openSendProposalModal"></calendar>
    </main>
    <footer>
      <div class="full-height vertical center middle">
        <nuxt-link v-if="$auth.loggedIn && $auth.hasScope('contractor')" class="brand-btn mb-4" :to="`/proposal/to/artist/${artist.id}`" >
          Enviar proposta
        </nuxt-link>
        <nuxt-link v-if="!$auth.loggedIn" class="brand-btn mb-4" :to="`/search/artists/${artist.slug}/schedule`">
          <h6>Cadastre-se para contratar esse artista</h6>
        </nuxt-link>
        <nuxt-link :to="`/search/artists/${artist.slug}`">
          <u>Ver mais informações do artista</u>
        </nuxt-link>
      </div>
    </footer>
    <modal ref="sendProposal" height="tiny" hide-header>
      <template v-slot:main>
        <div class="vertical middle full-height p-4">
          <h6>
            Olá! {{ artist.name }} está disponível em {{ selectedDate | date }}. Corra já e envie sua proposta para segurar a data com o artista.
          </h6>
        </div>
      </template>
      <template v-slot:footer>
        <div class="vertical middle center">
          <nuxt-link v-if="$auth.loggedIn && $auth.hasScope('contractor')" class="brand-btn mb-4" :to="`/proposal/to/artist/${artist.id}`" >
            Enviar proposta
          </nuxt-link>
          <nuxt-link v-if="!$auth.loggedIn" class="brand-btn mb-4" :to="`/search/artists/${artist.slug}/schedule`">
            <h6>Cadastre-se para contratar esse artista</h6>
          </nuxt-link>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  async asyncData({ app, store, route }) {
    await store.dispatch('contractor/loadArtist', route.params.slug)
  },
  async mounted() {
    await this.loadSchedule({ id: this.artist.id })
  },
  data() {
    return {
      selectedDate: ''
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.contractor.artist }),
    ...mapState({ timeslots: (state) => state.schedule.timeslots })
  },
  methods: {
    ...mapActions('schedule', ['loadSchedule']),
    openSendProposalModal(timeslot) {
      this.selectedDate = timeslot.start_dt
      this.$refs.sendProposal.open()
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  @extend .full-width;
  position: fixed;
  bottom: 0;
  background: $layer1;
  padding: 2 * $space;
  height: 15vh;
}
</style>