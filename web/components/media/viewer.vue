<template>
  <div>
    <div v-if="loaded">
      <div class="preview">
        <div class="preview-img">
          <div class="network-icon">
            <avatar :src="networkIcon" :size="30" class="social"> </avatar>
          </div>
          <img v-if="!$utils.empty(link.images)" :src="link.images[0]" />
        </div>
        <div class="preview-text">
          <h6>{{ link.title }}</h6>
        </div>
      </div>
    </div>
    <div v-else>
      <loading :active="$utils.empty(link.images)"></loading>
    </div>
  </div>
</template>

<script>
import { getLinkPreview } from 'link-preview-js'
export default {
  props: {
    media: { type: Object, default: () => {} },
    simple: { type: Boolean, default: false },
    avatar: { type: Boolean, default: false },
    removable: { type: Boolean, default: false }
  },
  data() {
    return {
      link: { type: Object, default: () => {} },
      loaded: { type: Boolean, default: false }
    }
  },
  computed: {
    networkIcon() {
      if (this.isSocialMatch(this.media.url, this.$config.youtubeSubstringMatch)) {
        return require('@/assets/imgs/social/youtube.png')
      }

      if (this.isSocialMatch(this.media.url, this.$config.tiktokSubstringMatch)) {
        return require('@/assets/imgs/social/tiktok.png')
      }

      if (this.isSocialMatch(this.media.url, this.$config.spotifySubstringMatch)) {
        return require('@/assets/imgs/social/spotify.png')
      }

      if (this.isSocialMatch(this.media.url, this.$config.instagramSubstringMatch)) {
        return require('@/assets/imgs/social/instagram.png')
      }

      if (this.isSocialMatch(this.media.url, this.$config.vimeoSubstringMatch)) {
        return require('@/assets/imgs/social/vimeo.png')
      }

      if (this.isSocialMatch(this.media.url, this.$config.facebookSubstringMatch)) {
        return require('@/assets/imgs/social/facebook.png')
      }

      return require('@/assets/imgs/music.png')
    }
  },
  async mounted() {
    // Use proxy server to bypass CORS restriction
    try {
      this.link = await getLinkPreview(`https://cors-anywhere.herokuapp.com/${this.media.url}`)
    } catch (error) {
      this.$sentry.captureException(error)
    }

    this.loaded = true
  },
  methods: {
    isSocialMatch(url, matches) {
      const hasMatch = matches.filter((match) => {
        return url.includes(match)
      })

      return hasMatch.length > 0
    }
  }
}
</script>

<style lang="scss">
.VueCarousel-pagination {
  height: 5vh;
  position: relative;
}
</style>

<style lang="scss" scoped>
.default {
  max-height: 100%;
  max-width: 100%;
}

.simple-container {
  @extend .horizontal, .middle, .full-width;
  border-radius: $rounded;
  padding: $space;
  transition: $transition;

  a {
    max-width: 85%;
  }

  &:hover {
    transition: $transition;
    box-shadow: $shadow;
  }
}
a {
  background: transparent;
  outline: none;
  border: none;
  padding: 0;

  &:hover {
    background: transparent;
    outline: none;
    border: none;
  }

  &:focus {
    background: transparent;
    outline: none;
    border: none;
  }
}

.preview {
  @extend .vertical;
  width: 100%;
  height: 100%;

  margin-bottom: 4 * $space;
  box-shadow: $shadow;
  position: relative;
  background: $layer4;

  .preview-img {
    position: relative;
    height: 100%;
    // max-height: 100px;
    .network-icon {
      position: absolute;
      bottom: 5px;
      right: 5px;
      height: 30px;
      width: 30px;
    }
    // width: 50%;
    img {
      width: 100%;
      max-height: 100px;
    }
  }

  .preview-text {
    display: block;
    max-width: 100%;
    padding: 2 * $space;
    text-align: left;
    font-size: $small;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: nowrap;
  }
}
</style>
