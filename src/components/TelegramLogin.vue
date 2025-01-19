<template>
  <div class="telegram-login">
    <div v-if="isLoading" class="loading-indicator">
      <span class="spinner"></span>
      Загрузка...
    </div>
    <div ref="telegramLoginContainer" :class="{ 'd-none': isLoading }" class="d-flex justify-content-center align-items-center"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sessionStore } from '../store/session'

const router = useRouter()
const telegramLoginContainer = ref(null)
const isLoading = ref(true)
let scriptElement = null

// Локальная функция обработчика авторизации
function handleTelegramAuth(user) {
  sessionStore.startSession(user)
  router.push('/coupon')
}

// Функция загрузки скрипта с таймаутом
function loadTelegramScript() {
  return new Promise((resolve, reject) => {
    scriptElement = document.createElement('script')
    scriptElement.async = true
    scriptElement.defer = true // Добавляем defer для оптимизации загрузки
    scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22'
    
    // Настройка виджета
    scriptElement.setAttribute('data-telegram-login', 'goods_track_bot')
    scriptElement.setAttribute('data-size', 'small')
    scriptElement.setAttribute('data-onauth', 'onTelegramAuth(user)')
    scriptElement.setAttribute('data-request-access', 'write')

    // Обработчики загрузки
    scriptElement.onload = () => {
      isLoading.value = false
      resolve()
    }
    scriptElement.onerror = () => {
      isLoading.value = false
      reject(new Error('Не удалось загрузить виджет Telegram'))
    }

    // Таймаут загрузки
    const timeout = setTimeout(() => {
      if (isLoading.value) {
        scriptElement.onerror()
      }
    }, 10000) // 10 секунд таймаут

    telegramLoginContainer.value.appendChild(scriptElement)
  })
}

onMounted(async () => {
  window.onTelegramAuth = handleTelegramAuth
  try {
    await loadTelegramScript()
  } catch (error) {
    console.error('Ошибка загрузки виджета:', error)
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Очищаем все ресурсы
  delete window.onTelegramAuth
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
  }
})
</script>

<style scoped>
.telegram-login {
  position: relative;
  min-height: 40px;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.d-none {
  display: none !important;
}
</style>
