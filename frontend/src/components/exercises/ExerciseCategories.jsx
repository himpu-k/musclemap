import { useEffect, useState } from 'react'
import exerciseService from '../../services/exercises'
import ExerciseList from './ExerciseList'

const ExerciseCategories = ( { programId }) => {
  const [categories, setCategories] = useState([]) // Ensure the initial value is an empty array
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true) // Add a loading state
  const [error, setError] = useState(null) // Add an error state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await exerciseService.getAllCategories()
        if (response?.results) {
          setCategories(response.results)
        } else {
          setCategories([])
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setError('Failed to load categories.')
        setLoading(false)
      }
    }

    fetchCategories()
  }, []) // This useEffect will run once when the component is mounted

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId) // Set the selected category ID
  }

  // If loading, show a loading message or spinner
  if (loading) {
    return <div>Loading exercise categories...</div>
  }

  // If there's an error, show an error message
  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h2>Exercise categories in a list</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <button onClick={() => handleCategorySelect(category.id)}>{category.name}</button>
          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div>
          <h3>Exercises in Selected Category</h3>
          <ExerciseList categoryId={selectedCategory} programId={programId} />
        </div>
      )}
    </div>
  )
}

export default ExerciseCategories
