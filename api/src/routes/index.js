const api  = require('express').Router();

const status = require('./status');
const auth = require('./auth');
const admin = require('./admin');
const category = require('./category');
const feedbacks = require('./feedback');
const artist = require('./artist');
const contractor = require('./contractor');
const schedule = require('./schedule');
const billing = require('./billing');
const presentation = require('./presentation');
const upload = require('./upload');
const statistics = require('./statistics');
const data = require('./data');

api.use('/', status);
api.use('/', auth);
api.use('/data', data);
api.use('/admin', admin);
api.use('/categories', category);
api.use('/artists', artist);
api.use('/contractors', contractor);
api.use('/schedules', schedule);
api.use('/presentations', presentation);
api.use('/upload', upload);
api.use('/statistics', statistics);
api.use('/feedbacks', feedbacks);
api.use('/billing', billing);

module.exports = api;
