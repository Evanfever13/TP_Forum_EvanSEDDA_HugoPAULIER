package models

type Posts struct {
	Id	int     `json:"id_users"`
	Name	string  `json:"name"`
	IdUsers Users
	IdThreads Threads
}