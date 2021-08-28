const { RequestEndpointService } = require('@iauu/services');

const requestEndpointSvc = new RequestEndpointService();
const get = async (endpoint, id, query) => {
  // TODO implement query string
  const response = await requestEndpointSvc.get(`${endpoint}/${id}`, query);
  return response;
}

module.exports = { get }