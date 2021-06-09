import Vue                        from 'vue';
import _                          from 'lodash';
import moment                     from 'moment';
import { getField, updateField }  from 'vuex-map-fields';

export const state = () => ({
  proposal:  {},
  proposals: {},
})

export const mutations = {
  updateField,
  edit_proposal(state, { prop, value }) { Vue.set(state.proposal, prop, value); },
  set_proposal(state, data)             { state.proposal  = data; },
  set_proposals(state, data)            { state.proposals = _.keyBy(_.sortBy(data, 'timeslots.start_dt'), 'id'); },
  add_proposal(state, data)             { Vue.set(state.proposals, data.id, data); },
  reset_proposal(state)                 { state.proposal  = {}; }
}

export const actions = {
  async initProposal({ dispatch, commit }, artist_id) {
    commit('reset_proposal');

    await dispatch('setProposal', { artist_id });
  },
  editProposal({ commit }, data) {
    commit('edit_proposal', data);
  },
  async setProposal({ commit, dispatch, rootState }, data) {
    if (data.artist_id != null) {
      await dispatch('artist/loadArtist', data.artist_id, { root: true });
    }

    if (data.contractor_id != null) {
      await dispatch('contractor/loadContractor', data.contractor_id, { root: true });
    }    

    const proposal = {...data, artist: rootState.artist.artist, contractor: rootState.contractor.contractor};
    commit('set_proposal', proposal);

    // Append proposal to "cache" so that we don't have to load it again soon (don't add if it's new proposal)
    if (proposal.id != null) {
      commit('add_proposal', proposal);
    }
  },
  async loadProposal({ commit, state, dispatch }, id) {
    commit('reset_proposal');

    // Try to get proposal from "cache"
    let proposal = state.proposals[id];
    if (proposal == null) {
      const { data } = await this.$axios.get(`/proposals/${id}`);
      proposal = data;
    }

    await dispatch('setProposal', proposal);
  },
  async loadProposals({ commit, dispatch }) {
    commit('reset_proposal');
    const { data } = await this.$axios.get('/proposals');

    // Get artist and contractor data
    await _.forEach(data, async (proposal) => {
      // Load artist and contractor info
      await dispatch('setProposal', proposal);
      commit('reset_proposal');
    });
  },
  async selectTimeslot({ dispatch }, { id, timeslot }) {
    const { data } = await this.$axios.put(`/proposals/${id}/timeslot`, { timeslot });
    await dispatch('setProposal', data);
  },
  async sendProposal({ state, rootState }) {
    await this.$axios.post('/proposals', { proposal: state.proposal, artist: rootState.artist.artist.id });
  },
  async sendCounterOffer({ state, dispatch }, counterOffer) {
    const { data } = await this.$axios.post(`/proposals/${state.proposal.id}/counterOffer`, { counterOffer });
    dispatch('setProposal', data);
  },
  async acceptCounterOffer({ state, dispatch }) {
    const { data } = await this.$axios.put(`/proposals/${state.proposal.id}/counterOffer`);
    dispatch('setProposal', data);
  },
  async rejectCounterOffer({ state, dispatch }) {
    const { data } = await this.$axios.delete(`/proposals/${state.proposal.id}/counterOffer`);
    dispatch('setProposal', data);
  },
  async acceptProposal({ dispatch }, id) {
    const { data } = await this.$axios.put(`/proposals/${id}/accept`);
    dispatch('setProposal', data);
  },
  async rejectProposal({ commit }, id) {
    await this.$axios.delete(`/proposals/${id}`);
    commit('reset_proposal');
  },
  async updateProposal({ dispatch, state }, proposal) {
    const { data } = await this.$axios.put(`/proposals/${state.proposal.id}`, proposal);
    dispatch('setProposal', data);
  },
  async markProposalRead({ dispatch, state }) {
    const { data } = await this.$axios.put(`/proposals/${state.proposal.id}`, { read_dt: moment().toISOString() });
    dispatch('setProposal', data);
  },
  editProposal({ commit }, data) {
    commit('edit_proposal', data);
  }
}

export const getters = {
  getField,
  unreadProposals:    (state) => _.filter(state.proposals, (proposal) => !proposal.is_read),
  otherProposals:     (state) => _.filter(state.proposals, (proposal) => proposal.is_read),
  openProposals:      (state) => _.filter(state.proposals, (proposal) => proposal.is_open),
  rejectedProposals:  (state) => _.filter(state.proposals, (proposal) => proposal.is_rejected),
}
