import ProgramDetails from './components/individualProgramPage/ProgramDetails'
import ProgramList from './components/myprogramsPage/ProgramList'
import NavBar from './components/navbar/NavBar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TopAlert from './components/generalComponents/TopAlert'
import { AlertProvider } from './context/AlertContext'
const App = () => {
  return (
    <AlertProvider>
      <Router>
        <NavBar />
        <TopAlert />
        <Routes>
          <Route path="/" element={<ProgramList />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
        </Routes>
      </Router>
    </AlertProvider>
  )
}

export default App
