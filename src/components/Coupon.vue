<template>
  <div class="container h-100 d-flex justify-content-center align-items-center">
    <div class="card w-100" style="max-width: 800px;">
      <div class="card-body min-vh-25">
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
        </div>
        <div v-else>
          <!-- Пустой купон -->
          <p class="text-muted text-center">Здесь будут ваши купоны</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { sessionStore } from '../store/session'

const isLoading = ref(true)
let mounted = false

onMounted(() => {
  mounted = true
  // Имитация загрузки данных
  setTimeout(() => {
    if (mounted) {
      isLoading.value = false
    }
  }, 500)
})

onUnmounted(() => {
  mounted = false
})
</script>

<style scoped>
.min-vh-25 {
  min-height: 25vh;
}
</style>
