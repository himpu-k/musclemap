const express = require('express')
require('express-async-errors')

const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

// Middleware
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Routers (controllers)
const exerciseRouter = require('./controllers/exercises')
const usersRouter = require('./controllers/users')
const programsRouter = require('./controllers/programs')
const loginRouter = require('./controllers/login')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.morganMiddleware)
app.use(middleware.tokenExtractor)


app.use('/api/exercises', exerciseRouter) // Used for third-party API
app.use('/api/programs', middleware.userExtractor, programsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

// This middleware will handle all non-API routes by serving index.html from the dist directory
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
