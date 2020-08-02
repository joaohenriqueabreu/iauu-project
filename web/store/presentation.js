import Proposal from '@/models/proposal'
import Presentation from '@/models/presentation'
import _ from 'lodash'
import moment from 'moment'
import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  proposal: new Proposal(),
  presentation: {},
  presentations: []
})

export const mutations = {
  updateField,
  set_proposal(state, data) {
    state.proposal = new Proposal(data)
  },
  set_presentation(state, data) {
    state.presentation = new Presentation(data)
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
    await this.$axios.post(`presentations/${state.presentation.id}/proposal/counterOffer`, { counterOffer })
  },
  async acceptCounterOffer({ state, commit }) {
    const { data } = await this.$axios.put(`presentations/${state.presentation.id}/proposal/counterOffer`)
    commit('set_presentation', data)
  },
  async rejectCounterOffer({ state, commit }) {
    const { data } = await this.$axios.delete(`presentations/${state.presentation.id}/proposal/counterOffer`)
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
    const { data } = await this.$axios.put(`presentations/${id}`)
    commit('set_presentation', data)
  },
  async cancelPresentation({ commit }, id) {
    const { data } = await this.$axios.delete(`presentations/${id}`)
    commit('set_presentation', data)
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

  openProposals: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'proposal'),
  rejectedProposals: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'rejected'),
  
  openPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'accepted' && moment(presentation.timeslot.end_dt).isAfter(moment())),
  pendingConfirmPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'accepted' && moment(presentation.timeslot.end_dt).isBefore(moment())),
  completedPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'completed'),
  cancelledPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'cancelled'),
}
