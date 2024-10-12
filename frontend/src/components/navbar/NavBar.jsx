import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Tooltip } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

const handleCreateNewClick = () => {
  window.location.href = '/exercises'
}

const handleBackToFrontpage = () => {
  window.location.href = '/'
}

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#efa37f' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenterIcon onClick={() => handleBackToFrontpage()} sx={{ fontSize: 40, marginRight: 3, cursor:'pointer' }} />
          <Typography onClick={() => handleBackToFrontpage()} variant="h6" component="div" sx={{ flexGrow: 1, marginRight: 3, cursor:'pointer' }}>
            My programs
          </Typography>
          <Button onClick={() => handleCreateNewClick()} variant="contained" sx={{ color: '#efa37f', backgroundColor: 'white', ':hover': { backgroundColor: 'lightgray' } }}>New</Button>
        </Box>
        <Tooltip title="Logged in">
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
