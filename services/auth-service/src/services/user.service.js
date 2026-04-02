const prisma = require('../models')

const getAllUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ])

  return {
    data: users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  }
}

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })

  if (!user) {
    const err = new Error('User not found')
    err.statusCode = 404
    throw err
  }

  return user
}

const updateRole = async (id, role) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    const err = new Error('User not found')
    err.statusCode = 404
    throw err
  }

  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, status: true },
  })
}

const updateStatus = async (id, status) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    const err = new Error('User not found')
    err.statusCode = 404
    throw err
  }

  return prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  })
}

module.exports = { getAllUsers, getUserById, updateRole, updateStatus }