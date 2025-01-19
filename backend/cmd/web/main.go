package main

import (
	"log"
	"net/http"

	"foodtrack/backend/internal/config"
	"foodtrack/backend/internal/handlers"
	"foodtrack/backend/internal/router"
)

func main() {
	// Инициализация конфигурации
	cfg := config.New()

	// Инициализация обработчиков
	staticHandler := handlers.NewStaticHandler("frontend")

	// Настройка маршрутизации
	router.Setup(staticHandler)

	// Запуск сервера
	log.Printf("Сервер запущен на http://localhost%s\n", cfg.Port)
	if err := http.ListenAndServe(cfg.Port, nil); err != nil {
		log.Fatal(err)
	}
}