package main

import (
	"log"
	"net/http"
)

// TODO: Удалить функцию noCache при релизе
// 
// Эта функция используется только для разработки, чтобы видеть изменения
// в статических файлах без перезапуска сервера. При релизе она должна быть удалена.
func noCache(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		h.ServeHTTP(w, r)
	})
}

func main() {
	// Обработка статических файлов
	fs := http.FileServer(http.Dir("static"))
	// TODO: Оптимизировать обработку статических файлов для production
	// 
	// 1. Убрать обёртку noCache
	// 2. Использовать базовый http.Handle("/static/", http.StripPrefix("/static/", fs))
	// 3. Настроить правильные заголовки кэширования
	http.Handle("/static/", noCache(http.StripPrefix("/static/", fs)))

	// Главная страница
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// TODO: Настроить правильное кэширование для production
		// 
		// 1. Удалить временное отключение кэширования
		// 2. Добавить правильные заголовки Cache-Control
		// 3. Настроить ETag или Last-Modified для оптимизации
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		http.ServeFile(w, r, "static/html/home.partial.html")
	})

	// Запуск сервера
	log.Println("Сервер запущен на http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
