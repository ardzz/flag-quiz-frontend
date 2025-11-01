<template>
  <div class="text-center">
    <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Score</div>
    <div class="text-2xl font-bold text-light-accent dark:text-dark-accent">
      {{ score }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  score: {
    type: Number,
    required: true,
    default: 0
  }
})
</script>
