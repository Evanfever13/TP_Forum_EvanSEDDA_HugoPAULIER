package auth

import (
	"YaskBackend/config"
	"YaskBackend/models"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func InitSecret() {
	jwtSecret = []byte(config.GetEnv("JWT_SECRET"))
}

func GenerateToken(userID int, role string) (string, error) {
	now := time.Now()
	claims := models.Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(userID),
			Issuer:    "YaskBackend",
			Audience:  []string{"YaskFrontend"},
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(15 * time.Minute)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
