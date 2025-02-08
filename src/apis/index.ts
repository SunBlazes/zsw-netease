import axios from "axios"

const request = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
})

request.defaults.withCredentials = true

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use((config) => {
  return config
})

export default request
