<template>
  <div>
    <div :style="{ 'background-image': `url(${$images('concert.png')})` }" class="bg"></div>
    <div class="title">
      <avatar :src="artist.photo" :username="artist.name" :size="200"></avatar>
      <div class="horizontal">
        <h1 class="mr-4">{{ artist.name }}</h1>
      </div>
    </div>
    <div class="horizontal center middle position-relative mb-4">
      <icon icon="music"></icon>
      <h3 class="mr-4 cap">{{ artist.category.name }}</h3>
      <h3 v-if="artist.rating">
        <rating :score="artist.rating" :amount="artist.feedback_count" short></rating>
      </h3>
    </div>
    <div v-if="!$utils.empty(artist.category.subcategories)" class="horizontal center middle mb-4">
      <div v-for="(subcategory, index) in artist.category.subcategories" :key="index" class="badge">
        <h6 class="mb-0">{{ subcategory }}</h6>
      </div>
    </div>
    <div class="horizontal center middle half-width mb-5">
      <div v-for="(media, mediaIndex) in socialMedias" :key="mediaIndex" class="mx-4">
        <a :href="media.url" target="_blank">
          <media-avatar :media="media"></media-avatar>
        </a>
      </div>
    </div>
    <div class="stats mb-5" v-if="!$empty(artist.stats)">
      <div v-for="(stat, statName) in artist.stats" :key="statName" class="stat">
        <div class="vertical center mb-3">
          <h2 class="mr-2 mb-0 order-1">{{ stat | number('0a') }}</h2>
          <h6 class="hide-desktop order-0"><icon :icon="$dictionary.artist.stats.icon[statName]"></icon></h6>
          <h5 class="hide-mobile">{{ $utils.pluralize($dictionary.artist.stats.label[statName], stat) }}</h5>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="mt-4 mr-4 d-flex justify-content-end">
        <div class="vertical">
          <h6 class="mb-2">Compartilhe!</h6>
          <share></share>
        </div>
      </div>
      <div v-if="artist.is_premium" class="verified">
        <h1 class="mr-4">
          <icon icon="grin-stars"></icon>
        </h1>
        <h6>
          Este artista foi verificado pela nossa equipe e é um dos destaques da plataforma
        </h6>
      </div>
      <div class="story my-5" v-if="!$empty(artist.story)">
        <h4 class="mb-5">Nossa história</h4>
        <span v-html="$string.nl2br(artist.story)"></span>
      </div>
      <div class="my-5">
        <h4 class="mb-4">Conheça um pouco mais da nossa apresentação</h4>
        <div class="mb-4" v-if="hasConnectedSpotify">
          <hr>
          <div class="horizontal center middle">
            <spotify-player :url="spotifyUrl"></spotify-player>
          </div>
          <hr>
        </div>
        <div class="mb-5" v-if="!$empty(artist.presentation) && !$empty(artist.presentation.videos)">
          <carousel>
            <slide v-for="(video, index) in artist.presentation.videos" :key="index" class="full-height mr-4 mb-4">
              <media-thumbnail :media="video"></media-thumbnail>
            </slide>
            <slide></slide>
          </carousel>
          <hr>
        </div>
        <div class="mb-4" v-if="hasConnectedInstagram">
          <instagram-gallery :url="instagramUrl"></instagram-gallery>
        </div>
        <div class="story my-5" v-if="!$empty(artist.presentation.description)">
          <h4 class="mb-5">Como é nossa apresentação</h4>
          <span v-html="$string.nl2br(artist.story)"></span>
        </div>
      </div>
      <div class="my-5" v-if="artist.proposal.display_products">
        <h4 class="mb-4">Conheça nossos formatos de apresentação</h4>
        <carousel :per-page="3" :navigation-enabled="true" class="row d-flex align-items-stretch">
          <slide v-for="(product, index) in artist.products" :key="index" class="col-12 col-sm-4">
            <div class="full-height mr-4">
              <product-info hide-price read-only @preview="openPreviewModal(product)" :product="product" class="full-height"></product-info>
            </div>
          </slide>
          <slide></slide>
        </carousel>
        <product-preview read-only ref="preview"></product-preview>
      </div>
      <div v-if="!$utils.empty(artist.feedbacks)" class="mb-5 mx-5">
        <h4 class="mb-4">O que falam sobre nosso show?</h4>
        <div v-for="(feedback, index) in artist.feedbacks" :key="index" class="horizontal">
          <presentation-feedback :feedback="feedback"></presentation-feedback>
        </div>
      </div>
    </div>
    <div class="proposal">
      <div v-if="$empty(artist.proposal) || $empty(artist.proposal.display_price)" class="horizontal center middle full-height full-width">
        <nuxt-link v-if="$auth.loggedIn && $auth.hasScope('contractor')" class="brand-btn" :to="`/proposal/to/artist/${artist.id}`" >
          Enviar proposta
        </nuxt-link>
        <nuxt-link v-if="!$auth.loggedIn" class="brand-btn" to="/register">
          <h6 class="hide-mobile">Cadastre-se para contratar este artista</h6>
          <h6 class="hide-desktop">Cadastre-se</h6>
        </nuxt-link>
      </div>
      <div v-else class="horizontal middle full-height d-flex justify-content-around">
        <div class="vertical">
          <small class="hide-mobile">
            <span>Valor da apresentação</span>
          </small>
          <price-range :range="artist.proposal.price_range"></price-range>
          <div class="mb-4 hide-desktop"></div>
        </div>
        <div class="vertical">
          <small>
            <span class="hide-mobile">Duração média</span>
          </small>
          <h4><icon icon="clock" class="mr-2"></icon>{{ artist.proposal.avg_duration | longTime }}</h4>
        </div>
        <div class="horizontal middle center">
          <nuxt-link v-if="$auth.loggedIn && $auth.hasScope('contractor')" class="brand-btn" :to="`/proposal/to/artist/${artist.id}`" >
            Enviar proposta
          </nuxt-link>
          <nuxt-link v-if="!$auth.loggedIn" class="brand-btn" :to="`/search/artists/${artist.slug}/schedule`">
            <h6>Ver agenda <span class="hide-mobile">do artista</span></h6>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="compensate">&nbsp;</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductInfo from '@/components/artist/product/info';
import ProductPreview from '@/components/artist/product/preview';
import PresentationFeedback from '@/components/artist/profile/feedback';
import InstagramGallery from '@/components/social/instagramGallery';
import SpotifyPlayer from '@/components/social/spotifyPlayer';
export default {
  async asyncData({ store, route }) {
    await store.dispatch('contractor/loadArtist', route.params.slug);
  },
  components: {
    ProductInfo,
    ProductPreview,
    PresentationFeedback,
    InstagramGallery,
    SpotifyPlayer
  },
  async mounted() {
    await this.emitVisitEvent(this.$router.currentRoute);
  },
  computed: {
    ...mapState({ artist: (state) => state.contractor.artist }),
    socialMedias() {
      return this.$array.slice(this.artist.social, 0, 4);
    },
    rateMin() {
      return Math.round(this.artist.score * 0.5);
    },
    rateMax() {
      return Math.round(this.artist.score * 1.5);
    },
    hasConnectedInstagram() {
      return this.$isClientSide && !this.$empty(this.instagramUrl);
    },
    instagramUrl() {
      const instagramUrl = this.$collection.filter(this.artist.social, (social) => social.includes('instagram'));
      if (!this.$empty(instagramUrl)) {
        return instagramUrl[0];
      }

      return null;
    },
    hasConnectedSpotify() {
      return this.$isClientSide && !this.$empty(this.spotifyUrl);
    },
    spotifyUrl() {
      const spotifyUrl = this.$collection.filter(this.artist.social, (social) => social.includes('spotify'));
      if (!this.$empty(spotifyUrl)) {
        return spotifyUrl[0];
      }

      return null;
    },
  },
  methods: {
    ...mapActions('statistic', ['emitVisitEvent']),
    openPreviewModal(product) {
      this.$refs.preview.openModal(product);
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  height: 60vh;
  position: absolute;
  top: -10vh; // to place on header
  left: 0;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: $base;
  opacity: 0.5;
}

div:not(.bg) {
  z-index: $above;
}

.title {
  @extend .vertical, .middle, .center;
  position: relative;
  margin-bottom: 4 * $space;
}

.badge {
  background: $layer3;
  padding: $space 2 * $space;
  border-radius: $rounded;
  margin: 0 2 * $space;
}

.stats {
  @extend .horizontal;
  justify-content: center;
  align-items: center;
  .stat {
    @extend .vertical, .middle, .center;
    @include desktop {
      margin: 0 4 * $space;
      width: 150px;
      height: 150px;
    }

    @include mobile {
      margin: 3 * $space;
      width: 75px;
      height: 75px;
    }
    
    border-radius: $rounded;
    background: $layer3;
    box-shadow: $shadow;
  }
}

.verified {
  @extend .horizontal, .middle, .center;
  background: $layer5;
  border-radius: $edges;
  box-shadow: $shadow;
  padding: 4 * $space;
  margin: 5 * $space 4 * $space;
}

.story {
  padding: 4 * $space;
  border-radius: $edges;
  box-shadow: $shadow;
  margin: 5 * $space 4 * $space;
  background: $layer3;
}

.proposal {
  // @extend .horizontal, .center, .middle, .full-width;
  @extend .full-width;
  padding: 2 * $space;
  position: fixed;
  bottom: 0;
  height: 15vh;
  background: $layer1;
}

.compensate {
  margin-bottom: 20vh; // compenstate fixed send proposal area
}
</style>
