<template>
  <div>
    <div class="social-connect" v-if="!hasConnectedInstagram || !hasConnectedSpotify">
      <div class="mb-4 horizontal" v-if="!hasConnectedInstagram">
        <h4><font-awesome :icon="['fab', 'instagram']" class="mr-4"></font-awesome></h4>
        <div>
          <h6>
            Vincule seu instragram <span v-if="!socialTab">na aba "Redes Socias"</span> para exibir seu feed em sua página principal aqui na {{ $config.companyName }}
          </h6>
          <small>Lembre-se de deixar com visibilidade pública para podermos exibir as fotos</small>
        </div>
      </div>
      <div class="horizontal" v-if="!hasConnectedSpotify">
        <h4><font-awesome :icon="['fab', 'spotify']" class="mr-4"></font-awesome></h4>
        <div>
          <h6>
            Adicione a sua playlist do spotify <span v-if="!socialTab">em "Redes Sociais"</span> para que os visitantes possam ouvir suas músicas 
          </h6>
          <small>Lembre-se de deixar com visibilidade pública para podermos exibir as fotos</small>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    socialTab: { type: Boolean, default: false },
    hasConnectedInstagram: { type: Boolean, default: false },
    hasConnectedSpotify: { type: Boolean, default: false },
  }
}
</script>

<style lang="scss" scoped>
.social-connect {
  background: $layer5;
  border-radius: $edges;
  padding: 2 * $space;
}
</style>