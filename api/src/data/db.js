require("dotenv").config({ path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'});

const db = require('mongoose');
const connectionOptions = { 
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    autoIndex: process.env.NODE_ENV !== 'production'
    // useFindAndModify: false,
    // autoReconnect: true,
    // reconnectTries: 1000000,
    // reconnectInterval: 3000
};

db.Promise = Promise;
db.connection.on('connected', () => {
  console.log('Connection Established');
  return;
})

db.connection.on('reconnected', () => {
  console.log('Connection Reestablished');
})

db.connection.on('disconnected', () => {
  console.log('Connection Disconnected');
})

db.connection.on('close', () => {
  console.log('Connection Closed');
})

db.connection.on('error', (error) => {
  console.log('ERROR: ' + error);
});

async function connect () {
  const username    = encodeURIComponent(process.env.DB_USERNAME);
  const password    = encodeURIComponent(process.env.DB_PASSWORD);
  const hostname    = encodeURIComponent(process.env.DB_HOSTNAME);
  const dbname      = encodeURIComponent(process.env.DB_NAME);
  const authSource  = encodeURIComponent(process.env.DB_AUTH_SOURCE);
  const dbport      = encodeURIComponent(process.env.DB_PORT);
  
  console.log(`Running ${process.env.NODE_ENV} environment`);

  // await mongoose.connect(`mongodb://${username}:${password}@${hostname}:${dbport}/${dbname}?authSource=${authSource}`, connectionOptions)
  if (process.env.DB_CONNECTION_TYPE === 'simple') {
    console.log('Attempting simple db connection...');
    await db.connect(`mongodb+srv://${hostname}/${dbname} --username ${username}`, connectionOptions);
    return;
  }

  if (process.env.DB_CONNECTION_TYPE === 'cluster') {
    console.log('Attempting cluster db connection...');
    await db.connect(`mongodb+srv://${username}:${password}@${hostname}/${dbname}?retryWrites=true&w=majority`, connectionOptions);
    return;
  }

  if (process.env.DB_CONNECTION_TYPE === 'full') {
    console.log('Attempting full db connection...');
    await db.connect(`mongodb://${username}:${password}@${hostname}:${dbport}/${dbname}`, connectionOptions);
    return;
  }

  throw new Error('Missing connection type config');
}

module.exports = { connect };