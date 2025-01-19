package handlers

import (
    "html/template"
    "net/http"
    "path/filepath"
)

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

// loadTemplates загружает шаблоны из директории templates
func (h *StaticHandler) loadTemplates() (*template.Template, error) {
    return template.ParseGlob(filepath.Join(h.StaticDir, "templates/*.html"))
}

// ServeFavicon обрабатывает запрос favicon.ico
func (h *StaticHandler) ServeFavicon(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, filepath.Join(h.StaticDir, "media/favicon.ico"))
}

// ServeHome обрабатывает запрос главной страницы
func (h *StaticHandler) ServeHome(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path != "/" {
        http.NotFound(w, r)
        return
    }

    tmpl, err := h.loadTemplates()
    if err != nil {
        http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
        return
    }

    session, _ := store.Get(r, "session-name")
    userID, _ := session.Values["user_id"].(int64)

    data := map[string]interface{}{
        "UserID": userID,
    }

    if err := tmpl.ExecuteTemplate(w, "index.html", data); err != nil {
        http.Error(w, "Ошибка рендеринга шаблона", http.StatusInternalServerError)
        return
    }
}
