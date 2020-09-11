<template>
  <div>
    <client-only>
      <div @click.prevent="openUploadModal">
        <overlay :rounded="rounded">
          <template v-slot:default>
            <slot></slot>
          </template>
          <template v-slot:hover>
            <div class="vertical middle center">
              <h3>Enviar imagem</h3>
            </div>
          </template>
        </overlay>
      </div>
      <modal height="tiny" ref="fileUploader">
        <template v-slot:header>
          <h5>Enviar arquivo</h5>
        </template>
        <template v-slot:main>
          <div class="vertical center middle full-width">
            <h5 class="mb-2">Envie um arquivo de até {{ HUMAN_READABLE_FILESIZE }} mb</h5>
            <h6 class="mb-4">(formatos permitidos .jpg, .jpeg e .png)</h6>
            <input type="file" @change="preview" accept="image/*" class="mb-4">
            <div class="error mb-4" v-if="maxFileSizeError">O arquivo deve possuir no máximo {{ HUMAN_READABLE_FILESIZE }}mb</div>
            <div class="error mb-4" v-if="invalidFileTypeError">O formato do arquivo não é permitido</div>
            <img v-if="!$empty(previewUrl)" :src="previewUrl">
          </div>
        </template>
        <template v-slot:footer>
          <div class="horizontal center middle">
            <form-button @action="upload" v-if="!maxFileSizeError && !invalidFileTypeError">Enviar</form-button>
            <h6 v-else>Selecione um arquivo válido para enviar</h6>
          </div>
        </template>
      </modal>
    </client-only>
  </div>
</template>

<script>
const HUMAN_READABLE_FILESIZE = 1
const MAX_ALLOWED_FILESIZE = 1048576
export default {
  props: {
    rounded: { type: Boolean, default: false }
  },
  data() {
    return {
      HUMAN_READABLE_FILESIZE: 1,
      uploadedFile: {},
      previewUrl: '',
      maxFileSizeError: false,
      invalidFileTypeError: false
    }
  },
  methods: {
    openUploadModal() {
      this.$refs.fileUploader.open()
    },
    preview(event) {
      if (this.$empty(event.target.files)) { return }

      const file = event.target.files[0]
      this.uploadedFile = file
      this.previewUrl = URL.createObjectURL(file)
      this.validateFile()
    },
    validateFile() {
      this.maxFileSizeError = this.uploadedFile.filesize > MAX_ALLOWED_FILESIZE
      this.invalidFileTypeError = !this.uploadedFile.type.includes('image/')
    },
    async upload() {
      let formData = new FormData()
      formData.append("image", this.uploadedFile)

      try {
        const { data } = await this.$axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
        this.$emit('uploaded', data)
        this.$refs.fileUploader.close()
      } catch (error) {
        console.log(error)
        this.$toast.error('Tivemos um problema ao fazer upload do arquivo.')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
img {
  max-width: 200px;
  max-height: 200px;
}
</style>
