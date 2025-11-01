<template>
  <div class="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text min-h-screen">
    <Navbar />

    <div class="container mx-auto px-4 py-6">
      <main class="mt-16 md:mt-24">
        <!-- Hero Section -->
        <section class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-extrabold text-light-accent dark:text-dark-accent mb-4">
            FlagMaster
          </h1>
          <h2 class="text-4xl md:text-6xl font-extrabold mb-6">
            Can you guess the flag?
          </h2>
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
            Test your geography knowledge with our dynamic flag quiz. The images are obscured to make it a real challenge!
          </p>
          <router-link
            v-if="isAuthenticated"
            to="/game"
            class="inline-block bg-light-accent text-white dark:bg-dark-accent dark:text-dark-background px-10 py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-all transform hover:scale-105"
          >
            Start Playing
          </router-link>
          <router-link
            v-else
            to="/register"
            class="inline-block bg-light-accent text-white dark:bg-dark-accent dark:text-dark-background px-10 py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-all transform hover:scale-105"
          >
            Play as Guest
          </router-link>
        </section>

        <!-- Features Section -->
        <section class="mt-24 md:mt-32">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature Card 1 -->
            <div class="bg-light-primaryEl dark:bg-dark-primaryEl p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-700 text-light-accent dark:text-dark-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  <path d="M12 12h.01"></path>
                  <path d="M12 18h.01"></path>
                  <path d="M12 6h.01"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Dynamic Challenge</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Flags are pixelated. Guess correctly to reveal the full image!
              </p>
            </div>

            <!-- Feature Card 2 -->
            <div class="bg-light-primaryEl dark:bg-dark-primaryEl p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-700 text-light-accent dark:text-dark-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Compete & Climb</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Sign up to save your scores and compete on the global leaderboard.
              </p>
            </div>

            <!-- Feature Card 3 -->
            <div class="bg-light-primaryEl dark:bg-dark-primaryEl p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-700 text-light-accent dark:text-dark-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Learn as you Play</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Discover new countries and facts with every quiz.
              </p>
            </div>
          </div>
        </section>

        <!-- Leaderboard Preview -->
        <section class="mt-24 md:mt-32 max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">Top 5 Players</h2>
          <div v-if="isLoading" class="flex justify-center">
            <LoadingSpinner />
          </div>
          <div v-else class="bg-light-primaryEl dark:bg-dark-primaryEl rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li
                v-for="(player, index) in topPlayers"
                :key="player.user_id"
                class="p-4 flex justify-between items-center"
              >
                <div class="flex items-center">
                  <span
                    class="font-bold text-lg mr-4"
                    :class="{
                      'text-yellow-400': index === 0,
                      'text-gray-400': index === 1,
                      'text-yellow-600': index === 2,
                      'text-gray-500': index > 2
                    }"
                  >
                    {{ player.rank }}.
                  </span>
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                    {{ player.username?.[0]?.toUpperCase() || '?' }}
                  </div>
                  <span class="font-medium">{{ player.username || 'Unknown' }}</span>
                </div>
                <span class="font-semibold" :class="{ 'text-light-accent dark:text-dark-accent': index === 0 }">
                  {{ player.score || 0 }} Pts
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLeaderboardStore } from '@/stores/leaderboard'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const leaderboardStore = useLeaderboardStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoading = computed(() => leaderboardStore.isLoading)
const topPlayers = computed(() => leaderboardStore.allTimeLeaderboard.slice(0, 5))

onMounted(async () => {
  try {
    await leaderboardStore.loadAllTime({ limit: 5 })
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
  }
})
</script>
