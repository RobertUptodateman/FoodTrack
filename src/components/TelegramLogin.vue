<template>
  <div class="telegram-login">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="isLoading" class="loading-indicator">
      <span class="spinner"></span>
      Загрузка...
    </div>
    <div ref="telegramLoginContainer" :class="{ 'd-none': isLoading || error }" class="d-flex justify-content-center align-items-center"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sessionStore } from '../store/session'
import { botApi } from '../services/botApi'

const router = useRouter()
const telegramLoginContainer = ref(null)
const isLoading = ref(true)
const error = ref(null)
let scriptElement = null
let scriptLoadPromise = null

// Локальная функция обработчика авторизации
async function handleTelegramAuth(user) {
  try {
    await sessionStore.startSession(user)
    router.push('/coupon')
  } catch (error) {
    console.error('Ошибка при авторизации:', error)
    error.value = 'Ошибка при авторизации. Пожалуйста, попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}

// Функция загрузки скрипта с кэшированием промиса
function loadTelegramScript() {
  if (scriptLoadPromise) {
    return scriptLoadPromise
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    // Проверяем, не загружен ли уже скрипт
    if (window.TelegramLoginWidget) {
      isLoading.value = false
      return resolve()
    }

    scriptElement = document.createElement('script')
    scriptElement.async = true
    scriptElement.defer = true
    scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22'
    
    // Настройка виджета
    scriptElement.setAttribute('data-telegram-login', 'goods_track_bot')
    scriptElement.setAttribute('data-size', 'large')
    scriptElement.setAttribute('data-onauth', 'onTelegramAuth(user)')
    scriptElement.setAttribute('data-request-access', 'write')
    scriptElement.setAttribute('data-radius', '4')

    // Обработчики загрузки
    scriptElement.onload = () => {
      isLoading.value = false
      resolve()
    }
    
    scriptElement.onerror = () => {
      isLoading.value = false
      error.value = 'Не удалось загрузить виджет Telegram. Пожалуйста, проверьте подключение к интернету.'
      scriptLoadPromise = null
      reject(new Error('Не удалось загрузить виджет Telegram'))
    }

    // Таймаут загрузки
    const timeoutId = setTimeout(() => {
      if (isLoading.value) {
        scriptElement.onerror()
      }
    }, 10000)

    telegramLoginContainer.value.appendChild(scriptElement)
  })

  return scriptLoadPromise
}

onMounted(async () => {
  try {
    // Проверяем доступность бота
    const botAvailable = await botApi.checkBot()
    if (!botAvailable) {
      error.value = 'Бот временно недоступен. Пожалуйста, попробуйте позже.'
      isLoading.value = false
      return
    }

    // Устанавливаем обработчик до загрузки скрипта
    window.onTelegramAuth = handleTelegramAuth
    
    await loadTelegramScript()
  } catch (err) {
    console.error('Ошибка при инициализации:', err)
    error.value = 'Произошла ошибка при загрузке. Пожалуйста, обновите страницу.'
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Очищаем все ресурсы
  delete window.onTelegramAuth
  scriptLoadPromise = null
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
  }
})
</script>

<style scoped>
.telegram-login {
  position: relative;
  min-height: 40px;
  padding: 20px;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 10px;
  margin-bottom: 10px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
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
