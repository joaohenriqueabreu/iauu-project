/* eslint-disable */
import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  artist: {},
  products: [],
})

export const mutations = {
  updateField,
  set_artist(state, artistData) {
    state.artist = { ...artistData }
  },
  update_profile(state, { prop, data }) {
    if (prop === undefined) {
      return
    }

    const props = prop.split('.')
    const field = props.pop()
    let profile = state.artist

    props.forEach((field) => {
      profile = profile[field]
    })

    Vue.set(profile, field, data)
  },
  set_products(state, products) {
    Vue.set(state, 'products', products)
  },
  set_product(state, product) {

  },
  remove_product(state, id) {
    Vue.delete(
      state.products,
      this.$array.findIndex(state.products, (product) => product.id === id)
    )
  },
}

export const actions = {
  async loadArtist({ commit }) {
    const { data } = await this.$axios.get('artists/profile')
    commit('set_artist', data)
  },
  async saveProfile({ commit, state }) {
    await this.$axios.put('artists/profile', { profile: state.artist })
    this.$toast.success('Artista atualizado com sucesso')
  },
  async loadProducts({ commit }) {
    const { data } = await this.$axios.get('artists/products')
    commit('set_products', data)
  },
  async saveProduct({ commit }, product) {
    const { data } = await this.$axios.post('artists/products', { product })
    commit('set_products', data)    
  },
  async removeProduct({ commit }, { id }) {
    const { data } = await this.$axios.delete(`artists/products/${id}`)
    commit('set_products', data)
  },
  async sendFeedback({ commit }, data) {
    const { id } = data
    await this.$axios.put(`artists/${id}/feedback`, data)
  },
}

export const getters = {
  getField
}
/* eslint-disable */