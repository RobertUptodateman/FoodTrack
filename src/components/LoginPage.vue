<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column gap-2 align-items-center">
      <div v-if="loading" class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <div :id="`telegram-login-${botConfig.botName}`">
        <script async src="https://telegram.org/js/telegram-widget.js" 
          :data-telegram-login="botConfig.botName"
          :data-size="botConfig.size"
          :data-radius="botConfig.radius"
          data-onauth="window.onTelegramAuth(user)"
          data-request-access="write">
        </script>
      </div>
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

// Функция для обработки авторизации через Telegram
function onTelegramAuth(user) {
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
    console.log('User data saved to cookies')
    
    // Проверяем, что данные сохранились
    const savedUser = Cookies.get('user')
    if (savedUser) {
      debug.value = 'Данные успешно прочитаны из куков'
      console.log('Saved user data:', savedUser)
      
      // Добавляем небольшую задержку перед редиректом
      setTimeout(() => {
        debug.value = 'Переходим на страницу купона...'
        router.push('/coupon')
      }, 1000)
    } else {
      error.value = 'Ошибка: данные не сохранились в куки'
      loading.value = false
    }
  } catch (e) {
    console.error('Auth error:', e)
    error.value = 'Ошибка при сохранении данных: ' + e.message
    loading.value = false
  }
}

onMounted(() => {
  // Проверяем, есть ли сохраненный пользователь
  const savedUser = Cookies.get('user')
  console.log('Checking saved user:', savedUser)
  
  if (savedUser) {
    try {
      debug.value = 'Найден сохраненный пользователь'
      console.log('Found saved user, redirecting to coupon')
      router.push('/coupon')
      return
    } catch (e) {
      console.error('Error with saved user:', e)
      Cookies.remove('user', { path: '/' })
    }
  }

  // Добавляем обработчик в глобальную область
  window.onTelegramAuth = onTelegramAuth
})

onUnmounted(() => {
  window.onTelegramAuth = null
})
</script>
