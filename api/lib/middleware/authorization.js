const config = require('api/env');
const jwt = require('express-jwt');

const authorize = jwt({ 
  secret: config.auth.secret, algorithms: ['HS256'],
});

const owner = (req, res, next) => {
  // Should always come after authorize 
  console.log('Checking if user owns request...');
  if (req.user.id !== req.params.id) {
    console.log('Not the owner');
    next('Unauthorized');
  }

  console.log('Owner...');
  next();
}

const admin = (req, res, next) => {
  console.log('Checking if user is admin...');
  if (!req.user.role.includes('admin')) {
    console.log('Not an admin');
    next('Unauthorized');
  }

  console.log('Admin...');
  next();
}

const artist = (req, res, next) => {
  console.log('Checking if user is artist...');
  if (!req.user.role.includes('artist')) {
    console.log('Not an artist');
    next('Unauthorized');
  }

  console.log('Artist...');
  next();
}

const contractor = (req, res, next) => {
  console.log('Checking if user is contractor...');
  if (!req.user.role.includes('contractor')) {
    console.log('Not a contractor');
    next('Unauthorized');
  }

  console.log('Contractor...');
  next();
}

const app = (req, res, next) => {
  // TODO change when splitting services
  console.log('Checking app request...');
  const host = req.hostname;
  console.log(host);

  next();
}

module.exports = { authorize, owner, admin, artist, contractor, app }
