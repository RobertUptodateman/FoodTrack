import Cookies from 'js-cookie'
import { botApi } from '../services/botApi'

const SESSION_COOKIE = 'foodtrack_session'
const USER_COOKIE = 'foodtrack_user'

// Кэш данных пользователя
let userDataCache = null
let sessionStatusCache = null

export const sessionStore = {
  async startSession(user) {
    try {
      // Сохраняем данные пользователя
      Cookies.set(USER_COOKIE, JSON.stringify(user), { expires: 30 }) // Хранить 30 дней
      // Создаем сессию
      Cookies.set(SESSION_COOKIE, 'true', { expires: 1 }) // Сессия живет 1 день
      
      // Обновляем кэш
      userDataCache = user
      sessionStatusCache = true
      
      // Отправляем уведомление боту асинхронно
      botApi.notifySessionStart(user).catch(() => {
        // Игнорируем ошибки уведомлений, они не должны блокировать работу
      })
    } catch (error) {
      console.error('Ошибка при создании сессии:', error)
      throw error
    }
  },

  async endSession() {
    try {
      const user = this.getUserData()
      
      // Отправляем уведомление боту асинхронно перед удалением сессии
      if (user && user.id) {
        botApi.notifySessionEnd(user).catch(() => {
          // Игнорируем ошибки уведомлений
        })
      }
      
      // При выходе удаляем сессию и кэш
      Cookies.remove(SESSION_COOKIE)
      sessionStatusCache = false
      userDataCache = null
    } catch (error) {
      console.error('Ошибка при завершении сессии:', error)
      throw error
    }
  },

  hasValidSession() {
    // Используем кэш если он есть
    if (sessionStatusCache !== null) {
      return sessionStatusCache
    }
    
    // Иначе проверяем куки и кэшируем результат
    sessionStatusCache = !!Cookies.get(SESSION_COOKIE)
    return sessionStatusCache
  },

  getUserData() {
    // Используем кэш если он есть
    if (userDataCache !== null) {
      return userDataCache
    }
    
    try {
      const userData = JSON.parse(Cookies.get(USER_COOKIE) || '{}')
      userDataCache = userData // Кэшируем результат
      return userData
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error)
      return {}
    }
  }
}
