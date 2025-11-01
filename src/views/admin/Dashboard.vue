<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-light-text dark:text-dark-text">Admin Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage users, countries, and view platform statistics</p>
      </div>

      <!-- Statistics Cards -->
      <div v-if="statsLoading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</div>
              <div class="text-2xl font-bold text-light-text dark:text-dark-text">{{ stats.users?.total?.toLocaleString() || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ stats.users?.verified || 0 }} verified</div>
            </div>
            <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Games</div>
              <div class="text-2xl font-bold text-light-text dark:text-dark-text">{{ stats.games?.total?.toLocaleString() || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ stats.games?.completed || 0 }} completed</div>
            </div>
            <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Countries</div>
              <div class="text-2xl font-bold text-light-text dark:text-dark-text">{{ stats.countries?.total?.toLocaleString() || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ stats.countries?.active || 0 }} active</div>
            </div>
            <div class="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</div>
              <div class="text-2xl font-bold text-light-text dark:text-dark-text">{{ stats.games?.avg_score?.toFixed(0) || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ stats.users?.admins || 0 }} admins</div>
            </div>
            <div class="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex space-x-8">
          <router-link
            to="/admin/dashboard"
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-light-accent text-light-accent dark:border-dark-accent dark:text-dark-accent"
          >
            Dashboard
          </router-link>
          <router-link
            to="/admin/users"
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Users
          </router-link>
          <router-link
            to="/admin/countries"
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Countries
          </router-link>
          <router-link
            to="/admin/audit-logs"
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Audit Logs
          </router-link>
        </nav>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { adminService } from '@/services/admin.service'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const statsLoading = ref(true)
const stats = ref({
  users: {},
  games: {},
  countries: {}
})

// Check if user is admin
const checkAdminAccess = () => {
  const user = authStore.user
  if (!user || user.role !== 'admin') {
    router.push('/')
  }
}

onMounted(async () => {
  checkAdminAccess()
  await loadStats()
})

const loadStats = async () => {
  statsLoading.value = true
  try {
    const response = await adminService.getStatistics()
    if (response) {
      stats.value = response
    }
  } catch (error) {
    console.error('Failed to load statistics:', error)
  } finally {
    statsLoading.value = false
  }
}
</script>
