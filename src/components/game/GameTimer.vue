<template>
  <div class="text-center">
    <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Time Left</div>
    <div class="text-2xl font-bold" :class="timeClass">
      {{ formattedTime }}
    </div>
    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
      <div
        class="h-full transition-all duration-1000 ease-linear"
        :class="barClass"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  timeLimit: {
    type: Number,
    required: true
  },
  isPaused: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['timeUp'])

const timeLeft = ref(props.timeLimit)
let interval = null

const formattedTime = computed(() => {
  return `${timeLeft.value}s`
})

const percentage = computed(() => {
  return (timeLeft.value / props.timeLimit) * 100
})

const timeClass = computed(() => {
  if (percentage.value <= 25) return 'text-red-500'
  if (percentage.value <= 50) return 'text-yellow-500'
  return 'text-green-500'
})

const barClass = computed(() => {
  if (percentage.value <= 25) return 'bg-red-500'
  if (percentage.value <= 50) return 'bg-yellow-500'
  return 'bg-green-500'
})

const startTimer = () => {
  interval = setInterval(() => {
    if (!props.isPaused && timeLeft.value > 0) {
      timeLeft.value--
      if (timeLeft.value === 0) {
        emit('timeUp')
        stopTimer()
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

const resetTimer = () => {
  timeLeft.value = props.timeLimit
}

// Watch for timeLimit changes (new question)
watch(() => props.timeLimit, (newLimit) => {
  timeLeft.value = newLimit
  stopTimer()
  if (!props.isPaused) {
    startTimer()
  }
})

// Watch for pause state
watch(() => props.isPaused, (isPaused) => {
  if (!isPaused && timeLeft.value > 0) {
    startTimer()
  } else {
    stopTimer()
  }
})

// Start timer on mount
startTimer()

// Cleanup on unmount
onUnmounted(() => {
  stopTimer()
})

defineExpose({
  resetTimer,
  stopTimer
})
</script>
