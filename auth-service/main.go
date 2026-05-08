package main

import (
	"log"
	"github.com/chetannn-github/lead-flow/auth-service/config"
	"github.com/chetannn-github/lead-flow/auth-service/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	config.InitConfig()
	config.ConnectDB(config.AppConfig.MongoURI)
	app := gin.Default()

	routes.AuthRoutes(app)

	app.GET("/api/auth/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Auth Service is healthy"})
	})

	log.Printf("Auth Service starting on port %s", config.AppConfig.Port)
	app.Run(":" + config.AppConfig.Port)
}