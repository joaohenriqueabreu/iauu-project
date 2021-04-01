<template>
  <div class="horizontal middle center">
    <h3 class="horizontal mr-4">
      <icon icon="dollar-sign"></icon>
      {{ presentation.price }}
    </h3>
    <h3 class="horizontal">
      <icon icon="clock"></icon>
      {{ presentation.duration }}
      {{ $utils.pluralize('hora', presentation.duration) }}
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {} }
  }
}
</script>

<style></style>
