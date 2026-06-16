package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type PostsRepository struct {
	db *sql.DB
}

func InitPostsRepository(db *sql.DB) *PostsRepository {
	return &PostsRepository{db}
}

func (r *PostsRepository) CreatePost(post models.Posts) (int, error) {
	query := "INSERT INTO `posts`( `posts`, `id_users`, `id_threads`) VALUES (?, ?, ?);"

	sqlResult, sqlErr := r.db.Exec(query,
		post.Posts,
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

func (r *PostsRepository) ReadAll() ([]models.Posts, error) {
	var listPosts []models.Posts
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `posts`;")
	if sqlErr != nil {
		return listPosts, fmt.Errorf(" Erreur récupération post - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var post models.Posts
		errScan := sqlResult.Scan(&post.Id, &post.Posts, &post.IdUsers, &post.IdThreads)
		if errScan != nil {
			return nil, errScan
		}
		listPosts = append(listPosts, post)
	}

	return listPosts, nil
}

func (r *PostsRepository) ReadById(id int) (models.Posts, error) {
	var post models.Posts
	sqlErr := r.db.QueryRow("SELECT * FROM `posts` WHERE `posts`.id_posts = ?;", id).
		Scan(&post.Id, &post.Posts, &post.IdUsers, &post.IdThreads)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Posts{}, nil
		}
		return models.Posts{}, fmt.Errorf(" Erreur récupération post - Erreur : \n\t %s", sqlErr.Error())
	}

	return post, nil
}

func (r *PostsRepository) UpdatePostById(post models.Posts) error {
	query := "UPDATE `posts` SET `Posts`=?, `Id_Users`=?, `Id_Threads`=? WHERE id_posts=?;"

	sqlResult, sqlErr := r.db.Exec(query,
		post.Posts,
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

func (r *PostsRepository) DeletePostById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `posts` WHERE id_posts=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression post - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression post - Aucun post supprime")
	}

	return nil
}
