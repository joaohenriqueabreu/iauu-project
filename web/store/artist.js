/* eslint-disable */
import Vue                        from 'vue';
import _                          from 'lodash';
import moment                     from 'moment';
import { getField, updateField }  from 'vuex-map-fields';

export const state = () => ({
  artist:       {},
  artists:      [],
  product:      {},
  products:     [],
  statistics:   {},
  searchFilters: {
    term:     '',
    location: '',
    sort:     '',
    price:    0,
  },
})

export const mutations = {
  updateField,
  set_artist(state, artistData) {
    state.artist = { ...artistData };
  },
  update_profile(state, { prop, data }) {
    if (prop === undefined) { return; }

    const props = prop.split('.');
    const field = props.pop();
    let profile = state.artist;

    props.forEach((field) => { profile = profile[field]; })
    Vue.set(profile, field, data);
  },
  set_products(state, data) { state.products = data; }, // Vue.set(state, 'products', data); },
  set_product(state, data)  { state.product = data; },
  remove_product(state, id) {
    Vue.delete(
      state.products,
      this.$array.findIndex(state.products, (product) => product.id === id)
    );
  },
  set_statistics(state, statistics)   { state.statistics = statistics; },
  set_artists(state, data)            { state.artists = data; },
  add_artist(state, data)             { state.artists.push(data); },
  set_artist(state, data)             { state.artist = data; },
  remove_artist(state, id)            { Vue.delete(state.artists, this.$array.findIndex(state.artists, (artist) => artist.id === id)); },
  set_search_filters(state, filters)  { state.searchFilters = filters; }
}

export const actions = {
  async reloadArtist({ commit, state }, id) {
    // Otherwise get from API (first load)
    const {data} = await this.$axios.get(`/artists/${id}`);
    commit('set_artist', data);

    // Append Artist to "cache" so that we don't have to load it again soon
    commit('add_artist', data);
  },
  async loadArtist({commit, dispatch}, id) {
    // Try to get artist from "cache"
    const artist = _.find((state.artists), (existingArtist) => existingArtist.id === id);
    if (artist != null) { 
      commit('set_artist', artist);
      return;
    }

    await dispatch('reloadArtist', id);
  },
  async loadArtistPrivateProfile({commit}) {
    const {data} = await this.$axios.get('/artists/profile');
    commit('set_artist', data);
  },
  async loadArtistPublicProfile({commit}, id) {
    const {data} = await this.$axios.get(`/artists/${id}/public`);
    commit('set_artist', data);
  },
  async saveProfile({commit, state}) {
    const {data} = await this.$axios.put('/artists/profile', {profile: state.artist});
    commit('set_artist', data);
    this.$toast.success('Perfil atualizado');
  },
  async loadProducts({commit}, id) {
    const {data} = await this.$axios.get(`/artists/${id}/products`);
    commit('set_products', data);
  },
  async saveProduct({ commit }, product) {
    const {data} = await this.$axios.post('/artists/products', { product });
    commit('set_products', data);
  },
  async removeProduct({ commit }, { id }) {
    const {data} = await this.$axios.delete(`/artists/products/${id}`);
    commit('set_products', data);
  },
  async calculateStatistics({ commit }, filters) {
    if (filters === undefined) {
      filters = { start: moment().startOf('year').toISOString(), end: moment().toISOString() };
    }

    const {data} = await this.$axios.get('/artists/statistics', { params: { start: filters.start, end: filters.end }});
    commit('set_statistics', data);
  },

  /** Contractor facing actions */  
  async searchArtists({ commit }, filters) {
    const {data} = await this.$axios.get('/artists/search', { params: filters });
    commit('set_artists', data);
  },
  async loadArtistPublicProfile({ commit }, slug) {
    const {data} = await this.$axios.get(`artists/${slug}/public`);
    commit('set_artist', data);
  },
  setSearchFilters({ commit }, searchFilters) {
    commit('set_search_filters', searchFilters);
  }
}

export const getters = {
  getField
}
/* eslint-disable */