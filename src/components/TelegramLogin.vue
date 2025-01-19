<template>
  <div ref="telegramLoginContainer" class="telegram-login">
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const telegramLoginContainer = ref(null)
const error = ref(null)

onMounted(() => {
  try {
    // Удаляем старый виджет, если он есть
    const oldScript = telegramLoginContainer.value.querySelector('script')
    if (oldScript) {
      oldScript.remove()
    }

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'goods_track_bot')
    script.setAttribute('data-size', 'large') // Увеличим размер кнопки
    script.setAttribute('data-auth-url', 'https://robertuptodateman.github.io/FoodTrack/#/coupon')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-radius', '8') // Добавим скругление углов
    
    // Обработка ошибок загрузки скрипта
    script.onerror = () => {
      error.value = 'Не удалось загрузить виджет Telegram. Пожалуйста, проверьте подключение к интернету и попробуйте снова.'
    }
    
    telegramLoginContainer.value.appendChild(script)
  } catch (e) {
    error.value = 'Произошла ошибка при инициализации виджета Telegram.'
    console.error('Telegram widget error:', e)
  }
})
</script>

<style scoped>
.telegram-login {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error {
  color: #dc3545;
  text-align: center;
  max-width: 300px;
  font-size: 14px;
}
</style>
