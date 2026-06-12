package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type RolesRepository struct {
	db *sql.DB
}

func InitRolesRepository(db *sql.DB) *RolesRepository {
	return &RolesRepository{db}
}

func (r *RolesRepository) CreateRoles(roles models.Roles) (int, error) {
	query := "INSERT INTO `roles`(`name`) VALUES (?);"

	sqlResult, sqlErr := r.db.Exec(query,
		roles.Name,
	)

	if sqlErr != nil {
		return -1, fmt.Errorf(" Erreur ajout role - Erreur : \n\t %s", sqlErr.Error())
	}

	id, idErr := sqlResult.LastInsertId()
	if idErr != nil {
		return -1, fmt.Errorf(" Erreur ajout role - Erreur récupération identifiant : \n\t %s", idErr.Error())
	}

	return int(id), nil
}

func (r *RolesRepository) ReadAll() ([]models.Roles, error) {
	var listRoles []models.Roles
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `roles`;")
	if sqlErr != nil {
		return listRoles, fmt.Errorf(" Erreur récupération role - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var roles models.Roles
		errScan := sqlResult.Scan(&roles.Id, &roles.Name)
		if errScan != nil {
			return nil, errScan
		}
		listRoles = append(listRoles, roles)
	}

	return listRoles, nil
}

func (r *RolesRepository) ReadById(id int) (models.Roles, error) {
	var roles models.Roles
	sqlErr := r.db.QueryRow("SELECT * FROM `roles` WHERE `roles`.id = ?;", id).
		Scan(&roles.Id, &roles.Name)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Roles{}, nil
		}
		return models.Roles{}, fmt.Errorf(" Erreur récupération role - Erreur : \n\t %s", sqlErr.Error())
	}

	return roles, nil
}

func (r *RolesRepository) UpdateRoleById(roles models.Roles) error {
	query := "UPDATE `roles` SET `Name`=? WHERE id=?;"

	sqlResult, sqlErr := r.db.Exec(query,
		roles.Name,
		roles.Id,
	)

	if sqlErr != nil {
		return fmt.Errorf(" Erreur modification role - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur modification role - Aucune ligne modifiée")
	}

	return nil
}

func (r *RolesRepository) DeleteRoleById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `roles` WHERE id=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression role - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression role - Aucun role supprime")
	}

	return nil
}
