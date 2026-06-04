const app = require('./app')
const config = require('./config')
const prisma = require('./models')
const { execSync } = require('child_process')

const start = async (retries = 20) => {
  try {
    // Run Prisma migrations in production
    if (config.nodeEnv === 'production') {
      console.log('Running Prisma migrations...')
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' })
        console.log('Migrations complete')
      } catch (migrationErr) {
        console.error('Migration warning:', migrationErr.message)
        // Continue anyway — tables might already exist
      }
    }

    await prisma.$connect()
    console.log('Database connected successfully')

    // Auto-seed demo users if they don't exist
    try {
      const bcrypt = require('bcryptjs')
      const adminExists = await prisma.user.findUnique({
        where: { email: 'admin@finance.com' },
      })

      if (!adminExists) {
        console.log('Seeding demo users...')
        const hashed = await bcrypt.hash('Admin@123', 12)

        await prisma.user.createMany({
          data: [
            { email: 'admin@finance.com', password: hashed, name: 'Super Admin', role: 'ADMIN', status: 'ACTIVE' },
            { email: 'analyst@finance.com', password: hashed, name: 'Test Analyst', role: 'ANALYST', status: 'ACTIVE' },
            { email: 'viewer@finance.com', password: hashed, name: 'Test Viewer', role: 'VIEWER', status: 'ACTIVE' },
          ],
          skipDuplicates: true,
        })
        console.log('Demo users seeded successfully')
      } else {
        console.log('Demo users already exist, skipping seed')
      }
    } catch (seedErr) {
      console.error('Seed warning:', seedErr.message)
      // Non-fatal — service can still run
    }

    app.listen(config.port, () => {
      console.log(`Auth Service running on port ${config.port}`)
      console.log(`Environment: ${config.nodeEnv}`)
    })
  } catch (err) {
    if (retries > 0) {
      console.log(`DB not ready, retrying in 3s... (${retries} retries left)`)
      setTimeout(() => start(retries - 1), 3000)
    } else {
      console.error('Failed to start auth service:', err)
      process.exit(1)
    }
  }
}

start()