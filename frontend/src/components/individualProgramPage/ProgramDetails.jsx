import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import programService from '../../services/programs'
import { Container, Typography, CircularProgress, Box, Alert } from '@mui/material'

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
    <Container>
      {error ? (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Typography variant="h4" component="h2" gutterBottom>
        {program.programName}
      </Typography>
      <Box>
        <Typography variant="h6">Exercises:</Typography>
        {program.exercises.map((exercise, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="h6">{exercise.name}</Typography>
            {exercise.sets.map((set, setIndex) => (
              <Typography key={setIndex} variant="body1">
                Set {set.setNumber}: {set.reps} reps @ {set.weight} kg
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Container>
  )
}

export default ProgramDetails
