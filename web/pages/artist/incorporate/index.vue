<template>
  <div>
    <client-only>
      <div class="mb-5">
        <div class="share mb-4 horizontal center clickable brand-hover" @click="share">
          <h4>
            <font-awesome icon="share-alt" class="mr-4"></font-awesome>
            Compartilhe o link abaixo e receba mais contatos para shows
          </h4>
        </div>
        <div class="link mb-5" @click="share">
          <span id="user-referral-link" ref="link">{{ shareUrl }}</span>
        </div>
      </div>
      <div class="mb-4 vertical middle center">
        <h4 class="no-cap mb-2">Faça o download do QRCode para suas redes sociais ou mostre em suas lives!</h4>
        <small>Links para página da banda na plataforma da {{ $config.companyName }}</small>
      </div>
      <div class="mb-4 horizontal middle">
        <h6 class="mr-2">Posicionar na</h6>
        <form-toggle v-model="horizontal">
          <template v-slot:off>Vertical</template>
          <template v-slot:on>Horizontal</template>
        </form-toggle>
      </div>
      <div class="qrcodes vertical middle center mx-5">
        <div v-show="horizontal" ref="horizontal" class="qrcode horizontal center middle">
          <div v-show="!downloading" class="download">
            <font-awesome icon="download" @click="download('horizontal')"></font-awesome>
          </div>
          <vue-qrcode class="mr-4" :value="shareUrl" />
          <div class="p-2 vertical middle center">
            <div class="d-flex align-items-start">
              <h4>Contrate agora nosso espetáculo!</h4>
            </div>
          </div>
          <div class="powered-by">
            <nuxt-link to="/">
              <h6 class="mr-2 no-caps">
                Powered by {{ $config.companyName }}
              </h6>
              <logo :height="20" :width="20"></logo>
            </nuxt-link>
          </div>
        </div>
        <div v-show="!horizontal" ref="vertical" class="qrcode vertical center middle">
          <div ref="vertical-download" class="download">
            <font-awesome icon="download" @click="download('vertical')"></font-awesome>
          </div>
          <vue-qrcode value="https://www.1stg.me" />
          <div class="p-2 vertical middle center">
            <div class="d-flex align-items-start">
              <h4>Contrate agora nosso espetáculo!</h4>
            </div>
          </div>
          <div class="powered-by">
            <nuxt-link to="/">
              <h6 class="mr-2">Powered by {{ $config.companyName }}</h6>
              <logo :height="20" :width="20"></logo>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!-- TODO create a pixel of our own -->
      <div v-if="false">
        <div class="mb-4">
          <h6 class="no-cap">Ou incorpore o código abaixo:</h6>
        </div>
        <div class="code">
          <code> {{ incorporateScript }} </code>
          <code> {{ incorporateElem }}</code>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueQrcode from 'vue-qrcode'
export default {
  components: {
    VueQrcode
  },
  async asyncData({ app, store }) {
    try {
      await store.dispatch('artist/loadArtist')
    } catch (error) {
      $sentry.captureException(e)
      error({ statusCode: 404, message: 'Perfil não encontrado' })
    }
  },
  data() {
    return {
      downloading: false,
      horizontal: true
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    shareUrl() {
      return this.$utils.genAbsoluteUrl(`/search/artists/${this.artist.slug}`)
    },
    incorporteScript() {
      const scriptURL = require('@/assets/js/incorporate.js').path
      console.log(scriptURL)
      // eslint-disable-line
      return `<script type="text/javascript" src="${scriptURL}"><\/script>`
    },
    incorporateElem() {
      return `<div id="iauu-hire-us-btn" data-artist-id="${this.$auth.user.id}"></div>`
    }
  },
  methods: {
    async download(element) {
      // hide download icon while downloading QRCode
      this.downloading = true
      const canvas = await this.$html2canvas(this.$refs[element])

      // fake an anchor click
      const a = document.createElement('a')
      // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
      a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')
      a.download = 'somefilename.jpg'
      a.click()

      this.downloading = false
    },
    share() {
      this.$copyToClipboard(this.shareUrl)
      this.$toast.success(`Link <u>${this.shareUrl}</u> para página da banda copiado!`)
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcodes {
  @include desktop {
    display: flex;
    flex-direction: row;
  }

  @include mobile {
    display: flex;
    flex-direction: column;
  }

  margin-bottom: 4 * $space;

  .qrcode {
    position: relative;
    background: $brandLayer;
    width: 100%;
    min-height: 30vh;
    cursor: pointer;
    padding: 2 * $space;
    margin-right: $space;
    margin-left: $space;

    .download {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .powered-by {
      position: absolute;
      bottom: 5px;
      right: 5px;
      a {
        @extend .horizontal, .middle;
      }
    }
  }
}

.link {
  cursor: pointer;
  background: $layer1;
  box-shadow: $shadow;
  padding: 4 * $space;
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $brandLayer;
  }
}

.code {
  @extend .vertical;
  background: black;
  box-shadow: $shadow;
  padding: $space;
}
</style>
