<template>
  <div>
    <client-only>
      <div class="vertical middle my-4">
        <form-button @action="openUploadModal" class="upload"><icon icon="upload"></icon>Enviar documento</form-button>
      </div>
      <modal tiny ref="fileUploader">
        <template v-slot:header>
          <h5>Enviar arquivo</h5>
        </template>
        <template v-slot:main>
          <div class="vertical center middle full-width mb-5">
            <h5 class="mb-2">Envie um arquivo de até {{ HUMAN_READABLE_FILESIZE }} mb</h5>
            <input type="file" @change="preview" accept="application/pdf" class="mb-4">
            <div class="error mb-4" v-if="maxFileSizeError">O arquivo deve possuir no máximo {{ HUMAN_READABLE_FILESIZE }}mb</div>
            <div class="error mb-4" v-if="invalidFileTypeError">O formato do arquivo não é permitido</div>
            <img class="mb-4" v-if="!$empty(previewUrl)" :src="previewUrl">
            <h6 class="mb-2">Formatos permitidos: .pdf</h6>
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
const HUMAN_READABLE_FILESIZE = 8;
const MAX_ALLOWED_FILESIZE    = 8388608;

export default {
  props: {
    rounded:    { type: Boolean, default: false },
    resolution: { type: String, default: 'avatar' }
  },
  data() {
    return {
      HUMAN_READABLE_FILESIZE: 1,
      filename:             '',
      uploadedFile:         {},
      previewUrl:           '',
      maxFileSizeError:     false,
      invalidFileTypeError: false
    }
  },
  computed: {
    imageResolution() {
      if (this.resolution === 'avatar')     { return '1080 x 1080 - quadrada'; }
      if (this.resolution === 'background') { return '1920 x 1080'; }

      return '';
    },
    // hasFile() {
    //   return !this.$empty(this.uploadedFile); // && this.uploadedFile.filesize > 0;
    // }
  },
  methods: {
    openUploadModal() {
      this.$refs.fileUploader.open();
    },
    preview(event) {
      if (this.$empty(event.target.files)) { return }

      const file        = event.target.files[0];
      this.uploadedFile = file;
      this.previewUrl   = URL.createObjectURL(file);
      this.validateFile();
    },
    validateFile() {
      this.maxFileSizeError     = this.uploadedFile.filesize > MAX_ALLOWED_FILESIZE;
      this.invalidFileTypeError = !this.uploadedFile.type.includes('application/pdf');
    },
    async upload() {
      let formData = new FormData();
      formData.append('data', this.uploadedFile);

      try {
        const { data } = await this.$axios.post('/files', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        this.$emit('uploaded', data);
        this.$refs.fileUploader.close();
      } catch (error) {
        console.log(error);
        this.$toast.error('Tivemos um problema ao fazer upload do arquivo.');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
img {
  max-width:  200px;
  max-height: 200px;
}

.upload {
  width: 200px;
}
</style>
