<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column gap-2 align-items-center">
      <div id="telegram-login" ref="telegramLoginRef"></div>
      <div v-if="user" class="mt-2 text-success text-center">
        Добро пожаловать, {{ user.first_name }}!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const telegramLoginRef = ref(null)

// Глобальная функция для обработки авторизации через Telegram
window.onTelegramAuth = (telegramUser) => {
  user.value = telegramUser
  // Здесь можно сохранить пользователя в localStorage или Pinia store
  localStorage.setItem('telegramUser', JSON.stringify(telegramUser))
}

onMounted(() => {
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

// Проверяем, есть ли сохраненный пользователь
const savedUser = localStorage.getItem('telegramUser')
if (savedUser) {
  user.value = JSON.parse(savedUser)
}
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
