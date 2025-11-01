<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-center mb-12 text-light-text dark:text-dark-text">
        🏆 Leaderboard
      </h1>

      <div class="max-w-2xl mx-auto">
        <div v-if="isLoading" class="flex justify-center py-20">
          <LoadingSpinner />
        </div>

        <div v-else class="card">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="(player, index) in topPlayers"
              :key="player.user_id"
              class="p-4 flex justify-between items-center"
            >
              <div class="flex items-center">
                <span
                  class="font-bold text-lg mr-4 w-8"
                  :class="{
                    'text-yellow-400': index === 0,
                    'text-gray-400': index === 1,
                    'text-yellow-600': index === 2,
                    'text-gray-500': index > 2
                  }"
                >
                  {{ player.rank }}.
                </span>
                <div
                  class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                  :style="{ background: `linear-gradient(135deg, ${getGradientColor(index)})` }"
                >
                  {{ player.username?.[0]?.toUpperCase() || '?' }}
                </div>
                <span class="font-medium text-light-text dark:text-dark-text">
                  {{ player.username || 'Unknown' }}
                </span>
              </div>
              <span
                class="font-semibold"
                :class="{ 'text-light-accent dark:text-dark-accent': index === 0 }"
              >
                {{ player.score || 0 }} Pts
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboard'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const leaderboardStore = useLeaderboardStore()

const isLoading = computed(() => leaderboardStore.isLoading)
const topPlayers = computed(() => leaderboardStore.allTimeLeaderboard)

onMounted(async () => {
  await leaderboardStore.loadAllTime({ limit: 10 })
})

const getGradientColor = (index) => {
  const gradients = [
    '#4299e1, #2563eb',
    '#48bb78, #38a169',
    '#f56565, #e53e3e',
    '#667eea, #764ba2',
    '#f093fb, #f5576c'
  ]
  return gradients[index % gradients.length]
}
</script>
