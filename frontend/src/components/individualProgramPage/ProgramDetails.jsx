import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import programService from '../../services/programs'
import { Container, Typography, CircularProgress, Box, TextField, IconButton, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ExerciseCategories from '../exercises/ExerciseCategories'
import { useAlert } from '../../context/AlertContext'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import OrangeButton from '../generalComponents/OrangeButton'

const ProgramDetails = () => {
  const { triggerErrorMessage, triggerSuccessMessage } = useAlert()
  const { id } = useParams() // Get the program ID from the URL params
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedSetIndex, setSavedSetIndex] = useState(null) // State to track saved sets
  const [editMode, setEditMode] = useState(false) // Track whether we're editing the program name
  const [editProgram, setEditProgram] = useState(false) // Track whether we're editing the program name
  const [newProgramName, setNewProgramName] = useState('') // Track the new program name while editing
  const [customExerciseName, setCustomExerciseName] = useState('') // Track the name of the new custom exercise
  const [showCustomExerciseInput, setShowCustomExerciseInput] = useState(false) // Track whether to show input for custom exercise

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const fetchedProgram = await programService.getById(id)
        setProgram(fetchedProgram)
        setNewProgramName(fetchedProgram.programName) // Initialize with the existing program name
        setLoading(false)
      } catch (err) {
        if (err.response && err.response.status === 403) {
          triggerErrorMessage('Access denied. Redirecting to home-page.')
          navigate('/') // Redirect to home if forbidden
        } else {
          triggerErrorMessage('Failed to fetch program details')
        }
        setLoading(false)
      }
    }

    fetchProgram()
  }, [id, triggerErrorMessage, navigate])

  // Callback to update the exercises in the program state
  const updateExercisesInProgram = async () => {
    try {
      const updatedProgram = await programService.getById(id)
      setProgram(updatedProgram) // Update program exercises
    } catch (error) {
      console.error('Failed to update program exercises:', error)
    }
  }

  // Save the new program name
  const handleSaveProgramName = async () => {
    try {
      const updatedProgram = {
        ...program,
        programName: newProgramName,
      }
      await programService.update(id, updatedProgram)
      setProgram(updatedProgram) // Update local state with the new name
      setEditMode(false) // Exit edit mode
      triggerSuccessMessage('Program name updated successfully!')
    } catch (error) {
      triggerErrorMessage('Failed to update program name.')
    }
  }

  // Handle adding a custom exercise
  const handleAddCustomExercise = async () => {
    if (!customExerciseName.trim()) {
      triggerErrorMessage('Exercise name cannot be empty')
      return
    }

    const newExercise = {
      name: customExerciseName,  // Custom exercise without apiId
      sets: [] // New exercise starts with no sets
    }

    // Initialize exercises array if it doesn't exist
    const exercises = program.exercises ? [...program.exercises] : []

    // Add the new exercise to the exercises array
    const updatedProgram = {
      ...program,
      exercises: [...exercises, newExercise]
    }

    // Save the updated program to the backend
    try {
      await programService.update(id, updatedProgram)
      setProgram(updatedProgram)
      setCustomExerciseName('')
      setShowCustomExerciseInput(false)
      triggerSuccessMessage('Custom exercise added successfully!')
    } catch (error) {
      triggerErrorMessage('Failed to add custom exercise.')
    }
  }

  // Handle saving set changes (triggered on blur)
  const handleSaveSet = async (exerciseIndex, setIndex, updatedSet) => {
    const { weight, reps } = updatedSet

    // Validation: check if weight and reps are numbers
    if (isNaN(weight) || isNaN(reps)) {
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

  //show only program
  if (!editProgram) {
    return (
      <div style={{ marginLeft: 4, marginTop:2 }}>
        {program ? (
          <>
            <Box display="flex" alignItems="center"  sx={{ marginBottom: 2, marginTop: 2 }}>
              {editMode ? (
                <>
                  <TextField
                    label="Program Name"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <IconButton onClick={handleSaveProgramName}>
                    <CheckCircleIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {program.programName}
                  </Typography>
                  <IconButton onClick={() => setEditMode(true)} sx={{ marginLeft: 2 }}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Box>
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
                          value={set.weight || ''}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onChange={(e) => {
                            const updatedExercises = [...program.exercises]
                            updatedExercises[exerciseIndex].sets[setIndex].weight = e.target.value
                            setProgram({ ...program, exercises: updatedExercises })
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
                          value={set.reps || ''}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onChange={(e) => {
                            const updatedExercises = [...program.exercises]
                            updatedExercises[exerciseIndex].sets[setIndex].reps = e.target.value
                            setProgram({ ...program, exercises: updatedExercises })
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
            {/*Button to open the side bar for editing*/}
            {<OrangeButton onClick={() => setEditProgram(true)} variant="contained">
                Edit
            </OrangeButton>}
          </>
        ) : (
          <Typography>Program not found.</Typography>
        )}
      </div>
    )
  }

  //show program editing side bar also
  return (
    <Grid container spacing={2}>
      <Grid classname="exerciseList" size={4}>
        <ExerciseCategories programId={id} updateExercisesInProgram={updateExercisesInProgram} />
      </Grid>
      <Grid size={8}>
        {program ? (
          <>
            <Box display="flex" alignItems="center"  sx={{ marginBottom: 2, marginTop: 2 }}>
              {editMode ? (
                <>
                  <TextField
                    label="Program Name"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <IconButton onClick={handleSaveProgramName}>
                    <CheckCircleIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {program.programName}
                  </Typography>
                  <IconButton onClick={() => setEditMode(true)} sx={{ marginLeft: 2 }}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Box>
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
                          value={set.weight || ''}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onChange={(e) => {
                            const updatedExercises = [...program.exercises]
                            updatedExercises[exerciseIndex].sets[setIndex].weight = e.target.value
                            setProgram({ ...program, exercises: updatedExercises })
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
                          value={set.reps || ''}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onChange={(e) => {
                            const updatedExercises = [...program.exercises]
                            updatedExercises[exerciseIndex].sets[setIndex].reps = e.target.value
                            setProgram({ ...program, exercises: updatedExercises })
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

              {/* Button to toggle adding custom exercise */}
              {!showCustomExerciseInput && (
                <Button onClick={() => setShowCustomExerciseInput(true)} variant="outlined" sx={{ marginTop: 2 }}>
                  Add Custom Exercise
                </Button>
              )}

              {/* Input and button to add a new custom exercise */}
              {showCustomExerciseInput && (
                <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                  <TextField
                    label="Custom Exercise Name"
                    value={customExerciseName}
                    onChange={(e) => setCustomExerciseName(e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <Button onClick={handleAddCustomExercise} variant="contained">
                    Add Exercise
                  </Button>
                </Box>
              )}
            </Box>
            {/*Button to open the side bar for editing*/}
            {<OrangeButton onClick={() => setEditProgram(false)} variant="contained">
                Done
            </OrangeButton>}
          </>
        ) : (
          <Typography>Program not found.</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default ProgramDetails
