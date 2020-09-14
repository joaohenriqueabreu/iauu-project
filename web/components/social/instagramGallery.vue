<template>
  <div>
    <div v-if="!$empty(username) && !$empty(feedData)">
      <div id="instagram-gallery" class="instagram_feed">
        <div class="row">
          <div class="col-4 mb-4" v-for="(media, index) in gallery" :key="index">
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
// @see https://www.cssscript.com/instagram-photos-feed/
export default {
  async mounted() {
    await setTimeout(() => {}, 1000)
    const self = this
    this.gallery = new this.$instagram({
      // 'username': this.username,
      // 'container': 'document.getElementById("instagram-gallery")',
      'container': document.getElementById('instagram-gallery'),
      'display_profile': false,
      'display_biography': false,
      'display_gallery': true,
      'display_igtv': false,
      'items': 9,
      'items_per_row': 3,
      // 'get_data': true,
      // 'styling': false,
      // callback: function (data) { self.feedData = data },
      on_error: function(error_description, error_code) {
        console.log(error_description)
      }
    })
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
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: auto;
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