package main

import (
	"html/template"
	"log"
	"net/http"
)

var templates *template.Template

func init() {
	// Загружаем все шаблоны при старте
	var err error
	templates = template.New("templates")
	
	// Загружаем базовый шаблон
	templates, err = templates.ParseFiles(
		"static/html/layout.html",
		"static/html/partials/header.html",
		"static/html/partials/footer.html",
		"static/html/partials/coupon.html",
		"static/html/pages/home.html",
		"static/html/pages/auth.html",
	)
	if err != nil {
		log.Fatal("Ошибка загрузки шаблонов:", err)
	}
}

func noCache(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		h.ServeHTTP(w, r)
	})
}

func renderTemplate(w http.ResponseWriter, name string, data interface{}) {
	// Временно отключаем кэширование для разработки
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	err := templates.ExecuteTemplate(w, "layout", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func main() {
	// Обработка статических файлов
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", noCache(http.StripPrefix("/static/", fs)))

	// Главная страница
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		renderTemplate(w, "layout", nil)
	})

	// Страница входа
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		data := map[string]interface{}{
			"IsLogin": true,
		}
		renderTemplate(w, "layout", data)
	})

	// Страница регистрации
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		data := map[string]interface{}{
			"IsLogin": false,
		}
		renderTemplate(w, "layout", data)
	})

	// Запуск сервера
	log.Println("Сервер запущен на http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
