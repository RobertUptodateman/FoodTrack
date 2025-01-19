<template>
  <div ref="telegramLoginContainer" class="d-flex justify-content-center align-items-center"></div>
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
  
  telegramLoginContainer.value.appendChild(script)
})
</script>
