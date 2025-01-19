const BOT_API_URL = 'https://robertuptodateman.github.io/FoodTrack/api/bot'
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
  
  return ` ${action} в систему
 ${name}
 ${time}
 ${deviceInfo}`
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
 * Отправляет запрос с таймаутом
 * @param {string} url - URL для запроса
 * @param {Object} data - Данные для отправки
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, data) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(url, {
      method: 'GET', // Используем GET вместо POST для GitHub Pages
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      // Передаем данные через URL параметры
      credentials: 'omit' // Отключаем передачу куки
    })
    
    if (!response.ok) {
      // Игнорируем ошибки API, просто логируем их
      console.warn(`API вернул статус ${response.status}:`, await response.text())
      return null
    }
    
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Таймаут запроса к API')
    } else {
      console.warn('Ошибка запроса к API:', error)
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Кодирует объект в строку для URL
 * @param {Object} params - Параметры для кодирования
 * @returns {string} Закодированная строка параметров
 */
function encodeParams(params) {
  return Object.entries(params)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
}

export const botApi = {
  /**
   * Отправляет уведомление боту и пользователю о начале сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionStart(user) {
    const params = {
      userId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      timestamp: new Date().toISOString(),
      deviceInfo: getDeviceInfo(),
      type: 'session_start'
    }

    await fetchWithTimeout(`${BOT_API_URL}/notify?${encodeParams(params)}`)
  },

  /**
   * Отправляет уведомление боту и пользователю о завершении сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionEnd(user) {
    const params = {
      userId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      timestamp: new Date().toISOString(),
      deviceInfo: getDeviceInfo(),
      type: 'session_end'
    }

    await fetchWithTimeout(`${BOT_API_URL}/notify?${encodeParams(params)}`)
  }
}
