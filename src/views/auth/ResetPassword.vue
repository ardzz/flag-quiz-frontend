<template>
  <div class="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <router-link to="/" class="flex items-center justify-center space-x-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-light-accent dark:text-dark-accent">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
          <span class="text-2xl font-bold">FlagMaster</span>
        </router-link>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-light-text dark:text-dark-text">
          Create your account
        </h2>
      </div>

      <!-- Registration Form -->
      <div class="card">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="username" class="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input"
              placeholder="johndoe"
              autocomplete="username"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="email@example.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              At least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ error }}
          </div>

          <div v-if="success" class="text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            {{ success }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Create Account</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            </button>
          </div>

          <div class="text-center text-sm">
            <router-link to="/login" class="font-medium text-light-accent dark:text-dark-accent hover:underline">
              Already have an account? Sign in
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  // Validate password match
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    isLoading.value = false
    return
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(form.value.password)) {
    error.value = 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
    isLoading.value = false
    return
  }

  try {
    const result = await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })

    if (result.success) {
      success.value = 'Registration successful! Redirecting to game...'
      setTimeout(() => {
        router.push('/game')
      }, 2000)
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
