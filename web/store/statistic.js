export const state = () => ({})

export const mutations = {}

export const actions = {
  async emitVisitEvent({ commit }, route) {
    console.log(process.env.corsProxyUrl);
    const response = await this.$axios.get(`${process.env.corsProxyUrl}/https://api.ipify.org?format=json`);
    await this.$axios.post('/statistics/visit', { route: route.path, ip: response.data.ip })
  }
}

export const getters = {}