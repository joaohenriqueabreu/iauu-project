import Payment from '@/models/payment'

export const state = () => ({
  payments: [],
  stats: {
    withdraw: 0,
    pending: 0,
    total: 0
  }
})

export const mutations = {
  set_payments(state, paymentsData) {
    state.payments = []
    paymentsData.forEach((paymentData) => {
      state.payments.push(new Payment(paymentData))
    })
  },
  set_stats(state, statsData) {
    state.stats = { ...statsData }
  }
}

export const actions = {
  async loadPayments({ commit }) {
    const { data } = await this.$axios.get('payments')
    commit('set_payments', data.payments)
    commit('set_stats', data.stats)
  }
}

export const getters = {}
