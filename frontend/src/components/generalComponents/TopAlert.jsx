import React, { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useAlert } from '../../context/AlertContext'

const TopAlert = () => {
  const { successMessage, errorMessage } = useAlert()
  const [open, setOpen] = useState(false)
  const [alertType, setAlertType] = useState('success') // Keep track of alert type

  useEffect(() => {
    if (successMessage) {
      setAlertType('success')
      setOpen(true) // Open snackbar for success
    } else if (errorMessage) {
      setAlertType('error')
      setOpen(true) // Open snackbar for error
    }
  }, [successMessage, errorMessage])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <>
      {/* Success Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioning at the top
      >
        <Alert
          onClose={handleClose}
          severity={alertType} // Dynamic severity based on the message type
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertType === 'success' ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default TopAlert
