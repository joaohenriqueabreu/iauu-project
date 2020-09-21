require('dotenv').config()

export default {
  mode: 'universal',
  dev: process.env.NODE_ENV !== 'production',
  env: {
    fileStackApiKey: process.env.FILESTACK_API_KEY,
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    facebookPixelKey: process.env.FACEBOOK_PIXEL_KEY,
    cdnStaticAssetsDomain: process.env.CDN_STATIC_ASSETS_DOMAIN,
    cdnAppAssetsDomain: process.env.CDN_APP_ASSETS_DOMAIN,
    s3AppAssetsBucketUrl: process.env.S3_APP_ASSETS_BUCKET_URL,
    companyName: process.env.COMPANY_NAME,
    corsProxyUrl: process.env.CORS_PROXY_URL
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_description || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name:'google-signin-client_id',
        content: process.env.GOOGLE_CLIENT_ID
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`
      },
      {
        src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js',
        integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj',
        crossorigin: 'anonymous'
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
        integrity: 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo',
        crossorigin: 'anonymous'
      },
      {
        src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js',
        integrity: 'sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI',
        crossorigin: 'anonymous'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap-vue/dist/bootstrap-vue.css',
    'selectize/dist/css/selectize.bootstrap3.css',
    'filepond/dist/filepond.min.css',
    'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
  ],
  styleResources: {
    scss: [
      '@/assets/scss/lib/_transitions.scss',
      '@/assets/scss/lib/_fonts.scss',
      '@/assets/scss/lib/_colors.scss',
      '@/assets/scss/lib/_variables.scss',
      '@/assets/scss/lib/_responsive.scss',
      '@/assets/scss/main.scss'
    ]
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '@/plugins/config' },
    { src: '@/plugins/utils' },
    { src: '@/plugins/icons' },
    { src: '@/plugins/data' },
    { src: '@/plugins/cdn' },
    { src: '@/plugins/dictionary' },
    { src: '@/plugins/cors', mode: 'client' },
    { src: '@/plugins/ssr', mode: 'client' },
    { src: '@/plugins/ui', mode: 'client' },
    { src: '@/plugins/fullCalendar', mode: 'client' },
    { src: '@/plugins/html2canvas', mode: 'client' },
    { src: '@/plugins/cookies', mode: 'client' },
    { src: '@/plugins/facebookPixel', mode: 'client' },
    { src: '@/plugins/hotjarTracker', mode: 'client' },
    { src: '@/plugins/googleAnalytics', mode: 'client' },
    { src: '@/plugins/socialLogin', mode: 'client' }
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    '@nuxtjs/auth',
    'nuxt-socket-io',
    '@nuxtjs/style-resources',
    '@nuxtjs/sentry',
    '@nuxtjs/toast',
  ],
  axios: {
    baseURL: '/api/v1/'
  },
  proxy: {
    '/api/v1': `${process.env.API_URL}`
  },
  auth: {
    plugins: [{ src: '@/plugins/auth.js', ssr: false }],
    resetOnError: true,
    scopeKey: 'role',
    strategies: {
      user: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: false },
          logout: { url: 'login', method: 'delete' },
          user: { url: 'validate', method: 'post', propertyName: false }
        }
      },
      facebook: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'login/facebook', method: 'post', propertyName: false },
          logout: { url: 'login', method: 'delete' },
          user: { url: 'validate', method: 'post', propertyName: false }
        }
      },
      google: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'login/google', method: 'post', propertyName: false },
          logout: { url: 'login', method: 'delete' },
          user: { url: 'validate', method: 'post', propertyName: false }
        }
      },
      verify: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'verify', method: 'post', propertyName: false },
          logout: { url: 'login', method: 'delete' },
          user: { url: 'validate', method: 'post', propertyName: false }
        }
      },
      admin: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'loginAs', method: 'post', propertyName: false },
          logout: { url: 'login', method: 'delete' },
          user: { url: 'validate', method: 'post', propertyName: false }
        }
      }
    }
  },
  io: {
    sockets: [{ url: `${process.env.SOCKET_URL}` }]
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {}
  },
  toast: {
    position: 'bottom-left',
    duration: 5000,
    containerClass: 'toast-container'
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {},
    parallel: true,
    cache: true,
    hardsource: true,
    terser: false,
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    optimization: {
      minimize: true
    },
    optimizeCSS: true
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
