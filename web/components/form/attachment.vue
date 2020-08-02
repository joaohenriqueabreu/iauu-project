<template>
  <div class="attachment d-flex justify-content-between">
    <div class="horizontal middle">
      <avatar :size="50" :src="attachmentIcon" class="mr-4"></avatar>
      <a :href="file.url" target="_blank">
        <h6>{{ fileDisplay }}</h6>
      </a>
    </div>
    <font-awesome
      v-if="removable"
      icon="times"
      class="clickable ml-5"
      @click="$emit('remove')"
    ></font-awesome>
  </div>
</template>

<script>
// import Media from '@/models/media'
export default {
  props: {
    file: { type: Object, default: () => {} },
    removable: { type: Boolean, default: false }
  },
  computed: {
    attachmentIcon() {
      if (this.file.type.includes(this.$config.pdfSubstringMatch)) {
        return require('@/assets/imgs/social/pdf.png')
      }

      return require('@/assets/imgs/music.png')
    },
    fileDisplay() {
      if (!this.$utils.empty(this.file)) {
        return this.file.subtitle || this.file.name
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment {
  @extend .horizontal, .middle, .full-width;
  cursor: pointer;
  // background: transparent;
  border-radius: $rounded;
  margin-bottom: 4 * $space;
  padding: $space;
  transition: $transition;
  &:hover {
    transition: $transition;
    box-shadow: $shadow;
  }

  h6 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
