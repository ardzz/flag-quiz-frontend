<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background">
    <Navbar />

    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-center mb-12 text-light-text dark:text-dark-text">
        My Profile
      </h1>

      <div v-if="isLoading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <div v-else class="max-w-2xl mx-auto">
        <div class="card text-center">
          <div class="mb-6 relative inline-block">
            <div
              v-if="user?.photo_url"
              class="h-24 w-24 rounded-full mx-auto overflow-hidden border-4 border-gray-200 dark:border-gray-700"
            >
              <img
                :src="getPhotoUrl(user.photo_url)"
                :alt="user.username"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="h-24 w-24 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold"
              style="background: linear-gradient(135deg, #4299e1, #2563eb)"
            >
              {{ user?.username?.[0]?.toUpperCase() || 'U' }}
            </div>

            <!-- Upload button overlay -->
            <button
              v-if="isEditing"
              @click="triggerFileInput"
              class="absolute bottom-0 right-0 bg-light-accent dark:bg-dark-accent text-white rounded-full p-2 hover:opacity-80 transition-opacity"
              title="Upload photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
          </div>

          <!-- View Mode -->
          <div v-if="!isEditing">
            <h2 class="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
              {{ user?.username || 'User' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              {{ user?.email || 'No email' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Member since {{ formatDate(user?.created_at) }}
            </p>
          </div>

          <!-- Edit Mode -->
          <div v-else class="max-w-md mx-auto mb-6">
            <div class="space-y-4">
              <div class="text-left">
                <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Username
                </label>
                <input
                  v-model="formData.username"
                  type="text"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                  placeholder="Enter username"
                />
              </div>
              <div class="text-left">
                <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Email
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Member since {{ formatDate(user?.created_at) }}
            </p>
          </div>

          <div class="grid grid-cols-3 gap-4 mt-8">
            <div class="card bg-gray-50 dark:bg-gray-800">
              <div class="text-3xl font-bold text-light-accent dark:text-dark-accent">
                {{ user?.total_score || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
            </div>
            <div class="card bg-gray-50 dark:bg-gray-800">
              <div class="text-3xl font-bold text-light-accent dark:text-dark-accent">
                {{ user?.total_games_played || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
            </div>
            <div class="card bg-gray-50 dark:bg-gray-800">
              <div class="text-3xl font-bold text-light-accent dark:text-dark-accent">
                {{ user?.total_correct_answers || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
            </div>
          </div>

          <div class="mt-8 flex justify-center gap-4">
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="btn btn-primary"
            >
              Edit Profile
            </button>
            <template v-else>
              <button
                @click="handleSave"
                :disabled="isSaving"
                class="btn btn-primary"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                @click="cancelEditing"
                :disabled="isSaving"
                class="btn btn-secondary"
              >
                Cancel
              </button>
            </template>
            <button
              v-if="!isEditing"
              @click="handleLogout"
              class="btn btn-secondary"
            >
              Logout
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
import { userService } from '@/services/user.service'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(null)
const isLoading = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const fileInput = ref(null)
const formData = ref({
  username: '',
  email: ''
})

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await userService.getProfile()
    if (response.user) {
      user.value = response.user
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const getPhotoUrl = (photoUrl) => {
  if (!photoUrl) return ''
  // Always prepend the backend base URL
  const baseUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000'
  // Remove leading slash from photoUrl if present to avoid double slashes
  const cleanPhotoUrl = photoUrl.startsWith('/') ? photoUrl.slice(1) : photoUrl
  return `${baseUrl}/${cleanPhotoUrl}`
}

const startEditing = () => {
  formData.value = {
    username: user.value?.username || '',
    email: user.value?.email || ''
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  formData.value = {
    username: '',
    email: ''
  }
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await userService.updateProfile(formData.value)
    // Refetch profile to get complete data with stats
    const response = await userService.getProfile()
    if (response.user) {
      user.value = response.user
      isEditing.value = false
      // Show success message (you can add a toast notification here)
      console.log('Profile updated successfully')
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
    // Show error message (you can add a toast notification here)
    alert('Failed to update profile. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  // Validate file size (e.g., max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('Image size must be less than 5MB')
    return
  }

  isSaving.value = true
  try {
    await userService.uploadAvatar(file)
    // Refetch profile to get updated photo URL
    const response = await userService.getProfile()
    if (response.user) {
      user.value = response.user
      console.log('Photo uploaded successfully')
    }
    // Clear the file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('Failed to upload photo:', error)
    alert('Failed to upload photo. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
