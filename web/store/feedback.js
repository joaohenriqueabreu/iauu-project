/* eslint-disable */
import Vue from 'vue';
import { getField, updateField } from 'vuex-map-fields';

export const state = () => ({
  feedback: {},
  feedbacks: [],
  rating: 0,
})

export const mutations = {
  updateField,
  set_feedback(state, feedback) { state.feedback = feedback; },
  set_feedbacks(state, feedbacks) { state.feedback = feedbacks; },
  set_rating(state, rating) { state.feedback = rating; },
}

export const actions = {
  async loadPresentationFeedback({ commit }, presentationId) {
    const { data } = await this.$axios.get(`feedbacks/presentation/${presentationId}`);
    commit('set_feedback', data);
  },
  async loadArtistFeedbacks({ commit }, artistId) {
    const { data } = await this.$axios.get(`feedbacks/artist/${artistId}`);
    commit('set_feedbacks', data);
  },
  async loadArtistRating({ commit }, artistId) {
    const { data } = await this.$axios.get(`feedbacks/artist/${artistId}/rating`);
    commit('set_rating', data);
  }
}

export const getters = { getField }
/* eslint-disable */