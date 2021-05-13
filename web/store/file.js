import Vue                        from 'vue';
import { getField, updateField }  from 'vuex-map-fields';

export const state = () => ({
  file:   {},
  files:  {},
})

export const mutations = {
  updateField,  
  set_file(state, data)   { state.file = data; },
  set_files(state, data)  { state.files = data; },
  add_file(state, data)   { Vue.set(state.files, data.id, data); },
  reset_file(state)       { state.file = {}},
}

export const actions = {
  resetFile({ commit }) {
    commit('reset_file');
  },
  async reloadFile({ commit }, id) {
    // Otherwise get from API (first load)
    const { data } = await this.$axios.get(`/files/${id}`);
    commit('set_file', data);

    // Append File to "cache" so that we don't have to load it again soon
    commit('add_file', data);
  },
  async loadFile({ commit, state, dispatch }, id) {
    // Try to get file from "cache"
    // const file = _.find((state.files), (existingFile) => existingFile.id === id);
    const file = state.files[id];
    if (file != null) { 
      commit('set_file', file);
      return;
    }

    await dispatch('reloadFile', id);
  },
  async loadFileProfile({ commit }) {
    const { data } = await this.$axios.get('files/profile');
    commit('set_file', data);
  },
  async saveProfile({ commit, state }) {
    const { data } = await this.$axios.put('files/profile', {profile: state.file});
    commit('set_file', data);
  },
}

export const getters = {
  getField
}
