import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userId = computed(() => user.value?.id)

  function setTokens(tokens) {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  async function register(userData) {
    const response = await authService.register(userData)
    if (response.success && response.data.tokens) {
      setTokens(response.data.tokens)
      setUser(response.data.user)
    }
    return response
  }

  async function login(credentials) {
    const response = await authService.login(credentials)
    if (response.success && response.data.tokens) {
      setTokens(response.data.tokens)
      setUser(response.data.user)
    }
    return response
  }

  async function logout() {
    try {
      if (refreshToken.value) {
        await authService.logout(refreshToken.value)
      }
    } finally {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  async function refreshTokens() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }
    
    const response = await authService.refreshToken(refreshToken.value)
    if (response.success && response.data.tokens) {
      setTokens(response.data.tokens)
      return response.data.tokens
    }
    throw new Error('Failed to refresh token')
  }

  function checkTokenExpiry() {
    if (!accessToken.value) return false

    try {
      const decoded = jwtDecode(accessToken.value)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch {
      return false
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isAdmin,
    userId,
    register,
    login,
    logout,
    refreshTokens,
    checkTokenExpiry,
    setTokens,
    setUser
  }
})
