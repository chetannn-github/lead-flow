package routes

import (
	"github.com/chetannn-github/lead-flow/auth-service/controllers"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/continue", controllers.ContinueAuth)
		
	}
}