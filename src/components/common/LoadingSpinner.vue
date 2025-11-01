<template>
  <div class="flex items-center justify-center">
    <div class="relative">
      <div class="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
      <div class="w-12 h-12 rounded-full border-4 border-light-accent dark:border-dark-accent border-t-transparent absolute top-0 left-0 animate-spin"></div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
