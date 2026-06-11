package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type ThreadRepository struct {
	db *sql.DB
}

func InitThreadRepository(db *sql.DB) *ThreadRepository {
	return &ThreadRepository{db}
}

func (r *ThreadRepository) CreateThread(thread models.Threads) (int, error) {
	query := "INSERT INTO `threads`(`title`, `content`) VALUES (?, ?);"

	sqlResult, sqlErr := r.db.Exec(query,
		thread.Id,
		thread.Titre,
		thread.IdUsers,
	)

	if sqlErr != nil {
		return -1, fmt.Errorf(" Erreur ajout thread - Erreur : \n\t %s", sqlErr.Error())
	}

	id, idErr := sqlResult.LastInsertId()
	if idErr != nil {
		return -1, fmt.Errorf(" Erreur ajout thread - Erreur récupération identifiant : \n\t %s", idErr.Error())
	}

	return int(id), nil
}

func (r *ThreadRepository) ReadAll() ([]models.Threads, error) {
	var listThreads []models.Threads
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `threads`;")
	if sqlErr != nil {
		return listThreads, fmt.Errorf(" Erreur récupération thread - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var thread models.Threads
		errScan := sqlResult.Scan(&thread.Id, &thread.Titre, &thread.IdUsers)
		if errScan != nil {
			return nil, errScan
		}
		listThreads = append(listThreads, thread)
	}

	return listThreads, nil
}

func (r *ThreadRepository) ReadById(id int) (models.Threads, error) {
	var thread models.Threads
	sqlErr := r.db.QueryRow("SELECT * FROM `threads` WHERE `threads`.id = ?;", id).
		Scan(&thread.Id, &thread.Titre, &thread.IdUsers)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Threads{}, nil
		}
		return models.Threads{}, fmt.Errorf(" Erreur récupération thread - Erreur : \n\t %s", sqlErr.Error())
	}

	return thread, nil
}

func (r *ThreadRepository) UpdateThreadById(thread models.Threads) error {
	query := "UPDATE `threads` SET `Titre`=?, `IdUsers`=? WHERE id=?;"

	sqlResult, sqlErr := r.db.Exec(query,		
		thread.Titre,
		thread.IdUsers,
		thread.Id,
	)

	if sqlErr != nil {
		return fmt.Errorf(" Erreur modification thread - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur modification thread		 - Aucune ligne modifiée")
	}

	return nil
}

func (r *ThreadRepository) DeleteThreadById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `threads` WHERE id=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression thread - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression thread - Aucun thread supprime")
	}

	return nil
}
