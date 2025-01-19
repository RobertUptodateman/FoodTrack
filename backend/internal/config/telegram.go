package config

import "os"

// TelegramConfig содержит настройки для авторизации через Telegram
type TelegramConfig struct {
	BotToken    string
	BotUsername string
}

// GetTelegramConfig возвращает конфигурацию для Telegram
func GetTelegramConfig() *TelegramConfig {
	return &TelegramConfig{
		BotToken:    os.Getenv("TELEGRAM_BOT_TOKEN"),
		BotUsername: os.Getenv("TELEGRAM_BOT_USERNAME"),
	}
}
