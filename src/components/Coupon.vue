<template>
  <div class="coupon">
    <TelegramLogin />
    <div class="coupon-content">
      <!-- Пустой купон -->
    </div>
  </div>
</template>

<script setup>
import TelegramLogin from './TelegramLogin.vue'
</script>

<style scoped>
.coupon {
  padding: 2rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.coupon-content {
  min-height: 200px;
}
</style>
