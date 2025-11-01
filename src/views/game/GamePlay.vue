<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background flex flex-col items-center justify-center p-4">
    <!-- Theme Toggle -->
    <button
      @click="toggleTheme"
      class="absolute top-4 right-4 p-3 rounded-lg bg-light-primaryEl dark:bg-dark-primaryEl shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
    >
      <svg v-if="isDarkMode" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
      </svg>
      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <div class="w-full max-w-3xl">
      <!-- Logo Header -->
      <router-link to="/" class="flex items-center justify-center space-x-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-light-accent dark:text-dark-accent">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
        <span class="text-2xl font-bold text-light-text dark:text-dark-text">FlagMaster</span>
      </router-link>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <!-- Game Results -->
      <GameResults v-else-if="gameCompleted && gameResults" :results="gameResults" />

      <!-- Game Card -->
      <div v-else-if="currentQuestion && !loadError" class="card">
        <!-- Top Bar (Status) -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <ScoreDisplay :score="score" />
            <div class="text-center">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Question</div>
              <div class="text-lg font-bold text-light-text dark:text-dark-text">
                {{ currentQuestionNumber }} / {{ totalQuestions }}
              </div>
            </div>
            <GameTimer
              :timeLimit="timeLimit"
              :isPaused="isPaused"
              @timeUp="handleTimeUp"
              ref="timerRef"
            />
          </div>
        </div>

        <!-- Flag Display -->
        <FlagDisplay
          :flagUrl="currentQuestion.flagUrl"
          :showHint="showHint"
          :hint="currentQuestion.hint"
          :isBlurred="shouldBlurFlag"
        />

        <!-- Answer Options -->
        <AnswerOptions
          :options="answerOptions"
          :selectedAnswer="selectedAnswer"
          :isAnswered="isAnswered"
          :correctAnswer="correctAnswer"
          @select="handleAnswerSelect"
        />

        <!-- Hint Button -->
        <div v-if="allowHints && !showHint && !isAnswered" class="mt-4 text-center">
          <button
            @click="showHint = true"
            class="btn btn-secondary"
          >
            💡 Show Hint (-5 points)
          </button>
        </div>

        <!-- Next Button -->
        <div v-if="isAnswered" class="mt-6">
          <button
            @click="handleNext"
            class="btn btn-primary w-full md:w-1/2 mx-auto block text-lg"
          >
            Next Question
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="card text-center">
        <p class="text-red-600 dark:text-red-400 mb-4">
          Failed to load game. Please try again.
        </p>
        <router-link to="/game" class="btn btn-primary">
          Back to Lobby
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useToast } from '@/composables/useToast'
import GameTimer from '@/components/game/GameTimer.vue'
import ScoreDisplay from '@/components/game/ScoreDisplay.vue'
import FlagDisplay from '@/components/game/FlagDisplay.vue'
import AnswerOptions from '@/components/game/AnswerOptions.vue'
import GameResults from '@/components/game/GameResults.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const toast = useToast()

const selectedAnswer = ref(null)
const isAnswered = ref(false)
const showHint = ref(false)
const score = ref(0)
const isPaused = ref(false)
const timerRef = ref(null)
const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
const loadError = ref(false)
const questionStartTime = ref(null)
const gameCompleted = ref(false)
const gameResults = ref(null)

const currentQuestion = computed(() => gameStore.currentQuestion)
const currentQuestionNumber = computed(() => gameStore.currentQuestionNumber)
const answerOptions = computed(() => gameStore.answerOptions)
const totalQuestions = computed(() => gameStore.totalQuestions)
const timeLimit = computed(() => gameStore.timeLimit)
const allowHints = computed(() => gameStore.allowHints)
const correctAnswer = computed(() => gameStore.correctAnswer)
const isLastQuestion = computed(() => currentQuestionNumber.value === totalQuestions.value)
const isLoading = computed(() => gameStore.isLoading)
const gameDifficulty = computed(() => gameStore.currentGame?.difficulty)
const shouldBlurFlag = computed(() => {
  // Blur the flag if it's hard difficulty and not yet answered
  return gameDifficulty.value === 'hard' && !isAnswered.value
})

onMounted(async () => {
  const gameId = route.params.id
  try {
    const result = await gameStore.loadGame(gameId)
    
    if (result && result.completed) {
      // Game is already completed, show results
      gameCompleted.value = true
      // Format the game data to match the results format expected by GameResults component
      gameResults.value = {
        game: {
          score: result.gameData.score,
          correctAnswers: parseInt(result.gameData.correct_answers),
          totalQuestions: parseInt(result.gameData.total_questions),
          timeSpent: result.gameData.time_spent
        },
        achievements: []
      }
    } else if (!gameStore.currentQuestion) {
      loadError.value = true
      toast.error('Failed to load game. Please try again.')
    } else {
      // Start timer for first question
      questionStartTime.value = Date.now()
    }
  } catch (error) {
    console.error('Failed to load game:', error)
    loadError.value = true
    
    const errorMessage = error.response?.data?.error || error.message
    if (errorMessage) {
      toast.error(errorMessage)
    } else {
      toast.error('Failed to load game. Please try again.')
    }
  }
})

const handleAnswerSelect = async (answer) => {
  if (isAnswered.value) return

  selectedAnswer.value = answer
  isAnswered.value = true
  isPaused.value = true

  // Calculate time taken in seconds
  const timeTaken = Math.floor((Date.now() - questionStartTime.value) / 1000)

  try {
    const result = await gameStore.submitAnswer(
      route.params.id,
      currentQuestion.value.id,
      answer,
      timeTaken
    )

    // Update score from server response
    if (result.totalScore !== undefined) {
      score.value = result.totalScore
    }
  } catch (error) {
    console.error('Failed to submit answer:', error)
    toast.error('Failed to submit answer. Please try again.')
  }
}

const handleNext = async () => {
  selectedAnswer.value = null
  isAnswered.value = false
  showHint.value = false
  isPaused.value = false

  // Try to load next question
  const hasMore = await gameStore.loadNextQuestion()
  
  if (!hasMore) {
    // No more questions, complete the game
    try {
      const result = await gameStore.completeGame(route.params.id)
      if (result) {
        gameResults.value = result
        gameCompleted.value = true
        toast.success('Game completed successfully!')
      }
    } catch (error) {
      console.error('Failed to complete game:', error)
      toast.error('Failed to complete game.')
    }
  } else {
    // Reset timer for next question
    questionStartTime.value = Date.now()
  }
}

const handleTimeUp = () => {
  if (!isAnswered.value) {
    isAnswered.value = true
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const htmlElement = document.documentElement
  if (isDarkMode.value) {
    htmlElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    htmlElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>
