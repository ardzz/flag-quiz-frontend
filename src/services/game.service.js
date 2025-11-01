import api from './api'

export const gameService = {
  async getTemplates(params) {
    return await api.get('/game-templates', { params })
  },

  async getTemplate(id) {
    return await api.get(`/game-templates/${id}`)
  },

  async createGame(payload) {
    return await api.post('/games', payload)
  },

  async getGame(id) {
    return await api.get(`/games/${id}`)
  },

  async getCurrentQuestion(gameId, questionNumber = 1) {
    return await api.get(`/games/${gameId}/question/${questionNumber}`)
  },

  async getNextUnanswered(gameId) {
    return await api.get(`/games/${gameId}/next-unanswered`)
  },

  async submitAnswer(gameId, questionId, answerId, timeTaken) {
    return await api.post(`/games/${gameId}/questions/${questionId}/answer`, {
      answerId,
      timeTaken
    })
  },

  async completeGame(gameId) {
    return await api.post(`/games/${gameId}/complete`)
  },

  async getGameHistory(params) {
    return await api.get('/games', { params })
  },

  async getUserGames(userId, params) {
    return await api.get(`/games/user/${userId}`, { params })
  }
}
