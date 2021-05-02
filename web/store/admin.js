import _ from 'lodash'
import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  statistics:     {},
  user:           {},
  users:          [],
  presentations:  [],
  billings:       []
})

export const mutations = {
  updateField,
  set_user_statistics(state, data) {
    Vue.set(state.statistics, 'user', data);
  },
  set_users_statistics(state, data) {
    Vue.set(state.statistics, 'users', data);
  },
  set_presentations_statistics(state, data) {
    Vue.set(state.statistics, 'presentations', data);
  },
  set_user(state, data) {
    Vue.set(state, 'user', data);
  },
  set_users(state, data) {
    Vue.set(state, 'users', data);
  },
  set_presentations(state, data) {
    Vue.set(state, 'presentations', data);
  },
  set_billings(state, data) {
    Vue.set(state, 'billings', data);
  }
}

export const actions = {
  async status() {
    await this.$axios.get('/')
  },
  async calculateUsersStatistics({ commit }) {
    const { data } = await this.$axios.get('admin/users/statistics');
    commit('set_users_statistics', data);
  },
  async calculatePresentationsStatistics({ commit }) {
    const { data } = await this.$axios.get('admin/presentations/statistics');
    commit('set_presentations_statistics', data);
  },
  async loadUsers({ commit }) {
    const { data } = await this.$axios.get('admin/users');
    commit('set_users', data);
  },
  async loadUserStats({ commit }, id) {
    const { data } = await this.$axios.get(`admin/users/${id}/statistics`);
    commit('set_user', data.user);
    commit('set_user_statistics', data.statistics);
  },
  async loadPresentations({ commit }) {
    const { data } = await this.$axios.get('admin/presentations');
    commit('set_presentations', data);
  },
  async loadBillings({ commit }) {
    const { data } = await this.$axios.get('admin/billings');
    commit('set_billings', data);
  },
  async searchUsers({ commit }, term) {
    const { data } = await this.$axios.get('admin/users', { params: { search: term } });
    commit('set_users', data);
  },
  async blockUser({ commit }, { id }) {
    const { data } = await this.$axios.delete(`admin/users/${id}`);
    commit('set_user', data);
  },
  async activateUser({ commit }, { id }) {
    const { data } = await this.$axios.put(`admin/users/${id}`);
    commit('set_user', data);
  },
  async verifyUser({ commit }, { id }) {
    const { data } = await this.$axios.put(`admin/users/${id}/verify`);
    commit('set_user', data);
  },
  async resendVerification({ commit }, { id }) {
    const { data } = await this.$axios.post(`admin/users/${id}/verify/resend`);
    commit('set_user', data);
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

  proposalPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.status === 'proposal'),
  rejectedPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.status === 'rejected'),
  acceptedPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.status === 'accepted'),
  completedPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.status === 'completed'),
  cancelledPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.status === 'cancelled'),

  usersStats: (state) => (state.stats.users !== undefined ? state.stats.users[0] : {})
}
