<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center">
    <Suspense>
      <template #default>
        <TelegramLogin />
      </template>
      <template #fallback>
        <div class="text-center">
          <div class="spinner"></div>
          <div class="mt-2">Загрузка...</div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

// Асинхронная загрузка компонента с задержкой для оптимизации
const TelegramLogin = defineAsyncComponent(() => 
  import('./TelegramLogin.vue')
)
</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
