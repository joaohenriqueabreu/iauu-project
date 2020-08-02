import _ from 'lodash'
import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  stats: {},
  user: {},
  users: [],
  presentations: []
})

export const mutations = {
  updateField,
  set_user_stats(state, data) {
    Vue.set(state.stats, 'user', data)
  },
  set_users_stats(state, data) {
    Vue.set(state.stats, 'users', data)
  },
  set_presentations_stats(state, data) {
    Vue.set(state.stats, 'presentations', data)
  },
  set_user(state, data) {
    Vue.set(state, 'user', data)
  },
  set_users(state, data) {
    Vue.set(state, 'users', data)
  },
  set_presentations(state, data) {
    Vue.set(state, 'presentations', data)
  }
}

export const actions = {
  async status() {
    await this.$axios.get('/')
  },
  async loadUsersStats({ commit }) {
    const { data } = await this.$axios.get('admin/users/stats')
    commit('set_users_stats', data)
  },
  async loadPresentationsStats({ commit }) {
    const { data } = await this.$axios.get('admin/presentations/stats')
    commit('set_presentations_stats', data)
  },
  async loadUsers({ commit }) {
    const { data } = await this.$axios.get('admin/users')
    commit('set_users', data)
  },
  async loadUserStats({ commit }, id) {
    const { data } = await this.$axios.get(`admin/users/${id}/stats`)
    commit('set_user', data.user)
    commit('set_user_stats', data.stats)
  },
  async loadPresentations({ commit }) {
    const { data } = await this.$axios.get('admin/presentations')
    commit('set_presentations', data)
  },
  async searchUsers({ commit }, term) {
    const { data } = await this.$axios.get('admin/users', { params: { search: term }})
    commit('set_users', data)
  },
  async blockUser({ commit }, { id }) {
    const { data } = await this.$axios.delete(`admin/users/${id}`)
    commit('set_user', data)
  },
  async activateUser({ commit }, { id }) {
    const { data } = await this.$axios.put(`admin/users/${id}`)
    commit('set_user', data)
  },
  async verifyUser({ commit }, { id }) {
    const { data } = await this.$axios.put(`admin/users/${id}/verify`)
    commit('set_user', data)
  },
  async resendVerification({ commit }, { id }) {
    const { data } = await this.$axios.post(`admin/users/${id}/verify/resend`)
    commit('set_user', data)
  }
}

export const getters = {
  getField,
  adminUsers: (state) => _.filter(state.users, (user) => user.role === 'admin'),
  artistUsers: (state) => _.filter(state.users, (user) => user.role === 'artist'),
  contractorUsers: (state) => _.filter(state.users, (user) => user.role === 'contractor'),
  pendingUsers: (state) => _.filter(state.users, (user) => user.status === 'pending'),
  activeUsers: (state) => _.filter(state.users, (user) => user.status === 'active'),
  blockedUsers: (state) => _.filter(state.users, (user) => user.status === 'blocked'),

  proposalPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'proposal'),
  rejectedPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'rejected'),
  acceptedPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'accepted'),
  completedPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'completed'),
  cancelledPresentations: (state) => _.filter(state.presentations, (presentation) => presentation.status === 'cancelled'),

  usersStats: (state) => state.stats.users !== undefined ? state.stats.users[0] : {}
}
