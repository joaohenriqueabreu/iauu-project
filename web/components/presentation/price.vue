<template>
  <div class="horizontal middle center">
    <h3 class="horizontal mr-4">
      <font-awesome icon="dollar-sign"></font-awesome>
      {{ presentation.price }}
    </h3>
    <h3 class="horizontal">
      <font-awesome icon="clock"></font-awesome>
      {{ presentation.duration }}
      {{ $utils.pluralize('hora', presentation.duration) }}
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {}}
  }
}
</script>

<style>

</style>