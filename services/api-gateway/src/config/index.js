require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  services: {
    auth:      process.env.AUTH_SERVICE_URL      || 'http://localhost:4001',
    finance:   process.env.FINANCE_SERVICE_URL   || 'http://localhost:4002',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:4003',
  },
}