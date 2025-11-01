<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-light-text dark:text-dark-text">
    <nav class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-light-accent dark:text-dark-accent">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            <span class="text-xl font-bold">FlagMaster</span>
          </router-link>

          <div class="flex items-center space-x-4">
            <router-link 
              to="/leaderboard" 
              class="text-sm font-medium hover:text-light-accent dark:hover:text-dark-accent transition"
            >
              Leaderboard
            </router-link>
            <router-link 
              to="/profile" 
              class="text-sm font-medium hover:text-light-accent dark:hover:text-dark-accent transition"
            >
              Profile
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Game layout - focused layout for game pages without footer
</script>
