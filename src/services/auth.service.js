import api from './api'

export const authService = {
  async register(userData) {
    return await api.post('/auth/register', userData)
  },

  async login(credentials) {
    // Handle both username and email login
    // If identifier contains @, treat as email, otherwise as username
    const loginData = { ...credentials }
    if (loginData.identifier) {
      if (loginData.identifier.includes('@')) {
        loginData.email = loginData.identifier
      } else {
        loginData.username = loginData.identifier
      }
      delete loginData.identifier
    }
    return await api.post('/auth/login', loginData)
  },

  async logout(refreshToken) {
    return await api.post('/auth/logout', { refreshToken })
  },

  async refreshToken(refreshToken) {
    return await api.post('/auth/refresh-token', { refreshToken })
  },

  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token, password) {
    return await api.post('/auth/reset-password', { token, password })
  },

  async verifyEmail(token) {
    return await api.get(`/auth/verify-email/${token}`)
  }
}
