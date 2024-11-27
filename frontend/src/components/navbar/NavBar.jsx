import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Tooltip, Menu, MenuItem } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { useNavigate, useLocation } from 'react-router-dom' // Import useLocation for route info
import programs from '../../services/programs'
import { useAlert } from '../../context/AlertContext'
import { useUser } from '../../context/UserContext'

const NavBar = () => {
  const { triggerErrorMessage, triggerSuccessMessage } = useAlert()
  const navigate = useNavigate()
  const location = useLocation() // Hook to access the current URL
  const { user, logoutUser } = useUser()

  // Extract the program ID from the URL if present
  const pathParts = location.pathname.split('/')
  const id = pathParts.length === 3 && pathParts[1] === 'programs' ? pathParts[2] : null

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleCreateNewClick = async() => {
    try {
      await programs.create({ programName: 'My program' })
      navigate('/')
      triggerSuccessMessage('New program created successfully!')
    } catch (error) {
      triggerErrorMessage('Failed to create a new program.')
    }
  }

  const handleCopyProgram = async () => {
    try {
    // Fetch the current program by its ID
      const currentProgram = await programs.getById(id)

      // Create a new program object that copies the exercises and sets from the current one
      const newProgram = {
        programName: `Copy of ${currentProgram.programName}`,
        exercises: currentProgram.exercises ? currentProgram.exercises.map((exercise) => ({
          apiId: exercise.apiId, // Copy the exercise ID (if it's from an external API)
          name: exercise.name || '',   // Copy the custom exercise name if applicable
          sets: exercise.sets ? exercise.sets.map((set) => ({
            setNumber: set.setNumber,
            reps: set.reps,
            weight: set.weight
          })) : []
        })): []
      }
      // Send the new program data to the backend
      const copiedProgram = await programs.create(newProgram)

      console.log(copiedProgram)

      // Notify the user and refresh the page after copying
      triggerSuccessMessage('Program copied successfully!')
      navigate(`/programs/${copiedProgram.id}`)
    } catch (error) {
      triggerErrorMessage('Failed to copy the program.')
    }
  }

  const handleBackToFrontpage = () => {
    navigate('/')
  }

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAccountMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    window.localStorage.removeItem('loggedInUser')
    logoutUser()
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#efa37f' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FitnessCenterIcon onClick={handleBackToFrontpage} sx={{ fontSize: 40, marginRight: 3, cursor: 'pointer' }} />
              <Typography onClick={handleBackToFrontpage} variant="h6" component="div" sx={{ flexGrow: 1, marginRight: 3, cursor: 'pointer' }}>
                My programs
              </Typography>
              <Button onClick={handleCreateNewClick} variant="contained" sx={{ color: '#efa37f', backgroundColor: 'white', ':hover': { backgroundColor: 'lightgray' } }}>
                New
              </Button>
              {id && (
                <Button onClick={handleCopyProgram} variant="contained" sx={{ marginLeft: 2, color: '#efa37f', backgroundColor: 'white', ':hover': { backgroundColor: 'lightgray' } }}>
                  Copy Program
                </Button>
              )}
            </Box>

            <Tooltip title="Account options">
              <IconButton color="inherit" onClick={handleAccountMenuClick}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleAccountMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </Menu>
          </>
        ) : (
          <FitnessCenterIcon onClick={() => navigate('/login')} sx={{ fontSize: 40, marginRight: 3, cursor: 'pointer' }} />
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
