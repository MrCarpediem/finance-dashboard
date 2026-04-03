const app = require('./app')
const config = require('./config')
const prisma = require('./models')

const start = async (retries = 20) => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
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