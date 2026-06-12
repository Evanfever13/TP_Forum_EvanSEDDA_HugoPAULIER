package models

type Votes struct {
	IdVote	int     `json:"id_vote"`
	IdUsers	int     `json:"id_users"`
	IdPost	int     `json:"id_post"`
	Vote	int     `json:"vote"`
}