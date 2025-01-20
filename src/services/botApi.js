// Конфигурация бота
const TELEGRAM_API = 'https://api.telegram.org'
const API_TIMEOUT = 5000 // 5 секунд таймаут
const POLLING_INTERVAL = 1000 // Интервал опроса в миллисекундах

// Команды бота и их описания
const BOT_COMMANDS = {
  START: '/start',
  STOP: '/stop',
  HELP: '/help',
  SETTINGS: '/settings'
}

const COMMAND_DESCRIPTIONS = [
  { command: 'start', description: 'Начать работу с ботом' },
  { command: 'stop', description: 'Отключить уведомления' },
  { command: 'help', description: 'Показать справку' },
  { command: 'settings', description: 'Настройки уведомлений' }
]

// Получаем токен из переменных окружения или конфигурации
function getBotToken() {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  if (!token) {
    console.error('Токен бота не найден в переменных окружения')
    return null
  }
  return token.trim()
}

/**
 * Устанавливает команды бота
 */
async function setCommands() {
  try {
    const result = await sendTelegramRequest('setMyCommands', {
      commands: COMMAND_DESCRIPTIONS
    })
    
    if (result && result.ok) {
      console.info('Команды бота успешно установлены')
    } else {
      console.warn('Не удалось установить команды бота')
    }
  } catch (error) {
    console.error('Ошибка при установке команд бота:', error)
  }
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
      // Устанавливаем команды при успешном подключении
      await setCommands()
      return true
    }
    return false
  } catch (error) {
    console.error('Ошибка при проверке статуса бота:', error)
    return false
  }
}

/**
 * Отправляет сообщение с приветствием и ссылкой на авторизацию
 * @param {number} chatId - ID чата пользователя
 * @returns {Promise<boolean>}
 */
async function sendStartMessage(chatId) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://foodtrack.site'
  const loginUrl = `${siteUrl}/auth`

  return await sendMessage(
    chatId,
    `🎉 <b>Добро пожаловать в FoodTrack!</b>\n\n` +
    `Для продолжения работы войдите на сайт:\n` +
    `👉 <a href="${loginUrl}">Войти через Telegram</a>\n\n` +
    `Отправьте /help чтобы узнать больше о возможностях бота.`,
    { disable_web_page_preview: true }
  )
}

/**
 * Отправляет сообщение с помощью
 * @param {number} chatId - ID чата пользователя
 * @returns {Promise<boolean>}
 */
async function sendHelpMessage(chatId) {
  const commandsList = COMMAND_DESCRIPTIONS
    .map(cmd => `/${cmd.command} - ${cmd.description}`)
    .join('\n')

  return await sendMessage(
    chatId,
    `ℹ️ <b>Доступные команды:</b>\n\n${commandsList}\n\n` +
    `После входа вы будете получать уведомления о входе в систему с новых устройств.`
  )
}

/**
 * Отправляет сообщение конкретному пользователю
 * @param {number} chatId - ID чата пользователя
 * @param {string} text - Текст сообщения
 * @param {Object} options - Дополнительные параметры
 * @returns {Promise<boolean>}
 */
async function sendMessage(chatId, text, options = {}) {
  if (!chatId || !text) {
    console.warn('Не указан ID чата или текст сообщения')
    return false
  }

  try {
    const result = await sendTelegramRequest('sendMessage', {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      ...options
    })

    return result && result.ok
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error)
    return false
  }
}

/**
 * Обрабатывает новые сообщения от пользователей
 * @param {number} offset - Смещение для получения новых сообщений
 * @returns {Promise<number>} Новое значение offset
 */
async function handleUpdates(offset = 0) {
  try {
    const updates = await sendTelegramRequest('getUpdates', {
      offset,
      timeout: 30,
      allowed_updates: ['message']
    })

    if (!updates || !updates.ok) {
      console.warn('Не удалось получить обновления')
      return offset
    }

    for (const update of updates.result) {
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id
        const text = update.message.text

        switch (text) {
          case BOT_COMMANDS.START:
            await sendStartMessage(chatId)
            break
          case BOT_COMMANDS.STOP:
            await sendMessage(
              chatId, 
              '🔕 <b>Уведомления отключены</b>\n\n' +
              'Чтобы снова включить уведомления, отправьте команду /start'
            )
            break
          case BOT_COMMANDS.HELP:
            await sendHelpMessage(chatId)
            break
          case BOT_COMMANDS.SETTINGS:
            await sendMessage(
              chatId,
              '⚙️ <b>Настройки</b>\n\n' +
              'В данный момент доступны следующие настройки:\n' +
              '• Включение/отключение уведомлений - используйте команды /start и /stop'
            )
            break
        }
      }
      // Обновляем offset для следующего запроса
      offset = update.update_id + 1
    }

    return offset
  } catch (error) {
    console.error('Ошибка при обработке обновлений:', error)
    return offset
  }
}

/**
 * Проверяет наличие команды /start в истории сообщений
 * @param {number} userId - ID пользователя Telegram
 * @returns {Promise<boolean>}
 */
async function checkStartCommand(userId) {
  try {
    const result = await sendTelegramRequest('getUpdates', {
      offset: -1,
      limit: 100
    })

    if (!result || !result.ok) {
      console.warn('Не удалось получить историю сообщений')
      return false
    }

    const hasStart = result.result.some(update => 
      update.message && 
      update.message.from && 
      update.message.from.id === userId &&
      update.message.text === '/start'
    )

    if (!hasStart) {
      console.warn('Команда /start не найдена в истории сообщений')
    }

    return hasStart
  } catch (error) {
    console.error('Ошибка при проверке команды /start:', error)
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
    throw new Error('Токен бота не найден')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания запроса')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
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

    // Если указан ID пользователя, проверяем наличие команды /start
    if (userId) {
      return await checkStartCommand(userId)
    }

    return true
  },

  /**
   * Отправляет уведомление о начале сессии
   * @param {Object} user - Данные пользователя Telegram
   */
  async notifySessionStart(user) {
    if (!user || !user.id) return

    const deviceInfo = getDeviceInfo()
    const message = formatUserMessage(user, 'Вход', deviceInfo)
    
    await sendMessage(user.id, message)
  },

  /**
   * Отправляет уведомление о завершении сессии
   * @param {Object} user - Данные пользователя Telegram
   */
  async notifySessionEnd(user) {
    if (!user || !user.id) return

    const deviceInfo = getDeviceInfo()
    const message = formatUserMessage(user, 'Выход', deviceInfo)
    
    await sendMessage(user.id, message)
  }
}

// Вспомогательные функции для форматирования сообщений
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

function formatUserMessage(user, action, deviceInfo) {
  const time = formatDateTime(new Date())
  const name = user.first_name || user.username || 'Пользователь'
  
  return `🔔 ${action} в систему
👤 ${name}
🕒 ${time}
💻 ${deviceInfo}`
}

function getDeviceInfo() {
  const userAgent = navigator.userAgent
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
 * Запускает длинный опрос для получения обновлений
 */
async function startPolling() {
  let offset = 0
  
  while (true) {
    try {
      offset = await handleUpdates(offset)
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL))
    } catch (error) {
      console.error('Ошибка в цикле опроса:', error)
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL * 5))
    }
  }
}

// Запускаем опрос обновлений при загрузке модуля
startPolling().catch(console.error)
