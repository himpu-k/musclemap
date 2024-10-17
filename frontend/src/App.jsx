import React from 'react'
import ProgramDetails from './components/individualProgramPage/ProgramDetails'
import ProgramList from './components/myprogramsPage/ProgramList'
import NavBar from './components/navbar/NavBar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TopAlert from './components/generalComponents/TopAlert'
import { AlertProvider } from './context/AlertContext'
import Login from './components/loginAndSignUp/Login'
import SignUp from './components/loginAndSignUp/SignUp'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/generalComponents/ProtectedRoute'

const App = () => {
  return (
    <UserProvider>
      <AlertProvider>
        <Router>
          <NavBar />
          <TopAlert />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProgramList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programs/:id"
              element={
                <ProtectedRoute>
                  <ProgramDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AlertProvider>
    </UserProvider>
  )
}

export default App
