package handlers

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// StaticHandler обрабатывает статические файлы и шаблоны
type StaticHandler struct {
	staticPath string
	templates  *template.Template
}

// NewStaticHandler создает новый обработчик статических файлов
func NewStaticHandler(defaultPath string) *StaticHandler {
	path := os.Getenv("PATH_TO_STATIC")
	if path == "" {
		path = defaultPath
	}
	
	// Проверяем существование директории
	if _, err := os.Stat(path); os.IsNotExist(err) {
		log.Printf("Внимание: директория %s не существует\n", path)
	}

	// Загружаем шаблоны
	tmpl := template.Must(template.ParseFiles(
		filepath.Join(path, "frontend/base.html"),
		filepath.Join(path, "frontend/index.html"),
		filepath.Join(path, "frontend/board.html"),
	))
	
	return &StaticHandler{
		staticPath: path,
		templates:  tmpl,
	}
}

// ServeHTTP обрабатывает HTTP запросы к статическим файлам
func (h *StaticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Получаем путь к файлу
	path := filepath.Join(h.staticPath, "frontend", r.URL.Path)
	
	// Проверяем существование файла
	if _, err := os.Stat(path); os.IsNotExist(err) {
		http.NotFound(w, r)
		return
	}
	
	// Отдаем файл
	http.ServeFile(w, r, path)
}

// ServeFavicon отдаёт favicon.ico
func (h *StaticHandler) ServeFavicon(w http.ResponseWriter, r *http.Request) {
	path := filepath.Join(h.staticPath, "frontend/media/favicon.ico")
	if _, err := os.Stat(path); os.IsNotExist(err) {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, path)
}

// ServeHome отдаёт главную страницу
func (h *StaticHandler) ServeHome(w http.ResponseWriter, r *http.Request) {
	data := struct {
		UserID string
	}{
		UserID: "", // TODO: Получать из сессии
	}
	
	err := h.templates.ExecuteTemplate(w, "index.html", data)
	if err != nil {
		log.Printf("Ошибка при рендеринге шаблона: %v\n", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
