const express = require('express')
const programsRouter = express.Router()
const Program = require('../models/program')
const axios = require('axios')
const baseUrl = 'https://wger.de/api/v2'

// Fetch all programs for the authenticated user
programsRouter.get('/', async (request, response) => {
  const user = request.user
  const programs = await Program.find({ userId: user._id })
  response.json(programs)
})

// Fetch program details by ID, including exercise details from a third-party API
programsRouter.get('/:id', async (request, response) => {
  try {
    const program = await Program.findById(request.params.id)

    if (!program) {
      return response.status(404).json({ error: 'Program not found' })
    }

    // If no exercises, return the program details without exercise data
    if (!program.exercises || program.exercises.length === 0) {
      return response.status(200).json({
        _id: program._id,
        programName: program.programName,
        exercises: null
      })
    }

    // Fetch exercise details from the third-party API for each exercise in the program
    const exercisesWithDetails = await Promise.all(
      program.exercises.map(async (exercise) => {
        try {
          const exerciseDetails = await axios.get(`${baseUrl}/exercisebaseinfo/${exercise.apiId}`)
          const englishExercise = exerciseDetails.data.exercises.find(ex => ex.language === 2)
          return {
            apiId: exercise.apiId,
            name: englishExercise ? englishExercise.name : null,
            sets: exercise.sets
          }
        } catch (error) {
          console.error(`Failed to fetch details for exercise ID ${exercise.apiId}:`, error)
          return { error: `Failed to fetch details for exercise ID ${exercise.apiId}` }
        }
      })
    )

    response.status(200).json({
      _id: program._id,
      programName: program.programName,
      exercises: exercisesWithDetails
    })

  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch program details' })
  }
})

// Create a new program for the authenticated user
programsRouter.post('/', async (request, response) => {
  const { programName } = request.body
  const user = request.user

  const program = new Program({
    programName,
    userId: user._id
  })

  const savedProgram = await program.save()

  // Add the program to the user's list of programs
  user.programs = user.programs.concat(savedProgram._id)
  await user.save()
  response.status(201).json(savedProgram)
})

// Update a program by ID for the authenticated user
programsRouter.put('/:id', async (request, response) => {
  const { programName, exercises, newExercise } = request.body
  try {
    const program = await Program.findById(request.params.id)

    if (!program) {
      return response.status(404).json({ error: 'Program not found' })
    }

    // Ensure the user owns the program
    if (program.userId.toString() !== request.user._id.toString()) {
      return response.status(403).json({ error: 'Permission denied' })
    }

    // Update program name, add new exercise, or update exercises
    if (programName) program.programName = programName
    if (newExercise) program.exercises.push(newExercise)
    if (exercises) program.exercises = exercises

    const updatedProgram = await program.save()
    response.status(200).json(updatedProgram)
  } catch (error) {
    console.error('Error updating program:', error)
    response.status(500).json({ error: 'Failed to update the program' })
  }
})

// Delete a program by ID for the authenticated user
programsRouter.delete('/:id', async (request, response) => {
  try {
    const program = await Program.findById(request.params.id)

    if (!program) {
      return response.status(404).json({ error: 'Program not found' })
    }

    const user = request.user
    // Ensure the user owns the program
    if (program.userId.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'Permission denied' })
    }

    // Delete the program from the database
    await Program.findByIdAndDelete(request.params.id)

    // Remove the program from the user's programs array
    user.programs = user.programs.filter(programId => programId.toString() !== request.params.id)
    await user.save()

    // Send a response indicating that the deletion was successful
    response.status(204).end()

  } catch (error) {
    console.error('Error deleting program:', error)
    response.status(500).json({ error: 'Failed to delete the program' })
  }
})

module.exports = programsRouter
