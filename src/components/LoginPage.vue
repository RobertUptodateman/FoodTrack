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
let scriptElement = null

// Функция для обработки авторизации через Telegram
const handleTelegramAuth = async (user) => {
  debug.value = 'Получены данные от Telegram: ' + JSON.stringify(user)
  
  try {
    // Сохраняем данные пользователя в куки на 7 дней
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
    
    // Небольшая задержка перед редиректом
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Перенаправляем на страницу с купоном
    router.push('/coupon')
  } catch (e) {
    error.value = 'Ошибка при сохранении данных: ' + e.message
    debug.value = 'Ошибка: ' + e.message
  }
}

onMounted(() => {
  try {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = Cookies.get('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      debug.value = 'Найден сохраненный пользователь'
      router.push('/coupon')
      return
    }

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

    // Добавляем обработчик в глобальную область
    window.onTelegramAuth = handleTelegramAuth

    // Создаем и добавляем скрипт после монтирования компонента
    scriptElement = document.createElement('script')
    scriptElement.async = true
    scriptElement.src = 'https://telegram.org/js/telegram-widget.js'
    scriptElement.setAttribute('data-telegram-login', 'foodtrack_auth_bot')
    scriptElement.setAttribute('data-size', 'large')
    scriptElement.setAttribute('data-onauth', 'onTelegramAuth')
    scriptElement.setAttribute('data-request-access', 'write')
    scriptElement.setAttribute('data-lang', 'ru')
    
    const container = telegramLoginRef.value
    if (container) {
      container.innerHTML = ''
      container.appendChild(scriptElement)
      debug.value = 'Скрипт Telegram добавлен'
    } else {
      error.value = 'Ошибка: контейнер для виджета не найден'
    }
  } catch (e) {
    error.value = 'Ошибка при инициализации: ' + e.message
    debug.value = 'Ошибка: ' + e.message
  }
})

onUnmounted(() => {
  // Очищаем глобальный обработчик и удаляем скрипт при размонтировании компонента
  window.onTelegramAuth = null
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
  }
})
</script>
