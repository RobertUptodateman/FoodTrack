<template>
  <div ref="telegramLoginContainer" class="telegram-login"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const telegramLoginContainer = ref(null)

onMounted(() => {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'goods_track_bot')
  script.setAttribute('data-size', 'small')
  script.setAttribute('data-auth-url', 'https://robertuptodateman.github.io/FoodTrack/#/coupon')
  script.setAttribute('data-request-access', 'write')
  
  // Удаляем старый виджет, если он есть
  const oldScript = telegramLoginContainer.value.querySelector('script')
  if (oldScript) {
    oldScript.remove()
  }
  
  telegramLoginContainer.value.appendChild(script)
})
</script>

<style scoped>
.telegram-login {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}
</style>
