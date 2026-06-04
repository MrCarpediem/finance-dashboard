const express    = require('express')
const cors       = require('cors')
const morgan     = require('morgan')
const rateLimit  = require('express-rate-limit')

const { authenticate } = require('./middleware/auth.middleware')
const routes           = require('./routes')

const app = express()

// Trust proxy (needed for Render / cloud deployments behind reverse proxy)
app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://finance-dashboard-nine-green.vercel.app',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

// Global rate limit — generous for portfolio demo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests' },
})
app.use(limiter)

// Gateway health — BEFORE auth middleware so it's always accessible
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    status:  'running',
    timestamp: new Date().toISOString(),
  })
})

// JWT verification on every request (skips public routes internally)
app.use(authenticate)

// Proxy routes
app.use(routes)

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