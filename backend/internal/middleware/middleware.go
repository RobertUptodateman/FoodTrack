package middleware

import (
	"net/http"
)

// NoCache is a middleware that sets headers to prevent caching
func NoCache(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set headers to prevent caching
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
