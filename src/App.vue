<template>
  <div class="app">
    <template v-if="$route.name !== 'auth'">
      <Header />
      <main class="main">
        <div class="container">
          <router-view></router-view>
        </div>
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
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
