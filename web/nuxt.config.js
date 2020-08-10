require('dotenv').config()

export default {
  mode: 'universal',
  env: {
    fileStackApiKey: process.env.FILESTACK_API_KEY
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
    'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css',
    'selectize/dist/css/selectize.bootstrap3.css'
  ],
  styleResources: {
    scss: [
      '@/assets/scss/lib/_transitions.scss',
      '@/assets/scss/lib/_fonts.scss',
      '@/assets/scss/lib/_colors.scss',
      '@/assets/scss/lib/_variables.scss',
      '@/assets/scss/lib/_responsive.scss',
      'bootstrap/scss/bootstrap',
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
    { src: '@/plugins/dictionary' },
    { src: '@/plugins/ui', mode: 'client' },
    { src: '@/plugins/full-calendar', mode: 'client' },
    { src: '@/plugins/html2canvas', mode: 'client' },
    { src: '@/plugins/cookies', mode: 'client' }
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
    // baseURL: process.env.API_URL,
    baseURL: '/api/v1/'
  },
  proxy: {
    '/api/v1': `${process.env.API_URL}:${process.env.HTTP_PORT}`
  },
  auth: {
    plugins: [{ src: '@/plugins/auth.js', ssr: false }],
    resetOnError: true,
    scopeKey: 'role',
    strategies: {
      facebook: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        access_token_endpoint: false,
        userinfo_endpoint: false,
        scope: ['public_profile', 'email', 'user_birthday'],
        redirect_uri: `${process.env.WEB_URL}/login/facebook/`
      },
      google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        userinfo_endpoint: false,
        redirect_uri: `${process.env.WEB_URL}/login/google/`
      },
      user: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: false },
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
    // module options
    sockets: [
      {
        name: 'chat',
        // url: 'http://localhost:500'
        url: `${process.env.API_URL}:${process.env.SOCKET_PORT}`
      }
    ]
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {}
  },
  toast: {
    position: 'bottom-left',
    duration: 5000,
    containerClass: 'toast-container',
    iconPack: 'fontawesome'
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {},
    terser: false
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
