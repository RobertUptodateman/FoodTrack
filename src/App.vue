<template>
  <div class="min-vh-100 bg-white">
    <template v-if="$route.name !== 'auth'">
      <Header />
      <main class="min-vh-100 p-4" style="min-height: calc(100vh - 120px) !important;">
        <router-view></router-view>
      </main>
      <Footer />
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>
