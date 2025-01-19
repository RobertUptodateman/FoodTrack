package handlers

import "net/http"

// StaticHandler обрабатывает статические файлы
type StaticHandler struct {
	StaticDir string
}

// NewStaticHandler создает новый обработчик статических файлов
func NewStaticHandler(dir string) *StaticHandler {
	return &StaticHandler{
		StaticDir: dir,
	}
}

// ServeFavicon обрабатывает запрос favicon.ico
func (h *StaticHandler) ServeFavicon(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, h.StaticDir+"/img/favicon.ico")
}

// ServeHome обрабатывает запрос главной страницы
func (h *StaticHandler) ServeHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, h.StaticDir+"/public/index.html")
}
