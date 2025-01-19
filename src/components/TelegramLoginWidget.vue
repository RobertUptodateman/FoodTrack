&lt;template&gt;
  &lt;div :id="containerId"&gt;&lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  botName: {
    type: String,
    required: true
  },
  onAuth: {
    type: Function,
    required: true
  },
  size: {
    type: String,
    default: 'large'
  },
  radius: {
    type: String,
    default: '8'
  }
})

const containerId = `telegram-login-${props.botName}`

onMounted(() => {
  // Создаем глобальный обработчик для конкретного бота
  const handlerName = `onTelegramAuth_${props.botName}`
  window[handlerName] = (user) => {
    props.onAuth(user)
  }

  // Создаем и добавляем скрипт
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js'
  script.setAttribute('data-telegram-login', props.botName)
  script.setAttribute('data-size', props.size)
  script.setAttribute('data-onauth', `${handlerName}(user)`)
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-lang', 'ru')
  script.setAttribute('data-radius', props.radius)
  
  document.head.appendChild(script)
})

onUnmounted(() => {
  // Очищаем глобальный обработчик
  const handlerName = `onTelegramAuth_${props.botName}`
  if (window[handlerName]) {
    window[handlerName] = null
  }
})
&lt;/script&gt;
