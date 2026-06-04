require('dotenv').config()

const ensureHttp = (url, port) => {
  if (!url) return null;
  // If the URL already has a port, or doesn't need one
  let formattedUrl = url.startsWith('http') ? url : `http://${url}`
  
  // Render's RENDER_INTERNAL_HOSTNAME doesn't include port, but we need it.
  // Check if it's a render internal URL (doesn't have a port specified yet)
  if (formattedUrl.includes('.render.internal') || !formattedUrl.includes(':')) {
    // We only append port if it's an internal render hostname missing a port.
    if (!formattedUrl.includes(`:${port}`) && !formattedUrl.includes('.onrender.com')) {
      formattedUrl = `${formattedUrl}:${port}`
    }
  }
  return formattedUrl
}

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  services: {
    auth:      ensureHttp(process.env.AUTH_SERVICE_URL, 4001)      || 'http://localhost:4001',
    finance:   ensureHttp(process.env.FINANCE_SERVICE_URL, 4002)   || 'http://localhost:4002',
    analytics: ensureHttp(process.env.ANALYTICS_SERVICE_URL, 4003) || 'http://localhost:4003',
  },
}