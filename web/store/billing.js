import _ from 'lodash';
import { getField, updateField } from 'vuex-map-fields';

export const state = () => ({
  billing: {},
  payment: {},
  account: {},
})

export const mutations = {
  updateField,
  set_billing(state, billingData) {
    state.billing = { ...billingData };
    // TODO we should find a way of doing this at the backend
    _.forEach(state.billing.payments, (payment) => {
      if (payment.instalment_id == null) { return; }
      payment.instalment = _.find(state.billing.instalments, (instalment) => instalment.id === payment.instalment_id);
    });
  },
  set_payment(state, paymentData) {
    state.payment = { ...paymentData };
  },
  set_account(state, accountData) {
    state.account = { ...accountData }
  },
  set_banks(state, banksData) {
    state.banks = { ...banksData };
  },
  reset_payment(state) {
    state.payment = {};
  }
}

export const actions = {
  async loadBanks({ commit }) {
    const { data } = await this.$axios.get('/data/banks');
    commit('set_banks', data);
  },
  async loadAccount({ commit }) {
    const { data } = await this.$axios.get('/billing/account');
    commit('set_account', data);
  },
  async loadPresentationBilling({ commit }, presentationId) {
    const { data } = await this.$axios.get(`/billing/presentation/${presentationId}`);
    commit('set_billing', data);
  },
  async saveBankAccount({ commit }, bankAccount) {
    const { data } = await this.$axios.post('billing/account', { bankAccount: bankAccount });
    commit('set_account', data);
  },
  async chargePayment({ commit }, { billingId, instalmentId, paymentMethod }) {
    const { data } = await this.$axios.put(`/billing/${billingId}/pay`, { instalment: instalmentId, method: paymentMethod });
    commit('set_billing', data.billing);
    commit('set_payment', data.payment);
  },
  async saveInstalments({ commit }, { billingId, instalments }) {
    const { data } = await this.$axios.put(`/billing/${billingId}/instalments`, { instalments: instalments });
    commit('set_billing', data);
  },
  resetPayment({ commit }) {
    commit('reset_payment');
  }
}

export const getters = {
  getField
}