import api from './api'

export const adminService = {
  // Statistics
  async getStatistics() {
    return await api.get('/admin/statistics')
  },

  // User Management
  async getUsers(params = {}) {
    return await api.get('/admin/users', { params })
  },

  async updateUserRole(userId, role) {
    return await api.put(`/admin/users/${userId}/role`, { role })
  },

  async deleteUser(userId) {
    return await api.delete(`/admin/users/${userId}`)
  },

  // Country Management
  async importCountries() {
    return await api.post('/admin/countries/import')
  },

  async updateCountry(countryId, data) {
    return await api.put(`/admin/countries/${countryId}`, data)
  },

  async deactivateCountry(countryId) {
    return await api.delete(`/admin/countries/${countryId}`)
  },

  async getCountries(params = {}) {
    return await api.get('/countries', { params })
  },

  // Audit Logs
  async getAuditLogs(params = {}) {
    return await api.get('/admin/audit-logs', { params })
  }
}
