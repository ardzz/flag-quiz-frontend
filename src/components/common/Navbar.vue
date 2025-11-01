<template>
  <header class="bg-light-accent dark:bg-dark-accent border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center">
        <!-- Logo/Name -->
        <router-link to="/" class="flex items-center space-x-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
          <span class="text-xl font-bold text-white">FlagMaster</span>
        </router-link>

        <!-- Navigation & Toggle -->
        <nav class="flex items-center space-x-4">
          <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 text-white">
            <!-- Sun Icon (Light Mode) -->
            <svg v-if="isDarkMode" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
            </svg>
            <!-- Moon Icon (Dark Mode) -->
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <router-link to="/leaderboard" class="hidden md:inline text-sm font-medium text-white hover:text-gray-200">
            Leaderboard
          </router-link>

          <template v-if="isAuthenticated">
            <router-link to="/game" class="hidden md:inline text-sm font-medium text-white hover:text-gray-200">
              Play
            </router-link>
            <router-link to="/profile" class="hidden md:inline text-sm font-medium text-white hover:text-gray-200">
              Profile
            </router-link>
            <router-link
              v-if="isAdmin"
              to="/admin/dashboard"
              class="hidden md:inline text-sm font-medium text-white hover:text-gray-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
              Admin
            </router-link>
            <button @click="handleLogout" class="text-sm font-medium bg-white text-light-accent dark:bg-white dark:text-dark-accent px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="hidden md:inline text-sm font-medium text-white hover:text-gray-200">
              Login
            </router-link>
            <router-link to="/register" class="text-sm font-medium bg-white text-light-accent dark:bg-white dark:text-dark-accent px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
              Sign Up
            </router-link>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Initialize theme on component mount
onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light'
  isDarkMode.value = theme === 'dark'
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const htmlElement = document.documentElement
  if (isDarkMode.value) {
    htmlElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    htmlElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
