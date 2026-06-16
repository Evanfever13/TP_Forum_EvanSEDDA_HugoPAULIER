package services

import (
	"errors"
	"YaskBackend/auth"
	"YaskBackend/dto"
)

type AuthService struct {
}

func InitAuthService() *AuthService {
	return &AuthService{}
}

func (s *AuthService) Login(data dto.LoginRequestDto) (*dto.LoginResponseDto, error) {
    //@audit Avec BDD ?
	mockUserID := "1"
	mockUsername := "admin"
	mockPassword := "password"
	mockRole := "admin"

	if data.Username != mockUsername || data.Password != mockPassword {
		return nil, errors.New("invalid credentials")
	}	

	token, err := auth.GenerateToken(mockUserID, mockRole)
	if err != nil {
		return nil, err
	}

	return &dto.LoginResponseDto{
		Type:        "Bearer",
		AccessToken: token,
		ExpiresIn:   900,
	}, nil
}
