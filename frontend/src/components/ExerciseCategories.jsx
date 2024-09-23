import { useEffect, useState } from 'react'
import exerciseService from '../services/exerciseService'
import ExerciseList from './ExerciseList'

const ExerciseCategories = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const fetchCategories = async () =>   {
      exerciseService.getAllCategories().then((response) => setCategories(response.results))
    }

    fetchCategories()
  }, [])

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId) // Set the selected category ID
  }

  return (
    <div>
      <h2>Exercise Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} >
            <button onClick={() => handleCategorySelect(category.id)}>{category.name}</button>

          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div>
          <h3>Exercises in Selected Category</h3>
          <ExerciseList categoryId={selectedCategory} /> {/* Pass selected category ID to ExerciseList */}
        </div>
      )}
    </div>
  )
}

export default ExerciseCategories
