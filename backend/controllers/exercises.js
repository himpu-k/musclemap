const exerciseRouter = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://wger.de/api/v2'

// https://wger.de/api/v2/schema/ui#/

// Fetch all exercise categories from wger API (http://localhost:3001/api/exercises/exercisecategory)
exerciseRouter.get('/exercisecategory', async (request, response) => {
  try {
    const result = await axios.get(`${baseUrl}/exercisecategory`)

    // Respond with the exercise data
    response.json(result.data)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})

// Fetch exercise information from wger API
exerciseRouter.get('/exercisebaseinfo', async (request, response) => {
  try {
    const result = await axios.get(`${baseUrl}/exercisebaseinfo`)

    // Respond with the exercise data
    response.json(result.data)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})

// Fetch exercise information by category from wger API
exerciseRouter.get('/exercisebaseinfo/category/:id', async (request, response) => {
  try {
    const result = await axios.get(`${baseUrl}/exercisebaseinfo/?category=${request.params.id}&limit=50`)

    // Filter out non-English exercises (keep only those with language === 2)
    const filteredExercises = result.data.results.map(exercise => ({
      ...exercise,
      exercises: exercise.exercises.filter(ex => ex.language === 2)
    }))

    // Respond with the modified exercise data
    response.json({ ...result.data, results: filteredExercises })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})

// Fetch specific exercise details by its ID from wger API
// Example endpoint: GET /api/exercises/exercisebaseinfo/:id
exerciseRouter.get('/exercisebaseinfo/:id', async (request, response) => {
  try {
    // Fetch specific exercise by its ID
    const result = await axios.get(`${baseUrl}/exercisebaseinfo/${request.params.id}`)
    response.json(result.data)
  } catch (error) {
    console.error(`Error fetching exercise with ID ${request.params.id}:`, error)
    response.status(500).json({ error: `Failed to fetch exercise with ID ${request.params.id}` })
  }
})

/// ENDPOINTS which might be useful
// exercisebaseinfo
// exercisebaseinfo/{id}
// exercise-base (without extra info)
// video
// exerciseimage
module.exports = exerciseRouter