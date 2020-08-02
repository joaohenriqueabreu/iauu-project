<template>
  <div class="result" @click="$emit('select', artist)">
    <div class="logo" v-if="!$empty(artist.user)">
      <div class="bg" :style="{ 'background-image': `url(${bgImage})` }"></div>
      <avatar :src="artist.user.photo" :username="artist.user.name" :size="100"></avatar>
    </div>
    <div class="row p-3 full-width">
      <div class="col-sm-6">
        <div>
          <h2>{{ artist.company_name || artist.name }}</h2>
        </div>
        <div>
          <h6 class="cat-badge">{{ artist.category.name }}</h6>
        </div>
        <div v-if="!$utils.empty(artist.address)" class="mb-4">
          <small>{{ artist.address.street }}</small>
        </div>
        <div class="horizontal middle">
          <span
            v-for="(subcategory, index) in artist.category.subcategories"
            :key="index"
            class="sub-badge"
          >
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
              <div v-if="false" class="d-flex align-items-end full-height">
                <div v-if="artist.display_rate" class="horizontal middle">
                  <client-only>
                    <h4>R$ {{ rateMin | number('0,0') }} - R$ {{ rateMax | number('0,0') }}</h4>
                  </client-only>
                </div>
                <div v-if="!artist.display_rate" class="horizontal middle">
                  <span>Entre em contato para orçar</span>
                </div>
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
      // if (this.$utils.empty(this.artist.bg_photo)) {
      return require('@/assets/imgs/concert.png')
      // }

      // return this.artist.bg_photo
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
      const name = this.artist.company_name || this.artist.name
      return name.toLowerCase().replace(' ', '-')
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
</style>
