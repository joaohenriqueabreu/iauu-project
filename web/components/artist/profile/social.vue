<template>
  <div class="vertical center middle">
    <div class="vertical center mb-2">
      <h6 class="mb-2">Conecte suas redes sociais</h6>
      <small class="mx-5 px-sm-5 mb-2">
        Navegue até suas redes sociais busque pelo link de referência para a página principal,
        copie e cole na caixa da texto e adicione a sua lista de redes sociais para que os
        clientes possam visualizar suas produções quando forem contratá-los.
      </small>
    </div>
    <div class="vertical half-width mb-4">
      <fade-transition group class="horizontal middle center">
        <div v-for="(network, index) in social" :key="index">
          <media-avatar class="mb-2 mr-4" removable :media="network" @remove="unlink(index)">
          </media-avatar>
        </div>
      </fade-transition>
      <div class="horizontal middle full-width">
        <form-input
          v-model="newNetwork"
          icon="thumbs-up"
          class="full-width"
          placeholder="Cole o link de suas midias sociais aqui"
          @enter="link"
        ></form-input>
        <font-awesome icon="plus" class="clickable ml-3" @click="link"></font-awesome>
      </div>
    </div>
    <div class="mb-4">
      <social-connect-info social-tab></social-connect-info>
    </div>
    <div v-if="hasConnectedInstagram">
      <div class="mb-4">
        <h6 class="mb-2">Agora que conectou seu insta, clique aqui para que possamos buscar o número de seguidores da sua págin</h6>
        <div class="vertical">
          <small>Lembre-se de deixar seu perfil como público (caso contrário não conseguiremos buscar os dados)</small>
          <small><small class="beta">(beta)</small> Por favor atualize esporadicamente - estamos trabalhando para implantar uma atualização automática dos seguidores</small>
        </div>
        
      </div>
      <div class="horizontal desktop-only middle center">
        <form-button @action="getPublicPageFanCount" class="mr-4 mb-4 mb-sm-0">Buscar seguidores</form-button>
        <h6 class="mr-2 mb-2 mb-sm-0">Número de seguidores: </h6>
        <span v-if="!$empty(artist.stats.followers)">{{ artist.stats.followers }}</span>
        <span v-else class="error">Clique no botão para buscar</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import SocialConnectInfo from '@/components/artist/profile/socialConnectInfo'
export default {
  components: {
    SocialConnectInfo
  },
  data() {
    return {
      newNetwork: ''
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      social: 'artist.social',
      stats: 'artist.stats'
    }),
    hasConnectedInstagram() {
      return !this.$empty(this.instagramUrl)
    },
    instagramUrl() {
      const instagramUrl = this.$collection.filter(this.social, (network) => network.includes('instagram'))
      if (!this.$empty(instagramUrl)) {
        return instagramUrl[0]
      }

      return null
    },
    instagramUsername() {
      const usernameMatches = this.instagramUrl.match(/(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_\.]+)/im)
      if (!this.$empty(usernameMatches) && usernameMatches.length === 2) {
        return usernameMatches[1]
      }

      return null
    }
  },
  methods: {
    // ...mapMutations('artist', { updateProfile: 'update_profile' }),
    async link() {
      if (this.$utils.empty(this.newNetwork)) {
        return
      }

      const networks = this.getArtistSocialNetworks()
      networks.push(this.newNetwork)
      // await this.updateProfile({ prop: 'social', data: networks })
      this.social = networks
      this.newNetwork = ''
    },
    unlink(index) {
      const networks = this.getArtistSocialNetworks()
      this.$delete(networks, index)
      // this.updateProfile({ prop: 'social', data: networks })
      this.social = networks
    },
    getArtistSocialNetworks() {
      return this.$object.clone(this.artist.social)
    },
    openInfoModal() {
      this.$refs.info.open()
    },
    async getPublicPageFanCount() {
      try {
        // TODO This process is unsecure and instagram might block multiple attempts - eventually migrate to Graph API
        const instagramFetchUrl = this.$config.socialConnect.getInstagramFetchEndpoint(this.instagramUsername)
        const { data } = await this.$axios.get(`${this.$config.corsBypassUrl}${instagramFetchUrl}`)
        const stats = this.$object.clone(this.stats)
        stats.followers = data.graphql.user.edge_followed_by.count
        
        this.stats = stats
      } catch (error) {
        this.$sentry.captureException(error)
        this.$toast.error('Não conseguimos acessar sua página. Por favor verifique o link fornecido e se é um perfil público')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-box {
  @extend .horizontal, .middle, .center;
  margin: 0 5 * $space;

  [data-icon] {
    color: $layer5;
    font-size: 55px;
    font-weight: $bold;
    // box-shadow: $shadow;
    filter: drop-shadow($shadow);
    // border-radius: $rounded;
    transition: $transition;
    cursor: pointer;
    &:hover {
      transition: $transition;
      color: $brand;
    }
    &.active {
      transition: $transition;
      color: $brand;
    }
  }
}

.info {
  cursor: pointer;
  [data-icon] {
    margin-right: 2 * $space;
    margin-left: $space;
  }
}

.beta {
  background: $layer1;
}
</style>
