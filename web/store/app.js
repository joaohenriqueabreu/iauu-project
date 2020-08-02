export const state = () => ({
  showMenu: false,
  searchFilters: {
    term: ''
  },
  alert: {
    type: null,
    message: null
  },
  newAlert: false
})

export const mutations = {
  toggle_menu(state) {
    state.showMenu = !state.showMenu
  },
  close_menu(state) {
    state.showMenu = false
  },
  set_alert(state, { message, type = 'success' }) {
    state.alert.type = type
    state.alert.message = message
    state.newAlert = true
  },
  clear_alert(state) {
    state.alert = null
    state.newAlert = false
  },
  set_search_filters(state, filters) {
    state.searchFilters = filters
  }
}

export const actions = {
  toggleMenu({ commit }) {
    commit('toggle_menu')
  },
  closeMenu({ commit }) {
    commit('close_menu')
  },
  setAlert({ commit }, data) {
    commit('set_alert', data)

    // Set on localStorage for persistency over refreshes
    if (process.client) {
      localStorage.setItem('alert', data)
    }
  },
  clearAlert({ commit }) {
    commit('clear_alert')

    // Clean up localStorage as well
    if (process.client) {
      localStorage.removeItem('alert')
    }
  },
  setSearchFilters({ commit }, searchFilters) {
    commit('set_search_filters', searchFilters)
  }
}

export const getters = {
  isMenuOpened: (state) => state.showMenu,
  hasMessage: (state) => state.alert.message !== null || state.alert.message !== undefined
}
