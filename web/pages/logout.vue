<template>
  <div></div>
</template>
<script>
export default {
  async asyncData({ app }) {
    await app.$auth.logout()
  },
  mounted() {
    this.$router.push('/')
  }
}
</script>
