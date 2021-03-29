const axios = require('axios').default;
const config = require('../env');
const BaseService = require('./base');

module.exports = class RequestEndpointService extends BaseService {
  constructor() {
    super();

    // this.baseUrl = ;

    this.http = axios.create({
      baseURL: `http://localhost:${config.http.port}`,
      headers: {'Authorization' : `Bearer ${config.auth.app_secret}`}
    });
  }

  async get(endpoint) {
    // const response = await this.http.get(`${this.baseUrl}${endpoint}`);
    const response = await this.http.get(endpoint);
    return response;
  }

  async post(endpoint, data) {
    const response = await this.http.post(endpoint, data);
    return response;
  }
}