<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-light-text dark:text-dark-text">
            Create Custom Game
          </h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Number of Flags -->
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Number of Flags</label>
            <input
              v-model.number="customOptions.numberOfFlags"
              type="number"
              min="5"
              max="50"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Time Per Flag -->
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Time Per Flag (seconds)</label>
            <input
              v-model.number="customOptions.timePerFlag"
              type="number"
              min="10"
              max="120"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Difficulty -->
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Difficulty</label>
            <select
              v-model="customOptions.difficulty"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <!-- Continent -->
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Region (Optional)</label>
            <select
              v-model="customOptions.continentId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option :value="null">All Regions</option>
              <option :value="1">Africa</option>
              <option :value="2">Asia</option>
              <option :value="3">Europe</option>
              <option :value="4">North America</option>
              <option :value="5">South America</option>
              <option :value="6">Oceania</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
        <button
          @click="close"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          @click="startGame"
          class="flex-1 px-4 py-2 bg-light-accent text-white dark:bg-dark-accent rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  template: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'start'])

const customOptions = ref({
  numberOfFlags: 10,
  timePerFlag: 30,
  difficulty: 'medium',
  continentId: null
})

// Reset to defaults when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    customOptions.value = {
      numberOfFlags: 10,
      timePerFlag: 30,
      difficulty: 'medium',
      continentId: null
    }
  }
})

const close = () => {
  emit('close')
}

const startGame = () => {
  emit('start', { 
    customOptions: customOptions.value 
  })
}
</script>
