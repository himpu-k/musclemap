const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, async () => {
  logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode!`)
})