const express = require('express')
require('express-async-errors')

const cors = require('cors')

// Middleware
const middleware = require('./utils/middleware')
//const config = require('./utils/config')
//const logger = require('./utils/logger')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/not-found', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
