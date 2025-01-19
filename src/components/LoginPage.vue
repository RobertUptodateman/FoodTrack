<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column gap-2 align-items-center">
      <div v-if="loading" class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
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
const loading = ref(false)
const telegramLoginRef = ref(null)

// Функция для обработки авторизации через Telegram
function onTelegramAuth(user) {
  loading.value = true
  debug.value = 'Обработка данных от Telegram: ' + JSON.stringify(user)
  
  try {
    // Сохраняем данные пользователя в куки на 7 дней
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
    debug.value = 'Данные сохранены, переход на страницу купона...'
    router.push('/coupon')
  } catch (e) {
    error.value = 'Ошибка при сохранении данных: ' + e.message
    loading.value = false
  }
}

onMounted(() => {
  // Проверяем, есть ли сохраненный пользователь
  const savedUser = Cookies.get('user')
  if (savedUser) {
    try {
      debug.value = 'Найден сохраненный пользователь'
      router.push('/coupon')
      return
    } catch (e) {
      Cookies.remove('user')
    }
  }

  // Добавляем обработчик в глобальную область
  window.onTelegramAuth = onTelegramAuth

  try {
    // Создаем и добавляем скрипт для виджета Telegram
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js'
    script.setAttribute('data-telegram-login', 'foodtrack_auth_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-lang', 'ru')
    script.setAttribute('data-radius', '8')
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-callback-url', 'https://robertuptodateman.github.io/FoodTrack/#/coupon')
    
    const container = telegramLoginRef.value
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
      debug.value = 'Виджет Telegram загружен'
    }
  } catch (e) {
    error.value = 'Ошибка при загрузке виджета: ' + e.message
  }
})

onUnmounted(() => {
  window.onTelegramAuth = null
})
</script>
