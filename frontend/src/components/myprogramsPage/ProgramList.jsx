import React, { useEffect, useState } from 'react'
import programsService from '../../services/programs'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  Alert,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LabelIcon from '@mui/icons-material/Label'

import { useIsMobile, useIsDesktop } from '../../utils/mediaQueries'

const ProgramList = () => {
  const [programs, setPrograms] = useState([]) // State to hold the fetched programs
  const [loading, setLoading] = useState(true) // State to show loading status
  const [error, setError] = useState(null) // State to handle error

  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()

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

  const handleProgramClick = (props) => {
    const hrefWithId = '/programs/' + props
    window.location.href = hrefWithId
  }

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
    <Container
      sx={{
        marginTop: 4,
        width: '100%',
        padding: isMobile ? '0 10px' : '0 24px',
      }}
    >
      {programs.length === 0 ? (
        <Typography variant="body1"  sx={{
          fontSize: isMobile ? '0.875rem' : '1rem',
        }}>No programs found</Typography>
      ) : (
        <List
          sx={{
            maxWidth: isMobile ? '100%' : '75%',
            margin: '0 auto',
          }}
        >
          {programs.map((program) => (
            <ListItem key={program._id} sx={{ marginBottom: isMobile ? 0.2 : 2, cursor:'pointer' }} onClick={() => handleProgramClick(program.id)}>
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isMobile ? 1 : 2,
                  backgroundColor: '#ebf5ff',
                  borderRadius: '12px'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" sx={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                  }}>
                    {program.programName}
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="View program">
                    <IconButton aria-label="view">
                      <LabelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete program">
                    <IconButton aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit program">
                    <IconButton aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}

export default ProgramList
