package handlers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// StaticHandler обрабатывает статические файлы
type StaticHandler struct {
	staticPath string
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
	
	return &StaticHandler{
		staticPath: path,
	}
}

// ServeHTTP обрабатывает HTTP запросы к статическим файлам
func (h *StaticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Получаем путь к файлу
	path := filepath.Join(h.staticPath, r.URL.Path)
	
	// Проверяем существование файла
	if _, err := os.Stat(path); os.IsNotExist(err) {
		http.NotFound(w, r)
		return
	}
	
	// Отдаем файл
	http.ServeFile(w, r, path)
}
