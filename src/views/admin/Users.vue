<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-light-text dark:text-dark-text">User Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage users, roles, and permissions</p>
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
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-light-accent text-light-accent dark:border-dark-accent dark:text-dark-accent"
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

      <!-- Filters and Search -->
      <div class="card mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="search"
            @input="handleSearch"
            type="text"
            placeholder="Search by username or email..."
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          />
          <select
            v-model="roleFilter"
            @change="fetchUsers"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          >
            <option value="">All Roles</option>
            <option value="player">Players</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Username</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Email</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Role</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Games</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Score</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Verified</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-light-text dark:text-dark-text">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-4 py-3 text-light-text dark:text-dark-text">{{ user.username }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ user.email }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-3 text-light-text dark:text-dark-text">{{ user.total_games_played || 0 }}</td>
                <td class="px-4 py-3 text-light-text dark:text-dark-text">{{ user.total_score?.toLocaleString() || 0 }}</td>
                <td class="px-4 py-3">
                  <span v-if="user.is_email_verified" class="text-green-600 dark:text-green-400 text-sm">
                    ✓ Verified
                  </span>
                  <span v-else class="text-gray-400 dark:text-gray-500 text-sm">
                    ✗ Not Verified
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="openEditDialog(user)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mr-3 transition-colors"
                  >
                    Edit Role
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="users.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            No users found
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} users
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

    <!-- Edit Role Modal -->
    <div
      v-if="showEditDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showEditDialog = false"
    >
      <div class="card max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Edit User Role</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Change role for: <strong>{{ selectedUser?.username }}</strong>
        </p>
        <select
          v-model="newRole"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent mb-4"
        >
          <option value="player">Player</option>
          <option value="admin">Admin</option>
        </select>
        <div class="flex gap-3">
          <button
            @click="updateRole"
            :disabled="saving"
            class="btn btn-primary flex-1"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button
            @click="showEditDialog = false"
            :disabled="saving"
            class="btn btn-secondary flex-1"
          >
            Cancel
          </button>
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
const saving = ref(false)
const search = ref('')
const roleFilter = ref('')
const users = ref([])
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
})

const showEditDialog = ref(false)
const selectedUser = ref(null)
const newRole = ref('')

let searchTimeout = null

// Check admin access
const checkAdminAccess = () => {
  const user = authStore.user
  if (!user || user.role !== 'admin') {
    router.push('/')
  }
}

onMounted(async () => {
  checkAdminAccess()
  await fetchUsers()
})

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchUsers()
  }, 500)
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...(roleFilter.value && { role: roleFilter.value }),
      ...(search.value && { search: search.value })
    }

    const response = await adminService.getUsers(params)
    if (response && response.users) {
      users.value = response.users
      pagination.value = response.pagination
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    alert('Failed to load users')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  pagination.value.page = page
  fetchUsers()
}

const openEditDialog = (user) => {
  selectedUser.value = user
  newRole.value = user.role
  showEditDialog.value = true
}

const updateRole = async () => {
  if (!selectedUser.value) return

  saving.value = true
  try {
    await adminService.updateUserRole(selectedUser.value.id, newRole.value)
    showEditDialog.value = false
    await fetchUsers()
    alert(`User role updated to ${newRole.value}`)
  } catch (error) {
    console.error('Failed to update user role:', error)
    alert('Failed to update user role')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (user) => {
  if (!confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
    return
  }

  try {
    await adminService.deleteUser(user.id)
    await fetchUsers()
    alert('User deleted successfully')
  } catch (error) {
    console.error('Failed to delete user:', error)
    if (error.response?.data?.error === 'Cannot delete yourself') {
      alert('You cannot delete your own account')
    } else {
      alert('Failed to delete user')
    }
  }
}
</script>
