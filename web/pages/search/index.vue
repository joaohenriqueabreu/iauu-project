<template>
  <div>
    <div class="px-4 py-2">
      <h4 v-if="!$utils.empty(term)">Resultados para "{{ term }}"</h4>
      <h4 v-else>Artistas encontrados</h4>
    </div>
    <div class="search-results">
      <div v-for="(artist, index) in artists" :key="index" class="px-4 mb-4">
        <artist-info :artist="artist" @select="selectedArtist"></artist-info>
      </div>
    </div>
    <div class="compensate-filters"></div>
    <div class="filters">
      <client-only>
        <fade-transition>
          <div v-if="!selectingFilter" class="filters d-flex justify-content-around">
            <div class="vertical middle center" @click="showSearchFilter">
              <font-awesome icon="search" class="mb-2"></font-awesome>
              <h6>Pesquisa livre</h6>
            </div>
            <div class="vertical middle center" @click="showAddressFilter">
              <font-awesome icon="map-marker-alt" class="mb-2"></font-awesome>
              <h6>Filtrar localização</h6>
            </div>
            <div class="vertical middle center" @click="showPriceFilter">
              <font-awesome icon="dollar-sign" class="mb-2"></font-awesome>
              <h6>Faixa de preço</h6>
            </div>
            <div class="vertical middle center" @click="showSortFilter">
              <font-awesome icon="sort-alpha-down" class="mb-2"></font-awesome>
              <h6>Ordenar resultados</h6>
            </div>
          </div>
          <div v-else class="horizontal center middle">
            <form-input
              class="search-filter"
              label="Pesquisa livre"
              v-show="currentFilter === 'term'"
              v-model="term"
              placeholder="Aniversário, Casamento, Rock Anos 80, ..."
            ></form-input>
            <form-location
              class="search-filter"
              label="Filtrar Localização"
              v-show="currentFilter === 'address'"
              v-model="location"
              placeholder="Próximo de"
            ></form-location>
            <form-range
              class="search-filter"
              label="Faixa de preço"
              v-show="currentFilter === 'price'"
              v-model="price"
              filter-name="currency"
            ></form-range>
            <form-select
              class="search-filter"
              label="Ordernar resultados"
              v-show="currentFilter === 'sort'"
              :allow-input="false"
              icon="sort-alpha-down"
              placeholder="Ordenar por"
              :options="['Relevância', 'Núm de Apresentações', 'Avaliação']"
            ></form-select>
            <form-button @action="filter">
              <span class="d-none d-sm-block">Buscar</span>
              <span class=""></span>
            </form-button>
            <font-awesome icon="times" @click="selectingFilter = false"></font-awesome>
          </div>
        </fade-transition>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchResult from '@/components/artist/profile/searchResult'
export default {
  components: {
    'artist-info': SearchResult
  },
  async asyncData({ store, app }) {
    await store.dispatch('contractor/searchArtists', store.state.app.searchFilters)
  },
  data() {
    return {
      term: '',
      location: '',
      price: 0,
      selectingFilter: false,
      currentFilter: ''
    }
  },
  computed: {
    ...mapState({ searchFilters: (state) => state.app.searchFilters }),
    ...mapState({ artists: (state) => state.contractor.artists })
  },
  mounted() {
    this.term = this.searchFilters.term
    this.location = this.searchFilters.location
    this.price = this.searchFilters.price
  },
  methods: {
    ...mapActions('contractor', ['loadArtist']),
    selectedArtist(artist) {
      // await this.loadArtist(artist.slug)
      this.$router.push(`/search/artists/${artist.slug}`)
    },
    showSearchFilter() {
      this.selectingFilter = true
      this.currentFilter = 'term'
    },
    showAddressFilter() {
      this.selectingFilter = true
      this.currentFilter = 'address'
    },
    showPriceFilter() {
      this.selectingFilter = true
      this.currentFilter = 'price'
    },
    showSortFilter() {
      this.selectingFilter = true
      this.currentFilter = 'sort'
    },
    filter() {
      console.log('filtering...')
    }
  }
}
</script>

<style lang="scss" scoped>
// Do not let filters overlap last search result
.compensate-filters {
  height: 15vh;
}

.filters {
  @extend .horizontal, .center, .middle;
  position: fixed;
  background: $layer2;
  height: 10vh;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: $moveToTop;

  div {
    cursor: pointer;
    transition: $transition;
    color: $brand;
    &:hover {
      transition: $transition;
      color: $brandLayer;
    }
  }

  h6 {
    margin-bottom: 2 * $space;
    @include mobile {
      display: none;
    }
  }

  .search-filter {
    width: 40vw;
    margin-right: 2 * $space;
  }

  [data-icon] {
    font-size: $huge;
  }

  [data-icon="times"] {
    @include desktop {
      position: absolute;
      right: 10 * $space;
      top: 40%;
    }

    @include mobile {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
