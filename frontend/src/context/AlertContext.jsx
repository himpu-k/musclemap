import { createContext, useContext, useState } from 'react'

// Create the context
const AlertContext = createContext()

// Custom hook to use the AlertContext
export const useAlert = () => useContext(AlertContext)

// The provider component that wraps the application
export const AlertProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Clear the messages after a timeout
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage(null)
      setErrorMessage(null)
    }, 5000)
  }

  const triggerSuccessMessage = (message) => {
    setSuccessMessage(message)
    clearMessages()
  }

  const triggerErrorMessage = (message) => {
    setErrorMessage(message)
    clearMessages()
  }

  return (
    <AlertContext.Provider
      value={{ successMessage, errorMessage, triggerSuccessMessage, triggerErrorMessage }}
    >
      {children}
    </AlertContext.Provider>
  )
}
