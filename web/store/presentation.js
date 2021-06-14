import Vue  from 'vue';
import _    from 'lodash';
import { getField, updateField } from 'vuex-map-fields';

export const state = () => ({
  presentation: {},
  presentations: {},
})

export const mutations = {
  updateField,
  set_presentation(state, data)   { state.presentation = data; },
  set_presentations(state, data)  { state.presentations = _.sortBy(data, 'timeslot.start_dt'); },
  add_presentation(state, data)   { Vue.set(state.presentations, data.id, data); },
  reset_presentation(state)       { state.presentation = {}; },
  reset_presentations(state)      { state.presentations = {}; }
}

export const actions = {
  async setPresentation({ commit, dispatch, rootState }, data) {
    await Promise.all([
      dispatch('proposal/loadProposal',     data.proposal_id,   { root: true }),
      dispatch('artist/loadArtist',         data.artist_id,     { root: true }),
      dispatch('contractor/loadContractor', data.contractor_id, { root: true }),
    ]);

    const presentation = {
      ...data,
      proposal:   rootState.proposal.proposal,
      artist:     rootState.artist.artist, 
      contractor: rootState.contractor.contractor,
    };

    commit('set_presentation', presentation);

    // Append presentation to "cache" so that we don't have to load it again soon
    commit('add_presentation', presentation);
  },
  async loadPresentation({ commit, state, dispatch }, id) {
    commit('reset_presentation');

    // Try to get presentation from "cache"
    let presentation = state.presentations[id];
    if (presentation == null) {
      const { data } = await this.$axios.get(`/presentations/${id}`);
      presentation = data;
    }

    await dispatch('setPresentation', presentation);
  },
  async loadPresentations({ commit, dispatch }, query) {
    commit('reset_presentation');
    commit('reset_presentations');

    const { data } = await this.$axios.get('/presentations', { params: query });
    
    // Get artist and contractor data
    await _.forEach(data, async (presentation) => {
      // Load proposal, artist and contractor info
      await dispatch('setPresentation', presentation);
      commit('reset_presentation');
    });
  },
  async confirmPresentation({ dispatch }, id) {
    const { data } = await this.$axios.put(`presentations/${id}/complete`);
    dispatch('setPresentation', data);
  },
  async cancelPresentation({ dispatch }, id) {
    const { data } = await this.$axios.delete(`presentations/${id}`);
    dispatch('setPresentation', data);
  },
  async editPresentation({ dispatch, state }) {
    const { data } = await this.$axios.put(`presentations/${state.presentation.id}`, state.presentation);
    dispatch('setPresentation', data);
  },
  async uploadDocument({ dispatch, state }, file) {
    const { data } = await this.$axios.post(`presentations/${state.presentation.id}/document`, { file });
    dispatch('setPresentation', data);
  },
  async editDocument({ dispatch, state }, document) {
    const { data } = await this.$axios.put(`presentations/${state.presentation.id}/document`, { document });
    dispatch('setPresentation', data);
  },
  async approveDocument({ dispatch, state }, document) {
    const { data } = await this.$axios.put(`presentations/${state.presentation.id}/document/approve`, { document });
    dispatch('setPresentation', data);
  },
  async rejectDocument({ dispatch, state }, document) {
    const { data } = await this.$axios.put(`presentations/${state.presentation.id}/document/reject`, { document });
    dispatch('setPresentation', data);
  },
  async deleteDocument({ dispatch, state }, documentId) {
    const { data } = await this.$axios.delete(`presentations/${state.presentation.id}/document/${documentId}`);
    dispatch('setPresentation', data);
  }
}

export const getters = {
  getField,
  isApiLoaded: (state) => state.apiLoaded,
  isMenuOpened: (state) => state.showMenu,
  hasMessage: (state) => state.message !== undefined,
  getMessage: (state) => state.message,

  unpaidPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_completed),
  openPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_contracted && !presentation.is_past),
  pendingConfirmPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_confirmed && presentation.is_past),
  completedPresentations:  (state) =>
  _.filter(state.presentations, (presentation) => presentation.is_completed && presentation.is_past),
  cancelledPresentations: (state) =>
    _.filter(state.presentations, (presentation) => presentation.is_cancelled)
}
