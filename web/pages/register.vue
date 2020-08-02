<template>
  <nuxt-child></nuxt-child>
</template>

<script>
export default {
  middleware: ['guest'],
  layout: 'guest'
}
</script>

<style></style>
