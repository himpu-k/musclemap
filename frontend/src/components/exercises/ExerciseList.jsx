import { useState, useEffect } from 'react'
import exerciseService from '../../services/exercises'
import programService from '../../services/programs'
import { Box, Checkbox, Typography, Alert } from '@mui/material'
import { useAlert } from '../../context/AlertContext'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import MoreInfoPopUp from './MoreInfoPopUp'

const ExerciseList = ({ categoryId, programId, updateExercisesInProgram, updateCheckBoxes }) => {
  const { triggerSuccessMessage, triggerErrorMessage } = useAlert()
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState([])

  useEffect(() => {
    const fetchExercises = async () => {

      // Fetch program details and set the selected exercises
      const programData = await programService.getById(programId)
      console.log(programData)
      // Check if programData.exercises exists before mapping over it
      const programExerciseIds = programData.exercises ? programData.exercises.map(ex => ex.apiId) : []
      setSelectedExercises(programExerciseIds)

      const exerciseData = await exerciseService.getExercisesFromCategory(categoryId)
      setExercises(exerciseData.results)
      setLoading(false)
    }

    fetchExercises()
  }, [categoryId, programId, updateCheckBoxes])

  const handleCheckboxChange = async (exerciseId, isChecked) => {
    try {
      if (isChecked) {
        // If the exercise is already checked (meaning it's getting unchecked), remove it
        await removeExerciseFromProgram(exerciseId)
        triggerSuccessMessage('Exercise removed successfully!')
      } else {
        // If the exercise is not checked (meaning it's getting checked), add it
        await addExerciseToProgram(exerciseId)
        triggerSuccessMessage('Exercise added successfully!')
      }

      // Update the program's exercises in ProgramDetails
      updateExercisesInProgram()
    } catch (error) {
      triggerErrorMessage('Failed to update program')
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

  }

  if (loading) {
    return <div>Loading exercises...</div>
  }

  return (
    <div>
      <ul>
        {exercises.map((exercise) => (
          <List key={exercise.id}>
            <Box display="flex" alignItems="center" mb={2}>
              <Checkbox
                checked={selectedExercises.includes(exercise.id.toString())}
                onChange={() => handleCheckboxChange(exercise.id, selectedExercises.includes(exercise.id.toString()))}
              />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {exercise.exercises[0].name}
              </Typography>
              
            </Box>
            <Box ml={25} mt={0.10}>
              <MoreInfoPopUp exercise={exercise}/>
            </Box>
            <br />
          </List>
        ))}
      </ul>
    </div>
  )
}

export default ExerciseList
