package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type PostRepository struct {
	db *sql.DB
}

func InitPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db}
}

func (r *PostRepository) CreatePost(post models.Posts) (int, error) {
	query := "INSERT INTO `posts`(`title`, `content`) VALUES (?, ?);"

	sqlResult, sqlErr := r.db.Exec(query,
		post.Id,
		post.Name,
		post.IdUsers,
		post.IdThreads,
	)

	if sqlErr != nil {
		return -1, fmt.Errorf(" Erreur ajout post - Erreur : \n\t %s", sqlErr.Error())
	}

	id, idErr := sqlResult.LastInsertId()
	if idErr != nil {
		return -1, fmt.Errorf(" Erreur ajout post - Erreur récupération identifiant : \n\t %s", idErr.Error())
	}

	return int(id), nil
}

func (r *PostRepository) ReadAll() ([]models.Posts, error) {
	var listPosts []models.Posts
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `posts`;")
	if sqlErr != nil {
		return listPosts, fmt.Errorf(" Erreur récupération post - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var post models.Posts
		errScan := sqlResult.Scan(&post.Id, &post.Name, &post.IdUsers, &post.IdThreads)
		if errScan != nil {
			return nil, errScan
		}
		listPosts = append(listPosts, post)
	}

	return listPosts, nil
}

func (r *PostRepository) ReadById(id int) (models.Posts, error) {
	var post models.Posts
	sqlErr := r.db.QueryRow("SELECT * FROM `posts` WHERE `posts`.id = ?;", id).
		Scan(&post.Id, &post.Name, &post.IdUsers, &post.IdThreads)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Posts{}, nil
		}
		return models.Posts{}, fmt.Errorf(" Erreur récupération post - Erreur : \n\t %s", sqlErr.Error())
	}

	return post, nil
}

func (r *PostRepository) UpdatePostById(post models.Posts) error {
	query := "UPDATE `posts` SET `Name`=?, `IdUsers`=?, `IdThreads`=? WHERE id=?;"

	sqlResult, sqlErr := r.db.Exec(query,
		post.Name,
		post.IdUsers,
		post.IdThreads,
		post.Id,
	)

	if sqlErr != nil {
		return fmt.Errorf(" Erreur modification post - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur modification post - Aucune ligne modifiée")
	}

	return nil
}

func (r *PostRepository) DeletePostById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `posts` WHERE id=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression post - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression post - Aucun post supprime")
	}

	return nil
}
