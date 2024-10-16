import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Tooltip, Menu, MenuItem } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { useNavigate } from 'react-router-dom'
import programs from '../../services/programs'
import { useAlert } from '../../context/AlertContext'

const NavBar = ({ setIsLoggedIn }) => {
  const { triggerErrorMessage, triggerSuccessMessage } = useAlert()
  const navigate = useNavigate()

  // State to manage the account menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleCreateNewClick = async() => {
    try {
    // Create a new program with the name "My program"
      await programs.create({ programName: 'My program' })
      // Show success message
      triggerSuccessMessage('New program created successfully!')

    } catch (error) {
      console.error('Failed to create a new program:', error)
      triggerErrorMessage('Failed to create a new program.')
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
    // Clear any stored authentication data
    window.localStorage.removeItem('loggedInUser')
    setIsLoggedIn(false)
    // Redirect to login page
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#efa37f' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenterIcon onClick={handleBackToFrontpage} sx={{ fontSize: 40, marginRight: 3, cursor: 'pointer' }} />
          <Typography onClick={handleBackToFrontpage} variant="h6" component="div" sx={{ flexGrow: 1, marginRight: 3, cursor: 'pointer' }}>
            My programs
          </Typography>
          <Button onClick={handleCreateNewClick} variant="contained" sx={{ color: '#efa37f', backgroundColor: 'white', ':hover': { backgroundColor: 'lightgray' } }}>
            New
          </Button>
        </Box>

        {/* Account Circle with Menu */}
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
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
