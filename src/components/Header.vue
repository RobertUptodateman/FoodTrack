<template>
  <!-- это хедер -->
  <header class="sticky-top navbar navbar-light bg-light border-bottom">
    <div class="container py-2 justify-content-between">
      <div class="d-flex flex-row align-items-center">
        <div class="d-inline-flex">
          <img src="../assets/logo.svg" alt="FoodTrack" class="img-fluid" style="height: 40px;">
          <h1 class="h3 ms-2 mb-0 mt-auto">FoodTrack</h1>
        </div>
        <p class="text-muted mb-0 ms-3 mt-auto">Карман с купонами</p>
        <div ref="telegramLoginContainer">
          <button type="button" class="btn btn-primary" @click="handleLogout">выход</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const telegramLoginContainer = ref(null)

// Глобальный обработчик выхода
window.onTelegramLogout = (user) => {
  localStorage.removeItem('user_data')
  router.push('/auth')
}

onMounted(() => {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'goods_track_bot')
  script.setAttribute('data-size', 'small')
  script.setAttribute('data-onauth', 'onTelegramLogout(user)')
  script.setAttribute('data-request-access', 'write')
  script.style.display = 'none'
  
  telegramLoginContainer.value.appendChild(script)
})

const handleLogout = () => {
  // Вызываем клик по скрытому виджету
  const loginButton = telegramLoginContainer.value.querySelector('iframe')
  if (loginButton) {
    loginButton.contentWindow.postMessage('click', '*')
  }
}
</script>

<style scoped>
</style>
