import React, { useState } from 'react'
import { TextField, Typography, Container, Box, Link } from '@mui/material'
import { useAlert } from '../../context/AlertContext'
import login from '../../services/login'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import OrangeButton from '../generalComponents/OrangeButton'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { triggerErrorMessage, triggerSuccessMessage } = useAlert()
  const navigate = useNavigate()
  const { loginUser } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await login({ email, password })

      // Update the user in the context
      loginUser(user)

      // Trigger success message
      triggerSuccessMessage(`Welcome ${user.email}`)

      // Navigate to the home page
      navigate('/')
    } catch (exception) {
      triggerErrorMessage('Wrong credentials')
    }
  }

  return (
    <Container maxWidth="xs">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" gutterBottom>Welcome to MuscleMap</Typography>
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
          <OrangeButton type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign in
          </OrangeButton>
        </form>
        <Typography variant="body2">
          Do not have an account yet?{' '}
          <Link href="/signup" underline="hover" sx={{ color: '#E46225', '&:hover': {color: '#E46225'}}}>Sign up</Link>
        </Typography>
      </Box>
    </Container>
  )
}

export default Login
