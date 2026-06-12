package controllers

import (
	"YaskBackend/helper"
	"YaskBackend/models"
	"YaskBackend/services"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type VotesControllers struct {
	service *services.VotesService
}

func InitVotesController(service *services.VotesService) *VotesControllers {
	return &VotesControllers{service: service}
}

func readVoteId(r *http.Request) (int, error) {
	return strconv.Atoi(mux.Vars(r)["id"])
}

func (c *VotesControllers) Create(w http.ResponseWriter, r *http.Request) {
	var newVote models.Votes
	if err := json.NewDecoder(r.Body).Decode(&newVote); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}

	voteId, productErr := c.service.Create(newVote)
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	vote, voteErr := c.service.ReadById(voteId)
	if voteErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, voteErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusCreated, vote)
}

func (c *VotesControllers) ReadAll(w http.ResponseWriter, r *http.Request) {
	voteList, voteErr := c.service.ReadAll()
	if voteErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, voteErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, voteList)
}

func (c *VotesControllers) ReadById(w http.ResponseWriter, r *http.Request) {
	idVote, idVoteErr := readVoteId(r)
	if idVoteErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant vote invalide")
		return
	}

	vote, voteErr := c.service.ReadById(idVote)
	if voteErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, voteErr.Error())
		return
	}
	if vote.IdVote == 0 {
		helper.WriteError(w, http.StatusNotFound, "Le vote introuvable")
		return
	}

	helper.WriteJSON(w, http.StatusOK, vote)
}

func (c *VotesControllers) UpdateById(w http.ResponseWriter, r *http.Request) {
	idVote, idVoteErr := readVoteId(r)
	if idVoteErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant vote invalide")
		return
	}

	var vote models.Votes
	if err := json.NewDecoder(r.Body).Decode(&vote); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}
	vote.IdVote = idVote

	voteErr := c.service.UpdateById(vote)
	if voteErr != nil {
		helper.WriteError(w, http.StatusBadRequest, voteErr.Error())
		return
	}

	updatedVote, voteErr := c.service.ReadById(idVote)
	if voteErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, voteErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, updatedVote)
}

func (c *VotesControllers) DeleteById(w http.ResponseWriter, r *http.Request) {
	idVote, idVoteErr := readVoteId(r)
	if idVoteErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant vote invalide")
		return
	}

	voteErr := c.service.DeleteById(idVote)
	if voteErr != nil {
		helper.WriteError(w, http.StatusBadRequest, voteErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "vote supprime",
	})
}
