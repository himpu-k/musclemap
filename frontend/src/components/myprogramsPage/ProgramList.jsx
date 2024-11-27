import React, { useEffect, useState } from 'react'
import programsService from '../../services/programs'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  IconButton,
  Box,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LabelIcon from '@mui/icons-material/Label'

import { useIsMobile } from '../../utils/mediaQueries'
import { useAlert } from '../../context/AlertContext'

const ProgramList = () => {
  const { triggerSuccessMessage, triggerErrorMessage } = useAlert()
  const [programs, setPrograms] = useState([]) // State to hold the fetched programs
  const [loading, setLoading] = useState(true) // State to show loading status
  const [openDialog, setOpenDialog] = useState(false) // State to manage the delete confirmation dialog
  const [programToDelete, setProgramToDelete] = useState(null) // State to track which program is to be deleted

  const navigate = useNavigate()
  const isMobile = useIsMobile()

  // Fetch the programs when the component mounts
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await programsService.getAll()
        setPrograms(fetchedPrograms)
        setLoading(false)
      } catch (err) {
        triggerErrorMessage('Failed to fetch program details')
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [triggerErrorMessage])

  const handleProgramClick = (id, mode) => {
    navigate(`/programs/${id}?mode=${mode}`); // Pass "view" or "edit" as a query parameter
  };

  const handleOpenDialog = (program) => {
    setProgramToDelete(program)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setProgramToDelete(null)
  }

  const handleDeleteProgram = async () => {
    try {
      await programsService.remove(programToDelete.id)
      setPrograms(programs.filter((program) => program.id !== programToDelete.id))
      triggerSuccessMessage(`Program "${programToDelete.programName}" deleted successfully`)
      handleCloseDialog() // Close dialog after successful deletion
    } catch (error) {
      triggerErrorMessage('Failed to delete the program')
      handleCloseDialog()
    }
  }

  if (loading) {
    return (
      <Container>
      <CircularProgress sx={{color:'#e46225', marginTop: 2}}/>
      <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
        Loading programs...
      </Typography>
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
        <Typography
          variant="body1"
          sx={{
            fontSize: isMobile ? '0.875rem' : '1rem',
          }}
        >
          No programs found
        </Typography>
      ) : (
        <List
          sx={{
            maxWidth: isMobile ? '100%' : '75%',
            margin: '0 auto',
          }}
        >
          {programs.map((program) => (
            <ListItem key={program.id} sx={{ marginBottom: isMobile ? 0.2 : 2 }}>
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isMobile ? 1 : 2,
                  backgroundColor: '#ebf5ff',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1 }}
                  onClick={() => handleProgramClick(program.id, "view")}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontSize: isMobile ? '1rem' : '1.25rem',
                    }}
                  >
                    {program.programName}
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="View program">
                    <IconButton aria-label="view" onClick={() => handleProgramClick(program.id, "view")}>
                      <LabelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete program">
                    <IconButton aria-label="delete" onClick={() => handleOpenDialog(program)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit program">
                    <IconButton aria-label="edit" onClick={() => handleProgramClick(program.id, "edit")}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </ListItem>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Program</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the program{' '}
            <strong>{programToDelete?.programName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteProgram} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProgramList
