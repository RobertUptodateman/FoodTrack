<template>
  <div class="home">
    <TelegramLogin />
  </div>
</template>

<script setup>
import TelegramLogin from './TelegramLogin.vue'
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); /* Вычитаем высоту header и footer */
}
</style>
