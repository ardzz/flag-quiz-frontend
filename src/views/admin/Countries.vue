<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-light-text dark:text-dark-text">Country Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage countries and flags for the quiz</p>
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
            class="py-4 px-1 border-b-2 font-medium text-sm transition border-light-accent text-light-accent dark:border-dark-accent dark:text-dark-accent"
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

      <!-- Import Section -->
      <div class="card mb-6">
        <h3 class="text-lg font-bold mb-3 text-light-text dark:text-dark-text">Import Countries</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Import countries from the flags.csv file. This will add or update all country data.
        </p>
        <button
          @click="handleImport"
          :disabled="importing"
          class="btn btn-primary"
        >
          {{ importing ? 'Importing...' : 'Import Countries from CSV' }}
        </button>
        <div v-if="importResult" class="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
          ✓ Successfully imported {{ importResult.count }} countries
        </div>
      </div>

      <!-- Countries List -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else class="card overflow-hidden">
        <div class="flex justify-between items-center mb-4 px-4 pt-4">
          <h3 class="text-lg font-bold text-light-text dark:text-dark-text">All Countries</h3>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search countries..."
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Flag</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Name</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Continent</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">Status</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-light-text dark:text-dark-text">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="country in filteredCountries"
                :key="country.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-4 py-3">
                  <img
                    :src="country.flag_url"
                    :alt="country.name"
                    class="h-8 w-12 object-cover rounded border border-gray-200 dark:border-gray-700"
                  />
                </td>
                <td class="px-4 py-3 text-light-text dark:text-dark-text font-medium">{{ country.name }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ getContinentName(country.continent_id) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="country.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    {{ country.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="openEditDialog(country)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleActive(country)"
                    class="text-sm transition-colors"
                    :class="country.is_active
                      ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'"
                  >
                    {{ country.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredCountries.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            No countries found
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} countries
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

    <!-- Edit Country Modal -->
    <div
      v-if="showEditDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showEditDialog = false"
    >
      <div class="card max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Edit Country</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-light-text dark:text-dark-text">Country Name</label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-light-text dark:text-dark-text">Flag URL</label>
            <input
              v-model="editForm.flag_url"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-light-text dark:text-dark-text">Continent</label>
            <select
              v-model="editForm.continent_id"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            >
              <option :value="1">Africa</option>
              <option :value="2">Antarctica</option>
              <option :value="3">Asia</option>
              <option :value="4">Europe</option>
              <option :value="5">North America</option>
              <option :value="6">Oceania</option>
              <option :value="7">South America</option>
            </select>
          </div>
          <div class="flex items-center">
            <input
              v-model="editForm.is_active"
              type="checkbox"
              id="is_active"
              class="mr-2"
            />
            <label for="is_active" class="text-sm text-light-text dark:text-dark-text">Active</label>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            @click="updateCountry"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { adminService } from '@/services/admin.service'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const importing = ref(false)
const saving = ref(false)
const importResult = ref(null)
const searchQuery = ref('')
const countries = ref([])
const pagination = ref({
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
})

const showEditDialog = ref(false)
const editForm = ref({
  name: '',
  flag_url: '',
  continent_id: 1,
  is_active: true
})
const selectedCountry = ref(null)

const continents = {
  1: 'Africa',
  2: 'Antarctica',
  3: 'Asia',
  4: 'Europe',
  5: 'North America',
  6: 'Oceania',
  7: 'South America'
}

const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries.value
  const query = searchQuery.value.toLowerCase()
  return countries.value.filter(country =>
    country.name.toLowerCase().includes(query)
  )
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
  await fetchCountries()
})

const fetchCountries = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }

    const response = await adminService.getCountries(params)
    if (response && response.countries) {
      countries.value = response.countries
      if (response.pagination) {
        pagination.value = response.pagination
      }
    }
  } catch (error) {
    console.error('Failed to fetch countries:', error)
    alert('Failed to load countries')
  } finally {
    loading.value = false
  }
}

const handleImport = async () => {
  if (!confirm('This will import all countries from flags.csv. Continue?')) {
    return
  }

  importing.value = true
  importResult.value = null
  try {
    const response = await adminService.importCountries()
    importResult.value = response
    await fetchCountries()
    setTimeout(() => {
      importResult.value = null
    }, 5000)
  } catch (error) {
    console.error('Failed to import countries:', error)
    alert('Failed to import countries')
  } finally {
    importing.value = false
  }
}

const getContinentName = (id) => {
  return continents[id] || 'Unknown'
}

const changePage = (page) => {
  pagination.value.page = page
  fetchCountries()
}

const openEditDialog = (country) => {
  selectedCountry.value = country
  editForm.value = {
    name: country.name,
    flag_url: country.flag_url,
    continent_id: country.continent_id,
    is_active: country.is_active
  }
  showEditDialog.value = true
}

const updateCountry = async () => {
  if (!selectedCountry.value) return

  saving.value = true
  try {
    await adminService.updateCountry(selectedCountry.value.id, editForm.value)
    showEditDialog.value = false
    await fetchCountries()
    alert('Country updated successfully')
  } catch (error) {
    console.error('Failed to update country:', error)
    alert('Failed to update country')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (country) => {
  try {
    if (country.is_active) {
      // Deactivate
      await adminService.deactivateCountry(country.id)
      await fetchCountries()
      alert('Country deactivated successfully')
    } else {
      // Activate (update with is_active: true)
      await adminService.updateCountry(country.id, { is_active: true })
      await fetchCountries()
      alert('Country activated successfully')
    }
  } catch (error) {
    console.error('Failed to toggle country status:', error)
    alert('Failed to update country status')
  }
}
</script>
