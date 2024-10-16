import { useState, useEffect } from 'react'
import exerciseService from '../../services/exercises'
import programService from '../../services/programs'
import { Box, Checkbox, Typography } from '@mui/material'

const ExerciseList = ({ categoryId, programId, updateExercisesInProgram }) => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState([])

  useEffect(() => {
    const fetchExercises = async () => {

      // Fetch program details and set the selected exercises
      const programData = await programService.getById(programId)
      const programExerciseIds = programData.exercises.map(ex => ex.apiId)
      setSelectedExercises(programExerciseIds)

      const exerciseData = await exerciseService.getExercisesFromCategory(categoryId)
      setExercises(exerciseData.results)
      setLoading(false)
    }

    fetchExercises()
  }, [categoryId, programId])

  const handleCheckboxChange = async (exerciseId, isChecked) => {
    try {
      if (isChecked) {
      // If the exercise is already checked (meaning it's getting unchecked), remove it
        await removeExerciseFromProgram(exerciseId)
      } else {
      // If the exercise is not checked (meaning it's getting checked), add it
        await addExerciseToProgram(exerciseId)
      }
      updateExercisesInProgram()
    } catch (error) {
      console.error('Failed to update program:', error)
    }
  }

  const addExerciseToProgram = async (exerciseId) => {
    const newExercise = {
      apiId: exerciseId,
      sets: [] // Adding the new exercise with empty sets
    }

    const updatedProgram = {
      newExercise // Sending only the new exercise to the backend
    }

    // Call the service to add the new exercise
    await programService.update(programId, updatedProgram)

    // Update the selectedExercises state by adding the checked exercise
    setSelectedExercises([...selectedExercises, exerciseId.toString()])
  }

  const removeExerciseFromProgram = async (exerciseId) => {
    const currentProgram = await programService.getById(programId)

    // Remove the exercise with the specified `exerciseId`
    const updatedExercises = currentProgram.exercises.filter(
      (exercise) => exercise.apiId !== exerciseId.toString()
    )

    const updatedProgram = {
      exercises: updatedExercises // Send updated exercises without the removed one
    }

    // Call the service to update the program with the removed exercise
    await programService.update(programId, updatedProgram)

    // Update the selectedExercises state by removing the unchecked exercise
    setSelectedExercises((prevSelectedExercises) =>
      prevSelectedExercises.filter((id) => id !== exerciseId.toString())
    )

    alert('Exercise removed successfully!')
  }

  if (loading) {
    return <div>Loading exercises...</div>
  }

  return (
    <div>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <Box display="flex" alignItems="center" mb={2}>
              <Checkbox
                checked={selectedExercises.includes(exercise.id.toString())}
                onChange={() => handleCheckboxChange(exercise.id, selectedExercises.includes(exercise.id.toString()))}
              />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {exercise.exercises[0].name}
              </Typography>
            </Box>
            <p>Equipment: {exercise.equipment.map((equip) => equip.name).join(', ')}</p>

            {/* Display images if available */}
            {exercise.images.length > 0 && (
              <div>
                <h5>Images:</h5>
                <img
                  src={exercise.images[0].image}
                  alt={`Exercise ${exercise.exercises[0].name}`}
                  width="150"
                  style={{ marginRight: '10px' }}
                />
              </div>
            )}

            {/* Display only the first video if available */}
            {exercise.videos.length > 0 && (
              <div>
                <h5>Video:</h5>
                <video width="320" height="240" controls>
                  <source src={exercise.videos[0].video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )
            }
            <br />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExerciseList
