import ExerciseCategories from './components/exercises/ExerciseCategories'
import ProgramList from './components/myprogramsPage/ProgramList'
import NavBar from './components/navbar/NavBar'
const App = () => {
  return (
    <div className="App">
      <NavBar />
      <ProgramList />
      <ExerciseCategories />
    </div>
  )
}

export default App
