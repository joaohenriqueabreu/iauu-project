import Vue                        from 'vue';
import _                          from 'lodash';
import { getField, updateField }  from 'vuex-map-fields';

export const state = () => ({
  proposal:  {},
  proposals: []
})

export const mutations = {
  updateField,
  edit_proposal(state,        { prop, value }) { Vue.set(state.proposal, prop, value); },
  set_proposal(state, data)   { state.proposal  = data; },
  set_proposals(state, data)  { state.proposals = data; },
  add_proposal(state, data)   { state.proposals.push(data) },
  reset_proposal(state)       { state.proposal  = {}; }
}

export const actions = {
  initProposal({ commit }) {
    commit('reset_proposal');
  },
  editProposal({ commit }, data) {
    commit('edit_proposal', data);
  },
  // Force reload proposal (after operations where we don't want cached values - potentially have been changed)
  async reloadProposal({ commit }, id) {
    // Otherwise get from API (first load)
    const {data} = await this.$axios.get(`/proposals/${id}`);

    const [artist, contractor] = await Promise.all([
      this.$axios.get(`/artists/${data.artist_id}`),
      this.$axios.get(`/contractors/${data.contractor_id}`),
    ]);

    const proposal = { ...data, artist: artist.data, contractor: contractor.data };
    commit('set_proposal', proposal);

    // Append proposal to "cache" so that we don't have to load it again soon
    commit('add_proposal', proposal);
  },
  async loadProposal({commit, state, dispatch}, id) {
    // Try to get proposal from "cache"
    const proposal = _.find((state.proposals), (existingProposal) => existingProposal.id === id);
    if (proposal != null) { 
      commit('set_proposal', proposal);
      return;
    }

    await dispatch('reloadProposal', id);
  },
  async loadProposals({commit, dispatch, rootState}) {
    const proposals = await this.$axios.get('/proposals');

    // Retain existing artist and contractor (if any)
    const artist      = rootState.artist.artist;
    const contractor  = rootState.contractor.contractor;
    
    // Get artist and contractor data
    _.forEach(proposals.data, async (proposal) => {      
      await Promise.all([
        dispatch('artist/loadArtist',         proposal.artist_id, {root: true}),
        dispatch('contractor/loadContractor', proposal.contractor_id, {root: true})
      ]);

      commit('add_proposal', { ...proposal, artist: rootState.artist.artist, contractor: rootState.contractor.contractor });
    });

    // Revert back cached artist and contractors
    if (artist.id != null)     { dispatch('artist/loadArtist',         artist.id,     {root: true}); }
    if (contractor .id!= null) { dispatch('contractor/loadContractor', contractor.id, {root: true}); }
  },
  async selectTimeslot({ commit }, { id, timeslot }) {
    const {data} = await this.$axios.put(`/proposals/${id}/timeslot`, { timeslot });
    commit('set_proposal', data);
  },
  async sendProposal({ state, rootState }) {
    await this.$axios.post('/proposals', { proposal: state.proposal, artist: rootState.artist.artist.id });
  },
  async sendCounterOffer({ state, commit }, counterOffer) {
    const {data} = await this.$axios.post(`/proposals/${state.proposal.id}/counterOffer`, { counterOffer });
    commit('set_proposal', data);
  },
  async acceptCounterOffer({ state, commit }) {
    const {data} = await this.$axios.put(`/proposals/${state.proposal.id}/proposal/counterOffer`);
    commit('set_proposal', data);
  },
  async rejectCounterOffer({ state, commit }) {
    const {data} = await this.$axios.delete(`/proposals/${state.proposal.id}/counterOffer`);
    commit('set_proposal', data);
  },
  async acceptProposal({ commit }, id) {
    await this.$axios.put(`/proposals/${id}/accept`);
    // Should redirect to presentation page
  },
  async rejectProposal({ commit }, id) {
    await this.$axios.delete(`/proposals/${id}`);
    commit('reset_proposal');
  },
}

export const getters = {
  getField,
  openProposals:     (state) => _.filter(state.proposals, (proposal) => proposal.is_open),
  rejectedProposals: (state) => _.filter(state.proposals, (proposal) => proposal.is_rejected),
}
