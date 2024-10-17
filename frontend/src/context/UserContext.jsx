import React, { createContext, useState, useContext } from 'react'
import programs from '../services/programs'

// Create a context for the user
const UserContext = createContext()

// Export a custom hook to use the context
export const useUser = () => {
  return useContext(UserContext)
}

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('loggedInUser')) || null)

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
