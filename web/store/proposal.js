import Vue                        from 'vue';
import _                          from 'lodash';
import { getField, updateField }  from 'vuex-map-fields';

// Should not be in state
let cachedArtist      = {};
let cachedContractor  = {};

export const state = () => ({
  proposal:  {},
  proposals: {},
})

export const mutations = {
  updateField,
  edit_proposal(state,        { prop, value }) { Vue.set(state.proposal, prop, value); },
  set_proposal(state, data)   { state.proposal  = data; },
  set_proposals(state, data)  { state.proposals = _.keyBy(data, 'id'); },
  add_proposal(state, data)   { Vue.set(state.proposals, data.id, data); },
  reset_proposal(state)       { state.proposal  = {}; }
}

export const actions = {
  initProposal({commit}) {
    commit('reset_proposal');
  },
  editProposal({commit}, data) {
    commit('edit_proposal', data);
  },
  resetProposal({commit}) {
    commit('reset_proposal');
  },
  // Force reload proposal (after operations where we don't want cached values - potentially have been changed)
  async loadProposal({commit, rootState}, id) {
    // Otherwise get from API (first load)
    const {data} = await this.$axios.get(`/proposals/${id}`);       
    await dispatch('setProposal', data);
  },
  async getProposal({commit, state, dispatch}, id) {
    // Try to get proposal from "cache"
    const proposal = state.proposals[id];
    if (proposal != null) { 
      await dispatch('setProposal', proposal);
      return;
    }

    await dispatch('loadProposal', id);
  },
  async setProposal({commit, dispatch, rootState}, data) {
    await Promise.all([
      dispatch('artist/loadArtist',         data.artist_id,     {root: true}),
      dispatch('contractor/loadContractor', data.contractor_id, {root: true})
    ]);

    const proposal = {...data, artist: rootState.artist.artist, contractor: rootState.contractor.contractor};
    commit('set_proposal', proposal);

    // Append proposal to "cache" so that we don't have to load it again soon
    commit('add_proposal', proposal);
  },
  async loadProposals({dispatch}) {
    const proposals = await this.$axios.get('/proposals');

    // Retain existing artist and contractor (if any)
    dispatch('cacheProposalParties');
    
    // Get artist and contractor data
    await _.forEach(proposals.data, async (proposal) => {
      // Load artist and contractor info
      await dispatch('setProposal', proposal);
      dispatch('resetProposal');
    });

    dispatch('resetCachedParties');
  },
  cacheProposalParties({rootState}) {
    cachedArtist      = rootState.artist.artist;
    cachedContractor  = rootState.contractor.contractor;
  },
  resetCachedParties({dispatch}) {
    // This action should only be used locally by this store (not externally)
    // Revert back cached artist and contractors
    if (cachedArtist.id != null) { 
      dispatch('artist/loadArtist', cachedArtist.id, {root: true});
    } else {
      dispatch('artist/resetArtist', '', {root: true});
    }

    if (cachedContractor.id != null) { 
      dispatch('contractor/loadContractor', cachedContractor.id, {root: true}); 
    } else {
      dispatch('contractor/resetContractor', '', {root: true});
    }
  },
  async selectTimeslot({dispatch}, {id, timeslot}) {
    const {data} = await this.$axios.put(`/proposals/${id}/timeslot`, {timeslot});
    await dispatch('setProposal', data);
  },
  async sendProposal({state, rootState}) {
    await this.$axios.post('/proposals', {proposal: state.proposal, artist: rootState.artist.artist.id});
  },
  async sendCounterOffer({state, dispatch}, counterOffer) {
    const {data} = await this.$axios.post(`/proposals/${state.proposal.id}/counterOffer`, {counterOffer});
    dispatch('setProposal', data);
  },
  async acceptCounterOffer({state, dispatch}) {
    const {data} = await this.$axios.put(`/proposals/${state.proposal.id}/counterOffer`);
    dispatch('setProposal', data);
  },
  async rejectCounterOffer({state, dispatch}) {
    const {data} = await this.$axios.delete(`/proposals/${state.proposal.id}/counterOffer`);
    dispatch('setProposal', data);
  },
  async acceptProposal({commit}, id) {
    await this.$axios.put(`/proposals/${id}/accept`);
    // Should redirect to presentation page
  },
  async rejectProposal({commit}, id) {
    await this.$axios.delete(`/proposals/${id}`);
    commit('reset_proposal');
  },
  async editProposal({dispatch, state}, proposal) {
    const {data} = await this.$axios.put(`/proposals/${state.proposal.id}`, proposal);
    dispatch('setProposal', data);
  }
}

export const getters = {
  getField,
  openProposals:     (state) => _.filter(state.proposals, (proposal) => proposal.is_open),
  rejectedProposals: (state) => _.filter(state.proposals, (proposal) => proposal.is_rejected),
}
