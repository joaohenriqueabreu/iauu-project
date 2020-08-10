import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  token: null,
  user: {}
})

export const mutations = {
  updateField,
  set_user(state, data) {
    state.user = data
  },
  set_token(state, token) {
    state.token = token
  },
  release_token(state) {
    state.token = null
  }
}

export const actions = {
  async loadUser({ commit }) {
    const { data } = await this.$axios.get('users/profile')
    commit('set_user', data)
  },
  async saveProfile({ commit, state }) {
    const { data } = await this.$axios.put('users/profile', { profile: state.user })
    commit('set_user', data)
  },
  register({ commit }, credentials) {
    return this.$axios.post('register', credentials)
  },
  async verify({ commit }, verifyToken) {
    console.log('are we here?')
    const { data } = await this.$axios.post('verify', { token: verifyToken })
    commit('set_token', data)
  },
  async resendVerify({ commit }, verifyToken) {
    const { data } = await this.$axios.post('verify/resend', { token: verifyToken })
    commit('set_token', data)
  },
  async renewAuth({ commit }) {
    const { data } = await this.$axios.get('users/renew')
    this.$auth.setUserToken(data.access_token)
  },
  release({ commit }) {
    // No need to hold token as $auth handles it
    commit('release_token')
  },
  async resetPassword({ commit }, credentials) {
    await this.$axios.post('reset/password', credentials)
  },
  forgotPassword({ commit }, email) {
    this.$axios.post('reset/forgot', { email })
  },
  async facebookLogin({ commit }, token) {
    const { data } = await this.$axios.post('login/facebook', { token })
    commit('set_token', data)
  }
}

export const getters = {
  getField
}
