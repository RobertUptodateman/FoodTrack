package router

import (
	"log"
	"net/http"

	"foodtrack/backend/internal/handlers"
	"foodtrack/backend/internal/middleware"
)

// Setup настраивает маршрутизацию
func Setup(staticHandler *handlers.StaticHandler) {
	// Отдаём статические файлы без кэширования
	// Для стилей
	http.HandleFunc("/static/styles/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Запрос к стилям: %s", r.URL.Path)
		handler := middleware.NoCache(http.StripPrefix("/static/styles/", http.FileServer(http.Dir("frontend/styles"))))
		handler.ServeHTTP(w, r)
	})
	
	// Для медиафайлов
	http.HandleFunc("/static/media/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Запрос к медиа: %s", r.URL.Path)
		handler := middleware.NoCache(http.StripPrefix("/static/media/", http.FileServer(http.Dir("frontend/media"))))
		handler.ServeHTTP(w, r)
	})

	// Для JavaScript
	http.HandleFunc("/static/js/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Запрос к JS: %s", r.URL.Path)
		handler := middleware.NoCache(http.StripPrefix("/static/js/", http.FileServer(http.Dir("frontend/js"))))
		handler.ServeHTTP(w, r)
	})

	// Обработчик для favicon.ico без кэширования
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Запрос favicon.ico")
		middleware.NoCache(http.HandlerFunc(staticHandler.ServeFavicon)).ServeHTTP(w, r)
	})

	// Авторизация через Telegram
	http.HandleFunc("/auth/telegram/callback", middleware.NoCache(http.HandlerFunc(handlers.TelegramAuthCallback)).ServeHTTP)

	// Главная страница без кэширования
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		log.Printf("Запрос к главной странице: %s", r.URL.Path)
		middleware.NoCache(http.HandlerFunc(staticHandler.ServeHome)).ServeHTTP(w, r)
	})
}
