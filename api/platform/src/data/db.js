const config = require('lib/env');

const db = require('mongoose');
const connectionOptions = { 
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    autoIndex: config.env !== 'production'
    // useFindAndModify: false,
    // autoReconnect: true,
    // reconnectTries: 1000000,
    // reconnectInterval: 3000
};

if (config.debug) {
  db.set('debug', true);
}

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
  console.log(`Running ${config.env} environment`);

  // await mongoose.connect(`mongodb://${username}:${password}@${hostname}:${dbport}/${dbname}?authSource=${authSource}`, connectionOptions)
  if (config.db.connectionType === 'simple') {
    console.log('Attempting simple db connection...');
    await db.connect(`mongodb+srv://${config.db.hostname}/${config.db.dbname} --username ${config.db.username}`, connectionOptions);
    return;
  }

  if (config.db.connectionType === 'cluster') {
    console.log('Attempting cluster db connection...');
    await db.connect(`mongodb+srv://${config.db.username}:${config.db.password}@${config.db.hostname}/${config.db.dbname}?retryWrites=true&w=majority`, connectionOptions);
    return;
  }

  if (config.db.connectionType === 'full') {
    console.log('Attempting full db connection...');
    await db.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.hostname}:${config.db.dbport}/${config.db.dbname}`, connectionOptions);
    return;
  }

  throw new Error('Missing connection type config');
}

module.exports = { connect };