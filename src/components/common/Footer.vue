<template>
  <footer class="bg-light-background dark:bg-dark-background border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4">
      <div class="text-center py-12">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          © {{ currentYear }} FlagMaster. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
