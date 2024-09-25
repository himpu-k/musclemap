import axios from 'axios'
const baseUrl = 'api/exercises'
const getAllCategories = async () => {
  const request = axios.get(`${baseUrl}/exercisecategory`)
  const response = await request
  console.log(response.data)
  return response.data
}

const getExercisesFromCategory = async ( categoryId) => {
  const request = axios.get(`${baseUrl}/exercisebaseinfo/category/${categoryId}`)
  const response = await request
  console.log(response.data)
  return response.data
}

export default { getAllCategories, getExercisesFromCategory }
