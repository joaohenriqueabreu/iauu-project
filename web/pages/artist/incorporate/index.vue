<template>
  <div>
    <client-only>
      <div class="mb-4">
        <h6 class="no-cap">Copie as imagens para suas redes sociais ou mostre em suas lives!</h6>
      </div>
      <div class="qrcodes">
        <div ref="horizontal" class="qrcode horizontal center middle">
          <div v-show="!downloading" class="download">
            <font-awesome icon="download" @click="download('horizontal')"></font-awesome>
          </div>
          <vue-qrcode value="https://www.1stg.me" />
          <div class="p-2 vertical middle center">
            <div class="d-flex align-items-start">
              <h4>Contrate agora nosso espetáculo!</h4>
            </div>
          </div>
          <div class="powered-by">
            <nuxt-link to="/">
              <h6 class="mr-2">
                Powered by iauu
              </h6>
              <logo :height="20" :width="20"></logo>
            </nuxt-link>
          </div>
        </div>
        <div ref="vertical" class="qrcode vertical center">
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
              <h6 class="mr-2">
                Powered by iauu
              </h6>
              <logo :height="20" :width="20"></logo>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <h6 class="no-cap">Ou incorpore o código abaixo:</h6>
      </div>
      <div class="code">
        <code> {{ incorporateScript }} </code>
        <code> {{ incorporateElem }}</code>
      </div>
    </client-only>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode'
export default {
  components: {
    VueQrcode
  },
  data() {
    return {
      downloading: false
    }
  },
  computed: {
    incorporateScript() {
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

.code {
  @extend .vertical;
  background: black;
  box-shadow: $shadow;
  padding: $space;
}
</style>
