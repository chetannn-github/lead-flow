package main

import (
	"log"
	"github.com/chetannn-github/lead-flow/auth-service/config"
	"github.com/chetannn-github/lead-flow/auth-service/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	config.InitConfig()
	config.ConnectDB(config.AppConfig.MongoURI)
	app := gin.Default()

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			config.AppConfig.FrontendURL,
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},
		AllowCredentials: true,
	}))

	routes.AuthRoutes(app)

	app.GET("/api/auth/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Auth Service is healthy"})
	})

	log.Printf("Auth Service starting on port %s", config.AppConfig.Port)
	app.Run(":" + config.AppConfig.Port)
}