<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column gap-2 align-items-center">
      <div v-if="loading" class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <div :id="`telegram-login-${botConfig.botName}`"></div>
      <div v-if="error" class="mt-2 text-danger text-center">
        {{ error }}
      </div>
      <div v-if="debug" class="mt-2 text-muted small">
        {{ debug }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { botConfig } from '../config.js'

const router = useRouter()
const error = ref(null)
const debug = ref(null)
const loading = ref(false)

// Глобальная функция для обработки авторизации через Telegram
window.onTelegramAuth = (user) => {
  loading.value = true
  debug.value = 'Получены данные от Telegram: ' + JSON.stringify(user)
  console.log('Telegram auth data:', user)
  
  try {
    if (!user) {
      error.value = 'Ошибка: не получены данные пользователя'
      loading.value = false
      return
    }

    // Сохраняем данные пользователя в куки на 7 дней
    Cookies.set('user', JSON.stringify(user), { expires: 7, path: '/' })
    debug.value = 'Данные сохранены в куки'
    
    // Перенаправляем на страницу купонов
    router.push('/coupon')
  } catch (e) {
    error.value = 'Ошибка при обработке данных: ' + e.message
    console.error('Auth error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Проверяем, есть ли сохраненный пользователь
  const savedUser = Cookies.get('user')
  console.log('Checking saved user:', savedUser)
  
  if (savedUser) {
    router.push('/coupon')
    return
  }

  // Создаем и добавляем скрипт Telegram
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js'
  script.setAttribute('data-telegram-login', botConfig.botName)
  script.setAttribute('data-size', botConfig.size)
  script.setAttribute('data-radius', botConfig.radius)
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  
  // Добавляем скрипт в контейнер
  const container = document.getElementById(`telegram-login-${botConfig.botName}`)
  if (container) {
    container.appendChild(script)
  } else {
    console.error('Container for Telegram login not found')
    error.value = 'Ошибка инициализации виджета авторизации'
  }
})

onUnmounted(() => {
  // Удаляем глобальную функцию при размонтировании компонента
  delete window.onTelegramAuth
})
</script>
