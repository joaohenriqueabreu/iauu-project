require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
})

const mongoose = require('mongoose')
const connectionOptions = { 
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // autoReconnect: true,
    // reconnectTries: 1000000,
    // reconnectInterval: 3000
};

mongoose.Promise = Promise
mongoose.connection.on('connected', () => {
  console.log('Connection Established')
})

mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected')
})

mongoose.connection.on('close', () => {
  console.log('Connection Closed')
})

mongoose.connection.on('error', (error) => {
  console.log('ERROR: ' + error)
})

const run = async () => {
  const username    = encodeURIComponent(process.env.DB_USERNAME)
  const password    = encodeURIComponent(process.env.DB_PASSWORD)
  const hostname    = encodeURIComponent(process.env.DB_HOSTNAME)
  const dbname      = encodeURIComponent(process.env.DB_NAME)
  const authSource  = encodeURIComponent(process.env.DB_AUTH_SOURCE)
  const dbport      = encodeURIComponent(process.env.DB_PORT)
  
  // await mongoose.connect(`mongodb://${username}:${password}@${hostname}:${dbport}/${dbname}?authSource=${authSource}`, connectionOptions)
  if (process.env.DB_CONNECTION_TYPE === 'simple') {
    console.log('Attempting simple db connection...')
    await mongoose.connect(`mongodb+srv://${hostname}/${dbname} --username ${username}`, connectionOptions)
    return
  }

  if (process.env.DB_CONNECTION_TYPE === 'cluster') {
    console.log('Attempting cluster db connection...')
    await mongoose.connect(`mongodb+srv://${username}:${password}@${hostname}/${dbname}?retryWrites=true&w=majority`, connectionOptions)
    return
  }

  if (process.env.DB_CONNECTION_TYPE === 'full') {
    await mongoose.connect(`mongodb://${username}:${password}@${hostname}:${dbport}/${dbname}`, connectionOptions)
    return
  }

  throw new Error('Missing connection type config')
}

run().catch(error => console.error(error))

module.exports = mongoose