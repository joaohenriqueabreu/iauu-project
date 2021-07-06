const api = require('express').Router();

const staticDataController = require('../controller/staticData');

api.get('/banks',         staticDataController.banks);
api.get('/categories',    staticDataController.categories);
api.get('/presentations', staticDataController.presentations);

module.exports = api;