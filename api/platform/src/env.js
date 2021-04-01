const dotenv = require('dotenv');
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'});

module.exports = {
  env: process.env.NODE_ENV,
  isProductionEnv: () => process.env.NODE_ENV === 'production',
  http: {
    port: process.env.HTTP_PORT
  },
  socket: {
    port: process.env.SOCKET_PORT
  },
  cors: {
    host_ip: process.env.HOST,
    port: process.env.CORS_PORT,
  },
  db: {
    username:  encodeURIComponent(process.env.DB_USERNAME),
    password: encodeURIComponent(process.env.DB_PASSWORD),
    hostname: encodeURIComponent(process.env.DB_HOSTNAME),
    dbname: encodeURIComponent(process.env.DB_NAME),
    authSource: encodeURIComponent(process.env.DB_AUTH_SOURCE),
    dbport: encodeURIComponent(process.env.DB_PORT),
    connectionType: process.env.DB_CONNECTION_TYPE,
  },
  mail: {
    host:  process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PWD,
  },
  url: {
    api: process.env.API_URL,
    web: process.env.WEB_URL,
  },
  auth: {
    app_secret: 'ashdaslhdlashdjhasofhoeqrjqe',
    secret: process.env.AUTH_SECRET
  },
  payment: {
    ourFee: process.env.PLATFORM_FEE,
    gateway: {
      name: process.env.PAYMENT_GATEWAY,
      key: process.env.PAGARME_API_KEY,
      recipientId: process.env.PAGARME_OUR_RECIPIENT_ID
    }
  },
  admin: {
    mail: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  encrypt: {
    secret: process.env.CRYPTO_SECRET,
    key: process.env.CRYPTO_KEY,
    salt: process.env.CRYPTO_IV,
  },
  storage: {
    key: process.env.AWS_S3_FILE_UPLOADER_PUBLIC_KEY,
    secret: process.env.AWS_S3_FILE_UPLOADER_SECRET,
  }
}