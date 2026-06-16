package models

type Posts struct {
	Id	int     `json:"id_posts"`
	Posts	string  `json:"posts"`
	IdUsers int	 `json:"id_users"`
	IdThreads int	 `json:"id_threads"`
}