import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import programs from '../../services/programs'

const ProtectedRoute = ({ children }) => {
  const { user } = useUser()
  const [tokenSet, setTokenSet] = useState(false)

  useEffect(() => {
    if(user) {
      programs.setToken(user.token)
      setTokenSet(true)
    }
  }, [user])

  if (!user) {
    // Redirect to login page if no user is found
    return <Navigate to="/login" />
  }

  // If the token is not yet set, show a loading screen
  if (!tokenSet) {
    return <>  </>
  }

  // If the user is logged in, render the child components (protected content)
  return children
}

export default ProtectedRoute
