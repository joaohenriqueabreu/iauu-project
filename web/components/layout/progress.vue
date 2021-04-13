<template>
  <div class="progress">
    <div class="progress-bar" role="progressbar" :style="`width: ${complete}%`" :aria-valuenow="complete" aria-valuemin="0" aria-valuemax="100">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    complete: { type: Number, default: 0 }
  }
}
</script>

<style lang="scss" scoped>
.progress {
  border-radius:  $rounded;
  background:     $layer4;
  .progress-bar {
    background: $success;
  }
}
</style>