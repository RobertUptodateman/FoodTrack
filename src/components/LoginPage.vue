<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column gap-2 align-items-center">
      <div id="telegram-login" ref="telegramLoginRef"></div>
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

const router = useRouter()
const error = ref(null)
const debug = ref(null)
const telegramLoginRef = ref(null)

// Функция для обработки авторизации через Telegram
const handleTelegramAuth = (user) => {
  debug.value = 'Получены данные от Telegram: ' + JSON.stringify(user)
  
  try {
    // Сохраняем данные пользователя в куки на 7 дней
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
    
    // Перенаправляем на страницу с купоном
    router.push('/coupon')
  } catch (e) {
    error.value = 'Ошибка при сохранении данных: ' + e.message
  }
}

onMounted(() => {
  // Добавляем обработчик в глобальную область
  window.onTelegramAuth = handleTelegramAuth
  
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'robertuptodateman.github.io'
  ]

  const currentDomain = window.location.hostname
  debug.value = 'Текущий домен: ' + currentDomain
  
  if (!allowedDomains.includes(currentDomain)) {
    error.value = 'Ошибка: неразрешенный домен'
    return
  }

  try {
    // Создаем и добавляем скрипт после монтирования компонента
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js'
    script.setAttribute('data-telegram-login', 'foodtrack_auth_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-lang', 'ru')
    
    telegramLoginRef.value.appendChild(script)
    debug.value = 'Скрипт Telegram добавлен'
  } catch (e) {
    error.value = 'Ошибка при инициализации виджета: ' + e.message
  }
})

onUnmounted(() => {
  // Очищаем глобальный обработчик при размонтировании компонента
  window.onTelegramAuth = null
})

// Проверяем, есть ли сохраненный пользователь
const savedUser = Cookies.get('user')
if (savedUser) {
  try {
    const user = JSON.parse(savedUser)
    debug.value = 'Найден сохраненный пользователь: ' + user.first_name
    router.push('/coupon')
  } catch (e) {
    Cookies.remove('user')
    error.value = 'Ошибка при чтении данных пользователя'
  }
}
</script>
