<template>
  <div v-if="!$empty(presentation)">
    <tabs :items="presentationTabs"></tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProfileStats from '@/components/artist/profile/stats';
import ArtistInfo from '@/components/artist/profile/info';
import PresentationConfig from '@/components/artist/profile/presentationsConfig';
export default {
  async asyncData({ app, store, route }) {
    await store.dispatch('presentation/loadPresentation', route.params.id);
  },
  data() {
    return { }
  },
  computed: {
    ...mapState({presentation: (state) => state.presentation.presentation }),
    presentationTabs() {
      return [
        { title: 'Detalhes', component: ProfileStats },
        { title: 'Info', component: ArtistInfo },
        { title: 'Config', component: PresentationConfig },
      ]
    }
  }
}
</script>

<style>

</style>