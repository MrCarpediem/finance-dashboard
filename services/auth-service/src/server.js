const app = require('./app')
const config = require('./config')
const prisma = require('./models')

const start = async () => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')

    app.listen(config.port, () => {
      console.log(`Auth Service running on port ${config.port}`)
      console.log(`Environment: ${config.nodeEnv}`)
    })
  } catch (err) {
    console.error('Failed to start auth service:', err)
    process.exit(1)
  }
}

start()