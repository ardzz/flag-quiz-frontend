<template>
  <div class="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
    <Navbar />
    <main class="container mx-auto px-4 py-6 mt-16 md:mt-20">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
</script>
