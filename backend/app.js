const express = require('express')
require('express-async-errors')

const cors = require('cors')

// Middleware
const middleware = require('./utils/middleware')
//const config = require('./utils/config')
//const logger = require('./utils/logger')

// Routers (controllers)
const exerciseRouter = require('./controllers/exercises')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.morganMiddleware)

app.get('/not-found', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.use('/api/exercises', exerciseRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
