const BOT_API_URL = 'https://robertuptodateman.github.io/FoodTrack/api/bot'

export const botApi = {
  /**
   * Отправляет уведомление боту о начале сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionStart(user) {
    try {
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
          timestamp: new Date().toISOString()
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
   * Отправляет уведомление боту о завершении сессии
   * @param {Object} user - Данные пользователя Telegram
   * @returns {Promise<void>}
   */
  async notifySessionEnd(user) {
    try {
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
          timestamp: new Date().toISOString()
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
