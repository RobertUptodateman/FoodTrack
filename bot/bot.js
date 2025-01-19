const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Загружаем токен бота из переменных окружения
const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Обработчик webhook'ов от Telegram
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Проверяем, что это команда /start
    if (message && message.text === '/start') {
      // Отправляем приветственное сообщение
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: '<b>Диалог начат</b>\nТеперь вы можете войти через Telegram на сайте.',
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        console.error('Ошибка при отправке сообщения:', await response.text());
        return res.status(500).json({ error: 'Ошибка при отправке сообщения' });
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Ошибка при обработке webhook:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Настройка webhook'а при запуске сервера
async function setupWebhook() {
  try {
    const webhookUrl = `https://foodtrack.onrender.com/webhook/${BOT_TOKEN}`;
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message']
      })
    });

    const result = await response.json();
    if (result.ok) {
      console.log('Webhook успешно настроен:', webhookUrl);
    } else {
      console.error('Ошибка при настройке webhook:', result);
    }
  } catch (error) {
    console.error('Ошибка при настройке webhook:', error);
  }
}

// Запускаем сервер
app.listen(port, () => {
  console.log(`Бот запущен на порту ${port}`);
  setupWebhook();
});
