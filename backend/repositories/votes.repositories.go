package repositories

import (
	"YaskBackend/models"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type VoteRepository struct {
	db *sql.DB
}

func InitVoteRepository(db *sql.DB) *VoteRepository {
	return &VoteRepository{db}
}

func (r *VoteRepository) CreateVote(vote models.Votes) (int, error) {
	query := "INSERT INTO `votes`(`id_user`, `id_post`, `value`) VALUES (?, ?, ?);"

	sqlResult, sqlErr := r.db.Exec(query,
		vote.IdUsers,
		vote.IdPost,
		vote.Vote,
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

func (r *VoteRepository) ReadAll() ([]models.Votes, error) {
	var listVotes []models.Votes
	sqlResult, sqlErr := r.db.Query("SELECT * FROM `votes`;")
	if sqlErr != nil {
		return listVotes, fmt.Errorf(" Erreur récupération vote - Erreur : \n\t %s", sqlErr.Error())
	}

	defer sqlResult.Close()

	for sqlResult.Next() {
		var vote models.Votes
		errScan := sqlResult.Scan(&vote.IdVote, &vote.IdUsers, &vote.IdPost, &vote.Vote)
		if errScan != nil {
			return nil, errScan
		}
		listVotes = append(listVotes, vote)
	}

	return listVotes, nil
}

func (r *VoteRepository) ReadById(id int) (models.Votes, error) {
	var vote models.Votes
	sqlErr := r.db.QueryRow("SELECT * FROM `votes` WHERE `votes`.id = ?;", id).
		Scan(&vote.IdVote, &vote.IdUsers, &vote.IdPost, &vote.Vote)

	if sqlErr != nil {
		if sqlErr == sql.ErrNoRows {
			return models.Votes{}, nil
		}
		return models.Votes{}, fmt.Errorf(" Erreur récupération vote - Erreur : \n\t %s", sqlErr.Error())
	}

	return vote, nil
}

func (r *VoteRepository) UpdateVoteById(vote models.Votes) error {
	query := "UPDATE `votes` SET `IdUsers`=?, `IdPost`=?, `Value`=? WHERE id=?;"

	sqlResult, sqlErr := r.db.Exec(query,
		vote.IdUsers,
		vote.IdPost,
		vote.Vote,
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

func (r *VoteRepository) DeleteVoteById(id int) error {
	sqlResult, sqlErr := r.db.Exec("DELETE FROM `votes` WHERE id=?;", id)
	if sqlErr != nil {
		return fmt.Errorf(" Erreur suppression vote - Erreur : \n\t %s", sqlErr.Error())
	}

	if nbrRow, _ := sqlResult.RowsAffected(); nbrRow <= 0 {
		return fmt.Errorf(" Erreur suppression vote - Aucun vote supprime")
	}

	return nil
}
