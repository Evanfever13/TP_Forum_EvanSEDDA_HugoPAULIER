package models

type Votes struct {
	IdVote	int     `json:"id_votes"`
	IdUsers	int     `json:"id_users"`
	IdPosts	int     `json:"id_posts"`
	Votes	bool     `json:"vote"`
}