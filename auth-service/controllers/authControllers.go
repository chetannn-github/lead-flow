package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/chetannn-github/lead-flow/auth-service/config"
	"github.com/chetannn-github/lead-flow/auth-service/models"
	"github.com/chetannn-github/lead-flow/auth-service/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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


func GetMe(res *gin.Context) {

	authHeader := res.GetHeader("Authorization")

	if authHeader == "" {
		res.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Authorization header missing",
		})
		return
	}

	// Bearer TOKEN
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	if tokenString == authHeader {
		res.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid token format",
		})
		return
	}

	// verify jwt
	token, err := jwt.Parse(
		tokenString,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(config.AppConfig.JWTSecret), nil
		},
	)

	if err != nil || !token.Valid {
		res.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid or expired token",
		})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		res.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid token claims",
		})
		return
	}

	userId, ok := claims["userId"].(string)

	if !ok {
		res.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid userId in token",
		})
		return
	}

	objectId, err := primitive.ObjectIDFromHex(userId)

	if err != nil {
		res.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid user id",
		})
		return
	}

	collection := config.GetCollection(
		"leadflow_auth",
		"users",
	)

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)

	defer cancel()

	var user models.User

	err = collection.FindOne(
		ctx,
		bson.M{"_id": objectId},
	).Decode(&user)

	if err != nil {
		res.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User not found",
		})
		return
	}

	res.JSON(http.StatusOK, gin.H{
		"success": true,
		"user": gin.H{
			"id":    user.ID.Hex(),
			"email": user.Email,
		},
	})
}