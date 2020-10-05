<template>
  <div class="mx-sm-4">
    <div class="px-4 pb-2 row horizontal middle">
      <div class="col-sm-2"></div>
      <div class="col-sm-6 col-md-8">
        <form-input v-model="term" class="full-width" placeholder="Aniversário, Casamento, Rock Anos 80, ..." @enter="filter" @blur="filter">
        </form-input>
      </div>
    </div>
    <div class="search-results" v-if="!$empty(artists)">
      <h6 class="mb-4 pr-4 d-none d-md-block">
        Artistas encontrados 
        <span v-if="!$empty(searchFilters.location)">Próximo a {{ searchFilters.location.display }}</span>
      </h6>
      <hr>
      <div v-for="(artist, index) in artists" :key="index" class="mb-4">
        <search-result :artist="artist" @select="selectedArtist"></search-result>
      </div>
    </div>
    <div v-else class="horizontal center middle py-5">
      <h4 class="mr-2">Nenhum artista encontrado... </h4>
      <h4><font-awesome icon="frown"></font-awesome></h4>
    </div>
    <div class="compensate-filters"></div>
    <div class="filters">
      <div class="filters d-flex justify-content-around">
        <div class="vertical middle center" @click="showLocationFilter" :class="{ applied: isFilterApplied('location') }">
          <font-awesome icon="map-marker-alt" class="mb-2"></font-awesome>
          <h6>Procurar por localização</h6>
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
    </div>
    <modal ref="filters" height="tiny">
      <template v-slot:main>
        <client-only>
          <div class="vertical center middle full-height" v-show="currentFilter === 'location'">
            <form-location v-model="location" class="px-5 full-width" placeholder="Próximo de" @selected="selectLocation" @enter="filter">
              <span class="d-none d-md-inline">Procurar por Localização</span>
            </form-location>
          </div>
          <div class="horizontal center middle full-height" v-show="currentFilter === 'price'">
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
          <div class="vertical center middle full-height" v-show="currentFilter === 'sort'">
            <form-select
              v-show="currentFilter === 'sort'"
              v-model="sort"
              class="search-filter"
              :allow-input="false"
              icon="sort-alpha-down"
              placeholder="Ordenar por"
              :options="['Relevância', 'Núm de Apresentações', 'Avaliação']">
              <h6>Ordenar resultados</h6>
            </form-select>
          </div>
        </client-only>
      </template>
      <template v-slot:footer>
        <div class="horizontal center middle full-width full-height">
          <form-button @action="filter">
            <span class="d-none d-sm-block">Buscar</span>
            <span class=""></span>
          </form-button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import SearchResult from '@/components/artist/profile/searchResult';
export default {
  components: {
    SearchResult
  },
  async asyncData({ store, app, query, $sentry, error }) {
    const filters = store.state.contractor.searchFilters;
    if (!app.$empty(query)) {
      filters.term = query.term;
    }

    // Cleanup empty filters
    for (const filter in filters) {
      if (app.$empty(filters[filter])) {
        delete(filters[filter]);
      }
    }

    try {
      await store.dispatch('contractor/searchArtists', filters);
    } catch (e) {
      $sentry.captureException(e);
      error({ statusCode: 404, message: 'Não foi possível realizar a pesquisa.' });
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
      this.$router.push(`/search/artists/${artist.slug}`);
    },
    selectLocation(location) {
      this.location = location;
    },
    showLocationFilter() {
      this.selectingFilter = true;
      this.currentFilter = 'location';
      this.showFilterModal();
    },
    showPriceFilter() {
      this.selectingFilter = true;
      this.currentFilter = 'price';
      this.showFilterModal();
    },
    showSortFilter() {
      this.selectingFilter = true;
      this.currentFilter = 'sort';
      this.showFilterModal();
    },
    showFilterModal() {
      this.$refs.filters.open();
    },
    closeFilterModal() {
      this.$refs.filters.close();
    },
    isFilterApplied(filterName) {
      return !this.$empty(this.searchFilters[filterName]);
    },
    async filter() {
      await this.searchArtists(this.searchFilters);
      this.closeFilterModal();
    },
    isPriceRangeSelected(index) {
      return this.searchFilters.price === index;
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
    margin-right: 2 * $space;
    width: 400px;
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
