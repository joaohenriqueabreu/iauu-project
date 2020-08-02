<template>
  <div>
    <div class="horizontal d-flex justify-content-between mb-2">
      <slot></slot>
      <font-awesome icon="plus" class="clickable" @click="upload"></font-awesome>
    </div>
  </div>
</template>

<script>
import * as filestack from 'filestack-js'
import Media from '@/models/media'
export default {
  props: {
    local: { type: Boolean, default: true },
    instagram: { type: Boolean, default: false },
    webcam: { type: Boolean, default: false },
    url: { type: Boolean, default: false }
  },
  data() {
    return {
      uploadClient: { type: Object, default: () => {} }
    }
  },
  computed: {
    sources() {
      const sources = []
      if (this.local) {
        sources.push('local_file_system')
      }

      if (this.instagram) {
        sources.push('instagram')
      }

      if (this.url) {
        sources.push('url')
      }

      if (this.webcam) {
        sources.push('webcam')
      }

      return sources
    }
  },
  created() {
    this.client = filestack.init(process.env.fileStackApiKey)
  },
  methods: {
    upload() {
      const options = {
        lang: 'pt',
        fromSources: this.sources,
        accept: ['image/*'],
        onUploadDone: this.uploaded
      }
      this.client.picker(options).open()
    },
    uploaded({ filesUploaded }) {
      const media = new Media({
        id: filesUploaded[0].uploadId,
        type: filesUploaded[0].mimetype,
        name: filesUploaded[0].filename,
        url: filesUploaded[0].url
      })
      this.$emit('uploaded', media)
    }
  }
}
</script>

<style lang="scss" scoped></style>
