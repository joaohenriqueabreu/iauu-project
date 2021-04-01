<template>
  <nuxt-child></nuxt-child>
</template>

<script>
export default {
  layout: 'app',
  middleware: ['auth']
}
</script>

<style>

</style>