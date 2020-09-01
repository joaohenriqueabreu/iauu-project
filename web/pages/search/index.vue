<template>
  <div>
    <div class="px-4 pb-4">
      <h4>Artistas encontrados</h4>
    </div>
    <div class="search-results" v-if="!$empty(artists)">
      <div v-for="(artist, index) in artists" :key="index" class="px-4 mb-4">
        <search-result :artist="artist" @select="selectedArtist"></search-result>
      </div>
    </div>
    <div v-else class="horizontal center middle py-5">
      <h6>Nenhum artista encontrado... <font-awesome icon="frown"></font-awesome></h6>
    </div>
    <div class="compensate-filters"></div>
    <div class="filters">
      <client-only>
        <fade-transition>
          <div v-if="!selectingFilter" class="filters d-flex justify-content-around">
            <div class="vertical middle center" :class="{ applied: isFilterApplied('term') }" @click="showSearchFilter">
              <font-awesome icon="search" class="mb-2"></font-awesome>
              <h6>Pesquisa livre</h6>
            </div>
            <div class="vertical middle center" @click="showLocationFilter" :class="{ applied: isFilterApplied('location') }">
              <font-awesome icon="map-marker-alt" class="mb-2"></font-awesome>
              <h6>Filtrar localização</h6>
            </div>
            <div class="vertical middle center" @click="showPriceFilter" :class="{ applied: isFilterApplied('price') }">
              <font-awesome icon="dollar-sign" class="mb-2"></font-awesome>
              <h6>Faixa de preço</h6>
            </div>
            <div class="vertical middle center" @click="showSortFilter" :class="{ applied: isFilterApplied('sort') }">
              <font-awesome icon="sort-alpha-down" class="mb-2"></font-awesome>
              <h6>Ordenar resultados</h6>
            </div>
          </div>
          <div v-else class="horizontal center middle">
            <form-input
              v-show="currentFilter === 'term'"
              v-model="term"
              class="search-filter"
              label="Pesquisa livre"
              placeholder="Aniversário, Casamento, Rock Anos 80, ..."
              @enter="filter"
            ></form-input>
            <form-location
              v-show="currentFilter === 'location'"
              v-model="location"
              class="search-filter"
              label="Filtrar Localização"
              placeholder="Próximo de"
              @enter="filter"
            ></form-location>
            <div class="horizontal center brand-hover" v-show="currentFilter === 'price'">
              <div class="vertical mr-4 price-range" 
                v-for="(range, index) in $config.priceRanges" :key="`range_${index}`" 
                :class="{ selected: isPriceRangeSelected(index) }"
                @click="filter">
                <div class="horizontal center mb-2">
                  <h6>
                    <font-awesome v-for="i in parseInt(index)" :key="`search_range_${i}`" icon="dollar-sign" class="mr-1"></font-awesome>
                  </h6>
                </div>
                <h5>{{ range }}</h5>
              </div>
            </div>
            <form-select
              v-show="currentFilter === 'sort'"
              v-model="sort"
              class="search-filter"
              label="Ordernar resultados"
              :allow-input="false"
              icon="sort-alpha-down"
              placeholder="Ordenar por"
              :options="['Relevância', 'Núm de Apresentações', 'Avaliação']"
            ></form-select>
            <form-button @action="filter" v-show="['term', 'location', 'sort'].includes(currentFilter)">
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
import { mapFields } from 'vuex-map-fields'
import SearchResult from '@/components/artist/profile/searchResult'
export default {
  components: {
    SearchResult
  },
  async asyncData({ store, app, query, $sentry, error }) {
    const filters = store.state.contractor.searchFilters
    if (!app.$empty(query)) {
      filters.term = query.term
    }

    // Cleanup empty filters
    for (const filter in filters) {
      if (app.$empty(filters[filter])) {
        delete(filters[filter])
      }
    }

    try {
      await store.dispatch('contractor/searchArtists', filters)
    } catch (e) {
      $sentry.captureException(e)
      error({ statusCode: 404, message: 'Não foi possível realizar a pesquisa.' })
    }
  },
  data() {
    return {
      selectingFilter: false,
      currentFilter: '',
    }
  },
  computed: {
    ...mapState({ artists: (state) => state.contractor.artists }),
    ...mapFields('contractor', {
      searchFilters: 'searchFilters',
      term: 'searchFilters.term',
      location: 'searchFilters.location',
      price: 'searchFilters.price',
      sort: 'searchFilters.sort'
    })
  },
  methods: {
    ...mapActions('contractor', ['loadArtist', 'searchArtists']),
    selectedArtist(artist) {
      this.$router.push(`/search/artists/${artist.slug}`)
    },
    showSearchFilter() {
      this.selectingFilter = true
      this.currentFilter = 'term'
    },
    showLocationFilter() {
      this.selectingFilter = true
      this.currentFilter = 'location'
    },
    showPriceFilter() {
      this.selectingFilter = true
      this.currentFilter = 'price'
    },
    showSortFilter() {
      this.selectingFilter = true
      this.currentFilter = 'sort'
    },
    isFilterApplied(filterName) {
      return !this.$empty(this.searchFilters[filterName])
    },
    async filter() {
      await this.searchArtists(this.searchFilters)
    },
    isPriceRangeSelected(index) {
      return this.searchFilters.price === index
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

  .applied {
    color: $brandLayer !important;
  }

  .search-filter {
    width: 40vw;
    margin-right: 2 * $space;
  }

  [data-icon] {
    font-size: $huge;
  }

  [data-icon='times'] {
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
