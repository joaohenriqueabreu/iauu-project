import _ from 'lodash'
import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  proposal: {},
  presentation: {},
  presentations: []
})

export const mutations = {
  updateField,
  set_proposal(state, data) {
    state.proposal = data
  },
  set_presentation(state, data) {
    state.presentation = data
  },
  set_presentations(state, data) {
    state.presentations = data
  },
  reset_presentation(state) {
    state.presentation = {}
  }
}

export const actions = {
  async loadProposal({ commit }, id) {
    const { data } = await this.$axios.get(`presentations/proposal/${id}`)
    commit('set_proposal', data)
  },
  async loadProposals({ commit }) {
    const { data } = await this.$axios.get('presentations/proposals')
    commit('set_presentations', data)
  },
  async loadPresentations({ commit }) {
    const { data } = await this.$axios.get('presentations')
    commit('set_presentations', data)
  },
  async selectTimeslot({ commit }, { id, timeslot }) {
    const { data } = await this.$axios.put(`presentations/${id}/timeslot`, { timeslot })
    commit('set_presentation', data)
  },
  async sendCounterOffer({ state, commit }, counterOffer) {
    await this.$axios.post(`presentations/${state.presentation.id}/proposal/counterOffer`, {
      counterOffer
    })
  },
  async acceptCounterOffer({ state, commit }) {
    const { data } = await this.$axios.put(
      `presentations/${state.presentation.id}/proposal/counterOffer`
    )
    commit('set_presentation', data)
  },
  async rejectCounterOffer({ state, commit }) {
    const { data } = await this.$axios.delete(
      `presentations/${state.presentation.id}/proposal/counterOffer`
    )
    commit('set_presentation', data)
  },
  async acceptProposal({ commit }, id) {
    await this.$axios.post(`presentations/${id}/proposal/`)
  },
  async rejectProposal({ commit }, id) {
    await this.$axios.delete(`presentations/${id}/proposal/`)
  },
  async loadPresentation({ commit }, id) {
    const { data } = await this.$axios.get(`presentations/${id}`)
    commit('set_presentation', data)
  },
  async confirmPresentation({ commit }, id) {
    const { data } = await this.$axios.put(`presentations/${id}/complete`)
    commit('set_presentation', data)
  },
  async cancelPresentation({ commit }, id) {
    const { data } = await this.$axios.delete(`presentations/${id}`)
    commit('set_presentation', data)
  },
  async editPresentation({ commit, state }) {
    const { data } = await this.$axios.put(`presentations/${state.presentation.id}`, state.presentation);
    commit('set_presentation', data);
  },
  resetPresentation({ commit }) {
    commit('reset_presentation')
  }
}

export const getters = {
  getField,
  isApiLoaded: (state) => state.apiLoaded,
  isMenuOpened: (state) => state.showMenu,
  hasMessage: (state) => state.message !== undefined,
  getMessage: (state) => state.message,

  openProposals: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_proposal),
  rejectedProposals: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_rejected),

  unpaidPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_completed),
  openPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_contracted && !presentation.is_past),
  pendingConfirmPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_confirmed && presentation.is_past),
  cancelledPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_cancelled)
}
