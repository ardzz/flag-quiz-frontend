<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const isDarkMode = ref(false)
const route = useRoute()

onMounted(() => {
  // Check localStorage for theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
  } else if (savedTheme === 'light') {
    isDarkMode.value = false
  } else {
    // Default to dark mode
    isDarkMode.value = true
    localStorage.setItem('theme', 'dark')
  }
})

// Provide theme toggle function globally
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Make theme toggle available globally
window.toggleTheme = toggleTheme
window.isDarkMode = isDarkMode
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
