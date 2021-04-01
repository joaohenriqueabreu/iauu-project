// Use a separate axios instance as base will always call API
import axios from 'axios'

const cors = {
  fetch: async (url) => {
    try {
      const response = await axios.get(`${process.env.corsProxyUrl}/${url}`)
      return response.data
    } catch (err) {
      // handle error
    }
  }
}

export default ({ app }, inject) => {
  inject('cors', cors)
}