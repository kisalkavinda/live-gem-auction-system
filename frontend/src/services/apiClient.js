import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',

  headers: {
    'Content-Type': 'application/json',
  },
})

// -----------------------------------------
// ATTACH JWT TOKEN TO EVERY REQUEST
// -----------------------------------------

apiClient.interceptors.request.use(
  config => {
    const token =
      localStorage.getItem('token')

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },

  error => {
    return Promise.reject(error)
  }
)

// -----------------------------------------
// HANDLE UNAUTHORIZED RESPONSE
// -----------------------------------------

apiClient.interceptors.response.use(
  response => response,

  error => {
    if (
      error.response?.status === 401
    ) {
      console.warn(
        'Authentication required.'
      )
    }

    return Promise.reject(error)
  }
)

export default apiClient