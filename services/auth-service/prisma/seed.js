const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.com' },
    update: {},
    create: {
      email: 'admin@finance.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@finance.com' },
    update: {},
    create: {
      email: 'analyst@finance.com',
      password: hashedPassword,
      name: 'Test Analyst',
      role: 'ANALYST',
      status: 'ACTIVE',
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@finance.com' },
    update: {},
    create: {
      email: 'viewer@finance.com',
      password: hashedPassword,
      name: 'Test Viewer',
      role: 'VIEWER',
      status: 'ACTIVE',
    },
  })

  console.log('Seeded:', { admin, analyst, viewer })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })