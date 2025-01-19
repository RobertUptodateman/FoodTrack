<template>
  <div ref="telegramLoginContainer" class="telegram-login">
    <script 
      async 
      src="https://telegram.org/js/telegram-widget.js?22" 
      data-telegram-login="goods_track_bot" 
      data-size="small" 
      data-auth-url="https://robertuptodateman.github.io/FoodTrack/#/coupon" 
      data-request-access="write">
    </script>
  </div>
</template>

<style scoped>
.telegram-login {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
