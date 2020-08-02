<template>
  <div>
    <form @submit.prevent="saveProfile">
      <image-uploader ref="bgUploader" @uploaded="setBackground">
        <header :style="{ 'background-image': `url(${backgroundImg})` }" @click="uploadBG"></header>
      </image-uploader>
      <main>
        <div class="logo">
          <image-uploader ref="avatarUploader" :rounded="true" @uploaded="setAvatar">
            <avatar :src="avatarImg" :size="150" @click="uploadAvatar"></avatar>
          </image-uploader>
        </div>
        <div class="pt-5"></div>
        <div class="boxed full-width">
          <ul class="nav nav-tabs mt-4">
            <li class="nav-link first">
              <a class="nav-link" :class="{ active: statsTab }" @click="activeTab = 'stats'">
                Stats
              </a>
            </li>
            <li class="nav-link">
              <a class="nav-link" :class="{ active: infoTab }" @click="activeTab = 'info'">
                Informações
              </a>
            </li>
            <li class="nav-link">
              <a class="nav-link" :class="{ active: socialTab }" @click="activeTab = 'social'">
                Redes Sociais
              </a>
            </li>
            <li class="nav-link">
              <a class="nav-link" :class="{ active: catTab }" @click="activeTab = 'categories'">
                Categorias
              </a>
            </li>
            <li class="nav-link">
              <a class="nav-link" :class="{ active: tagsTab }" @click="activeTab = 'tags'">
                Pesquisa
              </a>
            </li>
          </ul>
          <div class="mb-5 raised vertical middle" :class="{ first: statsTab }">
            <fade-transition mode="out-in">
              <profile-stats v-show="statsTab" key="stats"></profile-stats>
            </fade-transition>
            <fade-transition mode="out-in">
              <artist-info v-show="infoTab" ref="info" key="artist"></artist-info>
            </fade-transition>
            <fade-transition mode="out-in">
              <social-networks v-show="socialTab" ref="social" key="social"></social-networks>
            </fade-transition>
            <fade-transition mode="out-in">
              <artist-categories v-show="catTab" key="categories" :categories="categories">
              </artist-categories>
            </fade-transition>
            <fade-transition mode="out-in">
              <search-tags v-show="tagsTab" key="tags"></search-tags>
            </fade-transition>
          </div>
        </div>
      </main>
      <footer>
        <div class="half-width">
          <form-button @action="saveProfile">Salvar</form-button>
        </div>
      </footer>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ProfileStats from '@/components/artist/profile/stats'
import ArtistInfo from '@/components/artist/profile/info'
import SocialNetworks from '@/components/artist/profile/social'
import ArtistCategories from '@/components/artist/profile/categories'
import SearchTags from '@/components/artist/profile/tags'
export default {
  components: {
    'profile-stats': ProfileStats,
    'artist-info': ArtistInfo,
    'social-networks': SocialNetworks,
    'artist-categories': ArtistCategories,
    'search-tags': SearchTags
  },
  async asyncData({ app, store, error, $sentry }) {
    try {
      await store.dispatch('artist/loadArtist')
      const { data } = await app.$axios.get('categories')
      return { categories: data }
    } catch (e) {
      $sentry.captureException(e)
      error({ statusCode: 404, message: 'Perfil não encontrado' })
    }
  },
  data() {
    return {
      activeTab: { type: String, default: 'stats' }
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    statsTab() {
      return this.activeTab === 'stats'
    },
    infoTab() {
      return this.activeTab === 'info'
    },
    socialTab() {
      return this.activeTab === 'social'
    },
    catTab() {
      return this.activeTab === 'categories'
    },
    tagsTab() {
      return this.activeTab === 'tags'
    },
    backgroundImg() {
      return !this.$utils.empty(this.artist.media.bg)
        ? this.artist.media.bg
        : this.$config.defaultBGImgUrl
    },
    avatarImg() {
      return !this.$utils.empty(this.artist.user.photo)
        ? this.artist.user.photo
        : this.$config.defaultAvatarImgUrl
    }
  },
  created() {
    this.profile = this.$object.clone(this.artist)
    this.activeTab = 'stats'
  },
  methods: {
    ...mapActions('artist', ['saveProfile']),
    ...mapMutations('artist', { updateProfile: 'update_profile' }),

    uploadBG() {
      this.$refs.bgUploader.upload()
    },
    uploadAvatar() {
      this.$refs.avatarUploader.upload()
    },
    categorySelect(category) {
      alert(category)
    },
    async setBackground({ url }) {
      this.updateProfile({ prop: 'media.bg', data: url })
      await this.saveProfile()
    },
    async setAvatar({ url }) {
      this.updateProfile({ prop: 'user.photo', data: url })
      await this.saveProfile()
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  header {
    height: 30vh;
    background-size: cover;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  main {
    @extend .vertical, .center, .middle;
    min-height: 70vh;
    position: relative;
    margin-bottom: 5 * $space;
    .logo {
      position: absolute;
      top: -75px;
      z-index: $above;
    }

    .boxed {
      @extend .vertical, .middle;
      background: $layer3;
      box-shadow: $shadow;
      border-radius: $edges;
      padding: 5 * $space;

      .raised {
        transition: $transition;
        background: $layer4;
        padding: 4 * $space;
        box-shadow: $shadow;
        width: 100%;
        border-radius: $edges;
        min-height: 50vh;

        &.first {
          border-radius: 0 $edges $edges $edges;
        }
      }
    }

    .vue-avatar--wrapper {
      box-shadow: $shadow;
    }
  }

  footer {
    height: 10vh;
    position: relative;
  }

  // Overwrite bootstrap styling
  .nav-tabs {
    border-bottom: none;
    z-index: $moveToTop;
    .nav-link {
      padding-bottom: 0;
      border: none;
      border-top-left-radius: $edges;
      border-top-right-radius: $edges;
      cursor: pointer;
      transition: $transition;

      &.first {
        padding-left: 0;
        padding-right: 0;
      }

      &.active {
        background: $layer4;
        border: none;
        color: $brand;
        box-shadow: 0 -19px 19px 2px rgba(0, 0, 0, 0.1);
      }

      &:hover {
        transition: $transition;
        color: $layer5;
      }
      a {
        padding-bottom: 2 * $space;
      }
    }
  }
}
</style>
