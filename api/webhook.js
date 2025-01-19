import { botApi } from '../src/services/botApi'

export default async function handler(req, res) {
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Обрабатываем обновление от Telegram
    const result = await botApi.handleUpdate(req.body)
    
    // Отправляем ответ
    res.status(200).json({ ok: result })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
