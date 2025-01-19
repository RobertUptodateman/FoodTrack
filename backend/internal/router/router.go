package router

import (
	"net/http"

	"foodtrack/backend/internal/handlers"
	"foodtrack/backend/internal/middleware"
)

// Setup настраивает маршрутизацию
func Setup(staticHandler *handlers.StaticHandler) {
	// Отдаём статические файлы без кэширования
	fs := middleware.NoCache(http.FileServer(http.Dir("frontend")))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Обработчик для favicon.ico
	http.HandleFunc("/favicon.ico", staticHandler.ServeFavicon)

	// Главная страница без кэширования
	http.HandleFunc("/", middleware.NoCache(http.HandlerFunc(staticHandler.ServeHome)).ServeHTTP)
}
