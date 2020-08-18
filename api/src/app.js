/**
 We have required all the packages we need for our application, defined the database, created an express server and an express router.
Now, let's define CORS middleware, to ensure we do not run into any cross origin resource errors:
 */
// "use strict";
require('dotenv').config()

// Express and Request config
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')

// init db and connect
const db = require('./data/db')
const corsOptiosn = require('./data/cors')
const initDb = async () => {
  try {
    await db.connect()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}

initDb()

// Express config
const app = express()

// Express routing config
const router = express.Router()
const routes = require('./routes')
const errorMiddleware = require('./middleware/error')

// app.options('*', cors(corsOptions))
app.use(cors())
app.use(helmet())
app.use(compression())

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

/**
For login, we use bcrypt to compare our hashed password with the user supplied password. If they are the same, we log the user in. If not, well, feel free to respond to the user how you please.
Now, let's use the express server to make our application accessible:
 */

app.use(router)
app.use(routes)
app.use(errorMiddleware)

process.title = 'iauu.api'
let expressPort = process.env.PORT || 4444

app.listen(expressPort, function () {
  console.log(`Express server listening on port ${expressPort}`)
})

const socketServer = require('./sockets/server')
const webSocketPort = process.env.SOCKET_PORT || 500

// Wire up the server to listen to our port 500
socketServer.listen(webSocketPort, () => {
  console.log(`Socket server listening on port: ${webSocketPort}`)
})