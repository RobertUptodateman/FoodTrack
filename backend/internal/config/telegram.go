package config

// TelegramConfig содержит настройки для авторизации через Telegram
type TelegramConfig struct {
	BotToken    string
	BotUsername string
}

// GetTelegramConfig возвращает конфигурацию для Telegram
func GetTelegramConfig() *TelegramConfig {
	return &TelegramConfig{
		BotToken:    "8064108701:AAHbI9ttk2oJ5oUgUXy8ugFby1cQtkUpSVs", // Вставьте сюда токен от BotFather
		BotUsername: "FoodTrackAuthBot",
	}
}
