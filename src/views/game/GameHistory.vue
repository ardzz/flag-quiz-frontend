<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Game History</h1>
      <p class="text-gray-600 dark:text-gray-400">View your past games and performance</p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Status</label>
          <select v-model="filters.status" class="input">
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Difficulty</label>
          <select v-model="filters.difficulty" class="input">
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Sort By</label>
          <select v-model="filters.sortBy" class="input">
            <option value="recent">Most Recent</option>
            <option value="score">Highest Score</option>
            <option value="accuracy">Best Accuracy</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Game List -->
    <div v-else-if="games.length > 0" class="space-y-4">
      <div
        v-for="game in games"
        :key="game.id"
        class="card hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewGameDetails(game.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-semibold">{{ game.templateName || 'Custom Game' }}</h3>
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="difficultyClass(game.difficulty)"
              >
                {{ game.difficulty }}
              </span>
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="statusClass(game.status)"
              >
                {{ game.status }}
              </span>
            </div>
            <div class="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Score: <strong class="text-light-accent dark:text-dark-accent">{{ game.score }}</strong></span>
              <span>Accuracy: <strong>{{ game.accuracy }}%</strong></span>
              <span>{{ game.correctAnswers }}/{{ game.totalQuestions }} correct</span>
              <span>{{ formatDate(game.completedAt || game.startedAt) }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-light-accent dark:text-dark-accent">
              {{ game.score }}
            </div>
            <div class="text-sm text-gray-500">points</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-semibold mb-2">No games yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Start playing to see your game history!</p>
      <router-link to="/game" class="btn btn-primary">
        Start a Game
      </router-link>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center">
      <div class="flex space-x-2">
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          class="px-4 py-2 rounded-lg font-medium transition"
          :class="page === pagination.page ? 'bg-light-accent text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const gameStore = useGameStore()

const filters = ref({
  status: '',
  difficulty: '',
  sortBy: 'recent'
})

const isLoading = computed(() => gameStore.isLoading)
const games = computed(() => gameStore.gameHistory)
const pagination = computed(() => gameStore.pagination || { page: 1, totalPages: 1 })

onMounted(() => {
  loadGames()
})

watch(filters, () => {
  loadGames()
}, { deep: true })

const loadGames = async () => {
  await gameStore.loadGameHistory({
    status: filters.value.status,
    difficulty: filters.value.difficulty,
    sortBy: filters.value.sortBy,
    page: pagination.value.page
  })
}

const changePage = (page) => {
  gameStore.pagination.page = page
  loadGames()
}

const viewGameDetails = (gameId) => {
  router.push({ name: 'GamePlay', params: { id: gameId } })
}

const difficultyClass = (difficulty) => {
  const classes = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[difficulty] || ''
}

const statusClass = (status) => {
  const classes = {
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    abandoned: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
  return classes[status] || ''
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
