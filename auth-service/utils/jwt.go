package utils

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userId string, secret string) (string, error) {
	claims := jwt.MapClaims{
		"userId": userId,
		"exp":    time.Now().Add(time.Hour * 24).Unix(), // 24 hours validity
		"iat":    time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}