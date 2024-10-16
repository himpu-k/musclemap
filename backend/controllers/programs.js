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

  // Fetch all programs for the user
  const programs = await Program.find({ userId: user._id })

  // Respond with the user's programs
  response.json(programs)
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

    console.log('exercises: ', program.exercises)
    if(!program.exercises) {

      // Return the program details (id and name) without the detailed exercise data
      const programDetails = {
        _id: program._id,
        programName: program.programName,
        exercises: null
      }
      response.status(200).json(programDetails)
    }
    else {
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
              apiId: exercise.apiId,
              name: englishExercise ? englishExercise.name : null,
              sets: exercise.sets
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
    }

  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch program details' })
  }
})

// Create a new program for a user
programsRouter.post('/', async (request, response) => {
  const { programName } = request.body

  // DELETE THIS LATER WHEN LOGIN IS IMPLEMENTED; NOW USING DEFAULT USER
  const defaultEmail = 'test@email.com'
  let user = await User.findOne({ email: defaultEmail })

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

// Update a program by ID
programsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { programName, exercises, newExercise } = request.body

  try {
    // DELETE THIS LATER WHEN LOGIN IS IMPLEMENTED; NOW USING DEFAULT USER
    const defaultEmail = 'test@email.com'
    let user = await User.findOne({ email: defaultEmail })

    if (!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    // Find the program by its ID
    const program = await Program.findById(id)

    if (!program) {
      return response.status(404).json({ error: 'Program not found' })
    }

    // Check if the user owns the program
    if (program.userId.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'Permission denied' })
    }

    // Update the program name if provided
    if (programName) {
      program.programName = programName
    }

    // Add new exercise if provided
    if (newExercise) {
      const { apiId, sets } = newExercise
      const newExerciseData = { apiId, sets }
      program.exercises.push(newExerciseData)
    }

    // Update the exercises if provided (optional)
    if (exercises) {
      program.exercises = exercises
    }

    // Save the updated program to the database
    const updatedProgram = await program.save()

    // Return the updated program in the response
    response.status(200).json(updatedProgram)
  } catch (error) {
    console.error('Error updating program:', error)
    response.status(500).json({ error: 'Failed to update the program' })
  }
})


// Delete a program by ID
programsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  try {
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

    // Find the program by its ID
    const program = await Program.findById(id)

    if (!program) {
      return response.status(404).json({ error: 'Program not found' })
    }

    // Check if the user owns the program
    if (program.userId.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'Permission denied' })
    }

    // Delete the program from the database
    await Program.findByIdAndDelete(id)

    // Remove the program from the user's programs array
    user.programs = user.programs.filter(programId => programId.toString() !== id)
    await user.save()

    // Send a response indicating that the deletion was successful
    response.status(204).end()
  } catch (error) {
    console.error('Error deleting program:', error)
    response.status(500).json({ error: 'Failed to delete the program' })
  }
})

module.exports = programsRouter
