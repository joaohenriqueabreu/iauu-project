<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  layout: 'app',
  middleware: ['auth', 'admin']
}
</script>

<style></style>
