module.exports = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: function (origin, next) {
    console.log('New request received...')
    console.log(`From ${origin}...`)
    if (process.env.CORS_WHITELIST.indexOf(origin) !== -1) {
      console.log('Request accepted...')
      next(null, true)
    } else {
      next(new Error('Not allowed by CORS'))
    }
  },
}