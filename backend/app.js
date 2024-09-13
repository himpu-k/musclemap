const express = require('express')
require('express-async-errors')

const cors = require('cors')

// Middleware
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()

app.use(cors())
app.use(express.json())

module.exports = app
