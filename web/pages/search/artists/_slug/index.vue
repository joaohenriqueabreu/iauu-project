<template>
  <div>
    <div :style="{ 'background-image': `url(${bgImage})` }" class="bg"></div>
    <div class="title">
      <avatar :src="artist.user.photo" :username="artist.company_name" :size="200"></avatar>
      <h1>{{ artist.company_name || artist.name }}</h1>
    </div>
    <div class="horizontal center middle mb-4">
      <font-awesome icon="music"></font-awesome>
      <h3 class="mr-4">{{ artist.category.name }}</h3>
      <h3>
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
          <media-thumbnail :media="media" avatar></media-thumbnail>
        </a>
      </div>
    </div>
    <div class="stats mb-5">
      <div v-for="(stat, statName) in artist.stats" :key="statName" class="stat">
        <div class="horizontal d-flex align-items-end mb-3">
          <h2 v-if="statName === 'score'" class="mr-2 mb-0">{{ stat | number('0.0') }}</h2>
          <h2 v-if="statName === 'fans' && stat >= 100000" class="mr-2 mb-0">
            {{ stat | number('0a') }}
          </h2>
          <h2 v-if="statName === 'fans' && stat < 100000" class="mr-2 mb-0">
            {{ stat | number('0,0') }}
          </h2>
          <h2 v-if="statName === 'presentations'" class="mr-2 mb-0">{{ stat | number('0,0') }}</h2>
          <h6><font-awesome :icon="$dictionary.artist.stats.icon[statName]"></font-awesome></h6>
        </div>
        <div class="horizontal">
          <h5 v-if="statName === 'score'" class="mr-1">{{ artist.rating.amount }}</h5>
          <h5>{{ $dictionary.artist.stats.label[statName] }}</h5>
        </div>
      </div>
    </div>
    <div v-if="artist.is_premium" class="verified">
      <h1 class="mr-4">
        <font-awesome icon="grin-stars"></font-awesome>
      </h1>
      <h6>
        Este artista foi verificado pela nossa equipe e é um dos destaques da plataforma
      </h6>
    </div>
    <div class="story">
      <h4 class="mb-5">Nossa história</h4>
      {{ artist.story }}
    </div>
    <div v-if="!$utils.empty(artist.feedbacks)" class="mb-5 mx-5">
      <h4 class="mb-5">O que falam sobre nosso show?</h4>
      <div v-for="(feedback, index) in artist.feedbacks" :key="index" class="horizontal">
        <div v-if="!$empty(feedback.notes)">
          <div class="testemonial">
            <h6 class="mb-2">{{ feedback.from.name }}</h6>
            <div class="horizontal mb-4">
              <h6 class="mr-2">{{ feedback.rating }}</h6>
              <font-awesome icon="star"></font-awesome>
            </div>
            <i>{{ feedback.notes }}</i>
          </div>
        </div>
      </div>
    </div>
    <div class="proposal">
      <div class="horizontal middle full-height d-flex justify-content-around">
        <div class="vertical">
          <small class="hide-mobile">
            <span v-if="$auth.loggedIn">Valor da apresentação</span>
            <span v-else>Valor aproximado da apresentação</span>
          </small>
          <h4 v-if="$auth.loggedIn">{{ artist.score | currency }}</h4>
          <h4 v-else>{{ rateMin | currency }} - {{ rateMax | currency }}</h4>
          <div class="mb-4 hide-desktop"></div>
        </div>
        <div class="vertical">
          <small>
            <span class="hide-mobile">Duração média</span>
          </small>
          <h4><font-awesome icon="clock" class="mr-2"></font-awesome>{{ avgDuration }} horas</h4>
        </div>
        <div class="horizontal middle center">
          <nuxt-link
            v-if="$auth.loggedIn && $auth.hasScope('contractor')"
            class="brand-btn"
            :to="`/proposal/to/artist/${artist.id}`"
          >
            Enviar proposta
          </nuxt-link>
          <nuxt-link v-if="!$auth.loggedIn" class="brand-btn" to="/register">
            <h6 class="hide-mobile">Cadastre-se para contratar este artista</h6>
            <h6 class="hide-desktop">Cadastre-se</h6>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="compensate">&nbsp;</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async asyncData({ store, route }) {
    await store.dispatch('contractor/loadArtist', route.params.slug)
  },
  computed: {
    ...mapState({ artist: (state) => state.contractor.artist }),
    bgImage() {
      return require('@/assets/imgs/concert.png?webp')
    },
    socialMedias() {
      return this.$array.slice(this.artist.social, 0, 4)
    },
    rateMin() {
      return Math.round(this.artist.score * 0.5)
    },
    rateMax() {
      return Math.round(this.artist.score * 1.5)
    },
    avgDuration() {
      return Math.round(this.$math.mean(this.$collection.map(this.artist.products, 'duration')))
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

@include desktop {
  .stats {
    display: flex;
    flex-direction: row;
    .stat {
      margin: 0 4 * $space;
    }
  }
}

@include mobile {
  .stats {
    display: flex;
    flex-direction: column;

    .stat {
      margin-bottom: 4 * $space;
    }
  }
}

.stats {
  justify-content: center;
  align-items: center;
  .stat {
    @extend .vertical, .middle, .center;
    width: 150px;
    height: 150px;
    border-radius: $rounded;
    background: $layer3;
    box-shadow: $shadow;
    border: 5px solid $brand;
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
}

.testemonial {
  background: $layer3;
  margin: 2 * $space 0 2 * $space 4 * $space;
  padding: 3 * $space;
  box-shadow: $shadow;
  border-top-right-radius: $rounded;
  border-bottom-right-radius: $rounded;
  border-bottom-left-radius: $rounded;
  max-width: 80vw;
  min-width: 20vw;
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
