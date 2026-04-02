const authService = require('../services/auth.service')

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const tokens = await authService.refreshToken(refreshToken)
    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: tokens,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const logout = async (req, res) => {
  try {
    await authService.logout(req.user.id)
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  })
}

module.exports = { register, login, refresh, logout, me }