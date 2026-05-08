package main

import (
	"os"
	"github.com/gin-gonic/gin"
)

func main() {
	app := gin.Default()

	app.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "Auth Service is up and running!",
			"service": "auth-service-go",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	app.Run(":" + port)
}