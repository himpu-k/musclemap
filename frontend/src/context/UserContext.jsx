import React, { createContext, useState, useContext, useEffect } from 'react'
import programs from '../services/programs'
import { jwtDecode } from 'jwt-decode'
import history from '../history' // Import custom history object

// Create a context for the user
const UserContext = createContext()

// Export a custom hook to use the context
export const useUser = () => {
  return useContext(UserContext)
}

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('loggedInUser')) || null)

  const checkTokenExpiration = () => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      const { token } = loggedInUser
      const { exp } = jwtDecode(token)
      const expirationTime = exp * 1000

      if (Date.now() >= expirationTime) {
        logoutUser()
        history.push('/login')
      } else {
        programs.setToken(token)
        setUser(loggedInUser)
      }
    }
  }

  useEffect(() => {
    checkTokenExpiration()
  }, [])

  const loginUser = (userData) => {
    // Save user data to localStorage
    window.localStorage.setItem('loggedInUser', JSON.stringify(userData))
    programs.setToken(userData.token)
    setUser(userData)
  }

  const logoutUser = () => {
    // Clear user data from localStorage
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  )
}
