import { createContext, useContext, useState } from 'react'

// Create the context
const AlertContext = createContext()

// Custom hook to use the AlertContext
export const useAlert = () => useContext(AlertContext)

// The provider component that wraps the application
export const AlertProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const triggerSuccessMessage = (message) => {
    setSuccessMessage(message)
  }

  const triggerErrorMessage = (message) => {
    setErrorMessage(message)
  }

  return (
    <AlertContext.Provider
      value={{ successMessage, errorMessage, triggerSuccessMessage, triggerErrorMessage }}
    >
      {children}
    </AlertContext.Provider>
  )
}
