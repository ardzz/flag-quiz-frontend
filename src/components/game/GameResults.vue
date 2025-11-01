<template>
  <div class="card text-center">
    <div class="mb-8">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
        Game Complete!
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Great job! Here are your results
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="stat-card">
        <div class="text-4xl font-bold text-light-accent dark:text-dark-accent mb-2">
          {{ results.game.score }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 uppercase">
          Final Score
        </div>
      </div>

      <div class="stat-card">
        <div class="text-4xl font-bold text-light-accent dark:text-dark-accent mb-2">
          {{ results.game.correctAnswers }}/{{ results.game.totalQuestions }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 uppercase">
          Correct Answers
        </div>
      </div>

      <div class="stat-card">
        <div class="text-4xl font-bold text-light-accent dark:text-dark-accent mb-2">
          {{ accuracy }}%
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 uppercase">
          Accuracy
        </div>
      </div>

      <div class="stat-card">
        <div class="text-4xl font-bold text-light-accent dark:text-dark-accent mb-2">
          {{ formatTime(results.game.timeSpent) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 uppercase">
          Time Spent
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div v-if="results.achievements && results.achievements.length > 0" class="mb-8">
      <h3 class="text-xl font-bold text-light-text dark:text-dark-text mb-4">
        🏆 Achievements Unlocked
      </h3>
      <div class="flex flex-wrap gap-3 justify-center">
        <div
          v-for="(achievement, index) in results.achievements"
          :key="index"
          class="achievement-badge px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium text-sm"
        >
          {{ achievement.name || achievement.title }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4 justify-center">
      <router-link
        to="/game"
        class="btn btn-primary"
      >
        Play Again
      </router-link>
      <router-link
        to="/leaderboard"
        class="btn btn-secondary"
      >
        View Leaderboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  results: {
    type: Object,
    required: true
  }
})

const accuracy = computed(() => {
  if (props.results.game.totalQuestions === 0) return 0
  return Math.round((props.results.game.correctAnswers / props.results.game.totalQuestions) * 100)
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.stat-card {
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border-radius: 0.75rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.achievement-badge {
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
