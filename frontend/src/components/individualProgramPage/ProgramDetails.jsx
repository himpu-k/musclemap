import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import programService from '../../services/programs'
import { Container, Typography, CircularProgress, Box, Alert } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ExerciseCategories from '../exercises/ExerciseCategories'

const ProgramDetails = () => {
  const { id } = useParams() // Get the program ID from the URL params
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const fetchedProgram = await programService.getById(id)
        setProgram(fetchedProgram)
        setLoading(false)

        console.log(fetchedProgram)
      } catch (err) {
        setError('Failed to fetch program details')
        setLoading(false)
      }
    }

    fetchProgram()
  }, [id])

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
        <ExerciseCategories programId={id}/>
      </Grid>
      <Grid size={8}>
        {error ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        ) : null}

        {program ? (
          <>
            <Typography variant="h4" component="h2" gutterBottom>
              {program.programName}
            </Typography>
            <Box>
              <Typography variant="h6">Exercises:</Typography>
              {/* Add a conditional check for program.exercises */}
              {program.exercises && program.exercises.length > 0 ? (
                program.exercises.map((exercise, index) => (
                  <Box key={index} sx={{ marginBottom: 2 }}>
                    <Typography variant="h6">{exercise.name}</Typography>

                    {exercise.sets && exercise.sets.length > 0 && exercise.sets.map((set, setIndex) => (
                      <Typography key={setIndex} variant="body1">
                        Set {set.setNumber}: {set.reps} reps @ {set.weight} kg
                      </Typography>
                    ))}
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
