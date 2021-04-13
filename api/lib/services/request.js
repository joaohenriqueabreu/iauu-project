const axios = require('axios').default;
const config = require('../env');
const { BadRequestException } = require('../exception');

module.exports = class RequestEndpointService {
  constructor(service) {
    const requestPort = this.mapServiceToPort(service);

    this.http = axios.create({
      baseURL: `http://localhost:${requestPort}`,
      headers: {'Authorization' : `Bearer ${config.auth.app_secret}`}
    });
  }

  mapServiceToPort(service) {
    if (service === undefined) {
      return config.http.port;
    }

    if (service === 'notification') {
      return config.socket.port;
    }

    if (service === 'proxy') {
      return config.proxy.port;
    }

    throw new BadRequestException('Invalid service provided');
  }

  async get(endpoint) {
    // const response = await this.http.get(`${this.baseUrl}${endpoint}`);
    const { data } = await this.http.get(endpoint);
    return data;
  }

  async post(endpoint, requestData) {
    const { data } = await this.http.post(endpoint, requestData);
    return data;
  }
}