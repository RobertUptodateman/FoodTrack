const BOT_API_URL = 'https://robertuptodateman.github.io/FoodTrack/api/bot'

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

export const botApi = {
  /**
   * Отправляет уведомление боту и пользователю о начале сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionStart(user) {
    try {
      const deviceInfo = getDeviceInfo()
      const message = formatUserMessage(user, 'Вход', deviceInfo)
      
      const response = await fetch(`${BOT_API_URL}/notify/session-start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          timestamp: new Date().toISOString(),
          deviceInfo,
          message // Сообщение для отправки пользователю
        })
      })

      if (!response.ok) {
        throw new Error(`Ошибка при отправке уведомления: ${response.status}`)
      }
    } catch (error) {
      console.error('Ошибка при отправке уведомления о начале сессии:', error)
    }
  },

  /**
   * Отправляет уведомление боту и пользователю о завершении сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionEnd(user) {
    try {
      const deviceInfo = getDeviceInfo()
      const message = formatUserMessage(user, 'Выход', deviceInfo)
      
      const response = await fetch(`${BOT_API_URL}/notify/session-end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          timestamp: new Date().toISOString(),
          deviceInfo,
          message // Сообщение для отправки пользователю
        })
      })

      if (!response.ok) {
        throw new Error(`Ошибка при отправке уведомления: ${response.status}`)
      }
    } catch (error) {
      console.error('Ошибка при отправке уведомления о завершении сессии:', error)
    }
  }
}
