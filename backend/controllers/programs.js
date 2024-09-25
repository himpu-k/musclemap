const programsRouter = require('express').Router()
const Program = require('../models/program')
const User = require('../models/user')

// Get all programs for the user
programsRouter.get('/', async (request, response) => {
  // DELETE THIS LATER WHEN LOGIN IS IMPLEMENTED; NOW USING DEFAULT USER
  const defaultEmail = 'test@email.com'
  let user = await User.findOne({ email: defaultEmail })
  /*
  UNCOMMENT THIS LATER WHEN LOGIN AND AUTHENTICATION IS IMPLEMENTED
  const user = request.user

  // Check if the user is authenticated
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
    */
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // Fetch all programs for the user
  const programs = await Program.find({ userId: user._id })

  // Respond with the user's programs
  response.json(programs)
})

// Create a new program for a user
programsRouter.post('/', async (request, response) => {
  const { programName, exercises } = request.body

  // DELETE THIS LATER WHEN LOGIN IS IMPLEMENTED; NOW USING DEFAULT USER
  const defaultEmail = 'test@email.com'
  let user = await User.findOne({ email: defaultEmail })
  /*
  UNCOMMENT THIS LATER WHEN LOGIN AND AUTHENTICATION IS IMPLEMENTED
  const user = request.user

  // Check if the user is authenticated
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
    */

  const program = new Program({
    programName,
    exercises,
    userId: user._id,
  })

  // Save the program to the database
  const savedProgram = await program.save()

  // Add the program to the user's list of programs
  user.programs = user.programs.concat(savedProgram._id)
  await user.save()

  // Send back the saved program in the response
  response.status(201).json(savedProgram)
})

module.exports = programsRouter
