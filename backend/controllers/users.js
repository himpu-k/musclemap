const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Create a new user with email and password
usersRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  // Check if email and password are empty
  if (!email || !password) {
    return response.status(400).json({ error: 'email and password are required' })
  }

  // Check if the email is already in use
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return response.status(400).json({ error: 'email must be unique' })
  }

  // Hash the password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create the new user
  const user = new User({
    email,
    passwordHash,
  })

  // Save the new user
  const savedUser = await user.save()

  // Return the saved user as a response (without the passwordHash)
  response.status(201).json(savedUser)
})

// Endpoint to fetch all users and their programs
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
  response.json(users)
})

module.exports = usersRouter
