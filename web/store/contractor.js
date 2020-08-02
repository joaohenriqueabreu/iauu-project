import Vue from 'vue'
import Artist from '@/models/artist'
import Proposal from '@/models/proposal'
import Contractor from '~/models/contractor'

import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  contractor: null,
  artists: [],
  artist: null,
  proposal: {}
})

export const mutations = {
  updateField,
  set_contractor(state, data) {
    state.contractor = new Contractor(data)
  },
  update_profile(state, { prop, data }) {
    if (prop === undefined) {
      return
    }

    const props = prop.split('.')
    const field = props.pop()
    let profile = state.contractor

    props.forEach((field) => {
      profile = profile[field]
    })

    Vue.set(profile, field, data)
  },
  set_artists(state, artistsData) {
    state.artists = []
    artistsData.forEach((artistData) => {
      state.artists.push(new Artist(artistData))
    })
  },
  set_artist(state, artistData) {
    state.artist = new Artist(artistData)
  },
  remove_artist(state, id) {
    Vue.delete(
      state.artists,
      this.$array.findIndex(state.artists, (artist) => artist.id === id)
    )
  },
  init_proposal(state) {
    state.proposal = new Proposal()
  },
  edit_proposal(state, { prop, value }) {
    Vue.set(state.proposal, prop, value)
  }
}

export const actions = {
  async searchArtists({ commit }, filters) {
    const { data } = await this.$axios.get('contractors/artists/search', { params: filters })
    commit('set_artists', data)
  },
  async loadContractor({ commit }) {
    const { data } = await this.$axios.get('contractors/profile')
    commit('set_contractor', data)
  },
  async saveProfile({ commit, state }) {
    await this.$axios.put('contractors/profile', { profile: state.contractor })
    this.$toast.success('Perfil atualizado com sucesso')
  },
  async loadArtist({ commit }, slug) {
    const { data } = await this.$axios.get(`artists/${slug}/public`)
    commit('set_artist', data)
  },
  async loadArtistPrivate({ commit }, id) {
    const { data } = await this.$axios.get(`artists/${id}/private`)
    commit('set_artist', data)
  },
  initProposal({ commit }) {
    commit('init_proposal')
  },
  editProposal({ commit }, data) {
    commit('edit_proposal', data)
  },
  async sendProposal({ state, commit }) {
    await this.$axios.post('presentations/proposal', { proposal: state.proposal })
  }
}

export const getters = {
  getField
}
