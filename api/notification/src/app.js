/**
 We have required all the packages we need for our application, defined the database, created an express server and an express router.
Now, let's define CORS middleware, to ensure we do not run into any cross origin resource errors:
 */
const config = require('lib/env');

// init db and connect
const db = require('./data/db');
const corsOptions = require('./data/cors');
const initDb = async () => {
  try {
    await db.connect();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}

initDb();

const socketServer = require('./server');
const webSocketPort = config.socket.port || 555;

// Wire up the server to listen to our port 500
socketServer.listen(webSocketPort, () => {
  console.log(`Socket server listening on port: ${webSocketPort}`);
})