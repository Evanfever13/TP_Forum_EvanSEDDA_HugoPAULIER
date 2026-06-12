package services

import (
	"YaskBackend/models"
	"YaskBackend/repositories"
	"fmt"
)

type RolesService struct {
	RolesRepository *repositories.RolesRepository
}

func InitRolesService(rolesRepository *repositories.RolesRepository) *RolesService {
	return &RolesService{RolesRepository: rolesRepository}
}

func (s *RolesService) Create(roles models.Roles) (int, error) {
	if roles.Id <= 0 || roles.Name == "" {
		return -1, fmt.Errorf(" Erreur ajout role - Données manquantes ou invalides")
	}

	roleId, roleErr := s.RolesRepository.CreateRoles(roles)
	if roleErr != nil {
		return -1, roleErr
	}

	return roleId, nil
}

func (s *RolesService) ReadAll() ([]models.Roles, error) {
	rolesList, rolesErr := s.RolesRepository.ReadAll()
	if rolesErr != nil {
		return nil, rolesErr
	}

	return rolesList, nil
}

func (s *RolesService) ReadById(idRole int) (models.Roles, error) {
	if idRole <= 0 {
		return models.Roles{}, fmt.Errorf(" Erreur récupération role - identifiant invalide : %d", idRole)
	}

	roles, rolesErr := s.RolesRepository.ReadById(idRole)
	if rolesErr != nil {
		return models.Roles{}, rolesErr
	}

	return roles, nil
}

func (s *RolesService) UpdateById(roles models.Roles) error {
	if roles.Id <= 0 || roles.Name == "" {
		return fmt.Errorf(" Erreur modification role - Donnees manquantes ou invalides")
	}

	return s.RolesRepository.UpdateRoleById(roles)
}

func (s *RolesService) DeleteById(idRole int) error {
	if idRole <= 0 {
		return fmt.Errorf(" Erreur suppression role - identifiant invalide : %d", idRole)
	}

	return s.RolesRepository.DeleteRoleById(idRole)
}
