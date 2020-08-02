<template>
  <div class="error-content">
    <div class="bg" :style="{ 'background-image': `url(${bgImage})` }"></div>
    <div class="content">
      <h1 class="mb-5">Vish...</h1>
      <h5 class="mb-3 horizontal middle center">
        Parece que a corda da guitarra estourou
        <font-awesome icon="frown" class="ml-2 mb-0"></font-awesome>
      </h5>
      <h5 class="mb-4">
        Nos perdoe, tivemos algum problema interno, mas já estamos trabalhando para resolver
      </h5>
      <div class="mb-4">
        <h5 v-if="error.statusCode === 404">{{ error.message }}</h5>
      </div>
      <h5 class="mb-2">
        Atualize a página e tente novamente ou entre em contato com a nossa equipe
      </h5>
      <h3 class="mb-4"><code>roadies@iauu.com.br</code></h3>
      <nuxt-link to="/">Voltar para a Home</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'guest',
  props: {
    error: { type: Object, default: () => {} }
  },
  computed: {
    bgImage() {
      return require('@/assets/imgs/error.jpg')
    }
  }
}
</script>
<style lang="scss" scoped>
.error-content {
  height: 90vh;

  [data-icon] {
    font-size: $huge;
    margin-bottom: 5 * $space;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.2;
  }

  .content {
    @extend .vertical, .center, .middle;
    height: 100%;
    z-index: $above;
  }

  code {
    color: $brandLayer;
  }
}
</style>
