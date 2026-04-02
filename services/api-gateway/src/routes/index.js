const router  = require('express').Router()
const proxy   = require('express-http-proxy')
const config  = require('../config')

// ── Auth Service proxy ──────────────────────────────
router.use('/api/auth',  proxy(config.services.auth, {
  proxyReqPathResolver: (req) => `/api/auth${req.url}`,
}))

router.use('/api/users', proxy(config.services.auth, {
  proxyReqPathResolver: (req) => `/api/users${req.url}`,
}))

// ── Finance Service proxy ───────────────────────────
router.use('/api/transactions', proxy(config.services.finance, {
  proxyReqPathResolver: (req) => `/api/transactions${req.url}`,
}))

router.use('/api/categories', proxy(config.services.finance, {
  proxyReqPathResolver: (req) => `/api/categories${req.url}`,
}))

// ── Analytics Service proxy ─────────────────────────
router.use('/api/analytics', proxy(config.services.analytics, {
  proxyReqPathResolver: (req) => `/api/analytics${req.url}`,
}))

module.exports = router