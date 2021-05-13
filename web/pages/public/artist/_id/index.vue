<template>
  <div>
    <artist-page></artist-page>
  </div>
</template>

<script>
import ArtistPage from '@/components/artist/page';
export default {
  components: {
    ArtistPage,
  },
  middleware: [],
  async asyncData({ store, route }) {
    await store.dispatch('artist/loadArtist', route.params.id);
  }
}
</script>

<style>

</style>