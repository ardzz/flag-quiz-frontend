<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage users, templates, and view platform statistics</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</div>
            <div class="text-2xl font-bold">{{ stats.totalUsers?.toLocaleString() || 0 }}</div>
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
            <div class="text-2xl font-bold">{{ stats.totalGames?.toLocaleString() || 0 }}</div>
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
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Today</div>
            <div class="text-2xl font-bold">{{ stats.activeUsers?.toLocaleString() || 0 }}</div>
          </div>
          <div class="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</div>
            <div class="text-2xl font-bold">{{ stats.averageScore || 0 }}</div>
          </div>
          <div class="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="py-4 px-1 border-b-2 font-medium text-sm transition"
          :class="activeTab === tab.value 
            ? 'border-light-accent text-light-accent dark:border-dark-accent dark:text-dark-accent' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Users Management -->
    <div v-else-if="activeTab === 'users'" class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">User Management</h2>
        <div class="flex space-x-2">
          <input
            v-model="userSearch"
            type="text"
            placeholder="Search users..."
            class="input"
          />
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold">User</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">Games</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">Joined</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3">{{ user.username }}</td>
              <td class="px-4 py-3 text-sm">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30' : 'bg-gray-100 text-gray-800 dark:bg-gray-700'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">{{ user.totalGamesPlayed || 0 }}</td>
              <td class="px-4 py-3 text-sm">{{ formatDate(user.createdAt) }}</td>
              <td class="px-4 py-3 text-right">
                <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm mr-2">Edit</button>
                <button class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Game Templates -->
    <div v-else-if="activeTab === 'templates'" class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Game Templates</h2>
        <button class="btn btn-primary">Create Template</button>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Template management coming soon...</p>
    </div>

    <!-- Statistics -->
    <div v-else-if="activeTab === 'statistics'" class="space-y-6">
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Platform Analytics</h2>
        <p class="text-gray-600 dark:text-gray-400">Detailed analytics coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const activeTab = ref('users')
const isLoading = ref(false)
const userSearch = ref('')

const tabs = [
  { label: 'Users', value: 'users' },
  { label: 'Templates', value: 'templates' },
  { label: 'Statistics', value: 'statistics' }
]

const stats = ref({
  totalUsers: 0,
  totalGames: 0,
  activeUsers: 0,
  averageScore: 0
})

const users = ref([])

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  const search = userSearch.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(search) || 
    user.email.toLowerCase().includes(search)
  )
})

onMounted(async () => {
  // Load admin data
  await loadStats()
  await loadUsers()
})

const loadStats = async () => {
  // TODO: Implement API call
  stats.value = {
    totalUsers: 1250,
    totalGames: 5420,
    activeUsers: 87,
    averageScore: 85
  }
}

const loadUsers = async () => {
  // TODO: Implement API call
  users.value = []
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  })
}
</script>
