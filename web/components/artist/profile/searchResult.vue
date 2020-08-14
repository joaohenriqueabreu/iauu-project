<template>
  <div class="result" @click="$emit('select', artist)">
    <div class="logo">
      <div class="bg" :style="{ 'background-image': `url(${bgImage})` }"></div>
      <avatar :src="artist.photo" :username="artist.name" :size="100"></avatar>
    </div>
    <div class="row p-3 full-width">
      <div class="col-sm-6">
        <div class="mb-4">
          <h2>{{ artist.name }}</h2>
        </div>
        <div class="horizontal">
          <h6 class="cat-badge mr-4">{{ artist.category.name }}</h6>
          <div class="horizontal">
            <font-awesome v-for="index in artist.proposal.price_range" :key="`active_${index}`" icon="dollar-sign" class="price-range active mr-1"></font-awesome>
            <font-awesome v-for="index in 5 - artist.proposal.price_range" :key="`inactive_${index} `" icon="dollar-sign" class="price-range inactive mr-1"></font-awesome>
          </div>
        </div>
        <div v-if="!$utils.empty(artist.address)" class="mb-4">
          <small>{{ artist.city_location }}</small>
        </div>
        <div class="horizontal middle">
          <span v-for="(subcategory, index) in artist.category.subcategories" :key="index" class="sub-badge">
            {{ subcategory }}
          </span>
        </div>
      </div>
      <div class="col-sm-6 d-flex justify-content-end">
        <div class="vertical">
          <div v-if="!$utils.empty(artist.rating)" class="mb-3">
            <rating :score="artist.rating" :amount="artist.feedback_count"></rating>
          </div>
          <div class="d-flex full-height">
            <div class="vertical">
              <div v-if="!$utils.empty(artist.stats)" class="horizontal justify-content-end">
                <h5 :title="`${artist.stats.presentations} Apresentações realizadas`">
                  <font-awesome icon="music" class="mr-2"></font-awesome>
                  {{ artist.stats.presentations }}
                </h5>
              </div>
              <div class="d-flex align-items-end full-height">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Artist from '@/models/artist'
export default {
  props: {
    artist: { type: Object, default: new Artist() }
  },
  computed: {
    bgImage() {
      if (!this.$utils.empty(this.artist.background)) { return this.artist.background }
       return require('@/assets/imgs/concert.png')
    },
    rateMin() {
      return Math.round(this.artist.score * 0.5)
    },
    rateMax() {
      return Math.round(this.artist.score * 1.5)
    }
  },
  methods: {
    // TODO This is not best neither the correct for this to be - refactor to the model (?) in the future, or send from the backend
    getSlug() {
      return this.artist.name.toLowerCase().replace(' ', '-')
    }
  }
}
</script>

<style lang="scss" scoped>
.result {
  @extend .horizontal;
  background: $layer3;
  box-shadow: $shadow;
  border-top-right-radius: $edges;
  border-bottom-right-radius: $edges;
  transition: $transition;
  cursor: pointer;

  &:hover {
    transition: $transition;
    background: $layer4;
  }

  .logo {
    @extend .horizontal, .middle, .center;
    width: 30%;
    min-height: 20vh;
    position: relative;

    .bg {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.5;
    }

    .vue-avatar--wrapper {
      position: absolute;
      z-index: $above;
      box-shadow: $shadow;
      background: transparent;
    }
  }

  .info {
    padding: 2 * $space;
  }

  .cat-badge {
    text-transform: capitalize;
  }

  .sub-badge {
    background: $layer5;
    border-radius: $rounded;
    padding: $space 2 * $space;
    color: $brand;
    margin-right: 2 * $space;
  }

  .stats-badge {
    @extend .vertical, .middle, .center;
    width: 70px;
    height: 70px;
    border-radius: $rounded;
    background: $layer5;
    margin: 2 * $space;
    box-shadow: $shadow;
  }
}

.price-range {
  color: $brand;
  &.inactive {
    color: $layer5;
  }
}
</style>
