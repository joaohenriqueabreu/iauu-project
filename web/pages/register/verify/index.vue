<template>
  <main class="vertical middle center">
    <h3 class="no-cap">
      Enviamos um link para seu email com as instruções de login
    </h3>
  </main>
</template>

<script>
export default {
  mounted() {
    this.$toast.success('Obrigado por se cadastrar na iauu')
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 80vh;
}
</style>
