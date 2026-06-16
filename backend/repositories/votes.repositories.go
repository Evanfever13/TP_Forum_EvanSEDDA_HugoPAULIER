package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type VotesRepository struct {
	db *sql.DB
}

func InitVotesRepository(db *sql.DB) *VotesRepository {
	return &VotesRepository{db}
}

func (r *VotesRepository) CreateVote(vote models.Votes) (int, error) {
	query := "INSERT INTO `votes`(`id_users`, `id_posts`, `vote`) VALUES (?, ?, ?);"

	sqlResult, sqlErr := r.db.Exec(query,
		vote.IdUsers,
		vote.IdPosts,
		vote.Votes,
	)

	if sqlErr != nil {
		return -1, fmt.Errorf(" Erreur ajout vote - Erreur : \n\t %s", sqlErr.Error())
	}

	id, idErr := sqlResult.LastInsertId()
	if idErr != nil {
		return -1, fmt.Errorf(" Erreur ajout vote - Erreur récupération identifiant : \n\t %s", idErr.Error())
	}

	return int(id), nil
}

func (r *VotesRepository) ReadAll() ([]models.Votes, error) {
	var listVotes []models.Votes
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `votes`;")
	if sqlErr != nil {
		return listVotes, fmt.Errorf(" Erreur récupération vote - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var vote models.Votes
		errScan := sqlResult.Scan(&vote.IdVote, &vote.IdUsers, &vote.IdPosts, &vote.Votes)
		if errScan != nil {
			return nil, errScan
		}
		listVotes = append(listVotes, vote)
	}

	return listVotes, nil
}

func (r *VotesRepository) ReadById(id int) (models.Votes, error) {
	var vote models.Votes
	sqlErr := r.db.QueryRow("SELECT * FROM `votes` WHERE `votes`.id_votes = ?;", id).
		Scan(&vote.IdVote, &vote.IdUsers, &vote.IdPosts, &vote.Votes)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Votes{}, nil
		}
		return models.Votes{}, fmt.Errorf(" Erreur récupération vote - Erreur : \n\t %s", sqlErr.Error())
	}

	return vote, nil
}

func (r *VotesRepository) UpdateVoteById(vote models.Votes) error {
	query := "UPDATE `votes` SET `Id_Users`=?, `Id_Posts`=?, `Vote`=? WHERE id_votes=?;"

	sqlResult, sqlErr := r.db.Exec(query,
		vote.IdUsers,
		vote.IdPosts,
		vote.Votes,
		vote.IdVote,
	)

	if sqlErr != nil {
		return fmt.Errorf(" Erreur modification vote - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur modification vote - Aucune ligne modifiée")
	}

	return nil
}

func (r *VotesRepository) DeleteVoteById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `votes` WHERE id_votes=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression vote - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression vote - Aucun vote supprime")
	}

	return nil
}
