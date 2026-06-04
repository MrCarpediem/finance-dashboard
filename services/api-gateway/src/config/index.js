require('dotenv').config()

const ensureHttp = (url) => {
  if (!url) return url
  return url.startsWith('http') ? url : `http://${url}`
}

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  services: {
    auth:      ensureHttp(process.env.AUTH_SERVICE_URL)      || 'http://localhost:4001',
    finance:   ensureHttp(process.env.FINANCE_SERVICE_URL)   || 'http://localhost:4002',
    analytics: ensureHttp(process.env.ANALYTICS_SERVICE_URL) || 'http://localhost:4003',
  },
}