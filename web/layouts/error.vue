<template>
  <client-only>
    <div class="error-content">
      <div class="bg" :style="{ 'background-image': `url(${$images(bgImage)})` }"></div>
      <div class="content">
        <h1 class="mb-5">Vish...</h1>
        <h5 class="mb-3 horizontal middle center">
          {{ randomFunnyPhrase }}
          <icon icon="frown" class="ml-2 mb-0"></icon>
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
        <h3 class="mb-4"><code>{{ $config.supportMail }}</code></h3>
        <nuxt-link to="/">Voltar para a Home</nuxt-link>
      </div>
    </div>
  </client-only>
</template>

<script>
const RANDOM_FUNNY_PHRASES = [
  'Parece que a corda da guitarra estourou',
  'Parece que o vocalista acordou com a garganta inflamada',
  'Parece que o agente marcou dois shows no mesmo dia',
  'Parece que o baterista perdeu as baquetas',
  'Parece que o baixo desafinou em cima da hora',
]
export default {
  layout: 'guest',
  props: {
    error: { type: Object, default: () => {} }
  },
  computed: {
    bgImage() {
      return this.$images('error.jpg')
    },
    randomFunnyPhrase() {
      const randomIndex = Math.round(Math.random() * RANDOM_FUNNY_PHRASES.length);
      return RANDOM_FUNNY_PHRASES[randomIndex];
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
