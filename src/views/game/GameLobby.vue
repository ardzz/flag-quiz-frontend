<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-center mb-2 text-light-text dark:text-dark-text">
        Choose Your Challenge
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-400 mb-4">
        Select a game template to start your flag guessing adventure
      </p>
      
      <!-- Custom Game Button -->
      <div class="text-center mb-8">
        <button
          @click="openCustomGameModal"
          class="inline-flex items-center gap-2 px-6 py-3 bg-light-accent text-white dark:bg-dark-accent rounded-lg font-semibold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-all transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Start Custom Game
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <div v-else-if="templates.length === 0" class="text-center py-20">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          No game templates available at the moment.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card bg-light-primaryEl dark:bg-dark-primaryEl rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          @click="selectTemplateDirectly(template)"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-light-text dark:text-dark-text">
              {{ template.name }}
            </h3>
            <span
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="difficultyClass(template.difficulty)"
            >
              {{ template.difficulty }}
            </span>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ template.description }}
          </p>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Questions:</span>
              <span class="font-semibold text-light-text dark:text-dark-text">
                {{ template.number_of_flags }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Time per flag:</span>
              <span class="font-semibold text-light-text dark:text-dark-text">
                {{ template.time_per_flag }}s
              </span>
            </div>
            <div v-if="template.continent_id" class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Region:</span>
              <span class="font-semibold text-light-text dark:text-dark-text">
                {{ template.continent_name }}
              </span>
            </div>
          </div>

          <button
            class="mt-6 w-full bg-light-accent text-white dark:bg-dark-accent dark:text-dark-background py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 transition font-semibold"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>

  <!-- Game Options Modal -->
  <GameOptionsModal
    :is-open="showModal"
    :template="selectedTemplate"
    @close="closeModal"
    @start="handleStartGame"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useToast } from '@/composables/useToast'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import GameOptionsModal from '@/components/game/GameOptionsModal.vue'

const router = useRouter()
const gameStore = useGameStore()
const toast = useToast()

const isLoading = computed(() => gameStore.isLoading)
const templates = computed(() => gameStore.templates)
const showModal = ref(false)
const selectedTemplate = ref({})

onMounted(async () => {
  await gameStore.loadTemplates()
})

const openModal = (template) => {
  selectedTemplate.value = template
  showModal.value = true
}

const openCustomGameModal = () => {
  // Use the first template as a base for custom game
  if (templates.value.length > 0) {
    selectedTemplate.value = templates.value[0]
    showModal.value = true
  }
}

const selectTemplateDirectly = async (template) => {
  try {
    const game = await gameStore.createGame(template.id)
    if (game) {
      router.push({ name: 'GamePlay', params: { id: game.id } })
    }
  } catch (error) {
    console.error('Failed to create game:', error)
    
    // Handle specific error messages
    const errorMessage = error.response?.data?.error || error.message
    const activeGame = error.response?.data?.activeGame
    
    if (errorMessage === 'Email verification required') {
      toast.warning('Please verify your email before starting a game.')
    } else if (activeGame) {
      // User has an active game in progress
      toast.info('You have a game in progress. Redirecting...')
      setTimeout(() => {
        router.push({ name: 'GamePlay', params: { id: activeGame.id } })
      }, 1500)
    } else if (errorMessage) {
      toast.error(errorMessage)
    } else {
      toast.error('Failed to start game. Please try again.')
    }
  }
}

const closeModal = () => {
  showModal.value = false
}

const handleStartGame = async (options) => {
  closeModal()
  
  try {
    const game = await gameStore.createGame(null, options.customOptions)
    if (game) {
      router.push({ name: 'GamePlay', params: { id: game.id } })
    }
  } catch (error) {
    console.error('Failed to create game:', error)
    
    // Handle specific error messages
    const errorMessage = error.response?.data?.error || error.message
    const activeGame = error.response?.data?.activeGame
    
    if (errorMessage === 'Email verification required') {
      toast.warning('Please verify your email before starting a game.')
    } else if (activeGame) {
      // User has an active game in progress
      toast.info('You have a game in progress. Redirecting...')
      setTimeout(() => {
        router.push({ name: 'GamePlay', params: { id: activeGame.id } })
      }, 1500)
    } else if (errorMessage) {
      toast.error(errorMessage)
    } else {
      toast.error('Failed to start game. Please try again.')
    }
  }
}

const difficultyClass = (difficulty) => {
  const classes = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}
</script>
