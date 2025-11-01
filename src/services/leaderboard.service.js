import api from './api'

export const leaderboardService = {
  async getDaily(params) {
    return await api.get('/leaderboard/daily', { params })
  },

  async getWeekly(params) {
    return await api.get('/leaderboard/weekly', { params })
  },

  async getMonthly(params) {
    return await api.get('/leaderboard/monthly', { params })
  },

  async getAllTime(params) {
    return await api.get('/leaderboard/all-time', { params })
  },

  async getUserRank(userId, period) {
    return await api.get(`/leaderboard/user/${userId}/rank`, {
      params: { period }
    })
  }
}
