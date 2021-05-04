/* eslint-disable */
import Vue                      from 'vue';
import _                        from 'lodash';
import moment                   from 'moment';
import {getField, updateField}  from 'vuex-map-fields';

export const state = () => ({
  artist:       {},
  artists:      {},
  product:      {},
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
  update_profile(state, {prop, data}) {
    if (prop === undefined) { return; }

    const props = prop.split('.');
    const field = props.pop();
    let profile = state.artist;

    props.forEach((field) => { profile = profile[field]; })
    Vue.set(profile, field, data);
  },
  set_product(state, data)  { state.product = data; },
  remove_product(state, id) {
    Vue.delete(
      state.artist.products,
      this.$array.findIndex(state.artist.products, (product) => product.id === id)
    );
  },
  set_statistics(state, statistics)   { state.statistics = statistics; },
  set_artists(state, data)            { state.artists = _.keyBy(data, 'id'); },
  add_artist(state, data)             { Vue.set(state.artists, data.id, data); },
  set_artist(state, data)             { state.artist = data; },
  remove_artist(state, id)            { Vue.delete(state.artists, this.$array.findIndex(state.artists, (artist) => artist.id === id)); },
  set_search_filters(state, filters)  { state.searchFilters = filters; },
  reset_artist(state)                 { state.artist = {}},
}

export const actions = {
  async setArtist({ commit, state }, data) {    
    commit('set_artist', data);

    // Append Artist to "cache" so that we don't have to load it again soon
    commit('add_artist', data);
  },
  async loadArtist({ commit, state, dispatch }, id) {
    commit('reset_artist');

    // Try to get artist from "cache"
    let artist = state.artists[id];
    if (artist == null) {
      const { data } = await this.$axios.get(`/artists/${id}`);
      artist = data;      
    }

    dispatch('setArtist', artist);
  },
  async loadArtistPrivateProfile({ commit }) {
    const { data } = await this.$axios.get('/artists/profile');

    // do not append this data to cache - we might not want to share all of this with other users
    commit('set_artist', data);
  },
  async loadArtistPublicProfile({ dispatch }, id) {
    const { data } = await this.$axios.get(`/artists/${id}/public`);
    dispatch('setArtist', data);
  },
  async saveProfile({ dispatch, state}) {
    const { data } = await this.$axios.put('/artists/profile', { profile: state.artist });
    dispatch('setArtist', data);
  },
  async loadMyProducts({ dispatch }) {
    const { data } = await this.$axios.get(`/artists/products`);
    dispatch('setArtist', data);
  },
  async loadProducts({ dispatch }, id) {
    const { data } = await this.$axios.get(`/artists/${id}/products`);
    dispatch('setArtist', data);
  },
  async saveProduct({ dispatch }, product) {
    const { data } = await this.$axios.post('/artists/products', { product });
    dispatch('setArtist', data);
  },
  async removeProduct({ dispatch }, id) {
    const { data } = await this.$axios.delete(`/artists/products/${id}`);
    dispatch('setArtist', data);
  },
  async calculateStatistics({ commit }, filters) {
    if (filters === undefined) {
      filters = {start: moment().startOf('year').toISOString(), end: moment().toISOString()};
    }

    const { data } = await this.$axios.get('/artists/statistics', { params: { start: filters.start, end: filters.end }});
    commit('set_statistics', data);
  },

  /** Contractor facing actions */  
  async searchArtists({ commit }, filters) {
    const { data } = await this.$axios.get('/artists/search', { params: filters });
    commit('set_artists', data);
  },
  async loadArtistPublicProfile({ commit }, slug) {
    const { data } = await this.$axios.get(`artists/${slug}/public`);
    commit('set_artist', data);
  },
  setSearchFilters({ commit }, searchFilters) {
    commit('set_search_filters', searchFilters);
  }
}

export const getters = {
  getField,
  products: (state) => state.artist.products,
}
/* eslint-disable */