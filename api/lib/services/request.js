const axios                   = require('axios').default;
const jwt                     = require('jwt-simple');
const config                  = require('../env');
const { BadRequestException } = require('../exception');

module.exports = class RequestEndpointService {
  constructor(service) {
    const requestPort = this.mapServiceToPort(service);

    this.http = axios.create({
      baseURL: `http://localhost:${requestPort}`,
      headers: { 'Authorization' : `Bearer ${jwt.encode(service || 'app', config.auth.secret)}` }
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

  async get(endpoint, queryObj) {
    const queryString = new URLSearchParams(queryObj).toString();
    const { data } = await this.http.get(`${endpoint}?${queryString}`);
    return data;
  }

  async post(endpoint, requestData) {
    const { data } = await this.http.post(endpoint, requestData);
    return data;
  }
}