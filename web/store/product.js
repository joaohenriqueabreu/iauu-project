/* eslint-disable */

import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  products: [],
  items: [],
  selection: []
})

export const mutations = {
  updateField,
  set_products(state, products) {
    state.products = products
  },
  set_product(state, productData) {
    state.products.push()
  },
  remove_product(state, id) {
    Vue.delete(
      state.products,
      this.$array.findIndex(state.products, (product) => product.id === id)
    )
  },
  init_items(state) {
    let items = []
    state.products.forEach((product) => {
      product.items.forEach((item) => {
        items.push(item)
      })
    })

    if (this.$utils.empty(items)) {
      // include sample items
      items = this.$config.sampleProductItems
    }

    state.items = this.$array.uniq(items)
  },
  init_selection(state) {
    state.products.forEach((product, pIndex) => {
      state.selection[pIndex] = []
      state.items.forEach((item, iIndex) => {
        state.selection[pIndex][iIndex] = this.$array.findIndex(state.products.item, (pItem) => pItem === item) > -1
      })
    })
  },
  toggle_product_item_selection(state, { product, item }) {
    // This should trigger reactivity
    Vue.set(state.selection[product], item, !state.selection[product][item])
  }
}

export const actions = {
  async loadProducts({ commit }) {
    const { data } = await this.$axios.get('artist/products')
    commit('set_products', data)
    commit('init_items')
    commit('init_selection')
  },
  async saveProduct({ commit }, product) {
    const { data } = await this.$axios.post('artist/products', { product })
    commit('set_product', data)
  },
  async removeProduct({ commit }, id) {
    await this.$axios.delete(`products/${id}`)
    commit('remove_product', id)
  }
}

export const getters = {
  getField
}

/* eslint-enable */
