package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/chetannn-github/lead-flow/auth-service/config"
	"github.com/chetannn-github/lead-flow/auth-service/models"
	"github.com/chetannn-github/lead-flow/auth-service/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func ContinueAuth(res *gin.Context) {
	var input models.LoginInput

	if err := res.ShouldBindJSON(&input); err != nil {
		res.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request body",
		})
		return
	}

	// validations
	if input.Email == "" {
		res.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Email is required",
		})
		return
	}

	if input.Password == "" {
		res.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Password is required",
		})
		return
	}

	if len(input.Password) < 6 {
		res.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Password must be at least 6 characters",
		})
		return
	}

	collection := config.GetCollection("leadflow_auth", "users")

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	// check existing user
	var user models.User

	err := collection.
		FindOne(ctx, bson.M{"email": input.Email}).
		Decode(&user)

	// ====================================
	// USER EXISTS => LOGIN
	// ====================================
	if err == nil {

		// verify password
		err = bcrypt.CompareHashAndPassword(
			[]byte(user.Password),
			[]byte(input.Password),
		)

		if err != nil {
			res.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid email or password",
			})
			return
		}

		// generate jwt
		token, err := utils.GenerateToken(
			user.ID.Hex(),
			config.AppConfig.JWTSecret,
		)

		if err != nil {
			res.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to generate token",
			})
			return
		}

		res.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Welcome back 👋 Logged in successfully",
			"type":    "login",
			"token":   token,
			"userId":  user.ID.Hex(),
			"user": gin.H{
				"id":    user.ID.Hex(),
				"email": user.Email,
			},
		})

		return
	}

	// ====================================
	// USER DOESN'T EXIST => SIGNUP
	// ====================================

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(input.Password),
		14,
	)

	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to hash password",
		})
		return
	}

	newUser := models.User{
		ID:       primitive.NewObjectID(),
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	_, err = collection.InsertOne(ctx, newUser)

	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create user",
		})
		return
	}

	// generate jwt
	token, err := utils.GenerateToken(
		newUser.ID.Hex(),
		config.AppConfig.JWTSecret,
	)

	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to generate token",
		})
		return
	}

	res.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Account created successfully 🎉",
		"type":    "signup",
		"token":   token,
		"userId":  newUser.ID.Hex(),
		"user": gin.H{
			"id":    newUser.ID.Hex(),
			"email": newUser.Email,
		},
	})
}