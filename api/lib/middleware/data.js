const { BadRequestException } = require('api/exception');
const RequestEndpointService = require('../services/request');

const requestEndpointSvc = new RequestEndpointService();

const request = async (api, id, action, req, next) => {
  console.log(`Verifying ${api} from micro-service...`);
  try {
    const response = await requestEndpointSvc.get(`/${api}/${id}/${action}`);
    console.log(`Valid ${api}...`);
    return response.data;
  } catch (error) {
    console.log(error);
    next(new BadRequestException(`Invalid ${api} provided`));
  }
}

const validatePresentation = async (req, res, next) => {
  await request('presentations', req.data.id || req.data.presentation, 'validate', next);
  next();
};

const fetchPresentation = async (req, res, next) => {
  const presentation = await request('presentations', req.data.id || req.data.presentation, 'fetch', next);
  req.data = {...req.data, ...{ presentation }};
  next();
};

const validateArtist = async (req, res, next) => {
  await request('artists', req.data.id || req.data.artist, 'validate', next);
};

const fetchArtist = async (req, res, next) => {
  const artist = await request('artists', req.data.id || req.data.artist, 'fetch', next);
  req.data = {...req.data, ...{ artist }};
  next();
};

const validateContractor = async (req, res, next) => {
  await request('contractors', req.data.id || req.data.contractor, 'validate', next);
};

const fetchContractor = async (req, res, next) => {
  const contractor = await request('contractors', req.data.id || req.data.contractor, 'fetch', next);
  req.data = {...req.data, ...{ contractor }};
  next();
};

const validateBilling = async (req, res, next) => {
  await request('billing', req.data.id || req.data.billing, 'validate', next);
};

const fetchBilling = async (req, res, next) => {
  const billing = await request('billing', req.data.id || req.data.billing, 'fetch', next);
  req.data = {...req.data, ...{ billing }};
  next();
};

const validateFeedback = async (req, res, next) => {
  await request('feedbacks', req.data.id || req.data.feedback, 'validate', next);
};

const fetchFeedback = async (req, res, next) => {
  const feedback = await request('feedbacks', req.data.id || req.data.feedback, 'fetch', next);
  req.data = {...req.data, ...{ feedback }};
  next();
};


module.exports = {
  validatePresentation, validateArtist, validateContractor, validateBilling, validateFeedback,
  fetchPresentation, fetchArtist, fetchContractor, fetchBilling, fetchFeedback,
}