import React, { useEffect, useState } from 'react'
import programsService from '../services/programs'
import { Container, Typography, Card, CardContent, CircularProgress, List, ListItem, Alert } from '@mui/material'

const ProgramList = () => {
  const [programs, setPrograms] = useState([]) // State to hold the fetched programs
  const [loading, setLoading] = useState(true) // State to show loading status
  const [error, setError] = useState(null) // State to handle error

  // Fetch the programs when the component mounts
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await programsService.getAll()
        setPrograms(fetchedPrograms)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch programs')
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Loading programs...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Your Programs
      </Typography>

      {programs.length === 0 ? (
        <Alert severity="info">No programs found.</Alert>
      ) : (
        <List>
          {programs.map((program) => (
            <ListItem key={program._id} sx={{ marginBottom: 2 }}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {program.programName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Number of Exercises: {program.exercises.length}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}

export default ProgramList
