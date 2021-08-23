const moment = require('moment');

module.exports = (req, res, next) => {
    const timestamp = moment().format('DD-MM-YYYY hh:mm:ss')
    console.log('-----------------------------------------------------');
    console.log(`[${timestamp}] We have received a new request...`);
    console.log(`Requesting ${req.url}`);
    next();
}