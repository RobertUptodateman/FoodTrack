import Cookies from 'js-cookie'

const SESSION_COOKIE = 'foodtrack_session'
const USER_COOKIE = 'foodtrack_user'

export const sessionStore = {
  startSession(user) {
    // Сохраняем данные пользователя
    Cookies.set(USER_COOKIE, JSON.stringify(user), { expires: 30 }) // Хранить 30 дней
    // Создаем сессию
    Cookies.set(SESSION_COOKIE, 'true', { expires: 1 }) // Сессия живет 1 день
  },

  endSession() {
    // При выходе удаляем только сессию, сохраняя данные пользователя
    Cookies.remove(SESSION_COOKIE)
  },

  hasValidSession() {
    return !!Cookies.get(SESSION_COOKIE)
  },

  getUserData() {
    return JSON.parse(Cookies.get(USER_COOKIE) || '{}')
  }
}
