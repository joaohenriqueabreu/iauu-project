require('dotenv').config()
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()

// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//   proxyReq.setHeader('Origin', 'web');
// });

export default function(req, res, next) {
  proxy.web(req, res, {
    target: process.env.API_URL,
    changeOrigin: true
  })
}
