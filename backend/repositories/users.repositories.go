package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type UsersRepository struct {
	db *sql.DB
}

func InitUsersRepository(db *sql.DB) *UsersRepository {
	return &UsersRepository{db}
}

func (r *UsersRepository) CreateUsers(users models.Users) (int, error) {
	query := "INSERT INTO `users`(`name`, `email`, `password`, `date_creation`, `id_role`) VALUES (?,?,?,?,?);"

	sqlResult, sqlErr := r.db.Exec(query,
		users.Name,
		users.Email,
		users.Password,
		time.Now().Format("2006-01-02 15:04:05"),
		users.IdRole,
	)

	if sqlErr != nil {
		return -1, fmt.Errorf(" Erreur ajout utilisateur - Erreur : \n\t %s", sqlErr.Error())
	}

	id, idErr := sqlResult.LastInsertId()
	if idErr != nil {
		return -1, fmt.Errorf(" Erreur ajout utilisateur - Erreur récupération identifiant : \n\t %s", idErr.Error())
	}

	return int(id), nil
}

func (r *UsersRepository) ReadAll() ([]models.Users, error) {
	var listUsers []models.Users
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `users`;")
	if sqlErr != nil {
		return listUsers, fmt.Errorf(" Erreur récupération utilisateur - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var users models.Users
		errScan := sqlResult.Scan(&users.Id, &users.Name, &users.Email, &users.Password, &users.DateCreation, &users.IdRole)
		if errScan != nil {
			return nil, errScan
		}
		listUsers = append(listUsers, users)
	}

	return listUsers, nil
}

func (r *UsersRepository) ReadById(id int) (models.Users, error) {
	var users models.Users
	sqlErr := r.db.QueryRow("SELECT * FROM `users` WHERE `users`.id = ?;", id).
		Scan(&users.Id, &users.Name, &users.Email, &users.Password, &users.DateCreation, &users.IdRole)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Users{}, nil
		}
		return models.Users{}, fmt.Errorf(" Erreur récupération utilisateur - Erreur : \n\t %s", sqlErr.Error())
	}

	return users, nil
}

func (r *UsersRepository) UpdateProductById(users models.Users) error {
	query := "UPDATE `users` SET `Name`=?,`Email`=?,`Password`=?,`DateCreation`=?, `IdRole`=? WHERE id=?;"

	sqlResult, sqlErr := r.db.Exec(query,
		users.Name,
		users.Email,
		users.Password,
		users.DateCreation,
		users.IdRole,
		users.Id,
	)

	if sqlErr != nil {
		return fmt.Errorf(" Erreur modification utlisateur - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur modification utlisateur - Aucune ligne modifiée")
	}

	return nil
}

func (r UsersRepository) DeleteProductById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `users` WHERE id=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression utlisateur - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression utlisateur - Aucun utlisateur supprime")
	}

	return nil
}
