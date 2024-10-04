const programsRouter = require('express').Router()
const Program = require('../models/program')
const User = require('../models/user')
const axios = require('axios')

const baseUrl = 'https://wger.de/api/v2'

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
  const { programName } = request.body

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

// Get program details by program ID and fetch exercise details from third-party API
programsRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  try {
    // Find the program by ID
    const program = await Program.findById(id)

    if (!program) {
      return response.status(404).json({ error: 'Program not found' })
    }

    // Fetch detailed exercise data from third-party API for each exercise in the program
    const exercisesWithDetails = await Promise.all(
      program.exercises.map(async (exercise) => {
        try {
          // Fetch exercise details from the third-party API using axios
          const exerciseDetails = await axios.get(`${baseUrl}/exercisebaseinfo/${exercise.apiId}`)

          // Find the exercise with language === 2 (English)
          const englishExercise = exerciseDetails.data.exercises.find(ex => ex.language === 2)

          // Return merged exercise details with sets from the database
          return {
            name: englishExercise ? englishExercise.name : null,
            description: englishExercise ? englishExercise.description : null,
            sets: exercise.sets       // Include the original sets from the program document
          }
        } catch (error) {
          console.error(`Failed to fetch details for exercise ID ${exercise.apiId}:`, error)
          return {
            error: `Failed to fetch details for exercise ID ${exercise.apiId}`
          }
        }
      })
    )

    // Return the program details along with the detailed exercise data
    const programDetails = {
      _id: program._id,
      programName: program.programName,
      exercises: exercisesWithDetails,
    }

    response.status(200).json(programDetails)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch program details' })
  }
})

// Add an exercise to a program
programsRouter.post('/:id/exercises', async (request, response) => {
  const { apiId, sets } = request.body
  const { id } = request.params

  try {
    // Find the program by its ID
    const program = await Program.findById(id)

    if (!program) {
      return response.status(404).json({ error: 'program not found' })
    }

    // Add the new exercise to the program's exercises array
    const newExercise = { apiId, sets }
    program.exercises.push(newExercise)

    // Save the updated program to the database
    const updatedProgram = await program.save()

    // Return the updated program in the response
    response.status(200).json(updatedProgram)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to add exercise to program' })
  }
})

module.exports = programsRouter
