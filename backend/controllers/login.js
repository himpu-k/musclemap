const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  // Find user by email
  const user = await User.findOne({ email })

  // Check if the password is correct
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // If user doesn't exist or password is incorrect
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  // Create a token payload with email and user id
  const userForToken = {
    email: user.email,
    id: user._id,
  }

  // Token expires in two hours
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 * 2 }
  )

  // Send the token and user email as a response
  response
    .status(200)
    .send({ token, email: user.email })
})

module.exports = loginRouter
