const api = require('express').Router();

const staticDataController = require('../controller/staticData');

api.get('/banks',       staticDataController.banks);
api.get('/categories',  staticDataController.categories);

module.exports = api;