import ExerciseCategories from './components/exercises/ExerciseCategories'
import ProgramDetails from './components/individualProgramPage/ProgramDetails'
import ProgramList from './components/myprogramsPage/ProgramList'
import NavBar from './components/navbar/NavBar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<ProgramList />} />
          <Route path="/exercises" element={<ExerciseCategories />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
