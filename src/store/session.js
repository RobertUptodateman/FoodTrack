import Cookies from 'js-cookie'
import { botApi } from '../services/botApi'

const SESSION_COOKIE = 'foodtrack_session'
const USER_COOKIE = 'foodtrack_user'

export const sessionStore = {
  async startSession(user) {
    // Сохраняем данные пользователя
    Cookies.set(USER_COOKIE, JSON.stringify(user), { expires: 30 }) // Хранить 30 дней
    // Создаем сессию
    Cookies.set(SESSION_COOKIE, 'true', { expires: 1 }) // Сессия живет 1 день
    
    // Отправляем уведомление боту
    await botApi.notifySessionStart(user)
  },

  async endSession() {
    const user = this.getUserData()
    // Отправляем уведомление боту перед удалением сессии
    if (user && user.id) {
      await botApi.notifySessionEnd(user)
    }
    
    // При выходе удаляем только сессию, сохраняя данные пользователя
    Cookies.remove(SESSION_COOKIE)
  },

  hasValidSession() {
    return !!Cookies.get(SESSION_COOKIE)
  },

  getUserData() {
    try {
      return JSON.parse(Cookies.get(USER_COOKIE) || '{}')
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error)
      return {}
    }
  }
}
