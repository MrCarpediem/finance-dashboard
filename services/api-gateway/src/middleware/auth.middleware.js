const jwt = require('jsonwebtoken')
const config = require('../config')

// Public routes — no token needed
const PUBLIC_ROUTES = [
  { method: 'POST', path: '/api/auth/login' },
  { method: 'POST', path: '/api/auth/register' },
  { method: 'POST', path: '/api/auth/refresh' },
  { method: 'GET',  path: '/health' },
]

const isPublicRoute = (method, path) => {
  return PUBLIC_ROUTES.some(
    (r) => r.method === method && path.startsWith(r.path)
  )
}

const authenticate = (req, res, next) => {
  if (isPublicRoute(req.method, req.path)) {
    return next()
  }

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access token missing',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, config.jwt.secret)

    // Inject user info into headers for downstream services
    req.headers['x-user-id']   = decoded.id
    req.headers['x-user-role'] = decoded.role
    req.headers['x-user-email']= decoded.email
    req.headers['x-user-name'] = decoded.name

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

module.exports = { authenticate }