import { getField, updateField } from 'vuex-map-fields';

export const state = () => ({
  billing: {},
  payment: {},
})

export const mutations = {
  updateField,
  set_billing(state, billingData) {
    state.billing = { ...billingData };
  },
  set_payment(state, PaymentData) {
    state.payment = { ...PaymentData };
  },
  reset_payment(state) {
    state.payment = {}
  }
}

export const actions = {
  async loadPresentationBilling({ commit }, presentationId) {
    const { data } = await this.$axios.get(`/billing/presentation/${presentationId}`);
    commit('set_billing', data);
  },

  async chargePayment({ commit }, { billingId, instalmentId, paymentMethod }) {
    const { data } = await this.$axios.put(`/billing/${billingId}/pay`, { instalment: instalmentId, method: paymentMethod });
    commit('set_billing', data.billing);
    commit('set_payment', data.payment);
  },
  resetPayment({ commit }) {
    commit('reset_payment');
  }
}

export const getters = {
  getField
}