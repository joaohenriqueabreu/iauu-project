import Vue                        from 'vue';
import { getField, updateField }  from 'vuex-map-fields';
import Contractor                 from '@/models/contractor';

export const state = () => ({
  contractor:   {},
  contractors:  [],
})

export const mutations = {
  updateField,  
  set_contractor(state, data)           { state.contractor = data; },
  set_contractors(state, data)          { state.contractors = data; },
  add_contractor(state, data)           { state.contractors.push(data); },
  update_profile(state, { prop, data }) { 
    if (prop == null) {
      return;
    }

    const props = prop.split('.');
    const field = props.pop();
    let profile = state.contractor;

    props.forEach((field) => { profile = profile[field] });

    Vue.set(profile, field, data);
  },
}

export const actions = {
  async reloadContractor({ commit, state }, id) {
    // Otherwise get from API (first load)
    const {data} = await this.$axios.get(`/contractors/${id}`);
    commit('set_contractor', data);

    // Append Contractor to "cache" so that we don't have to load it again soon
    commit('add_contractor', data);
  },
  async loadContractor({commit, dispatch}, id) {
    // Try to get contractor from "cache"
    const contractor = _.find((state.contractors), (existingContractor) => existingContractor.id === id);
    if (contractor != null) { 
      commit('set_contractor', contractor);
      return;
    }

    await dispatch('reloadContractor', id);
  },
  async loadContractorProfile({commit}) {
    const {data} = await this.$axios.get('contractors/profile');
    commit('set_contractor', data);
  },
  async saveProfile({commit, state}) {
    const {data} = await this.$axios.put('contractors/profile', { profile: state.contractor });
    commit('set_contractor', data);
  },
}

export const getters = {
  getField
}
