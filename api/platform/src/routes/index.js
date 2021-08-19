const api           = require('express').Router();

const status        = require('./status');
const auth          = require('./auth');
const admin         = require('./admin');
const feedbacks     = require('./feedback');
const artist        = require('./artist');
const contractor    = require('./contractor');
const schedule      = require('./schedule');

// Presentation services
const proposal      = require('./proposal');
const presentation  = require('./presentation');
const billing       = require('./billing');

const file          = require('./file');
const statistics    = require('./statistics');
const data          = require('./data');

api.use('/',              status);
api.use('/',              auth);
api.use('/data',          data);
api.use('/admin',         admin);
api.use('/artists',       artist);
api.use('/contractors',   contractor);
api.use('/schedules',     schedule);

api.use('/proposals',     proposal);
api.use('/presentations', presentation);
api.use('/billing',       billing);

api.use('/files',         file);
api.use('/statistics',    statistics);
api.use('/feedbacks',     feedbacks);

module.exports = api;
