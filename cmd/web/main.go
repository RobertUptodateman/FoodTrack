package main

import (
	"log"
	"net/http"
)

// TODO: Удалить функцию noCache при релизе
// 
// При релизе эта функция и её использование должны быть удалены.
// Сейчас она используется только для разработки, чтобы видеть изменения 
// в статических файлах без перезапуска сервера.
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
	// 
	// При релизе:
	// 1. Убрать обёртку noCache
	// 2. Заменить на: http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.Handle("/static/", noCache(http.StripPrefix("/static/", fs)))

	// Главная страница
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// TODO: Настроить кэширование для production
		// 
		// При релизе:
		// 1. Удалить отключение кэширования
		// 2. Добавить правильные заголовки для кэширования статики
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
