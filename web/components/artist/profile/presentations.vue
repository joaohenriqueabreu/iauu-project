<template>
  <div>
    <div class="row">
      <div class="col-sm-12 mb-4">
        <form-input v-model="video" placeholder="http://youtube.com/id-do-seu-video" icon="music">
          Vídeo principal
          <small>Copie a url de seu video do youtube mais f#(|@ (opcional)</small>
        </form-input>
      </div>
      <div class="col-sm-12 horizontal middle">
        <form-toggle v-model="displayPrice">
          Desejo mostrar o valor e duração de nossas apresentações
        </form-toggle>
      </div>
    </div>
    <div class="row" v-if="displayPrice">
      <div class="col-sm-6">
        <form-money v-model="avgPrice" @input="selectPriceRange" icon="dollar-sign"></form-money>
      </div>
      <div class="col-sm-6">
        <form-input v-model="avgDuration" icon="clock"></form-input>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-sm-12 vertical">
        <div class="mb-4">
          <h6 class="mb-1">Selecione a faixa de preços que sua apresentação se encaixa</h6>
          <small>Importante para facilitar que sua banda seja encontrada pelos organizadores de eventos</small>
        </div>
      </div>
    </div>
    <div v-for="(range, index) in $config.priceRanges" :key="`range_${index}`" :class="{ selected: isPriceRange(index) }" class="mb-2 row price-range clickable brand-hover" @click="updatePriceRange(index)">
      <div class="col-sm-2 horizontal">
        <h6>
          <font-awesome v-for="i in parseInt(index)" :key="i" icon="dollar-sign" class="mr-1"></font-awesome>
        </h6>
      </div>
      <div class="col-sm-6">
        <h6>{{ range }}</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      displayPrice: 'artist.proposal.display_price',
      avgPrice: 'artist.proposal.avg_price',
      avgDuration: 'artist.proposal.avg_duration',
      priceRange: 'artist.proposal.price_range',
      video: 'artist.video'
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
</style>
