// Конфигурация бота
const TELEGRAM_API = 'https://api.telegram.org'
const API_TIMEOUT = 5000 // 5 секунд таймаут

// Получаем токен из переменных окружения или конфигурации
function getBotToken() {
  // В продакшене токен должен браться из переменных окружения
  // Для разработки используем тестовый токен
  const token = process.env.VUE_APP_TELEGRAM_BOT_TOKEN || '6883937698:AAGBxA_RZkAYPNxRWwNTqXYxZYGPDWwrwBg'
  return token ? token.trim() : null
}

/**
 * Проверяет работоспособность бота
 * @returns {Promise<boolean>}
 */
async function checkBotStatus() {
  try {
    const result = await sendTelegramRequest('getMe')
    if (result && result.ok) {
      console.info('Бот успешно подключен:', result.result.username)
      return true
    }
    return false
  } catch (error) {
    console.error('Ошибка при проверке статуса бота:', error)
    return false
  }
}

/**
 * Форматирует дату и время в человекочитаемый формат
 * @param {Date} date - Дата для форматирования
 * @returns {string} Отформатированная дата и время
 */
function formatDateTime(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

/**
 * Форматирует сообщение для пользователя
 * @param {Object} user - Данные пользователя
 * @param {string} action - Тип действия (вход/выход)
 * @param {string} deviceInfo - Информация об устройстве
 * @returns {string} Отформатированное сообщение
 */
function formatUserMessage(user, action, deviceInfo) {
  const time = formatDateTime(new Date())
  const name = user.first_name || user.username || 'Пользователь'
  
  return `🔔 ${action} в систему
👤 ${name}
🕒 ${time}
💻 ${deviceInfo}`
}

/**
 * Получает информацию об устройстве пользователя
 * @returns {string} Информация об устройстве
 */
function getDeviceInfo() {
  const userAgent = navigator.userAgent
  const platform = navigator.platform
  const vendor = navigator.vendor || ''
  
  let deviceInfo = 'Неизвестное устройство'
  
  if (userAgent.includes('Windows')) {
    deviceInfo = 'Windows'
  } else if (userAgent.includes('Mac')) {
    deviceInfo = 'MacOS'
  } else if (userAgent.includes('Linux')) {
    deviceInfo = 'Linux'
  } else if (userAgent.includes('Android')) {
    deviceInfo = 'Android'
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    deviceInfo = 'iOS'
  }
  
  if (userAgent.includes('Chrome')) {
    deviceInfo += ' / Chrome'
  } else if (userAgent.includes('Firefox')) {
    deviceInfo += ' / Firefox'
  } else if (userAgent.includes('Safari')) {
    deviceInfo += ' / Safari'
  } else if (userAgent.includes('Edge')) {
    deviceInfo += ' / Edge'
  }
  
  return deviceInfo
}

/**
 * Отправляет запрос к Telegram Bot API с таймаутом
 * @param {string} method - Метод API
 * @param {Object} params - Параметры запроса
 * @returns {Promise<Response>}
 */
async function sendTelegramRequest(method, params = {}) {
  const token = getBotToken()
  if (!token) {
    console.error('Токен бота не настроен')
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const url = `${TELEGRAM_API}/bot${token}/${method}`
    console.debug('Отправка запроса к Telegram:', { method, url })

    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.warn(`Telegram API вернул ошибку (${response.status}):`, data)
      return null
    }
    
    if (!data.ok) {
      console.warn('Telegram API вернул ошибку в ответе:', data.description)
      return null
    }
    
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Таймаут запроса к Telegram API')
    } else {
      console.warn('Ошибка запроса к Telegram API:', error)
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

export const botApi = {
  /**
   * Проверяет доступность бота
   * @returns {Promise<boolean>}
   */
  checkBot: checkBotStatus,

  /**
   * Отправляет уведомление пользователю о начале сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionStart(user) {
    if (!user || !user.id) {
      console.warn('Не удалось отправить уведомление: отсутствуют данные пользователя')
      return
    }

    // Проверяем статус бота перед отправкой
    const botAvailable = await checkBotStatus()
    if (!botAvailable) {
      console.warn('Бот недоступен, уведомление не будет отправлено')
      return
    }

    const deviceInfo = getDeviceInfo()
    const message = formatUserMessage(user, 'Вход', deviceInfo)
    
    try {
      const result = await sendTelegramRequest('sendMessage', {
        chat_id: user.id,
        text: message,
        parse_mode: 'HTML'
      })
      
      if (result) {
        console.debug('Уведомление о входе отправлено успешно')
      }
    } catch (error) {
      console.warn('Ошибка при отправке уведомления о входе:', error)
    }
  },

  /**
   * Отправляет уведомление пользователю о завершении сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionEnd(user) {
    if (!user || !user.id) {
      console.warn('Не удалось отправить уведомление: отсутствуют данные пользователя')
      return
    }

    // Проверяем статус бота перед отправкой
    const botAvailable = await checkBotStatus()
    if (!botAvailable) {
      console.warn('Бот недоступен, уведомление не будет отправлено')
      return
    }

    const deviceInfo = getDeviceInfo()
    const message = formatUserMessage(user, 'Выход', deviceInfo)
    
    try {
      const result = await sendTelegramRequest('sendMessage', {
        chat_id: user.id,
        text: message,
        parse_mode: 'HTML'
      })
      
      if (result) {
        console.debug('Уведомление о выходе отправлено успешно')
      }
    } catch (error) {
      console.warn('Ошибка при отправке уведомления о выходе:', error)
    }
  }
}
