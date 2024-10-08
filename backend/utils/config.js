require('dotenv').config()

const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = process.env.MONGODB_URI


module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV
}
