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

func Register(res *gin.Context) {
	var user models.User

	if err := res.ShouldBindJSON(&user); err != nil {
		res.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	if user.Email == "" {
		res.JSON(http.StatusBadRequest, gin.H{
			"error": "Email is required",
		})
		return
	}

	if user.Password == "" {
		res.JSON(http.StatusBadRequest, gin.H{
			"error": "Password is required",
		})
		return
	}

	if len(user.Password) < 6 {
		res.JSON(http.StatusBadRequest, gin.H{
			"error": "Password must be at least 6 characters",
		})
		return
	}

	collection := config.GetCollection("leadflow_auth", "users")

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	// Check Existing User
	var existingUser models.User

	err := collection.
		FindOne(ctx, bson.M{"email": user.Email}).
		Decode(&existingUser)

	if err == nil {
		res.JSON(http.StatusConflict, gin.H{
			"error": "Email already registered",
		})
		return
	}

	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		14,
	)

	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	user.Password = string(hashedPassword)
	user.ID = primitive.NewObjectID()

	// Save User
	_, err = collection.InsertOne(ctx, user)

	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	// Generate JWT
	token, err := utils.GenerateToken(
		user.ID.Hex(),
		config.AppConfig.JWTSecret,
	)

	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})
		return
	}

	// Success Response
	res.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"token":  token,
		"userId": user.ID.Hex(),
	})
}

func Login(res *gin.Context) {
	var input models.LoginInput
	if err := res.ShouldBindJSON(&input); err != nil {
		res.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("leadflow_auth", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		res.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Verify Password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		res.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate JWT
	token, err := utils.GenerateToken(user.ID.Hex(), config.AppConfig.JWTSecret)
	if err != nil {
		res.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	res.JSON(http.StatusOK, gin.H{
		"token":  token,
		"userId": user.ID.Hex(),
	})
}