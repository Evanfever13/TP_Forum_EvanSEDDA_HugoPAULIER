package services

import (
	"YaskBackend/auth"
	"YaskBackend/dto"
	"YaskBackend/models"
	"YaskBackend/repositories"
	"errors"
)

type AuthService struct {
	repository *repositories.UsersRepository
}

func InitAuthService(r *repositories.UsersRepository) *AuthService {
	return &AuthService{repository: r}
}

func (s *AuthService) Get(userId int) (models.Users, error) {
	return s.repository.ReadById(userId)
}

func (s *AuthService) Login(data dto.LoginRequestDto) (*dto.LoginResponseDto, error) {
	if data.Username == "" || data.Password == "" {
		return nil, errors.New("missing username or password")
	}
	user, err := s.repository.ReadByUsername(data.Username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if data.Username != user.Name || user.Password != auth.HashPasswordSHA512(data.Password) {
		return nil, errors.New("Le mot de passe OU le nom d'utilisateur est incorrect")
	}

	role := "user"
	if user.IdRole == 0 {
		role = "admin"
	}

	token, err := auth.GenerateToken(user.Id, role)
	if err != nil {
		return nil, err
	}

	return &dto.LoginResponseDto{
		Type:        "Bearer",
		AccessToken: token,
		ExpiresIn:   90000,
	}, nil

}
