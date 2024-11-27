import { useEffect, useState } from 'react'
import exerciseService from '../../services/exercises'
import ExerciseList from './ExerciseList'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Checkbox, Typography, Alert } from '@mui/material'

const ExerciseCategories = ( { programId, updateExercisesInProgram, updateCheckBoxes }) => {
  const [categories, setCategories] = useState([]) // Ensure the initial value is an empty array
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true) // Add a loading state
  const [error, setError] = useState(null) // Add an error state
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  

  const handleCategorySelect = (categoryId, index) => {
    setSelectedCategory(categoryId) // Set the selected category ID
    setSelectedIndex(index) // Set the selected category index so that it is highlighted.
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
      <h3 style={{ paddingLeft: '1vw' }}>Choose muscle group</h3>
      <Box alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ ml: 1 }}>
          {categories.map((category, index) => (
                <List key={category.id}>
                  <ListItemButton className={`category-item ${selectedIndex === index ? 'selected' : ''}`} onClick={() => handleCategorySelect(category.id, index)} 
                    sx={{ 
                        cursor: 'pointer',
                        py: 0,
                        backgroundColor: selectedIndex === index ? '#ffcc99' : 'transparent', 
                        fontWeight: selectedIndex === index ? 'bold' : 'normal', 
                        '&:hover': {
                          backgroundColor: selectedIndex === index ? '#ffcc99' : '#ffe0b3', 
                         },
                         }}>
                    {category.name} 
                         
                  </ListItemButton> 
                  <Divider/>
                </List>
          ))}
        </Typography>
      </Box>
      

      {selectedCategory && (
        <div>
          <h3 style={{ paddingLeft: '1vw' }}>Choose your exercises</h3>
          <ExerciseList categoryId={selectedCategory} programId={programId} updateExercisesInProgram={updateExercisesInProgram} updateCheckBoxes={updateCheckBoxes} />
        </div>
      )}
    </div>
  )
}

export default ExerciseCategories
