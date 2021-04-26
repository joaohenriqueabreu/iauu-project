<template>
  <div>
    <div v-if="!$empty(gallery)">
      <div id="instagram-gallery" class="instagram_feed">
        <div class="row">
          <div class="col-4 mb-4" v-for="(media, index) in limitMedia(gallery)" :key="index">
            <img :src="media">
          </div>
        </div>
      </div>
      <div class="horizontal center middle">
        <a :href="url" class="instagram">Siga a gente no insta</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    await this.getPublicGallery()
  },
  props: {
    url: { type: String, default: '' }
  },
  data() {
    return {
      gallery: {},
      feedData: {}
    }
  },
  computed: {
    username() {
      const usernameMatches = this.url.match(/(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_\.]+)/im)
      if (!this.$empty(usernameMatches) && usernameMatches.length === 2) {
        return usernameMatches[1]
      }

      return null
    }
  },
  methods: {
    limitMedia(gallery) {
      return this.$array.slice(gallery, 0, 9)
    },
    async getPublicGallery() {
      try {
        // TODO This process is unsecure and instagram might block multiple attempts - eventually migrate to Graph API
        const instagramFetchUrl = this.$config.socialConnect.getInstagramFetchEndpoint(this.username)
        const data = await this.$cors.fetch(instagramFetchUrl)

        this.gallery = this.$array.map(data.graphql.user.edge_owner_to_timeline_media.edges, (media) => media.node.display_url)
      } catch (error) {
        this.$sentry.captureException(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  max-width: 350px;
  height: 400px;
  // height: auto;
}

.instagram{ width:100px; height:100px;
  @extend .vertical, .center, .middle;
  background: radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%);

  min-width: 200px;
  height: 50px;
  text-align: center;
  color: $white;
  border-radius: $rounded;
  padding: 2 * $space;
  transition: $transition;

  &:hover {
    transition: $transition;
    color: $white !important;
    box-shadow: $shadow;
  }
}
</style>