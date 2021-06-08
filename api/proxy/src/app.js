/**
 We have required all the packages we need for our application, defined the database, created an express server and an express router.
Now, let's define CORS middleware, to ensure we do not run into any cross origin resource errors:
 */
const config = require('iauu/env');

// CORS bypass server config
const corsHost = config.cors.host_ip || '0.0.0.0';
const corsPort = config.cors.port || 9999;
const cors_proxy = require('cors-anywhere');

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(corsPort, corsHost, () => {
  console.log(`CORS bypass server listening on port: ${corsPort}`);
});