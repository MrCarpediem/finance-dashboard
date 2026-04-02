const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../models')
const config = require('../config')

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  )

  return { accessToken, refreshToken }
}

const register = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const err = new Error('Email already registered')
    err.statusCode = 409
    throw err
  }

  const hashed = await bcrypt.hash(password, config.bcryptRounds)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role || 'VIEWER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })

  return user
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    const err = new Error('Invalid email or password')
    err.statusCode = 401
    throw err
  }

  if (user.status === 'INACTIVE') {
    const err = new Error('Account is deactivated. Contact admin.')
    err.statusCode = 403
    throw err
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const err = new Error('Invalid email or password')
    err.statusCode = 401
    throw err
  }

  const { accessToken, refreshToken } = generateTokens(user)

  // Store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

const refreshToken = async (token) => {
  if (!token) {
    const err = new Error('Refresh token missing')
    err.statusCode = 401
    throw err
  }

  let decoded
  try {
    decoded = jwt.verify(token, config.jwt.refreshSecret)
  } catch {
    const err = new Error('Invalid or expired refresh token')
    err.statusCode = 401
    throw err
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })

  if (!user || user.refreshToken !== token) {
    const err = new Error('Refresh token mismatch')
    err.statusCode = 401
    throw err
  }

  const tokens = generateTokens(user)

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  })

  return tokens
}

const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  })
}

module.exports = { register, login, refreshToken, logout }