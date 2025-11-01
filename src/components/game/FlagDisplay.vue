<template>
  <div class="flag-display text-center mb-8">
    <div class="flag-container relative inline-block w-full max-w-2xl">
      <img
        :src="flagUrl"
        :alt="showHint ? hint : 'Guess this flag'"
        class="flag-image w-full h-64 md:h-80 object-cover rounded-lg shadow-2xl border-4 border-gray-300 dark:border-gray-600 transition-all duration-500"
        :class="{ 'blur-flag': isBlurred }"
        @load="handleImageLoad"
      />
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
        <LoadingSpinner />
      </div>
    </div>

    <div v-if="showHint && hint" class="hint mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">
      💡 Hint: {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  flagUrl: {
    type: String,
    required: true
  },
  showHint: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  isBlurred: {
    type: Boolean,
    default: true
  }
})

const isLoading = ref(true)

watch(() => props.flagUrl, () => {
  isLoading.value = true
})

const handleImageLoad = () => {
  isLoading.value = false
}
</script>

<style scoped>
.blur-flag {
  filter: blur(20px);
}

.flag-image {
  transition: filter 0.5s ease-out, transform 0.3s ease;
}

.flag-image:not(.blur-flag) {
  filter: blur(0);
}
</style>
