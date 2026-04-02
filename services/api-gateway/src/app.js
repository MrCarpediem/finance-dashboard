const express    = require('express')
const cors       = require('cors')
const morgan     = require('morgan')
const rateLimit  = require('express-rate-limit')

const { authenticate } = require('./middleware/auth.middleware')
const routes           = require('./routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Global rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests' },
})
app.use(limiter)

// JWT verification on every request
app.use(authenticate)

// Proxy routes
app.use(routes)

// Gateway health
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    status:  'running',
    timestamp: new Date().toISOString(),
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Gateway error' })
})

module.exports = app