<template>
  <div>
    <artist-page></artist-page>
  </div>
</template>

<script>
import ArtistPage from '@/components/artist/page';
export default {
  components: {
    ArtistPage
  },
  async asyncData({ store, route }) {
    await store.dispatch('artist/loadArtistPublicProfile', route.params.slug);
  }
}
</script>

<style>

</style>