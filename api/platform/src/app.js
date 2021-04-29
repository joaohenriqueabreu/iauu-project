/**
 We have required all the packages we need for our application, defined the database, created an express server and an express router.
Now, let's define CORS middleware, to ensure we do not run into any cross origin resource errors:
 */
const config      = require('lib/env');

// Express and Request config
const express     = require('express');
const helmet      = require('helmet');
const compression = require('compression');
const cors        = require('cors');

// init db and connect
const db          = require('./data/db');
const corsOptions = require('./data/cors');
const initDb      = async () => {
  try {
    await db.connect();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}

initDb();

// Express config
const app = express();

// Express routing config
const router = express.Router();
const routes = require('./routes');
const { errorMiddleware } = require('lib/middleware');

// app.options('*', cors(corsOptions))
app.use(cors());
app.use(helmet());
app.use(compression());

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/**
For login, we use bcrypt to compare our hashed password with the user supplied password. If they are the same, we log the user in. If not, well, feel free to respond to the user how you please.
Now, let's use the express server to make our application accessible:
 */

app.use(router);
app.use(routes);
app.use(errorMiddleware);

process.title = 'iauu.api';
let expressPort = config.http.port || 4444;

app.listen(expressPort, () => {
  console.log(`Express server listening on port: ${expressPort}`);
});

// TODO move to top
const { startEventConsumers } = require('./events');

// Start event consumers
startEventConsumers();
