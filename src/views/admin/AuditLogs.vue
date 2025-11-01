<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-light-text dark:text-dark-text">Audit Logs</h1>
        <p class="text-gray-600 dark:text-gray-400">View all administrative actions and changes</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex space-x-8">
          <router-link
            to="/admin/dashboard"
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
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
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-light-accent text-light-accent dark:border-dark-accent dark:text-dark-accent"
          >
            Audit Logs
          </router-link>
        </nav>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            v-model="actionFilter"
            @change="fetchLogs"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          >
            <option value="">All Actions</option>
            <option value="update_role">Update Role</option>
            <option value="delete">Delete</option>
            <option value="import">Import</option>
            <option value="deactivate">Deactivate</option>
            <option value="update">Update</option>
          </select>

          <select
            v-model="resourceFilter"
            @change="fetchLogs"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          >
            <option value="">All Resources</option>
            <option value="user">User</option>
            <option value="country">Country</option>
            <option value="countries">Countries</option>
          </select>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Time</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Action</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Resource</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Performed By</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="log in logs"
                :key="log.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(log.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="getActionClass(log.action)"
                  >
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-light-text dark:text-dark-text">
                  {{ log.resource_type }}
                </td>
                <td class="px-4 py-3 text-sm text-light-text dark:text-dark-text">
                  {{ log.performed_by_username || 'Unknown' }}
                </td>
                <td class="px-4 py-3">
                  <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                    {{ formatDetails(log.details) }}
                  </code>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="logs.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            No audit logs found
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} logs
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="!pagination.hasPrev"
              class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
              Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="!pagination.hasNext"
              class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
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

const loading = ref(true)
const actionFilter = ref('')
const resourceFilter = ref('')
const logs = ref([])
const pagination = ref({
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
})

// Check admin access
const checkAdminAccess = () => {
  const user = authStore.user
  if (!user || user.role !== 'admin') {
    router.push('/')
  }
}

onMounted(async () => {
  checkAdminAccess()
  await fetchLogs()
})

const fetchLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...(actionFilter.value && { action: actionFilter.value }),
      ...(resourceFilter.value && { resourceType: resourceFilter.value })
    }

    const response = await adminService.getAuditLogs(params)
    if (response && response.logs) {
      logs.value = response.logs
      if (response.pagination) {
        pagination.value = response.pagination
      }
    }
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    alert('Failed to load audit logs')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  pagination.value.page = page
  fetchLogs()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

const getActionClass = (action) => {
  const actionClasses = {
    update_role: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    import: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    deactivate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    update: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  }
  return actionClasses[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const formatDetails = (details) => {
  if (!details) return 'N/A'
  if (typeof details === 'string') return details
  return JSON.stringify(details)
}
</script>
