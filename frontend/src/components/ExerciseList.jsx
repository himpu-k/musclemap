import { useState, useEffect } from 'react'
import exerciseService from '../services/exerciseService'

const ExerciseList = ({ categoryId }) => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      const exerciseData = await exerciseService.getExercisesFromCategory(categoryId)
      setExercises(exerciseData.results)
      setLoading(false)
    }

    fetchExercises()
  }, [categoryId])

  if (loading) {
    return <div>Loading exercises...</div>
  }

  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <h4>{exercise.exercises[0].name}</h4>
          <p>Equipment: {exercise.equipment.map((equip) => equip.name).join(', ')}</p>

          {/* Display images if available */}
          {exercise.images.length > 0 ? (
            <div>
              <h5>Images:</h5>

              <img
                src={exercise.images[0].image}
                alt={`Exercise ${exercise.exercises[0].name}`}
                width="150"
                style={{ marginRight: '10px' }}
              />

            </div>
          ) : (
            <p>No images available</p>
          )}
          {/* Display only the first video if available */}
          {exercise.videos.length > 0 ? (
            <div>
              <h5>Video:</h5>
              <video width="320" height="240" controls>
                <source src={exercise.videos[0].video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <p>No video available</p>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ExerciseList
