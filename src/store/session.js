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
      console.log('Начало создания сессии для пользователя:', user)
      
      if (!user || !user.id) {
        console.error('Некорректные данные пользователя:', user)
        throw new Error('Некорректные данные пользователя')
      }

      // Сохраняем данные пользователя
      Cookies.set(USER_COOKIE, JSON.stringify(user), { expires: 30 }) // Хранить 30 дней
      console.log('Данные пользователя сохранены в куки')
      
      // Создаем сессию
      Cookies.set(SESSION_COOKIE, 'true', { expires: 1 }) // Сессия живет 1 день
      console.log('Сессия создана')
      
      // Обновляем кэш
      userDataCache = user
      sessionStatusCache = true
      console.log('Кэш обновлен')
      
      // Проверяем доступность бота перед отправкой уведомления
      const botAvailable = await botApi.checkBot()
      if (!botAvailable) {
        console.warn('Бот недоступен, уведомление о входе не будет отправлено')
        return
      }
      
      // Отправляем уведомление боту
      console.log('Отправка уведомления о входе...')
      try {
        await botApi.notifySessionStart(user)
        console.log('Уведомление о входе успешно отправлено')
      } catch (error) {
        console.warn('Ошибка при отправке уведомления о входе:', error)
        // Игнорируем ошибки уведомлений, они не должны блокировать работу
      }
    } catch (error) {
      console.error('Ошибка при создании сессии:', error)
      throw error
    }
  },

  async endSession() {
    try {
      console.log('Начало завершения сессии')
      const user = this.getUserData()
      
      if (user && user.id) {
        console.log('Отправка уведомления о выходе...')
        try {
          await botApi.notifySessionEnd(user)
          console.log('Уведомление о выходе успешно отправлено')
        } catch (error) {
          console.warn('Ошибка при отправке уведомления о выходе:', error)
          // Игнорируем ошибки уведомлений
        }
      } else {
        console.warn('Нет данных пользователя для отправки уведомления о выходе')
      }
      
      // При выходе удаляем сессию и кэш
      Cookies.remove(SESSION_COOKIE)
      sessionStatusCache = false
      userDataCache = null
      console.log('Сессия завершена, кэш очищен')
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
    const hasSession = !!Cookies.get(SESSION_COOKIE)
    console.log('Проверка сессии:', hasSession ? 'активна' : 'неактивна')
    sessionStatusCache = hasSession
    return hasSession
  },

  getUserData() {
    // Используем кэш если он есть
    if (userDataCache !== null) {
      return userDataCache
    }
    
    try {
      const userCookie = Cookies.get(USER_COOKIE)
      if (!userCookie) {
        console.log('Куки пользователя не найдены')
        return {}
      }
      
      const userData = JSON.parse(userCookie)
      console.log('Получены данные пользователя из куки:', userData)
      userDataCache = userData // Кэшируем результат
      return userData
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error)
      return {}
    }
  }
}
