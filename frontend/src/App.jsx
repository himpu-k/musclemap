import ProgramDetails from './components/individualProgramPage/ProgramDetails'
import ProgramList from './components/myprogramsPage/ProgramList'
import NavBar from './components/navbar/NavBar'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import TopAlert from './components/generalComponents/TopAlert'
import { AlertProvider } from './context/AlertContext'
import Login from './components/loginAndSignUp/Login'
import SignUp from './components/loginAndSignUp/SignUp'
import programs from './services/programs'
import { useEffect, useState } from 'react'

const App = () => {
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      programs.setToken(user.token)
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
    setTokenLoaded(true)
  }, [])

  if (!tokenLoaded) {
    return <div>Loading...</div>
  }

  return (
    <AlertProvider>
      <Router>
        <TopAlert />
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/" element={isLoggedIn ? <><NavBar setIsLoggedIn={setIsLoggedIn} /><ProgramList /></> : <Navigate to="/login" />} />
          <Route path="/programs/:id" element={isLoggedIn ? <><NavBar setIsLoggedIn={setIsLoggedIn} /><ProgramDetails /></> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </AlertProvider>
  )
}

export default App
