package main

import (
	"log"
	"net/http"
)

// TODO: При релизе удалить функцию noCache
// Функция используется только для разработки, чтобы видеть изменения
// в статических файлах без перезапуска сервера
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
	// TODO: Оптимизировать обработку статических файлов
	// Заменить на http.Handle("/static/", http.StripPrefix("/static/", fs))
	// и убрать обёртку noCache при релизе
	http.Handle("/static/", noCache(http.StripPrefix("/static/", fs)))

	// Главная страница
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// TODO: Настроить кэширование для production
		// Добавить правильные заголовки Cache-Control и настроить ETag/Last-Modified
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
