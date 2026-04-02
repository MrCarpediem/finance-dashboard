const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, try again later.' },
})
app.use('/api/', limiter)

// Routes
app.use('/api/auth',  authRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'auth-service',
    status: 'running',
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

module.exports = app