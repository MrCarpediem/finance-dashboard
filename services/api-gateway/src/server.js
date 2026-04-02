const app    = require('./app')
const config = require('./config')

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`)
  console.log(`Auth      → ${config.services.auth}`)
  console.log(`Finance   → ${config.services.finance}`)
  console.log(`Analytics → ${config.services.analytics}`)
})