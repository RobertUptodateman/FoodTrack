<template>
  <!-- это хедер -->
  <header class="sticky-top navbar navbar-light bg-light border-bottom">
    <div class="container py-2 justify-content-between">
      <div class="d-flex flex-row align-items-center">
        <div class="d-inline-flex">
          <img src="../assets/logo.svg" alt="FoodTrack" class="img-fluid" style="height: 40px;">
          <h1 class="h3 ms-2 mb-0 mt-auto">FoodTrack</h1>
        </div>
        <p class="text-muted mb-0 ms-3 mt-auto">Карман с купонами</p>
        <button 
          type="button" 
          class="btn btn-primary" 
          @click="handleLogout" 
          :disabled="isLoggingOut"
        >
          <span v-if="isLoggingOut" class="spinner-border spinner-border-sm me-1" role="status"></span>
          {{ isLoggingOut ? 'Выход...' : 'Выход' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sessionStore } from '../store/session'

const router = useRouter()
const isLoggingOut = ref(false)

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await sessionStore.endSession()
    router.push('/auth')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  min-width: 100px;
}
</style>
