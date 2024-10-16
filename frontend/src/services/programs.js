import axios from 'axios'
const baseUrl = '/api/programs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Get all programs for the user
const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.get(baseUrl, config)
  const response = await request
  return response.data
}

// Get program details by id
const getById = async id => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.get(`${baseUrl}/${id}`, config)
  const response = await request
  return response.data
}

// Create new program for the user
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// Update program
const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  const response = await request
  return response.data
}

// Delete program
const remove = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, getById, create, setToken, update, remove }
