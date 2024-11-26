import React, { useState } from 'react'
import { TextField, Typography, Container, Box, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../context/AlertContext'
import programs from '../../services/programs'
import users from '../../services/users'
import login from '../../services/login'
import { useUser } from '../../context/UserContext'
import OrangeButton from '../generalComponents/OrangeButton'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { triggerErrorMessage, triggerSuccessMessage } = useAlert()
  const navigate = useNavigate()
  const { loginUser } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      // Register the user
      await users.save({ email, password })

      // Automatically log the user in after sign-up
      const user = await login({ email, password })
      loginUser(user)

      // Trigger success message
      triggerSuccessMessage(`Welcome ${user.email}!`)

      // Redirect to the homepage
      navigate('/')
    } catch (exception) {
      console.error('Sign up failed:', exception)
      triggerErrorMessage('Failed to sign up')
    }
  }

  return (
    <Container maxWidth="xs">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Sign Up for MuscleMap
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <OrangeButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            Sign up
          </OrangeButton>
        </form>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link href="/login" underline="hover" sx={{ color: '#E46225', '&:hover': {color: '#E46225'}}}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}

export default SignUp
