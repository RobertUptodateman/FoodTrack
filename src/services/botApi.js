// Конфигурация бота
const TELEGRAM_API = 'https://api.telegram.org'
const API_TIMEOUT = 5000 // 5 секунд таймаут

// Команды бота
const BOT_COMMANDS = {
  START: '/start',
  HELP: '/help',
  SETTINGS: '/settings'
}

// Получаем токен из переменных окружения или конфигурации
function getBotToken() {
  // В Vite.js все переменные окружения должны начинаться с VITE_
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  if (!token) {
    console.error('Токен бота не найден в переменных окружения')
    return null
  }
  return token.trim()
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
 * Устанавливает команды бота и настраивает webhook
 * @returns {Promise<boolean>}
 */
async function setCommands() {
  const commands = [
    {
      command: 'start',
      description: 'Начать диалог с ботом'
    },
    {
      command: 'help',
      description: 'Показать справку'
    },
    {
      command: 'settings',
      description: 'Настройки уведомлений'
    }
  ]

  try {
    // Устанавливаем команды
    const result = await sendTelegramRequest('setMyCommands', {
      commands: commands
    })

    // Отправляем приветственное сообщение при команде /start
    // Для этого используем метод answerCallbackQuery
    if (result && result.ok) {
      console.debug('Команды бота успешно установлены')
      return true
    }

    return false
  } catch (error) {
    console.error('Ошибка при установке команд бота:', error)
    return false
  }
}

/**
 * Отправляет приветственное сообщение в ответ на команду /start
 * @param {number} chatId - ID чата пользователя
 * @returns {Promise<boolean>}
 */
async function sendStartMessage(chatId) {
  if (!chatId) {
    console.warn('Не указан ID чата для отправки приветственного сообщения')
    return false
  }

  try {
    const result = await sendTelegramRequest('sendMessage', {
      chat_id: chatId,
      text: '<b>Диалог начат</b>\nТеперь вы можете войти через Telegram на сайте.',
      parse_mode: 'HTML'
    })

    return result && result.ok
  } catch (error) {
    console.error('Ошибка при отправке приветственного сообщения:', error)
    return false
  }
}

/**
 * Отправляет приветственное сообщение в чат
 * @param {number} chatId - ID чата пользователя
 * @returns {Promise<boolean>}
 */
async function sendWelcomeMessage(chatId) {
  try {
    const result = await sendTelegramRequest('sendMessage', {
      chat_id: chatId,
      text: '<b>Диалог начат</b>\nТеперь вы можете войти через Telegram на сайте.',
      parse_mode: 'HTML'
    })

    return result && result.ok
  } catch (error) {
    console.error('Ошибка при отправке приветственного сообщения:', error)
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
 * Проверяет, что пользователь начал диалог с ботом
 * @param {number} userId - ID пользователя Telegram
 * @returns {Promise<boolean>}
 */
async function checkUserChat(userId) {
  if (!userId) {
    console.warn('Не указан ID пользователя для проверки чата')
    return false
  }

  try {
    // Проверяем доступ к чату пользователя через getChat
    const result = await sendTelegramRequest('getChat', {
      chat_id: userId
    })

    // Если запрос успешен и чат активен, значит у бота есть доступ
    if (result && result.ok && result.result.id) {
      console.debug('Чат пользователя доступен:', {
        chatId: result.result.id,
        type: result.result.type
      })
      return true
    }

    console.warn('Чат пользователя недоступен:', result)
    return false
  } catch (error) {
    console.error('Ошибка при проверке чата пользователя:', error)
    return false
  }
}

/**
 * Обрабатывает входящие сообщения от Telegram
 * @param {Object} update - Объект обновления от Telegram
 * @returns {Promise<boolean>}
 */
async function handleUpdate(update) {
  try {
    // Проверяем, что это сообщение с командой /start
    if (update.message && update.message.text === '/start') {
      return await sendWelcomeMessage(update.message.chat.id)
    }
    return true
  } catch (error) {
    console.error('Ошибка при обработке обновления:', error)
    return false
  }
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
    console.debug('Отправка запроса к Telegram:', { 
      method, 
      url: url.replace(token, '***'), // Скрываем токен в логах
      params 
    })

    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
    
    console.debug('Получен ответ от Telegram:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error(`Telegram API вернул ошибку (${response.status}):`, {
        error: data,
        request: {
          method,
          params
        }
      })
      return null
    }
    
    if (!data.ok) {
      console.error('Telegram API вернул ошибку в ответе:', {
        description: data.description,
        errorCode: data.error_code,
        request: {
          method,
          params
        }
      })
      return null
    }
    
    console.debug('Успешный ответ от Telegram:', {
      method,
      result: data.result
    })
    
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Таймаут запроса к Telegram API:', {
        method,
        timeout: API_TIMEOUT
      })
    } else {
      console.error('Ошибка запроса к Telegram API:', {
        error: error.message,
        method,
        params
      })
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Проверяет доступность бота и наличие диалога с пользователем
 * @param {number} userId - ID пользователя Telegram
 * @returns {Promise<boolean>}
 */
async function checkBot(userId = null) {
  // Сначала проверяем общую доступность бота
  const botAvailable = await checkBotStatus()
  if (!botAvailable) {
    return false
  }

  // Если указан ID пользователя, проверяем наличие диалога
  if (userId) {
    return await checkUserChat(userId)
  }

  return true
}

export const botApi = {
  /**
   * Проверяет доступность бота и наличие диалога с пользователем
   * @param {number} userId - ID пользователя Telegram
   * @returns {Promise<boolean>}
   */
  async checkBot(userId = null) {
    // Сначала проверяем общую доступность бота
    const botAvailable = await checkBotStatus()
    if (!botAvailable) {
      return false
    }

    // Если указан ID пользователя, проверяем наличие диалога
    if (userId) {
      return await checkUserChat(userId)
    }

    return true
  },

  /**
   * Устанавливает команды бота и настраивает webhook
   * @returns {Promise<boolean>}
   */
  setCommands,

  /**
   * Отправляет приветственное сообщение в ответ на команду /start
   * @param {number} chatId - ID чата пользователя
   * @returns {Promise<boolean>}
   */
  sendStartMessage,

  /**
   * Обрабатывает входящие сообщения от Telegram
   * @param {Object} update - Объект обновления от Telegram
   * @returns {Promise<boolean>}
   */
  handleUpdate,

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
