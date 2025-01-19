<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column gap-2 align-items-center">
      <div id="telegram-login" ref="telegramLoginRef"></div>
      <div v-if="error" class="mt-2 text-danger text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()
const error = ref(null)
const telegramLoginRef = ref(null)

// Глобальная функция для обработки авторизации через Telegram
window.onTelegramAuth = (telegramUser) => {
  error.value = null
  
  // Сохраняем данные пользователя в куки на 7 дней
  Cookies.set('user', JSON.stringify(telegramUser), { expires: 7 })
  
  // Перенаправляем на страницу с купоном
  router.push('/coupon')
}

onMounted(() => {
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'robertuptodateman.github.io'
  ]

  const currentDomain = window.location.hostname
  if (!allowedDomains.includes(currentDomain)) {
    error.value = 'Ошибка: неразрешенный домен'
    return
  }

  // Создаем и добавляем скрипт после монтирования компонента
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js'
  script.setAttribute('data-telegram-login', 'foodtrack_auth_bot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-onauth', 'onTelegramAuth')
  script.setAttribute('data-request-access', 'write')
  telegramLoginRef.value.appendChild(script)
})
</script>
