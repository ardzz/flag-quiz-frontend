import api from './api'

export const userService = {
  async getProfile() {
    return await api.get('/users/profile')
  },

  async updateProfile(data) {
    return await api.put('/users/profile', data)
  },

  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('photo', file)

    return await api.post('/users/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  async getUser(id) {
    return await api.get(`/users/${id}`)
  },

  async getUserStats(id) {
    return await api.get(`/users/${id}/stats`)
  }
}
