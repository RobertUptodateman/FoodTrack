package handlers

import (
	"encoding/json"
	"net/http"
	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore([]byte("your-secret-key"))

type TelegramAuthData struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	PhotoURL  string `json:"photo_url"`
	AuthDate  int64  `json:"auth_date"`
	Hash      string `json:"hash"`
}

// IsAuthenticated проверяет, авторизован ли пользователь
func IsAuthenticated(r *http.Request) bool {
	session, err := store.Get(r, "session-name")
	if err != nil {
		return false
	}
	
	_, ok := session.Values["user_id"]
	return ok
}

// RequireAuth middleware для проверки авторизации
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !IsAuthenticated(r) {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}
		next(w, r)
	}
}

func TelegramAuthCallback(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
		return
	}

	var authData TelegramAuthData
	if err := json.NewDecoder(r.Body).Decode(&authData); err != nil {
		http.Error(w, "Ошибка при чтении данных авторизации", http.StatusBadRequest)
		return
	}

	// Создаем сессию для пользователя
	session, _ := store.Get(r, "session-name")
	session.Values["user_id"] = authData.ID
	session.Values["username"] = authData.Username
	session.Save(r, w)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
	})
}

// Logout завершает сессию пользователя
func Logout(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, "Ошибка при получении сессии", http.StatusInternalServerError)
		return
	}

	// Очищаем сессию
	session.Values = make(map[interface{}]interface{})
	session.Options.MaxAge = -1
	
	if err := session.Save(r, w); err != nil {
		http.Error(w, "Ошибка при удалении сессии", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
