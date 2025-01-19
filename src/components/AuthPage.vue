<template>
  <div class="auth">
    <TelegramLogin />
  </div>
</template>

<script setup>
import TelegramLogin from './TelegramLogin.vue'
</script>

<style scoped>
.auth {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
