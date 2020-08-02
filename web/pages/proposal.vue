<template>
  <nuxt-child />
</template>

<script>
export default {
  layout: 'guest',
  middleware: ['auth', 'contractor']
}
</script>

<style></style>
