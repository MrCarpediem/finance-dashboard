const jwt = require('jsonwebtoken')
const config = require('../config')

// Verifies JWT and attaches user to req
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access token missing or malformed',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    })
  }
}

// Checks if authenticated user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required: ${roles.join(' or ')}`,
      })
    }

    next()
  }
}

module.exports = { authenticate, authorize }