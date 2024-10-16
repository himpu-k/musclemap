import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import programService from '../../services/programs'
import { Container, Typography, CircularProgress, Box, TextField, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ExerciseCategories from '../exercises/ExerciseCategories'
import { useAlert } from '../../context/AlertContext'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'

const ProgramDetails = () => {
  const { triggerErrorMessage } = useAlert()
  const { id } = useParams() // Get the program ID from the URL params
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedSetIndex, setSavedSetIndex] = useState(null) // State to track saved sets

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const fetchedProgram = await programService.getById(id)
        setProgram(fetchedProgram)
        setLoading(false)
      } catch (err) {
        triggerErrorMessage('Failed to fetch program details')
        setLoading(false)
      }
    }

    fetchProgram()
  }, [id, triggerErrorMessage])

  // Callback to update the exercises in the program state
  const updateExercisesInProgram = async () => {
    try {
      const updatedProgram = await programService.getById(id)
      setProgram(updatedProgram) // Update program exercises
    } catch (error) {
      console.error('Failed to update program exercises:', error)
    }
  }

  // Handle saving set changes (triggered on blur)
  const handleSaveSet = async (exerciseIndex, setIndex, updatedSet) => {
    const { weight, reps } = updatedSet

    // Validation: check if weight and reps are numbers
    if (isNaN(weight) || isNaN(reps) || weight === '' || reps === '') {
      triggerErrorMessage('Weights and reps must be valid numbers.')
      return
    }
    try {
      const updatedExercises = [...program.exercises]
      updatedExercises[exerciseIndex].sets[setIndex] = updatedSet

      const updatedProgram = {
        exercises: updatedExercises,
      }

      await programService.update(id, updatedProgram)

      // Mark set as saved for feedback
      setSavedSetIndex({ exerciseIndex, setIndex })

      // Hide the checkmark after 2 seconds
      setTimeout(() => {
        setSavedSetIndex(null)
      }, 2000)
    } catch (error) {
      triggerErrorMessage('Failed to save set.')
    }
  }

  // Handle adding a new set to an exercise
  const handleAddSet = async (exerciseIndex) => {
    const newSet = {
      setNumber: program.exercises[exerciseIndex].sets.length + 1,
      weight: '', // New set starts with empty values
      reps: ''
    }

    // Update the local exercises array
    const updatedExercises = [...program.exercises]
    updatedExercises[exerciseIndex].sets.push(newSet)

    // Update the program locally
    setProgram({ ...program, exercises: updatedExercises })

    // Save the newly added set to the backend
    try {
      const updatedProgram = {
        exercises: updatedExercises
      }
      await programService.update(id, updatedProgram)
    } catch (error) {
      triggerErrorMessage('Failed to save the new set.')
    }
  }

  // Handle removing a set from an exercise
  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...program.exercises]
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1) // Remove the set

    // Update the set numbers
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.map((set, idx) => ({
      ...set,
      setNumber: idx + 1, // Recalculate set numbers
    }))

    setProgram({ ...program, exercises: updatedExercises })

    // Also send an update to the backend
    const updatedProgram = {
      exercises: updatedExercises,
    }

    programService.update(id, updatedProgram)
  }

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Loading program details...
        </Typography>
      </Container>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <ExerciseCategories programId={id} updateExercisesInProgram={updateExercisesInProgram} />
      </Grid>
      <Grid size={8}>
        {program ? (
          <>
            <Typography variant="h4" component="h2" gutterBottom>
              {program.programName}
            </Typography>
            <Box>
              <Typography variant="h6">Exercises:</Typography>
              {program.exercises && program.exercises.length > 0 ? (
                program.exercises.map((exercise, exerciseIndex) => (
                  <Box key={exerciseIndex} sx={{ marginBottom: 2 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>{exercise.name}</Typography>

                    {exercise.sets && exercise.sets.length > 0 && exercise.sets.map((set, setIndex) => (
                      <Box key={setIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                        <Typography>Set {set.setNumber}:</Typography>
                        <TextField
                          label="Weight"
                          variant="outlined"
                          size="small"
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onBlur={(e) => {
                            const updatedSet = { ...set, weight: e.target.value }
                            handleSaveSet(exerciseIndex, setIndex, updatedSet)
                          }}
                          sx={{ width: 80 }}
                        />
                        <TextField
                          label="Reps"
                          variant="outlined"
                          size="small"
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onBlur={(e) => {
                            const updatedSet = { ...set, reps: e.target.value }
                            handleSaveSet(exerciseIndex, setIndex, updatedSet)
                          }}
                          sx={{ width: 80 }}
                        />

                        {/* Button to remove set */}
                        <IconButton onClick={() => handleRemoveSet(exerciseIndex, setIndex)}>
                          <DeleteIcon/>
                        </IconButton>

                        {/* Show checkmark if set was saved */}
                        {savedSetIndex?.exerciseIndex === exerciseIndex && savedSetIndex?.setIndex === setIndex && (
                          <CheckCircleIcon color="success" />
                        )}
                      </Box>
                    ))}

                    {/* Button to add a new set */}
                    <IconButton onClick={() => handleAddSet(exerciseIndex)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography>No exercises found for this program.</Typography>
              )}
            </Box>
          </>
        ) : (
          <Typography>Program not found.</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default ProgramDetails
