// Конфигурация бота
const BOT_TOKEN = '6883937698:AAGBxA_RZkAYPNxRWwNTqXYxZYGPDWwrwBg'
const TELEGRAM_API = 'https://api.telegram.org/bot'
const API_TIMEOUT = 5000 // 5 секунд таймаут

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
async function sendTelegramRequest(method, params) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(`${TELEGRAM_API}${BOT_TOKEN}/${method}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      console.warn(`Telegram API вернул статус ${response.status}:`, await response.text())
      return null
    }
    
    return response
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
   * Отправляет уведомление пользователю о начале сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionStart(user) {
    if (!user || !user.id) return

    const deviceInfo = getDeviceInfo()
    const message = formatUserMessage(user, 'Вход', deviceInfo)
    
    await sendTelegramRequest('sendMessage', {
      chat_id: user.id,
      text: message,
      parse_mode: 'HTML'
    })
  },

  /**
   * Отправляет уведомление пользователю о завершении сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionEnd(user) {
    if (!user || !user.id) return

    const deviceInfo = getDeviceInfo()
    const message = formatUserMessage(user, 'Выход', deviceInfo)
    
    await sendTelegramRequest('sendMessage', {
      chat_id: user.id,
      text: message,
      parse_mode: 'HTML'
    })
  }
}
