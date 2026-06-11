package services

import (
	"YaskBackend/models"
	"YaskBackend/repositories"
	"fmt"
)

type VotesService struct {
	VoteRepository *repositories.VoteRepository
}

func InitVotesService(voteRepository *repositories.VoteRepository) *VotesService {
	return &VotesService{VoteRepository: voteRepository}
}

func (s *VotesService) Create(vote models.Votes) (int, error) {
	if vote.IdVote <= 0 || vote.Vote != 1 && vote.Vote != -1 {
		return -1, fmt.Errorf(" Erreur ajout vote - Données manquantes ou invalides")
	}

	voteId, voteErr := s.VoteRepository.CreateVote(vote)
	if voteErr != nil {
		return -1, voteErr
	}

	return voteId, nil
}

func (s *VotesService) ReadAll() ([]models.Votes, error) {
	votesList, votesErr := s.VoteRepository.ReadAll()
	if votesErr != nil {
		return nil, votesErr
	}

	return votesList, nil
}

func (s *VotesService) ReadById(idVote int) (models.Votes, error) {
	if idVote <= 0 {
		return models.Votes{}, fmt.Errorf(" Erreur récupération vote - identifiant invalide : %d", idVote)
	}

	vote, voteErr := s.VoteRepository.ReadById(idVote)
	if voteErr != nil {
		return models.Votes{}, voteErr
	}

	return vote, nil
}

func (s *VotesService) UpdateById(vote models.Votes) error {
	if vote.IdVote <= 0 || vote.Vote != 1 && vote.Vote != -1 {
		return fmt.Errorf(" Erreur modification vote - Donnees manquantes ou invalides")
	}

	return s.VoteRepository.UpdateVoteById(vote)
}

func (s *VotesService) DeleteById(idVote int) error {
	if idVote <= 0 {
		return fmt.Errorf(" Erreur suppression vote - identifiant invalide : %d", idVote)
	}

	return s.VoteRepository.DeleteVoteById(idVote)
}
