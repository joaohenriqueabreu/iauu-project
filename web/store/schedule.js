import Vue from 'vue'
import Timeslot from '@/models/timeslot'

export const state = () => ({
  timeslots: [],
  lastRemovedTimeslotId: null,
  newlyAddedTimeslot: null
})

export const mutations = {
  set_schedule(state, schedule) {
    state.timeslots = schedule
  },
  append_timeslot(state, timeslotData) {
    Vue.set(state.timeslots, state.timeslots.length, new Timeslot(timeslotData))
  },
  remove_timeslot(state, id) {
    Vue.delete(
      state.timeslots,
      this.$array.findIndex(state.timeslots, (timeslot) => timeslot.id === id)
    )
  }
}

export const actions = {
  async loadSchedule({ commit }, { id, year }) {
    const { data } = await this.$axios.get(`schedules/public/${id}`, { params: { year }})
    commit('set_schedule', data)
  },
  async loadMySchedule({ commit }, query) {
    const { data } = await this.$axios.get('schedules/my', { params: query })
    commit('set_schedule', data)
  },
  async saveTimeslot({ commit }, timeslot) {
    const { data } = await this.$axios.post('schedules', { timeslot })
    commit('append_timeslot', data)
  },
  appendTimeslot({ commit }, timeslotData) {
    commit('append_timeslot', timeslotData)
  },
  deselectTimeslot({ commit }, id) {
    commit('remove_timeslot', id)
  },
  async removeTimeslot({ commit }, id) {
    await this.$axios.delete(`schedules/${id}`)
    commit('remove_timeslot', id)
  }
}

export const getters = {
  lastTimeslot(state) {
    return this.$array.last(state.timeslots)
  },
  presentations(state) {
    return state.timeslots.filter((timeslot) => ['accepted', 'completed', 'cancelled'].includes(timeslot.status))
  },
  proposals(state) {
    return state.timeslots.filter((timeslot) => timeslot.status === 'proposal')
  }
}
