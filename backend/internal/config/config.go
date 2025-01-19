package config

import (
	"fmt"
	"os"
)

// Config содержит конфигурацию приложения
type Config struct {
	Port string
	Env  string
}

// New создает новый экземпляр конфигурации
func New() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	return &Config{
		Port: fmt.Sprintf(":%s", port),
		Env:  env,
	}
}
