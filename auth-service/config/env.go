package config

import (
	"log"
	"os"
)


var AppConfig Config

type Config struct {
	Port      string
	MongoURI  string
	JWTSecret string
	FrontendURL string
}

func InitConfig() {
	AppConfig = Config{
		Port:      getEnv("PORT", "8081"),
		MongoURI:  getEnv("MONGO_URI", ""),
		JWTSecret: getEnv("JWT_SECRET", ""),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3001"),
	}

	
	if AppConfig.MongoURI == "" {
		log.Fatal("FATAL: MONGO_URI environment variable is not set")
	}
	if AppConfig.JWTSecret == "" {
		log.Fatal("FATAL: JWT_SECRET environment variable is not set")
	}

	log.Printf("Config loaded from OS (Port: %s)", AppConfig.Port)
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}