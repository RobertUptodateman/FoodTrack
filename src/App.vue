<template>
  <div class="app">
    <template v-if="$route.name !== 'auth'">
      <Header />
      <main class="main">
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

<style>
.app {
  min-height: 100vh;
  background-color: #fff;
}

.main {
  min-height: calc(100vh - 120px);
  padding: 2rem;
}
</style>
