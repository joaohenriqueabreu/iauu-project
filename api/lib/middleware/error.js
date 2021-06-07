const Exception = require('../exception/exception');

module.exports = (error, req, res, next) => {  
    console.log('Something is wrong...');
    console.log(`${error.name} (${error.code}): ${error.message} at ${error.stack}`);

    if (error instanceof Exception) {
        console.log('We have an exception');
        return res.status(error.code).json(error.message);
    }

    console.log('We have an error');
    return res.status(500).json(error);
}