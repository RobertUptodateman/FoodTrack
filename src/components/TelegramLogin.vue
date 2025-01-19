<template>
  <div ref="telegramLoginContainer" class="d-flex justify-content-center align-items-center"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const telegramLoginContainer = ref(null)

// Глобальный обработчик авторизации
window.onTelegramAuth = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user))
  router.push('/coupon')
}

onMounted(() => {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'goods_track_bot')
  script.setAttribute('data-size', 'small')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  
  telegramLoginContainer.value.appendChild(script)
})
</script>
