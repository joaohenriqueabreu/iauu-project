import Vue                        from 'vue';
import _                          from 'lodash';
import { getField, updateField }  from 'vuex-map-fields';

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
  // Force reload proposal (after operations where we don't want cached values - potentially have been changed)
  async reloadProposal({commit, rootState}, id) {
    // Otherwise get from API (first load)
    const {data} = await this.$axios.get(`/proposals/${id}`);       
    await dispatch('setProposal', data);
  },
  async loadProposal({commit, state, dispatch}, id) {
    // Try to get proposal from "cache"
    const proposal = state.proposals[id];
    if (proposal != null) { 
      await dispatch('setProposal', proposal);
      return;
    }

    await dispatch('reloadProposal', id);
  },
  async setProposal({commit, dispatch, rootState}, data) {
    await Promise.all([
      dispatch('artist/loadArtist',         data.artist_id, {root: true}),
      dispatch('contractor/loadContractor', data.contractor_id, {root: true})
    ]);

    const proposal = {...data, artist: rootState.artist.artist, contractor: rootState.contractor.contractor};
    commit('set_proposal', proposal);

    // Append proposal to "cache" so that we don't have to load it again soon
    commit('add_proposal', proposal);
  },
  async loadProposals({commit, dispatch, rootState}) {
    const proposals = await this.$axios.get('/proposals');

    // Retain existing artist and contractor (if any)
    const artist      = rootState.artist.artist;
    const contractor  = rootState.contractor.contractor;
    
    // Get artist and contractor data
    await _.forEach(proposals.data, async (proposal) => {
      await dispatch('setProposal', proposal);
    });

    // Revert back cached artist and contractors
    if (artist.id != null) { 
      dispatch('artist/loadArtist', artist.id, {root: true});
    } else {
      dispatch('artist/resetArtist', '', {root: true});
    }

    if (contractor .id!= null) { 
      dispatch('contractor/loadContractor', contractor.id, {root: true}); 
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
    const {data} = await this.$axios.put(`/proposals/${state.proposal.id}/proposal/counterOffer`);
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
}

export const getters = {
  getField,
  openProposals:     (state) => _.filter(state.proposals, (proposal) => proposal.is_open),
  rejectedProposals: (state) => _.filter(state.proposals, (proposal) => proposal.is_rejected),
}
