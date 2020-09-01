<template>
  <div>
    <div class="section main"></div>
    <div class="section search">
      <h1 class="text-center mb-4">Aperte o play em seu evento</h1>
      <div class="half-width vertical middle center">
        <client-only>
          <search-artist @search="search"></search-artist>
          <nuxt-link ref="searchLink" to="/search">Vamos lá!</nuxt-link>
        </client-only>
      </div>
    </div>
    <div class="section even">
      <h1>Todo mundo faz iauü</h1>
    </div>
    <div class="section odd">
      <h1>Por que iauü?</h1>
    </div>
    <div class="section even">
      <h1>Queridinhos da galera</h1>
    </div>
    <div class="section odd">
      <h1>Veja como é facil</h1>
    </div>
    <div class="section even">
      <h1 class="mb-4">Contrate sua banda agora</h1>
      <nuxt-link to="/search">Vamos lá!</nuxt-link>
    </div>
    <!-- Need to wrap lib on client-only tag as it uses document element -->
    <client-only>
      <cookie-policy buttonText="OK" class="cookies">
        <div slot="message">
          <h6>Nosso site utiliza cookies para melhorar a sua experiência. Ao utilizar a plataforma você consente com nossa
          <nuxt-link to="/terms">Política de privacidade</nuxt-link>.
          </h6>
        </div>
      </cookie-policy>
    </client-only>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SearchArtist from '@/components/artist/searchInput'
export default {
  components: {
    SearchArtist
  },
  mounted() {
    if (
      this.$auth.loggedIn &&
      !this.$auth.hasScope('artist') &&
      !this.$auth.hasScope('contractor') &&
      !this.$auth.hasScope('admin')
    ) {
      this.$router.push('/role/whoareyou')
    }
  },
  methods: {
    search(term) {
      console.log(term)
      this.$router.push(`/search?term=${encodeURI(term)}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  min-height: 100vh;
  // overflow:   scroll;
  z-index: $base;

  &.main {
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('~assets/imgs/home.jpg');
    height: 110vh;
    width: 100%;
    opacity: 0.2;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: $base;
  }

  &.search {
    @extend .vertical, .middle, .center;
    position: relative;
    z-index: $above;
  }

  &.even {
    @extend .vertical, .middle, .center;
    background: linear-gradient(180deg, $layer3 33%, $layer2 66%, $layer1 100%);
  }

  &.odd {
    @extend .vertical, .middle, .center;
    background: linear-gradient(180deg, $layer1 33%, $layer2 66%, $layer3 100%);
  }

  a {
    font-size: $huge;
    box-shadow: $shadow;
    padding: 2 * $space 4 * $space;
    border-radius: $rounded;
    border: 4px solid $brand;
    background: transparent;
    transition: $transition;
    &:hover {
      transition: $transition;
      background: $brand;
      color: $layer1;
    }
  }
}

.cookies {
  background: $layer5;
  color: $brand;
  z-index: $above;

  a {
    color: $brand;
  }
}
</style>

<!-- Cookie-law overrides -->
<style lang="scss">
.Cookie__button {
  background: $brandLayer !important;
  font-weight: $bold;
  border-radius: $rounded !important;
}
</style>
