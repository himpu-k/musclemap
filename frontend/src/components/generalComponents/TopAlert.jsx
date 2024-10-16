import React from 'react'
import { Alert, Container } from '@mui/material'
import { useAlert } from '../../context/AlertContext'

const TopAlert = () => {
  const { successMessage, errorMessage } = useAlert()

  return (
    <Container sx={{
      margin: 2
    }}>
      {/* Display error alert if there's an error */}
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Display success alert if there's a success message */}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}
    </Container>
  )
}

export default TopAlert
