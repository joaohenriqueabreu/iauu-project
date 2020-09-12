<template>
  <div>
    <div class="row">
      <div class="col-sm-12 horizontal middle">
        <form-toggle v-model="displayPrice">
          <template v-slot:before>
            Mostrar o valor e duração de nossas apresentações
          </template>
        </form-toggle>
      </div>
    </div>
    <div class="row" v-if="displayPrice">
      <div class="col-sm-6">
        <form-money v-model="avgPrice" @input="selectPriceRange" icon="dollar-sign"></form-money>
      </div>
      <div class="col-sm-6">
        <form-time v-model="avgDuration" icon="clock"></form-time>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-sm-12 vertical">
        <div class="mb-4">
          <h6 class="mb-1">Selecione a faixa de preços que sua apresentação se encaixa</h6>
          <small>Importante para facilitar que sua banda seja encontrada pelos organizadores de eventos</small>
        </div>
      </div>
    </div>
    <div v-for="(range, index) in $config.priceRanges" :key="`range_${index}`" :class="{ selected: isPriceRange(index) }" class="mb-2 row price-range clickable brand-hover" @click="updatePriceRange(index)">
      <div class="col-3 col-sm-2 horizontal">
        <h6>
          <font-awesome v-for="i in parseInt(index)" :key="i" icon="dollar-sign" class="mr-1"></font-awesome>
        </h6>
      </div>
      <div class="col-9">
        <h6>{{ range }}</h6>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-12">
        <form-toggle v-model="displayProducts">
          <template v-slot:before>
            <h6>Deseja mostrar seus formatos de apresentação para visitantes? (recomendado)</h6>
            <small>Qualquer visitante do site poderá visualizar seus formatos de apresentação</small>
          </template>
        </form-toggle>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-12 mb-4">
        <form-textarea v-model="presentationDescription" class="mb-4" :rows="5" placeholder="Descreva detalhadamente sua apresentação, repertório, conquiste a atenção do seu cliente">
          <h6>Detalhes da apresentação</h6>
        </form-textarea>
      </div>
      <div class="col-12 mb-5">
        <div class="social-connect">
          <div class="mb-4 horizontal social-connect">
            <h4><font-awesome :icon="['fab', 'instagram']" class="mr-4"></font-awesome></h4>
            <div>
              <h6>
                Vincule seu instragram na aba "Redes Socias" para exibir seu feed em sua página principal aqui na {{ $config.companyName }}
              </h6>
              <small>Lembre-se de deixar com visibilidade pública para podermos exibir as fotos</small>
            </div>
          </div>
          <div class="col-12 horizontal">
            <h4><font-awesome :icon="['fab', 'spotify']" class="mr-4"></font-awesome></h4>
            <div>
              <h6>
                Adicione a sua playlist do spotify em "Redes Sociais" para que os visitantes possam ouvir suas músicas 
              </h6>
              <small>Lembre-se de deixar com visibilidade pública para podermos exibir as fotos</small>
              </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 mb-4">
        <h6>Adicione videos das suas apresentações</h6>
        <small>Copie a url de seus videos mais f#(|@$ (opcional)</small>
        <div class="horizontal middle full-width mb-4">
          <form-input v-model="newVideo" class="full-width" placeholder="Cole o link de seus videos"></form-input>
          <font-awesome icon="plus" class="clickable ml-5" @click="appendVideo"></font-awesome>
        </div>
        <div class="row">
          <div v-for="(media, mediaIndex) in presentationVideos" :key="mediaIndex" class="col-sm-4 mb-4">
            <media-thumbnail class="full-height mb-2" removable :media="media" @remove="removeVideo(mediaIndex)">
            </media-thumbnail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  data() {
    return {
      newVideo: ''
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      displayPrice: 'artist.proposal.display_price',
      displayProducts: 'artist.proposal.display_products',
      avgPrice: 'artist.proposal.avg_price',
      avgDuration: 'artist.proposal.avg_duration',
      priceRange: 'artist.proposal.price_range',
      presentationDescription: 'artist.presentation.description',
      presentationVideos: 'artist.presentation.videos'
    })
  },
  methods: {
    ...mapActions('artist', ['saveProfile']),
    updatePriceRange(range) {
      this.priceRange = range
    },
    selectPriceRange(value) {
      const intValue = parseInt(value)
      if (intValue <= 500) { this.priceRange = 1; return }
      if (intValue <= 5000) { this.priceRange = 2; return }
      if (intValue <= 20000) { this.priceRange = 3; return }
      if (intValue <= 100000) { this.priceRange = 4; return }
      if (intValue > 100000) { this.priceRange = 5; return }
      return this.priceRange
    },
    isPriceRange(index) {
      return index == this.priceRange
    },
    appendVideo() {
      let videos = this.$object.clone(this.presentationVideos)
      if (videos.length === 0) { videos = [] }
      videos.push(this.newVideo)

      this.presentationVideos = videos
      this.newVideo = ''
    },
    removeVideo(index) {
      let videos = this.$object.clone(this.presentationVideos)
      this.$delete(videos, index)

      this.presentationVideos = videos
    }
  }
}
</script>

<style lang="scss" scoped>
.price-range {
  color: $layer1;
  transition: $transition;
  &.selected {
    transition: $transition;
    color: $brand;
  }
}

.social-connect {
  background: $layer5;
  border-radius: $edges;
  padding: 2 * $space;
}
</style>
