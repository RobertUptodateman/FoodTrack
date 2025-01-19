<template>
  <div v-if="!accepted" class="cookie-consent">
    <div class="container d-flex justify-content-between align-items-center py-3">
      <div class="cookie-text">
        <p class="mb-0">
          Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с использованием файлов cookie.
        </p>
      </div>
      <div class="cookie-buttons d-flex gap-2">
        <button @click="acceptCookies" class="btn btn-primary btn-sm">Принять</button>
        <button @click="showDetails" class="btn btn-outline-secondary btn-sm">Подробнее</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const COOKIE_CONSENT = 'cookie_consent'
const accepted = ref(!!Cookies.get(COOKIE_CONSENT))

const acceptCookies = () => {
  Cookies.set(COOKIE_CONSENT, 'true', { expires: 365 }) // Согласие на год
  accepted.value = true
}

const showDetails = () => {
  window.open('https://ru.wikipedia.org/wiki/Cookie', '_blank')
}

// Проверяем согласие при загрузке
onMounted(() => {
  accepted.value = !!Cookies.get(COOKIE_CONSENT)
})
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1050;
}

.cookie-text {
  font-size: 0.9rem;
  color: #6c757d;
  max-width: 80%;
}

@media (max-width: 768px) {
  .cookie-consent .container {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .cookie-text {
    max-width: 100%;
  }
}
</style>
