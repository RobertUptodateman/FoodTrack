import Cookies from 'js-cookie'
import { ref } from 'vue'

const SESSION_COOKIE = 'foodtrack_session'
const USER_COOKIE = 'foodtrack_user'

export const useSession = () => {
  const isAuthenticated = ref(!!Cookies.get(SESSION_COOKIE))
  const userData = ref(JSON.parse(Cookies.get(USER_COOKIE) || '{}'))

  const startSession = (user) => {
    // Сохраняем данные пользователя
    Cookies.set(USER_COOKIE, JSON.stringify(user), { expires: 30 }) // Хранить 30 дней
    // Создаем сессию
    Cookies.set(SESSION_COOKIE, 'true', { expires: 1 }) // Сессия живет 1 день
    
    isAuthenticated.value = true
    userData.value = user
  }

  const endSession = () => {
    // При выходе удаляем только сессию, сохраняя данные пользователя
    Cookies.remove(SESSION_COOKIE)
    
    isAuthenticated.value = false
    userData.value = {}
  }

  const hasValidSession = () => {
    return !!Cookies.get(SESSION_COOKIE)
  }

  return {
    isAuthenticated,
    userData,
    startSession,
    endSession,
    hasValidSession
  }
}
