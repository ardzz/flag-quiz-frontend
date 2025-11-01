import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gameService } from '@/services/game.service'

export const useGameStore = defineStore('game', () => {
  const currentGame = ref(null)
  const currentQuestion = ref(null)
  const currentQuestionNumber = ref(1)
  const answerOptions = ref([])
  const correctAnswerValue = ref(null)
  const templates = ref([])
  const gameHistory = ref([])
  const isLoading = ref(false)

  const totalQuestions = computed(() => {
    if (currentGame.value?.total_questions) {
      return parseInt(currentGame.value.total_questions)
    }
    return 0
  })
  const timeLimit = computed(() => currentGame.value?.time_limit || 30)
  const allowHints = computed(() => currentGame.value?.allow_hints || false)
  const correctAnswer = computed(() => correctAnswerValue.value)

  async function loadTemplates() {
    isLoading.value = true
    try {
      const response = await gameService.getTemplates()
      if (response.templates) {
        templates.value = response.templates
      }
    } finally {
      isLoading.value = false
    }
  }

  async function createGame(templateIdOrOptions, customOptions = null) {
    isLoading.value = true
    try {
      let payload = {}
      
      // If first parameter is a string, it's a templateId
      if (typeof templateIdOrOptions === 'string') {
        payload.templateId = templateIdOrOptions
      } 
      // If first parameter is null and customOptions provided, it's custom game
      else if (templateIdOrOptions === null && customOptions) {
        payload.customOptions = customOptions
      }
      // If customOptions provided as second parameter (template with custom options)
      else if (customOptions) {
        payload.templateId = templateIdOrOptions
        payload.customOptions = customOptions
      }
      
      const response = await gameService.createGame(payload)
      if (response.success) {
        currentGame.value = response.data
        return response.data
      }
    } catch (error) {
      isLoading.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadGame(gameId) {
    isLoading.value = true
    try {
      // Get game metadata
      const gameResponse = await gameService.getGame(gameId)
      if (gameResponse.success && gameResponse.data) {
        currentGame.value = gameResponse.data
        
        // Check if game is already completed
        if (gameResponse.data.status === 'completed') {
          // Game is already finished, return the completed state
          return { completed: true, gameData: gameResponse.data }
        }
        
        // Get first unanswered question
        const questionResponse = await gameService.getNextUnanswered(gameId)
        if (questionResponse.success && questionResponse.data.hasUnanswered) {
          currentQuestion.value = questionResponse.data.question
          currentQuestionNumber.value = questionResponse.data.question.questionNumber
          answerOptions.value = questionResponse.data.question.options.map(opt => opt.name)
          correctAnswerValue.value = null
        }
        
        return { completed: false }
      }
    } catch (error) {
      isLoading.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function submitAnswer(gameId, questionId, answerName, timeTaken) {
    // Find the answer ID from the options
    if (!currentQuestion.value || !currentQuestion.value.options) {
      throw new Error('Question data not loaded')
    }
    
    const selectedOption = currentQuestion.value.options.find(opt => opt.name === answerName)
    if (!selectedOption) {
      throw new Error('Invalid answer')
    }
    
    const response = await gameService.submitAnswer(gameId, questionId, selectedOption.id, timeTaken)
    if (response.success) {
      // Find the correct answer name from the correctAnswerId in response
      if (response.data.correctAnswerId) {
        const correctOption = currentQuestion.value.options.find(opt => opt.id === response.data.correctAnswerId)
        if (correctOption) {
          correctAnswerValue.value = correctOption.name
        }
      }
      return response.data
    }
  }

  async function loadNextQuestion() {
    try {
      const response = await gameService.getNextUnanswered(currentGame.value.id)
      if (response.success && response.data.hasUnanswered) {
        currentQuestion.value = response.data.question
        currentQuestionNumber.value = response.data.question.questionNumber
        answerOptions.value = response.data.question.options.map(opt => opt.name)
        correctAnswerValue.value = null
        return true
      }
      return false // No more questions
    } catch (error) {
      // If error is "Game is not in progress", it means the game is completed
      if (error.response?.data?.error === 'Game is not in progress') {
        return false
      }
      throw error
    }
  }

  async function completeGame(gameId) {
    const response = await gameService.completeGame(gameId)
    if (response.success) {
      // Format the response to match what GameResults expects
      return {
        game: {
          score: response.data.score,
          correctAnswers: response.data.correct_answers,
          totalQuestions: response.data.total_questions,
          timeSpent: response.data.time_spent
        },
        achievements: [] // No achievements in current API response
      }
    }
  }

  async function loadGameHistory(params) {
    isLoading.value = true
    try {
      const response = await gameService.getGameHistory(params)
      if (response.success) {
        gameHistory.value = response.data
      }
    } finally {
      isLoading.value = false
    }
  }

  function resetGame() {
    currentGame.value = null
    currentQuestion.value = null
    currentQuestionNumber.value = 1
    answerOptions.value = []
    correctAnswerValue.value = null
  }

  return {
    currentGame,
    currentQuestion,
    currentQuestionNumber,
    answerOptions,
    templates,
    gameHistory,
    isLoading,
    totalQuestions,
    timeLimit,
    allowHints,
    correctAnswer,
    loadTemplates,
    createGame,
    loadGame,
    submitAnswer,
    loadNextQuestion,
    completeGame,
    loadGameHistory,
    resetGame
  }
})
