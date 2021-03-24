<template>
  <div class="horizontal middle center">
    <vue-goodshare-facebook :page_url="currentURL" has_icon class="mr-2"></vue-goodshare-facebook>
    <vue-goodshare-whatsapp :page_url="currentURL" has_icon class="mr-2"></vue-goodshare-whatsapp>
    <vue-goodshare-twitter :page_url="currentURL" has_icon class="mr-3"></vue-goodshare-twitter>
    <div class="share-icon brand-hover clickable" @click="copy">
      <icon icon="share-alt"></icon>
    </div>
  </div>
</template>

<script>
import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue"
import VueGoodshareWhatsapp from "vue-goodshare/src/providers/WhatsApp.vue"
import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue"
export default {
  components: {
    VueGoodshareFacebook,
    VueGoodshareWhatsapp,
    VueGoodshareTwitter
  },
  computed: {
    currentURL() {
      return this.$utils.genAbsoluteUrl(this.$route.path)
    }
  },
  methods: {
    copy() {
      this.$copyToClipboard(this.currentURL)
      this.$toast.success(`Link do artista &nbsp;<u>${this.currentURL}</u>&nbsp; copiado`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .share-icon {
    font-size: $huge;
  }
</style>