const config = require('lib/env');

// init db and connect
const db  = require('lib/data/db');
const odm = require('mongoose');
const initDb = async () => {
  try {
    await db.connect(odm);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}

initDb();

const socketServer  = require('./server');
const webSocketPort = config.socket.chat.port || 555;

// Wire up the server to listen to our port 500
socketServer.listen(webSocketPort, () => {
  console.log(`Socket server listening on port: ${webSocketPort}`);
})