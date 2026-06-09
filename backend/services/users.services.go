package services

import (
	"YaskBackend/models"
	"YaskBackend/repositories"
	"fmt"
)

type UsersService struct {
	UsersRepository *repositories.UsersRepository
}

func InitUsersService(usersRepository *repositories.UsersRepository) *UsersService {
	return &UsersService{UsersRepository: usersRepository}
}

func (s *UsersService) Create(users models.Users) (int, error) {
	if users.Id <= 0 || users.Name == "" || users.Email == "" || users.Password == "" || users.DateCreation == 0 || users.IdRole == "" {
		return -1, fmt.Errorf(" Erreur ajout utilisateur - Données manquantes ou invalides")
	}

	userId, userErr := s.UsersRepository.CreateUsers(users)
	if userErr != nil {
		return -1, userErr
	}

	return userId, nil
}

func (s *UsersService) ReadAll() ([]models.Users, error) {
	usersList, usersErr := s.UsersRepository.ReadAll()
	if usersErr != nil {
		return nil, usersErr
	}

	return usersList, nil
}

func (s *UsersService) ReadById(idUser int) (models.Users, error) {
	if idUser <= 0 {
		return models.Users{}, fmt.Errorf(" Erreur récupération utilisateur - identifiant invalide : %d", idUser)
	}

	users, usersErr := s.UsersRepository.ReadById(idUser)
	if usersErr != nil {
		return models.Users{}, usersErr
	}

	return users, nil
}

func (s *UsersService) UpdateById(users models.Users) error {
	if users.Id <= 0 || users.Name == "" || users.Email == "" || users.Password == "" || users.DateCreation == 0 || users.IdRole == "" {
		return fmt.Errorf(" Erreur modification utilisateur - Donnees manquantes ou invalides")
	}

	return s.UsersRepository.UpdateProductById(users)
}

func (s *UsersService) DeleteById(idUser int) error {
	if idUser <= 0 {
		return fmt.Errorf(" Erreur suppression utilisateur - identifiant invalide : %d", idUser)
	}

	return s.UsersRepository.DeleteProductById(idUser)
}
