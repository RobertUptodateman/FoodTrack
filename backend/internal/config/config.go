package config

// Config содержит конфигурацию приложения
type Config struct {
	Port string
	Env  string
}

// New создает новый экземпляр конфигурации
func New() *Config {
	return &Config{
		Port: ":8080",
		Env:  "development",
	}
}
