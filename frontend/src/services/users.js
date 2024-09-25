import axios from 'axios'
const baseUrl = '/api/users'

// Save a new user
const save = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { save }
