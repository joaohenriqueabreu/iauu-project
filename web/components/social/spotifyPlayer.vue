<template>
  <div>
    <iframe 
      :src="playerUrl" 
      width="300" 
      height="80" 
      frameborder="0" 
      allowtransparency="true" 
      allow="encrypted-media">
    </iframe>
  </div>
</template>

<script>
export default {
  props: {
    url: { type: String, default: '' }
  },
  computed: {
    playlistUrl() {
      return this.$array.last(this.url.split('/'))
    },
    playerUrl() {
      return `https://open.spotify.com/embed/playlist/${this.playlistUrl}`
    }
  }
}
</script>

<style>

</style>