<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button
      v-for="(option, index) in options"
      :key="index"
      @click="selectAnswer(option)"
      :disabled="isAnswered"
      class="answer-option p-4 rounded-lg text-lg font-medium border-2 transition-all focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent disabled:cursor-not-allowed"
      :class="getOptionClass(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedAnswer: {
    type: String,
    default: null
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  correctAnswer: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

const selectAnswer = (option) => {
  if (!props.isAnswered) {
    emit('select', option)
  }
}

const getOptionClass = (option) => {
  if (!props.isAnswered) {
    return 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-light-accent dark:hover:border-dark-accent'
  }

  // After answered
  const isCorrect = option === props.correctAnswer
  const isSelected = option === props.selectedAnswer

  if (isCorrect) {
    return 'bg-light-correct dark:bg-dark-correct text-white border-light-correct dark:border-dark-correct'
  }

  if (isSelected && !isCorrect) {
    return 'bg-light-incorrect dark:bg-dark-incorrect text-white border-light-incorrect dark:border-dark-incorrect'
  }

  return 'opacity-50 border-gray-300 dark:border-gray-600'
}
</script>

<style scoped>
.answer-option {
  min-height: 60px;
}
</style>
