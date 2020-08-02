<template>
  <div>
    <div @click.prevent="upload">
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
  </div>
</template>

<script>
import * as filestack from 'filestack-js'

export default {
  props: {
    rounded: { type: Boolean, default: false }
  },
  data() {
    return {
      uploadClient: { type: Object, default: () => {} }
    }
  },
  created() {
    this.client = filestack.init(process.env.fileStackApiKey)
  },
  methods: {
    upload() {
      const options = {
        lang: 'pt',
        fromSources: ['local_file_system', 'url', 'instagram', 'webcam'],
        accept: ['image/*'],
        onUploadDone: this.uploaded
      }
      this.client.picker(options).open()
    },
    uploaded({ filesUploaded }) {
      this.$emit('uploaded', filesUploaded[0])
    }
  }
}
</script>

<style lang="scss" scoped></style>
