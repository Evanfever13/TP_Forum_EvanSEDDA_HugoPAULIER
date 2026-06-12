package models

type Threads struct {
	Id int `json:"id_threads"`
	Titre string `json:"titre"`
	IdUsers Users
}