import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export default client
